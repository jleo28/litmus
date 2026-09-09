# LOGO.md — copy this markup verbatim. Do not redesign, re-derive, or "improve" it.

Two marks, both already tuned by eye in the prototype. **Take the HTML and CSS below
literally.** Every number is intentional. Do not recompute positions from ratios, do
not swap the dotless `ı` for a normal `i` plus a hidden dot, do not convert the
flask to an icon-font glyph, and do not adjust stroke widths to "match" between the
two sizes — they differ on purpose.

If the mark looks wrong after you implement it, the cause is almost always one of
the four failure modes listed at the bottom, not a wrong value here.

---

## 0. Shared: the flask SVG

Identical in both marks except `width`, `height`, and `stroke-width`. Paths never
change.

```html
<svg viewBox="0 0 24 24" width="W" height="W" fill="none" stroke="#1c1b19"
     stroke-width="SW" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
  <path d="M7.4 14.6h9.2l2.6 4.8a1.7 1.7 0 0 1-1.5 2.5H6.3a1.7 1.7 0 0 1-1.5-2.5z"
        fill="rgba(28,27,25,.2)" stroke="none"></path>
  <path d="M10 2.6v6.6L4.8 19.4a1.7 1.7 0 0 0 1.5 2.5h11.4a1.7 1.7 0 0 0 1.5-2.5L14 9.2V2.6"></path>
  <path d="M9.2 2.6h5.6"></path>
</svg>
```

| Mark | W | SW |
| --- | --- | --- |
| Header (23px wordmark) | `4` | `3.4` |
| Splash (92px wordmark) | `16` | `1.8` |

The first path is the liquid fill (no stroke). The second is the flask body. The
third is the lip. Keep that order — the fill must paint under the outline.

---

## 1. Header logo — homepage and every screen

Verbatim source from the prototype. `onClick`/`href` is the only thing you should
change (make it a real link to `/`).

```html
<a href="/" title="Back to home"
   style="font-family:Newsreader,serif;font-size:23px;font-weight:500;letter-spacing:-0.015em;display:inline-flex;align-items:baseline;cursor:pointer;color:#1c1b19;text-decoration:none;transition:opacity .18s ease">L<span
  style="position:relative;display:inline-block">ı<span
    style="position:absolute;left:50%;bottom:17px;transform:translateX(calc(-50% + 0.5px));width:4px;height:4px;display:flex;align-items:flex-end;justify-content:center;line-height:0"><svg
      viewBox="0 0 24 24" width="4" height="4" fill="none" stroke="#1c1b19" stroke-width="3.4"
      stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path
        d="M7.4 14.6h9.2l2.6 4.8a1.7 1.7 0 0 1-1.5 2.5H6.3a1.7 1.7 0 0 1-1.5-2.5z"
        fill="rgba(28,27,25,.2)" stroke="none"></path><path
        d="M10 2.6v6.6L4.8 19.4a1.7 1.7 0 0 0 1.5 2.5h11.4a1.7 1.7 0 0 0 1.5-2.5L14 9.2V2.6"></path><path
        d="M9.2 2.6h5.6"></path></svg></span></span>tmus</a>
```

Hover: `opacity: .62`.

**Structure, if you must express it in a component system:**

```
<a>                                   font-size:23px, inline-flex, align-items:baseline
  "L"                                 plain text
  <span position:relative inline-block>
    "ı"                               U+0131 LATIN SMALL LETTER DOTLESS I
    <span position:absolute …>        the flask, 4×4, bottom:17px
  </span>
  "tmus"                              plain text
</a>
```

Non-negotiable details:

- The character between `L` and `tmus` is **ı (U+0131)**, a real dotless i. Not `i`
  with the dot masked, not `1`, not `l`.
- The flask wrapper is `position:absolute` inside a `position:relative` **inline-block**
  span wrapping only the `ı`. Anchoring it to the whole wordmark will drift.
- `left:50%` **plus** `transform:translateX(calc(-50% + 0.5px))`. The 0.5px is an
  optical nudge for the stem's own side bearing. Keep it.
- `bottom:17px` is measured from the baseline of the wordmark, i.e. the bottom edge
  of the relative span. It is not a margin and not a gap value.
- `line-height:0` on the flask wrapper. Without it the wrapper inherits line-height
  and the flask sits several px low.
- The accessible name must be exactly `Litmus`. Because the visible text spells
  `Lıtmus`, give the link `aria-label="Litmus"` and keep the SVG `aria-hidden`.
  Never let `Lıtmus` reach `document.title`, meta tags, or clipboard copy.

## 2. Splash logo — startup animation

Same structure at 92px, with the flip on the flask only. Verbatim:

