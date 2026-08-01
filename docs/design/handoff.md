# Handoff: Litmus — CPT Offer Checker (v1) + Tracker (v1.1)

## Overview

Litmus is a web tool for F-1 international students. A student pastes a job listing or an offer letter, confirms five extracted fields, and gets a plain-English read on where that opportunity collides with their school's published CPT rules — before they invest weeks in pursuing it.

The governing principle, which every design decision follows:

> **Litmus is decisive about what it can compute, and silent about what it can't.** It compares the offer against published CPT rules (term, dates, deadline, hours, location) and flags conflicts definitively. It **never** renders an overall "you are / aren't eligible" verdict — that is a DSO's call. Every rule cites its source.

Consequences to preserve in the build:
- No "APPROVED / REJECTED" stamps. No alarm-red dead ends. Every conflict is paired with a constructive next step.
- A persistent, first-class non-verdict line (not fine print), on every screen: *"This checks your offer against your school's published CPT rules. It is not an eligibility decision: confirm with OIS before acting."*
- Phrasing rule: the summary describes **the offer colliding with the rules**, never the student's status. "This offer exceeds the fall hours cap," never "you are ineligible."
- Tone: calm, precise, trustworthy. A well-designed compliance tool, but warmer.
- **No em dashes anywhere in the copy.** Use commas or colons. This is a deliberate house style rule; hold it in any new copy you write.

## About the design files

`Litmus.dc.html` in this bundle is a **design reference created in HTML** — a working prototype that shows intended look, copy, and behavior. It is **not production code to copy**. It is a single self-contained file with an inline-styled component and a small state machine, built for design review.

Your task is to **recreate these designs in the target codebase's existing environment** (React/Next, Astro, etc.) using its established patterns, component library, and styling approach. If no environment exists yet, pick the most appropriate framework and implement there. Do not port the prototype's inline styles or its single-file structure.

The prototype has no backend. Every rule value, sample document, parse result, and tracker card is hardcoded. Extraction, rule data, auth, and persistence are all yours to build.

## Fidelity

**High fidelity.** Colors, typography, spacing, copy, and interaction detail are final-intent. Recreate the UI closely, substituting the codebase's own primitives where it has them. Desktop-first at ~1280px (the design was reviewed at 1280 wide, 56px page gutters, 1280px max content width). Mobile is **not designed yet** — see "Open questions."

## Screens / views

The prototype is a five-step state machine plus two account-gated screens. `step` ∈ `input | loading | confirm | results | signin | tracker`.

### 1. Paste (`input`)

**Purpose:** the student pastes a listing or letter and states their class standing.

**Layout:** two-column grid, `minmax(0,1fr) 316px`, 64px gap, 64px top padding.

Left column:
- `h1`, Newsreader 44px/1.12, weight 400, letter-spacing −0.02em, color `#1c1b19`. Copy: "Check an offer against *{school}* CPT rules." forced to two lines via `<br>` after "against".
  - **The school word cycles.** An italic inline-block span rotating through `your school's → USC's → UCLA's → Northwestern's → NYU's → Purdue's` on a 2600ms interval, with a 2600ms infinite CSS keyframe (`opacity 0→1` at 10%, hold to 86%, `→0` at 100%, ±5px translateY). The h1 must not reflow when the word changes — the `<br>` and `white-space:nowrap` on line 2 guarantee a fixed 99px height. In production, the list should come from the schools you actually support, and should stop cycling and pin to the user's school once authenticated.
