# Zenoba Legacy Reference Allowlist

Last reviewed: 2026-10-12 WITA.

This list records the remaining `Netloka` identifiers after the application
identity rebrand. Public history is intentional; other references provide compatibility or dated evidence. Each must remain
until the separately authorized domain/VPS cutover, repository rename, or
historical-record retention decision.

| Category | Paths | Reason | Removal authority |
| --- | --- | --- | --- |
| Published transitional history | `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/about/page.test.tsx` | The factual statement that Zenoba was previously Netloka explains the public rebrand and is explicitly approved content. | Replace only when the owner approves retiring this history |
| Browser compatibility | `src/components/navigation/account-modal/account-modal.tsx` and its tests | Read `netloka_cli_pref` / `netloka_privacy_pref` only when the corresponding Zenoba key is absent; writes use Zenoba keys. Storage cannot transfer across domains. | Owner-approved retirement of same-origin compatibility |
| Private authentication continuity | `src/features/developer/elevation/service.ts`, developer route/verification tests | Preserve `netloka_dev_elevation` so existing same-origin privileged sessions retain the original ten-minute authentication contract. This private cookie is not public branding and cannot transfer across domains. | Separately approved authentication/session transition |
| Production continuity | `compose.production.yml`, `docker-compose.prod.yml`, `scripts/backup-production-postgres.sh`, `scripts/deploy-production.sh`, `scripts/backup-db.sh`, `scripts/restore-db.sh`, compatibility tests | Preserve each stack's original project, volumes/networks, database defaults, backup names, and `/srv/netloka/production`. Generic backup/restore defaults remain compatible with the legacy alternative stack. The manifests describe different stacks, not interchangeable deployment choices. | Approved domain/VPS cutover plan |
| Legacy public routing | `Caddyfile`, `deploy/nginx/netloka.biz.id.conf`, `deploy/nginx/staging.netloka.biz.id.conf`, deployment scripts | `netloka.biz.id` must keep serving or redirecting during the cutover; changing these now would alter live routing. | Approved domain/VPS cutover plan |
| Current physical/repository identity | `README.md`, `docs/HANDOFF.md` | GitHub repository is currently `notyourkise/NetLoka`; the active checkouts are still under `D:\laragon\www\NetLoka*` until the merged-main relocation in Application Identity Task 5. | User-approved repository/local-folder rename |
| Staging legacy routing/database defaults | `deploy/staging.env.example`, `deploy/nginx/staging.netloka.biz.id.conf`, `deploy/bootstrap-staging-host.sh` | Legacy host/OAuth/DNS await cutover; database examples retain compatible names. Zenoba project/path/volume names apply only to new isolated staging, not retained VPS staging. | Approved staging/domain transition |
| Historical evidence | Dated entries in `CHANGELOG.md`, `docs/decisions/**`, `docs/curriculum/**`, `docs/deployment/**`, `docs/testing/**`, `docs/commerce/**`, and explicitly labeled historical sections in `docs/operations/**` | Preserve dated decisions and recorded checks; these are not current readiness. Current runbook instructions and contacts are not blanket-exempt and must match Zenoba. | Explicit documentation-history decision |

The complete cutover sequence, including the legacy-domain redirect and the
preserved production identifiers, is documented in
`docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`.
