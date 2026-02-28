# Feedback Format

Standards for presenting review findings and tracking resolution across review rounds.

---

## Severity Levels

Every finding must be assigned one of these four severities:

| Severity | Marker | When to Use |
|----------|--------|-------------|
| **Blocking** | `🔴 Blocking` | Must be fixed before merge. Use for: correctness bugs, security vulnerabilities, broken acceptance criteria, test failures |
| **Suggestion** | `🟡 Suggestion` | Should be addressed but won't block merge. Use for: consistency gaps, missing edge-case tests, mild performance concerns, unclear naming |
| **Nit** | `⚪ Nit` | Minor style or polish. Fix only if you're already touching the line. Use for: formatting preferences, trivial naming tweaks, optional documentation |
| **Praise** | `✅ Praise` | Something done notably well. Callouts reinforce good patterns. |

**Tips on calibration:**

- If in doubt between Blocking and Suggestion, ask: "Would this cause a bug or production incident?" If yes — Blocking. If no — Suggestion.
- Do not mark everything Blocking to force attention. Overuse destroys the signal.
- Praise is not filler. Include it at least once per review if something is genuinely well done.

---

## Review Output Format

Present findings in this order:

### 1. Review Summary

Lead every review with a short summary paragraph:

```markdown
## Code Review: <Change Description>

**Overall**: [One sentence verdict — e.g., "Two blocking issues need to be fixed before this can merge."]
**Scope**: [What was reviewed — files, diff size, PR description]
**Risk Profile**: [Low / Medium / High — and why]
**Requirements**: [If from a plan — "Reviewed against task N.M acceptance criteria. X/Y criteria satisfied."]
```

### 2. Findings by File

Group all findings by file, then by severity within each file:

```markdown
### `src/auth/login.ts`

🔴 **Blocking** — Missing authorization check on line 47
The `getUser()` call returns the user record without verifying the requesting user has permission to access it. Any authenticated user can retrieve any other user's data by guessing a user ID.

**Fix**: Add an ownership check before returning: verify `requestingUser.id === targetUser.id` or that the requesting user has an admin role.

---

🟡 **Suggestion** — Error message leaks account existence (line 63)
Returning "Email not found" when an email doesn't exist lets an attacker enumerate registered accounts. Return a generic "Invalid credentials" message for both cases.

---

⚪ **Nit** — Variable name `u` could be more descriptive (line 29)
Consider `user` instead of `u` for readability.

---

✅ **Praise** — Good use of `zod` schema validation on the request body (line 12)
This is exactly the right place to validate and the schema is thorough.
```

### 3. Requirements Check (if applicable)

If the change is from a task, include an explicit requirements coverage table:

```markdown
### Requirements Coverage

| Acceptance Criterion | Status | Notes |
|---------------------|--------|-------|
| POST /api/login returns 200 with JWT on success | ✅ Met | Verified in tests |
| Returns 401 on invalid credentials | ✅ Met | |
| Returns 429 after 10 failed attempts | ❌ Not met | No rate limiting implemented |
| Token expires after 7 days | ✅ Met | Configured in JWT options |
```

### 4. Summary of Blocking Items

At the end, list all blocking items together for easy triage:

```markdown
### Blocking Items to Resolve

1. `src/auth/login.ts:47` — Missing authorization check
2. `src/auth/login.ts:AC` — Rate limiting not implemented (acceptance criterion unmet)
```

---

## Inline Feedback Format

When pointing to a specific line, use this compact format:

```
🔴 `filename.ts:line` — <Short label>
<One paragraph explaining the problem and why it matters. End with a Fix suggestion.>
```

```
🟡 `filename.ts:line` — <Short label>
<Explanation. Optional suggestion.>
```

For findings that span multiple lines or a whole function, reference the function name rather than a specific line:

```
🟡 `auth.service.ts` → `validateSession()` — No timeout handling
```

---

## review.md Schema

When the user wants to track resolution across review rounds, produce a `plans/<name>/review.md` file:

```markdown
<!-- Review of: <change description or task reference> -->
<!-- Reviewer: Agent -->
<!-- Date: YYYY-MM-DD -->

# Code Review: <Change Description>

## Summary
[Summary paragraph from the review output]

## Blocking Items

- [ ] `src/auth/login.ts:47` — Missing authorization check
- [ ] Rate limiting not implemented (task AC)

## Suggestions

- [ ] `src/auth/login.ts:63` — Error message leaks account existence
- [ ] Comments on `validateSession()` are outdated

## Nits

- [ ] `src/auth/login.ts:29` — Variable `u` → `user`

## Round 2 Notes
<!-- Added when a re-review happens -->

### YYYY-MM-DD Re-review
- [x] `src/auth/login.ts:47` — Fixed. Authorization check added.
- [ ] Rate limiting — still not implemented. Unblocking: user confirmed this is deferred to task 3.1.
```

**Rules for `review.md`:**
- Check off items as they are resolved
- Add a dated "Re-review" section for each round rather than modifying existing entries
- When all blocking items are resolved, add a final line: `**Status: Ready to merge** — YYYY-MM-DD`
