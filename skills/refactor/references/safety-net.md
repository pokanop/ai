# Safety Net

How to pin down current behavior **before** you change structure. A refactor is only as safe as the tests that hold it in place — so the tests come first.

---

## The Rule: Characterization Tests First

You cannot preserve behavior you have not captured. Before the first structural change, the target's observable behavior must be under test and **green**.

A **characterization test** documents what the code *currently does* — not what it *should* do. Its job is not to find bugs; its job is to be a tripwire that fires the instant a refactor changes behavior. If the current behavior is technically wrong, the characterization test still asserts the wrong-but-current result, because the refactor must not change it. (Fixing that wrongness is a separate `debug-and-fix` job, done before or after — never silently inside the refactor.)

---

## Step 1: Run the Existing Tests (Baseline)

1. Find the tests that already cover the target. Use the project's test layout (see `../../idea-to-prd/references/codebase-discovery.md` for how to detect it).
2. Run them. **They must be green.**
   - If they are **red**, stop. A failing baseline is a bug — route to `debug-and-fix`. Refactoring on a red baseline makes it impossible to tell which change broke what.
3. Note the exact command and the green result. This is the baseline you will return to after every step in Phase 3.

---

## Step 2: Assess Coverage of the Target

Refactoring code that no test exercises is changing code blind. Assess how much of the target's behavior is actually pinned:

| Question | If "no" → |
|----------|-----------|
| Is the function/module called by any existing test? | Write a characterization test before refactoring it |
| Are the important branches / edge cases exercised? | Add cases for the uncovered branches |
| Are side effects (writes, network, events) asserted? | Add assertions or use a golden master (below) |
| Is the public API's contract asserted? | Pin the API shape explicitly — it must not move |

If the project has a coverage tool, use it to find unexercised lines in the target. If it does not, read the code and enumerate the input classes and branches by hand. The goal is not 100% coverage of the whole project — it is **adequate coverage of the specific behavior you are about to restructure**.

---

## Step 3: Write Characterization Tests for the Gaps

For each piece of uncovered behavior in the target:

1. **Call the code with representative inputs** — typical cases, boundaries, and the empty/null/error cases.
2. **Capture what it actually returns or does** — run it, observe the real output, and assert exactly that.
3. **Name the test for the behavior, not the implementation** — `returns the items sorted by created_at descending`, not `calls _sortHelper`. Tests coupled to internals break during refactoring even when behavior is preserved, which defeats the purpose.
4. **Assert observable behavior only** — return values, thrown errors, persisted state, emitted events, rendered output. Do **not** assert private helpers, call counts of internal functions, or intermediate variables. Those are the very things a refactor is allowed to change.

A good characterization test survives the refactor untouched. If you find yourself needing to rewrite a test to accommodate the new structure, the test was testing the structure, not the behavior — rewrite it to assert behavior instead, *before* you refactor.

---

## Golden-Master / Approval Testing

When a unit is hard to assert field-by-field — it returns a large structure, renders complex output, or has rich side effects — use a **golden master** (a.k.a. approval/snapshot test):

1. Run the current code over a fixed set of representative inputs.
2. Capture the full output as a "golden" artifact (a serialized snapshot, an approved file, recorded fixtures).
3. The test passes when current output matches the golden artifact.

After refactoring, the output must match the golden master **byte-for-byte**. A diff is a behavior change. This is especially effective for:

- Serializers, formatters, and report generators
- Pure transformation pipelines
- Rendered HTML/JSON output
- Anything with a wide output surface that is tedious to assert piecemeal

Capture the golden master from the **unrefactored** code. A snapshot taken after you started changing things proves nothing.

---

## Untestable Legacy Code: Introducing a Seam

Sometimes the target cannot be tested without changing it first — it has hard-wired dependencies (a `new` deep in a method, a global, a direct network call) with no place to observe or substitute behavior. This is the classic legacy-code problem.

Break the deadlock with the **smallest, safest enabling change** to introduce a *seam* — a place where you can get the behavior under test without altering it:

- Extract the hard-wired dependency to a parameter or injectable field (Parameterize Constructor / Extract and Override).
- Wrap a free function call so it can be substituted in a test.
- Extract a pure function out of an I/O-bound method so the logic can be tested directly.

These enabling moves are themselves tiny refactors. Make them conservatively, lean on whatever coverage *does* exist (even a thin golden master), add the real characterization tests through the new seam, and **document that you introduced a seam** in the refactor summary. Then proceed with the full safety net in place.

If no seam can be introduced safely without risking behavior, surface that risk to the user before going further — an unverifiable refactor is a gamble, and the user should decide whether to take it.

---

## The Net Is Ready When…

- The existing tests pass green as a baseline.
- Every behavior you intend to keep is asserted by a test (existing or newly added characterization test).
- Those tests assert *observable behavior*, not internal structure, so they will survive the refactor unchanged.
- For wide-output units, a golden master is captured from the current code.

Only then move to Phase 3 and start changing structure.
