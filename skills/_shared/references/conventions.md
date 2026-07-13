# Shared Conventions

The single source of truth for the lifecycle, routing, markers, labels, severities,
priorities, effort sizes, and the `plans/` layout used across **every** skill in
this collection.

When a skill needs to refer to one of these conventions, it links here instead of
restating the definition. If any skill's wording disagrees with this file, **this
file wins** — fix the skill, not this reference.

---

## The Development Lifecycle

Every skill occupies a fixed position in one lifecycle. This diagram is canonical —
skills reproduce fragments of it for local context, but this is the complete picture:

```
idea-to-prd → prd-to-design° → design-to-tasks → tasks-to-code ⇄ code-review → release-checklist → plan-retrospective
 (what/why)    (architecture)     (task list)       (build)       (quality)        (ship)               (close)
```

- `°` **prd-to-design is optional** — warranted for non-trivial features, skipped for
  simple ones (`design-to-tasks` falls back to the PRD).
- **code-review is part of the pipeline, not an afterthought** — run it per task or per
  phase during implementation, and always before `release-checklist`. Unresolved
  `🔴 Blocking` findings in `review.md` are a release block.
- **Audit skills** — `ui-design-audit`, `security-review`, `performance-review` — run
  standalone, before or between pipelines. Each emits its findings **as a PRD**
  (`plans/<audit-type>-<date>/prd.md`), entering the pipeline directly at
  `design-to-tasks`; they do not pass through `idea-to-prd`.
- **Repair skills** — `debug-and-fix` (incorrect behavior) and `refactor`
  (structure-only change) — run standalone at any point and route work back into the
  pipeline when it outgrows them.
- **next-step** is the orchestrator: it reads the `plans/` state, reports where each
  plan is in this lifecycle, and routes any request to the right skill.

### Routing

One table, used by every skill's intake triage. Classify the work first; misrouting
is how behavior changes ship without acceptance criteria.

| The work is… | Route to |
|---|---|
| A new feature, or any addition/change of behavior | `idea-to-prd`, then the pipeline |
| Deciding the architecture for an existing PRD | `prd-to-design` |
| Breaking a design or PRD into implementable work | `design-to-tasks` |
| Implementing tasks from an approved task list | `tasks-to-code` |
| Assessing a diff, PR, or changed file set | `code-review` |
| Incorrect behavior — something is broken | `debug-and-fix` |
| Restructuring code with behavior identical | `refactor` |
| A systematic UI / design-system sweep | `ui-design-audit` |
| A whole-system security posture sweep | `security-review` |
| A whole-system performance posture sweep | `performance-review` |
| Verifying a plan is safe to ship | `release-checklist` |
| Closing out a completed plan | `plan-retrospective` |
| Unsure what state the work is in or what comes next | `next-step` |

**Bright lines:** new or changed behavior always enters through `idea-to-prd`;
incorrect behavior is always `debug-and-fix`; a structure-only change is always
`refactor`. When a piece of work straddles two rows, split it — never smuggle one
kind of change inside another.

---

## Task Status Markers

Used as the leading checkbox on every task in `tasks.md`, and in any status report
derived from it.

| Status | Marker | Meaning |
|--------|--------|---------|
| Not Started | `[ ]` | Work has not begun |
| In Progress | `[~]` | Actively being worked on |
| Completed | `[x]` | Done and verified — all acceptance criteria met |
| Blocked | `[!]` | Cannot proceed — the task note records the blocker |
| Skipped | `[-]` | Intentionally not doing — the task note records the reason |

**Rules:**

- Only the top-level task checkbox counts toward statistics — never the
  acceptance-criteria sub-checkboxes.
- `[!]` and `[-]` always carry a note explaining the block or the reason for skipping.
- `[x]` means verified: do not mark a task complete until every acceptance-criteria
  sub-checkbox is checked.

---

## Priority

Priority answers *"how important is this?"* It is written as a bracketed tag on a task
(`[P0]`) and as a bare label in a PRD (`P0`).

| Priority | Tag | Meaning |
|----------|-------|---------|
| P0 | `[P0]` | Must-have — required to ship/launch |
| P1 | `[P1]` | Should-have — expected, but can ship without it |
| P2 | `[P2]` | Nice-to-have |

PRD requirement language maps to priority: **must** → P0, **should** → P1, **may** → P2.

---

## Severity and Priority

There is **one** severity scale across all skills. Severity answers *"how bad is this
finding?"* and maps directly to [priority](#priority), so findings can flow straight
into a task list. This is the single canonical severity↔priority mapping.

| Severity | Marker | Priority | Use when |
|----------|--------|----------|----------|
| Critical | `🔴` | `[P0]` | Blocks shipping: a correctness or security bug, a broken acceptance criterion, or a broken/blocking user experience. Must be fixed before merge or release. |
| Major | `🟡` | `[P1]` | A real problem that should be fixed this cycle but does not block the release. |
| Minor | `⚪` | `[P2]` | Polish: trivial style, a one-step deviation, a cosmetic inconsistency. |

