<!-- Committed reference artifact for the basic-prd scenario. A known-good
     task list produced by running the design-to-tasks skill against
     input/prd.md. evals/run.py grades this when no live output/ exists. -->
<!-- PRD: input/prd.md -->

# Tasks: Saved Search Filters

> Implementation tasks for the saved search filters feature, decomposed from
> the PRD (no design.md — PRD fallback path).

## Phase 1: Storage and Model

> **Goal**: Saved filter sets serialize, persist, and survive corrupt data.

- [ ] **Task 1.1: Saved-filter store with localStorage persistence** `[P0]` `[M]`
  - **Depends on**: None
  - **Requirements**: FR-6
  - **Acceptance Criteria**:
    - [ ] Filter sets serialize/deserialize round-trip losslessly
    - [ ] Data persists under the `notes.savedFilters` localStorage key

- [ ] **Task 1.2: Name validation** `[P0]` `[S]`
  - **Depends on**: Task 1.1
  - **Requirements**: FR-2
  - **Acceptance Criteria**:
    - [ ] Empty names are rejected with a validation error
    - [ ] Duplicate names are rejected with a validation error

- [ ] **Task 1.3: Corrupt-data fallback** `[P0]` `[S]`
  - **Depends on**: Task 1.1
  - **Requirements**: NFR-3
  - **Acceptance Criteria**:
    - [ ] Unparseable localStorage data yields an empty saved-filter list
    - [ ] No exception escapes the store on corrupt data

## Phase 2: UI

> **Goal**: A user can save, apply, and delete filter sets from the search bar.

- [ ] **Task 2.1: "Save filters" action and naming prompt** `[P0]` `[M]`
  - **Depends on**: Task 1.2
  - **Requirements**: FR-1, FR-2, US-1
  - **Acceptance Criteria**:
    - [ ] Action appears only when at least one filter is active
    - [ ] Invalid names show an inline message from the store's validation

- [ ] **Task 2.2: Saved-filter dropdown with apply** `[P0]` `[M]`
  - **Depends on**: Task 2.1
  - **Requirements**: FR-3, FR-4, US-2, NFR-1
  - **Acceptance Criteria**:
    - [ ] Dropdown lists saved filter sets most recently used first
    - [ ] Selecting a set replaces all active filters with the saved state
    - [ ] Applying completes within 100 ms on the 1,000-note reference dataset

- [ ] **Task 2.3: Delete saved filter sets** `[P1]` `[S]`
  - **Depends on**: Task 2.2
  - **Requirements**: FR-5, US-3
  - **Acceptance Criteria**:
    - [ ] Each set is deletable from the dropdown without a confirmation dialog

## Phase 3: Accessibility and Polish

> **Goal**: The dropdown meets WCAG 2.1 AA and the quality gates pass.

- [ ] **Task 3.1: Keyboard navigation and ARIA labeling** `[P1]` `[M]`
  - **Depends on**: Task 2.2
  - **Requirements**: NFR-2
  - **Acceptance Criteria**:
    - [ ] Dropdown is fully operable by keyboard
    - [ ] All controls are screen-reader labeled

- [ ] **Task 3.2: Quality-gate verification** `[P0]` `[S]`
  - **Depends on**: Task 3.1
  - **Requirements**: QG-1, QG-2, QG-3
  - **Acceptance Criteria**:
    - [ ] All existing and new tests pass
    - [ ] Lint and typecheck pass with no new warnings
    - [ ] Axe reports no new violations on the search view

## Requirements Coverage

| Requirement | Task(s) | Status |
|-------------|---------|--------|
| FR-1 | Task 2.1 | Planned |
| FR-2 | Task 1.2, 2.1 | Planned |
| FR-3 | Task 2.2 | Planned |
| FR-4 | Task 2.2 | Planned |
| FR-5 | Task 2.3 | Planned |
| FR-6 | Task 1.1 | Planned |
| NFR-1 | Task 2.2 | Planned |
| NFR-2 | Task 3.1 | Planned |
| NFR-3 | Task 1.3 | Planned |
| US-1 | Task 2.1 | Planned |
| US-2 | Task 2.2 | Planned |
| US-3 | Task 2.3 | Planned |
| QG-1 | Task 3.2 | Planned |
| QG-2 | Task 3.2 | Planned |
| QG-3 | Task 3.2 | Planned |
