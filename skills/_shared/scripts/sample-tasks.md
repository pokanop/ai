<!-- PRD: plans/url-shortener/prd.md -->
<!-- Generated: 2026-06-01 -->
<!-- Last Updated: 2026-06-12 -->

# Tasks: URL Shortener

> Implementation tasks for the URL shortener service described in the PRD.
>
> This file is a fixture for `plan-metrics.py` and `plan-validate.py`. It is a
> realistic plan that deliberately contains a few mistakes so `plan-validate`
> has something to report — see `README.md` for the expected findings.

## 1. Overview

### Task Statistics

| Metric | Count |
|--------|-------|
| Total Tasks | 10 |
| Completed | 4 |
| In Progress | 2 |
| Blocked | 1 |
| Skipped | 1 |
| Not Started | 2 |

## Phase 1: Foundation

> Data model and core shortening logic.
> **Goal**: A link can be created and stored.

### Data Layer

- [x] **Task 1.1: Create links table and migration** `[P0]` `[M]`
  - **Depends on**: None
  - **Requirements**: FR-1
  - **Acceptance Criteria**:
    - [x] `links` table with slug, target_url, created_at
    - [x] Migration runs cleanly
  - **Notes**: Followed the existing migration pattern.

- [x] **Task 1.2: Slug generation service** `[P0]` `[S]`
  - **Depends on**: Task 1.1
  - **Requirements**: FR-2
  - **Acceptance Criteria**:
    - [x] Generates unique 7-character slugs

### Backend / API

- [~] **Task 1.3: Create shorten endpoint** `[P0]` `[M]`
  - **Depends on**: Task 1.2
  - **Requirements**: FR-2, US-1
  - **Acceptance Criteria**:
    - [x] POST /api/shorten returns 201 with a slug
    - [ ] Validates the target URL

- [ ] **Task 1.4: Phase 1 verification** `[P0]` `[M]`
  - **Depends on**: Task 1.3
  - **Requirements**: QG-1
  - **Acceptance Criteria**:
    - [ ] All Phase 1 tasks are complete

## Phase 2: Redirect and Analytics

> Public redirect path and click tracking.
> **Goal**: A short link redirects and records a hit.

### Backend / API

- [x] **Task 2.1: Redirect handler** `[P0]` `[M]`
  - **Depends on**: Task 1.2
  - **Requirements**: FR-3, US-2
  - **Acceptance Criteria**:
    - [x] GET /:slug 302-redirects to the target URL

- [~] **Task 2.2: Click analytics** `[P1]` `[L]`
  - **Depends on**: Task 2.1
  - **Requirements**: FR-4
  - **Acceptance Criteria**:
    - [ ] Each redirect increments a per-link counter

- [!] **Task 2.3: Geo analytics dashboard** `[P1]` `[L]`
  - **Depends on**: Task 2.4
  - **Requirements**: FR-5
  - **Notes**: UI scaffolding started.

- [-] **Task 2.4: Real-time WebSocket updates** `[P2]` `[XL]`
  - **Depends on**: Task 2.2
  - **Requirements**: FR-6

### Testing

- [x] **Add redirect integration tests** `[P1]` `[M]`
  - **Depends on**: Task 2.1
  - **Acceptance Criteria**:
    - [x] Happy-path redirect is covered

## Risk Mitigation Tasks

- [ ] **Rate limit the shorten endpoint** `[P1]` `[M]`
  - **Risk**: PRD Risk #1 (abuse via bulk shortening)
  - **Acceptance Criteria**:
    - [ ] Returns 429 past 60 requests/min per IP

## Requirements Coverage

| Requirement | Task(s) | Status |
|-------------|---------|--------|
| FR-1 | Task 1.1 | Covered |
| FR-2 | Task 1.2, 1.3 | Covered |
| FR-3 | Task 2.1 | Covered |
| FR-4 | Task 2.2 | Partial |
| FR-5 | Task 2.3 | Blocked |
| FR-6 | Task 2.4 | Skipped |
| FR-7 | — | Not covered |
| US-1 | Task 1.3 | Covered |
| US-2 | Task 2.1 | Covered |
| QG-1 | Task 1.4 | Covered |
