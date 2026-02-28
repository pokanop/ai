# Debugging Guide

A hypothesis-driven methodology for isolating root causes. This approach replaces random code changes with a structured elimination process.

---

## The Core Loop

Every debugging session follows this loop until the root cause is confirmed:

```
1. Form hypotheses (what could cause this?)
2. Rank hypotheses (most likely first)
3. Design the smallest test for the top hypothesis
4. Run the test
5. If confirmed → you have the root cause → fix it
6. If ruled out → cross off the hypothesis, move to the next
7. If inconclusive → refine or decompose the hypothesis
```

Never move to fixing until the root cause is confirmed. Fixing a symptom wastes time and often makes the next debugging session harder.

---

## Phase 1: Read the Error

Before forming any hypotheses, read the full error output.

**What to extract from an error:**

| Error Component | What It Tells You |
|----------------|-------------------|
| Error type | Category of problem (TypeError, NetworkError, AuthError, etc.) |
| Error message | What specifically failed |
| Stack trace | Call chain that led to the error — read from top (most specific) to bottom (most general) |
| Line number / file | Where to start reading |
| Timestamp | Whether this is intermittent or consistent |

**Common error types and where they point:**

| Error Pattern | Likely Location |
|--------------|-----------------|
| `Cannot read property of undefined` | Null check missing upstream |
| `ECONNREFUSED` / `ENOTFOUND` | Network config, wrong URL, service not running |
| `401 Unauthorized` | Auth token missing, expired, or incorrectly set |
| `404 Not Found` | Route/endpoint mismatch, wrong ID, data doesn't exist |
| `500 Internal Server Error` | Server-side bug — check server logs |
| `CORS error` | Missing CORS header on the API or wrong origin |
| `SyntaxError` | Malformed JSON, incorrect template literal |

---

## Phase 2: Form Hypotheses

After reading the error, list plausible root causes. Good hypotheses are:

- **Specific**: "The `userId` is undefined when `getUser()` is called" not "something is wrong with auth"
- **Falsifiable**: There's a test that can rule it in or out
- **Bounded**: Points to a specific code path, not "the whole system"

**Hypothesis sources:**

1. **The stack trace** — Follow the call chain. Where does control enter broken code?
2. **Recent changes** — If this is a regression, what changed recently? `git log --oneline -20` and `git diff` are your friends.
3. **Environmental differences** — Does it only happen in prod? In a specific browser? With specific data?
4. **Data flow** — Trace the data from its source to where the error occurs. Where could it become invalid?

**Limit to 2-4 hypotheses.** If you have 10 hypotheses, you don't understand the bug well enough yet. Re-read the error and trace the call chain more carefully.

---

## Phase 3: Design Elimination Tests

For each hypothesis, design the **smallest possible test** to rule it in or out.

| Test Type | When to Use | Example |
|-----------|------------|---------|
| **Log/inspect** | Quick data validation | `console.log(userId)` just before the failing call |
| **Isolate in REPL** | Test a function in isolation | Run the function with the suspect input in a test or REPL |
| **Add a unit test** | Reproduce the exact failing scenario | Write a test with the suspect input; confirm it fails on current code |
| **Bisect with git** | Find which commit introduced a regression | `git bisect` to narrow down the breaking change |
| **Simplify the input** | Rule out data-specific behavior | Use a known-good minimal input (e.g., hardcoded test user) |
| **Remove a layer** | Isolate which layer contains the bug | Comment out middleware, skip a transformation step, mock an external call |

**Rule for elimination tests:**
- If the test passes → hypothesis is ruled out
- If the test fails in the expected way → hypothesis is confirmed, or at least narrowed
- If the test fails in an unexpected way → new information — update your hypotheses

---

## Phase 4: Confirm the Root Cause

The root cause is confirmed when you can answer all three:

1. **"Why does the bug occur?"** — A specific, mechanical explanation: "The session token is stripped by the CORS preflight middleware before the auth middleware reads it."
2. **"Why does it only occur under these conditions?"** — Explains the reproduction steps: "Only on POST requests from a different origin, because GET requests are not preflighted."
3. **"How would fixing X make the bug disappear?"** — Mechanically: "Moving the CORS middleware after the auth middleware means the token is present when auth reads it."

If you cannot answer all three, you have not found the root cause yet.

---

## Debugging by Bug Type

### Null/Undefined Errors

Trace backward from the error: what was expected to be defined but wasn't? Trace data flow from its origin — where could it become null/undefined? Check: optional chaining, conditional rendering, async initialization timing.

### Network / API Errors

Check in order: (1) Is the request being made? (2) Is it going to the right URL? (3) Is the payload correct? (4) Is the response what you expect? Use browser DevTools Network tab or server logs to inspect the actual request and response.

### Race Conditions

If the bug is intermittent and timing-related: look for shared mutable state, missing `await`, parallel async operations that depend on each other's results, or event handlers that fire in unexpected order.

### Wrong Data / Stale Data

If the data displayed doesn't match what's in the database: trace the data flow from persistence to display. Check caching layers, in-memory state, optimistic updates, and query invalidation.

### Environment-Specific Bugs

Diff the environments: environment variables, feature flags, database state, browser version, OS. Reproduce in a clean environment if possible.

---

## Time Limits

| Investigation phase | Time box |
|--------------------|----------|
| Reading the error + initial hypotheses | 5 minutes |
| Testing one hypothesis | 10-15 minutes |
| Full debugging session before escalating | 45-60 minutes |

If you've spent 45 minutes without confirming a root cause, stop and reassess:
- Are the reproduction steps correct? Can you actually reproduce it?
- Is the hypothesis list correct? What assumption might be wrong?
- Do you need more information (logs, environment access, a different reproduction case)?

Escalating early is not failure. Debugging in circles for hours is.
