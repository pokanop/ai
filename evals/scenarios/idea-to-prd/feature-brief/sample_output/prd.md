<!-- Committed reference artifact for the feature-brief scenario. A known-good
     PRD produced by running the idea-to-prd skill against input/brief.md.
     evals/run.py grades this when no live output/ exists. -->

# PRD: Note Templates

## 1. Executive Summary

Users repeatedly paste the same structure into new notes — meeting notes,
weekly reviews, one-on-one agendas. This feature lets a user turn any existing
note into a named template and pre-fill new notes from a template picker.
Templates are per-device, persisted in `localStorage`; no server work.

## 2. Goals and Non-Goals

### Goals

- Turn any existing note into a named template
- Offer templates (plus "Blank") in the new-note flow
- Allow renaming and deleting templates
- Keep the new-note flow fast for users who never use templates

### Non-Goals

- Sharing templates between users
- Template variables or placeholders
- Server-side storage of any kind

## 3. User Stories and Requirements

### User Stories

- **US-1**: As a user, I want to save an existing note as a named template so that I can reuse its structure.
- **US-2**: As a user, I want to pick a template when creating a new note so that the note is pre-filled.
- **US-3**: As a user, I want to rename or delete a template so that my template list stays current.

### Functional Requirements

- **FR-1**: Every note must offer a "Save as template" action that prompts for a template name.
- **FR-2**: Empty and duplicate template names must be rejected with an inline message.
- **FR-3**: The new-note flow must present a template picker listing all templates plus a "Blank" option.
- **FR-4**: Selecting a template must pre-fill the new note with the template's content.
- **FR-5**: Templates must be renamable and deletable from the picker.
- **FR-6**: Templates must persist in `localStorage` under the key `notes.templates`.

### Non-Functional Requirements

- **NFR-1**: The new-note flow must add no perceptible latency (< 50 ms overhead) for users with zero templates.
- **NFR-2**: The template picker must be fully keyboard-navigable and screen-reader labeled (WCAG 2.1 AA).
- **NFR-3**: Corrupt or unparseable `localStorage` data must degrade to an empty template list, never a crash.

## 4. Implementation Plan

### Phased Rollout

- **Phase 1 — Storage and model**: the template store (serialize, persist, validate names, migrate-on-corrupt).
- **Phase 2 — UI**: "Save as template" action, naming prompt, template picker, rename and delete interactions.
- **Phase 3 — Accessibility and polish**: keyboard navigation, ARIA labeling, zero-template fast path.

## 5. Testing Strategy

- Unit tests for the store: serialization round-trip, duplicate-name rejection, corrupt-data fallback (FR-2, FR-6, NFR-3).
- Component tests for the picker: pre-fill, rename, delete, "Blank" option (FR-3, FR-4, FR-5).
- A performance check that the new-note flow with zero templates stays within budget (NFR-1).
- An accessibility pass over the picker with the project's axe tooling (NFR-2).

### Quality Gates

- **QG-1**: All existing and new tests pass.
- **QG-2**: Lint and typecheck pass with no new warnings.
- **QG-3**: Axe reports no new violations on the new-note view.

## 6. Open Questions

- **Q1**: Should saving a template capture note metadata (tags) or content only? (Assumed: content only.)
