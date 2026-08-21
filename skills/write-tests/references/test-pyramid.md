# The Test Pyramid

How to choose the right level for each behavior, and how to keep the overall
suite shape healthy. Used by `write-tests` Phase 2 (level selection) and as a
sanity check on the finished pass.

## The Levels

```
        /  E2E  \          few — critical user journeys only
       / integr. \         some — wiring between real parts
      /   unit    \        many — logic, branches, edge cases
```

| Level | Exercises | Speed / stability | Use for |
|-------|-----------|-------------------|---------|
| **Unit** | One function, class, or component in isolation; collaborators doubled at the project's established boundary | Milliseconds; fully deterministic | Branching logic, calculations, parsing/formatting, validation, error mapping, edge cases |
| **Integration** | Several real units wired together — a route handler with its real service, a component with its real store, a repository against a real (local/ephemeral) database | Slower; deterministic with controlled infrastructure | Contracts between layers, serialization boundaries, query correctness, dependency-injection wiring, middleware ordering |
| **End-to-end** | The deployed-shaped system through its public interface (browser, CLI, API) | Slowest; most fragile | A handful of critical user journeys — the paths whose breakage is an incident |

## Choosing the Level for a Behavior

Work down this list; the first match wins:

1. **Is it pure-ish logic with meaningful branches?** → Unit. Push edge cases here — this is the cheapest place to enumerate them.
2. **Is the risk in the *wiring* rather than the logic?** (Wrong query, wrong serialization, handler not registered, event not dispatched) → Integration. A unit test with everything mocked would just test the mocks.
3. **Is it a journey whose breakage is user-visible and business-critical?** (Sign-up, checkout, the app's core loop) → One end-to-end test — and unit/integration tests underneath for its branches.
4. **Is it glue with no branches?** (A one-line delegation, a re-export) → Usually not worth a dedicated test; it is exercised by the tests above it.

**Test each behavior at the lowest level that can actually catch its failure.**
Duplicating the same assertion at multiple levels adds run time and maintenance
without adding protection.

## Anti-patterns That Distort the Pyramid

- **Ice cream cone** — most coverage in slow end-to-end tests. Symptom: a suite
  that takes an hour and fails for unrelated reasons. Backfills should
  deliberately fill in the unit/integration base instead of adding more scoops.
- **Mockery** — unit tests where every collaborator is a mock and the
  assertions verify mock call sequences. These pass through refactors that
  break production and fail on refactors that don't. Prefer real collaborators
  in-process, doubling only at the project's established boundary (network,
  clock, filesystem, database).
- **Testing the framework** — asserting that the router routes or the ORM maps.
  Test *your* configuration and logic, not the dependency's contract.
- **Snapshot sprawl** — golden files capturing entire large outputs as a
  substitute for targeted assertions. Snapshots are legitimate
  characterization tools (see the coverage strategy reference), but each one
  should cover a deliberately chosen surface, reviewed like any assertion.

## Component / UI Testing

For UI code, the same shape applies with renamed layers: unit-test pure logic
(hooks, reducers, formatters), integration-test the component rendering with
real children and a doubled network, and reserve browser-driven end-to-end
tests for the few critical flows. Accessibility-relevant behavior (roles,
labels, keyboard operability) belongs in the component-level tests where it is
cheap to assert.

## Fitting the Project

The pyramid describes *relative* proportions, not absolute counts. A CLI tool
may need no end-to-end layer at all; a thin CRUD service may be mostly
integration tests. Respect the shape the project has already committed to
(discovered in Phase 1) — a backfill's job is to deepen coverage inside the
existing structure, not to introduce a new testing philosophy mid-pass.
