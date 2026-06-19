# Threat-Model Checklist

A structured, **posture-level** checklist for a lightweight threat model. It is organized as an asset/trust-boundary inventory followed by six review dimensions. Work the inventory first — every later finding should name an asset and the boundary that fails to protect it.

This checklist is deliberately *systemic*. Line-level "is this exact input validated?" questions belong to `code-review`'s security checklist (the skill links it directly); here the questions are "is there a validation *layer*, and can an entry point reach a sink that bypasses it?" When a finding is really about one line in one diff, hand it to code-review instead of duplicating it.

---

## 0. Asset and Trust-Boundary Inventory

Fill this in before sweeping the dimensions. A short table per row is enough — it is the map the rest of the review reads against.

### Assets — what an attacker wants
- [ ] **Credentials & sessions** — passwords, tokens, session cookies, refresh tokens, OAuth grants.
- [ ] **Personal data (PII)** — names, emails, addresses, location, anything regulated.
- [ ] **Financial data & money movement** — card/bank data, balances, the *integrity* of payment and refund operations.
- [ ] **Secrets** — API keys, signing keys, DB credentials, webhook secrets.
- [ ] **Privilege & integrity** — operations that grant access, change roles, or move money. (Tampering, not just disclosure.)

### Entry points — where untrusted input arrives
- [ ] HTTP/RPC endpoints (note which are unauthenticated).
- [ ] Forms, search fields, and client-supplied identifiers (`?id=`, path params).
- [ ] File uploads and imports.
- [ ] Webhooks and third-party callbacks (are they signature-verified?).
- [ ] Deep links / custom URL schemes / intents (mobile).
- [ ] Message queues, cron payloads, and admin tooling.

### Trust boundaries — where data crosses into more-trusted ground
- [ ] client ↔ server (client input is never trusted, including mobile clients).
- [ ] server ↔ datastore (parameterization boundary).
- [ ] server ↔ third-party API (egress, SSRF, secret exposure).
- [ ] unauthenticated ↔ authenticated.
- [ ] user ↔ admin / tenant ↔ tenant (the IDOR boundary).

### Actors — who should *not* reach each asset
- [ ] Anonymous internet user.
- [ ] Authenticated user acting on **another** user's / tenant's data.
- [ ] Lower-privilege user reaching admin capability.
- [ ] Compromised dependency or insider (defense-in-depth, not paranoia).

> For each high-value asset, write one sentence: *"Actor X must not be able to do Y to asset Z."* Each sentence that the code cannot guarantee is a candidate finding.

---

## 1. Authentication & Authorization

The highest-yield dimension for apps with accounts. Focus on **consistency** and **object-level** checks — the gaps code-review misses because it only sees one endpoint at a time.

- [ ] Is authentication enforced by a **single, consistent** mechanism (middleware/guard/policy) rather than per-handler ad hoc checks that can be forgotten on a new route?
- [ ] **Object-level authorization (IDOR):** for every endpoint that takes a resource ID, is ownership/tenancy checked — not just "is the user logged in"? Trace at least one `GET /thing/:id` and confirm a different user cannot read another's `id`.
- [ ] **Function-level authorization:** are privileged/admin actions gated by role or permission, server-side? (Client-side hiding is not authorization.)
- [ ] Are session tokens rotated on privilege change and invalidated on logout/password reset? Reasonable expiry?
- [ ] Password reset, email change, and MFA flows — can they be abused to take over an account (host-header reset poisoning, unverified email change, response that leaks whether an account exists)?
- [ ] For JWT/OAuth: is the signature verified, `alg` pinned (no `none`), audience/issuer checked, and expiry enforced?

> Defer to code-review for "this one new endpoint forgot its auth check." Own here: "there is no consistent layer, so endpoints will keep forgetting."

---

## 2. Input Validation & Injection

Look for the **boundary** and for **sinks reachable** from Phase-0 entry points.

