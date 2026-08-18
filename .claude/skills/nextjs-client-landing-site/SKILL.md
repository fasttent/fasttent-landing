---
name: nextjs-client-landing-site
description: How to build and maintain a Next.js + Tailwind marketing/landing site for a non-technical client through many small rounds of visual-feedback-driven edits, without accumulating rework. Distilled from the Fast Tent project (a Ukrainian PVC-goods manufacturer's site) across dozens of iteration rounds — content architecture, git workflow, CSS/Tailwind traps that silently do nothing, SVG logo handling, Lighthouse/Vercel performance investigation, and how to run the collaboration loop itself. Use this whenever building or iterating on a client-facing Next.js landing site with a content.ts-style content layer, when a client is giving pixel-level visual feedback round after round, when debugging why a Tailwind hover/variant class "does nothing," when investigating Lighthouse findings on a Vercel deployment, or when git branch/merge safety matters (staging → main workflow). Also load this before touching partner/client logos as SVG assets, before adding cookie-consent or geo-detection logic, or before chasing a Cache-Control/bfcache issue on Vercel.
---

# Building a Next.js client landing site with minimal rework

This skill distills what actually caused wasted rounds — and what prevented them — across an extended real engagement (Fast Tent, a PVC-goods manufacturer's marketing site: Next.js 16 App Router, Tailwind 3, Vercel). The client was visual and iterative: she'd look at a screenshot or the live site, describe what's wrong in plain language, and expect a precise fix — not a redesign. Treat every section below as something that cost real back-and-forth to learn.

## The core loop this whole skill optimizes for

1. Client describes a problem, often from a screenshot, often imprecisely ("не гармонійно", "додай повітря", "зроби рівно").
2. You form a hypothesis about *why* it looks wrong — not just *what* to change.
3. You make the fix, then **verify it actually did what you think** before saying it's done — screenshots often don't render in constrained environments, so use measurement (`getBoundingClientRect`), compiled-output inspection, or curl, not just "the class looks right."
4. You build (`npm run build`) before ever pushing.
5. You push to `staging` only, and say so explicitly. You merge to `main` only when asked, in a separate explicit step.
6. If the client says a claimed fix "did nothing" or "still not right," **your first move is to verify what actually shipped**, not to explain why your reasoning was sound. It usually shipped correctly but didn't do what was assumed (see references/technical-pitfalls.md) — or, occasionally, you really did make a mistake (wrong branch, stale measurement). Find out which before responding.

## Content architecture: one file, no exceptions

Every visible string lives in `content.ts` (or equivalent), organized by section, exported as typed objects/arrays (`export const contactsSection = {...}`). Components only reference `content.field`, never inline text. This was a hard requirement from day one and paid off every single round: text edits, reordering, and re-labeling never touched component logic, so they were always low-risk, single-file diffs.

When adding a new field (a new href, a new label), add it next to its siblings in the same object — don't create a parallel lookup structure. When an object needs an image plus metadata (partner logos: name, href, filename, display width class, whether to force-monochrome, intrinsic pixel dimensions), keep it as one array of objects, one partner per line, so it reads like a table and stays diffable.

## Git workflow: the mistake that actually happened

**Before every commit, run `git branch --show-current`.** Not "usually" — every time, no exceptions. Mid-engagement, a commit meant for `staging` landed directly on `main` because the branch had been left on `main` from an earlier step and `git push origin staging` was run without rechecking — that command silently pushed the *unchanged* `staging` ref (no-op) while leaving the real commit stuck, unpushed, on local `main`. The client caught it by comparing the Vercel dashboard, not because anything errored. Nothing in git complains when you commit on the wrong branch; the only guard is checking first.

The standing rules, unless the client says otherwise for a specific request:
- Work happens on `staging`. Commit and push there.
- Report what shipped; do **not** merge to `main` unless explicitly asked, even if you're confident the change is safe.
- When asked to merge: `git checkout main && git merge staging --no-edit && git push origin main && git checkout staging` (fast-forward is normal here since staging is always ahead). Push `main` **explicitly** — don't assume a `staging` push touched it.
- Never commit/push without the client's go-ahead for that round, even after several consecutive "so push" requests — each one is its own permission, not a standing rule (though if the client explicitly says "stop asking permission, just do the task," that licenses skipping the *confirmation pause*, not the branch discipline).
- If you discover a stray, unpushed local commit on the wrong branch: push it to where it actually belongs (`git push origin main` explicitly), explain plainly what happened, and don't paper over it.

## Verify, don't assume — every visual/behavioral claim needs evidence

Before claiming a fix works, get real evidence:
- **Run `npm run build`.** It catches TypeScript and import errors a dev server won't.
- **For layout/alignment claims**, measure with `getBoundingClientRect()` in the browser via `javascript_tool`, comparing exact coordinates across the elements involved — don't eyeball a screenshot. See `references/technical-pitfalls.md` for the exact measurement recipe (it has real gotchas: `getBBox()` returns empty, cached fetches return stale data, `requestAnimationFrame` never fires — all specific to a backgrounded/hidden browser pane).
- **For CSS behavior claims (especially hover/variant states)**, check the *compiled* CSS output for the actual selector, not just that the class name is spelled right in JSX. See the hover-bug case study in `references/technical-pitfalls.md` — an entire site's `hover:` states silently did nothing for a long stretch because of exactly this gap.
- **For "is this really our code" questions during a performance audit**, grep the actual built chunk for identifying strings before proposing to change or split it. See `references/lighthouse-playbook.md`.
- When you can't get a screenshot (hidden/backgrounded browser panes often can't composite frames), say so plainly and use `curl`/DOM measurement instead of guessing, or ask the client to look and describe what they see.

## CSS/Tailwind traps worth knowing before you hit them

Full detail and code in `references/technical-pitfalls.md`. Headlines:
- A custom CSS class defined as raw CSS (`.text-signal { color: var(--signal) }`) outside Tailwind's utility layer will **not** get a working `hover:`/`group-hover:` variant — Tailwind's JIT can't generate a selector for a utility it doesn't recognize, and it fails *silently* (no error, no visual effect). Use the arbitrary-value form instead: `hover:text-[var(--signal)]`. If you inherit a design system with custom color classes, audit every `hover:custom-class` / `group-hover:custom-class` usage before assuming any of them work.
- `flex flex-wrap` is not a grid. Items pack left-to-right by cumulative width, so on wrap it produces uneven, ragged rows/columns whenever items have different widths (e.g. a row of partner logos). If the client says a wrapped row "looks uneven" or "not quite a grid," the fix is a real CSS Grid with shared column tracks (`grid-cols-[repeat(N,max-content)]` or a fixed `grid-cols-N`), not more `gap` tweaking.
- When aligning two separate rows to the same columns (e.g. buttons above, links below), a single shared offset only fixes the *first* item — items 2+ drift because the elements above have different widths. Put both rows' items into **one shared grid** so columns are genuinely shared, or you'll "fix" it three times before it's actually fixed.
- Don't stack a flex/grid `gap` *and* a decorative element's own margin for the same visual spacing — they add together asymmetrically. Pick one mechanism (usually the element's own margin, so it also works outside a flex/grid context) and drop the other.

## SVG logo assets: the client-provided-messy-HTML pipeline

Clients often paste a whole scraped `<li><a><svg>...` blob copied from a partner's website navbar, not a clean logo file. Full recipe in `references/technical-pitfalls.md`; short version: strip everything down to the bare `<svg viewBox=... >` + `<path>`/`<polygon>` data (delete framework wrapper markup, data-react-* attributes, unrelated sibling text unless the client specifically wants it folded in), apply the site's existing monochrome/opacity treatment for consistency, and **measure, don't guess**, when combining an icon with a text label (spacing, vertical centering, tight-fit viewBox) — use the `getBoundingClientRect` recipe in the reference file. Expect 3-4 rounds of "bigger / smaller / centered / now they're touching" on any hand-assembled icon+text logo — that's normal, not a sign you did it wrong; each round is cheap if you re-measure instead of re-guessing.

## Performance and Lighthouse: investigate before you "optimize"

Full playbook in `references/lighthouse-playbook.md`. The single most important habit: **before code-splitting, deleting, or "fixing" anything a performance audit flags, identify what's actually in it.** `grep` the built chunk for identifying strings (library names, function names, framework internals) rather than assuming a large "unused JS" chunk is dead application code. In this project, the two largest flagged chunks across multiple audit rounds were React/ReactDOM + polyfills and Next.js's own App Router client runtime — framework code that can't be split without breaking interactivity, not anything in the app. A later round hypothesized a chunk contained cookie-consent logic based on a `data-deployment-id` string; grepping the actual code showed it was Next.js's own deployment-skew-protection mechanism (`getDeploymentId()`), unrelated to consent — confirmed instead of guessed, in about two minutes, avoiding a wasted "protect the consent logic" detour.

Also in that reference file: why `experimental.optimizeCss` was tested and reverted (byte-identical output under Turbopack — a no-op, not a fix); why Cache-Control/bfcache stayed broken even after a middleware fix that tested fine locally (Vercel's actual runtime overwrites it after a `headers()`-dependent dynamic route renders, in a way `next start` doesn't reproduce — confirmed by shipping a diagnostic response header to real production, not by re-reading the code harder); and why Partial Prerendering was evaluated and explicitly rejected for this project (it streams the dynamic island *after* the static shell, which breaks the "consent default must execute before any tag manager fires" guarantee that server-side geo-detection exists to provide) — a genuine architecture constraint, not laziness, worth restating if a future round is tempted to revisit it.

## Vercel-specific gotchas

- **Deployment Protection (SSO)** blocks anonymous requests to preview-branch URLs and to individual deployment-hash URLs, but not to the primary `<project>.vercel.app` domain when it's aliased to the current production deployment. If a `curl` check unexpectedly 302s to `vercel.com/sso-api`, that's this, not a broken app — check headers against a URL you know is unprotected before concluding anything about the app itself.
- `middleware.ts` is a deprecated file convention as of Next.js 16 (renamed to `proxy.ts`, exported function renamed `middleware` → `proxy`; there's an official codemod). Even setting that aside, don't trust that a middleware/proxy header override that tests correctly via `next start` will behave identically on Vercel's actual runtime for `headers()`-dependent dynamic routes — verify on the real deployment (a temporary diagnostic response header is a fast, safe way to prove whether your code is even executing before debugging further).
- Static assets under `/public` typically get `Cache-Control: immutable, max-age=1year`-style headers — when re-testing an asset you just edited, cache-bust the URL (`?v=` + random) or you'll silently measure the old file and draw the wrong conclusion.

## How to work with a visual, non-technical, iteration-driven client

- Feedback usually arrives as a screenshot plus a short, sometimes ambiguous description. Read the screenshot first, form a concrete hypothesis (which pixels, which element, what's actually different from what she pictures), and if genuinely ambiguous, ask — but usually the screenshot resolves it.
- She will correct misreadings of her own instructions immediately and directly ("не туди", "не так зрозумів") — that's normal, not a sign to get defensive. Re-read what she actually asked, fix precisely that, and don't expand scope while you're at it.
- Decisions she's explicitly closed (a contrast/color choice, "not PPR", "don't touch GTM's known duplicate tag") stay closed. Don't re-raise them because a new audit tool flags them again — note that it's the same known, already-decided issue, and move on.
- She reads git history and the Vercel dashboard, and will catch a branch mistake or a stale deploy before you do — take that seriously and verify branch/deploy state rather than assuming your last action was correct.
- She has explicitly asked at different points for both "stop asking permission, just execute" and reaffirmed "never commit/push without asking" — these aren't contradictory: she wants technical decisions and investigation to proceed without a confirmation pause at every step, while git actions that ship to a real audience keep an explicit gate. When unsure which regime is active, keep the git gate and drop the rest.
- She has asked for token economy repeatedly — keep responses tight, avoid narrating process, show the result and the evidence for it.

## Pre-flight checklist before you consider a round "done"

- [ ] Ran `git branch --show-current` before staging/committing
- [ ] `npm run build` is clean
- [ ] Any hover/interactive-state claim checked against compiled CSS or measured DOM, not just the JSX class name
- [ ] Any alignment/spacing claim measured with `getBoundingClientRect`, not eyeballed
- [ ] Pushed to `staging` only, unless merge to `main` was explicitly requested this round
- [ ] Nothing touched that was previously marked closed/do-not-touch, unless this round explicitly reopens it
- [ ] Report is concrete: what changed, what you verified and how, what (if anything) still needs the client's own eyes because you couldn't render it yourself
