# Supply-Chain Caution

The registry is untrusted input. This reference covers the signals to check
before accepting a version, and the range/lockfile discipline that keeps an
upgrade reviewable. Used by `dependency-upgrade` Phases 2–3.

## The ≥ 7-Day Rule

**Prefer versions published at least 7 days ago.** Most compromised releases —
hijacked maintainer accounts, poisoned build pipelines, typosquats promoted to
"latest" — are detected and yanked within days of publication. Waiting a week
costs almost nothing and steps around the highest-risk window.

Exceptions, made consciously and noted in the report:

- A **security fix** for an actively-exploited CVE may be worth taking fresh —
  the known vulnerability usually outweighs the fresh-release risk. Verify the
  release is from the expected maintainers and repository before taking it.
- A fresh patch that only exists to fix the version you're taking anyway.

## Signals to Check Before Taking a Version

| Signal | Where to look | Red flag |
|--------|---------------|----------|
| **Publish date** | Registry page / `npm view <pkg> time` equivalent | Published in the last few days |
| **Maintainer change** | Registry maintainers list vs. previous versions | New publisher on this release |
| **Install scripts** | Package manifest (`postinstall` etc.) | A script appearing where none existed |
| **Source repository** | Registry metadata → repo link | Tag missing in the repo; tarball differs from tagged source |
| **Version jump** | Release history | An abnormal jump or a release after years of dormancy |
| **Dependency additions** | Lockfile diff after the bump | The new version pulls in unexpected new transitive packages |

Any red flag → hold the bump, investigate, or pick the previous version.

## Version-Range Discipline

- **No floating ranges**: never `latest`, `*`, or unbounded `>=` in a manifest.
- **Bounded ranges or exact pins**, per the project's existing convention —
  match what the manifest already does rather than switching philosophy
  mid-upgrade.
- **Resolutions/overrides** (forcing a transitive version) are temporary
  patches: each one gets a comment or report entry saying when it can be
  removed, or it becomes permanent drift.

## Lockfile Discipline

The lockfile is the actual dependency decision; the manifest is just intent.

1. **Never hand-edit** a lockfile. Every change goes through the package
   manager so integrity hashes stay valid.
2. **One lockfile, one package manager.** A repo with both `bun.lock` and
   `package-lock.json` has two sources of truth; flag it rather than adding to
   the confusion.
3. **Review the lockfile diff per stage**: only the intended packages (and
   their legitimate transitive updates) moved; no source URL switched from the
   default registry; no integrity hash changed without a version change.
4. **Commit manifest + lockfile together** in the same stage commit — a
   manifest bump without its lockfile is an unreproducible build waiting to
   happen.

## Audit Tooling

Run the ecosystem's audit as part of Phase 4 verification — `bun audit` /
`npm audit`, `pip-audit`, `cargo audit`, `govulncheck`, `bundler-audit`, or the
platform's equivalent:

- Confirm the findings the upgrade set out to fix are actually resolved.
- Triage what remains by **reachability** (is the vulnerable path reachable
  from your code?) and severity — the same reachability standard
  `security-review` applies to its findings.
- An unfixable finding (no patched version exists) is recorded with its
  mitigation or accepted risk — silence is not a disposition.
