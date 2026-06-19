<!-- PRD: prd.md -->
<!-- Tasks: tasks.md -->
<!-- Closed: 2026-06-19 -->

# Retrospective: Dark Mode Toggle

> One feature carried end-to-end: shipped a persisted, OS-aware light/dark theme
> with no flash on load. Produced by
> [plan-retrospective](../../skills/plan-retrospective/SKILL.md).

## Summary

Notes shipped a dark mode in response to the most-requested item in user
feedback. Over two short phases the team added a token-based dark palette, a
persisted preference defaulting to the OS theme, an accessible toggle, and a
pre-paint script that removes the flash of the wrong theme. All eleven tasks
completed; the one notable bug — a flash caused by the script's placement — was
caught in code review and fixed before merge. Released as v1.4.0.

## Metrics

| Metric | Value |
|--------|-------|
| Total tasks | 11 |
| Completed `[x]` | 11 (100%) |
| Skipped `[-]` | 0 |
| Blocked `[!]` | 0 |
| Not started `[ ]` | 0 |
| Effective completion rate | 100% (11 / (11 − 0)) |
| PRD requirements covered | 11 / 11 (100%) — FR-1–6, NFR-1–3, US-1–2 |
| Tasks without PRD traceability | 0 |
| PRD requirements never implemented | 0 |

Clean close: every requirement traced to a completed task, and every task traced back to a requirement.

## What Was Built

- A light and dark theme built on the existing CSS-variable design tokens
- A theme toggle, on every page, operable by mouse, keyboard, and screen reader
- A persisted preference (`localStorage`) that survives reloads and sessions
- An OS-default (`prefers-color-scheme`) fallback when the user hasn't chosen, and a safe fallback when storage is unavailable
- A pre-paint inline script that applies the theme before first paint (no flash), guarded by a regression test
- A dark palette audited to WCAG 2.1 AA contrast

## Scope Drift

### Additions (built beyond the PRD)

*No additions beyond PRD scope.*

### Deferrals (planned but deferred)

*All PRD requirements were implemented.* PRD Q1's explicit "System" toggle state was always a Future Consideration, not a planned requirement, so it is not a deferral.

### Blockers (planned but blocked)

*No tasks were blocked.*

## Key Decisions

### Persist via `localStorage` + inline pre-paint script
**Context**: The preference must be readable before React mounts to avoid a flash.
**Decision**: `localStorage` + an inline `<head>` script sharing one pure `resolveTheme()`.
**Impact**: Per-device (not synced) — accepted per non-goals. Any new pre-paint need should reuse the same resolver.
See: [adr/0001-theme-persistence.md](adr/0001-theme-persistence.md) / decisions.md 2026-06-18

### Token-level contrast fixes
**Context**: Two dark muted-text tokens measured below AA.
**Decision**: Adjusted the token values, not individual components.
**Impact**: New dark surfaces inherit AA contrast by reusing the audited tokens.
See: decisions.md 2026-06-19 / Task 2.2

## What Worked Well

- Putting `resolveTheme()` behind one pure, tested function meant the inline script and the provider could never disagree about the resolved theme — the reviewer called this out as praise.
- Fixing contrast at the token layer fixed every component at once, with zero component edits.
- The two-phase split (MVP, then a11y/polish) kept Phase 1 independently deployable.

## What to Improve

- The FOUC risk was named in both the PRD risks and the design, yet the first implementation still placed the script in `<body>` — it was caught in **review**, not before. The FR-5 regression test (Task 2.3) was written in Phase 2; writing it in Phase 1, next to Task 1.5, would have caught the mis-placement at implementation time. *Fix for next plan: when a requirement has a known failure mode, schedule its regression test in the same phase as the code it guards.*
- The contrast miss (NFR-2) wasn't discovered until the Phase 2 audit. *Fix: add a contrast check to the Phase 1 verification gate so palette work is validated as it lands.*

## Open Items

*All tasks are closed.*

## Future Opportunities

- Extract `resolveTheme()` and the token palette into a shared package if a second Notes surface ever needs the same theming.
- A smooth color transition on theme switch, gated on `prefers-reduced-motion`.
- Expose an explicit "System" option in the toggle (PRD Q1) — the storage value already supports it.
