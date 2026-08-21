<!-- PRD: prd.md -->
<!-- Generated: 2026-07-21 -->
<!-- Last Updated: 2026-07-24 -->

# Tasks: Security Review Remediation — Ledgerline API

> Remediation task list for the Ledgerline security review, derived from
> [prd.md](prd.md) — an audit PRD enters the pipeline at design-to-tasks with no
> design step, so tasks trace straight to the findings. Produced by
> [design-to-tasks](../../skills/design-to-tasks/SKILL.md); statuses updated by
> [tasks-to-code](../../skills/tasks-to-code/SKILL.md). Status markers follow the
> [shared conventions](../../skills/_shared/references/conventions.md#task-status-markers).

## 1. Overview

### Project Summary

A security review found broken object-level authorization across three
endpoints, a committed SendGrid key, and missing rate limiting, log redaction,
and security-event logging. The work decomposes by severity: Phase 1 closes the
two Critical findings structurally (a shared authorization layer, a
rotate-then-remove secret fix); Phase 2 lands the Major and Minor hardening.

### Scope Reference

- PRD: [prd.md](prd.md) (findings PRD; no design.md — audit PRDs skip `prd-to-design`)
- Phases decomposed: Phase 1 (Critical), Phase 2 (Major & hardening)
- Open question affecting tasks: PRD Q1 (security-log retention) — does not block; Task 2.3 uses the proposed default.

### Task Statistics

| Metric | Count |
|--------|-------|
| Total Tasks | 9 |
| Completed | 4 |
| In Progress | 1 |
| Blocked | 0 |
| Not Started | 4 |

## Phase 1: Critical — release blockers (3/3 tasks complete)

> The shared authorization layer, route migration, and the secret rotation.
> **Goal**: no cross-tenant access, no secret in the tree — FR-1, FR-2, NFR-1.

### Backend / Authorization

- [x] **Add the shared ownership-authorization middleware** `[P0]` `[M]`
  - **Depends on**: None
  - **Requirements**: FR-1, NFR-1
  - **Acceptance Criteria**:
    - [x] `requireOwnership(resource)` middleware resolves the record's tenant and compares it to the caller's; mismatch returns 404
    - [x] Admin role bypass is explicit and tested
    - [x] Middleware lives in `src/middleware/` following the existing conventions
  - **Notes**: Completed 2026-07-22. 404 (not 403) on mismatch so ids are not confirmable — see decisions.md.

- [x] **Migrate the invoice and customer routes onto the shared layer** `[P0]` `[M]`
  - **Depends on**: Task 1.1
  - **Requirements**: FR-1
  - **Acceptance Criteria**:
    - [x] `GET/PUT /api/invoices/:id` and `GET /api/customers/:id` all pass through `requireOwnership`
    - [x] Integration tests: cross-tenant requests to each endpoint return 404; same-tenant requests succeed
  - **Notes**: Completed 2026-07-22. No per-handler checks added — the layer is the fix.

### Secrets

- [x] **Rotate the SendGrid key and load it from the environment** `[P0]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-2
  - **Acceptance Criteria**:
    - [x] New key issued at SendGrid; old key verified revoked **before** the removal commit lands
    - [x] `config/default.ts` reads `SENDGRID_API_KEY` from the environment; no secret value anywhere in the tree
  - **Notes**: Completed 2026-07-23. Rotation ordered before removal because git history preserves the old value — see decisions.md.

## Phase 2: Major & hardening (1/6 tasks complete)

> Rate limiting, log redaction, security-event logging, headers, and the CI audit.
> **Goal**: brute force blocked, logs clean and useful — FR-3–FR-6, NFR-2.

### Backend / Middleware

- [x] **Rate-limit the login and password-reset endpoints** `[P1]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-3
  - **Acceptance Criteria**:
    - [x] `express-rate-limit` on `POST /auth/login` and `POST /auth/password-reset`, keyed on IP + account identifier
    - [x] Integration test: the 6th attempt within the window returns 429
  - **Notes**: Completed 2026-07-24. Keyed on IP + account so shared NATs are not locked out (PRD risk table).

- [~] **Redact tokens from the request logger** `[P1]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-4
  - **Acceptance Criteria**:
    - [ ] `Authorization` headers and `token`/`password` body fields replaced with `[REDACTED]` at every log level
    - [ ] Unit test: a logged request carrying a bearer token produces no token substring in output

- [ ] **Add structured security-event logging** `[P1]` `[M]`
  - **Depends on**: Task 1.1
  - **Requirements**: FR-5
  - **Acceptance Criteria**:
    - [ ] Auth failures and authz denials (from the Task 1.1 layer) each emit one structured event: actor, route, outcome — never the credential
    - [ ] Integration test: a failed login and a cross-tenant denial each produce exactly one event

- [ ] **Add baseline security headers** `[P2]` `[S]`
  - **Depends on**: None
  - **Requirements**: FR-6
  - **Acceptance Criteria**:
    - [ ] `helmet` applied app-wide with CSP, HSTS, and `X-Content-Type-Options` enabled
    - [ ] Existing docs pages still render (CSP not over-tightened)

### CI / Testing

- [ ] **Run the dependency audit in CI** `[P1]` `[S]`
  - **Depends on**: None
  - **Requirements**: NFR-2
  - **Acceptance Criteria**:
    - [ ] CI runs `bun audit` and fails on known-critical CVEs
    - [ ] Current dependency set passes

- [ ] **Phase 2 verification: regression test and quality gates** `[P0]` `[M]`
  - **Depends on**: Task 2.1, Task 2.2, Task 2.3, Task 2.4, Task 2.5
  - **Requirements**: PRD Section 6 (Testing Strategy), QG-1, QG-2, QG-3, QG-4
  - **Acceptance Criteria**:
    - [ ] Route-registration regression test: every `/api/*` resource route passes through the shared authorization layer
    - [ ] `bun run lint` passes
    - [ ] `bun run test` passes
    - [ ] `bun run build` passes
    - [ ] Code review completed; no unresolved 🔴 Blocking findings
  - **Notes**: The NFR-1 regression test lives here so new routes cannot silently skip the layer.

## Dependency Graph

```
Task 1.1 (authz layer) ── Task 1.2 (route migration)
                      └── Task 2.3 (security events)
Task 1.3 (secret rotation)
Task 2.1 (rate limit) ┐
Task 2.2 (log redaction) ┼── Task 2.6 (phase-2 verify)
Task 2.4 (headers)    ┤
Task 2.5 (CI audit)   ┘
```

## Requirements Coverage

| Requirement | Task(s) | Status |
|------------|---------|--------|
| FR-1: Ownership-scoped object access | 1.1, 1.2 | ✅ Covered |
| FR-2: Secret rotated + externalized | 1.3 | ✅ Covered |
| FR-3: Auth rate limiting | 2.1 | ✅ Covered |
| FR-4: Token redaction in logs | 2.2 | ✅ Covered |
| FR-5: Security-event logging | 2.3 | ✅ Covered |
| FR-6: Security headers | 2.4 | ✅ Covered |
| NFR-1: One shared authz layer | 1.1, 2.6 | ✅ Covered |
| NFR-2: Dependency audit in CI | 2.5 | ✅ Covered |
| QG-1…QG-4: gates | 2.6 | ✅ Covered |

## Future Considerations

- **Security-log retention** (PRD Q1): Task 2.3 ships with the 90-day default; revisit the storage target if compliance requires more.
- **WAF / bot protection** and **mTLS between services**: out of scope per the PRD — revisit when the threat model changes.