```html
<div style="position:fixed;inset:0;z-index:200;background:#f7f6f3;display:flex;align-items:center;justify-content:center;cursor:pointer">
  <div style="font-family:Newsreader,serif;font-size:92px;font-weight:500;letter-spacing:-0.015em;color:#1c1b19;display:inline-flex;align-items:baseline;animation:lit-mark 620ms ease both">L<span
    style="position:relative;display:inline-block">ı<span
      style="position:absolute;left:50%;bottom:86px;transform:translateX(-50%);width:16px;height:16px;z-index:2;display:flex;align-items:flex-end;justify-content:center;line-height:0;transform-origin:50% 100%;animation:lit-flip 1150ms cubic-bezier(.4,.02,.5,.98) 620ms both"><svg
        viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1c1b19" stroke-width="1.8"
        stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path
          d="M7.4 14.6h9.2l2.6 4.8a1.7 1.7 0 0 1-1.5 2.5H6.3a1.7 1.7 0 0 1-1.5-2.5z"
          fill="rgba(28,27,25,.2)" stroke="none"></path><path
          d="M10 2.6v6.6L4.8 19.4a1.7 1.7 0 0 0 1.5 2.5h11.4a1.7 1.7 0 0 0 1.5-2.5L14 9.2V2.6"></path><path
          d="M9.2 2.6h5.6"></path></svg></span></span>tmus</div>
</div>
```

Differences from the header mark, all deliberate:

| | Header | Splash |
| --- | --- | --- |
| Wordmark size | 23px | 92px |
| Flask box | 4×4, stroke 3.4 | 16×16, stroke 1.8 |
| Horizontal | `calc(-50% + 0.5px)` | `-50%` (no nudge) |
| `bottom` | 17px | 86px |
| Extras | — | `z-index:2`, `transform-origin:50% 100%`, flip animation |

`z-index:2` keeps the flask above the stem at every frame of the flip. Do not drop
it — without it mid-flip frames render behind the `ı`.

### Keyframes — verbatim

```css
@keyframes lit-mark {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}

@keyframes lit-flip {
  0%   { transform: translateX(-50%) translateY(0)     rotate(0deg); }
  16%  { transform: translateX(-50%) translateY(-26px) rotate(62deg); }
  38%  { transform: translateX(-50%) translateY(-46px) rotate(158deg); }
  58%  { transform: translateX(-50%) translateY(-42px) rotate(238deg); }
  82%  { transform: translateX(-50%) translateY(-14px) rotate(330deg); }
  92%  { transform: translateX(-50%) translateY(0)     rotate(360deg); }
  96%  { transform: translateX(-50%) translateY(0)     rotate(360deg) scale(1.1, .88); }
  100% { transform: translateX(-50%) translateY(0)     rotate(360deg) scale(1, 1); }
}
```

**Every keyframe must repeat `translateX(-50%)`.** It is not a separate centering
declaration — the animation overwrites `transform` wholesale, so omitting it on any
frame throws the flask sideways by half its width. This is the single most common
way this animation breaks.

Likewise `transform-origin: 50% 100%` (base center) is what makes it a forward flip
off its own base rather than a spin about its middle.

### Timing and behavior

| Phase | Value |
| --- | --- |
| Wordmark fade + 6px rise | 620ms ease |
| Flip | 1150ms `cubic-bezier(.4,.02,.5,.98)`, delay 620ms |
| Splash opacity fade | 340ms, begins at 2050ms |
| Splash unmount | 2420ms |

- Fade is `transition: opacity 340ms ease` driven by a state flag, not a keyframe.
- Click anywhere on the splash to skip: fade at once, unmount 340ms later, and clear
  both timers.
- `prefers-reduced-motion: reduce` → do not render the splash at all.
- Show once per session; skip entirely when the entry URL is not the home route.

---

## The four ways this goes wrong

1. **A keyframe missing `translateX(-50%)`** → flask jumps right (or left) mid-flip
   and lands off-center over the stem. Fix: repeat it on all eight frames.
2. **`line-height` inherited on the flask wrapper** → flask renders low and collides
   with the stem. Fix: `line-height:0` on the absolute wrapper.
3. **`position:relative` on the wrong ancestor** → flask anchors to the whole
   wordmark rather than the `ı`, so it drifts as text width changes. Fix: the
   relative inline-block must wrap **only** the `ı`.
4. **Missing `z-index:2` on the splash flask** → mid-flip frames disappear behind the
   stem. Fix: add it.

## Verify before you ship

- Header mark: flask centered over the stem, a clear gap between stem top and flask
  base, nothing touching or overlapping.
- Splash, frozen at 0% and at 100%: flask centered on the stem, base above the stem
  with the same visual gap, tip just below the cap height of the `L`.
- Splash, frozen mid-flip (≈38%): flask is above the wordmark, fully visible, still
  horizontally centered on the stem.
- Screen reader announces the header link as "Litmus".
- `assets/litmus-logo.png` in this bundle is a 4× render of the header mark — compare
  against it.
