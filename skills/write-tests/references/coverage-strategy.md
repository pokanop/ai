# Coverage Strategy

How to decide *what* to test first and *what kind* of test to write. Used by
`write-tests` Phases 2 and 3.

## Behavior Inventory

Coverage is measured against **observable behaviors**, not lines. For each file
or module in the target, list:

1. **Public surface** — exported functions, endpoints, commands, components.
2. **Outputs per input class** — the distinct results each surface can produce
   (success shapes, error shapes, empty results).
3. **Side effects** — writes, emitted events, external calls, state mutations.
4. **Error paths** — invalid input, boundary values, dependency failure,
   concurrent access where relevant.

Private helpers are covered *through* the public surface. A private function
that cannot be reached from any public behavior is dead code — flag it, don't
test it.

## Risk-Ranked Prioritization

When the target is bigger than one sitting, rank behaviors by:

| Factor | Ask | High-risk signal |
|--------|-----|------------------|
| **Blast radius** | What breaks if this is wrong? | Money movement, auth, data mutation, widely-imported utilities |
| **Change frequency** | How often is this edited? | Hot files in recent history — churn without tests is where regressions breed |
| **Complexity** | How easy is it to get wrong? | Deep branching, date/time math, parsing, concurrency, caching |
| **Current coverage** | Is anything protecting it now? | No existing test file, or tests that only cover the happy path |

Cover **high blast-radius × high churn × low coverage** first. A stable,
trivial, already-covered helper goes last or not at all — coverage work is
subject to the suite's no-gold-plating discipline like everything else.

Use the project's coverage tool for the "current coverage" column when one
exists (Phase 1 discovers it). Treat its percentages as a *map of gaps*, not a
target: raising a number by testing trivial code is motion without progress.

## Characterization vs. Specification

The defining decision of a backfill. For each behavior, pick deliberately:

### Specification tests — assert what the code *should* do

Use when a trustworthy statement of intent exists:

- A PRD / acceptance criteria (`plans/<name>/prd.md`, `US-N` stories)
- API documentation, type contracts, or a standard the code implements
- Behavior so conventional that intent is unambiguous (a `sum` sums)

Write the assertion from the spec *before* looking too hard at the
implementation, then run it. If it fails, you may have found a bug — see below.

### Characterization tests — pin what the code *currently does*

Use for legacy code with no reliable spec, or where the spec has drifted from
reality and reality is what production depends on:

1. Call the behavior with a representative input.
2. Capture the **actual** output (run it; don't predict it).
3. Assert exactly that output, with a comment noting it is characterization.
4. Repeat across the input classes from the inventory.

Golden-master / snapshot testing is bulk characterization: capture a
deliberately chosen output surface once, review it, and assert it stays. The
mechanics — and the legacy-seam problem, when code can't be invoked in a test
harness at all — are covered in the `refactor` skill's `safety-net.md`
reference; the seam *fix* itself is `refactor` work, not part of this pass.

### When actual and expected disagree

You wrote the specification assertion, and the code does something else — or
the characterization output looks wrong. **Do not guess which is right, and do
not "fix" the code from inside a testing pass.**

1. Write (or keep) the **characterization** test pinning today's behavior.
2. Record the discrepancy explicitly: expected per spec, actual per code.
3. Route it to `debug-and-fix` as a bug report —
   symptom, reproduction (your test), expected vs. actual. If it is confirmed
   as intended behavior instead, upgrade the characterization test into the
   specification test and correct the stale spec.

This keeps the bright line intact: this skill documents behavior; changing
behavior always travels through a skill with acceptance criteria.

## Knowing When to Stop

A backfill is done when the **planned, risk-ranked behaviors** are covered —
not when a percentage is hit. Signals you've gone past the point of value:

- New tests assert framework behavior or trivial delegation.
- Tests duplicate an assertion already made at a lower pyramid level.
- You are refactoring production code to chase the last uncovered branch —
  that's a `refactor` Future Opportunity, not a test.

Leftover gaps that were consciously deprioritized go in the report (and in
`plans/<name>/decisions.md` when tied to a plan) so the next pass starts from
the ranking, not from scratch.
