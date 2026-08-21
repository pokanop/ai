<!-- Eval fixture for the design-to-tasks skill. Deliberately small but
     structurally complete: goals, labeled requirements, phases, testing
     strategy, and quality gates — everything design-to-tasks requires. -->

# PRD: Saved Search Filters

## 1. Executive Summary

Notes users rebuild the same search filters (tag + date range + sort) every
session. This feature lets a user save a named filter set and re-apply it in
one click. Client-side only; filters persist in `localStorage`.

## 2. Goals and Non-Goals

### Goals

- Save the current search filter state under a user-chosen name
- Re-apply a saved filter set in one interaction
- Persist saved filters across sessions on the same device

### Non-Goals

- Syncing filters across devices or accounts
- Sharing filters between users
- Server-side storage of any kind

## 3. User Stories and Requirements

### User Stories

- **US-1**: As a returning user, I want to save my current filters under a name so that I don't rebuild them every session.
- **US-2**: As a returning user, I want to apply a saved filter set in one click so that I get to my results immediately.
- **US-3**: As a user, I want to delete a saved filter set so that stale filters don't clutter the list.

### Functional Requirements

- **FR-1**: The search bar must offer a "Save filters" action whenever at least one filter is active.
- **FR-2**: Saving must prompt for a name; empty and duplicate names must be rejected with an inline message.
- **FR-3**: Saved filter sets must be listed in a dropdown, most recently used first.
- **FR-4**: Selecting a saved filter set must replace all active filters with the saved state.
- **FR-5**: Each saved filter set must be deletable from the dropdown, with no confirmation dialog.
- **FR-6**: Saved filter sets must persist in `localStorage` under the key `notes.savedFilters`.

### Non-Functional Requirements

- **NFR-1**: Applying a saved filter set must complete within 100 ms on the reference dataset (1,000 notes).
- **NFR-2**: The dropdown must be fully keyboard-navigable and screen-reader labeled (WCAG 2.1 AA).
- **NFR-3**: Corrupt or unparseable `localStorage` data must degrade to an empty saved-filter list, never a crash.

## 4. Implementation Plan

### Phased Rollout

- **Phase 1 — Storage and model**: the saved-filter store (serialize, persist, validate, migrate-on-corrupt).
- **Phase 2 — UI**: save action, naming prompt, dropdown list, apply and delete interactions.
- **Phase 3 — Accessibility and polish**: keyboard navigation, ARIA labeling, MRU ordering.

## 5. Testing Strategy

- Unit tests for the store: serialization round-trip, duplicate-name rejection, corrupt-data fallback (FR-2, FR-6, NFR-3).
- Component tests for the dropdown: apply, delete, MRU ordering (FR-3, FR-4, FR-5).
- An accessibility pass over the dropdown with the project's axe tooling (NFR-2).

### Quality Gates

- **QG-1**: All existing and new tests pass.
- **QG-2**: Lint and typecheck pass with no new warnings.
- **QG-3**: Axe reports no new violations on the search view.

## 6. Open Questions

- **Q1**: Should applying a saved filter merge with or replace pinned filters? (Assumed: replace — see FR-4.)
