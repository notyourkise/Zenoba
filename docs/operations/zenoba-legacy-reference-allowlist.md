# Zenoba Legacy Reference Allowlist

Last reviewed: 2026-10-11 WITA.

This list records the remaining `Netloka` identifiers after the application
identity rebrand. They are not released Zenoba-facing copy. Each must remain
until the separately authorized domain/VPS cutover, repository rename, or
historical-record retention decision.

| Category | Paths | Reason | Removal authority |
| --- | --- | --- | --- |
| Published transitional history | `src/app/about/page.tsx`, `src/app/about/page.test.tsx` | The factual statement that Zenoba was previously Netloka explains the public rebrand and is explicitly approved content. | Replace only when the owner approves retiring this history |
| Production continuity | `compose.production.yml`, `scripts/backup-production-postgres.sh`, `scripts/deploy-production.sh` | Existing production Compose project, data volume/network, backup names, and `/srv/netloka/production` must not be renamed during an identity-only release. | Approved domain/VPS cutover plan |
| Legacy public routing | `Caddyfile`, `deploy/nginx/netloka.biz.id.conf`, `deploy/nginx/staging.netloka.biz.id.conf`, deployment scripts | `netloka.biz.id` must keep serving or redirecting during the cutover; changing these now would alter live routing. | Approved domain/VPS cutover plan |
| Current physical/repository identity | `README.md`, `docs/HANDOFF.md` | GitHub repository is currently `notyourkise/NetLoka`; the active checkouts are still under `D:\laragon\www\NetLoka*` until the merged-main relocation in Application Identity Task 5. | User-approved repository/local-folder rename |
| Historical evidence | `CHANGELOG.md`, `docs/decisions/**`, `docs/curriculum/**`, `docs/deployment/**`, `docs/operations/**`, `docs/testing/**`, `docs/commerce/**` | These files preserve dated decisions, release evidence, runbooks, and historical domain names. Rewriting them would falsify the record. | Explicit documentation-history decision |

The complete cutover sequence, including the legacy-domain redirect and the
preserved production identifiers, is documented in
`docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`.
