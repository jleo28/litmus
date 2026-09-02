# Changelog — since the v1 / v1.1 handoff

Everything below is new in this round. Specs are given at the prototype's own scale
(23px wordmark, 1280px desktop layout) so they can be translated into the live codebase.

## 1. Logo mark: flask replaces the dot on the "i"

> **`LOGO.md` in this folder is the authoritative source for both marks — copy its
> markup verbatim.** The bullets below are context only; where they read as a
> ratio/description and `LOGO.md` gives a literal value, `LOGO.md` wins.
>
> **Post-handoff adjustment:** both flasks were raised slightly further after
> implementation (header `bottom:17px → 19px`, splash `bottom:86px → 94px`,
> same ~1:4 scale ratio as the rest of the mark) per direct product feedback.
> `LOGO.md`'s own bottom values now read low by that same amount; the numbers
> below and in `prototype-reference.html` reflect what's actually shipped.

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
  `bottom: 19px`, with `line-height: 0` on the flask wrapper (inheriting
  line-height is what makes it sit low and collide with the stem).
- The header mark now animates too (post-handoff addition, see #5), so it
  carries the same `z-index` treatment as the splash mark for the same reason.
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
- Flask is 16px at the 92px wordmark (same 0.175 ratio); sits at `bottom: 94px`,
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

## 5. Header logo flips too (post-handoff addition)

Not in the original handoff or `LOGO.md` — added after the splash animation
shipped, to give the persistent header mark the same bit of life instead of
sitting static everywhere except the one-time intro.

- Same choreography as the splash flip (`lit-flip`, #2): forward 360° rotation
  through a small vertical arc, landing with the same squash-and-settle. Same
  timing too — 620ms delay, 1150ms `cubic-bezier(.4,.02,.5,.98)`.
- Amplitude is scaled to the header's flask size: the header flask is 4px vs.
  the splash's 16px (1/4 scale), so the vertical arc is 1/4 the splash's
  (`-6.5px / -11.5px / -10.5px / -3.5px` vs. `-26px / -46px / -42px / -14px`
  at the matching keyframes). Rotation degrees and the squash scale are
  size-independent, so those stay identical to the splash.
- Every keyframe repeats the header's own horizontal nudge,
  `translateX(calc(-50% + 0.5px))` — not the splash's plain `-50%` — since the
  header mark keeps its optical nudge even while animating.
- `z-index: 2` on the flask, same reasoning as the splash: without it, frames
  mid-flip render behind the stem.
- Plays once, on mount (i.e. on a full page load). The header persists across
  client-side navigation in this app, so it does not replay on every visit to
  Home, only on a fresh load. Respects `prefers-reduced-motion: reduce`.
- Lives in `globals.css` as `@keyframes lit-flip-header` + a `.logo-flip`
  utility class, kept separate from the splash's `lit-flip` keyframes since
  the pixel amplitudes differ.

## Unchanged

Rule engine copy, the five-field confirm step, results layout, tracker screen,
the persistent non-verdict line, and the fidelity notes in `README.md` are all
as previously handed off.
