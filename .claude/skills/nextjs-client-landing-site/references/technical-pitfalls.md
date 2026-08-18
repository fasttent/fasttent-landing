# Technical pitfalls — case studies with code

Read this when you're about to touch hover states, alignment across elements, or hand-assemble an SVG logo. Every case here actually happened and cost at least one extra round before it was root-caused properly.

## 1. Raw CSS classes silently break Tailwind's `hover:`/`group-hover:` variants

**Symptom:** a hover effect that's supposed to change a color does *nothing* — no console error, no visual change, class is spelled correctly in the JSX.

**Root cause:** if a color utility is hand-written as plain CSS outside Tailwind's utility layer —

```css
/* globals.css, NOT inside @layer utilities */
.text-signal { color: var(--signal); }
```

— Tailwind's JIT compiler doesn't know `text-signal` is a utility it should generate variants for. When you write `hover:text-signal` in JSX, Tailwind's scanner sees an unrecognized utility candidate and just... doesn't emit anything for it. No warning. The base (non-hover) `.text-signal` rule still works fine because that's plain CSS you wrote yourself, which is exactly what makes this so easy to miss — the *element* has the right color, just never on hover.

In this project, `hover:text-signal` had been copy-pasted into **10 different places** across the site (header phone link, mobile menu items, catalog card titles via `group-hover:`, five spots in the contacts section) before anyone noticed none of them worked. Confirmed by grepping the actual compiled CSS output for the literal escaped selector:

```bash
grep -o "hover\\\\:text-signal[^}]*}" .next/static/chunks/*.css
# zero matches, despite 10 usages in source
```

**Fix:** use Tailwind's arbitrary-value syntax, which the JIT *does* know how to variant-ize because it recognizes the `text-[...]` pattern itself, regardless of what's inside the brackets:

```diff
-hover:text-signal
+hover:text-[var(--signal)]
-group-hover:text-signal
+group-hover:text-[var(--signal)]
```

**Verification pattern** — don't just fix and move on, confirm the rule actually compiled:

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('.next/static/chunks/YOUR_CSS_FILE.css', 'utf8');
console.log(css.includes('hover\\\\:text-\\\\[var\\\\(--signal\\\\)\\\\]'));
"
```
(Do this in a real `.js` file, not `bash -c` with inline `-e` — the multi-layer backslash escaping between bash and node string literals is a losing battle inline; write a tiny throwaway script instead.)

**Broader lesson:** any time a design system has hand-rolled custom "utility-like" classes (`.text-brand`, `.bg-accent`, etc.) defined as plain CSS rather than via Tailwind's theme/plugin system, treat every `hover:`/`group-hover:`/`focus:`-prefixed usage of them as unverified until you've checked the compiled output once.

## 2. `hover:opacity`/`hover:color` on a whole link only fires where the cursor literally is

**Symptom:** a link made of two separately-styled `<span>`s (e.g. "CRAFTED BY" in one color, a name in another) only shows the hover color on whichever word the mouse happens to be over — the client wants both to react together, from hovering anywhere on the link.

**Root cause:** `:hover` is a per-element pseudo-class. If each span has its own `hover:text-[...]`, each only matches while the cursor is directly over *that* span's box, not the parent link.

**Fix:** use Tailwind's `group`/`group-hover` pattern — put `group` on the shared ancestor (the `<a>`), and `group-hover:text-[...]` on each child span:

```tsx
<a href={...} className="group">
  <span className="group-hover:text-[var(--foreground)]">CRAFTED BY </span>
  <span className="group-hover:text-[var(--signal)]">ELENIE</span>
</a>
```

This compiles to `.group:hover .group-hover\:text-\[var\(--signal\)\]{color:...}` — hovering anywhere inside `.group` (the whole link) triggers both children's rules simultaneously. Verify the compiled selector uses `.group:hover <descendant>` (not just present as a class name) if you want to be sure before reporting it fixed.

## 3. `flex flex-wrap` is not a grid — it just looks like one until items differ in width

**Symptom:** a row of logos/buttons that wraps onto multiple lines on mobile "looks uneven," items in different rows don't line up into clean columns.

**Root cause:** `flex-wrap` packs items left-to-right, wrapping to a new line only when the current line runs out of width. Each row's item positions depend on the *cumulative width* of everything before it on that row — with items of different intrinsic widths (e.g. 9 partner logos with 9 different aspect ratios), the columns this produces are not aligned at all; it just happens to look grid-like when items are similar widths.

**Fix:** switch to a real CSS Grid with a fixed column count, and use `justify-items-center` (or `-start`) plus `items-center` so both axes align cleanly:

```tsx
<ul className="grid grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8
                lg:flex lg:flex-wrap lg:justify-start lg:gap-x-10 lg:gap-y-6">
