---
name: next-step
description: Read the state of every plan under plans/, report where each one sits in the development lifecycle, and route the user to the right skill to continue. Use when the user asks "what's next", "what should I do next", "where were we", "resume work", "continue the plan", "what's the status of the plan", "which skill should I use", "where do I start", or makes a request that doesn't clearly map to one skill. The front door and orchestrator of the skill suite — detects the lifecycle stage from the artifacts on disk and the task states, runs the deterministic plan tooling, and recommends the next skill with the reason.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Next Step

## Purpose

Every other skill in this suite does one stage of the lifecycle well. This skill answers the question that sits between them: **"where is the work right now, and which skill continues it?"**

It exists for three situations:

1. **Resuming** — a new session, a handoff, or a return after time away. The `plans/` directory holds the state; this skill reads it and picks up the thread.
2. **Routing** — a request that doesn't obviously map to one skill ("make the app better", "handle this ticket", "we need to improve search"). This skill classifies it and routes it using the canonical [routing table](../_shared/references/conventions.md#routing).
3. **Status** — "how far along are we?" answered with computed numbers, not impressions.

It is read-only with one purpose: **orient, then hand off.** It never writes plan artifacts, never implements, and never skips the skill it routes to.

## The Lifecycle

The full lifecycle and the canonical routing table are defined once in [shared conventions](../_shared/references/conventions.md#the-development-lifecycle):

```
idea-to-prd → prd-to-design° → design-to-tasks → tasks-to-code ⇄ code-review → release-checklist → plan-retrospective
```

Audit skills (`ui-design-audit`, `security-review`, `performance-review`) emit PRDs that enter at `design-to-tasks`; repair skills (`debug-and-fix`, `refactor`) run standalone at any point.

## Workflow

### Phase 1: Inventory the plans

1. **List `plans/`** — every directory except `archive/` is an active plan. Note audit plans by their `<audit-type>-<date>` names.
2. **For each active plan, list its artifacts** — which of `prd.md`, `design.md`, `adr/`, `tasks.md`, `decisions.md`, `review.md`, `retro.md` exist. The artifact set is the primary stage signal (see [references/state-detection.md](references/state-detection.md)).
3. **If there are no plans** and the user asked a "where do I start" question, skip to Phase 3 — the answer is a routing question, not a status question.

### Phase 2: Determine each plan's stage

Apply the detection rules in [references/state-detection.md](references/state-detection.md). In short:

| Artifacts present | Task states | Stage | Next skill |
|---|---|---|---|
| `prd.md` only | — | Scoped | `prd-to-design` (non-trivial) or `design-to-tasks` (simple) |
| `prd.md` + `design.md` | no `tasks.md` | Designed | `design-to-tasks` |
| `tasks.md` | any `[ ]`/`[~]` remain | In build | `tasks-to-code` (or unblock `[!]` first) |
| `tasks.md` | all P0 `[x]`, review pending | Built | `code-review`, then `release-checklist` |
| `tasks.md` + clean review | gates green | Shippable | `release-checklist` |
| `release-checklist` passed | — | Shipped | `plan-retrospective` |
| `retro.md` exists, not archived | — | Closing | `plan-retrospective` (finish archiving) |

For any plan with a `tasks.md`, run the deterministic tooling instead of counting by hand:

```bash
python3 skills/_shared/scripts/plan-metrics.py  plans/<name>/tasks.md
python3 skills/_shared/scripts/plan-validate.py plans/<name>/tasks.md --prd plans/<name>/prd.md
```

`plan-metrics.py` gives completion totals and per-phase progress; `plan-validate.py` surfaces structural problems (blocked tasks without notes, dependency cycles, multiple in-progress tasks) that change the recommendation — a plan with a `[!]` task is "unblock first", not "keep implementing". Flag any `review.md` with unresolved `🔴 Blocking` findings: those block release regardless of task completion.

### Phase 3: Route the request

If the user brought a request rather than (or in addition to) a status question, classify it against the [routing table](../_shared/references/conventions.md#routing). Two checks before recommending:

1. **Does it belong to an existing plan?** A request that matches an active plan's scope continues that plan (usually `tasks-to-code`, or `idea-to-prd` to amend the PRD) rather than starting a new one. Starting a parallel plan for the same feature fragments the record.
2. **Is it one thing?** "Fix the crash and add CSV export" is two rows of the routing table — a `debug-and-fix` and a new feature. Split it explicitly and route each part; never let a bug fix smuggle in a feature or vice versa.

If the request is genuinely ambiguous between two routes (most often feature vs. bug: "search is bad" — broken, or working-as-designed-but-insufficient?), ask the one question that disambiguates rather than guessing: *"Is search returning wrong results (bug), or correct results that aren't good enough (feature)?"*

### Phase 4: Report and hand off

Present a compact status report:

```markdown
## Plan Status

| Plan | Stage | Progress | Next skill |
|------|-------|----------|-----------|
| user-authentication | In build | 7/12 tasks (58%), 1 blocked | tasks-to-code — unblock 2.3 first |
| ui-audit-2026-07-10 | Scoped (findings PRD) | — | design-to-tasks |

**Recommended next step:** [one plan + one skill + why it's next]
```

Then hand off: name the skill, name the plan, and state the immediate first action inside that skill ("run `tasks-to-code` on `user-authentication` — task 2.3 is blocked on the missing API key; resolve that note first"). If the user confirms, invoke that skill's workflow — do not partially perform it here.

## Key Principles

**Orient, then hand off.** This skill's output is a recommendation with evidence, not work product. The moment it starts writing PRDs or code it has taken over another skill's job with none of its guardrails.

**The artifacts are the truth.** Stage detection reads what is on disk — artifact presence, task markers, validation output — not what anyone remembers. If the state on disk contradicts the user's description, surface the discrepancy; do not silently trust either.

**Computed, not estimated.** Progress numbers come from `plan-metrics.py`. A hand-waved "about 60% done" from skimming is exactly what this skill exists to replace.

**One recommendation.** Ranked options are a routing failure. Pick the single next step and say why; mention an alternative only when two routes are genuinely tied, and then ask the disambiguating question.

**Blockers outrank progress.** A `[!]` task, a failing gate, or an unresolved `🔴 Blocking` review finding is always the next step — before new implementation, before new plans.

## References

- [references/state-detection.md](references/state-detection.md) — Full stage-detection rules: artifact signals, task-state signals, and edge cases (empty plans, conflicting signals, stale reviews)
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — The canonical lifecycle, routing table, status markers, and `plans/` layout (single source of truth)
- `../_shared/scripts/README.md` — `plan-metrics.py` and `plan-validate.py` usage and output formats
