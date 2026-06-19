# Release Checklist: Dark Mode Toggle v1.4.0

**Date**: 2026-06-19
**Plan**: [prd.md](prd.md)
**Go / No-Go**: GO
**Deployed by**: Notes web team
**Blocking items**: none

> Produced by [release-checklist](../../skills/release-checklist/SKILL.md) from
> [tasks.md](tasks.md) and [prd.md](prd.md).

## Stage 1: Pre-Release Gates

### Task Completion
- [x] All P0 tasks are `[x]` complete (none in `[ ]`, `[~]`, or `[!]`)
- [x] No `[-]` skipped tasks to confirm (none were skipped)
- [x] No tasks are `[~]` in progress

> Task state confirmed with `python3 ../../skills/_shared/scripts/plan-metrics.py tasks.md`
> and `plan-validate.py tasks.md`: 11/11 complete, 0 in-progress, no validation flags.

### Quality Gates
- [x] `bun run check` passes
- [x] `bun run format` passes
- [x] `bun run lint` passes
- [x] `bun run test` passes (42 tests, 100% passing)
- [x] `bun run build` passes (build output: `dist/`)

### PRD Success Criteria
- [x] Switch themes in one interaction — verified by: integration test + manual smoke
- [x] Persists across reloads/sessions — verified by: persistence test (Task 1.7)
- [x] No flash of wrong theme — verified by: FR-5 regression test (Task 2.3) + manual on fresh profile
- [x] OS default on first visit — verified by: `resolveTheme` unit tests + manual on a dark-set OS
- [x] Dark theme meets WCAG AA contrast — verified by: contrast audit (Task 2.2)

## Stage 2: Deployment Prerequisites

### Environment Variables
- [x] None introduced by this release.

### Database Migrations
- [x] None — the feature is client-only.

### Feature Flags
- [x] None — shipping on for all users (additive, defaults to current OS theme).

### External Services
- [x] None added.

## Stage 3: Deployment Steps

- [ ] 1. Tag the release: `git tag v1.4.0 && git push --tags`
- [ ] 2. Deploy the static build: `bun run build` then publish `dist/` via the existing CI deploy
- [ ] 3. Confirm the deployment is live: load the app and check the build hash
- [ ] 4. Invalidate the CDN cache for `index.html` (the inline theme script changed)

## Stage 4: Smoke Tests

### New Features (from this release)
- [ ] Toggle to dark — Steps: click the toggle — Expected: UI switches immediately to dark
- [ ] Persistence — Steps: toggle dark, reload — Expected: still dark, no flash
- [ ] OS default — Steps: clear storage on an OS set to dark, load — Expected: app renders dark

### Existing Critical Paths (regression check)
- [ ] Create a note — Steps: open editor, type, save — Expected: note saved, readable in both themes
- [ ] Search — Steps: search a known note — Expected: results render correctly in the active theme

## Stage 5: Rollback Plan

**Decision criteria**: Roll back if:
- [ ] Any client error rate exceeds baseline +1% within 30 minutes of deploy
- [ ] A P0 smoke test fails and cannot be fixed within 30 minutes
- [ ] The theme script breaks first paint on a supported browser

**Rollback steps**:
1. Re-publish the previous build artifact (tag `v1.3.x`)
2. Invalidate the CDN cache for `index.html`
3. Notify the team in the release channel

**Time to rollback**: Estimated < 10 minutes. No data migration, so rollback is clean.

## Stage 6: Post-Release Verification

- [ ] Client error rate is at baseline (check: error tracker)
- [ ] No spike in console errors referencing `localStorage` or `data-theme` (check: log aggregator)
- [ ] Theme toggle works on the top 3 supported browsers (manual)
- [ ] Notify the team that v1.4.0 is live

---

## Changelog Entry (for `CHANGELOG.md`)

```markdown
## [1.4.0] — 2026-06-19

### Added
- **Dark mode.** Notes now has a light and dark theme with a toggle on every
  page. Your choice is remembered on this device, and if you haven't picked one,
  Notes follows your system's appearance setting. The page no longer flashes the
  wrong colors while loading, and the dark theme meets WCAG AA contrast.
```
