<!-- Review of: Dark Mode Toggle (Phase 1–2, branch pok-dark-mode) -->
<!-- Reviewer: Agent (code-review skill) -->
<!-- Date: 2026-06-18 -->

# Code Review: Dark Mode Toggle

> Produced by [code-review](../../skills/code-review/SKILL.md). Severities use the
> shared [severity scale](../../skills/_shared/references/conventions.md#severity-and-priority):
> `🔴 Blocking` · `🟡 Suggestion` · `⚪ Nit` · `✅ Praise`.

## Summary

**Overall**: One blocking issue (a real flash of the wrong theme) must be fixed before merge; the rest is solid.
**Scope**: 6 files — token CSS, `theme-storage`, `resolveTheme`, `ThemeProvider`, `ThemeToggle`, and `index.html`. Reviewed against [tasks.md](tasks.md) Phase 1–2 acceptance criteria.
**Risk Profile**: Low — client-only, no auth/data; the main risk is the FOUC behavior that FR-5 calls out.
**Requirements**: Reviewed against FR-1–FR-6 and NFR-1–NFR-3. 5/6 FRs met at round 1; FR-5 failed pending the fix below.

## Blocking Items

- [x] `index.html` — Theme script runs after the stylesheet, causing a flash (FR-5)

  🔴 **Blocking** — The inline theme script sits at the end of `<body>`, after the stylesheet `<link>`. The page paints in the light default and then snaps to the stored theme — the exact flash FR-5 forbids.
  **Fix**: Move the script inline into `<head>`, before the stylesheet, so `data-theme` is set before first paint. Add a regression test asserting the attribute is present before mount.

## Suggestions

- [x] `src/components/ThemeToggle.tsx` — Toggle state not exposed to assistive tech (FR-6)

  🟡 **Suggestion** — The toggle is a clickable `div` with no pressed state. Screen-reader users can't tell which theme is active, and it isn't keyboard-activatable.
  **Fix**: Render a `<button>`, expose `aria-pressed`, and ensure Enter/Space activate it. (Tracked as Task 2.1.)

## Nits

- [x] `src/theme/storage.ts:14` — Variable `v` → `value`

  ⚪ **Nit** — `const v = window.localStorage.getItem(KEY)` reads more clearly as `value`.

## Praise

✅ **Praise** — `src/theme/resolve.ts` — `resolveTheme()` is pure, total, and unit-tested, and it's shared by both the inline script and the provider. That single source of truth is exactly why the two call sites can't drift.

## Requirements Coverage

| Acceptance Criterion | Status | Notes |
|---------------------|--------|-------|
| Toggle visible on every page (FR-1) | ✅ Met | In the app shell |
| Theme applied to all surfaces (FR-2) | ✅ Met | Token-driven |
| Choice persists across reload (FR-3) | ✅ Met | Verified in tests |
| OS default when unset (FR-4) | ✅ Met | `resolveTheme('system', …)` |
| No flash before paint (FR-5) | ❌ Not met | Script in `<body>` — see Blocking |
| Keyboard/SR operable (FR-6) | ⚠️ Partial | See Suggestion → Task 2.1 |

## Round 2 Notes

### 2026-06-19 Re-review

- [x] `index.html` — **Fixed.** Script moved inline into `<head>` before the stylesheet; FR-5 regression test (Task 2.3) added and passing. No flash observed on a fresh profile.
- [x] `src/components/ThemeToggle.tsx` — **Fixed.** Now a `<button>` with `aria-pressed` and keyboard activation (Task 2.1).
- [x] `src/theme/storage.ts:14` — **Fixed.** Renamed to `value`.

**Status: Ready to merge** — 2026-06-19
