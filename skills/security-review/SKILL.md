---
name: security-review
description: Perform a lightweight threat-model security review of an application and produce a prioritized, severity-tiered findings report. Use when the user asks to "do a security review", "threat model this", "run a security audit", "check for vulnerabilities", "review the auth flow", or "is this safe to launch", or wants a dedicated security pass on a service that handles authentication, payments, or sensitive data. Inventories assets and trust boundaries, then sweeps an OWASP-style checklist (authorization, input validation, secrets and transport, dependency CVEs, security-event logging, rate limiting). Complements code-review's per-change security check with a standalone whole-system pass, and can emit a PRD-compatible report that feeds create-a-prd and prd-to-tasks.
license: MIT
metadata:
  author: pokanop
  version: "1.0"
---

# Security Review

## Purpose

`code-review` checks the security of a *single change* as one dimension among seven. That catches the bug in the diff in front of you — but it never steps back to ask what the whole system is protecting, who the attacker is, or where the trust boundaries are. For a client app with authentication, payments, or sensitive user data, that gap matters.

This skill performs a **lightweight threat model**: it inventories what is worth protecting and where the boundaries are, then sweeps an OWASP-style checklist across the system's security posture — not line by line, but layer by layer. The output is a prioritized, severity-tiered findings report. Because it can be written in PRD format, the findings feed directly into **create-a-prd** and **prd-to-tasks** for remediation, the same way **ui-design-audit** does for design debt.

It is deliberately *lightweight*: an asset/boundary inventory and a structured checklist, not a formal STRIDE/DREAD exercise or a penetration test. It surfaces the security work that should become tasks — it does not exploit anything.

## When to use this vs. `code-review`

These two skills overlap on purpose and must not duplicate each other. The split:

| | `code-review` (§3 Security) | `security-review` (this skill) |
|---|---|---|
| **Unit of work** | One diff / PR / changed file set | The whole application or a subsystem |
| **Question** | "Is *this change* secure?" | "Is the *system's* security posture sound?" |
| **Trigger** | Every PR | Before launch; after auth/payments work; periodically; on request |
| **Finds** | An unvalidated input *in this diff* | The absence of a *consistent* validation layer; a missing threat-model boundary |
| **Output** | Inline review feedback / `review.md` | A standalone findings report, optionally a PRD |

When a finding is genuinely line-level and tied to a specific change, it belongs to code-review — defer to its [security checklist](../code-review/references/review-checklist.md) rather than restating it here. This skill owns the **systemic** view: missing layers, unmodeled trust boundaries, and posture gaps that no single diff would surface.

## Inputs

The skill works from whatever scope the user gives:

- **A whole repository or service** — "security review the API", "threat model the backend"
- **A subsystem** — "review the auth flow", "look at the payments integration"
- **A feature about to ship** — "is the new file-upload feature safe to launch?"

If the scope is open-ended ("review everything"), propose a boundary — usually the highest-value surface (auth, payments, user data) — and confirm before sweeping. A security review without a defined scope produces a checklist, not signal.

## Workflow

### Phase 1: Asset and Trust-Boundary Inventory

Before looking for vulnerabilities, establish *what an attacker would want* and *where the walls are*. This inventory is what makes the review a threat model rather than a generic checklist. Capture it briefly (a short table is enough) using [references/threat-model-checklist.md](references/threat-model-checklist.md):

1. **Assets** — What is worth protecting? Credentials and sessions, PII, payment/financial data, API keys and secrets, and integrity of money-moving or privilege-granting operations.
2. **Entry points** — Where does untrusted input enter? HTTP endpoints, forms, file uploads, webhooks, third-party callbacks, deep links, message queues, and client-supplied IDs.
3. **Trust boundaries** — Where does data cross from less-trusted to more-trusted? client↔server, server↔datastore, server↔third-party API, unauthenticated↔authenticated, user↔admin.
4. **Actors** — Anonymous user, authenticated user, another tenant's user, and a compromised/ malicious insider. For each asset, ask which actor should *not* be able to reach it.

### Phase 2: Codebase and Stack Discovery

Security checks are stack-specific. A Swift/iOS app, a Kotlin/Android app, and a Node/Go/Rust backend each have different secret-storage, transport, and dependency-audit mechanics. Run targeted discovery (see [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md)) to learn:

- The stack and framework (sets what "secure transport" and "secret storage" mean — Keychain, Keystore, env/secrets manager, KMS).
- The auth mechanism (session cookies, JWT, OAuth, platform sign-in) and where it is enforced.
- The dependency manifest and lockfile, and whether an audit tool exists (`npm audit`, `bun audit`, `pip-audit`, `cargo audit`, `govulncheck`, Swift/Gradle equivalents).
- Existing logging/observability, and any current rate-limiting or WAF layer.

