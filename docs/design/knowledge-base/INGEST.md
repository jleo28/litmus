# Ingest skill: adding a school's rules to the knowledge base

> **Repo note:** the canonical file this workflow edits lives at
> `src/lib/knowledge-base/rules.json` in the app, not in this `docs/` folder.
> This copy is archived for reference alongside the rest of the v3 design
> handoff. Step 5.4 below ("regenerate the inline `KB` mirror in
> `Litmus.dc.html`") only applies to the standalone design prototype at
> `docs/design/prototype-reference.html`; the production app reads
> `rules.json` directly and has no mirror to keep in sync.

**Admin only.** Nothing in this file is a user-facing feature. The point of the
workflow is that every clause in `rules.json` can be traced back to a document a
student could open themselves.

## How to invoke it

Paste into chat: raw policy text, a link to a school page or PDF, or both. Say
which school. Then say "ingest this". I will run the steps below and report back
before writing anything.

## Step 1: establish the source is credible

A source qualifies only if all four hold:

1. **Published by the school itself**, on a school-controlled domain (`*.edu`, or
   a documented subdomain of one), or a PDF hosted there. Third-party
   explainers, law-firm blogs, Reddit, and AI summaries never qualify as sources.
   They can point me at a source; they cannot be one.
2. **Attributable to the office that decides.** For CPT that is the
   international-student office, not careers services or a department page.
3. **Current.** The page carries a date, a term reference, or an archive
   timestamp placing it in the current or previous academic year. If nothing on
   the page establishes recency, it gets ingested as `stale: true` from day one.
4. **Prescriptive, not descriptive.** The text has to state a requirement a
   student can fail. Encouragement ("we recommend starting early") is not a rule.

If a source fails any test I say which one and stop. I do not paraphrase around a
weak source to make it usable.

## Step 2: extract, do not rewrite

For each requirement found:

- `quote`: **verbatim**, unedited, from the source. If it needs an ellipsis to
  stay readable, the ellipsis goes in and nothing is reordered. Never reword a
  clause into the quote field.
- `summary`: my own plain-language sentence. One sentence. Second person. This
  is the only field where I write.
- `cite`: the document path as a student would navigate it.
- `url`: the exact page or PDF.
- `category`: reuse an existing one (Timing, Hours, Location, Documentation,
  Eligibility) unless the requirement genuinely does not fit.
- `severity`: `blocker` if failing it stops the application, `warning` if it
  needs a conversation.
- `powers`: the names of the checks on the results screen this rule decides. If
  a rule powers nothing yet, leave it empty rather than inventing a check.
- `effective`: the date the source says it applies from, if stated.
- `verified`: today's date, meaning *I read this clause on the source today.*

## Step 3: reconcile against what is already there

- **Duplicate** (same requirement, same wording): skip, refresh `verified`.
- **Changed** (same requirement, new wording or numbers): replace the quote, keep
  the `id`, and add a changelog entry naming what moved. Old wording is never
  silently dropped, the changelog is the receipt.
- **Conflict** (two school documents disagree): ingest neither. Report both and
  ask which office wins.
- **New**: append.

## Step 4: state the gaps

After ingesting, update `coverage.gaps` for that school: what a student might
reasonably expect Litmus to check and it still cannot. This is not optional. The
gap list is the reason the rulebook is trustworthy, and it is the only thing
standing between a quiet screen and a student assuming they are clear.

## Step 5: write and mirror

1. Append to `knowledge_base/rules.json`.
2. Add a `changelog` entry for the school, dated, one line, plain.
3. Update `ruleCount`.
4. Regenerate the inline `KB` mirror in `Litmus.dc.html`.
5. Report: rules added, rules changed, rules skipped and why, gaps still open.

## Things I will not do

- Infer a rule from a school's silence.
- Merge two schools' rules because they look similar.
- Ingest a screenshot as a source of record. It can start the conversation; the
  page it came from ends it.
- Soften a `blocker` to a `warning` to make a result feel better.
