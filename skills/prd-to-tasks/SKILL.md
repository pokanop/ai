---
name: prd-to-tasks
description: Convert a Product Requirements Document (PRD) into a detailed, actionable task list with progress tracking. Use when the user asks to "create tasks from a PRD", "break down a PRD", "generate a task list", "plan implementation", "create an implementation plan from requirements", or needs to turn an existing PRD into trackable development tasks. Reads the PRD from plans/<name>/prd.md and produces a comprehensive tasks.md in the same directory with hierarchical task decomposition, dependency mapping, effort estimation, and progress tracking.
---

# PRD to Tasks

## Purpose

This skill is the companion to **create-a-prd**. It takes a completed PRD at `plans/<name>/prd.md` and produces a comprehensive, trackable task list at `plans/<name>/tasks.md`. The task list bridges the gap between "what to build" (the PRD) and "how to build it" (the implementation).

## File Structure

The task list lives alongside the PRD it was derived from:

```
plans/
├── user-authentication/
│   ├── prd.md          # Created by create-a-prd
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

- Always read the PRD from `plans/<name>/prd.md` before generating tasks
- Always write the task list to `plans/<name>/tasks.md` in the same directory as the PRD
- If `tasks.md` already exists, read it first -- this may be an update, not a fresh generation
- Never modify the PRD. The task list is a derivative artifact.

## Workflow

### Phase 1: PRD Analysis

Read and deeply analyze the PRD. Extract:

1. **Scope boundaries** -- Goals, non-goals, and explicit constraints
2. **Requirements inventory** -- Every functional and non-functional requirement
3. **User stories** -- All stories with their acceptance criteria and priorities (P0, P1, P2)
4. **Implementation phases** -- The phased rollout plan from the PRD
5. **Architecture signals** -- Components, integration points, data flows, new dependencies
6. **Testing requirements** -- Testing strategy and quality gates
7. **Risks** -- Technical and operational risks that may require dedicated tasks
8. **Open questions** -- Unresolved items that block or influence tasks

If the PRD is missing critical sections or is too vague to decompose, stop and tell the user. Do not fabricate tasks from ambiguous requirements. Ask the user to update the PRD first using the `create-a-prd` skill.

### Phase 2: Codebase Context

If a codebase exists, gather context to make tasks concrete. This mirrors the create-a-prd discovery but focuses on implementation specifics:

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

**Status values:**

| Status | Marker | Meaning |
|--------|--------|---------|
| Not Started | `[ ]` | Work has not begun |
| In Progress | `[~]` | Actively being worked on |
| Completed | `[x]` | Done and verified |
| Blocked | `[!]` | Cannot proceed -- see notes |
| Skipped | `[-]` | Intentionally not doing (with reason) |

When the user asks to "update tasks", "mark tasks done", "check progress", or "update the task list", read the existing `tasks.md`, apply the requested changes, and write it back. Always preserve the full document structure -- never truncate or drop sections when updating.

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
