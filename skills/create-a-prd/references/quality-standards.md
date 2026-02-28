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
- [ ] Alternatives were considered and documented
- [ ] New dependencies are justified against existing stack
- [ ] Testing strategy covers unit, integration, and e2e levels
- [ ] Existing quality gates (lint, format, type-check, test) are included
- [ ] Risks have concrete mitigations, not just acknowledgment
- [ ] Open questions list who needs to answer them
- [ ] Implementation phases are independently deployable
- [ ] The PRD avoids prescribing specific code or schemas
