# Review Checklist

A structured checklist for evaluating code changes across all relevant quality dimensions. Work through each dimension in order. Not every dimension applies to every change — skip dimensions that are clearly not relevant, but be explicit about why (e.g., "No UI changes in this diff").

---

## 1. Correctness

The most important dimension. Code that passes every other check but is incorrect is still wrong.

- [ ] Does the code do what it claims to do?
- [ ] Are all branches and conditions handled? (What happens in the else case?)
- [ ] Are null/undefined/empty cases handled where they could occur?
- [ ] Are there off-by-one errors in loops, indexes, or ranges?
- [ ] Are there race conditions or concurrency issues (shared state, async operations without proper awaiting)?
- [ ] Are all error paths handled — and do they fail the right way (fail loudly vs. fail silently)?
- [ ] Does the code handle the full range of valid inputs, not just the happy path?
- [ ] Are there any infinite loop risks?
- [ ] Does mutation of shared state happen where it shouldn't?

**For UI changes:**
- [ ] Does the UI reflect all possible states (loading, empty, error, success)?
- [ ] Are there layout breaks at different viewport sizes?

---

## 2. Requirements Alignment

Only applies when the change originates from a task or PRD.

- [ ] Does the implementation satisfy every acceptance criterion in the task?
- [ ] Is every FR-N, US-N requirement from the PRD represented in the change?
- [ ] Does the implementation stay within the task's stated scope (no gold-plating)?
- [ ] If the implementation deviated from the PRD, is it documented (in decisions.md or task notes)?
- [ ] Are PRD non-goals respected — is anything built that was explicitly excluded?

---

## 3. Security

Apply heightened scrutiny to auth flows, data persistence, and user-facing inputs.

**Input validation:**
- [ ] Are all external inputs validated before use (query params, request bodies, file uploads, environment variables)?
- [ ] Is there protection against injection attacks (SQL injection, XSS, path traversal)?
- [ ] Are file uploads restricted by type and size?

**Authentication & authorization:**
- [ ] Are authentication checks in place on all endpoints that require them?
- [ ] Is authorization checked at the right level (not just "is the user logged in" but "can this user do this thing")?
- [ ] Do error messages reveal information that could aid an attacker (e.g., "email not found" vs. "invalid credentials")?

**Secrets & data handling:**
- [ ] Are secrets, API keys, and credentials handled via environment variables — never hardcoded or logged?
- [ ] Are passwords hashed (not encrypted, not stored in plaintext)?
- [ ] Is sensitive data (PII, financial data) minimized, masked in logs, and appropriately encrypted at rest?

**Dependencies:**
- [ ] Are any new dependencies introduced? If so, are they from trusted sources and is the pinned version recent?

---

## 4. Test Coverage

- [ ] Are tests present for the new behavior?
- [ ] Do tests cover the happy path, error cases, and edge cases?
- [ ] Are tests testing *behavior* (what the function produces) rather than *implementation* (how it produces it)?
- [ ] Will the tests catch a regression if this code is accidentally reverted or broken?
- [ ] Are existing tests still passing (no accidental breakage)?
- [ ] If UI: are there integration or E2E tests for critical user flows?
- [ ] Are test names descriptive enough to understand what broke when they fail?

---

## 5. Consistency with Project Conventions

- [ ] Do new files follow the project's naming conventions (kebab-case, PascalCase, etc.)?
- [ ] Are files placed in the correct directories following established structure?
- [ ] Does the import style match the project (path aliases, barrel exports, relative vs. absolute)?
- [ ] Does error handling follow the project's established pattern (not a new approach introduced ad hoc)?
- [ ] Does the code use existing utilities, hooks, helpers, and shared components rather than reimplementing them?
- [ ] Are new dependencies justified, or could an existing dependency serve the same need?

---

## 6. Performance

Apply only when the change touches data-intensive operations, hot paths, or user-visible rendering.

- [ ] Are there N+1 query patterns (a query inside a loop)?
- [ ] Are database queries indexed on the fields being filtered/sorted?
- [ ] Are expensive computations memoized or cached where appropriate?
- [ ] Are large data sets paginated rather than fetched in full?
- [ ] Are there synchronous/blocking operations that should be async?
- [ ] For UI: are unnecessary re-renders introduced (missing memoization, unstable references)?
- [ ] Are there unbounded loops or recursion with unclear termination conditions?

---

## 7. Maintainability

- [ ] Is the code readable without needing inline comments to understand it?
- [ ] Are function and variable names descriptive and accurate?
- [ ] Are functions and components small enough to reason about independently?
- [ ] Are abstractions at the right level — not too early (YAGNI), not too late (WET)?
- [ ] Is complex logic explained with a comment that describes *why*, not just *what*?
- [ ] Are there dead code paths, commented-out blocks, or TODO comments left behind?
- [ ] Will this code be easy to modify or extend for the next change in this area?

---

## Quick-Pass Checklist

For reviewing smaller, lower-risk changes, use this abbreviated version:

- [ ] Does it do what it says?
- [ ] Are error cases handled?
- [ ] Is there a test?
- [ ] Does it follow project conventions?
- [ ] Any security concerns?
