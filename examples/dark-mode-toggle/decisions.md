# Decision Log: Dark Mode Toggle

> Decisions recorded during implementation of [tasks.md](tasks.md). Produced by
> [tasks-to-code](../../skills/tasks-to-code/SKILL.md). Each entry references the
> task that generated it.

---

## 2026-06-17 — Task 1.2: Add the `theme-storage` module

### Decision: Treat unavailable `localStorage` as "system", silently

**Context**: NFR-3 requires the app to keep working when `localStorage` throws (private mode, disabled storage). The read path needs a defined value.

**Decision Made**: `getPreference()` returns `'system'` and `setPreference()` is a no-op when access throws; both wrap the call in `try/catch`. No error is surfaced to the user.

**Rationale**: `'system'` is the same default a first-time visitor gets, so a storage failure degrades to the documented default behavior instead of a broken UI. Satisfies NFR-3 without new dependencies.

**Alternatives Considered**:
- Surface a toast on failure: rejected — storage availability is not actionable by the user and adds noise.
- In-memory shim: rejected — adds state with no persistence benefit.

**Assumptions**: A user with blocked storage accepts that the theme resets to the OS default each session. Consistent with the PRD non-goal of cross-device sync.

**Impact on Future Tasks**: Task 1.4 (provider) must treat `getPreference()` as always-defined and never assume a write succeeded.

---

## 2026-06-18 — Task 1.5: Add the inline pre-paint script

### Decision: Place the theme script inline in `<head>`, before the stylesheet

**Context**: The first implementation put the script in `<body>`, after the stylesheet load. The page painted light, then snapped to dark — the exact flash FR-5 forbids. The [code review](review.md) flagged it as Blocking.

**Decision Made**: Moved the script to an inline `<script>` in `<head>`, ahead of the stylesheet `<link>`, so `data-theme` is set before the browser computes styles. Added Task 2.3 (regression test) to lock this in.

**Rationale**: Only a render-blocking, pre-stylesheet script can set the attribute before first paint. Keeping it inline avoids a network round-trip (NFR-1). This is the mechanism ADR-0001 committed to; the first cut simply mis-placed it.

**Alternatives Considered**:
- External `theme.js` in `<head>`: rejected — an extra blocking request before paint, against NFR-1.
- Apply the theme in React on mount: rejected — runs after first paint, so the flash remains.

**Impact on Future Tasks**: Task 2.3 asserts the attribute is present before mount and fails if the script is moved or dropped.

---

## 2026-06-19 — Task 2.2: Dark-palette contrast audit

### Decision: Darken two muted-text tokens to reach WCAG AA

**Context**: The audit measured `--color-text-muted` and `--color-text-subtle` on the dark surface at 3.9:1 and 4.1:1 — below the 4.5:1 AA threshold for normal text (NFR-2).

**Decision Made**: Adjusted both dark-theme token values upward in luminance until each pair measured ≥ 4.6:1; light-theme values were already compliant and were left untouched.

**Rationale**: Token-level fixes keep every consuming component compliant at once, without touching component code.

**Alternatives Considered**: Per-component overrides: rejected — would scatter contrast logic and risk missing a surface.

**Impact on Future Tasks**: None. Any new dark surface should re-use the audited tokens rather than introduce new colors.

---

## Future Opportunities

- **[Noticed during Task 1.3]**: `resolveTheme()` and the token palette could be extracted into a shared package if other Notes surfaces (a future marketing site) need the same theming. Deferred — only one app needs it today.
- **[Noticed during Task 2.1]**: a smooth color transition on theme switch would feel polished, but must respect `prefers-reduced-motion`. Deferred to the backlog rather than gold-plating this scope.
- **[Noticed during Task 1.5]**: PRD Q1's explicit "System" toggle state is a small UI addition on top of the existing `system` storage value, if users ask for it.
