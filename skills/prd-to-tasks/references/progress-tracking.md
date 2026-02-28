# Progress Tracking

Standards for updating, querying, and reporting progress on the task list.

## Status Markers

Use these checkbox markers consistently throughout `tasks.md`:

| Status | Marker | Meaning | When to Use |
|--------|--------|---------|-------------|
| Not Started | `[ ]` | Work has not begun | Default state for all new tasks |
| In Progress | `[~]` | Actively being worked on | When work begins on a task |
| Completed | `[x]` | Done and verified | All acceptance criteria are met |
| Blocked | `[!]` | Cannot proceed | A dependency is unmet or an open question blocks work |
| Skipped | `[-]` | Intentionally not doing | Requirements changed or task is no longer relevant |

### Status Rules

1. **Only one "In Progress" per person** -- If working alone, only one task should be `[~]` at a time. Finish or block it before starting another.
2. **Blocked requires a reason** -- Always add a note explaining what is blocking and what needs to happen to unblock.
3. **Skipped requires a reason** -- Always add a note explaining why the task was skipped and referencing any PRD change or decision.
4. **Completed means verified** -- Do not mark `[x]` until acceptance criteria sub-checkboxes are all checked.

### Acceptance Criteria Sub-Checkboxes

Each task's acceptance criteria also use `[ ]` / `[x]`:

```markdown
- [x] **Create user registration endpoint** `[P0]` `[M]`
  - **Depends on**: Task 1.1
  - **Requirements**: FR-1, US-1
  - **Acceptance Criteria**:
    - [x] POST /api/users returns 201 with user object
    - [x] Validates email format and password strength
    - [x] Returns 409 if email already exists
    - [x] Passwords are hashed before storage
  - **Notes**: Completed 2025-03-15. Followed pattern in existing auth module.
```

## Updating the Task List

### When a Task Starts

1. Change `[ ]` to `[~]`
2. Optionally add a note with the start date

### When a Task Completes

1. Check off each acceptance criterion: `[ ]` -> `[x]`
2. Change the task marker from `[~]` to `[x]`
3. Optionally add a completion note with date and any relevant details

### When a Task Is Blocked

1. Change marker to `[!]`
2. Add a **Blocked** note:

```markdown
- [!] **Integrate payment provider** `[P0]` `[L]`
  - **Blocked**: Waiting on API credentials from vendor (requested 2025-03-10). Fallback: mock integration for testing.
```

### When a Task Is Skipped

1. Change marker to `[-]`
2. Add a **Skipped** note:

```markdown
- [-] **Add WebSocket real-time updates** `[P2]` `[XL]`
  - **Skipped**: Deprioritized per stakeholder review 2025-03-12. Moved to Future Considerations.
```

## Statistics Table

The overview section contains a statistics table. Update it whenever tasks change status:

```markdown
| Metric | Count |
|--------|-------|
| Total Tasks | 24 |
| Completed | 12 |
| In Progress | 2 |
| Blocked | 1 |
| Skipped | 1 |
| Not Started | 8 |
```

### Computing Statistics

Count tasks by their top-level checkbox marker:
- `[x]` = Completed
- `[~]` = In Progress
- `[!]` = Blocked
- `[-]` = Skipped
- `[ ]` = Not Started
- Total = sum of all above

Do **not** count acceptance criteria sub-checkboxes in the statistics. Only top-level task checkboxes.

## Phase Progress

Each phase header should include a progress indicator:

```markdown
## Phase 1: Foundation (8/10 tasks complete)
```

Update the count in the header when tasks in that phase change status.

## Progress Summary Command

When the user asks for a progress summary, produce a concise report:

```markdown
## Progress Summary -- <Project Name>

**Last Updated**: YYYY-MM-DD

### Overall: NN% complete (X/Y tasks)

| Phase | Total | Done | In Progress | Blocked | Not Started |
|-------|-------|------|-------------|---------|-------------|
| Phase 1: Foundation | 10 | 8 | 1 | 0 | 1 |
| Phase 2: Core Features | 14 | 4 | 1 | 1 | 8 |
| **Total** | **24** | **12** | **2** | **1** | **9** |

### Blocked Items
- Task 2.7: Integrate payment provider -- waiting on API credentials

### Current Focus
- Task 1.9: Phase 1 verification (in progress)
- Task 2.5: Search results component (in progress)

### Next Up
- Task 1.10: Phase 1 deployment
- Task 2.6: Search filters integration
```

This summary should be generated from the actual `tasks.md` content, not from memory.

## Lifecycle Integration

### With the PRD

- If PRD requirements change, update affected tasks in `tasks.md`
- Add new tasks for new requirements
- Mark tasks as `[-]` Skipped if their underlying requirement is removed
- Update traceability references (FR-N, US-N) if the PRD is renumbered

### With the Archive

When all tasks are complete:

1. Do a final progress summary
2. Confirm with the user that all phases are verified
3. The entire `plans/<name>/` folder (containing both `prd.md` and `tasks.md`) moves to `plans/archive/<name>/`

### Partial Progress

If work is paused or deprioritized:

- Keep the folder in `plans/<name>/` (not archived)
- Ensure `tasks.md` accurately reflects current state
- Add a note at the top of `tasks.md` indicating the pause:

```markdown
> **Status: Paused** -- Work paused on YYYY-MM-DD. See [reason]. Resume by [condition].
```
