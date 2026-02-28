# PRD Quality Standards

## Writing Standards

### Be Specific and Measurable

Every requirement must be verifiable. Replace vague language with concrete criteria:

```diff
- The API should be fast.
+ The API must respond within 200ms at p95 under 100 concurrent requests.

- The UI should be accessible.
+ The UI must meet WCAG 2.1 AA. All interactive elements must be keyboard-navigable. Color contrast ratio must be at least 4.5:1.

- The system should handle errors gracefully.
+ All API errors must return JSON with {code, message, details}. Client-facing errors must not expose internal implementation details. All errors must be logged with request correlation IDs.

- The feature should be easy to use.
+ The primary workflow must complete in 3 or fewer steps. First-time users must be able to complete the core task without consulting documentation.
```

### Use Imperative Language

Write requirements as "The system must..." not "The system should..." or "It would be nice if..."

- **Must** = Required for launch (P0)
- **Should** = Expected but can launch without (P1)
- **May** = Nice to have (P2)

### Avoid Implementation Details

The PRD defines *what* and *why*, not *how*. Do not prescribe specific code patterns, database schemas, or API response shapes. These belong in technical design documents that follow the PRD.

```diff
- Use a PostgreSQL JSONB column called `metadata` with a GIN index.
+ Store extensible metadata per record. The storage approach must support efficient querying by arbitrary keys.

- Create a React component called `<MetricsChart>` using recharts.
+ Display metrics in a visual chart format. The charting solution must support real-time updates and responsive layouts.
```

Exceptions: Reference specific technologies when they are already established in the project (e.g., "Extend the existing Prisma schema" is appropriate if Prisma is already in use).

### One Requirement Per Statement

Compound requirements are harder to verify and implement:

```diff
- The search must be fast, support filters, and show results with highlighting.
+ The search must return results within 200ms at p95.
+ The search must support filtering by date range, category, and status.
+ Search results must highlight matching terms in the title and body.
```

## Decision Quality

### Every Decision Needs Context

When documenting design decisions, include:

1. What options were considered (at least 2)
2. What criteria were used to evaluate them
3. Why the chosen option won
4. What trade-offs are accepted

### Justify New Dependencies

Every new library, service, or tool must answer:

1. What existing project tooling was evaluated first?
2. Why can't this be done with what's already in the stack?
3. What is the maintenance and security posture of this dependency?
4. What is the bundle size / performance impact?

### Scope Management

Effective PRDs are ruthless about scope:

- The non-goals section must exist and be substantive
- Each phase must be independently valuable
- P2 items should be in a "Future Considerations" section, not mixed with P0/P1
- If the PRD covers more than one major feature, split it

## Completeness Checklist

Before finalizing, verify:

- [ ] Problem statement is grounded in evidence (user feedback, data, business need)
- [ ] Success criteria are measurable with specific targets
- [ ] Non-goals are explicitly listed
- [ ] All user stories have acceptance criteria
- [ ] All requirements are labeled (`FR-N`, `NFR-N`, `US-N`, `QG-N`)
- [ ] Alternatives were considered and documented
- [ ] New dependencies are justified against existing stack
- [ ] Testing strategy covers unit, integration, and e2e levels
- [ ] Existing quality gates are **all** included additively (check, format, lint, test, build -- every available script)
- [ ] Risks have concrete mitigations, not just acknowledgment
- [ ] Open questions list who needs to answer them
- [ ] Implementation phases are independently deployable
- [ ] The PRD avoids prescribing specific code or schemas
- [ ] Security considerations are addressed (or explicitly noted as N/A)
- [ ] Constraints section is present if hard boundaries exist

## Anti-Patterns and Common Failure Modes

Watch for these patterns that indicate a weak PRD:

| Anti-Pattern | Example | Fix |
|-------------|---------|-----|
| **Vague requirements** | "The system should be fast" | Add specific measurable targets with conditions |
| **Compound statements** | "Must support search, filtering, and sorting" | Split into one requirement per statement |
| **Missing non-goals** | Non-goals section is empty or absent | Actively identify reasonable extensions that are deliberately excluded |
| **Implementation leaking in** | "Use a Redis sorted set for the leaderboard" | Rewrite as what + why, not how: "Leaderboard must support real-time ranking of 100K+ users" |
| **Untraceable requirements** | Requirements without `FR-N` labels | Number every requirement for downstream traceability |
| **Wishful success criteria** | "Users will love it" | Replace with measurable KPIs: adoption rate, task completion time, error rate |
| **Risk hand-waving** | "Risk: system might be slow. Mitigation: we'll optimize." | Specify concrete mitigation: caching strategy, load testing plan, performance budget |
| **Scope sprawl** | PRD covers 3 unrelated features | Split into separate PRDs with clear boundaries |

## Measurability Guide

What "measurable" means varies by requirement type:

| Requirement Type | Measurable With | Example |
|-----------------|-----------------|---------|
| **Performance** | Latency percentiles under load | "p95 response time < 200ms at 1000 concurrent users" |
| **Reliability** | Uptime percentage, MTTR | "99.9% availability measured monthly, MTTR < 15 minutes" |
| **Scalability** | Throughput at scale | "Support 10K concurrent connections with linear horizontal scaling" |
| **Accessibility** | Standards compliance + specifics | "WCAG 2.1 AA, all interactive elements keyboard-navigable" |
| **Usability** | Task completion metrics | "Core workflow completable in ≤3 steps, <2min for first-time users" |
| **Security** | Compliance standards or specific checks | "All inputs validated, SQL injection tests pass, OWASP Top 10 addressed" |
| **Data** | Volume, retention, consistency | "Support 1M records per tenant, 90-day retention, eventual consistency <5s" |