- [ ] Is untrusted input validated/normalized at a defined boundary (schema validation, typed parsing) rather than scattered and inconsistent?
- [ ] **SQL/NoSQL injection:** are queries parameterized everywhere, or is string interpolation reachable from an entry point?
- [ ] **OS command / path traversal:** is user input ever concatenated into a shell command or file path? Are upload filenames and IDs constrained?
- [ ] **SSRF:** does any server-side fetch take a user-controlled URL/host? Is it allow-listed?
- [ ] **XSS:** is user content rendered without escaping / via `dangerouslySetInnerHTML`/`innerHTML`? Is there a Content-Security-Policy?
- [ ] **Deserialization / template injection:** is untrusted data fed to an unsafe deserializer or template engine?
- [ ] Are file uploads restricted by type, size, and storage location (no execution from the upload dir)?

---

## 3. Secrets & Transport

- [ ] Are secrets out of source control (no keys in the repo, in client bundles, or in mobile binaries)? Check history and config, not just `HEAD`.
- [ ] Are secrets stored platform-appropriately — server: env/secrets manager/KMS; iOS: Keychain; Android: Keystore/EncryptedSharedPreferences — not in plaintext files or `UserDefaults`/`SharedPreferences`?
- [ ] Is **all** transport TLS, with no plaintext fallback? On mobile, is ATS / network-security-config left secure (no arbitrary cleartext, sane cert handling)?
- [ ] Are passwords hashed with a slow algorithm (bcrypt/scrypt/Argon2), never encrypted or stored plaintext?
- [ ] Is sensitive data minimized and **masked in logs/analytics/error reports** (no tokens, card numbers, or full PII in logs)?
- [ ] Are secrets rotated, and is there a path to rotate one without a deploy if it leaks?

---

## 4. Dependencies & Known CVEs

- [ ] Run the stack's audit tool and record the result: `npm audit` / `bun audit`, `pip-audit`, `cargo audit`, `govulncheck`, `gradle dependencyCheck`, or the Swift equivalent.
- [ ] Are there **known-vulnerable** dependencies on the attack surface (not just transitive dev-only)? Triage by reachability and severity.
- [ ] Is there a lockfile, and are versions pinned? Are any critical dependencies unmaintained/abandoned?
- [ ] Are dependencies pulled from trusted registries, and is there any obvious typosquat or unexpected package?
- [ ] Is there a process (Dependabot/Renovate/CI audit) so this does not rot? Its absence is itself a Major posture finding.

---

## 5. Security-Event Logging & Monitoring

Not general logging — the events needed to **detect and reconstruct** an incident.

- [ ] Are authentication failures and lockouts logged (with enough context to spot brute force, without logging the password)?
- [ ] Are **authorization denials** logged? Repeated denials are an attack signal.
- [ ] Are money-moving and privilege-changing operations logged with actor, target, and outcome (an audit trail)?
- [ ] Do logs **exclude** secrets, tokens, full card numbers, and unmasked PII? (Over-logging is itself a finding — see Dimension 3.)
- [ ] Is there any alerting/anomaly signal, or are logs write-only? Could you answer "what did the attacker touch?" after an incident?

---

## 6. Rate Limiting & Abuse Resistance

- [ ] Are authentication and password-reset endpoints rate-limited / throttled against brute force and credential stuffing?
- [ ] Are account-enumeration vectors closed (uniform responses/timing on login, reset, and signup)?
- [ ] Are expensive or fan-out operations (search, export, report generation, third-party calls) bounded against resource-exhaustion DoS?
- [ ] Are payment, coupon, and referral flows protected against automated abuse and replay (idempotency keys, signature/nonce checks)?
- [ ] Are there sensible quotas/pagination caps so a single caller cannot exhaust the system?

---

## Scoping Note

Not every dimension applies to every system — a static marketing site has no auth surface. Skip a dimension explicitly and say why ("no server-side data store; injection N/A"), the same way the code-review checklist allows skipping non-applicable dimensions. An unstated skip reads as an unchecked gap.

Severity for each finding is assigned with [findings-format.md](findings-format.md).
