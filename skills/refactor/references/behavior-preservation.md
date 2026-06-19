# Behavior Preservation

How to prove a refactor changed only structure. The promise of this skill — *tests stay green, behavior unchanged* — is only real if it is verified. This is the verification sequence.

---

## The Verification Sequence

Run these in order after the refactor's transformations are complete. (The full suite was already run after *each* step in Phase 3; this is the final, deliberate confirmation.)

### Step 1: Run Every Quality Gate

Quality gates are **additive** — all must pass, not just the test subset near your change. Run the project's actual commands (detect them during discovery; do not assume a stack):

```
# JavaScript / TypeScript (Bun)        # Python              # Rust              # Go
bun run check / typecheck              ruff check .          cargo fmt --check   go vet ./...
bun run lint                           mypy .                cargo clippy        go test ./...
bun run test                           pytest                cargo test          go build ./...
bun run build
```

All green. A refactor that breaks the build or the linter is not done, no matter how clean the code looks.

### Step 2: Confirm No Test Was Modified to Pass — the Load-Bearing Check

This is the single most important check in the skill. A green suite proves behavior preservation **only if the tests themselves did not change**. If you edited an existing test to keep it green, you almost certainly changed behavior and moved the goalposts to hide it.

```bash
# The test files should show NO modifications — only additions of
# characterization tests you deliberately wrote in Phase 2.
git diff --stat -- '*test*' '*spec*'      # adapt globs to the project's test naming
git diff -- <test-files>                   # inspect any diff that does appear
```

Acceptable diffs in test files:
- **New** characterization tests you added in Phase 2 (additions, not edits).
- Mechanical updates forced by an internal symbol rename **only if** the test referenced an internal symbol — and the better fix is usually to assert behavior instead.

Unacceptable:
- Changed assertions, expected values, or snapshots.
- Deleted or skipped tests.
- A modified golden master / approval file.

If a test *had* to change its expectations, stop: the change is a behavior change. Either it belongs in `debug-and-fix` (if the old behavior was a bug) or `create-a-prd` (if it is a new/changed feature). Surface it; do not absorb it into the refactor.

### Step 3: Confirm the Public Surface Is Identical

Diff the observable contract, not just the internals:

| Surface | How to confirm unchanged |
|---------|--------------------------|
| Exported signatures / types | Diff the public type surface or exported declarations |
| HTTP API | Same routes, request/response shapes, status codes — replay representative requests if available |
| CLI | Same flags, output, exit codes |
| Errors | Same error types/messages where callers or tests depend on them |
| Serialized / persisted formats | Same on-the-wire and on-disk shapes |

If any of these moved, it is not a pure refactor (see the catalog's "Watch the Public Surface").

### Step 4: Confirm Scope

```bash
git diff --stat   # only the files you boxed in Phase 1 should appear
```

Files changed outside the box mean scope crept. Either they were genuinely required (note why) or they are gold-plating that should be reverted and deferred to a Future Opportunity.

---

## Equivalence Techniques for Hard-to-Test Areas

When unit assertions are impractical, prove equivalence by comparing the *output* of the old and new code over the same inputs.

### Golden-Master Diff
The safety net from Phase 2 carries the load here: the golden master captured from the **unrefactored** code must still match **byte-for-byte** after the refactor. Any diff is a behavior change — investigate it, do not re-approve it. (Re-approving a changed snapshot is the snapshot-test equivalent of editing a test to pass — the Step 2 rule applies.)

### Parallel Run / Characterization Diff
For a pure-ish transformation, run old and new implementations over a large, representative (or randomized) input set and assert the outputs are identical. Discard the old implementation only once the diff is consistently empty.

### Behavior-Equivalent Performance Changes
If the refactor's goal touches performance, "faster" is not a license to change output. Confirm outputs are provably identical (golden master / parallel run) *and* keep a before/after benchmark to show the intended improvement. If outputs differ at all, it is a feature change with its own acceptance criteria, not a refactor.

---

## Final Checklist

All must be true before reporting the refactor complete:

- [ ] Every quality gate passes (lint, typecheck, test, build).
- [ ] No existing test was modified or deleted to stay green; only added characterization tests appear in the test diff.
- [ ] No golden master / snapshot was re-approved to absorb a diff.
- [ ] The public surface (signatures, API, CLI, errors, serialized formats) is identical.
- [ ] Only the boxed files changed.
- [ ] The refactor summary states plainly: **behavior unchanged**.

---

## Reporting

Close with a structural-only summary that makes the contract explicit:

```markdown
## Refactor Summary

**Goal**: [one-sentence structural goal]
**Scope**: [files/modules touched]
**Transformations applied**: [e.g. Extract Function ×2, Rename ×3, Consolidate Duplicate Code ×1]
**Safety net**: [existing tests relied on + characterization/golden-master tests added]
**Behavior change**: None. Same tests pass; no test was modified to accommodate a change; public surface unchanged.
**Quality gates**: All passing ✅
```

If the refactor executed a tracked **Future Opportunity**, note that it is now carried out. If you spotted further improvements, record them as new Future Opportunities (in `plans/<name>/decisions.md` when tied to a plan) rather than expanding this refactor.
