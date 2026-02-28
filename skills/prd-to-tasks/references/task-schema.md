# Task Document Schema

Write the task list to `plans/<dasherized-name>/tasks.md`. Use this schema as the output structure. Every section is required unless marked optional. Adapt depth to match PRD complexity.

---

## Document Header

Start with a YAML-style metadata block in a comment, then the title:

```markdown
<!-- PRD: plans/<name>/prd.md -->
<!-- Generated: YYYY-MM-DD -->
<!-- Last Updated: YYYY-MM-DD -->

# Tasks: <Project Name>

> Brief (1-2 sentence) summary of what this task list covers, referencing the PRD.
```

## 1. Overview

### Project Summary

A concise paragraph restating the PRD's problem and solution. This orients anyone reading the task list without needing to re-read the full PRD.

### Scope Reference

- Link to the PRD: `plans/<name>/prd.md`
- List the PRD phases being decomposed
- Note any open questions from the PRD that affect task planning

### Task Statistics

A quick summary table updated as tasks are completed:

```markdown
| Metric | Count |
|--------|-------|
| Total Tasks | NN |
| Completed | NN |
| In Progress | NN |
| Blocked | NN |
| Not Started | NN |
```

## 2. Phase Sections

Create one section per implementation phase from the PRD. Each phase section follows this structure:

### Phase Header

```markdown
## Phase N: <Phase Name>

> One-line description of what this phase delivers.
> **Goal**: <What is independently deployable and valuable after this phase>
```

### Task Groups

Within each phase, group related tasks logically. Common groupings:

- **Data Layer** -- Schema changes, migrations, models
- **Backend / API** -- Server logic, endpoints, services
- **Frontend / UI** -- Components, pages, interactions
- **Integration** -- Connecting components, third-party services
- **Testing** -- Unit, integration, e2e tests for this phase
- **Infrastructure** -- CI/CD changes, configuration, deployment
- **Documentation** -- API docs, user-facing docs, runbooks

Not every group is needed in every phase. Only include groups that have tasks.

### Individual Task Format

Each task uses a checkbox with structured metadata:

```markdown
### <Group Name>

- [ ] **Task title** `[priority]` `[effort]`
  - **Depends on**: Task X.Y (or "None")
  - **Requirements**: FR-1, FR-3, US-2 (PRD references)
  - **Acceptance Criteria**:
    - [ ] First verifiable condition
    - [ ] Second verifiable condition
  - **Notes**: Any implementation hints, patterns to follow, or context from codebase discovery
```

**Field definitions:**

| Field | Required | Format | Description |
|-------|----------|--------|-------------|
| Task title | Yes | Short, imperative verb phrase | What to do (e.g., "Create user registration endpoint") |
| Priority | Yes | `[P0]`, `[P1]`, `[P2]` | Matches PRD priority. P0 = must-have, P1 = should-have, P2 = nice-to-have |
| Effort | Yes | `[S]`, `[M]`, `[L]`, `[XL]` | T-shirt size estimate. S=<1hr, M=1-2hr, L=2-4hr, XL=4-8hr (break XL down further if possible) |
| Depends on | Yes | Task reference or "None" | Which task(s) must complete before this one can start |
| Requirements | Yes | PRD section references | Traceability back to specific functional requirements (FR-N), user stories (US-N), or non-functional requirements (NFR-N) from the PRD |
| Acceptance Criteria | Yes | Sub-checkboxes | Verifiable conditions. Derived from PRD acceptance criteria and requirements. Each criterion is independently checkable. |
| Notes | No | Free text | Implementation guidance, patterns to follow, files to modify, gotchas |

### Task Numbering

Use hierarchical numbering for easy reference:

- Phase tasks: `N.M` where N = phase number, M = sequential task number
- Example: Task 1.3 = Phase 1, Task 3
- Reference format in dependencies: "Task 1.3" or "Tasks 1.3, 1.4"

### Phase Completion Task

Every phase must end with a verification task:

```markdown
- [ ] **Phase N verification: integration test and quality gates** `[P0]` `[M]`
  - **Depends on**: All prior tasks in Phase N
  - **Requirements**: PRD Section 7 (Testing Strategy)
  - **Acceptance Criteria**:
    - [ ] All Phase N tasks are complete
    - [ ] All existing tests pass (`<test command>`)
    - [ ] Lint checks pass (`<lint command>`)
    - [ ] Type checks pass (`<typecheck command>`)
    - [ ] Build succeeds (`<build command>`)
    - [ ] Phase N features are independently deployable
    - [ ] Manual verification of key user flows for this phase
```

## 3. Dependency Graph (Optional)

For complex projects with many inter-task dependencies, include a text-based dependency summary:

```markdown
## Dependency Graph

Task 1.1 (DB schema)
├── Task 1.2 (Models)
│   ├── Task 1.3 (API endpoints)
│   │   └── Task 1.5 (API tests)
│   └── Task 1.4 (Validation)
└── Task 1.6 (Migration script)

Task 2.1 (UI components) ── depends on ── Task 1.3
```

This is especially useful when tasks span phases.

## 4. Risk-Derived Tasks

Map PRD risks to concrete mitigation tasks. These may appear within phases or as standalone tasks:

```markdown
## Risk Mitigation Tasks

- [ ] **Implement rate limiting for auth endpoints** `[P0]` `[M]`
  - **Risk**: PRD Risk #2 (brute force attacks)
  - **Acceptance Criteria**:
    - [ ] Rate limiter configured per PRD specifications
    - [ ] Returns 429 with retry-after header when limit exceeded
    - [ ] Rate limit state survives server restart
```

## 5. Open Questions Impact

List any PRD open questions that affect task planning and what happens if they remain unresolved:

```markdown
## Open Questions Impacting Tasks

| PRD Question | Affected Tasks | Default if Unresolved |
|-------------|---------------|----------------------|
| Q1: Auth provider choice | Tasks 1.2, 1.3, 1.4 | Proceed with OAuth2 + local fallback |
| Q3: Data retention policy | Task 2.6 | Default to 90-day retention |
```

## 6. Future Considerations (Optional)

Tasks that are explicitly out of scope for this PRD but were noticed during decomposition. These are NOT tracked for progress -- they are informational.

```markdown
## Future Considerations

- Potential optimization: batch processing for bulk imports (related to FR-8)
- Consider adding WebSocket support for real-time updates (deferred per PRD non-goals)
```
