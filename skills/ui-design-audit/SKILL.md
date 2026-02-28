---
name: ui-design-audit
description: Audit a UI codebase for design system inconsistencies and produce a structured findings report. Use when the user asks to "audit the UI", "check for design inconsistencies", "find loading state issues", "review component consistency", "check the design system", or needs a systematic sweep of visual and interaction quality across the application. Produces a prioritized findings report and a PRD-compatible output that feeds directly into create-a-prd and prd-to-tasks.
metadata:
  version: "1.0.0"
---

# UI Design Audit

## Purpose

Design consistency degrades incrementally — one slightly-off spacing here, a non-standard loading state there. This skill performs a structured sweep of the UI codebase to surface these inconsistencies before they compound into a fragmented user experience.

The output is a prioritized findings report. Because the report follows the same structure as a PRD, it feeds directly into **create-a-prd** (to formalize findings as requirements) and then **prd-to-tasks** (to generate remediation tasks).

## Scope

A UI design audit examines six dimensions. Work through each in order, or scope the audit to specific dimensions if the user specifies (e.g., "just loading states" or "just spacing and sizing").

The six dimensions are defined in [references/audit-checklist.md](references/audit-checklist.md):

1. **Loading States** — Spinners, skeletons, placeholders, and empty states
2. **Spacing and Sizing** — Padding, margin, gap, width, height consistency
3. **Typography** — Font families, sizes, weights, line heights
4. **Color and Theming** — Brand colors, semantic colors (error, warning, success), dark mode
5. **Interactive States** — Hover, focus, active, disabled states on all interactive elements
6. **Animation and Motion** — Transitions, entrance/exit animations, loading animations

## Workflow

### Phase 1: Understand the Design System Baseline

Before auditing, establish what "correct" looks like in this project.

1. **Locate the design system** — Check for:
   - A UI component library (`components/ui/`, `src/components/`, `packages/ui/`)
   - A CSS variables / tokens file (`:root` definitions, `tailwind.config`, `theme.ts`, etc.)
   - A Storybook or component documentation
   - A design file reference in the README or docs

2. **Catalog what exists** — List the canonical components (e.g., `Button`, `Spinner`, `LoadingState`, `Skeleton`, `Card`) and their intended usage.

3. **Note the tech stack** — Tailwind utility classes or CSS custom properties? CSS Modules or styled-components? This determines what "consistent" means at the code level.

If no design system exists, note this as a finding of its own (Critical severity — see [references/severity-guide.md](references/severity-guide.md)) and treat the most-used existing patterns as the de facto baseline.

### Phase 2: Sweep Each Dimension

Work through the checklist in [references/audit-checklist.md](references/audit-checklist.md) for each dimension in scope. For each finding:

- Record the file path and component name
- Describe the inconsistency specifically (not "looks wrong" — be precise: "uses `h-5 w-5` but Spinner canonical size is `h-4 w-4`")
- Assign a severity using [references/severity-guide.md](references/severity-guide.md)
- Note the canonical correct approach

Group findings by dimension, then by severity within each dimension.

### Phase 3: Produce the Findings Report

Write a structured findings report as `plans/<name>/prd.md` — using the PRD format so it can be immediately handed off to **prd-to-tasks** for remediation planning.

**Report structure:**

```
plans/ui-audit-<date>/
└── prd.md   ← findings formatted as a PRD-compatible requirements document
```

Use the PRD schema from [../create-a-prd/references/prd-schema.md](../create-a-prd/references/prd-schema.md) as the output structure. Adapt it:

- **Executive Summary**: what the audit found, overall health assessment
- **Goals**: achieve design system compliance across the scoped dimensions
- **Non-Goals**: explicit dimensions or areas not covered by this audit
- **Findings as Functional Requirements**: each Finding becomes an `FR-N` requirement. Format: "The [component] at [location] shall use [canonical pattern] instead of [current pattern]."
  - Critical findings → `[P0]`
  - Major findings → `[P1]`
  - Minor findings → `[P2]`
- **Non-Functional Requirements**: any cross-cutting standards (e.g., "all loading states must use the `LoadingState` component")
- **Testing Strategy**: how to verify remediation (visual inspection, Storybook snapshot tests, etc.)

### Phase 4: Present and Confirm

Present the findings summary to the user:

1. Overall health (% of components with issues, total findings by severity)
2. Top 3-5 critical findings that should be fixed first
3. Full findings list grouped by dimension

Ask the user to confirm before writing the `prd.md`. Once confirmed, write it and offer to run **prd-to-tasks** to generate a remediation task list.

## Key Principles

**Be specific, not vague.** "Inconsistent spacing" is not a finding. "The `Card` component in `src/components/Card.tsx` uses `p-3` but all other cards use `p-4`" is a finding.

**The baseline is the project's own patterns, not external standards.** If the project uses 8px spacing increments, flagging something as wrong because it doesn't use 4px increments (from another system) is wrong. Audit against what the project itself has established.

**Severity must be calibrated.** Not every inconsistency is critical. A missing hover state on a secondary action is a minor finding; an inconsistent loading state that shows raw data before it loads is critical. See [references/severity-guide.md](references/severity-guide.md).

**Surface the systemic, not just the individual.** If 12 components all use a direct `Loader2` import instead of the shared `Spinner` component, that's one finding with 12 instances — not 12 separate findings. Group systematically.

## References

- [references/audit-checklist.md](references/audit-checklist.md) — Dimension-by-dimension audit criteria
- [references/severity-guide.md](references/severity-guide.md) — How to classify and prioritize findings
- [../create-a-prd/references/prd-schema.md](../create-a-prd/references/prd-schema.md) — PRD structure for the findings report output
