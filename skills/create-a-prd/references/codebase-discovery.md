# Codebase Discovery Guide

Before writing a PRD, understand the project's existing conventions. This checklist ensures the PRD aligns with how the project actually works.

## Discovery Checklist

### 1. Package Manager and Runtime

Detect which is in use (check only one should exist):

| File | Package Manager |
|------|----------------|
| `bun.lockb` or `bun.lock` | Bun |
| `yarn.lock` | Yarn |
| `pnpm-lock.yaml` | pnpm |
| `package-lock.json` | npm |
| `deno.lock` | Deno |
| `Cargo.lock` | Cargo (Rust) |
| `go.sum` | Go modules |
| `Pipfile.lock` / `poetry.lock` / `uv.lock` | Python (pipenv/poetry/uv) |

All PRD commands must use the detected package manager. Never mix managers.

### 2. Existing Scripts and Commands

Check `package.json` scripts (or equivalent) for:

- `build` - Build command and output
- `dev` - Development server
- `test` - Test runner and framework
- `lint` - Linter configuration
- `format` - Formatter configuration
- `check` or `typecheck` - Type checking
- `start` - Production start

If these exist, the PRD's testing strategy must include running all of them as quality gates.

### 3. Framework and Architecture

Identify the primary framework:

- Check `package.json` dependencies for Next.js, React, Vue, Svelte, Express, Fastify, etc.
- Check for `next.config.*`, `vite.config.*`, `nuxt.config.*`, etc.
- Note the routing pattern (file-based, code-based)
- Identify server-side vs client-side rendering approach

### 4. Project Structure Conventions

Observe and document:

- Source directory layout (`src/`, `app/`, `lib/`, `packages/`)
- Naming conventions (kebab-case, camelCase, PascalCase for files and directories)
- Import patterns (path aliases, barrel exports)
- Component organization pattern
- Monorepo structure if applicable (workspaces, turbo.json)

### 5. Database and Data Layer

Check for:

- ORM/query builder (`prisma/`, `drizzle/`, schema files)
- Database type (PostgreSQL, MySQL, SQLite, MongoDB)
- Migration patterns and tools
- Data validation libraries (Zod, Joi, Yup)

### 6. Testing Infrastructure

Identify:

- Test framework (Jest, Vitest, Playwright, Cypress, pytest, Go testing)
- Test file location conventions (`__tests__/`, `*.test.*`, `*.spec.*`)
- Test utilities and fixtures patterns
- Coverage requirements if configured
- E2E test infrastructure

### 7. CI/CD and Quality Gates

Check `.github/workflows/`, `Makefile`, or similar for:

- Which checks run on PRs
- Required status checks
- Deployment pipeline stages
- Environment configurations

### 8. Style and Linting

Check for:

- ESLint / Biome / oxlint configuration and rules
- Prettier / dprint / Biome formatting rules
- TypeScript strictness level
- Custom lint rules or plugins

## How to Use Discovery Results

Reference findings directly in the PRD:

- **Tech Stack Alignment**: "Use [detected framework] with [detected package manager]"
- **Testing Strategy**: "Run existing `[test command]` suite; add tests following `[detected pattern]`"
- **Quality Gates**: "All existing CI checks must pass: `[list detected commands]`"
- **File Organization**: "Follow existing convention: `[detected pattern]`"
- **New Dependencies**: Justify against what already exists -- prefer extending current tools

If the project has no existing code (greenfield), note this and recommend conventions based on the chosen stack rather than discovered ones.
