---
name: design-to-tasks
description: Convert a design or Product Requirements Document (PRD) into a detailed, actionable task list with progress tracking. Use when the user asks to turn a "design to tasks", "create tasks from a design", "break down a design", "create tasks from a PRD", "break down a PRD", "generate a task list", "plan implementation", or "create an implementation plan from requirements". Reads the design from plans/<name>/design.md when present and otherwise falls back to the PRD at plans/<name>/prd.md, then produces a comprehensive tasks.md in the same directory with hierarchical task decomposition, dependency mapping, effort estimation, and progress tracking.
license: MIT
metadata:
  author: pokanop
  version: "2.0"
---

# Design to Tasks

## Purpose

This skill is the third step in the build pipeline:

```
idea-to-prd  →  prd-to-design  →  design-to-tasks  →  tasks-to-code
  (what/why)      (architecture)     (task list)         (build)
```

It takes the architecture produced by **prd-to-design** — `plans/<name>/design.md` — and produces a comprehensive, trackable task list at `plans/<name>/tasks.md`. When no design exists (the design step is optional for simple features), it **falls back to the PRD** at `plans/<name>/prd.md`, so the chain still works as `idea-to-prd → design-to-tasks`. Either way, the PRD remains the authority for requirements and traceability. The task list bridges the gap between "what to build" (the PRD/design) and "how to build it" (the implementation).

## File Structure

The task list lives alongside the design and PRD it was derived from:

```
plans/
├── user-authentication/
│   ├── prd.md          # Created by idea-to-prd
│   ├── design.md       # Created by prd-to-design (optional)
│   ├── adr/            # Created by prd-to-design (optional)
│   └── tasks.md        # Created by this skill
├── search-improvements/
│   ├── prd.md
│   └── tasks.md
└── archive/
    └── onboarding-flow/
        ├── prd.md
        └── tasks.md
```

**Rules:**

- Read `plans/<name>/design.md` first when it exists; otherwise fall back to `plans/<name>/prd.md`. Always read the PRD too — it is the authority for requirements and traceability.
- Always write the task list to `plans/<name>/tasks.md` in the same directory
- If `tasks.md` already exists, read it first -- this may be an update, not a fresh generation
- Never modify the design or the PRD. The task list is a derivative artifact.

## Workflow

### Phase 1: Design and PRD Analysis

If `plans/<name>/design.md` exists, read it first — it is the primary input. The design turns the PRD's *what/why* into *how*: component boundaries, API/data contracts, sequence flows, and the key decisions (with the ADRs under `plans/<name>/adr/`) that the tasks must implement. Decompose along the component and contract boundaries the design defines, and add a task for each architecture decision that needs building.

Always read the PRD as well, whether or not a design exists — it is the authority for requirements, acceptance criteria, and traceability. When there is no design (the design step is optional for simple features), the PRD is the sole input and decomposition proceeds straight from it.

Read and deeply analyze the design and PRD. Extract:

1. **Scope boundaries** -- Goals, non-goals, and explicit constraints
2. **Requirements inventory** -- Every functional and non-functional requirement
3. **User stories** -- All stories with their acceptance criteria and priorities (P0, P1, P2)
4. **Implementation phases** -- The phased rollout plan from the PRD
5. **Architecture signals** -- Components, integration points, data flows, new dependencies
6. **Testing requirements** -- Testing strategy and quality gates
7. **Risks** -- Technical and operational risks that may require dedicated tasks
8. **Open questions** -- Unresolved items that block or influence tasks

If the PRD is missing critical sections or is too vague to decompose, stop and tell the user. Do not fabricate tasks from ambiguous requirements. Ask the user to update the PRD first using the `idea-to-prd` skill.

**Critical sections required for decomposition** (task generation cannot proceed without these):

1. **Goals** -- Without goals, tasks have no direction
2. **Functional Requirements with FR-N labels** -- Without labeled requirements, tasks cannot be traced
3. **User Stories with acceptance criteria** -- Without acceptance criteria, tasks have no "done" condition
4. **Implementation Plan with phases** -- Without phases, tasks cannot be grouped or ordered
5. **Testing Strategy** -- Without test expectations, verification tasks cannot be defined

If the PRD has requirements but they lack `FR-N`/`NFR-N`/`US-N` labels, number them yourself during analysis and note that you've done so. Traceability is non-negotiable.

### Phase 2: Codebase Context

If a codebase exists, gather context to make tasks concrete. If the `idea-to-prd` skill was used, much of this context may already be captured in the PRD's tech stack alignment section. Supplement as needed, focusing on implementation specifics.

For the full discovery checklist, see the idea-to-prd skill's [codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md). For task decomposition, focus on:

- **Existing patterns** -- How similar features were built before (file locations, naming, module boundaries)
- **Test patterns** -- Where tests live, how they're structured, what utilities exist
- **Build and CI** -- What commands exist, what checks will tasks need to pass
- **Migration patterns** -- How schema changes, data migrations, or feature flags are handled

This context makes the difference between generic tasks ("add authentication") and actionable tasks ("add auth middleware in `src/middleware/` following the pattern in `rate-limiter.ts`").

### Phase 3: Task Decomposition

Break the PRD into tasks following the decomposition guide in [references/decomposition-guide.md](references/decomposition-guide.md). Key principles:

