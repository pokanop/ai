# Fix Verification Guide

How to confirm that a bug fix is complete, correct, and safe before marking it done.

---

## The Verification Sequence

Run these steps in order. Do not skip any.

### Step 1: Reproduce the Original Bug (Pre-Fix Baseline)

Before applying the fix, confirm you can reproduce the bug with the original reproduction steps. If the bug cannot be reproduced:

- Do not mark it fixed — an unreproducible bug that "went away" will return
- Investigate why it cannot be reproduced (environment change? intermittent? race condition?)
- Document the investigation result

**Skip this step only if** you confirmed reproduction during Phase 1 and have not changed the environment since.

### Step 2: Apply the Fix and Reproduce the Steps Again

Apply the fix and follow the original reproduction steps verbatim. The bug should not occur.

If the bug still occurs after the fix:
- The fix did not address the root cause
- Return to Phase 2 (isolate root cause) — do not make further changes until the root cause is re-confirmed

### Step 3: Run All Quality Gates

Run every quality gate for the project. All must pass:

```bash
# Run the full suite — adapt to the project's actual commands
bun run check   # or: npm run typecheck
bun run lint
bun run test
bun run build
```

**If a gate fails:**
- Fix the failure before proceeding
- If the failure existed before your fix (pre-existing issue), document it explicitly: "Pre-existing lint failure in unrelated file, not introduced by this fix"
- Do not mark the bug fixed while a quality gate fails

### Step 4: Run the Regression Test

The regression test you wrote in Phase 5 must:
- **Fail on the unfixed code** — if it passes on both versions, it is not testing the right thing
- **Pass on the fixed code** — this is the minimum bar for the test to be meaningful

Confirm both conditions explicitly. A regression test that was written without first confirming it fails on the unfixed code provides no protection.

### Step 5: Edge Case Check

Think about inputs and conditions adjacent to the reproduced bug. The fix must hold for:

| Edge Case Type | Examples to Test |
|---------------|-----------------|
| **Empty inputs** | null, undefined, empty string, empty array |
| **Boundary values** | minimum valid, maximum valid, just above/below threshold |
| **Concurrent execution** | Does the fix hold under rapid repeated actions? |
| **Partial state** | What if the operation is interrupted mid-way? |
| **Recovery paths** | What happens after the fix handles the error — can the user continue? |

You do not need to test every edge case exhaustively, but you should explicitly check the ones that are nearest to the bug's root cause.

### Step 6: Blast Radius Check

Confirm that the fix does not break behavior for cases outside the reported bug scenario.

- Run the full test suite (Step 3 already covers this)
- If the fix touches code shared across multiple features, manually test the adjacent features
- If the fix changes behavior for valid inputs (not just the buggy case), flag this to the user before finalizing — behavior changes require user sign-off

---

## Verification Complete — Checklist

All of the following must be true before marking the bug fixed:

- [ ] Original reproduction steps no longer trigger the bug
- [ ] All quality gates pass (`lint`, `typecheck`, `test`, `build`)
- [ ] No pre-existing tests are now failing
- [ ] Regression test fails on unfixed code, passes on fixed code
- [ ] Edge cases adjacent to the root cause are handled
- [ ] No unintended behavior changes for non-bug scenarios

---

## When Verification Reveals a New Problem

Sometimes fixing one bug exposes another. If verification reveals a new bug:

1. Do **not** fix the new bug as part of this session without flagging it first
2. Document the new bug and surface it to the user
3. Decide together: fix it now (only if it's closely related and small), or open a new bug report
4. Keep the scope of this fix contained to the original reported bug

---

## When a Quality Gate Cannot Be Made to Pass

If a quality gate fails and the failure is not caused by your fix:

1. Confirm the failure existed before your changes (`git stash`, run the gate, `git stash pop`)
2. If pre-existing: document it in your fix summary; do not let it block the bug fix
3. If newly introduced by your fix: fix it before completing — the fix introduced a regression

Never mark a bug as fixed when a quality gate is failing due to your changes.
