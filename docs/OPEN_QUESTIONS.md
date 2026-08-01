# Open questions

Carried over from the design handoff (`docs/design/handoff.md`), updated for
what this build actually did.

1. **Rule verification.** `src/lib/rules/schools/usc.ts` holds every term
   date, deadline, hours cap, and citation quote as provisional 2026-27 data.
   Nothing here has been checked against a real OIS page. Don't launch before
   someone does, and plan to refresh it every academic year.
2. **Final-semester full-time rule.** Modeled as a per-term
   `finalSemesterLiftsCap` flag in the school data. Still needs confirmation
   that it's accurate for USC and whether it generalizes to other schools.
3. **Mobile.** Not implemented. Layouts are desktop-first at ~1280px, matching
   the design spec, which explicitly left mobile undesigned.
4. **Multi-school rules.** The rule engine takes a `SchoolRules` object and a
   registry (`src/lib/rules/schools/index.ts`), so adding a second school is
   additive, not a rewrite. Only USC is populated.
5. **Extraction quality.** `src/lib/extraction` is a regex/keyword heuristic,
   not a model. It ships with a "not found" state per field (by design), but
   has no confidence tier between "found" and "not found."
6. **PDF/DOCX upload.** The paste screen accepts a file, but only reads
   plain-text files. PDF/DOCX selection shows an inline note asking the
   student to paste the text instead, rather than faking a result.
7. **Auth and persistence.** Sign-in is a mock (no email actually sent, no
   real SSO) and all state lives in the browser's `localStorage` via Zustand.
   There's no backend, so nothing here is shared across devices or durable
   against a cleared browser profile.
8. Out of scope, matching the original design decision: employer-facing
   explainer, comparing multiple offers side by side, OPT, a browser
   extension.
