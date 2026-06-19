# Plan helper scripts

Two deterministic helpers that read a `plans/<name>/tasks.md` document and
report on it, so skills can **run the script and interpret the result** instead
of hand-counting checkbox markers or eyeballing dependencies.

| Script | Does | Output |
|--------|------|--------|
| `plan-metrics.py` | Status totals, effective completion rate, per-phase breakdown | JSON (or `--format text`) |
| `plan-validate.py` | Lints a task list for structural problems | JSON (or `--format text`) |

Both share one parser, [`plan_tasks.py`](plan_tasks.py), so they agree on what a
task is. They use the **Python 3 standard library only** — no `pip install`, no
Bun/Node. Run them with `python3`.

These scripts are referenced by `plan-retrospective`'s metrics-guide,
`prd-to-tasks`'s decomposition-guide and progress-tracking, and
`release-checklist`'s checklist-schema. The markers, priorities, effort sizes,
and requirement labels they recognise are defined once in
[`../references/conventions.md`](../references/conventions.md).

## Usage

```bash
# From a path
python3 plan-metrics.py  plans/<name>/tasks.md
python3 plan-validate.py plans/<name>/tasks.md

# From stdin
python3 plan-metrics.py < plans/<name>/tasks.md

# Human-readable instead of JSON
python3 plan-metrics.py  plans/<name>/tasks.md --format text
python3 plan-validate.py plans/<name>/tasks.md --format text

# Check requirement coverage against the PRD (otherwise the Requirements
# Coverage matrix in tasks.md is used, if present)
python3 plan-validate.py plans/<name>/tasks.md --prd plans/<name>/prd.md
```

The scripts live together in `skills/_shared/scripts/`; keep `plan_tasks.py`
alongside them. Invoke them by their path within the installed skill collection
(a sibling of the skill folders, next to `_shared/references/`).

## Input format

The parser follows the task document schema (`prd-to-tasks`'s task-schema) and
the shared conventions. The contract:

- **A top-level task** is a checkbox at the **left margin** (no indentation):

  ```markdown
  - [ ] **Task 1.1: Title** `[P0]` `[M]`
    - **Depends on**: Task 1.0 (or "None")
    - **Requirements**: FR-1, US-2
    - **Acceptance Criteria**:
      - [ ] A verifiable condition
    - **Notes**: free text
  ```

- **Status markers** (the character in the checkbox):
  `[ ]` not started · `[~]` in progress · `[x]` completed · `[!]` blocked ·
  `[-]` skipped. Any other marker is reported as `unknown` and is excluded from
  the totals.
- **Acceptance-criteria sub-checkboxes are indented** under their task, so they
  are never counted as tasks — only the left-margin checkbox counts.
- **Phases** are `## ` headings (`## Phase 1: Foundation`). Each task is
  attributed to the nearest preceding `## ` heading. A trailing
  `(8/10 tasks complete)` annotation on the heading is ignored. Tasks before any
  `## ` heading are grouped as `(ungrouped)`.
- **Metadata sub-fields** are bolded list items: `- **Requirements**: …`,
  `- **Depends on**: …`, `- **Blocked**: …`, `- **Skipped**: …`,
  `- **Risk**: …`, `- **Notes**: …`.
- **Task ids** are read from an explicit `Task N.M` in the title when present
  (e.g. `**Task 1.1: …**`); otherwise the parser assigns the phase-and-position
  id `N.M` the schema prescribes (phase number + the task's order within the
  phase). For dependency checks on plans with skipped/renumbered tasks, put the
  id in the title so references resolve unambiguously.
- **Dependencies** are the `N.M` references inside the `Depends on` field
  (`Depends on: Task 1.3` or `Tasks 1.3, 1.4`); `None` means no dependency.
- **Requirement labels** are `FR-N`, `NFR-N`, `US-N`, `QG-N` (and `RISK-N` for
  risk tasks), recognised in the `Requirements` field and the Requirements
  Coverage matrix.
- Content inside fenced code blocks (```` ``` ````) is ignored, so example
  checkboxes in a narrative are not miscounted.

[`sample-tasks.md`](sample-tasks.md) is a complete, runnable example.

## `plan-metrics.py` output

```json
{
  "source": "sample-tasks.md",
  "totals": {
    "completed": 4, "in_progress": 2, "blocked": 1, "skipped": 1,
    "not_started": 2, "total": 10, "unknown": 0
  },
  "completion_rate": 0.4444,
  "completion_rate_pct": 44.4,
  "completion_rate_excludes_skipped": true,
  "phases": [
    {
      "name": "Phase 1: Foundation",
      "completed": 2, "in_progress": 1, "blocked": 0, "skipped": 0,
      "not_started": 1, "total": 4,
      "completion_rate": 0.5, "completion_rate_pct": 50.0
    }
  ]
}
```

- `total` is the sum of the five canonical buckets; `unknown` (bad markers) is
  reported separately and not included in `total`.
- `completion_rate` = `completed / (total − skipped)`. Skipped tasks are
  excluded from the denominator because they were intentionally removed from
  scope. It is `null` when the denominator is zero.
- `completion_rate_pct` is that rate as a percentage rounded to one decimal.

Exit code: `0` on success, `2` on a usage/I-O error.

## `plan-validate.py` output

Text form on `sample-tasks.md`:

```text
Plan validation: sample-tasks.md
  10 task(s), 2 error(s), 4 warning(s)

  x blocked-missing-note [task 2.3]: Blocked task [!] has no Blocked note explaining the blocker
  x skipped-missing-note [task 2.4]: Skipped task [-] has no Skipped note explaining the reason
  ! missing-requirements [task 2.5]: Task has no Requirements field (traceability to the PRD is missing)
  ! multiple-in-progress [tasks 1.3, 2.2]: 2 tasks are marked [~] in progress; the one-in-progress rule allows only one at a time
  ! backward-dependency [task 2.3]: Task 2.3 depends on later-defined task 2.4 (dependencies should point at earlier tasks)
  ! unreferenced-requirement [FR-7]: Requirement FR-7 is declared (Requirements Coverage matrix) but no task lists it in its Requirements field
```

JSON form returns the same findings as objects with `severity`, `type`,
`message`, and references (`task`/`tasks`/`requirement`, plus `line`), under a
`summary` with `errors`/`warnings`/`tasks` counts and an `ok` boolean.

### Checks

| Type | Severity | Flags |
|------|----------|-------|
| `missing-requirements` | warning | A task with no `Requirements` field (a `Risk` field exempts risk-mitigation tasks) |
| `unreferenced-requirement` | warning | A requirement in the coverage matrix (or `--prd`) that no task lists |
| `multiple-in-progress` | warning | More than one `[~]` task (the one-in-progress rule) |
| `blocked-missing-note` | error | A `[!]` task with no `Blocked` note |
| `skipped-missing-note` | error | A `[-]` task with no `Skipped` note |
| `backward-dependency` | warning | A task that depends on a later-defined task |
| `circular-dependency` | error | A dependency cycle (`A → B → … → A`) |
| `self-dependency` | error | A task that depends on itself |
| `unknown-dependency` | error | A `Depends on` reference to a task id that does not exist |
| `unknown-status-marker` | warning | A checkbox marker other than `[ ] [~] [x] [!] [-]` |

Exit code: `0` when clean or only warnings, `1` when any **error** is present,
`2` on a usage/I-O error. `--strict` makes warnings count toward exit `1` too.
The JSON report is printed regardless of exit code, so a skill can always parse
it.
