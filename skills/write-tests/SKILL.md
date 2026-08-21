---
name: write-tests
description: Add or backfill automated test coverage for existing code without changing its behavior. Use when the user asks to "write tests", "add tests", "add unit tests", "backfill test coverage", "increase coverage", "test this module", "add integration tests", or wants a dedicated testing pass over code that already works. Discovers the project's test framework and patterns first, decides characterization vs. specification tests per target, applies the test pyramid to choose levels, and prioritizes coverage by risk. Bugs discovered while writing tests route to debug-and-fix; testability restructuring routes to refactor.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Write Tests

## Purpose

Every other skill in this suite treats tests as a byproduct of some other unit of work: `tasks-to-code` writes tests for the task it implements, `debug-and-fix` adds one regression test per bug, `refactor` pins behavior with characterization tests before restructuring. None of them covers the request that arrives on its own: **"this code works, but nothing tests it."**

This skill is that dedicated pass. It takes a coverage target — a module, a feature, a service, or "the scary parts" — and produces tests that document and protect the code's behavior, written in the project's own framework and style, **without changing the code under test**.

## Triage Before You Start

Not every "we need tests" request is a coverage pass. Classify the work first, using the canonical [routing table](../_shared/references/conventions.md#routing):

| The request is… | Is it this skill? | Route to |
|----------------|-------------------|----------|
| Adding tests for existing, working behavior | ✅ Yes | This skill |
| A test for a bug that was just fixed (regression test) | ❌ No | [`debug-and-fix`](../debug-and-fix/) owns its own regression test |
| Pinning behavior specifically to enable a restructuring | ❌ No | [`refactor`](../refactor/) Phase 2 (safety net) owns that |
| Testing a feature that is still being built | ❌ No | [`tasks-to-code`](../tasks-to-code/) — tests belong to the task's acceptance criteria |
| "Test it, and fix whatever you find" | ⚠️ Split | Coverage here; each discovered bug routes to [`debug-and-fix`](../debug-and-fix/) |

**Bright line:** this skill never modifies the code under test. If a test cannot be written without changing the code, that is a finding to surface, not a license to edit.

## Inputs

1. **A coverage target** — the files, modules, or behaviors to cover, with an explicit boundary. "Add tests" for a whole repository is a prioritization exercise first (Phase 2), not a file-by-file grind.
2. **A coverage intent** — what the tests are for: protecting an upcoming change, documenting critical paths, meeting a coverage gate (`QG-N`), or de-risking legacy code. The intent drives which behaviors matter and at which level of the pyramid.

## Workflow

### Phase 1: Discover the Project's Testing Conventions

Tests that don't look like the project's existing tests are a maintenance liability. Before writing anything, run targeted discovery (see [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md), focusing on the test-pattern questions):

1. **Framework and runner** — what executes the tests (`vitest`, `jest`, `pytest`, `go test`, XCTest…), and the exact command that runs them.
2. **Location and naming** — colocated `*.test.ts`? a mirrored `tests/` tree? `_test.go` siblings? Match exactly.
3. **Style and utilities** — existing fixtures, factories, builders, custom matchers, setup/teardown helpers. Reuse them; do not invent parallel infrastructure.
4. **Doubles policy** — what the project mocks, fakes, or hits for real (network, clock, filesystem, database). Follow the established boundary.
5. **Coverage tooling** — whether a coverage report exists and how it is produced; use it in Phase 2 rather than guessing.

If the project has **no tests at all**, stop and confirm the framework choice with the user before installing anything — a test framework is a real dependency decision, not something to slip in silently.

### Phase 2: Map and Prioritize the Coverage Gap

Enumerate the target's observable behaviors and rank what to cover first. See [references/coverage-strategy.md](references/coverage-strategy.md) for the full method. In short:

1. **Inventory observable behaviors** — public functions/endpoints/components, their outputs, side effects, and error paths. Private helpers are covered through the public surface, not directly.
2. **Measure, don't estimate** — run the coverage tool if one exists; otherwise map behaviors to existing test files by hand.
3. **Rank by risk** — change frequency × blast radius × current coverage. Money-moving, auth, data-mutation, and widely-imported code outranks stable leaf utilities.
4. **Choose the pyramid level per behavior** — unit for logic, integration for wiring, end-to-end sparingly for critical journeys (see [references/test-pyramid.md](references/test-pyramid.md)).

Present the prioritized plan before writing tests when the target is large. Coverage percentage is a byproduct, not the goal — 100% line coverage of getters while the payment path is untested is a failed pass.

### Phase 3: Decide Characterization vs. Specification per Target

The single most important call in a backfill, expanded in [references/coverage-strategy.md](references/coverage-strategy.md#characterization-vs-specification):

- **Specification tests** assert what the code **should** do, derived from a PRD, docs, types, or unambiguous intent. Use them when a trustworthy spec exists.
- **Characterization tests** pin what the code **currently does** — capture the actual output and assert it stays. Use them for legacy code with no reliable spec.

When the code's actual behavior contradicts its apparent spec, **do not encode your guess in a test**. Write the characterization test for what it does today, flag the discrepancy, and route the suspected bug to [`debug-and-fix`](../debug-and-fix/) — a test suite that enshrines a wrong guess is worse than no test.

### Phase 4: Write the Tests

1. **One behavior per test**, named after the behavior: `it("rejects an expired session token")`, not `it("works")`.
2. **Arrange–act–assert** structure, using the project's existing fixtures and helpers from Phase 1.
3. **Deterministic by construction** — control time, randomness, ordering, and external services at the project's established doubles boundary. A flaky test is a net negative; delete or fix, never retry-loop.
4. **Watch each new test fail** (or verify it can — temporarily break the behavior mentally or mutate the assertion) before trusting its pass. A test that cannot fail protects nothing.
5. **Cover the error paths** — invalid input, empty/boundary values, and failure of dependencies are where untested code actually breaks.
6. **Do not modify the code under test.** If a seam is genuinely required to make something testable, surface it: the smallest enabling change is `refactor` work (its safety-net reference covers legacy seams), done deliberately, not smuggled into this pass.

### Phase 5: Verify and Report

1. Run the **full suite**, not just the new tests — new fixtures or setup must not destabilize existing tests.
2. Run every configured quality gate (lint, typecheck, build) — test code is held to the same standard as production code.
3. Re-run the coverage tool if one exists and compare against the Phase 2 baseline.
4. Report:

```markdown
## Test Coverage Summary

**Target**: [scope covered]
**Tests added**: [N tests across M files, by pyramid level]
**Approach**: [specification / characterization per area, and why]
**Coverage**: [before → after, if measured]
**Discovered issues**: [suspected bugs routed to debug-and-fix; testability gaps noted for refactor]
**Quality gates**: All passing ✅
```

If the coverage work belongs to an active plan, offer to record notable findings in `plans/<name>/decisions.md`, and log testability improvements as **Future Opportunities** for [`refactor`](../refactor/) rather than doing them now.

## Key Principles

**Tests document behavior; they must not invent it.** A backfilled test asserts what the code verifiably does (characterization) or what a trustworthy spec says (specification) — never what the test author assumes.

**A found bug is a fork, not a fix.** Testing surfaces defects; fixing them is `debug-and-fix`'s job, with its own root-cause discipline and regression test. Write the characterization test, flag it, route it.

**Coverage is risk-weighted, not uniform.** Cover the code whose failure hurts, in the order it hurts. A coverage percentage target without a risk ranking produces tests for the easy code, not the important code.

**Match the house style exactly.** Framework, location, naming, fixtures, doubles policy — all discovered, none invented. The suite should read as if one author wrote it.

**Determinism is non-negotiable.** Every new test passes every time or it doesn't ship. Flakiness erodes trust in the whole suite, which is the asset this skill exists to build.

## References

- [references/test-pyramid.md](references/test-pyramid.md) — Choosing the right level (unit / integration / end-to-end) per behavior, and keeping the pyramid shape healthy
- [references/coverage-strategy.md](references/coverage-strategy.md) — Behavior inventory, risk-ranked prioritization, and the characterization-vs-specification decision
- [../idea-to-prd/references/codebase-discovery.md](../idea-to-prd/references/codebase-discovery.md) — Test framework and pattern discovery (shared reference)
- [../refactor/references/safety-net.md](../refactor/references/safety-net.md) — Characterization-test mechanics and legacy-seam handling (shared reference)
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical routing table and shared conventions (single source of truth)
