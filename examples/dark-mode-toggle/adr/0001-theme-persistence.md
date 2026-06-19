# ADR 0001: Theme persistence mechanism

- **Status**: Accepted
- **Date**: 2026-06-16
- **Deciders**: Notes web team
- **Requirements**: FR-3 (persist choice), FR-5 (no flash before paint), NFR-1 (< 5 ms / < 1 KB), NFR-3 (resilient when storage is unavailable)

## Context

The theme preference must survive reloads and sessions, and it must be readable
**before the React app mounts** — otherwise the page paints in the default theme
and then snaps to the user's theme (a flash). Notes is a client-rendered SPA with
no per-user settings backend, and adding one is an explicit non-goal of the PRD.
So the question is narrow: where does the preference live, and how is it read
early enough to set the theme before first paint?

## Decision

We will persist the preference in **`localStorage`** under the key `notes.theme`,
and apply it with a small **inline script in the document `<head>`** that runs
before the stylesheet paints. The same pure `resolveTheme()` logic is shared by
the inline script and the `ThemeProvider`.

## Alternatives Considered

- **Cookie** — readable on the server and sent with every request. But Notes has
  no server render to make use of it; the cookie would still be applied
  client-side, while adding request-header weight on every call. Rejected: cost
  with no SSR benefit to claim.
- **Server-side user setting** — syncs across devices, the nicest UX. But it
  requires a backend store and authenticated requests, both explicit PRD
  non-goals, and it cannot be read before paint without an SSR round-trip.
  Rejected: out of scope and does not solve the pre-paint constraint.
- **In-memory only (no persistence)** — trivial, but fails FR-3 outright.
  Rejected.

## Consequences

- **Positive**: synchronous, dependency-free reads available before paint;
  satisfies FR-3 and FR-5 with a few lines and no network. Comfortably within
  the NFR-1 budget.
- **Negative / costs**: the preference is **per-device**, not synced across a
  user's devices (accepted per the PRD non-goals). The theme logic exists in two
  call sites (inline script + provider), so it must be factored into one shared
  `resolveTheme()` to avoid divergence.
- **Follow-ups** for `design-to-tasks`:
  - A task to add the inline `<head>` script (Task 1.5).
  - A task to wrap storage access with a fallback when `localStorage` is
    unavailable, NFR-3 (Task 1.2).
  - A regression test asserting the initial `data-theme` is set before mount,
    guarding FR-5 (Task 2.3).
