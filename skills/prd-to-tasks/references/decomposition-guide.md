# Decomposition Guide

How to break a PRD into well-formed, actionable tasks. This guide provides a systematic approach to ensure nothing is missed and every task is traceable to the PRD.

## Decomposition Strategy

### Step 1: Extract the Requirement Inventory

Read the PRD and build an inventory of everything that needs to be implemented. Number each item for traceability:

| Source | Label Prefix | What to Extract |
|--------|-------------|-----------------|
| Functional Requirements | FR-N | Each numbered requirement |
| Non-Functional Requirements | NFR-N | Each performance, security, accessibility target |
| User Stories | US-N | Each user story (with its acceptance criteria) |
| Quality Gates | QG-N | Each lint, test, format, build check |
| Risks (with mitigation tasks) | RISK-N | Each risk that requires implementation work |

Keep this inventory as a mental checklist. Every item must appear in at least one task. After generating tasks, cross-reference -- if an FR, NFR, US, or QG has no corresponding task, something is missing.

### Step 2: Follow the PRD's Phase Structure

The PRD defines implementation phases. Respect them:

1. Read the PRD's "Implementation Plan > Phased Rollout" section
2. Create one task group per phase
3. Within each phase, only include tasks for the scope defined by that phase
4. Do not pull Phase 2 work into Phase 1 for "convenience"

If the PRD does not define phases, create them. A reasonable default:

- **Phase 1 (Foundation)**: Data layer, core models, basic API
- **Phase 2 (Core Features)**: Primary user-facing functionality
- **Phase 3 (Polish)**: Error handling, edge cases, performance optimization
- **Phase 4 (Quality)**: Comprehensive testing, documentation, deployment prep

### Step 3: Decompose by Layer

Within each phase, break work into layers. Process each layer in order because they naturally form dependency chains:

#### Layer 1: Data and Schema

- Database schema changes or new tables/collections
- Migration scripts
- Seed data or fixtures
- Data validation schemas (Zod, Joi, etc.)

**Source**: PRD Solution Design (architecture, data flow), Functional Requirements (data storage needs)

#### Layer 2: Core Logic and Services

- Business logic modules
- Service layers
- Utility functions
- External service integrations

**Source**: PRD Functional Requirements, Solution Design (key decisions, approach)

#### Layer 3: API / Interface

- API endpoints (REST, GraphQL, RPC)
- Request/response handling
- Authentication and authorization middleware
- Error handling and response formatting

**Source**: PRD Functional Requirements, Non-Functional Requirements (response times, error formats)

#### Layer 4: UI / Frontend

- Page or view components
- Forms and user inputs
- State management changes
- Navigation and routing changes

**Source**: PRD User Stories, Functional Requirements (user-facing behavior)

#### Layer 5: Integration

- Connecting frontend to backend
- Third-party service hookup
- Feature flags
- Configuration and environment variables

**Source**: PRD Solution Design (integration points), Implementation Plan (migration and compatibility)

#### Layer 6: Testing

- Unit tests for core logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance benchmarks if specified in NFRs

**Source**: PRD Testing Strategy, Quality Gates

#### Layer 7: Infrastructure and Deployment

- CI/CD pipeline changes
- Monitoring and alerting setup
- Documentation (API docs, runbooks)
- Deployment configuration

**Source**: PRD Implementation Plan (tech stack alignment), Risks and Mitigations (operational risks)

Not every layer applies to every phase. Skip layers that have no tasks for a given phase.

### Step 4: Size Tasks Correctly

A well-sized task is:

- **Completable in a focused session** (1-4 hours of work)
- **Independently verifiable** (you can check if it's done without other tasks)
- **Single-responsibility** (one deliverable: one file, one endpoint, one component)

**Sizing heuristics:**

| Size | Typical Scope | When to Use |
|------|--------------|-------------|
| S (<1hr) | Config change, simple utility, small fix | One file, straightforward change |
| M (1-2hr) | Single endpoint, one component, one test suite | Clear scope, known pattern |
| L (2-4hr) | Complex feature component, multi-file changes | Some unknowns, moderate complexity |
| XL (4-8hr) | Cross-cutting concern, major integration | **Try to break this down further** |

**Breaking down XL tasks:**

If a task feels XL, ask:
1. Can the work be split by data flow stage? (validate -> process -> persist -> respond)
2. Can it be split by happy path vs error handling?
3. Can it be split by minimal implementation vs full implementation?
4. Can the test be a separate task from the implementation?

### Step 5: Map Dependencies

Dependencies determine execution order. Get them wrong and work gets blocked.

**Rules for dependencies:**

1. **Only direct dependencies** -- If A depends on B which depends on C, task A's dependency is B, not C
2. **Be specific** -- "Depends on Task 1.3" not "Depends on data layer being done"
3. **Cross-phase dependencies** are valid -- A Phase 2 task can depend on a Phase 1 task
4. **No circular dependencies** -- If you find one, you have a decomposition problem. Re-examine the tasks.
5. **Minimize dependencies** -- If a task can be done in parallel with another, don't create an artificial dependency

**Common dependency patterns:**

```
Schema → Model → Service → Endpoint → Test
                                    → UI Component → Integration Test
Config → Feature flag → All gated features
```

### Step 6: Write Acceptance Criteria

Every task needs acceptance criteria derived from the PRD. Good criteria are:

- **Binary** -- Pass or fail, no ambiguity
- **Observable** -- Can be verified by running code, checking output, or reading a file
- **Specific** -- Reference concrete values, behaviors, or states

```diff
- Works correctly
+ Returns 200 with user object when valid credentials are provided

- Handles errors
+ Returns 401 with error code "INVALID_CREDENTIALS" when password is wrong
+ Returns 429 with retry-after header when rate limit is exceeded

- Tests pass
+ All existing tests continue to pass (npm test exits 0)
+ New endpoint has >80% branch coverage in unit tests
```

**Deriving from PRD:**

| PRD Source | Becomes Task AC |
|-----------|-----------------|
| User story acceptance criteria | Directly mapped to relevant task ACs |
| Functional requirement | Specific behavior check in task AC |
| Non-functional requirement | Measurable performance/quality check |
| Quality gate | "All lint/test/build commands pass" in phase verification task |

### Step 7: Cross-Reference and Validate

After generating all tasks, validate:

1. **Coverage check**: Every FR, NFR, US, and QG from the PRD has at least one task
2. **Scope check**: No task exists that cannot trace back to a PRD requirement (no gold-plating)
3. **Dependency check**: No circular dependencies; critical path is reasonable
4. **Phase check**: Each phase ends with a verification task; each phase is independently deployable
5. **Size check**: No tasks estimated as XL remain; all are broken down to L or smaller
6. **Test check**: Every feature task has corresponding test coverage (either as a sub-criterion or a dedicated test task)

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Tasks too large | Multiple acceptance criteria with unrelated concerns | Split into focused tasks |
| Tasks too small | Dozens of trivial tasks that clutter tracking | Merge related micro-tasks |
| Missing test tasks | Feature tasks without any test coverage | Add test task for every feature group |
| Phantom dependencies | Tasks marked as dependent when they could run in parallel | Review: does B truly need A's output? |
| Gold-plating | Tasks for "nice improvements" not in the PRD | Move to Future Considerations |
| Vague acceptance criteria | "It should work" instead of specific checks | Rewrite with concrete, observable conditions |
| Ignoring non-functional requirements | Only functional tasks, no perf/security/a11y tasks | Review NFRs and create dedicated tasks |