1. **Respect PRD phases** -- Tasks are grouped by the implementation phases defined in the PRD
2. **One deliverable per task** -- Each task produces a single, verifiable output (a file, a test, a migration, a config change)
3. **Explicit dependencies** -- If task B requires task A, say so
4. **Testability** -- Every task has a clear "done" condition derived from the PRD's acceptance criteria
5. **Right-sized** -- Tasks should be completable in a focused work session (roughly 1-4 hours). If a task feels larger, break it down further.

Generate the task list using the schema in [references/task-schema.md](references/task-schema.md).

**Task count heuristics** (sanity check, not hard rules):
- Roughly 3-8 tasks per PRD phase
- Roughly 1-2 tasks per functional requirement
- If you have fewer than 5 total tasks, the decomposition is probably too coarse
- If you have more than 40 total tasks, consider whether the PRD should be split

### Phase 3.5: Cross-Reference Validation

Before presenting the task list, validate completeness:

1. **Coverage check**: Build a mental inventory of every `FR-N`, `NFR-N`, `US-N`, and `QG-N` from the PRD. Every item must appear in at least one task's "Requirements" field. If any requirement has no corresponding task, add it or explain why it's covered implicitly.
2. **Scope check**: Every task must trace back to a PRD requirement. If a task cannot be traced, it is gold-plating -- move it to Future Considerations or remove it.
3. **Dependency check**: No circular dependencies. The critical path must be reasonable.
4. **Phase check**: Each phase ends with a verification task. Each phase is independently deployable.
5. **Size check**: No XL tasks remain. All are broken down to L or smaller.
6. **Test check**: Every feature task has corresponding test coverage.

Then run the deterministic validator on the generated file — it catches structural problems (dependency cycles, unknown dependency references, missing Requirements fields, coverage gaps) mechanically instead of by eye:

```bash
python3 skills/_shared/scripts/plan-validate.py plans/<name>/tasks.md --prd plans/<name>/prd.md
```

Fix every error and warning it reports (see `skills/_shared/scripts/README.md` for the check list and output format).

This validation is mandatory. Do not present the task list until all checks pass — the mental checks *and* a clean `plan-validate.py` run.

### Phase 4: Review and Refinement

Present the task list to the user and ask for feedback:

- Are the task sizes appropriate? Too granular or too coarse?
- Are dependencies correctly identified?
- Are effort estimates reasonable?
- Are any tasks missing for requirements in the PRD?
- Should any tasks be re-prioritized or re-ordered?

Iterate until the user confirms the task list is complete.

## Progress Tracking

The task list is a living document. As implementation progresses, the agent (or the user) updates task statuses directly in `tasks.md`. See [references/progress-tracking.md](references/progress-tracking.md) for the tracking conventions.

**Status values:** the canonical task status markers (`[ ]`, `[~]`, `[x]`, `[!]`, `[-]`) and their meanings are defined in [shared conventions](../_shared/references/conventions.md#task-status-markers). Use them exactly as written there.

When the user asks to "update tasks", "mark tasks done", "check progress", or "update the task list", read the existing `tasks.md`, apply the requested changes, and write it back. Always preserve the full document structure -- never truncate or drop sections when updating.

## Handling PRD or Design Changes

If the PRD is revised (via `idea-to-prd`'s change protocol) or the design is revised (via `prd-to-design`'s design-change protocol) after `tasks.md` has been generated:

1. **Read the updated document(s)** and identify what changed (new requirements, removed requirements, modified scope, revised contracts or boundaries, superseded ADRs)
2. **Incremental update** (preferred): Add tasks for new requirements or reworked contracts, mark removed-requirement tasks as `[-]` Skipped with a note, update affected acceptance criteria. For a superseded ADR, assess each completed task built on the old decision — still valid, needs a rework task, or acceptable divergence (noted in `decisions.md`).
3. **Full re-generation**: Only when changes are so extensive that incremental updates would be more confusing (e.g., phases restructured, >50% of requirements changed). Preserve completed task statuses from the old version.
4. **Always update** the requirements coverage to ensure traceability remains intact after changes, and re-run `plan-validate.py` (Phase 3.5) on the updated file

## Key Principles

**Traceability.** Every task must trace back to a specific PRD requirement, user story, or quality gate. If a task cannot be traced, it is either missing from the PRD (flag this) or out of scope (remove it).

**No gold-plating.** Only create tasks for what the PRD requires. Do not add tasks for features, refactors, or improvements not in the PRD. If you see an opportunity, note it in the "Future Considerations" section -- do not add it as a task.

**Dependencies are first-class.** Incorrect dependency ordering is the most common source of blocked work. Map dependencies carefully and flag circular dependencies as errors.

**Phases are milestones.** Each phase boundary is a natural checkpoint. The last task in every phase should be a verification/integration task that confirms the phase is complete and independently deployable.

**Testing is not optional.** Every feature task should have a corresponding test task (or testing built into its acceptance criteria). The PRD's testing strategy must be fully represented in the task list.

## References

- [references/task-schema.md](references/task-schema.md) -- Full task document structure with section-by-section guidance
- [references/decomposition-guide.md](references/decomposition-guide.md) -- How to break a PRD into well-formed tasks
- [references/progress-tracking.md](references/progress-tracking.md) -- Status conventions, update workflows, and summary reporting
- `../_shared/scripts/README.md` -- `plan-validate.py` / `plan-metrics.py`: deterministic task-list validation and metrics
- [../_shared/references/conventions.md](../_shared/references/conventions.md) -- Shared markers, priority, effort, labels, and the `plans/` layout (single source of truth)
