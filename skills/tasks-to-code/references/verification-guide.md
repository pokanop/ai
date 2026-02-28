# Verification Guide

How to confirm a task is complete before marking it `[x]`. Verification is not optional — a task is not done until every step in this guide passes.

## The Verification Sequence

Run these steps in order. Do not skip steps or reorder them.

### Step 1: Run All Quality Gates

Run every quality gate command discovered for the project during Phase 2 (discovery). Quality gates are additive — every gate must pass, not just the ones relevant to the task.

**Common gate commands (adapt to the project's actual package manager and toolchain):**

```
# JavaScript / TypeScript (Bun example)
bun run check      # Type checking
bun run format     # Formatting verification
bun run lint       # Linting
bun run test       # Test suite
bun run build      # Build

# JavaScript / TypeScript (npm/yarn/pnpm)
npm run typecheck
npm run lint
npm run test
npm run build

# Python
ruff check .
mypy .
pytest

# Rust
cargo fmt --check
cargo clippy
cargo test
cargo build

# Go
go vet ./...
go test ./...
go build ./...
```

**If a quality gate fails:**

1. Fix the failure before proceeding. Do not mark the task `[x]` with a failing gate.
2. If the failure is in code not touched by this task (a pre-existing failure), document it in `decisions.md` and surface it to the user before proceeding. Do not silently ignore it; do not fix it as part of this task unless the task explicitly covers it.

### Step 2: Check Acceptance Criteria

Step through each acceptance criterion in the task one by one. Verify each concretely:

| Criterion type | How to verify |
|---------------|---------------|
| "Returns X when Y" (API behavior) | Run the request and inspect the response |
| "Renders Z when state is S" (UI behavior) | Load the page/component in the browser and inspect |
| "File exists at path P" | Check the filesystem |
| "Migration applies cleanly" | Run the migration against a clean database |
| "All tests pass" | Run the test command and check exit code |
| "No regression in existing behavior" | Run the full test suite; confirm baseline tests pass |

**Binary verification only.** Each criterion either passes or fails — there is no "mostly passes". If a criterion is ambiguous (cannot be verified by running a command or inspecting an output), surface it to the user for clarification rather than self-certifying.

Check off each sub-checkbox in `tasks.md` as it passes:

```markdown
- **Acceptance Criteria**:
  - [x] POST /api/users returns 201 with user object  ← verified: curl response confirmed
  - [x] Returns 409 if email already exists           ← verified: duplicate registration test passes
  - [ ] Passwords are hashed before storage           ← not yet verified
```

Do not change the task's top-level marker to `[x]` until all sub-checkboxes are checked.

### Step 3: Regression Check

Confirm that existing tests still pass after your changes. Passing the test suite in Step 1 already covers this, but explicitly confirm:

- No test that was passing before your changes is now failing
- If tests were already failing before your changes, note this in `decisions.md` (pre-existing failure, not introduced by this task)

### Step 4: Manual Verification (When Required)

Some tasks cannot be fully verified by automated checks. Require user inspection for:

- **UI/UX changes** — visual rendering, layout, animation, responsiveness. Describe what to look for and where; show a screenshot or recording if available.
- **Generated content** — AI-generated text, images, or computed values that require human judgment to assess correctness.
- **Security-sensitive changes** — auth flows, permission checks, data access controls. Even if tests pass, flag for user review.
- **Third-party integrations** — external API calls, webhook delivery, or behavior that depends on a service outside the test environment.

When manual verification is needed, do not mark the task `[x]` until the user confirms. Present the result clearly so the user can make a quick judgment call.

## After Verification Passes

Once all steps pass:

1. Check all acceptance criteria sub-checkboxes in `tasks.md`
2. Change the task marker from `[~]` to `[x]`
3. Add a completion note to the task's **Notes** field
4. Update the statistics table and phase header in `tasks.md`
5. Record any notable decisions or assumptions in `decisions.md`

## When Verification Fails

If acceptance criteria cannot be satisfied after reasonable implementation effort:

1. Do not mark the task `[x]`
2. Keep the task `[~]` (in progress) or change to `[!]` (blocked) depending on whether the issue is fixable within this task's scope
3. Document what failed and why in the task's **Notes** field
4. If the issue is a misspecified acceptance criterion in the task (not an implementation bug), surface it to the user — the task or the PRD may need to be updated

## Verification Anti-Patterns

| Anti-Pattern | Why It's a Problem |
|-------------|-------------------|
| Marking `[x]` while a quality gate fails | Broken gate will block downstream tasks and CI |
| Self-certifying ambiguous criteria ("it seems to work") | Acceptance criteria exist to be concretely verifiable; if they're not, fix them |
| Skipping the regression check | Changes can have unexpected side effects; always confirm baseline tests pass |
| Only running the test subset relevant to the task | Quality gates are additive — all of them must pass, always |
| Skipping manual verification for UI tasks | Automated tests rarely catch visual regressions or UX problems |
