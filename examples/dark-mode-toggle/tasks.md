<!-- PRD: prd.md -->
<!-- Design: design.md -->
<!-- Generated: 2026-06-16 -->
<!-- Last Updated: 2026-06-19 -->

# Tasks: Dark Mode Toggle

> Implementation task list for the Notes dark-mode feature, derived from
> [design.md](design.md) and [prd.md](prd.md). Produced by
> [design-to-tasks](../../skills/design-to-tasks/SKILL.md); statuses updated by
> [tasks-to-code](../../skills/tasks-to-code/SKILL.md). Status markers follow the
> [shared conventions](../../skills/_shared/references/conventions.md#task-status-markers).

## 1. Overview

### Project Summary

Notes needs a light/dark theme with a persisted, OS-aware preference and no flash
of the wrong theme on load. The work decomposes along the design's component
boundaries: token palettes, a storage module, a pure resolver, a React provider,
the toggle, and the inline pre-paint script — then accessibility and contrast.

### Scope Reference

- PRD: [prd.md](prd.md) · Design: [design.md](design.md)
- Phases decomposed: Phase 1 (MVP), Phase 2 (Accessibility & polish)
- Open question affecting tasks: PRD Q1 (two- vs three-state toggle) — does not block; see Future Considerations.

### Task Statistics

| Metric | Count |
|--------|-------|
| Total Tasks | 11 |
| Completed | 11 |
| In Progress | 0 |
| Blocked | 0 |
| Not Started | 0 |

## Phase 1: MVP (7/7 tasks complete)

> Token palettes, storage, resolver, provider, toggle, and the pre-paint script.
> **Goal**: a working, persisted light/dark toggle with no flash — US-1, US-2, FR-1–FR-5.

### Data Layer / Styling

- [x] **Add a dark palette to the design tokens** `[P0]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-2, NFR-2
  - **Acceptance Criteria**:
    - [x] `tokens.css` defines color custom properties for `[data-theme="dark"]` alongside the existing light `:root` values
    - [x] No existing light-theme token value changes
  - **Notes**: Completed 2026-06-17. Reused the existing `--color-*` token names; only added a dark block.

### Backend / Logic

- [x] **Add the `theme-storage` module with a safe fallback** `[P0]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-3, NFR-3
  - **Acceptance Criteria**:
    - [x] `getPreference()` / `setPreference()` read/write `localStorage` key `notes.theme`
    - [x] Both wrap access in `try/catch`; `getPreference()` returns `'system'` and `setPreference()` is a no-op when storage is unavailable
  - **Notes**: Completed 2026-06-17. Verified the fallback by stubbing `localStorage` to throw — see decisions.md.

- [x] **Add the pure `resolveTheme()` helper** `[P0]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-4
  - **Acceptance Criteria**:
    - [x] `resolveTheme('system', prefersDark)` returns `dark`/`light` per the media query
    - [x] `resolveTheme('light'|'dark', …)` returns the explicit value
    - [x] Pure and total (unit-tested)
  - **Notes**: Completed 2026-06-17. Shared by the inline script and the provider so the logic exists once.

- [x] **Add the `ThemeProvider` context** `[P0]` `[M]`
  - **Depends on**: Task 1.2, Task 1.3
  - **Requirements**: FR-2
  - **Acceptance Criteria**:
    - [x] Provides `{ theme, setTheme }` to the tree
    - [x] Initial theme matches the value the inline script applied
    - [x] `setTheme` updates `data-theme` and persists via `theme-storage`
  - **Notes**: Completed 2026-06-18. Followed the existing `src/components/` context pattern.

- [x] **Add the inline pre-paint `theme-script` to `index.html`** `[P0]` `[S]`
  - **Depends on**: Task 1.3
  - **Requirements**: FR-5, NFR-1
  - **Acceptance Criteria**:
    - [x] Inline `<script>` in `<head>`, before the stylesheet, sets `data-theme` from `resolveTheme(getPreference(), …)`
    - [x] Adds < 1 KB to the HTML
  - **Notes**: Completed 2026-06-18. **First placed in `<body>` → flash; moved into `<head>` before the stylesheet after the code review flagged it.** See decisions.md and [review.md](review.md).

### Frontend / UI

- [x] **Add the `ThemeToggle` component** `[P0]` `[M]`
  - **Depends on**: Task 1.4
  - **Requirements**: FR-1
  - **Acceptance Criteria**:
    - [x] Rendered in the app shell so it appears on every page
    - [x] Activating it calls `setTheme` and repaints immediately, no reload
  - **Notes**: Completed 2026-06-18. Keyboard/SR semantics handled in Task 2.1.

### Testing

- [x] **Phase 1 verification: integration test and quality gates** `[P0]` `[M]`
  - **Depends on**: All prior tasks in Phase 1
  - **Requirements**: PRD Section 7 (Testing Strategy), QG-1–QG-5
  - **Acceptance Criteria**:
    - [x] Integration test: toggling flips `data-theme` and persists across a remount
    - [x] `bun run check` passes
    - [x] `bun run format` passes
    - [x] `bun run lint` passes
    - [x] `bun run test` passes
    - [x] `bun run build` passes
    - [x] Phase 1 is independently deployable
  - **Notes**: Completed 2026-06-18.

## Phase 2: Accessibility & polish (4/4 tasks complete)

> Keyboard/screen-reader support and a contrast audit.
> **Goal**: the toggle is fully accessible and both palettes meet AA — FR-6, NFR-2.

### Frontend / UI

- [x] **Make the toggle keyboard- and screen-reader-operable** `[P1]` `[S]`
  - **Depends on**: Task 1.6
  - **Requirements**: FR-6, NFR-2
  - **Acceptance Criteria**:
    - [x] Focusable, activatable with Enter/Space, visible focus ring
    - [x] Exposes the current state via `aria-pressed` and an accessible label
  - **Notes**: Completed 2026-06-18. Added after the review suggestion to expose `aria-pressed`.

- [x] **Audit and fix dark-palette contrast to WCAG AA** `[P1]` `[M]`
  - **Depends on**: Task 1.1
  - **Requirements**: NFR-2
  - **Acceptance Criteria**:
    - [x] Every text/background pair in dark theme measured ≥ 4.5:1 (≥ 3:1 large)
    - [x] Any failing token adjusted; re-measured
  - **Notes**: Completed 2026-06-19. Two muted-text tokens were below AA and were darkened — see decisions.md.

### Testing

- [x] **Regression test: initial `data-theme` set before mount (no FOUC)** `[P0]` `[S]`
  - **Depends on**: Task 1.5
  - **Requirements**: FR-5
  - **Acceptance Criteria**:
    - [x] Test asserts `data-theme` is present on the document root before the app mounts
    - [x] Fails if the inline script is removed or moved after the stylesheet
  - **Notes**: Completed 2026-06-19. Added as the ADR-0001 follow-up to lock in the FOUC fix.

- [x] **Phase 2 verification: integration test and quality gates** `[P0]` `[S]`
  - **Depends on**: All prior tasks in Phase 2
  - **Requirements**: PRD Section 7, QG-1–QG-5
  - **Acceptance Criteria**:
    - [x] `bun run check` / `format` / `lint` / `test` / `build` all pass
    - [x] Manual check: toggle persists across reload; OS default honored on a fresh profile
  - **Notes**: Completed 2026-06-19.

## Dependency Graph

```
Task 1.1 (tokens) ─────────────── Task 2.2 (contrast audit)
Task 1.2 (storage) ┐
Task 1.3 (resolver)┼─ Task 1.4 (provider) ── Task 1.6 (toggle) ── Task 2.1 (a11y)
                   └─ Task 1.5 (inline script) ── Task 2.3 (FOUC test)
Task 1.7 (phase-1 verify) ── after 1.1–1.6
Task 2.4 (phase-2 verify) ── after 2.1–2.3
```

## Requirements Coverage

| Requirement | Task(s) | Status |
|------------|---------|--------|
| FR-1: Toggle on every page | 1.6 | ✅ Covered |
| FR-2: Apply selected theme | 1.1, 1.4 | ✅ Covered |
| FR-3: Persist choice | 1.2 | ✅ Covered |
| FR-4: OS default when unset | 1.3 | ✅ Covered |
| FR-5: No flash before paint | 1.5, 2.3 | ✅ Covered |
| FR-6: Keyboard/SR operable | 2.1 | ✅ Covered |
| NFR-1: < 5 ms / < 1 KB | 1.5 | ✅ Covered |
| NFR-2: WCAG AA contrast | 1.1, 2.1, 2.2 | ✅ Covered |
| NFR-3: Storage-unavailable fallback | 1.2 | ✅ Covered |
| US-1: Switch + persist | 1.6, 1.2 | ✅ Covered |
| US-2: OS default | 1.3, 1.5 | ✅ Covered |
| QG-1…QG-5: gates | 1.7, 2.4 | ✅ Covered |
| QG-6: Code review | [review.md](review.md) | ✅ Covered |

## Future Considerations

- **Explicit "System" toggle state** (PRD Q1): the storage contract already supports `system`; exposing it is a UI-only follow-up if users request it. Not tracked here.
- **Cross-device sync** of the preference: would require the backend store the PRD rules out as a non-goal.
