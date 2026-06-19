---
name: refactor
description: Safely restructure existing code without changing its behavior — characterization tests first, one small behavior-preserving step at a time, with every quality gate green throughout. Use when the user says "refactor this", "clean up this code", "reduce duplication", "extract a function/component", "simplify this", "untangle this module", "pay down tech debt", or wants to execute a deferred improvement from a decisions.md or retro.md "Future Opportunities" list. Scope-boxed and behavior-preserving, so tests stay green and observable behavior is unchanged. New behavior or bug fixes are out of scope — those route to create-a-prd or debug-and-fix.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Refactor

## Purpose

This skill restructures existing code to make it cleaner, simpler, or easier to change — **without altering what the code does**. It exists to close a gap in the rest of the suite: `tasks-to-code` and `code-review` enforce "no gold-plating," so genuine improvements get deferred into `decisions.md` and `retro.md` under **Future Opportunities**, where they pile up with no skill to execute them safely. This is that skill.

Refactoring is the disciplined counterpart to gold-plating. Gold-plating adds unrequested behavior mid-task and risks regressions. Refactoring changes *structure only*, is guarded by tests at every step, and is done deliberately as its own unit of work — never smuggled into a feature or a bug fix.

## The Contract

This skill makes one promise, and the whole workflow exists to keep it:

> **Tests stay green, behavior unchanged.**

Concretely, when a refactor is complete:

1. **The same tests pass before and after.** Every test that was green before the refactor is still green after it.
2. **No test was modified to make it pass.** If a test had to change to stay green, the refactor changed observable behavior — that is no longer a refactor. Stop and surface it.
3. **Observable behavior is identical.** Same inputs produce the same outputs, the same side effects, the same errors, the same public API. Only the internal structure changed.
4. **Every quality gate stays green throughout.** Lint, typecheck, test, and build pass after *each* step, not just at the end.

If any of these cannot hold, the change you are contemplating is not a pure refactor. Route it: new or changed behavior goes through [`create-a-prd`](../create-a-prd/), a bug fix goes through [`debug-and-fix`](../debug-and-fix/).

## Inputs

A refactor needs two things. If either is missing, establish it before touching code:

1. **A scope-boxed target** — the specific file(s), module, function, or component to restructure, with an explicit boundary on what is *not* in scope.
2. **A structural goal** — what "better" means here: remove duplication, extract a unit, rename for clarity, untangle a dependency, simplify a conditional, etc. "Make it cleaner" is too vague — pin down the concrete change.

The target often comes from a **Future Opportunities** entry in `plans/<name>/decisions.md` or `plans/<name>/retro.md`. Those entries look like:

```markdown
## Future Opportunities

- **[Noticed during Task 2.3]**: The rate limiter could be extracted to a shared middleware for use across all API routes (currently duplicated on auth endpoints).
```

When the input is such an entry, read the surrounding decision context first — it usually explains *why* the improvement was deferred and what constraints apply.

## Triage Before You Start

Not every "Future Opportunity" or cleanup request is a refactor. Classify the work first:

| The change… | Is it a refactor? | Route to |
|-------------|-------------------|----------|
| Restructures code, observable behavior identical | ✅ Yes | This skill |
| Adds, removes, or changes a feature or output | ❌ No | [`create-a-prd`](../create-a-prd/) → `prd-to-tasks` → `tasks-to-code` |
| Fixes incorrect behavior | ❌ No | [`debug-and-fix`](../debug-and-fix/) |
| Changes a public API / contract other code depends on | ⚠️ Not pure | Treat the contract change as a feature (PRD); the internal cleanup can follow as a refactor |
| Improves performance with a measurable behavior-equivalent change | ⚠️ Careful | Refactor only if outputs are provably identical and you have a benchmark; otherwise treat as a feature with its own acceptance criteria |

When in doubt, it is not a refactor. The cost of misclassifying a behavior change as "just cleanup" is a silent regression with no acceptance criterion to catch it.

## Workflow

### Phase 1: Scope the Refactor

Box the work before you start. An unbounded refactor is how a one-function cleanup becomes a 40-file diff nobody can review.

1. **Name the target and the goal** — exactly which code, and exactly what structural improvement. Write it down in one sentence: *"Extract the duplicated retry logic in `client.ts` and `worker.ts` into a shared `withRetry` helper."*
2. **Read the source context** — if this came from a `decisions.md` / `retro.md` Future Opportunity, read the original entry and the decision around it.
3. **Triage** (see the table above) — confirm this is behavior-preserving. If it is not, stop and route it.
4. **Set the boundary** — list the files in scope and state explicitly what is out of scope. Improvements you notice outside the box are logged as new Future Opportunities, not done now. The no-gold-plating rule applies *recursively* — even to refactors.
5. **Discover the patterns** — understand how this area of the code is structured and tested before changing it. See [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md), focusing on test layout and the conventions the refactored code must keep matching.

See [references/intake-and-scope.md](references/intake-and-scope.md) for how to consume Future Opportunities and keep a refactor scope-boxed.

### Phase 2: Establish the Safety Net

**Characterization tests come first.** You cannot preserve behavior you have not pinned down. Before changing any code:

