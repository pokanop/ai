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

## 3. User Stories and Requirements

### User Personas

Brief descriptions of the target users. Include their role, technical level, and primary motivation.

### User Stories

Format: `As a [persona], I want to [action] so that [outcome].`

Group by persona or workflow. Each story must have:

- **Acceptance Criteria**: Concrete, testable conditions that define "done"
- **Priority**: P0 (must-have for launch), P1 (should-have), P2 (nice-to-have)

### Functional Requirements

Numbered list of what the system must do. Derive from user stories. Be specific:

```diff
- The system should handle errors gracefully.
+ The system must return structured error responses with error code, message, and suggested action. All errors must be logged with correlation IDs.
```

### Non-Functional Requirements

Performance, scalability, accessibility, security, and reliability targets. Use measurable criteria:

- Response time targets (p50, p95, p99)
- Availability targets (e.g., 99.9%)
- Data retention and privacy requirements
- Accessibility standards (e.g., WCAG 2.1 AA)

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

Define what must pass before shipping:

- All existing tests pass
- New tests cover critical paths
- Lint and format checks pass
- Type checking passes (if applicable)
- Code review completed

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
