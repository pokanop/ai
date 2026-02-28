# PRD Document Schema

Write the PRD to `plans/<dasherized-name>/prd.md`. Use this schema as the output structure. Every section is required unless marked optional. Adapt depth to match project complexity -- a small utility needs less detail than a distributed system.

## 1. Executive Summary

- **Problem Statement**: 2-3 sentences. What pain exists, who feels it, and why now.
- **Proposed Solution**: 2-3 sentences. High-level approach and key insight.
- **Success Criteria**: 3-5 measurable KPIs with specific targets (e.g., "reduce p95 latency from 800ms to 200ms").

## 2. Goals and Non-Goals

### Goals

Numbered list of what this project will achieve. Each goal must be:
- Specific and measurable
- Tied to the problem statement
- Achievable within the stated scope

### Non-Goals

Explicit list of what this project will NOT do. Non-goals protect scope and prevent feature creep. Frame as "We will not..." statements. Include things that are reasonable extensions but are deliberately deferred.

### Constraints

Hard boundaries that the solution must work within. These are not choices — they are givens:

- Technical constraints (must use existing database, must support specific browsers)
- Timeline constraints (must ship by date X)
- Team constraints (team size, skill gaps)
- Regulatory constraints (HIPAA, GDPR, SOC2)
- Budget constraints (infrastructure spend limits)

### Scope Check

If the PRD covers more than **2 major features** or has more than **8 functional requirements** that span different subsystems, consider splitting into separate PRDs. Each PRD should focus on a single cohesive initiative.

## 3. User Stories and Requirements

### User Personas

Brief descriptions of the target users. Include their role, technical level, and primary motivation.

### User Stories

Format: `As a [persona], I want to [action] so that [outcome].`

Label each story with the prefix **US-N** (e.g., US-1, US-2). Group by persona or workflow. Each story must have:

- **Acceptance Criteria**: Concrete, testable conditions that define "done"
- **Priority**: P0 (must-have for launch), P1 (should-have), P2 (nice-to-have)

### Functional Requirements

Numbered list of what the system must do, using the label prefix **FR-N** (e.g., FR-1, FR-2). Derive from user stories. These labels are used downstream for traceability when generating task lists.

Be specific:

```diff
- The system should handle errors gracefully.
+ FR-1: The system must return structured error responses with error code, message, and suggested action. All errors must be logged with correlation IDs.
```

### Non-Functional Requirements

Numbered list using the label prefix **NFR-N** (e.g., NFR-1, NFR-2). Cover performance, scalability, accessibility, security, and reliability targets. Use measurable criteria appropriate to the requirement type:

- **Performance**: Response time targets with percentiles (p50, p95, p99) and load conditions
- **Reliability**: Availability targets (e.g., 99.9%) and recovery time objectives
- **Security**: Authentication, authorization, data encryption, and audit requirements
- **Privacy**: Data retention, GDPR/CCPA compliance, PII handling
- **Accessibility**: Standards compliance level (e.g., WCAG 2.1 AA)

## 4. Solution Design

### Approach

Describe the solution at a conceptual level. Explain the "why" behind the approach -- what trade-offs were considered and why this direction was chosen.

### Key Design Decisions

For each significant decision, document:

- **Decision**: What was decided
- **Context**: Why this decision was needed
- **Options Considered**: Brief list of alternatives
- **Rationale**: Why this option was chosen
- **Trade-offs**: What is sacrificed and what is gained

### Architecture Overview

High-level description of how components interact. Include:

- Data flow between components
- Integration points with existing systems
- New dependencies introduced (justify each one)

### Modular Design Principles

- Reuse existing components and infrastructure before adding new ones
- New dependencies require explicit justification
- Design for composability -- components should be independently testable and replaceable
- Follow existing project conventions for module boundaries and file organization

### Security Considerations

Address security as a first-class concern, not an afterthought:

- **Authentication**: How users prove identity (existing auth system, new provider, SSO)
- **Authorization**: How access is controlled (RBAC, ABAC, resource-level permissions)
- **Data protection**: Encryption at rest and in transit, PII handling, data sanitization
- **Input validation**: How untrusted input is validated and sanitized
- **Audit trail**: What actions are logged and how

If security is not a primary concern for this feature, explicitly state why.

## 5. Alternatives Considered

For each major approach that was evaluated and rejected:

- **Alternative**: What it was
- **Pros**: What made it attractive
- **Cons**: Why it was rejected
- **Verdict**: One-line summary of why the chosen approach wins

This section demonstrates thorough thinking and prevents revisiting already-explored paths.

## 6. Implementation Plan

### Phased Rollout

Break implementation into phases. Each phase must be independently deployable and valuable:

- **Phase 1 (MVP)**: Minimum viable scope that delivers core value
- **Phase 2**: Extensions and enhancements
- **Phase N**: Future considerations

### Tech Stack Alignment

- Use the project's existing tech stack, package manager, frameworks, and patterns
- Note any new tools or libraries required with justification
- Reference existing project conventions for file structure, naming, and organization

### Migration and Compatibility

If modifying existing systems:

- Backward compatibility requirements
- Data migration needs
- Feature flag strategy for gradual rollout

## 7. Testing Strategy

### Testing Levels

- **Unit Tests**: What to test at the unit level, key edge cases
- **Integration Tests**: Component interaction verification, API contract testing
- **End-to-End Tests**: Critical user flows that must be covered

### Validation Approach

- Use the project's existing test framework and patterns
- All existing checks must continue to pass (lint, format, type-check, tests)
- Define test data requirements
- Specify performance benchmarks if applicable

### Quality Gates

Label each gate with the prefix **QG-N** (e.g., QG-1, QG-2). Quality gates are **additive** -- list every check command the project has and require all of them to pass. Do not pick a subset.

Discover available scripts (see codebase discovery) and include each one as a separate gate:

```markdown
QG-1: `bun run check` -- Type checking passes with zero errors
QG-2: `bun run format` -- Code formatting matches project standards
QG-3: `bun run lint` -- No lint warnings or errors
QG-4: `bun run test` -- All existing and new tests pass
QG-5: `bun run build` -- Build completes successfully
QG-6: Code review completed
```

Adapt commands to the project's package manager and tooling (npm, yarn, pnpm, cargo, go, make, etc.). If a project has `check`, `format`, `lint`, `test`, and `build` scripts, all five become quality gates -- skipping any one of them is an error.

## 8. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Specific technical risk] | High/Med/Low | High/Med/Low | [Concrete mitigation strategy] |

Include:

- Technical risks (performance, scalability, dependency failures)
- Scope risks (requirement ambiguity, scope creep)
- Timeline risks (dependencies, complexity underestimation)
- Operational risks (deployment, monitoring gaps)

## 9. Open Questions

Numbered list of unresolved decisions or unknowns that need stakeholder input. Each should note:

- Who needs to answer it
- What the impact is of leaving it unresolved
- Any proposed default if no answer is given

## 10. Appendix (Optional)

- Glossary of domain-specific terms
- Links to related PRDs, designs, or research
- Raw data or research that informed decisions
