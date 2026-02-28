---
slug: debug-and-fix
name: Debug and Fix
version: 1.0.0
description: Systematically debug a reported bug, implement a fix, and add a regression test. Use when the user reports "there's a bug", "this is broken", "this isn't working", "I'm getting an error", or describes unexpected behavior. Accepts a bug report (symptom, steps to reproduce, expected vs. actual), isolates the root cause through hypothesis-driven investigation, implements a minimal fix, verifies the fix, and adds a regression test.
---

# Debug and Fix

## Purpose

This skill provides a structured approach to debugging: hypothesize, isolate, fix, verify, protect. It prevents the two most common debugging failure modes — fixing the symptom instead of the root cause, and fixing the root cause without preventing it from recurring.

## Inputs

A complete bug report has three components. If any are missing, ask before starting:

1. **Symptom** — What is observed? ("The page shows a blank screen", "the API returns 500", "the button does nothing")
2. **Steps to reproduce** — The exact sequence that triggers the bug, reliably
3. **Expected vs. actual** — What should happen vs. what does happen

Without steps to reproduce, the investigation starts blind. Ask the user to provide them rather than guessing.

## Workflow

### Phase 1: Understand the Bug

Before touching any code, understand the bug thoroughly.

1. **Reproduce it** — Follow the steps to reproduce. Confirm you can trigger the bug. If you cannot reproduce it, do not proceed — ask the user for more detail or access.

2. **Characterize it** — Answer these questions:
   - Is this a regression (was it previously working)? If so, approximately when did it break?
   - Is it intermittent or consistent?
   - Is it environment-specific (dev only, prod only, specific browser/OS)?
   - What is the blast radius — who and what does it affect?

3. **Read the error** — If there's an error message, stack trace, or log output, read it fully before investigating. The error often tells you exactly what went wrong and where.

### Phase 2: Isolate the Root Cause

Use hypothesis-driven debugging. See [references/debugging-guide.md](references/debugging-guide.md) for the full methodology.

1. **Form hypotheses** — Based on the symptom and error, list 2-4 plausible root causes in order of likelihood.

2. **Design elimination tests** — For each hypothesis, identify the smallest test that would confirm or rule it out (a log statement, a unit test, a code inspection, removing a dependency).

3. **Test in order** — Start with the most likely hypothesis. If confirmed, stop. If ruled out, move to the next.

4. **Document the path** — Record each hypothesis and its outcome as you go. This prevents circular investigation and is useful if the bug is handed off.

**Do not:**
- Start by randomly changing code to see if the bug disappears
- Fix the first suspicious thing you see without confirming it's the root cause
- Spend more than 15 minutes on one hypothesis without checking others

**The root cause is confirmed when:**
- You can explain exactly why the symptom occurs given the root cause
- Temporarily reverting the root cause (in a mental model or in code) would make the bug disappear
- The fix you implement addresses the root cause, not just the symptom

### Phase 3: Implement the Fix

Write the fix following the principles in [../tasks-to-code/references/implementation-guide.md](../tasks-to-code/references/implementation-guide.md).

**Fix discipline:**

1. **Minimal fix** — Change only what is necessary to fix the root cause. Do not refactor adjacent code, improve unrelated behavior, or add features "while you're in there."
2. **Follow existing patterns** — Use the same error handling, validation, and data-flow patterns as the surrounding code.
3. **No new dependencies** — A bug fix should almost never require a new library. If it does, stop and surface this to the user.
4. **Consider blast radius** — If the fix changes behavior for cases beyond the reported bug, flag this to the user before applying it.

### Phase 4: Verify the Fix

See [references/fix-verification.md](references/fix-verification.md) for the full verification checklist.

1. **Reproduce the original steps** — Confirm the bug no longer occurs with the fix applied.
2. **Run all quality gates** — Lint, typecheck, test, build — all must pass.
3. **Regression check** — Confirm no existing tests broke.
4. **Edge case check** — Think about inputs adjacent to the bug. Does the fix hold for empty inputs, maximum values, concurrent calls?

### Phase 5: Add a Regression Test

Every bug fix must include a test that would have caught the bug before it shipped.

**Test requirements:**
- The test must fail on the unfixed code and pass on the fixed code
- The test must describe the bug scenario clearly in its name: `it("returns 404 when session is missing, not 500")`
- The test must be placed in the correct location following the project's test conventions (see [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) for test pattern detection)

If the bug's root cause cannot be tested without major infrastructure work, document this explicitly and write the best available test (e.g., an integration test or a characterization test for a tricky edge case).

### Phase 6: Report

Present the fix to the user with a structured summary:

```markdown
## Bug Fix Summary

**Bug**: [One-sentence description]
**Root Cause**: [What was wrong and why]
**Fix**: [What was changed and where]
**Test Added**: [Test name and file]
**Quality Gates**: All passing ✅
```

Offer to log the fix in `plans/<name>/decisions.md` if the bug is related to an active plan and the root cause reveals something future tasks should know.

## Key Principles

**Root cause, not symptom.** Fix what causes the bug, not what the bug causes. A band-aid fix that hides the symptom will break again.

**Minimal, focused changes.** A bug fix that touches 15 files is a refactor wearing a bug fix's clothing. If the fix requires extensive changes, pause and discuss with the user first.

**Tests are mandatory.** A bug that is fixed without a regression test will be reintroduced. The test is not optional.

**Document what you learn.** Bugs often reveal misunderstood invariants, undocumented assumptions, or gaps in the original design. Capture these insights so they inform future work.

## References

- [references/debugging-guide.md](references/debugging-guide.md) — Hypothesis-driven debugging methodology
- [references/fix-verification.md](references/fix-verification.md) — How to verify a fix is complete and safe
- [../tasks-to-code/references/implementation-guide.md](../tasks-to-code/references/implementation-guide.md) — Implementation discipline (shared reference)
- [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) — Test pattern discovery (shared reference)
