# Decision Log: Security Review Remediation — Ledgerline API

> Decisions recorded during implementation of [tasks.md](tasks.md). Produced by
> [tasks-to-code](../../skills/tasks-to-code/SKILL.md). Each entry references the
> task that generated it.

---

## 2026-07-22 — Task 1.1: Add the shared ownership-authorization middleware

### Decision: Return 404, not 403, on an ownership mismatch

**Context**: FR-1's IDOR is exploitable partly because ids are guessable. The middleware needs a defined response when the record exists but belongs to another tenant.

**Decision Made**: `requireOwnership` returns 404 for both "record does not exist" and "record belongs to another tenant". The denial is still logged as an authz event (feeds Task 2.3).

**Rationale**: A 403 confirms the id is valid, turning the fixed IDOR into an enumeration oracle. Collapsing both cases to 404 gives an attacker nothing while legitimate users see no difference.

**Alternatives Considered**:
- 403 with a generic body: rejected — the status code alone confirms existence.
- Random-per-tenant UUIDs instead of the check: rejected — obscurity is not authorization, and the migration is unrelated scope.

**Impact on Future Tasks**: Task 2.3 logs the mismatch as a denial event even though the client sees 404 — the log tells the truth, the response does not.

---

## 2026-07-23 — Task 1.3: Rotate the SendGrid key

### Decision: Rotate the key before landing the removal commit

**Context**: FR-2's key lives in `config/default.ts`, so it also lives in every historical commit. Removing it from the tree does not un-leak it.

**Decision Made**: Issue a new key at SendGrid and verify the old key is revoked *first*; only then land the commit that switches `config/default.ts` to `process.env.SENDGRID_API_KEY`. The old value is treated as public.

**Rationale**: Ordering is the whole fix — a removal commit with the old key still live shrinks the window by zero. Rewriting git history was considered and rejected: rotation makes the historical value worthless, which is cheaper and doesn't break clones.

**Assumptions**: No other service shares this key (confirmed with the platform team before revoking).

**Impact on Future Tasks**: Task 2.5's CI audit is complemented by a pre-commit secret-scan recommendation recorded under Future Opportunities — rotation fixes this leak, scanning prevents the next one.

---

## Future Opportunities

- **[Noticed during Task 1.3]**: a pre-commit secret scanner (e.g. gitleaks) would catch the next committed key before it lands. Deferred — one incident does not justify blocking this remediation on new tooling; proposed as its own small task.
- **[Noticed during Task 1.2]**: the customer routes duplicate query-building logic that the ownership middleware now half-absorbs; a `refactor` pass could consolidate it. Behavior-preserving, so deferred to the refactor skill rather than smuggled into a security fix.