```

Note the responsive split: below `lg:` (where wrapping was happening and looked bad) it's a real grid; at `lg:` and up (where the whole row fits on one line anyway, so wrapping never happens) it reverts to the original `flex-wrap` — don't change behavior on a breakpoint where nothing was actually broken.

**A subtlety that looks like a bug but isn't:** with `justify-items-center` + `items-center`, items of *different heights* in the same row will have different `top` values even though they're correctly centered — because centering means `top = rowCenter - itemHeight/2`, so a taller item's top is smaller (further up) than a shorter item's, while their *centers* match. Before concluding vertical alignment is broken, compare `(rect.top + rect.bottom) / 2` across items, not `rect.top` alone.

## 4. Aligning two separate rows to shared columns: fixing item 1 isn't fixing the row

**Symptom:** a row of buttons above, a row of text links below, meant to align column-by-column (link 1 under button 1, link 2 under button 2, etc). A quick fix (add one shared left-padding to the second row) makes the *first* pair line up, but the client comes back: "you didn't align it like I asked" — items 2 and 3 still drift, because the buttons above have different widths, so a single shared offset can only ever match one column.

**Fix:** put both rows into **one shared CSS Grid** so the columns are genuinely the same tracks, not independently-flowing rows that happen to start at the same x for item 1:

```tsx
<div className="grid grid-cols-[repeat(3,max-content)] justify-items-start gap-x-3 gap-y-4">
  {buttons.map(btn => <a key={btn.label} className="btn btn-outline">{btn.label}</a>)}
  {links.map(link => <a key={link.label} className="pl-[11px]">{link.label}</a>)}
