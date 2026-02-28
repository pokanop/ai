# Decision Log

Standards for recording decisions made during implementation with `tasks-to-code`.

## Purpose

A decision log captures the *why* behind implementation choices, not just the *what*. Code explains what was done; the decision log explains why it was done that way, what alternatives were rejected, and what assumptions were made.

Without this record, future work (new tasks, code reviews, bug investigations) must reverse-engineer intent from code alone — a slow and error-prone process.

## File Location

Decisions are recorded in `plans/<name>/decisions.md`, alongside `prd.md` and `tasks.md`. The file is created by this skill on the first decision recorded for a plan.

## What to Log

Log a decision when you:

| Situation | Log it? |
|-----------|---------|
| Chose one of two equivalent naming conventions | ✅ Yes (brief) |
| Deviated from the PRD's stated approach | ✅ Yes (full entry) |
| Resolved a PRD open question by assumption | ✅ Yes (full entry) |
| Added a new dependency | ✅ Yes (full entry with justification) |
| Chose a library or framework option | ✅ Yes |
| Estimated effort differently than the task specified | ✅ Yes |
| Noticed a future opportunity but stayed in scope | ✅ Yes (under Future Opportunities) |
| Followed the obvious, stated pattern exactly | ❌ No |
| Wrote a standard function with no ambiguity | ❌ No |

When in doubt, log it. A brief entry is always better than silence.

## Document Format

```markdown
# Decision Log: <Project Name>

> Decisions recorded during implementation of `plans/<name>/tasks.md`.
> Each entry references the task that generated the decision.

---

## YYYY-MM-DD — Task N.M: <Task Title>

### Decision: <Short label for this decision>

**Context**: [One or two sentences explaining the situation that required a decision.]

**Decision Made**: [The choice that was made. Be specific — name files, libraries, patterns.]

**Rationale**: [Why this was the right choice. Reference the pattern it follows, the constraint it satisfies, or the tradeoff it resolves.]

**Alternatives Considered**:
- [Option A]: [Why it was rejected]
- [Option B]: [Why it was rejected]

**Assumptions**: [Any assumptions that, if wrong, would change this decision. Mark if tied to a PRD open question.]

**Impact on Future Tasks**: [Does this decision affect how later tasks should be implemented? If so, which tasks (by ID)?]

---
```

Multiple decisions from the same task can appear under the same date heading. Use a separate `### Decision:` block for each.

## Sections

### Active Decisions

The main body of the log. Entries are appended chronologically, newest at the bottom.

### Future Opportunities

A list (not tracked for completion) of improvements or features noticed during implementation that are outside the current task's scope. Format:

```markdown
## Future Opportunities

- **[Noticed during Task N.M]**: [Brief description of the opportunity and why it was deferred.]
```

These should not become tasks without going through the PRD and `prd-to-tasks` process first.

## Entry Examples

### Good: PRD deviation

```markdown
## 2025-04-10 — Task 2.3: Create notifications endpoint

### Decision: Use polling instead of webhooks for notification delivery

**Context**: The PRD specified webhooks for delivering notifications to external systems, but the target integration (Slack) does not support incoming webhooks in the plan's free-tier environment.

**Decision Made**: Implemented a polling endpoint (`GET /api/notifications/pending`) that the external system calls every 60 seconds.

**Rationale**: Satisfies FR-12 (notifications delivered within 5 minutes) within the environment constraint. Polling at 60s yields worst-case 60s delivery, within tolerance.

**Alternatives Considered**:
- Webhooks (PRD default): Requires Slack Business tier. Not available in current environment.
- Server-Sent Events: Would require persistent connections; not supported by current reverse proxy config.

**Assumptions**: The 60-second polling interval is acceptable. If stricter latency is required, webhooks should be revisited when the environment is upgraded.

**Impact on Future Tasks**: Task 2.5 (client-side notification handling) should use the polling endpoint, not a webhook listener.
```

### Good: Brief pattern choice

```markdown
## 2025-04-10 — Task 1.2: Add user model

### Decision: Co-located test file naming

**Context**: Both `*.test.ts` and `*.spec.ts` patterns exist in the codebase. New test needed.

**Decision Made**: Used `*.test.ts` to match the majority pattern (7 files vs 2 files).

**Rationale**: Consistency with the dominant existing pattern.

**Alternatives Considered**: `*.spec.ts` (minority pattern, already present for legacy files).

**Impact on Future Tasks**: All new test files in Phase 1 should use `*.test.ts`.
```

### Bad: Entry that doesn't need logging

```markdown
## 2025-04-10 — Task 1.1: Create users table

### Decision: Used snake_case for column names

**Context**: PostgreSQL convention.
```

❌ This doesn't need a log entry — following the obvious, universal convention for the technology requires no documentation.

## Linking Decisions to Tasks

When a decision is significant, add a brief back-reference in the task's **Notes** field in `tasks.md`:

```markdown
- **Notes**: Completed 2025-04-10. Used polling instead of webhooks for Slack delivery — see decisions.md 2025-04-10.
```

This creates a two-way link: the decision log records the full rationale; the task record has a pointer to it.
