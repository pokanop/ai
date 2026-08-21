<!-- Committed reference artifact for the auth-endpoint-diff scenario. A
     known-good review produced by running the code-review skill against
     input/change.diff and input/task.md. evals/run.py grades this when no
     live output/ exists. -->

## Code Review: Password reset request endpoint (Task 2.3)

**Overall**: Three blocking issues — an account-existence leak, an insecure token generator, and a missing acceptance criterion (rate limiting) — must be fixed before this can merge.
**Scope**: `src/auth/password-reset.ts` (new endpoint) and `tests/auth/password-reset.test.ts`, per input/change.diff.
**Risk Profile**: High — new authentication-adjacent endpoint handling account recovery.
**Requirements**: Reviewed against Task 2.3 acceptance criteria. 2/4 criteria satisfied.

### `src/auth/password-reset.ts`

🔴 **Blocking** — Response reveals whether the email is registered (line 14)
Returning 404 "email not found" for unregistered emails lets an attacker enumerate accounts, and directly violates the acceptance criterion "the response never reveals whether the email is registered". Return 202 unconditionally after validation.

**Fix**: Always respond `202 { status: "sent" }`; only create a token when the user exists.

---

🔴 **Blocking** — Reset token generated with `Math.random()` (line 17)
`Math.random()` is not cryptographically secure; reset tokens are guessable, which lets an attacker take over accounts.

**Fix**: Use `crypto.randomBytes(32).toString("hex")` (or `crypto.randomUUID()`).

---

🔴 **Blocking** — No rate limiting (acceptance criterion unmet)
Task 2.3 requires 5 requests per hour per IP (NFR-2). The endpoint has no rate limiting, leaving it open to reset-spam abuse.

**Fix**: Apply the project's rate-limit middleware to this route with a 5/hour/IP policy.

---

⚪ **Nit** — Variable name `e` could be more descriptive (line 7)
Consider `email` instead of `e` for readability.

---

✅ **Praise** — Token expiry handled correctly (line 21)
The stored token carries a 1-hour `expiresAt` exactly as the acceptance criteria require, computed at creation time rather than checked ad hoc.

### `tests/auth/password-reset.test.ts`

🟡 **Suggestion** — No test for the unregistered-email path
The tests cover a registered email and a malformed email, but not the unregistered-email case — the exact path where the enumeration bug lives. Add a test asserting the response is identical (202) for registered and unregistered emails.

### Requirements Coverage

| Acceptance Criterion | Status | Notes |
|---------------------|--------|-------|
| POST /api/password-reset accepts an email and always returns 202 | ❌ Not met | Returns 404 for unregistered emails |
| Reset token generated and stored with a 1-hour expiry | ✅ Met | Expiry computed at creation |
| Response never reveals whether the email is registered | ❌ Not met | 404 leaks account existence |
| Rate limited to 5 per hour per IP (NFR-2) | ❌ Not met | No rate limiting implemented |

### Blocking Items to Resolve

1. `src/auth/password-reset.ts:14` — 404 response leaks account existence
2. `src/auth/password-reset.ts:17` — `Math.random()` reset token is guessable
3. `src/auth/password-reset.ts` — Rate limiting acceptance criterion unmet
