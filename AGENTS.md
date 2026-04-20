# AGENTS.md

Guidance for AI coding agents working in this repo. Human-facing docs live in `README.md`, `CONTRIBUTING.md`, and `skills/README.md`.

## What this repo is

Two things coexist here:

1. **Content** — curated prompt libraries (`prompts/`) and agent skills (`skills/`). These are the product.
2. **A Starlight docs site** that renders that content, deployed to GitHub Pages at `https://pokanop.github.io/ai/`.

The content is the source of truth. The site is generated from it.

## Use Bun, not npm/node/pnpm

Enforced by `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`. CI also uses Bun.

- `bun install` (not `npm install`) — `bun.lock` is the lockfile
- `bun run dev` / `bun run build` / `bun run sync` / `bun run preview`
- `bunx <pkg>` instead of `npx`

There is no `package-lock.json`, no `npm` scripts beyond what's in `package.json`.

## Build pipeline and generated paths (read this before editing)

`scripts/sync-docs.mjs` transforms source `.md` files into `.mdx` pages that Starlight then builds. `bun run dev` and `bun run build` both invoke it first.

**Do not edit these paths — they are wiped on every build:**

- `src/content/docs/` — generated MDX (gitignored)
- `public/assets/` — copied from `/assets/` (gitignored)
- `dist/` — Astro build output (gitignored)

**Source of truth for site content:**

| Site page | Source file |
|---|---|
| Homepage (`/ai/`) | `README.md` |
| Contributing | `CONTRIBUTING.md` |
| Platform Guide | `## Platform Guide` section of `prompts/images/README.md` |
| Image prompt style page | `prompts/images/styles/<slug>.md` |
| Skills index | `skills/README.md` |
| Individual skill page | `skills/<name>/SKILL.md` |

After changing any source `.md`, run `bun run sync` to regenerate, or just `bun run dev`.

## Adding a new image-prompt style (non-obvious)

A new `prompts/images/styles/<slug>.md` file alone is **not enough**. You must also:

1. Add `<slug>` to a category array in `IMAGE_CATEGORIES` in `scripts/sync-docs.mjs`. Files not listed there land in `uncategorized/` and aren't routed.
2. If creating a new category, add a matching sidebar entry in `astro.config.mjs` (look for `autogenerate: { directory: 'prompts/images/styles/<category>' }`).
3. Follow the existing `.md` structure — `parseImagePrompt` in `sync-docs.mjs` relies on specific markers: `# Title`, `**Best for:**`, a hero `![alt](path)`, a `> **Sample prompt...** ... ```text``` block, `## Prompt Variations` with `### Platform` subsections, `**Variation N — Name** _(Use Case)_` blocks, `## 🔄` for img2img, `## 💡 Tips`, and `**Pairs well with:**` for related styles. Breaking this structure silently drops content from the generated page.

## Internal links must use the `/ai/` base path

The site is served from `/ai` (see `astro.config.mjs` `base: '/ai'`). `sync-docs.mjs` rewrites many links automatically, but when authoring new content use absolute `/ai/...` paths for anything you want to land in the generated site (e.g. `/ai/prompts/images/styles/<cat>/<slug>/`, `/ai/skills/docs/<name>/`).

## Skills: spec compliance matters

Every skill in `skills/<name>/` must have a `SKILL.md` with YAML frontmatter where:

- `name` is lowercase `a-z0-9-`, 1–64 chars, no leading/trailing/consecutive hyphens
- `name` **exactly matches** the directory name (the sync script and the agentskills.io spec both depend on this)
- `description` is 1–1024 chars and includes trigger keywords (skills are discovered by keyword matching on description)

See `skills/README.md` for the catalog and the chained workflow (`create-a-prd → prd-to-tasks → tasks-to-code → release-checklist → plan-retrospective`).

## Quality gates

There are none configured. No `lint`, `test`, `typecheck`, or `format` scripts exist — don't fabricate them. The only meaningful verification commands are:

- `bun run build` — full sync + Astro build; fails on bad MDX, broken frontmatter, or missing content
- `python3 scripts/verify-placeholders.py` — flags image paths referenced in `.md` files that don't exist on disk
- `python3 scripts/resize-image.py -i <path>` — normalizes image heights (400px landscape / 500px portrait); requires Pillow

TypeScript is `astro/tsconfigs/strict` but there's no standalone typecheck script; errors surface only during `bun run build`.

## Deployment

`.github/workflows/deploy.yml` runs `bun run build` on push to `main` and publishes `dist/` to GitHub Pages. No preview deploys, no staging. Keep `main` shippable.

## Don't

- Don't commit `node_modules/`, `dist/`, `.astro/`, `src/content/docs/`, `public/assets/`, `bun.lock` — all gitignored intentionally (yes, `bun.lock` is currently gitignored in `.gitignore` even though it exists in the working tree).
- Don't edit generated `.mdx` under `src/content/docs/` — edit the source `.md` and re-run sync.
- Don't add a new prompts type (`videos`/`audio`/`text`) without also wiring it in `sync-docs.mjs` (currently placeholders) and `astro.config.mjs` sidebar.
