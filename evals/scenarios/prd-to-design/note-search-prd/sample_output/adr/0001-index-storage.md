<!-- Committed reference artifact — see ../design.md. -->

# ADR 0001: Index storage engine

- **Status**: Accepted
- **Date**: 2026-08-21
- **Deciders**: design review
- **Requirements**: FR-4, FR-5, NFR-3

## Context

The search index must persist across sessions (FR-4) so startup does not
require a full re-index, and its size may approach 2x a large note corpus
(NFR-3). The browser offers two persistence options with very different
capacity and access characteristics, and the PRD's Q1 explicitly defers the
choice to the design.

## Decision

We will store the serialized index in IndexedDB, in a dedicated
`search-index` object store, stamped with a schema version.

## Alternatives Considered

- **localStorage** — simplest API and already used for app settings, but
  synchronous (blocking the main thread on large reads, violating NFR-2) and
  capped around 5 MB, which a 2x-corpus index would exceed on realistic note
  collections. Rejected on capacity and main-thread cost.
- **No persistence (re-index every session)** — least code, but violates FR-4
  outright and makes cold start scale with corpus size, breaking US-3.
  Rejected as non-compliant.

## Consequences

- **Positive**: asynchronous access keeps index loads off the main thread;
  capacity comfortably fits the NFR-3 size cap.
- **Negative / costs**: IndexedDB's API is more complex than localStorage and
  data can be evicted under storage pressure, so the corrupt/missing-index
  recovery path (FR-5) is mandatory, not optional.
- **Follow-ups**: design-to-tasks must create tasks for the versioned
  serialization format and the eviction/corruption recovery test.