### Phase 3: Threat Sweep

Work through the six dimensions in [references/threat-model-checklist.md](references/threat-model-checklist.md), evaluating each against the boundaries from Phase 1. The dimensions are posture-level, not line-level:

1. **Authentication & Authorization** — Is there a *consistent* enforcement layer? Can one user reach another's data (IDOR / broken object-level authz)? Are privileged actions gated by role, not just by login?
2. **Input Validation & Injection** — Is untrusted input validated at a defined boundary? Injection sinks (SQL/NoSQL, OS command, path traversal, SSRF, XSS, deserialization) reachable from entry points.
3. **Secrets & Transport** — Are secrets out of source control and platform-appropriately stored? Is transport encrypted (TLS, cert handling on mobile), and is sensitive data minimized and masked in logs?
4. **Dependencies & Known CVEs** — Run the stack's audit tool. Are there known-vulnerable or unmaintained dependencies on the attack surface?
5. **Security-Event Logging & Monitoring** — Are authn failures, authz denials, and money-moving / privilege-changing events logged (without logging secrets)? Could an incident be reconstructed?
6. **Rate Limiting & Abuse Resistance** — Are auth, password-reset, payment, and expensive endpoints protected against brute force, enumeration, and resource exhaustion?

Confirm a weakness is **reachable** from an entry point before rating it — an unexploitable theoretical issue is noise. Do not run live exploits; trace the path in code instead.

### Phase 4: Classify Severity

Every finding carries a severity from the single shared [severity scale](../_shared/references/conventions.md#severity-and-priority) — `🔴 Critical` / `🟡 Major` / `⚪ Minor`, mapping to `[P0]` / `[P1]` / `[P2]`. Calibrate by **exploitability × impact** using the security-specific guidance in [references/findings-format.md](references/findings-format.md): a reachable vulnerability exposing auth, payments, or user data is Critical; a real weakness gated behind preconditions is Major; defense-in-depth hardening is Minor. Like accessibility in `ui-design-audit`, the security baseline (OWASP / the stack's own security guidance) holds even when a weakness is applied *consistently* — "consistently insecure" is still insecure.

### Phase 5: Produce the Findings Report

Structure all findings using [references/findings-format.md](references/findings-format.md): group by dimension, then by severity. Each finding records the affected asset/boundary, the weakness and the path that reaches it, the severity, and a concrete remediation. **Redact** any secret or exploit detail discovered along the way — describe the gap, never paste the credential.

Lead with a summary: overall posture, counts by severity, and the top findings to fix first. Then, if the user wants remediation tracked, offer to write the report as `plans/security-review-<date>/prd.md` in PRD format (using [../create-a-prd/references/prd-schema.md](../create-a-prd/references/prd-schema.md)) so it hands off to **prd-to-tasks**. The mapping from finding to requirement is defined in [references/findings-format.md](references/findings-format.md).

## Key Principles

**Model the threat before listing checks.** The asset/boundary inventory is what separates this from a generic checklist. A finding always names the asset at risk and the boundary that fails.

**Complement, don't duplicate, `code-review`.** Line-level diff issues belong to code-review's security dimension. This skill owns the systemic view — missing layers and unmodeled boundaries. When they overlap, point at code-review rather than re-checking the same line.

**Reachability gates severity.** Confirm an entry point can actually reach the weakness before calling it Critical. Trace the path in code; never run a live exploit against the user's system.

**The baseline is the security standard, not the project's habits.** Unlike most audits, "consistent with the rest of the codebase" is not a defense for a security gap. OWASP and the stack's security guidance are the baseline.

**Redact everything sensitive.** Report the *shape* of the problem. Never paste a discovered secret, token, or working exploit into a finding, comment, or commit.

**No gold-plating.** Recommend the security control the threat warrants — not every hardening measure that exists. Out-of-scope hardening goes in "Future Opportunities," not findings.

## References

- [references/threat-model-checklist.md](references/threat-model-checklist.md) — Asset/boundary inventory and the six-dimension threat sweep
- [references/findings-format.md](references/findings-format.md) — Security severity calibration, finding format, and the PRD-compatible report schema
- [../_shared/references/conventions.md](../_shared/references/conventions.md) — Canonical severity↔priority scale and other shared conventions
- [../code-review/references/review-checklist.md](../code-review/references/review-checklist.md) — Per-change security checklist this skill defers to for line-level diff issues
- [../create-a-prd/references/prd-schema.md](../create-a-prd/references/prd-schema.md) — PRD structure for the findings report output
- [../create-a-prd/references/codebase-discovery.md](../create-a-prd/references/codebase-discovery.md) — Codebase discovery checklist (shared reference)
