# Litmus

A web tool for F-1 international students. Paste a job listing or offer letter,
confirm five extracted fields, and get a plain-English read on where that
opportunity collides with your school's published CPT rules, before you invest
weeks pursuing it.

Litmus is decisive about what it can compute (term dates, deadlines, hours,
commute zone) and silent about what it can't. It never renders an overall
"eligible / not eligible" verdict, that's a DSO's call.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, with a small Zustand
store persisted to `localStorage`. No backend: extraction, the rule engine,
and mock auth all run client-side. See `docs/design/handoff.md` for the full
design spec this build follows, and `docs/OPEN_QUESTIONS.md` for what's still
outstanding before a real launch.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project layout

- `src/app` — routes: `/` (paste), `/confirm`, `/results`, `/signin`, `/tracker`
- `src/components` — screen-level and shared UI components
- `src/lib/rules` — per-school CPT rule data and the check engine
- `src/lib/extraction` — doc-type detection and field extraction (regex/keyword heuristics, not an ML model)
- `src/lib/store` — the Zustand app store (flow state, mock auth, saved checks)

## Branching

`main` is the release branch; `develop` is the integration branch. Work
happens on `feature/*` branches opened as pull requests against `develop`.
