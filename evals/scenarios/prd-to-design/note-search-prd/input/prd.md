<!-- Eval fixture for the prd-to-design skill. A structurally complete PRD
     whose feature is meaty enough to warrant a design: a new storage
     component, an index contract, and at least one hard-to-reverse decision
     (the index engine) that must become an ADR. -->

# PRD: Full-Text Note Search

## 1. Executive Summary

Notes users can only filter by tag and date. This feature adds full-text
search over note titles and bodies with sub-second results, entirely
client-side: an index maintained in the browser, updated as notes change.

## 2. Goals and Non-Goals

### Goals

- Search note titles and bodies by keyword with ranked results
- Keep the index current as notes are created, edited, and deleted
- Work fully offline — no network dependency for search

### Non-Goals

- Server-side search or any backend component
- Fuzzy/semantic search or synonyms
- Searching attachments or images

## 3. User Stories and Requirements

### User Stories

- **US-1**: As a user, I want to type a query and see matching notes ranked by relevance so that I find the right note fast.
- **US-2**: As a user, I want search results to reflect an edit I just made so that results are never stale.
- **US-3**: As a user with many notes, I want the first search of a session to be fast so that I don't wait for indexing.

### Functional Requirements

- **FR-1**: A search input must accept a keyword query and return notes whose title or body matches.
- **FR-2**: Results must be ranked, with title matches weighted above body matches.
- **FR-3**: Creating, editing, or deleting a note must update the index before the next search completes.
- **FR-4**: The index must persist across sessions so that startup does not require a full re-index.
- **FR-5**: A corrupt or version-incompatible persisted index must trigger a transparent full re-index.

### Non-Functional Requirements

- **NFR-1**: Search over 5,000 notes must return first results within 200 ms.
- **NFR-2**: Index updates must not block the note editor's input handling (no main-thread stalls > 16 ms).
- **NFR-3**: The persisted index must not exceed 2x the total size of the note corpus.

## 4. Implementation Plan

### Phased Rollout

- **Phase 1 — Index core**: tokenizer, index build, ranked query.
- **Phase 2 — Incremental updates and persistence**: change hooks, persisted index, corrupt-index recovery.
- **Phase 3 — Search UI**: input, ranked result list, keyboard navigation.

## 5. Testing Strategy

- Unit tests for tokenizer and ranking (FR-1, FR-2).
- Integration tests for incremental updates and persistence round-trip (FR-3, FR-4, FR-5).
- A performance benchmark on the 5,000-note reference corpus (NFR-1, NFR-2, NFR-3).

### Quality Gates

- **QG-1**: All existing and new tests pass.
- **QG-2**: The performance benchmark meets every NFR budget.

## 6. Open Questions

- **Q1**: Should the index live in IndexedDB or localStorage? (Size limits likely force IndexedDB — design must decide.)
