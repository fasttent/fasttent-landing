# Lighthouse / Vercel performance investigation playbook

Read this before touching anything a Lighthouse report flags. The recurring failure mode across this project's audit rounds was treating "Lighthouse flagged it" as equivalent to "this is our code and it's dead" — usually it's framework code, third-party code, or a genuine architectural trade-off, and the fix is confirming which before acting, not code-splitting on instinct.

## Step 0: identify what's actually in a flagged chunk before proposing anything

Never code-split, delete, or restructure based on a chunk's *size* and *audit category* alone. Identify its actual contents first:

```bash
# find the chunk by matching the gzip size Lighthouse reported (chunk hashes differ
# between your local build and the deployed one, but sizes are a reliable fingerprint)
for f in .next/static/chunks/*.js; do
  echo "$(gzip -c "$f" | wc -c) $f"
done | sort -rn | head -10

# then grep the candidate for identifying strings
grep -o "createRoot\|hydrateRoot\|getDeploymentId\|useSyncExternalStore\|Symbol.for(\"react\." .next/static/chunks/CANDIDATE.js
```

In this project, across multiple rounds, the two largest recurring "unused JS" / "legacy JS" / "forced reflow" chunks turned out to be:
- **React + ReactDOM + the site's legacy-browser polyfills** (`Array.prototype.at/.flat/.flatMap`, `Object.fromEntries/.hasOwn`, `String.prototype.trimStart/trimEnd`) — confirmed by finding `createRoot`, `hydrateRoot`, and `Symbol.for("react.*")` markers at the top of the file, literally adjacent to the polyfill code. This is framework code; you cannot code-split React itself out of a page that needs any client interactivity, and the polyfills are a deliberate legacy-device-support decision (don't remove without a fresh, explicit request — re-litigating this every audit round wastes everyone's time).
- **Next.js's own App Router client runtime** (RSC navigation/fetch dispatcher) — confirmed by finding `callServer`, `startTransition`, and (in a later round) `getDeploymentId()` / `x-deployment-id` / `x-nextjs-deployment-id` strings, which are Next.js's **deployment-skew-protection mechanism** for Vercel deploys, not anything application-specific. A later audit round hypothesized this chunk contained the site's cookie-consent/geo-detection logic (reasonable guess — the "unused" percentage looked like it could be consent code that just didn't fire for a non-EEA test IP); grepping for the actual suspected string (`data-cookie-opt-in`) found **zero matches anywhere in the build output or in `node_modules`**, while `deployment-id` traced unambiguously to Next's own `getDeploymentId()` call. Confirmed, not assumed, in about two minutes — avoided both a wasted "protect this as consent logic" detour and a wasted "let's code-split this" detour.

The "unused" percentage on framework chunks is expected and mostly not fixable: a framework bundle contains code paths for features the current page doesn't happen to exercise, and browsers/Next don't tree-shake per-page at that granularity.

## Step 1: separate "our component code" from "framework/third-party code" before proposing a fix

- **Third-party tags (GTM, Google Ads, etc.):** if the client has an established, intentional configuration (e.g., a deliberately duplicated conversion tag matching a previous site's behavior, on record as a conscious decision), don't propose fixing it because an audit flags it — restate that it's the known, accepted thing and move on. Same for "Attribution Reporting deprecated" warnings originating from GTM's own injected script — nothing on your side to change.
- **Legitimate first-party UI code that shows up in minor findings** (a few ms of forced reflow from a scroll handler, a header-scroll-class toggler) — usually not worth touching unless it's actually large; note it, don't chase single-digit-millisecond findings.

## Step 2: render-blocking CSS — know what's actually available before reaching for something drastic

- Check whether `experimental.optimizeCss` (Turbopack's critical-CSS extraction) is even doing anything under your bundler before trusting it: enable it, rebuild, and diff the actual `<link rel="stylesheet">` output and file hashes against the baseline. In this project, on Next 16.3 + Turbopack, it built without error but produced **byte-identical output** — a currently-inert flag, not a working optimization. Revert rather than keep a flag that adds "experimental, use with caution" risk for zero measured benefit.
- If your project has already rejected Partial Prerendering (PPR) for an architectural reason (see below), don't propose a CSS-splitting approach that would require streaming any part of the page separately — that's the same trade-off in different clothing. Any CSS-delivery change that could affect *when* something in `<head>` executes relative to a consent/analytics script needs the same scrutiny as a PPR proposal.

## Step 3: bfcache / `Cache-Control: no-store` on a `headers()`-dependent dynamic route

If a route reads `headers()` (or `cookies()`) synchronously to render (e.g. server-side geo-detection for a consent banner), Next.js marks it fully dynamic and, in this project's experience, **force-sets `Cache-Control: no-store`** on the response — and on Vercel's actual production runtime, this happens in a way that a `middleware.ts`/`proxy.ts` response-header override does **not** reliably beat, even though the same override tests correctly under local `next start`.

How this was actually confirmed (don't just re-read the code harder — ship a probe):
1. Added a proxy/middleware that both sets a custom `Cache-Control` value **and** a throwaway diagnostic header (`x-proxy-hit: 1`).
2. Deployed to real production, curled the live URL.
3. The diagnostic header **was present** (proxy genuinely executes on Vercel) but `Cache-Control` still showed the full `no-store` value Next computes internally — meaning something in Next's render pipeline overwrites it *after* the proxy runs, specifically on Vercel's runtime, not reproducible via `next start`.

**Conclusion for this class of problem:** if the client wants server-side dynamic content-personalization based on request headers, accept that you lose static caching / bfcache for that route — there isn't a safe workaround that doesn't touch the dynamic-rendering guarantee itself. Document this once as an accepted trade-off and stop re-investigating it every audit round unless something *material* changes (e.g. a future Next.js version explicitly documents a supported override path).

Related smaller finding: `Deployment Protection` (SSO) on Vercel blocks anonymous curl access to preview-branch URLs and to individual deployment-hash URLs, but *not* to the primary `<project>.vercel.app` alias when it currently points at production — if you're trying to verify a header and get a `302` to `vercel.com/sso-api`, that's this, not your app; retarget your check at a URL you know isn't gated (or ask for a Protection Bypass token if you need automated tools to check regularly).

## Step 4: Partial Prerendering (PPR) — when to reject it outright

If the page has a dynamic island whose *execution order relative to a third-party script* matters for correctness (the canonical case: a consent-default script that must run before a tag manager evaluates any tags, for GDPR-style compliance with EEA visitors), PPR is very likely wrong for that island, and this is worth stating plainly rather than re-evaluating every time performance work comes up:

PPR/Cache Components stream the dynamic part of the page in a *separate chunk after* the static shell. That's exactly backwards from what a "must execute before anything else" guarantee needs — the whole reason to compute something server-side via `headers()` synchronously in the first place is to guarantee it's part of the very first, synchronous response. Moving it into a streamed island reintroduces the race condition (a third-party tag could fire before the deferred consent-default arrives) that server-side detection existed to prevent.

If asked to reconsider, the right response is a fresh, explicit architecture conversation — not a unilateral re-adoption because a Lighthouse score would improve.

## Reporting pattern for these findings

When you report back on a performance round, separate cleanly:
- **Fixed** (with before/after evidence — file size, a compiled-CSS check, a measured header value)
- **Investigated, confirmed not our code / not fixable without a trade-off the client already rejected** (with the specific grep/string evidence, not just "I believe this is framework code")
- **Untouched by explicit instruction** (contrast decision, GTM duplicate tag, legacy polyfills, PPR)

This keeps the client able to trust "not touched" as meaning "deliberately, for a stated reason," not "forgotten."
