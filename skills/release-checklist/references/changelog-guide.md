# Changelog Guide

How to write a `CHANGELOG.md` entry that is useful to the people who will read it.

---

## Audience

A changelog is written for **product users and stakeholders**, not for developers reading the code. The reader wants to know:

1. What can I now do that I couldn't before?
2. What changed that might affect how I use the product?
3. What was fixed that was annoying me?

Write every entry with this reader in mind.

---

## Entry Format

Each release gets one entry at the top of `CHANGELOG.md` (or appended if the file doesn't exist):

```markdown
## [<version>] — YYYY-MM-DD

### Added
- [User-facing description of new capability]
- [Another new capability]

### Changed
- [Description of changed behavior — what it was before, what it is now]

### Fixed
- [Description of fixed issue — what was broken, what the user can now do]

### Deprecated (optional)
- [Feature that will be removed in a future release — what to use instead]

### Removed (optional)
- [Feature that was removed — migration path if applicable]
```

Use only the sections that apply. Do not include empty sections.

---

## Writing Good Entries

### ✅ Good: User-facing language, behavioral description

```markdown
### Added
- You can now reset your password from the login screen without contacting support
- Connected data sources now show a status indicator (connected, syncing, error)

### Fixed
- Fixed an issue where the dashboard would briefly show a blank screen on first load
- Fixed a freeze when uploading files larger than 10MB
```

### ❌ Bad: Technical jargon, implementation details

```markdown
### Added
- Implemented JWT token refresh endpoint with Redis session storage
- Added Zod validation schema for user registration payload

### Fixed
- Fixed null dereference in `getUserSession()` when Redis key expires
- Fixed CORS preflight rejection on POST /api/upload for large payloads
```

---

## Deriving Entries from the Plan

Pull changelog content from three sources in the plan:

### 1. PRD User Stories → "Added" section

Each completed user story (`US-N`) that is user-visible becomes an "Added" or "Changed" entry. Translate from requirement language to user language:

| PRD User Story | Changelog Entry |
|---------------|-----------------|
| "As a user, I can reset my password via email" | "You can now reset your password from the login screen" |
| "As an admin, I can see all users and their last login time" | "Admins can now view all users and their last login dates in the admin panel" |

### 2. Bug fixes → "Fixed" section

If this release includes bug fixes (from `debug-and-fix` sessions), translate each fix to user language:

| Bug (technical) | Changelog Entry |
|----------------|-----------------|
| Null dereference when session token expires | "Fixed an issue where you were unexpectedly logged out mid-session" |
| Race condition in file upload progress tracker | "Fixed an issue where the upload progress bar would get stuck at 99%" |

### 3. PRD Non-Goals and Deferrals → What NOT to include

Requirements that were skipped, deferred, or not part of this release should not appear in the changelog. Do not hint at unshipped features.

---

## Versioning

Choose a version number for the release entry. If the project uses semantic versioning:

| Change type | Version bump |
|------------|-------------|
| New user-facing features | Minor: `1.2.0 → 1.3.0` |
| Bug fixes only, no new features | Patch: `1.2.0 → 1.2.1` |
| Breaking changes or major new capabilities | Major: `1.2.0 → 2.0.0` |

If the project does not use semantic versioning (e.g., date-based or build-number-based), use the project's existing scheme.

---

## CHANGELOG.md Structure

If `CHANGELOG.md` does not exist, create it with this header:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

(Future entries go here)

---

## [1.0.0] — YYYY-MM-DD

### Added
- Initial release
```

New entries are always prepended at the top, below the `[Unreleased]` section (if present). Oldest entries appear at the bottom.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Technical jargon in user-facing entries | Rewrite using product/feature names, not code names |
| Empty sections (### Fixed with nothing under it) | Remove the section entirely |
| Vague entries ("Various bug fixes and improvements") | List specific fixes — users want to know what was fixed |
| Changelog not updated at release time | The changelog entry is produced as part of the release checklist, not after |
| One entry per commit | Group logically related changes into one meaningful entry |
