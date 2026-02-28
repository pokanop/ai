---
slug: code-review
name: Code Review
version: 1.0.0
description: Review code changes for quality, correctness, and adherence to project conventions. Use when the user asks to "review this code", "review my changes", "do a code review", "check this PR", "look at what I changed", or needs a structured quality assessment before merging. Accepts a diff, list of changed files, or branch description. Produces a structured review with severity-tiered feedback and an optional review.md for tracking resolution.
---

# Code Review

## Purpose

This skill performs a structured, project-aware code review. It evaluates changes against the project's existing conventions, the requirements that motivated the change, and general software quality principles — producing actionable, severity-tiered feedback rather than a wall of comments.

If the change originated from a `plans/<name>/tasks.md` task, the review also validates that the implementation satisfies the task's acceptance criteria and traces back to the correct PRD requirements.

## Inputs

The skill accepts any of the following:

- **A diff** — pasted or referenced (e.g., `git diff main...feature-branch`)
- **A list of changed files** — "review the changes in `src/auth/` and `tests/auth.test.ts`"
- **A branch or PR description** — with enough context to identify what changed and why
- **A task reference** — "review the implementation of task 2.3" (reads `plans/<name>/tasks.md` for acceptance criteria)

If the scope is unclear, ask before reviewing. A review without clear scope produces noise, not signal.

## Workflow

### Phase 1: Understand the Change

Before reading any code, understand *why* the change exists.

1. **Identify the motivation** — Is this from a PRD task? A bug fix? A refactor? An unplanned change?
   - If from a task: read `plans/<name>/tasks.md` to get the task's acceptance criteria and `plans/<name>/prd.md` for the underlying requirements
   - If a bug fix: ask for the bug report or reproduction steps
   - If neither: ask the user what this change is intended to do

2. **Identify the blast radius** — What does this change touch? How many files? What systems are affected?

3. **Identify the risk profile** — Is this security-sensitive? Does it touch auth, data persistence, payments, or user-facing content? Higher-risk changes require more thorough review.

### Phase 2: Codebase Discovery

Run targeted discovery to understand the project's conventions in the areas the change touches. See [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) for the full checklist. Focus on:

- **Patterns in the changed area** — How does the surrounding code handle similar concerns?
- **Test conventions** — Where do tests live? What testing patterns are expected?
- **Quality gates** — Which lint, format, type-check, and test commands must pass?
- **Error handling patterns** — What is the project's standard approach?

This step transforms the review from "generic advice" to "specific to how this project works."

### Phase 3: Review

Evaluate the change across the dimensions in [references/review-checklist.md](references/review-checklist.md). Key dimensions:

1. **Correctness** — Does the code do what it claims? Are edge cases handled? Are there off-by-one errors, null dereferences, race conditions?
2. **Requirements alignment** — If from a task: does it satisfy every acceptance criterion? If from a PRD: does it implement all stated requirements and nothing outside them?
3. **Security** — Are inputs validated? Are secrets handled correctly? Are authorization checks in place? See [references/review-checklist.md](references/review-checklist.md) for the security checklist.
4. **Test coverage** — Are there tests? Do they cover the happy path, error cases, and edge cases? Are they testing behavior or implementation details?
5. **Consistency** — Does this follow the project's error handling, naming, file organization, and import patterns?
6. **Performance** — Are there obvious N+1 queries, missing indexes, unbounded loops, or synchronous operations that should be async?
7. **Maintainability** — Is the code readable? Are abstractions at the right level? Is anything overly clever?

### Phase 4: Produce Feedback

Structure all findings using the format in [references/feedback-format.md](references/feedback-format.md). Every finding has a severity:

| Severity | Marker | Meaning |
|----------|--------|---------|
| **Blocking** | `🔴 Blocking` | Must be fixed before the change can be merged. Correctness bugs, security issues, broken acceptance criteria. |
| **Suggestion** | `🟡 Suggestion` | Should be addressed but won't block merge. Consistency gaps, missing test cases, performance concerns. |
| **Nit** | `⚪ Nit` | Minor style or polish items. Fix if you're already touching the line; skip otherwise. |
| **Praise** | `✅ Praise` | Something done notably well. Acknowledge good patterns. |

Present findings grouped by file, then by severity within each file. Always lead with a summary.

### Phase 5: Track (Optional)

If the change has findings that require follow-up, offer to produce a `plans/<name>/review.md` tracking document. This is recommended when:

- There are multiple blocking findings
- Suggestions should be tracked across rounds of revision
- The review is part of a formal PR process

The `review.md` format is defined in [references/feedback-format.md](references/feedback-format.md).

## Handling Re-Reviews

When the user asks to "re-review" or "check the updates":

1. Read the original review findings (from memory or `review.md` if it was saved)
2. Check each blocking and suggestion finding against the updated code
3. Mark resolved items explicitly
4. Surface any new findings introduced by the revisions
5. When all blocking items are resolved, confirm the change is ready

## Key Principles

**Be specific, not prescriptive.** Point to the problem and explain why it matters. Do not rewrite the user's code unless asked. Offer a concrete example only when it makes the feedback clearer.

**Distinguish must-fix from should-fix.** Every finding being "blocking" is useless signal. Reserve blocking severity for correctness bugs, security issues, and unmet requirements.

**Check against the project's standard.** A "violation" is only a violation if the project actually does things differently. Do not flag code that differs from your generic preferences but is consistent with the project's own patterns.

**Acknowledge what's good.** A review that only finds fault misses the opportunity to reinforce correct patterns. `✅ Praise` findings are not filler — they signal what to do more of.

**No gold-plating in reviews.** Do not suggest improvements that go beyond the stated purpose of the change. File them in the review summary as "Future Opportunities" rather than feedback on this change.

## References

- [references/review-checklist.md](references/review-checklist.md) — Dimension-by-dimension review criteria
- [references/feedback-format.md](references/feedback-format.md) — Finding severity, presentation format, and review.md schema
- [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) — Codebase discovery checklist (shared reference)