- Value-prop `p`, 15.5px/1.55, `#5f5c56`, max-width 52ch.
- Label "Paste the job listing or offer letter", 12.5px/500, `#3d3b37`.
- **Hero textarea**: full width, height 252px, resizable vertically, padding 20px 22px, 14px/1.6 text, background `#fdfdfc`, border 1px `rgba(28,27,25,.16)`, radius 5px, shadow `0 1px 2px rgba(28,27,25,.04)`. Focus: border `oklch(0.48 0.075 250 / 0.55)` + ring `0 0 0 3px oklch(0.48 0.075 250 / 0.09)`. Placeholder: "Paste the full text here: title, employer, dates, hours, and work location." Live character count bottom-right, 10px, `#a3a09a`.
- **Document-type detection chip** appears below the textarea once >40 characters are pasted: "Reading a job listing" / "Reading an offer letter", 9.5px uppercase label, background `oklch(0.955 0.02 250)`, text `oklch(0.42 0.075 250)`, radius 3px. Followed by a note: for a listing, "Postings often leave out hours, that's expected, and I'll say so rather than guess."; for a letter, "Holding it to the standard for a letter submitted to OIS."
- Upload affordance: secondary dashed button, "↑ or upload a PDF / DOCX". Deliberately quieter than paste. (Prototype fakes it by loading a sample.)
- "Try a sample:" with three inline links (prototype only; drop or keep as demo data).

Right column (`aside`, background `#fbfaf8`, border 1px `rgba(28,27,25,.1)`, radius 6px, padding 24px):
- "REQUIRED" label, "Your class standing" (Newsreader 20px/500), explainer "It changes the hours rule: final-semester students may qualify for full-time."
- **Three progressive steps**, each revealed only after the previous is answered (fade+rise 220ms):
  1. **Level** — stacked full-width buttons: Undergraduate / Master's / PhD.
  2. **Year** — wrapping chips, options depend on level: Freshman, Sophomore, Junior, Senior / Master's · year 1, 2, 3+ / PhD · year 1–2, 3–4, 5+.
  3. **Is this your final semester?** — Yes / No, with sub-label "Graduating at the end of it."
  - Selected state for all three: background `#1c1b19`, text `#fbfaf8`, weight 500. Unselected: `#fdfdfc` / border `rgba(28,27,25,.16)` / text `#3d3b37`.
- Primary CTA "Check this offer." Full width, 13px padding, radius 4px. Enabled only when text is pasted **and** all three standing questions are answered; disabled style background `#eceae5`, text `#b0ada6`, no border. Helper line below: "Paste an offer and answer all three above." → "Nothing is stored or sent to your school."

### 2. Checking (`loading`)

**Purpose:** show the tool doing work, and name what it is comparing.

150px vertical padding, centered. Newsreader 26px: "Comparing against your school's published rules…". Below it a 340px column of five lines (label typeface, 12px) that tick from `·` (opacity .35) to `✓` (`#2a2825`) at 260ms intervals; the active line pulses (`opacity .3 ↔ 1`, 1s infinite):
"Reading the listing" (or "Reading the letter") / "Matching the CPT term" / "Comparing dates and deadlines" / "Comparing weekly hours" / "Checking the commute zone".

**Replay rule (important):** the animation plays on first run only. If the student goes back and returns without changing any value, skip straight to the destination screen. The prototype compares a signature string of `employer|start|end|hours|location|docType|year|finalSemester` against the last run.

### 3. Confirm (`confirm`)

**Purpose:** verify-don't-trust. Covers parsing misses and makes the student own the inputs.

