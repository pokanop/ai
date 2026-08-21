# Summary

<!-- What changed and why. Link the issue if one exists. -->

## Checklist

- [ ] `bun run validate` passes (skill frontmatter + catalog drift)
- [ ] `bun run sync` regenerated cleanly (no stale `skills/index.json`)
- [ ] `bun run build` passes (sync + Astro build)
- [ ] Internal links use the `/ai/` base path (the site is served from `/ai`)
- [ ] No generated paths committed (`src/content/docs/`, `public/assets/`, `dist/`, `bun.lock`)
- [ ] New image-prompt styles are wired into `IMAGE_CATEGORIES` in `scripts/sync-docs.mjs` (and `astro.config.mjs` for a new category)
- [ ] Referenced images exist on disk (`python3 scripts/verify-placeholders.py`)
