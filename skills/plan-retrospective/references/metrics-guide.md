# Metrics Guide

How to compute completion, coverage, and scope drift metrics for a plan retrospective. All metrics are derived from `tasks.md` and `prd.md`.

---

## Completion Metrics

Derived from `tasks.md`. Count top-level task checkboxes only — do not count acceptance criteria sub-checkboxes.

### Task Counts

Scan `tasks.md` for all top-level task lines (`- [ ]`, `- [x]`, `- [~]`, `- [!]`, `- [-]`):

| Status | Marker | Count as |
|--------|--------|----------|
| Completed | `[x]` | Completed |
| In Progress | `[~]` | In Progress (treat as incomplete for retro metrics) |
| Blocked | `[!]` | Blocked |
| Skipped | `[-]` | Skipped |
| Not Started | `[ ]` | Not Started |

**Total tasks** = sum of all status counts

### Completion Rate

```
Effective completion rate = Completed / (Total − Skipped)
```

Exclude skipped tasks from the denominator because they were intentionally removed from scope. Including them would penalize deliberate scope decisions.

**Example:**
- Total: 20 tasks
- Completed: 16
- Skipped: 3 (intentionally deferred)
- Blocked: 1

Effective completion = 16 / (20 − 3) = 16 / 17 = **94%**

### Phase Breakdown

Compute completion rate separately for each phase section in `tasks.md`. Phases are identified by headings like `## Phase 1: Foundation`.

```
Phase N completion = Phase N completed / (Phase N total − Phase N skipped)
```

---

## Requirements Coverage Metrics

Derived by cross-referencing `prd.md` requirements with `tasks.md` task entries.

### Step 1: Build the Requirements Inventory

From `prd.md`, extract every labeled requirement:
- Functional Requirements: `FR-1`, `FR-2`, ... `FR-N`
- Non-Functional Requirements: `NFR-1`, `NFR-2`, ...
- User Stories: `US-1`, `US-2`, ...
- Quality Gates: `QG-1`, `QG-2`, ...

**Total requirements** = count of unique labels

### Step 2: Check Coverage in tasks.md

For each requirement label, search `tasks.md` for it in the "Requirements" field of tasks. Classify:

| Coverage State | Definition |
|---------------|------------|
| **Fully covered** | At least one `[x]` completed task lists this requirement |
| **Partially covered** | A task lists this requirement but is `[!]` blocked or `[ ]` not started |
| **Skipped** | A task lists this requirement but is `[-]` skipped — intentionally deferred |
| **Not covered** | No task in `tasks.md` references this requirement |

### Coverage Metrics to Report

```
Requirements covered    = count of fully covered requirement labels
Requirements partial    = count of partially covered requirement labels
Requirements deferred   = count of requirements only in skipped tasks
Requirements not tasked = count of requirements with no corresponding task
Coverage rate           = fully covered / total requirements
```

---

## Scope Drift Metrics

Scope drift measures the gap between the plan and the execution, in both directions.

### Additions (Built Beyond the PRD)

Find tasks in `tasks.md` whose "Requirements" field lists no PRD label (no `FR-N`, `US-N`, `NFR-N`, or `QG-N` reference), or tasks with a note that they were added during implementation.

For each addition, determine whether it was:
- **Intentional** — the user decided to add it during implementation (note this in the retro)
- **Accidental** — gold-plating that crept in without a decision (flag this in "What to Improve")

**Additions count** = tasks with no PRD traceability and status `[x]`

### Deferrals (Planned but Skipped)

Find tasks with status `[-]` (Skipped). For each:
- What requirement(s) does it cover?
- Why was it skipped (from the task's note)?
- Where does it go next?

**Deferrals count** = count of `[-]` tasks

### PRD Requirements Never Tasked

Requirements in the PRD inventory (Step 1 above) that have no corresponding task in `tasks.md` at all. These represent gaps in the original decomposition.

**Missing task count** = count of requirements with "Not covered" classification

---

## Effort Estimation Accuracy (Optional)

When tasks have `[S]`, `[M]`, `[L]`, `[XL]` effort labels and task notes recorded actual completion time or noted re-estimates, compute:

- How many tasks were estimated correctly?
- How many were underestimated (task notes indicate it took longer than expected)?
- Were `[XL]` tasks broken down, or did they stay large?

This metric is optional and only useful when actual effort data was captured in task notes.

---

## Metrics Table Template

```markdown
| Metric | Value |
|--------|-------|
| Total tasks | NN |
| Completed `[x]` | NN |
| In Progress `[~]` | NN |
| Blocked `[!]` | NN |
| Skipped `[-]` | NN |
| Not started `[ ]` | NN |
| Effective completion rate | NN% |
| PRD requirements (total) | NN |
| Fully covered | NN (NN%) |
| Partially covered / blocked | NN |
| Deferred (skipped tasks) | NN |
| Not tasked (decomposition gap) | NN |
| Additions beyond PRD | NN |
```

Fill in the values, then add one sentence of interpretation for any metric that is outside of what a typical plan achieves (i.e., below 80% completion or above 10% scope additions).
