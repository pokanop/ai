# Plan State Detection

How to determine, from the contents of `plans/<name>/` alone, where a plan sits in the
[development lifecycle](../../_shared/references/conventions.md#the-development-lifecycle)
and which skill continues it. The rules read two signals: **which artifacts exist** and
**what the task markers say**. When the two disagree, the task markers win — artifacts
prove a stage was *entered*, markers prove how far it *progressed*.

---

## Signal 1: Artifact presence

Each artifact is created by exactly one skill, so its existence certifies that stage ran:

| Artifact | Created by | Its existence means |
|----------|-----------|---------------------|
| `prd.md` | `idea-to-prd` (or an audit skill) | Requirements are captured |
| `design.md`, `adr/` | `prd-to-design` | Architecture is decided |
| `tasks.md` | `design-to-tasks` | Work is decomposed |
| `decisions.md` | `tasks-to-code` | Implementation has started |
| `review.md` | `code-review` | A tracked review round exists |
| `retro.md` | `plan-retrospective` | Close-out has begun |

An audit plan (`ui-audit-<date>/`, `security-review-<date>/`, `performance-review-<date>/`)
starts life with a findings `prd.md`; it follows the same rules from there, entering the
pipeline at `design-to-tasks`.

## Signal 2: Task markers

When `tasks.md` exists, run the deterministic tooling rather than reading markers by eye:

```bash
python3 skills/_shared/scripts/plan-metrics.py  plans/<name>/tasks.md
python3 skills/_shared/scripts/plan-validate.py plans/<name>/tasks.md --prd plans/<name>/prd.md
```

Interpret the output:

- `blocked > 0` → the next step is **unblocking**, not more implementation. Read each
  `[!]` task's Blocked note; route the blocker itself (missing decision → the user;
  missing requirement → `idea-to-prd`; architecture conflict → `prd-to-design`).
- `in_progress > 1` → the one-in-progress rule is violated; reconcile `tasks.md` with
  reality before recommending anything (which task is *actually* underway?).
- Validation errors (missing notes, unknown dependencies, cycles) → fix `tasks.md`
  first; a corrupted task list misleads every downstream skill.
- Otherwise, `completed / (total − skipped)` and the per-phase breakdown drive the
  stage table below.

## The stage table

Evaluate top to bottom; the first matching row is the stage.

| # | Condition | Stage | Next skill |
|---|-----------|-------|-----------|
| 1 | `retro.md` exists but the folder is still under `plans/` (not `archive/`) | Closing | `plan-retrospective` — confirm and archive |
| 2 | No `tasks.md`, `prd.md` + `design.md` exist | Designed | `design-to-tasks` |
| 3 | No `tasks.md`, only `prd.md` | Scoped | `prd-to-design` for non-trivial features; `design-to-tasks` for simple ones (prd-to-design's "When to Use This — and When to Skip It" section has the criteria) |
| 4 | `tasks.md` with any `[!]` blocked task | Blocked | Resolve the blocker (see above) |
| 5 | `tasks.md` with a `[~]` task | Mid-task | `tasks-to-code` — finish the in-progress task |
| 6 | `tasks.md` with `[ ]` tasks remaining | In build | `tasks-to-code` — next task by priority; suggest `code-review` at each phase boundary |
| 7 | All P0/P1 tasks `[x]`, `review.md` absent or has unresolved `🔴 Blocking` findings | Built, unreviewed | `code-review` (fresh or re-review) |
| 8 | All P0 tasks `[x]`, review clean | Shippable | `release-checklist` |
| 9 | Release checklist produced a Go verdict | Shipped | `plan-retrospective` |

**Rows 7–9 need evidence, not memory.** "Review clean" means a `review.md` whose
Blocking findings are all marked resolved (or the user confirms an untracked review
happened). "Go verdict" is visible in conversation or a checklist artifact; when
unsure, recommend `release-checklist` — it is idempotent and cheap to re-run.

## Edge cases

**Empty plan folder** — a `plans/<name>/` with no artifacts is noise from an aborted
run. Recommend deleting it or starting `idea-to-prd` properly.

**`prd.md` missing but other artifacts present** — the plan lost its source of truth
(hand-built `tasks.md`, or a deleted PRD). Flag it: downstream skills
(`release-checklist`, `plan-retrospective`) require the PRD for success criteria and
coverage. Recommend reconstructing it with `idea-to-prd` before continuing.

**`tasks.md` statistics table disagrees with `plan-metrics.py`** — the script is the
arbiter (it parses the markers; the table is hand-maintained). Note the drift and have
`tasks-to-code` fix the table on its next update.

**Multiple active plans** — report all, but recommend continuing the one nearest to
shipping (rows later in the stage table first). Finishing beats starting; a second
in-flight plan is only the right call when the first is blocked on something external.

**A plan idle for a long time** — check whether the codebase moved underneath it
(`git log` since the last artifact change). If it did, the PRD and design may describe
a world that no longer exists; recommend a review pass through `idea-to-prd` /
`prd-to-design` to revalidate before resuming implementation.

**Work happened outside the plan** — the user says a feature is done but `tasks.md`
says otherwise. The record is now wrong, which poisons metrics and the retro.
Recommend reconciling `tasks.md` first (mark what actually shipped, with notes), then
continue normally.