**Code review** applies this same scale using disposition names, because "blocks the
merge" reads more naturally on a diff than "P0":

| Code-review term | Canonical severity | Marker |
|------------------|--------------------|--------|
| Blocking | Critical | `🔴 Blocking` |
| Suggestion | Major | `🟡 Suggestion` |
| Nit | Minor | `⚪ Nit` |

Code review adds one marker that is **not** a severity: `✅ Praise`, for calling out
something done well. Praise carries no priority.

**UI design audit** uses the canonical names directly (`🔴 Critical` / `🟡 Major` /
`⚪ Minor`) and maps them to `[P0]` / `[P1]` / `[P2]` when it emits its findings as a PRD.

---

## Effort (T-shirt Sizes)

Effort estimates the work to complete a task. It is written as a bracketed tag (`[M]`).

| Size | Tag | Rough time | Typical scope |
|------|-------|-----------|---------------|
| Small | `[S]` | < 1 hr | Config change, simple utility, small fix |
| Medium | `[M]` | 1–2 hr | Single endpoint, one component, one test suite |
| Large | `[L]` | 2–4 hr | Multi-file feature component, moderate complexity |
| Extra-large | `[XL]` | 4–8 hr | Cross-cutting concern or major integration — **break it down further before starting** |

---

## Requirement Labels

Labels make every requirement traceable from PRD → tasks → retro. They are assigned in
the PRD and referenced everywhere downstream.

| Label | Prefix | What it tags |
|-------|--------|--------------|
| Functional Requirement | `FR-N` | Something the system must do |
| Non-Functional Requirement | `NFR-N` | A performance, security, accessibility, or reliability target |
| User Story | `US-N` | A user-facing story with acceptance criteria |
| Quality Gate | `QG-N` | A lint / format / test / build / review check that must pass |

`N` is a stable integer: assigned once and never renumbered, so references in tasks,
commits, and conversations stay valid. During task decomposition, a risk that needs its
own implementation work is tagged `RISK-N`.

---

## The `plans/` Directory

All planning artifacts for one initiative live in a single dasherized folder under
`plans/`. Active work stays in `plans/<name>/`; completed work moves to
`plans/archive/<name>/`.

```
plans/
├── <active-feature>/         # Active work
│   ├── prd.md                # idea-to-prd — source of truth for intent
│   ├── design.md             # prd-to-design — architecture (optional; non-trivial features)
│   ├── adr/                  # prd-to-design — architecture decision records (NNNN-*.md)
│   ├── tasks.md              # design-to-tasks — derived task list, updated by tasks-to-code
│   ├── decisions.md          # tasks-to-code — implementation decision log
│   ├── review.md             # code-review — optional, multi-round review tracking
│   └── retro.md              # plan-retrospective — added at close-out
└── archive/
    └── <completed-feature>/  # Moved here by plan-retrospective after close-out
        ├── prd.md
        ├── tasks.md
        ├── decisions.md
        └── retro.md
```

- The folder name is lowercase, dasherized, and descriptive (`api-rate-limiting`, not
  `feature1`).
- `prd.md` (and `design.md`, when present) is never modified after tasks are generated —
  it is the historical record of intent and structure. The task list is a derivative
  artifact. The one exception is the **change protocols**: a genuine requirements change
  goes through `idea-to-prd` (PRD update → `design-to-tasks` incremental re-task), and a
  genuine architecture change goes through `prd-to-design` (design/ADR update →
  `design-to-tasks` incremental re-task). Silent drift is never allowed; deliberate,
  recorded revision is.
- `design.md` and `adr/` are optional: `prd-to-design` adds them for non-trivial features,
  and `design-to-tasks` falls back to `prd.md` when they are absent.
- **Audit plans** are named `plans/<audit-type>-<date>/` — `plans/ui-audit-2026-07-12/`,
  `plans/security-review-2026-07-12/`, `plans/performance-review-2026-07-12/` — each
  containing a `prd.md` of findings that feeds straight into `design-to-tasks`.
- Not every file exists for every plan; each skill creates the ones it owns.

### Deterministic plan tooling

Two stdlib-only Python helpers in `skills/_shared/scripts/` (documented in that
directory's README) read a `tasks.md` and report on it, so skills **run the script
and interpret the result** instead of hand-counting markers:

- `plan-metrics.py` — status totals, completion rate, per-phase breakdown (JSON)
- `plan-validate.py` — structural lint: missing notes, dependency cycles, multiple
  in-progress tasks, requirement-coverage gaps (`--prd plans/<name>/prd.md`)

`design-to-tasks` validates with them after generating, `tasks-to-code` recomputes
statistics with them after each task, and `release-checklist` / `plan-retrospective`
use them for completion assessment and metrics. Prefer them over manual counting —
they are the arbiter when a hand-maintained statistics table disagrees.
