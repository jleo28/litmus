# Changelog — v2 to v3

Everything below is new in this round: a persistent header nav, an account screen, and
the knowledge base with its public Rulebook screen. Nothing in v1 or v2 is replaced;
the rule engine, the confirm step, the loading checklist, the results layout, the
tracker screen, the logo, and the splash are all unchanged.

**House rule, applies to everything:** no em dashes anywhere in the product. Use a
colon or a comma. Applied across all v3 copy and the knowledge base.

## 1. Persistent header nav

The header's right-side group gains two permanent text links, replacing the static
email address v2 displayed there:

- **My Tracker** — visible on every screen except the tracker itself, routes to
  `/tracker`. Not gated behind sign-in: a signed-out user reaches the tracker's
  existing signed-out redirect (to sign-in, with guest mode still explained there),
  not a dead end.
- **My Account** / **Sign In** — visible on every screen, no exceptions. Routes to
  `/account` when signed in, `/signin` when signed out.

The tracker screen's eyebrow changed from "Your checks" to "My Tracker" to match.

## 2. Account screen (`/account`)

New screen, gated to signed-in users (redirects to `/signin` otherwise). One details
panel with three rows (email, username, password), each independently editable with
save/cancel, only one open at a time. A confirmation line appears below the panel on
save and clears after ~2.6s.

Below it: **Sign out** (returns home, tracker records stay), and **Delete account**,
which opens a modal requiring the user to type their email to confirm before the
destructive action enables. Deleting an auth user requires Supabase's admin API,
which needs a service-role key server-side — see `src/app/api/account/delete` and the
new `SUPABASE_SERVICE_ROLE_KEY` entry in `.env.example`. Without that key set, the
route fails closed with an explanatory error instead of silently no-opping.

Username is a new persisted field, stored in the Supabase user's `user_metadata`
rather than a new table, since v1/v2 never collected one.

## 3. Quiet entry points to the Rulebook

- Footer, every screen: "What we check against" → `/rulebook`, left of the version
  label.
- Results screen: appended to the non-verdict line, "Read the rules we checked" →
  `/rulebook`.

## 4. The knowledge base and the Rulebook screen (`/rulebook`)

`src/lib/knowledge-base/rules.json` is the canonical ruleset and ships as real
content, not a design reference: 13 CPT rules for USC, current as of September 3,
2026. It powers a new public screen, not the rule engine itself (the engine's own
per-school data in `src/lib/rules/schools` is unchanged and unrelated). See
`docs/design/knowledge-base/INGEST.md` for the admin process that maintains it.

The Rulebook screen shows every rule grouped by category (Timing, Hours, Location,
Documentation, Eligibility), each a collapsed disclosure row with a severity chip
("Blocker" / "Depends"), expanding to the school's verbatim quote, source link,
verification date, and which results-screen check it decides. A search box filters
by summary, quote, category, id, and the checks a rule powers; three or fewer matches
auto-expand. Below the list, a "What Litmus does not know" panel lists the gaps in
`coverage.gaps` verbatim, including `usc-degree-requirement`, a blocker Litmus
records but cannot check from a document (see the knowledge base's own coverage
notes for why, and the two open product questions it raises for v4).

School for the screen is resolved from the signed-in user's email domain via
`kbSchoolFromEmail`, same convention as the existing `schoolFromEmail` in
`src/lib/rules/schools`; signed-out visitors see the default (USC) ruleset, since
that's the only one populated.

## Out of scope, still

Rule-engine logic and thresholds, the school-name cycling headline, document-type
detection, the confirm-step fields, the loading checklist, the results layout and its
citation behavior, the tracker screen contents, the logo, and the splash. No OPT
rules. No user-facing write path to the knowledge base.

## Pinned for v4

A browser extension for Chrome and Safari that signals, through color, whether a
student is clear to apply the moment a listing or offer letter is opened. Not
designed yet.
