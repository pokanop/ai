# Release Checklist Schema

Full structure for the release checklist document produced by the `release-checklist` skill.

---

## Checklist Format

Present the release checklist as a series of checkboxes grouped by stage. The document can be kept in `plans/<name>/release-checklist.md` for tracking, or presented inline and used ephemerally.

---

## Stage 1: Pre-Release Gates

These must all pass before deployment proceeds. Any failure here is a hard block.

```markdown
## Stage 1: Pre-Release Gates

### Task Completion
- [ ] All P0 tasks are `[x]` complete (none in `[ ]`, `[~]`, or `[!]` state)
- [ ] All `[-]` skipped tasks are intentionally deferred (confirmed with plan owner)
- [ ] No tasks are `[~]` in progress

### Quality Gates
- [ ] `<package-manager> run typecheck` passes
- [ ] `<package-manager> run lint` passes
- [ ] `<package-manager> run test` passes (NN tests, NN% passing)
- [ ] `<package-manager> run build` passes (build output: <path>)

### PRD Success Criteria
- [ ] [Success criterion 1 from PRD] — verified by: <how>
- [ ] [Success criterion 2 from PRD] — verified by: <how>
```

Fill in the actual quality gate commands for the project. List every command — do not omit any.

---

## Stage 2: Deployment Prerequisites

Environment-specific setup that must be in place before deploying.

```markdown
## Stage 2: Deployment Prerequisites

### Environment Variables
- [ ] All required environment variables are set in the deployment environment
  - List each new variable introduced by this release: `VAR_NAME` — <what it does>

### Database Migrations
- [ ] All pending migrations have been applied to the staging/production database
  - List each migration file: `YYYY-MM-DD_<name>.sql`

### Feature Flags
- [ ] Feature flags required for this release are enabled in the target environment
  - List each flag: `<flag_name>` — <what it controls>

### External Services
- [ ] All third-party service credentials are configured and tested
- [ ] Any new external service dependencies have been provisioned
```

Omit sections that don't apply to this release (e.g., no migrations → skip that section).

---

## Stage 3: Deployment Steps

The ordered steps to execute the deployment. Be explicit — avoid "deploy the app" as a single step.

```markdown
## Stage 3: Deployment Steps

- [ ] 1. Create a deployment tag: `git tag v<version> && git push --tags`
- [ ] 2. Run database migrations: `<migration command>`
- [ ] 3. Deploy application: `<deploy command or CI link>`
- [ ] 4. Confirm deployment is live: `<health check URL or command>`
- [ ] 5. Invalidate any CDN caches if applicable
```

---

## Stage 4: Smoke Tests

The minimal set of user flows to verify in production immediately after deployment. Focus on P0 user stories from the PRD and existing critical paths.

```markdown
## Stage 4: Smoke Tests

### New Features (from this release)
- [ ] [User can do X] — Steps: <brief steps> — Expected: <what to see>
- [ ] [User can do Y] — Steps: <brief steps> — Expected: <what to see>

### Existing Critical Paths (regression check)
- [ ] [Core flow 1] — Steps: <brief steps> — Expected: <what to see>
- [ ] [Core flow 2] — Steps: <brief steps> — Expected: <what to see>
```

Limit smoke tests to 5-10 flows. These should be runnable in under 15 minutes. For comprehensive regression testing, use the automated test suite.

---

## Stage 5: Rollback Plan

What to do if the release causes a production incident. This section must be filled in before deploying — not after.

```markdown
## Stage 5: Rollback Plan

**Decision criteria**: Roll back if:
- [ ] Error rate exceeds <threshold> within 30 minutes of deployment
- [ ] A P0 smoke test fails and cannot be fixed within <time limit>
- [ ] [Specific critical feature] is non-functional

**Rollback steps**:
1. Revert to previous deployment: `<revert command or previous image tag>`
2. Roll back database migrations (if any): `<down migration command>`
3. Notify stakeholders: <notification channel/process>

**Time to rollback**: Estimated < NN minutes
```

If the release cannot be rolled back (e.g., data migrations that cannot be reversed), document this explicitly and list what can be done instead (feature flag disable, hotfix process).

---

## Stage 6: Post-Release Verification

What to check in the first 30 minutes after a successful deployment.

```markdown
## Stage 6: Post-Release Verification

- [ ] Error rate is at baseline (check: <error tracking tool>)
- [ ] Response times are at baseline (check: <monitoring tool>)
- [ ] No unusual spikes in logs (check: <log aggregator>)
- [ ] Key business metrics are nominal (check: <analytics tool>)
- [ ] Notify stakeholders that the release is live: <channel>
```

---

## Checklist Header

Every release checklist should start with:

```markdown
# Release Checklist: <Plan Name> v<version>

**Date**: YYYY-MM-DD
**Plan**: plans/<name>/prd.md
**Go / No-Go**: [PENDING / GO / NO-GO]
**Deployed by**: [name or agent]
**Blocking items**: [none / list]
```

Update the Go/No-Go field after Stage 1 is complete. Only mark GO if all Stage 1 gates are checked.