1. **Find the existing tests** covering the target and run them. They must be **green** as a baseline. If they are already red, stop — that is a bug ([`debug-and-fix`](../debug-and-fix/)), not a refactor candidate.
2. **Assess coverage** of the target's observable behavior. Refactoring code that no test exercises is changing code blind.
3. **Write characterization tests for any uncovered behavior** *before* you refactor. A characterization test captures what the code **currently does** (not what it should do) — it is the snapshot you will hold the refactor against.
4. **Confirm the net is green** — the full safety net passes before the first structural change.

If the code cannot be tested without first restructuring it (the classic legacy-code seam problem), make the smallest, safest enabling change to introduce a seam, then add the test. Document that you did so.

See [references/safety-net.md](references/safety-net.md) for the characterization-testing methodology, coverage assessment, golden-master/approval testing, and handling untestable legacy code.

### Phase 3: Refactor in Small, Behavior-Preserving Steps

Apply **one named transformation at a time**, and re-run the tests after each.

1. **Pick one transformation** from [references/refactoring-catalog.md](references/refactoring-catalog.md) — extract function, inline variable, rename, move, replace conditional with polymorphism, etc. Each has a known-safe mechanic.
2. **Apply it in isolation** — the smallest change that completes that single transformation.
3. **Run the tests** — the full suite must stay green. A step that goes red is reverted *immediately*; do not debug forward on a refactor. Re-examine the mechanic and try again smaller.
4. **Follow existing patterns** — the restructured code must look like it belongs in the project. See [../tasks-to-code/references/implementation-guide.md](../tasks-to-code/references/implementation-guide.md) for pattern-first discipline, minimal footprint, and dependency rules. A refactor almost never adds a dependency; if it seems to, stop and surface it.
5. **Keep the public surface fixed** — do not change signatures, exports, routes, or any observable contract. If the goal genuinely requires an API change, it is not behavior-preserving — return to triage.

Each step should be independently sound: tests green, behavior intact, the kind of change you could commit on its own.

### Phase 4: Verify Behavior Is Unchanged

The proof that a refactor is safe is that nothing observable moved.

1. **Run every quality gate** — lint, typecheck, test, build. Quality gates are additive; all must pass, not just the test subset near your change.
2. **Confirm no test was modified to pass.** This is the load-bearing check of the whole skill: a green suite only proves behavior preservation if the tests themselves did not change. `git diff` the test files — they should be unchanged except for characterization tests you *added* in Phase 2.
3. **Confirm the public surface is identical** — same exported signatures, same API responses, same error shapes.
4. **Confirm scope** — only the files you boxed in Phase 1 changed.

See [references/behavior-preservation.md](references/behavior-preservation.md) for the full verification sequence, the "no test modified" rule, and equivalence techniques (golden-master diffing, output comparison) for areas that are hard to unit-test.

### Phase 5: Report

Summarize the **structural** changes — and state plainly that behavior did not change.

```markdown
## Refactor Summary

**Goal**: [The one-sentence structural goal from Phase 1]
**Scope**: [Files/modules touched]
**Transformations applied**: [e.g. Extract Function ×2, Rename ×3, Inline Variable ×1]
**Safety net**: [Existing tests relied on + characterization tests added, if any]
**Behavior change**: None. Same tests pass; no test was modified to accommodate a change. Public API unchanged.
**Quality gates**: All passing ✅
```

If you noticed further improvements while working, list them as new **Future Opportunities** (in `plans/<name>/decisions.md` if tied to a plan) rather than expanding scope now. If this refactor executed a Future Opportunity that was tracked in `decisions.md` / `retro.md`, note that it has been carried out.

## Key Principles

**Behavior is sacred; structure is fair game.** The entire value of a refactor is that it is safe. The moment behavior changes, it stops being a refactor and needs an acceptance criterion. Keep the line bright.

**Tests first, always.** A refactor without a safety net is just hoping. If behavior is not under test, write the characterization test before you touch the structure — never after.

**One small step at a time.** Large refactors are many small, individually-verified transformations — not one big rewrite. Re-run tests after each. Revert the single step that breaks, not the whole session.

**Scope-boxed, recursively.** Refactoring is itself subject to no-gold-plating. Stay inside the box you drew; defer the improvements you spot along the way instead of chasing them.

**A green suite only counts if the tests didn't move.** The proof of behavior preservation is unchanged tests passing. If you edited a test to keep it green, you changed behavior — surface it.

## References

- [references/intake-and-scope.md](references/intake-and-scope.md) — Consuming "Future Opportunities", triaging refactor vs. feature vs. bug, and keeping scope boxed
- [references/safety-net.md](references/safety-net.md) — Characterization-tests-first methodology, coverage assessment, golden-master testing, and untestable legacy code
- [references/refactoring-catalog.md](references/refactoring-catalog.md) — Named behavior-preserving transformations and their step-by-step mechanics
- [references/behavior-preservation.md](references/behavior-preservation.md) — How to verify behavior is unchanged: quality gates, the "no test modified" rule, and equivalence techniques
- [../tasks-to-code/references/implementation-guide.md](../tasks-to-code/references/implementation-guide.md) — Pattern-first implementation discipline and minimal footprint (shared reference)
- [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) — Codebase and test-pattern discovery (shared reference)
