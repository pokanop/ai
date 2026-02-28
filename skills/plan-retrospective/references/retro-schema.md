# Retro Schema

Full structure for `plans/<name>/retro.md`. Every section is required unless marked optional. Adapt depth to match the complexity of the plan being closed.

---

## Document Header

```markdown
<!-- PRD: plans/<name>/prd.md -->
<!-- Tasks: plans/<name>/tasks.md -->
<!-- Closed: YYYY-MM-DD -->

# Retrospective: <Project Name>

> One-sentence summary of what was built and its outcome.
```

---

## Section 1: Summary

A concise paragraph (3-5 sentences) describing:
- The problem this plan addressed (reference the PRD's problem statement)
- What was built and shipped
- The overall outcome (e.g., "All P0 requirements were delivered in two phases over three weeks")

**Do not copy the PRD verbatim.** Write this as an account of what actually happened, not what was planned.

---

## Section 2: Metrics

A table of computed values. See [metrics-guide.md](metrics-guide.md) for how to calculate each.

```markdown
## Metrics

| Metric | Value |
|--------|-------|
| Total tasks | NN |
| Completed `[x]` | NN (NN%) |
| Skipped `[-]` | NN |
| Blocked `[!]` | NN |
| Not started `[ ]` | NN |
| Effective completion rate | NN% (completed / (total − skipped)) |
| PRD requirements covered | NN / NN (NN%) |
| Tasks without PRD traceability | NN |
| PRD requirements never implemented | NN |
```

Include a one-sentence interpretation next to any metric that warrants context (e.g., "3 tasks skipped — all intentionally deferred to the follow-on notifications plan").

---

## Section 3: What Was Built

A plain-language, bullet-point list of the features, changes, or artifacts delivered. Written for someone who hasn't read the PRD.

```markdown
## What Was Built

- User registration and login with email/password
- Password reset flow with email confirmation
- JWT-based session management with 7-day expiry
- Rate limiting on auth endpoints (10 req/min per IP)
- Unit tests for all auth service functions (87% branch coverage)
```

This is the definitive answer to "what did we actually ship?"

---

## Section 4: Scope Drift

Deviations between the plan and the implementation in either direction. Neutral in tone — scope drift is not inherently bad, but it must be documented.

### Additions (built beyond the PRD)

Items implemented that have no corresponding PRD requirement. Format each as:

```
- **<Description>**: <Why it was added>. Task: N.M.
```

If there were no additions, write: *No additions beyond PRD scope.*

### Deferrals (planned but deferred)

PRD requirements that were intentionally not implemented in this plan cycle. Format each as:

```
- **FR-N / US-N: <Requirement>**: <Why deferred>. <Where it goes next: backlog / new plan / cancelled>.
```

If nothing was deferred, write: *All PRD requirements were implemented.*

### Blockers (planned but blocked)

Tasks that could not be completed due to dependencies or external blockers:

```
- **Task N.M: <Title>**: <What blocked it>. <Current status>.
```

---

## Section 5: Key Decisions

The most significant decisions made during implementation. Pull from `decisions.md` if it exists; otherwise reconstruct from task notes.

Focus on decisions that:
- Deviated from the PRD's stated approach
- Resolved an open question from the PRD
- Will affect how future work in this area is implemented

Format:

```markdown
## Key Decisions

### <Short decision label>
**Context**: [What situation required a decision]
**Decision**: [What was chosen]
**Impact**: [What future plans should know about this]

See: decisions.md YYYY-MM-DD / Task N.M
```

Include 3-5 decisions maximum. If there are more, summarize the rest in a "Minor Decisions" bullet list.

---

## Section 6: What Worked Well

Patterns, approaches, tools, or team behaviors that should be repeated on future plans. Specific and actionable — not platitudes.

```markdown
## What Worked Well

- The phase structure kept Phase 1 independently deployable, which made early feedback possible
- The codebase-discovery step caught an existing auth helper we could reuse (saved ~4 hours)
- Breaking tasks to M size made daily progress visible and reduced WIP
```

---

## Section 7: What to Improve

Friction points, estimation misses, or process gaps. Focused on systems and process, not individuals. Each item should suggest a concrete fix.

```markdown
## What to Improve

- Task 2.4 (email provider integration) was estimated M but was actually XL — we underestimated third-party provider complexity. For future external integrations, add a spike task first.
- The PRD's NFR for p95 < 200ms was never verified with a real performance test. Future PRDs should require a specific test command for NFRs.
```

---

## Section 8: Open Items

Any tasks that remain open (`[!]` blocked or `[ ]` not started) that are being carried forward rather than closed. Every open item must have a next step.

```markdown
## Open Items

| Task | Status | Next Step |
|------|--------|-----------|
| Task 3.2: WebSocket support | `[ ]` Not started | Deferred — create new plan `realtime-notifications` |
| Task 2.7: Admin dashboard integration | `[!]` Blocked | Waiting on design handoff — assigned to next sprint |
```

If there are no open items, write: *All tasks are closed.*

---

## Section 9: Future Opportunities (Optional)

Items from `decisions.md`'s Future Opportunities section, or observations from implementation that are worth capturing but don't warrant an immediate plan. Not tracked — informational only.

```markdown
## Future Opportunities

- The rate limiter could be extracted to a shared middleware for use across all API routes (currently only on auth endpoints)
- Batch email sending was out of scope but would improve delivery reliability at scale
```
