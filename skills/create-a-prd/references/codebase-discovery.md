# Codebase Discovery Guide

Before writing a PRD, understand the project's existing conventions. This checklist ensures the PRD aligns with how the project actually works.

## Minimum Viable Discovery

When time or context is limited, cover at least these three items:

1. **Package manager / build system** -- Detect the lockfile and use the correct commands everywhere
2. **Existing test and lint commands** -- These become mandatory quality gates
3. **Framework and language** -- Determines what conventions to recommend

If you can do nothing else, get these three right. The full checklist below provides deeper context.

## Discovery Checklist

### 1. Package Manager and Runtime

Detect which is in use (check only one should exist):

| File | Package Manager / Build System |
|------|-------------------------------|
| `bun.lockb` or `bun.lock` | Bun |
| `yarn.lock` | Yarn |
| `pnpm-lock.yaml` | pnpm |
| `package-lock.json` | npm |
| `deno.lock` | Deno |
| `Cargo.lock` | Cargo (Rust) |
| `go.sum` | Go modules |
| `Pipfile.lock` | Python (pipenv) |
| `poetry.lock` | Python (Poetry) |
| `uv.lock` | Python (uv) |
| `requirements.txt` | Python (pip) |
| `Gemfile.lock` | Ruby (Bundler) |
| `build.gradle` / `build.gradle.kts` | Java/Kotlin (Gradle) |
| `pom.xml` | Java (Maven) |
| `Package.swift` | Swift (SPM) |
| `pubspec.lock` | Dart/Flutter (pub) |
| `mix.lock` | Elixir (Mix) |
| `composer.lock` | PHP (Composer) |

All PRD commands must use the detected package manager. Never mix managers.

### 2. Existing Scripts and Commands

**JavaScript/TypeScript** -- Check `package.json` scripts for:

- `build` - Build command and output
- `dev` - Development server
- `test` - Test runner and framework
- `lint` - Linter configuration
- `format` - Formatter configuration
- `check` or `typecheck` - Type checking
- `start` - Production start

**Python** -- Check `Makefile`, `pyproject.toml [tool.scripts]`, `tox.ini`, or `noxfile.py` for:

- Test commands (`pytest`, `unittest`)
- Linting (`ruff`, `flake8`, `pylint`)
- Formatting (`black`, `ruff format`)
- Type checking (`mypy`, `pyright`)

**Rust** -- Check `Cargo.toml` and `Makefile` for:

- `cargo build`, `cargo test`, `cargo clippy`, `cargo fmt`

**Go** -- Check `Makefile` or scripts for:

- `go build`, `go test`, `go vet`, `golangci-lint`

**Quality gates are additive.** Every script discovered above becomes a required quality gate. Do not pick a subset -- if the project has `build`, `test`, `lint`, `format`, and `check` commands, all five must pass. List each one explicitly in the PRD's quality gates section with its exact command. For example:

```
QG-1: bun run check      # Type checking
QG-2: bun run format      # Formatting verification
QG-3: bun run lint        # Linting
QG-4: bun run test        # Test suite
QG-5: bun run build       # Build succeeds
```

If the project uses a different package manager or build system, adjust accordingly (e.g., `cargo test`, `cargo clippy`, `cargo fmt --check`, `go test ./...`, `go vet ./...`, `pytest`, `ruff check`, `mypy .`).

### 3. Framework and Architecture

Identify the primary framework:

- **JavaScript/TypeScript**: Check `package.json` dependencies for Next.js, React, Vue, Svelte, Express, Fastify, Hono, etc. Check for `next.config.*`, `vite.config.*`, `nuxt.config.*`, etc.
- **Python**: Check for Django (`manage.py`), Flask/FastAPI (`app.py`), or framework imports
- **Rust**: Check `Cargo.toml` dependencies for Actix, Axum, Rocket, etc.
- **Go**: Check `go.mod` for Gin, Echo, Fiber, Chi, or standard library `net/http`
- Note the routing pattern (file-based, code-based)
- Identify server-side vs client-side rendering approach

### 4. Project Structure Conventions

Observe and document:

- Source directory layout (`src/`, `app/`, `lib/`, `packages/`, `cmd/`, `internal/`)
- Naming conventions (kebab-case, camelCase, PascalCase, snake_case for files and directories)
- Import patterns (path aliases, barrel exports, absolute vs relative)
- Component organization pattern
- Monorepo detection: Check for `turbo.json`, `nx.json`, `lerna.json`, workspace config in `package.json`, or multiple `go.mod` files. Note workspace boundaries and shared package patterns.

### 5. Database and Data Layer

Check for:

- ORM/query builder (`prisma/`, `drizzle/`, `sqlalchemy`, `diesel`, `gorm`, schema files)
- Database type (PostgreSQL, MySQL, SQLite, MongoDB, Redis)
- Migration patterns and tools
- Data validation libraries (Zod, Joi, Yup, Pydantic, serde)

### 6. Testing Infrastructure

Identify:

- Test framework (Jest, Vitest, Playwright, Cypress, pytest, Go testing, Rust `#[test]`, RSpec)
- Test file location conventions (`__tests__/`, `*.test.*`, `*.spec.*`, `tests/`, `_test.go`)
- Test utilities and fixtures patterns
- Coverage requirements if configured
- E2E test infrastructure

### 7. CI/CD and Quality Gates

Check `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `Makefile`, or similar for:

- Which checks run on PRs
- Required status checks
- Deployment pipeline stages
- Environment configurations

### 8. Style and Linting

Check for:

- ESLint / Biome / oxlint / ruff / clippy configuration and rules
- Prettier / dprint / Biome / black / rustfmt formatting rules
- TypeScript strictness level / mypy strictness / Rust edition
- Custom lint rules or plugins

### 9. Security Posture

Check for:

- Authentication patterns (JWT, session, OAuth providers, middleware)
- Secrets management (`.env` patterns, vault integration, environment variable conventions)
- Dependency audit tools (`npm audit`, `pip-audit`, `cargo audit`, Dependabot/Renovate config)
- Input validation and sanitization patterns
- CORS configuration
- CSP headers or security middleware

## How to Use Discovery Results

Reference findings directly in the PRD:

- **Tech Stack Alignment**: "Use [detected framework] with [detected package manager]"
- **Testing Strategy**: "Run existing `[test command]` suite; add tests following `[detected pattern]`"
- **Quality Gates**: "All existing CI checks must pass: `[list detected commands]`"
- **File Organization**: "Follow existing convention: `[detected pattern]`"
- **New Dependencies**: Justify against what already exists -- prefer extending current tools

If the project has no existing code (greenfield), note this and recommend conventions based on the chosen stack rather than discovered ones.
