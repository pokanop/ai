<!-- Committed reference artifact for the note-search-prd scenario. A
     known-good design produced by running the prd-to-design skill against
     input/prd.md. evals/run.py grades this when no live output/ exists. -->

# Design: Full-Text Note Search

## 1. Context

- **Designs**: the full-text note search feature described in `input/prd.md`.
- **Scope of this design**: the search index component, its persistence
  contract, and the query interface the UI consumes. Tokenizer internals and
  ranking-formula tuning are deliberately left to implementation.
- **Status**: Draft

## 2. Architecture Overview

Three components, all client-side; no backend is introduced.

```
┌────────────┐  query   ┌──────────────┐  read/write  ┌──────────────┐
│ Search UI  │ ───────▶ │ SearchIndex  │ ───────────▶ │ IndexStore   │
│ (new)      │ ◀─────── │ (new)        │              │ (new,        │
└────────────┘  results └──────▲───────┘              │  IndexedDB)  │
                               │ change events        └──────────────┘
                        ┌──────┴───────┐
                        │ NoteStore    │
                        │ (existing)   │
                        └──────────────┘
```

- **Search UI** (new) — the search input and ranked result list.
- **SearchIndex** (new) — builds, updates, and queries the inverted index.
- **IndexStore** (new) — persists the serialized index in IndexedDB.
- **NoteStore** (existing) — the current note persistence layer; emits change
  events the index subscribes to. Dependency points from SearchIndex to
  NoteStore, never the reverse.

## 3. Component Responsibilities

### SearchIndex

- **Responsibility**: maintain a queryable inverted index over note titles and bodies.
- **Owns**: the in-memory index structure and its update queue.
- **Depends on**: NoteStore (change events), IndexStore (persistence).
- **Requirements**: FR-1, FR-2, FR-3, NFR-1, NFR-2

### IndexStore

- **Responsibility**: persist and restore the serialized index with a version stamp.
- **Owns**: the IndexedDB object store `search-index` and its schema version.
- **Depends on**: nothing above the browser's IndexedDB API.
- **Requirements**: FR-4, FR-5, NFR-3

### Search UI

- **Responsibility**: capture queries and render ranked results.
- **Owns**: search input state and result-list presentation.
- **Depends on**: SearchIndex (query interface).
- **Requirements**: FR-1, US-1

## 4. API & Interface Contracts

Internal interfaces only — this feature adds no network API.

```
SearchIndex.query(text: string): Result[]
  Result: { noteId: string, score: number, titleMatch: boolean }
  Invariant: results sorted by score desc; title matches outrank body matches (FR-2)
  Invariant: reflects every NoteStore change event received before the call (FR-3)

SearchIndex.applyChange(event: NoteChange): void
  NoteChange: { type: "created" | "updated" | "deleted", noteId: string }
  Invariant: processed off the main thread's critical path (NFR-2)

IndexStore.load(): SerializedIndex | null
  Invariant: returns null on missing, corrupt, or version-mismatched data (FR-5)

IndexStore.save(index: SerializedIndex): Promise<void>
  Invariant: written payload carries the schema version stamp
```

## 5. Data Model & Contracts

- **SerializedIndex** (owned by IndexStore): `{ version: number, terms: Record<string, Posting[]> }`
  where `Posting = { noteId, field: "title" | "body", frequency }`.
- **Relationships**: postings reference notes by id; notes remain owned by NoteStore.
- **Migration impact**: one new IndexedDB object store; no change to existing note storage.
- **Retention & privacy**: the index stores note-derived tokens only, on-device,
  and is capped at 2x the note corpus size (NFR-3); deleting a note removes its postings.

## 6. Sequence Flows

```
Search (US-1):
  1. Search UI → SearchIndex: query("standup notes")
  2. SearchIndex: rank matches, title matches weighted first
  3. SearchIndex → Search UI: Result[] within 200 ms budget (NFR-1)

Edit-then-search (US-2):
  1. NoteStore → SearchIndex: applyChange(updated)
  2. SearchIndex: update postings before servicing the next query (FR-3)
  3. Search UI → SearchIndex: query(...) — results reflect the edit

Cold start (US-3):
  1. SearchIndex → IndexStore: load()
  2a. Valid index → ready without re-indexing (FR-4)
  2b. null (missing/corrupt/version mismatch) → full re-index from NoteStore (FR-5)
```

## 7. Key Decisions

| # | Decision | Choice | ADR |
|---|----------|--------|-----|
| 1 | Index storage engine | IndexedDB (not localStorage) | `adr/0001-index-storage.md` |
| 2 | Ranking scheme | Field-weighted term frequency (reversible; no ADR) | — |

## 8. Cross-Cutting Concerns

- **Security**: no new trust boundary; all data stays on-device. No input reaches
  a server, so injection surface is limited to the tokenizer, which treats
  queries as plain text.
- **Error handling**: IndexStore failures degrade to a full re-index (FR-5);
  query errors surface as an empty result set with a retriable error state.
- **Observability**: index build and query durations are recorded via the app's
  existing client metrics hook to verify NFR-1 in the field.
- **Performance budgets**: 200 ms first-results budget on 5,000 notes (NFR-1)
  allocated as ≤ 50 ms tokenize + ≤ 150 ms rank; updates chunked to keep
  main-thread stalls under 16 ms (NFR-2).

## 9. Risks & Open Technical Questions

- **Risk**: IndexedDB eviction under storage pressure could drop the persisted
  index — mitigated by FR-5's transparent re-index path.
- **Risk**: the 2x size cap (NFR-3) may force posting-list pruning on very
  large corpora; a spike on the reference corpus will validate before Phase 2.
- **Open question**: whether index updates run in a Web Worker or chunked on
  the main thread — decided during Phase 2 implementation; the applyChange
  contract holds either way.