Single column, max-width 820px, 52px top padding.
- Kicker "STEP 2 OF 3".
- `h1` Newsreader 34px: "Here's what I pulled from the listing." / "…from your offer letter."
- Sub: "Fix anything I got wrong before we check. Everything below is editable."
- **Document-type row:** the detection chip, a note, and a correction link: "It's an offer letter, actually" / "It's a job listing, actually". Switching it re-labels the whole flow and changes how a missing-hours value is treated.
- **Missing-field banner** (only when a field couldn't be extracted): background `oklch(0.975 0.03 85)`, border `oklch(0.86 0.06 85)`, radius 5px. "NOT FOUND" label plus copy that differs by document type:
  - Listing: "I couldn't find weekly hours in this listing, most public postings leave them out. Add a number if the recruiter has told you one; leave it blank and Litmus will flag the hours check as unresolved instead of guessing."
  - Letter: "I couldn't find weekly hours in this letter. OIS won't accept a letter without exact hours, add the number if you know it, and ask for an amended letter either way."
- **Field table**, card background `#fbfaf8`, radius 6px, one row per field: `210px | 1fr` grid, 17px/24px padding, hairline dividers `rgba(28,27,25,.07)`. Left: label 13px/500 + hint 11.5px `#8d8a84`. Right: text input (10px 13px padding, 13.5px).
  - Employer — "Legal name as it appears on the letter"
  - Start date — "First day of work"
  - End date — "Last day of work"
  - Weekly hours — hint switches: letter "A single number, not a range" / listing "Often absent from public postings, fine to leave blank"
  - Work location — "City and state of the physical site"
  - A flagged empty field gets background `oklch(0.985 0.02 85)`, border `oklch(0.82 0.08 85)`, and an inline note.
- Actions: "Run the check." (primary, `#1c1b19`) and a quiet "Back to the paste".

### 4. Results (`results`) — the screen to get right

Two-column grid, `minmax(0,1fr) 296px`, 56px gap. Right column is `position: sticky; top: 24px`.

**A. Summary bar**
- Kicker: "JOB LISTING · HOLLYWOOD PARK" (document type + employer).
- Conflict count, Newsreader 40px/1.1, weight 400: "3 hard conflicts" / "2 hard conflicts · 1 warning" / "No conflicts found" (green `oklch(0.42 0.09 155)` when zero, otherwise `#1c1b19`). Computed from the checks, not authored.
- One-line lead describing the collision, 16px, max-width 56ch.
- **Non-verdict box**, background `#fbfaf8`, border `rgba(28,27,25,.12)`, radius 5px, max-width 62ch: an `i` glyph plus "This checks your offer against your school's published CPT rules. **It is not an eligibility decision**: confirm with OIS before acting." ("It is not an eligibility decision" at weight 600.)

**B. Check rows** — five rows, each `96px | 1fr` grid, 24px/20px padding, bled 20px into the gutter, hairline bottom border.
- **Status chip**: 9.5px uppercase, letter-spacing .11em, centered, radius 3px.
  - `pass` — bg `oklch(0.955 0.035 155)`, text `oklch(0.42 0.09 155)`, border `oklch(0.88 0.055 155)`, row tint none
  - `warning` — bg `oklch(0.96 0.045 85)`, text `oklch(0.47 0.1 70)`, border `oklch(0.88 0.06 85)`, row tint `oklch(0.988 0.014 85)`
  - `blocker` — bg `oklch(0.955 0.04 25)`, text `oklch(0.48 0.14 25)`, border `oklch(0.88 0.06 25)`, row tint `oklch(0.988 0.012 25)`
  - Below the chip, a two-digit row index, 9.5px, `#a3a09a`.
- **Title**, Newsreader 21px/500.
- **Comparison table**, max-width 640px, two equal cells, border `rgba(28,27,25,.1)`, radius 4px, background `#fdfdfc`. Left cell label "THIS LISTING" / "YOUR LETTER"; right cell "YOUR SCHOOL'S RULE". Values 13.5px/500; the offer value takes the status color when not passing.
- **Next step**: `→` plus one plain-English sentence, 13.5px/1.6, `#4a4640`.
- **Citation**, expandable: a button "OIS — {rule name}" with `+` / `−`. Expanded panel: background `#fbfaf8`, 2px left border `oklch(0.48 0.075 250 / 0.45)`, radius `0 4px 4px 0`, containing the rule text at Newsreader 14.5px **weight 600** (soft-bold, deliberately not italic — italics were harder to read at this size), then the citation path and an external link "Open on your school's OIS site ↗".
- The five checks, in order: **CPT term**, **Start-date gap**, **Application deadline**, **Weekly hours**, **Work location**.
- **Unresolved hours** (blank hours on a listing): the row becomes `warning`, titled "Weekly hours: can't be checked", offer value "Not stated", next step "Most public listings leave hours out, and Litmus won't guess. Ask the recruiter for a number in writing, if it lands above 20/wk during the term, this becomes a hard conflict." On a **letter**, the same blank instead reads as a defect: "An offer letter has to state exact weekly hours before OIS will accept it."

**C. Offer-letter completeness card** — `#fbfaf8`, radius 6px. Header Newsreader 21px + a lead that differs by document type (a posting is told these are the elements the eventual letter will need). Two-column grid of six items, each `✓` (`oklch(0.5 0.09 155)`) or `✕` (`oklch(0.52 0.13 25)`) plus an optional 11.5px note in `oklch(0.5 0.09 40)`: legal name, physical address, job description aligned to major, exact hours, start/end dates, official letterhead + signature.

**D. "What now?" card** — border `rgba(28,27,25,.16)`, background `#fdfdfc`. Kicker "WHAT NOW?", headline Newsreader 26px/500, body 14px, then numbered action rows (`26px | 1fr | auto`), then a footer strip `#f4f3ef` with a one-line reality check. Action buttons are **always black on white text** (`#1c1b19` / `#fbfaf8`) for uniformity. Four variants:

| Case | Headline | Actions |
|---|---|---|
| Listing, conflicts | "Not recommended: this one isn't worth the application." | Pass on this one for now · Ask OIS whether any version of it works (draft) · Only if you're set on this employer (draft) |
| Listing, clear (or one warning) | "Nothing here collides. Apply." / "Worth applying, with one thing to nail down." | Hit apply · Ask the recruiter for exact weekly hours (draft) · Confirm with OIS before you accept (draft) |
| Letter, clear | "Start the authorization today, not next week." | Email OIS to open the CPT request (draft) · Keep the signed letter on letterhead · Don't start before your I-20 date |
| Letter, conflicts | "Don't sign it yet: get the letter amended first." | Ask the employer for an amended letter (draft) · Flag the conflict to OIS in parallel (draft) · Hold off on signing |

The listing-with-conflicts copy is deliberately blunt: a company will not rewrite a posting for someone who hasn't interviewed, so the recommendation is to spend the time elsewhere, not to negotiate.

**E. Sidebar**
- "KEEP A RECORD" card: "Save to tracker" (primary; routes to sign-in when unauthenticated), "Copy the summary", "Print / save as PDF".
- "WHAT LITMUS CHECKED" card: label/value pairs stacked (label 11px `#a3a09a` above value 12.5px/450) for Document, Employer, Dates, Hours, Location, Standing; plus "Edit these values" back-link.
- Footnote: "Rule values shown are as published for 2026–27 and pending OIS verification."

**F. Email draft overlay** (the "quick view")
Fixed full-screen scrim `rgba(28,27,25,.42)`; panel max-width 760px, max-height 86vh, scrollable, background `#fdfdfc`, radius 8px, shadow `0 24px 60px rgba(28,27,25,.28)`, entry animation 220ms rise + scale from .985. Contents: kicker "DRAFT: NOTHING IS SENT FOR YOU", a Newsreader 24px title, tabs ("To OIS" / "To the recruiter" or "To the employer"), a faux mail card with To / Subject rows on `#fbfaf8` and a `white-space: pre-wrap` body, and a single "Copy the draft" button. Close via the `✕` or the scrim.

Draft bodies are generated from the check results: each conflict becomes a bullet "• {check title}: the listing says {offer value}; the published rule is {rule value}." Signature placeholder is `[Your name] · [School ID]` (becomes "{School} ID" once authenticated).

### 5. Sign in (`signin`) — v1.1

Two-column, `minmax(0,1fr) 380px`, 72px gap.
Left: kicker "OPTIONAL, AND ONLY FOR THIS", `h1` Newsreader 38px "Keep a record of what you've checked.", a paragraph stating the account does exactly one thing, then four bullets — three `✓` in green (sorted checks; separate boards for listings and offers; school rules preset from the email domain) and one `✕` in grey: "No I-20, no SEVIS number, no immigration record. Litmus never becomes a place your status is stored."
Right card (`#fbfaf8`, radius 6px, padding 26px): "Sign in to save this check", school-email input with the note "We use the domain to set your school's rules. No transcript, no I-20, no SEVIS number.", primary "Email me a sign-in link", an "OR" divider, secondary "Continue with your university SSO", and a quiet "Keep checking without an account".

**Guest mode is a first-class path.** The whole v1 flow must work with no account.

### 6. Tracker (`tracker`) — v1.1

**Purpose:** at a glance, which of my applications are worth my time.

Header row: kicker "YOUR CHECKS", `h1` Newsreader 34px ("Listings you're considering" / "Offers you've received"), a one-line summary count, and a right-aligned two-tab switch ("Job listings" / "Offers", selected = black fill). **The two boards are separate because the stakes differ:** a listing conflict costs an application; an offer conflict costs a signed commitment.

Three columns, equal `minmax(0,1fr)`, 20px gap, each a tinted panel: background `oklch(0.988 0.012 {hue})`, border `oklch(0.9 0.03 {hue})`, radius 6px, padding 16px. Hues: **Hard no** 25, **Maybe** 85, **All clear** 155 (the "all clear" panel uses the neutral `#fbfaf8` fill so green is never celebratory). Column header: 10px uppercase title in `oklch(0.45 0.1 {hue})`, right-aligned count, hairline divider, then a 12px blurb:
- Hard no — "Something only the employer could change, or the window has closed."
- Maybe — "Nothing collides yet, but a value is missing or unconfirmed."
- All clear — "Every rule Litmus can check lines up. OIS still has the final word."

Cards: background `#fdfdfc`, border `rgba(28,27,25,.12)`, radius 5px, padding 14px 15px, shadow `0 1px 2px rgba(28,27,25,.04)`; hover border `rgba(28,27,25,.28)` and shadow `0 3px 10px rgba(28,27,25,.07)`. Contents: a 6px status dot (`oklch(0.55 0.13 {hue})`) + role at 13.5px/500, employer 12.5px `#5f5c56`, a wrapping row of three meta chips (dates / hours / location, 9.5px, hairline border, radius 3px), a 12px reason line naming the conflicts, and a footer row with "CHECKED JUL 29" and a right-aligned "OPEN CHECK" / "RE-CHECK" action. Clicking a card opens its saved result.

Empty column state: dashed 1px `rgba(28,27,25,.18)` box, centered 12.5px `#a3a09a` — "Nothing here. Good." / "No open questions right now." / "Nothing clean yet."

Footer: primary "Check another offer" plus the standing caveat: "Cards move columns on their own when you re-check them, so an amended letter or a confirmed hours number lands where it belongs. Nothing here is an eligibility decision, and none of it is shared with your school."

**Column assignment rule (implement server-side, derived from the check results — never hand-set by the user):**
- any `blocker` → **Hard no**
- no blockers, any `warning` or unresolved value → **Maybe**
- all five `pass` → **All clear**
Re-checking a saved item recomputes the column. Persist the check inputs and the computed result so a card can be reopened without re-parsing.

## Interactions & behavior

- **Navigation:** Paste → (loading) → Confirm → (loading) → Results. Results → Confirm via "Edit these values". Results → Sign in → Tracker via "Save to tracker". Header shows the 3-step indicator during the flow, and a "Tracker" link plus the account email once signed in.
- **Progressive disclosure** on the class-standing questions; each answer resets the ones after it (changing level clears year and final-semester).
- **Detection** runs live as the user types and is always correctable on the confirm screen. The prototype's heuristic counts letter cues ("dear", "pleased to offer", "sign and return", "sincerely") against listing cues ("is seeking", "is hiring", "responsibilities include", "apply online") and defaults to listing when neither wins. In production, do better than keyword counting, but **keep the visible, correctable chip** — the design depends on the user being able to disagree.
- **Loading replay suppression** as described above.
- **Citation expansion** is per-row, independent, non-exclusive.
- **Animations:** entry fade+rise 300ms ease (`translateY(6px)` → 0) on each screen; overlay 220ms; the loading ticks at 260ms; the school word on a 2600ms loop. Everything else is instant.
- **Print:** `@media print` hides everything marked `data-noprint` (header, states bar, sidebar action card, overlay) and drops the page background to white. The results screen is the printable artifact.
- **Prototype-only:** the black "States" pill fixed to the bottom center jumps between Screen 1 / No hours (JD) / three result states / Sign in / Tracker. **Delete it in production.**

## State management

Prototype state (a guide to what the real app needs, not a prescription):

| Key | Purpose |
|---|---|
| `step` | which screen is showing |
| `raw` | pasted document text |
| `docType` | `""` (auto-detect) \| `jd` \| `letter`; set explicitly when the user corrects it |
| `level`, `year`, `finalSem` | class standing answers |
| `fields` | the five editable extracted values |
| `missing` | which fields extraction failed to find |
| `open` | which citations are expanded |
| `lastSig` | signature of the last checked inputs, for loading-replay suppression |
| `loadIdx` | loading tick index |
| `emailOpen`, `draftIdx`, `draftCopied` | draft overlay |
| `copied`, `saved` | transient button confirmations (2200ms) |
| `signedIn`, `email` | account state |
| `board` | tracker board: `jd` \| `offer` |
| `schoolIdx` | cycling headline word |

Real data requirements the prototype fakes:
1. **Extraction** of employer, start, end, hours, location from pasted text or an uploaded PDF/DOCX. Must be able to return "not found" per field — that state is designed for.
2. **Rule data per school and term**: term start/end, application deadline, hours cap by term and by final-semester status, approved commute geography, plus a citation (rule name, quoted text, path, URL) for each. The prototype hardcodes USC 2026–27 values. **All rule values are user-reported and pending OIS verification — verify before shipping.**
3. **Auth** (email link + university SSO), with the email domain selecting the school's rule set.
4. **Persistence** of saved checks: inputs, computed results, timestamp, computed column.

## Design tokens

**Color**
| Token | Value | Use |
|---|---|---|
| Page background | `#f7f6f3` | body |
| Surface raised | `#fbfaf8` | header, footer, aside cards, panels |
| Surface input | `#fdfdfc` | inputs, cards on tinted panels |
| Surface inset | `#f4f3ef` | "what now" footer strip |
| Ink | `#1c1b19` | headings, primary buttons |
| Ink 2 | `#2a2825` | card titles, values |
| Body | `#4a4640` | next-step and body copy |
| Body muted | `#5f5c56` | secondary paragraphs |
| Muted | `#6f6c66` | hints |
| Faint | `#8d8a84` | kickers, labels |
| Faintest | `#a3a09a` | placeholders, timestamps |
| Hairline | `rgba(28,27,25,.06 – .16)` | borders and dividers |
| Accent (links, focus, citation) | `oklch(0.48 0.075 250)`; hover `oklch(0.38 0.085 250)` | links only, never status |
| Pass | text `oklch(0.42 0.09 155)`, bg `oklch(0.955 0.035 155)`, border `oklch(0.88 0.055 155)` | status only |
| Warning | text `oklch(0.47 0.1 70)`, bg `oklch(0.96 0.045 85)`, border `oklch(0.88 0.06 85)` | status only |
| Blocker | text `oklch(0.48 0.14 25)`, bg `oklch(0.955 0.04 25)`, border `oklch(0.88 0.06 25)` | status only |
| Row tints | `oklch(0.988 0.014 85)` / `oklch(0.988 0.012 25)` | warning / blocker rows |

Red, amber and green are reserved **strictly** for check status and the tracker columns, so severity reads at a glance. Do not use them for anything else.

**Typography**
- Display / headings: **Newsreader** (serif), weights 400–600. h1 44px (paste), 38px (sign in), 34px (confirm, tracker), 40px (summary count), 26px (what-now headline, loading), 21px (check titles, card titles), 20–24px (panel titles). Letter-spacing −0.01 to −0.022em.
- Body / UI: **IBM Plex Sans**, weights 400/450/500/600. 15.5px lead, 14px what-now body, 13.5px next steps and values, 12.5–13px controls, 11.5–12px hints.
- Small labels (kickers, status chips, meta chips, timestamps): 9.5–10.5px, uppercase, letter-spacing .05–.11em, **weight 600 in IBM Plex Sans**. The prototype exposes a switch across 17 monospace options plus a serif option; the shipped choice is **no monospace, bolded sans**. Everything driven by two CSS variables (`--mono`, `--monoW`) so it stays swappable.
- Body copy uses `text-wrap: pretty` on multi-line prose.

**Spacing** 2 / 3 / 5 / 6 / 8 / 10 / 12 / 14 / 16 / 20 / 22 / 24 / 26 / 34 / 44 / 56 / 64 / 72px. Page gutter 56px, content max-width 1280px.

**Radius** 3px (chips), 4px (buttons, inputs), 5px (cards, banners), 6px (panels), 8px (overlay), 999px (states pill).

**Shadows** `0 1px 2px rgba(28,27,25,.04)` (input, card) · `0 3px 10px rgba(28,27,25,.07)` (card hover) · `0 6px 24px rgba(28,27,25,.22)` (states pill) · `0 24px 60px rgba(28,27,25,.28)` (overlay).

**Focus ring** border `oklch(0.48 0.075 250 / 0.55)` + `0 0 0 3px oklch(0.48 0.075 250 / 0.09)` on all text inputs. Keyboard focus for buttons is **not** designed yet — add it using the codebase's convention.

## Assets

None. No images, no icons, no illustration. Every glyph is a text character (`✓ ✕ → ↑ ↗ · + − i ✕`) and every rule is CSS. Deliberate: no emoji-as-status, no playful illustration. If you introduce an icon set, keep status meaning carried by the chip text, not by icon shape alone.

Fonts: Newsreader, IBM Plex Sans (and, if you keep the switcher, the monospace families) from Google Fonts.

## Content

The prototype ships three sample documents used throughout: **Hollywood Park / SoFi Stadium IT Innovation Intern** (real; 3 conflicts), **Mercedes-Benz R&D MBRDNA AI Program Manager Intern** (real; location conflict), and **Praxis Studio Summer UX Research Intern** (fabricated; clean offer letter). Tracker cards beyond those three are fabricated. All sample data is demo content — do not ship it as seeded data.

## Open questions for the build

1. **Rule verification.** Every hours cap, deadline, term date, commute-zone definition, and citation quote in the prototype is user-reported or plausible-but-invented. Nothing ships until OIS pages are the source.
2. **The final-semester full-time rule** is written as a school's own published rule. Confirm it exists at USC and whether it generalizes to other schools before the class-standing question drives anything.
3. **Mobile.** Not designed. A stressed student is likely on a phone; the two-column results layout and the three-column tracker both need a stacked treatment before launch.
4. **Multi-school rules** are stubbed by the cycling headline only. The rule engine needs a per-school data model from day one, even if only one school is populated.
5. **Extraction confidence.** The design has "found it" and "couldn't find it" but no "found it, but I'm unsure". If your extractor has confidence scores, that may deserve a third field state.
6. Out of scope in v1, by decision: employer-facing explainer, compare-multiple-offers, multi-school support beyond rule data, OPT, the Chrome extension.

## Files

- `Litmus.dc.html` — the full prototype: all six screens, the draft overlay, three sample documents, the rule and citation data, and the tracker board. Open it in a browser; use the bottom states pill to reach each state without clicking through.
