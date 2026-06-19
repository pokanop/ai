# Findings Format

How to classify security findings, write them up, and (optionally) emit them as a PRD. Consistent severity is what makes a security review a prioritized work list rather than a wall of "consider hardening this."

---

## Severity — exploitability × impact

Security findings use the single shared [severity scale](../../_shared/references/conventions.md#severity-and-priority) — `🔴 Critical` / `🟡 Major` / `⚪ Minor`, mapping to `[P0]` / `[P1]` / `[P2]`. There is no separate security scale; this section is only the calibration for *what counts as* Critical/Major/Minor when the finding is a security gap.

Calibrate on two axes:

- **Exploitability** — how reachable is it? Unauthenticated and remote → high. Requires a logged-in user, a specific role, or a precondition → medium. Theoretical / not reachable from any entry point → not a finding.
- **Impact** — what does success get the attacker? Account/data/payment compromise or code execution → high. Limited disclosure or integrity loss → medium. Defense-in-depth only → low.

| | Impact: High | Impact: Medium | Impact: Low |
|---|---|---|---|
| **Exploitability: High** | 🔴 Critical | 🟡 Major | ⚪ Minor |
| **Exploitability: Medium** | 🟡 Major | 🟡 Major | ⚪ Minor |
| **Exploitability: Low / theoretical** | ⚪ Minor | ⚪ Minor | ⚪ Minor |

### 🔴 Critical — reachable, high impact. Fix before release.
- Unauthenticated access to user data, or one user reaching another's data (broken object-level authz / IDOR).
- Injection (SQL/NoSQL/command/SSRF) reachable from an entry point.
- Authentication bypass, account takeover, or a privilege-escalation path.
- A secret committed to the repo or shipped in a client bundle/binary.
- Remote code execution or an exploitable deserialization sink.

**Ask:** "Could someone reach this from outside and take data, money, or control?" If yes → Critical.

### 🟡 Major — a real weakness, gated by a precondition or limited in blast radius. Fix this cycle.
- Missing rate limiting on auth / password reset (brute force is possible but not instant).
- No consistent authorization layer (works today, but new routes will forget it).
- Sensitive data or tokens written to logs.
- A known-vulnerable dependency on the attack surface with no immediate exploit path.
- No security-event logging — an incident could not be detected or reconstructed.
- Account enumeration via differing responses/timing.

### ⚪ Minor — hardening and defense-in-depth. Fix when adjacent work happens.
- Missing security headers (CSP, HSTS) where the concrete risk is low.
- Verbose error messages that leak stack traces but no secrets.
- A missing dependency-audit process (no current known CVE).
- Overly long session lifetimes within reasonable bounds.

> **The security baseline holds even when applied consistently.** Unlike a style audit, "every endpoint is inconsistent the same way" is not a defense. A systemic missing authz layer is *more* severe for being everywhere, not excused by it — the same way `ui-design-audit` treats accessibility against WCAG rather than the project's habits.

---

## Writing a finding

Each finding records the **asset and boundary** it threatens (from the Phase-0 inventory), the **path that reaches it**, the severity, and a **concrete remediation**. Always lead with the systemic version when the issue repeats.

```
🔴 Critical — Broken object-level authorization on GET /api/orders/:id

Asset / boundary:  Customer order data / authenticated user ↔ another tenant.
Weakness:          The handler loads the order by :id but never checks it
                   belongs to the calling user, so any logged-in user can read
                   any order by incrementing the id.
Reachability:      Authenticated, remote — confirmed by tracing the handler;
                   no ownership check between auth middleware and the DB read.
Remediation:       Scope the query to the caller (WHERE user_id = :me) or add
                   an ownership assertion in the shared authorization layer so
                   every :id route inherits it.
```

**Redact.** Describe the *shape* of the problem. Never paste a discovered secret, token, session, or working exploit string into a finding, comment, log, or commit. For a leaked secret, say "an API key for `<service>` is present in `<file>`" and recommend rotation — do not reproduce the key.

**Group systemic issues.** If 14 endpoints share one missing authz pattern, that is **one** finding with the instances listed — not 14 findings — exactly as `ui-design-audit` groups a repeated component misuse:

```
🟡 Major — No object-level authorization layer (14 endpoints)

Authorization is checked per-handler and inconsistently; these 14 resource
endpoints check authentication but not ownership. The fix is one shared layer,
not 14 edits.

Instances:
- src/api/orders.ts:42  GET /orders/:id
- src/api/invoices.ts:31 GET /invoices/:id
... (12 more)
```

---

## Report structure

Lead with the summary, then the grouped findings:

1. **Posture summary** — scope reviewed, the asset/boundary map, and counts by severity (`3 🔴 / 7 🟡 / 4 ⚪`).
2. **Top findings** — the 3–5 Critical/Major items to fix first.
3. **Findings by dimension** — grouped by the six dimensions, severity-ordered within each.
4. **Out of scope / Future Opportunities** — hardening beyond the threat that motivated the review (no gold-plating in findings).

---

## Optional: PRD-compatible output

When the user wants remediation tracked, write the report as `plans/security-review-<date>/prd.md` in PRD format so it feeds **prd-to-tasks** — the same handoff `ui-design-audit` uses. Use the create-a-prd PRD schema (linked from the skill's References) and adapt it:

- **Executive Summary** — overall posture and headline findings.
- **Goals / Non-Goals** — close the scoped gaps; list dimensions/areas explicitly not reviewed.
- **Findings as Functional Requirements** — each finding becomes an `FR-N`: *"The [component] at [location] shall [control] so that [actor] cannot [action] on [asset]."* Map severity to priority with the canonical [severity↔priority mapping](../../_shared/references/conventions.md#severity-and-priority): `🔴 Critical → [P0]`, `🟡 Major → [P1]`, `⚪ Minor → [P2]`.
- **Non-Functional Requirements** — cross-cutting standards as `NFR-N` (e.g. "all transport over TLS", "secrets only via the secrets manager", "auth endpoints rate-limited").
- **Testing Strategy** — how each fix is verified (an authz test proving cross-tenant reads fail, a passing dependency audit in CI, a rate-limit test).

Severity assignment uses the table above; the dimensions being scored come from [threat-model-checklist.md](threat-model-checklist.md).
