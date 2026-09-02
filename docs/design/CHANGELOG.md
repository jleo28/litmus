# Changelog — since the v1 / v1.1 handoff

Everything below is new in this round. Specs are given at the prototype's own scale
(23px wordmark, 1280px desktop layout) so they can be translated into the live codebase.

## 1. Logo mark: flask replaces the dot on the "i"

> **`LOGO.md` in this folder is the authoritative source for both marks — copy its
> markup verbatim.** The bullets below are context only; where they read as a
> ratio/description and `LOGO.md` gives a literal value, `LOGO.md` wins.

The wordmark is now `L` + a **dotless i** (`ı`, U+0131) + `tmus`, with a small
conical-flask glyph standing in for the i's tittle.

- Flask asset: `assets/flask.svg` (24×24 viewBox, monochrome ink `#1c1b19`,
  20%-opacity fill in the liquid area, no color — status colors stay reserved).
- Header wordmark spec: Newsreader 500, 23px, `letter-spacing:-0.015em`.
- Flask size **4×4px** at that wordmark size, `stroke-width: 3.4`
  (stroke is scaled up as the glyph shrinks so it still reads).
- Placement: absolutely positioned over the `ı` stem, horizontally centered
  (`translateX(calc(-50% + 0.5px))` — the 0.5px is an intentional optical
  nudge for the stem's own side bearing, not a rounding artifact), sitting
  `bottom: 17px`, with `line-height: 0` on the flask wrapper (inheriting
  line-height is what makes it sit low and collide with the stem).
- No `z-index` needed on the header mark — it's static. (The splash mark
  does need one; see #2.)
- Rendered reference: `assets/litmus-logo.png` (4× capture of the final mark).

Ratios to preserve at any size: flask height ≈ **0.175×** the wordmark font size;
gap above the stem ≈ **0.26×** the wordmark font size.

## 2. Startup animation (splash)

On first load the app shows a full-viewport splash on the app background (`#f7f6f3`),
which is the logo itself, enlarged and centered:

- Wordmark at **92px** (same family/weight/tracking as the header), full `Lıtmus`
  with the i-stem visible.
- The **flask alone** performs one forward flip in place: it starts resting on the
  stem, rotates a full 360° forward through a small vertical arc, lands, and takes a
  brief squash-and-settle (`scale(1.1,.88)` → `scale(1,1)`).
- Flask is 16px at the 92px wordmark (same 0.175 ratio); sits at `bottom: 86px`,
  centered on the stem (`translateX(-50%)`, no horizontal nudge — unlike the
  header, the splash flask is dead-center). Carries `z-index: 2` so no frame
  of the flip lands behind the stem; every keyframe repeats `translateX(-50%)`
  since the animation overwrites `transform` wholesale each frame.
- Timing: wordmark fades/rises in over 620ms, then the flip runs 1150ms on
  `cubic-bezier(.4,.02,.5,.98)`. Splash begins a 340ms opacity fade at 2050ms and
  unmounts at 2420ms, cutting straight into the app.
- **Click anywhere on the splash to skip** (fades immediately, then unmounts).
- Implementation note: driven by two state flags (`splash`, `splashFade`) and two
  timeouts, both cleared on unmount and on skip. Respect
  `prefers-reduced-motion` in production: skip the flip, show the app immediately.

## 3. Header logo links to Home

The header wordmark is now interactive: clicking it returns the user to screen 1
(`step: "input"`), i.e. `onNavHome`. Cursor pointer, `opacity .62` on hover with a
180ms transition, `title="Back to home"`. In production this should be a real
`<a href="/">` (or router link), not a click handler on a span.

## 4. "Your tracker" card on the Home screen

New card in the **right-hand column of the Home (`input`) screen**, stacked
directly beneath the existing "Required / your class standing" panel, with a 14px
gap between the two. It is scoped to the Home screen only (not on results).

- Same panel treatment as the sibling above it: `#fbfaf8` background,
  `1px solid rgba(28,27,25,.1)` border, 6px radius, 20px padding.
- Contents, in order:
  - eyebrow `Optional` (mono, 10px, uppercase, `.09em` tracking, `#8d8a84`)
  - title `Your tracker` (Newsreader 500, 19px)
  - body `Every offer you've checked, side by side.` (12.5px, `#6f6c66`)
  - primary button `Open the tracker →` (full width, left-aligned label,
    `#1c1b19` on `#fbfaf8` text, 4px radius, 12/14px padding) → `onNavTracker`,
    which routes to the `tracker` screen.
- Copy holds the house style: no em dashes, no eligibility verdict language.

## Unchanged

Rule engine copy, the five-field confirm step, results layout, tracker screen,
the persistent non-verdict line, and the fidelity notes in `README.md` are all
as previously handed off.
