# Severity Guide

How to classify and prioritize findings in a UI design audit. Consistent severity assignment is what makes the findings report actionable rather than overwhelming.

---

## Severity Levels

Findings use the single shared [severity scale](../../_shared/references/conventions.md#severity-and-priority) — `🔴 Critical` / `🟡 Major` / `⚪ Minor`, mapping to `[P0]` / `[P1]` / `[P2]`. In a UI audit, the levels mean:

| Severity | Marker | In a UI audit |
|----------|--------|---------------|
| Critical | `🔴` | Broken user experience — the UI fails to communicate information, confuses users, or blocks a workflow |
| Major | `🟡` | Noticeable inconsistency — a trained eye will see it, or it creates friction in repeated use |
| Minor | `⚪` | Subtle deviation — pixel-level or polish-level, does not affect usability |

---

## Classification Guide

### 🔴 Critical — Use when:

- **Functionality is broken by a visual issue**: A button that looks disabled but is active, or vice versa
- **Information fails to load visually**: A component shows raw data, errors, or a blank state during loading
- **Loading state is absent**: An async operation has no visual feedback, leaving users to wonder if anything is happening
- **Accessibility is compromised (WCAG 2.1 AA)**: A keyboard trap or an interactive element that cannot be reached/operated by keyboard, no visible focus state on interactive elements, an icon-only control or form field with no accessible name, missing ARIA that screen readers require, or a contrast ratio below 4.5:1 for body text / 3:1 for large text
- **Dark mode breaks a feature**: Text is invisible, a control disappears, or the UI becomes unreadable in dark mode
- **Error states are missing**: An operation that can fail has no visible error state — users see nothing when it fails

**Ask yourself:** "Would a user be confused or blocked by this?" If yes → Critical.

### 🟡 Major — Use when:

- **Inconsistency is user-visible but not breaking**: A button has slightly different padding in one section, a heading is a different weight on one page
- **A shared component is not being used**: A loading spinner is built ad hoc instead of using the canonical `Spinner` component — not broken, but diverges from the system
- **Interactive states are missing on non-critical elements**: A secondary button has no hover state — not broken, but feels unpolished
- **Spacing deviates from the scale by more than one step**: Using `gap-5` where all similar layouts use `gap-4`
- **Animation is inconsistent**: A modal animates in on one page but not another
- **Accessibility is degraded but not blocking**: A custom widget missing an ARIA state (`aria-expanded`), a validation error shown visually but not associated via `aria-describedby`, skipped heading levels, a non-text element below 3:1 contrast, or `prefers-reduced-motion` not honored for large motion

**Ask yourself:** "Would a user notice this in repeated use, or would a developer need to call it out specifically?" If a user would notice → Major.

### ⚪ Minor — Use when:

- **One-step deviation from scale**: `p-3` vs `p-4` on a non-canonical component
- **Naming or token is slightly off**: A component uses the right color visually but references a token from a different semantic group
- **An animation duration is slightly off**: `duration-100` vs `duration-150` on a transition
- **Redundant/duplicate pattern**: Two components do the same thing but are used in different contexts — they should be consolidated, but it doesn't affect the user today
- **Cosmetic accessibility nit**: A decorative image missing `alt=""` (announced as noise), or redundant ARIA on a native element (`role="button"` on a `<button>`)

**Ask yourself:** "Would a non-designer user ever notice this?" If no → Minor.

---

## Accessibility Severity Mapping (WCAG 2.1 AA)

Accessibility findings (Dimension 7) map to severity by how much they break the experience for keyboard and assistive-tech users. Use this table as the default; calibrate up if the affected control is on a critical path.

| Accessibility violation | Severity |
|--------------------------|----------|
| Keyboard trap — focus enters a widget and cannot leave | 🔴 Critical |
| Interactive element not reachable/operable by keyboard | 🔴 Critical |
| Text contrast below 4.5:1 (body) or 3:1 (large text) | 🔴 Critical |
| No visible focus indicator on interactive elements | 🔴 Critical |
| Icon-only control with no accessible name | 🔴 Critical |
| Form control with no programmatically associated label | 🔴 Critical |
| Content flashing more than 3×/second (seizure risk) | 🔴 Critical |
| Custom widget missing/incorrect ARIA state (`aria-expanded`, etc.) | 🟡 Major |
| Validation error not associated with its field (`aria-describedby`) | 🟡 Major |
| Non-semantic element where a native one exists (`<div onClick>`) | 🟡 Major |
| Skipped heading levels or multiple `<h1>` per page | 🟡 Major |
| Missing landmark regions (`<main>`, `<nav>`) | 🟡 Major |
| Non-text element (icon, border) below 3:1 contrast | 🟡 Major |
| `prefers-reduced-motion` not honored for non-essential animation | 🟡 Major |
| Decorative image missing `alt=""` (announced as noise) | ⚪ Minor |
| Redundant ARIA on a native element (`role="button"` on `<button>`) | ⚪ Minor |

These severities flow through the same PRD priority mapping below (Critical → `[P0]`, Major → `[P1]`, Minor → `[P2]`).

---

## Grouping Findings

When the same issue appears in many places, group them into a single finding with instances listed:

```
🟡 Major — Bare `Loader2` icon used instead of `Spinner` component (12 instances)

The canonical `<Spinner />` component should be used for all loading indicators.
Direct `Loader2` imports bypass the size and color standardization built into `Spinner`.

Instances:
- src/components/Dashboard/RecentActivity.tsx:34
- src/components/Profile/ProfileCard.tsx:18
- src/pages/settings/index.tsx:72
... (9 more)
```

Do not file 12 separate Minor/Major findings for the same pattern. One finding with instances is easier to act on.

---

## Priority Mapping to PRD

When the audit output is formatted as a PRD (for handoff to `create-a-prd` / `prd-to-tasks`), map each finding's severity to its PRD priority using the canonical [severity↔priority mapping](../../_shared/references/conventions.md#severity-and-priority): `🔴 Critical → [P0]` (fix before next release), `🟡 Major → [P1]` (fix in the current cycle), `⚪ Minor → [P2]` (fix when adjacent work is being done).

---

## What Not to Flag

Severity is calibrated to the **project's own baseline**, not to an external design system or personal preference.

**Do not flag as findings:**
- Code that deviates from Tailwind's default scale if the project uses a custom scale
- Spacing that differs from Material Design or another external standard, unless the project explicitly targets that standard
- Stylistic preferences (e.g., "I would have used rounded-lg instead of rounded-md")
- Features that are correctly implemented but could be "improved" — those belong in Future Opportunities, not audit findings

**The exception is accessibility.** WCAG 2.1 AA is a baseline every project shares regardless of its own conventions. A contrast failure, a keyboard trap, or an unlabeled control is a finding even when it is applied consistently across the codebase — "consistently inaccessible" is still inaccessible. Dimension 7 audits against the WCAG standard, not the project's patterns.

The audit answers "does this deviate from what this project has established?" not "how does this compare to my ideal UI?"