</div>
```
(6 items, 3 columns, default row-major auto-placement puts 3 buttons on row 1 and 3 links on row 2 automatically — no manual `grid-row`/`grid-column` needed as long as the counts match.)

Each link still needs its *own* inset (`pl-[11px]` here, matching the button's border+padding) so its *text* — not just its box — starts at the same x as the button's label text. Verify with `getBoundingClientRect` on both the button and the link in each column, comparing `rect.left + inset` for both.

## 5. Don't stack a flex/grid `gap` and a decorative element's own margin for the same spacing

**Symptom:** a "·" separator between text segments (e.g. `HERO · EYEBROW · WORDS`) has visibly uneven spacing on one side vs the other after refactoring it into a reusable class.

**Root cause:** if the parent has `gap-x-2` between flex children *and* the separator element itself has `margin: 0 0.5em`, both apply — you get gap + margin on one side of the separator and just margin on the other, asymmetric.

**Fix:** pick one mechanism. If you want the separator reusable outside of any particular flex/grid context (e.g. shared between a flex hero eyebrow and a plain-flowing footer line), give the separator its own symmetric margin and drop the parent's `gap-x-*` entirely — let the separator's margin be the only source of horizontal spacing between segments.

```css
.sep-dot { margin: 0 0.5em; }
```
```tsx
<span>{word}{i < len-1 && <span className="sep-dot">·</span>}</span>
```
Parent: `flex flex-wrap gap-y-1` (note: **no** `gap-x-*`).

Verify by checking that consecutive item boxes literally touch (`rect.right` of one equals `rect.left` of the next) — all visible spacing should come from the separator's own margin, not a mix.

## 6. Measuring things precisely in a backgrounded/hidden browser pane

Several environments (headless test panes, backgrounded tabs) don't fully composite frames, which breaks the usual "just take a screenshot" verification loop and has specific, learnable failure modes:

- **`element.getBBox()` on an SVG returns an empty object** (`{}`) in this state — don't use it.
- **`element.getBoundingClientRect()` works reliably**, but only right after a *fresh page navigation* — repeated calls to `fetch()` the same URL within one page session can return **stale/cached data** even after you've edited the file on disk, especially if the asset is served with long-lived caching (`Cache-Control: immutable, max-age=...`, common for `/public` static assets). Always cache-bust: `fetch(url + '?v=' + Math.random())`, and prefer a fresh `navigate()` before each measurement pass rather than re-measuring in-place.
- **`requestAnimationFrame` never fires** in a backgrounded tab (browsers throttle/suspend rAF for hidden tabs) — if you `await` a double-rAF (a common trick to wait for layout to settle), it will hang until timeout. Skip the rAF wait; `getBoundingClientRect()` forces a synchronous layout on read, so you don't need to wait a frame first.

**Working recipe** for measuring an SVG element's true geometry (e.g. centering a text label on an icon inside a hand-assembled logo):

```js
(async function() {
  const svgText = await (await fetch('/assets/your.svg?v=' + Math.random())).text();
  const div = document.createElement('div');
  div.style.position = 'fixed'; div.style.top = '0'; div.style.left = '0';
  div.innerHTML = svgText;
  document.body.appendChild(div);
  const svgEl = div.querySelector('svg');
  svgEl.setAttribute('width', '400');           // pick a big reference width for precision
  svgEl.removeAttribute('height');               // let it scale by viewBox aspect ratio
  const icon = document.getElementById('icon');
  const label = document.getElementById('label');
  const scale = svgEl.getBoundingClientRect().width / VIEWBOX_WIDTH;
  const result = {
    iconCenter: (icon.getBoundingClientRect().top + icon.getBoundingClientRect().bottom) / 2 / scale,
    labelCenter: (label.getBoundingClientRect().top + label.getBoundingClientRect().bottom) / 2 / scale,
  };
  div.remove();
  return JSON.stringify(result);
})();
```
Always do a **fresh navigation** (`navigate()` to any URL, even the same one with a dummy query param) before running this, not just a fresh `fetch()` — the whole-page state can carry stale DOM/layout info between measurement passes otherwise.

## 7. Hand-assembling an SVG logo from a client-pasted HTML blob

Clients often send a full scraped snippet from a partner's website — an entire `<li><a><svg>...` navbar item, React-framework attributes and all, not a clean logo file.

**Process:**
1. Extract just the `<svg viewBox="..." >...</svg>` — delete the wrapping `<li>`/`<a>`, any `data-react-*`/`class="..."` framework cruft, and any sibling text *unless* the client wants it folded into the logo (see below).
2. If it's a pure vector logo, keep `fill="#fff"` or similar as given; if the fill depends on external CSS you don't have, just leave `fill` unset — SVG defaults to black, and if the site's convention is a `.logo-mono { filter: brightness(0) invert(1); }` treatment anyway, black becomes white regardless.
3. Apply the site's existing partner-logo treatment for consistency: `logo-mono` filter, `opacity-70 hover:opacity-100`, whatever `width` class the majority of sibling logos use (don't give one logo a special wider box just because its native aspect ratio is unusual — check what a similarly-shaped existing logo uses first, e.g. another very-wide-and-short logo).
4. If the client wants an icon **combined with a text label** (e.g. "keep the company name text that was next to the icon on their site"), build it as one SVG with an icon `<g transform="scale(...)">` plus a `<text>` element, then **measure, don't guess**, using the recipe above:
   - Icon and text vertical centering: compare `(top+bottom)/2` for both, adjust `text y` by the delta.
   - Horizontal gap between icon and text: after any icon rescale, re-check the icon's new right edge — text `x` set for a smaller icon will collide with the icon once you enlarge it. This happened here: enlarging the icon from scale 0.9 to 1.0 moved its right edge past the text's fixed `x`, and they visually glued together until the gap was re-measured and the text `x` moved out.
   - Tight-fit the `viewBox` to the *measured* combined bounding box of icon + text (with a small margin), not a round guess — an oversized viewBox makes the logo look like it has awkward padding next to logos that don't.
5. **Expect several rounds of size adjustment** on a hand-assembled icon+text logo (bigger, smaller, matched-to-siblings, then finally "wait it's touching now") — that's the normal cost of combining assets by hand, not a sign the approach is wrong. Each round is cheap *if* you re-measure with the recipe above instead of eyeballing new numbers.
