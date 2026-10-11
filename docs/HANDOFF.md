# Zenoba — Agent Handoff

Last updated: **2026-10-11 17:18 WITA**. Read `AGENTS.md` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba with a separate public `/about` page, while retaining the homepage structure and learner behavior.
- Approved scope: Zenoba is independently operated by solo founder Fikri Haikal; no legal-entity, founding-year, user-count, or unsupported corporate claim may be published.
- Approved safety boundary: the first cutover preserves PostgreSQL data, Docker volumes/networks, backups, and `/srv/netloka`; the legacy domain will later redirect to `zenoba.tech`.
- Task phase: Application Identity Tasks 1–4 are locally implemented and locally verified. Task 5 release/PR preparation is blocked only on the database-backed full E2E gate; it does not authorize a merge, local-folder move, or domain/VPS change.
- No application, domain, DNS, OAuth, VPS, production deployment, or GitHub remote mutation has been performed for this rebrand.

## Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `D:\laragon\www\NetLoka`, clean `main` at `7fdd7afcd72870743ee7702e9b2b322f059acbd9` |
| Planning worktree | `D:\laragon\www\NetLoka-zenoba-rebrand-plan` on `codex/zenoba-rebrand-plan`, based on `7fdd7af` |
| Planning changes | Design spec, two plans, project-plan reference, changelog checkpoint, and this handoff update are included in the current planning checkpoint |
| GitHub repository | `notyourkise/NetLoka`; rename is outside the first-cutover scope |
| Production history | Previous handoff records `/srv/netloka/production` and `netloka.biz.id`; VPS state is not re-verified in this documentation checkpoint |

## Planning Artifacts

- Design: `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`
- Application/local identity: `docs/superpowers/plans/2026-10-11-zenoba-application-identity-rebrand.md`
- Domain cutover: `docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`
- The plans split app/local work from external cutover, preventing a branding release from becoming a data migration.

## Evidence and Limits

- Public inspection found no `/about` route, unsupported learner-volume claims, and stale pre-launch legal wording; implementation plans correct these without changing product behavior.
- `zenoba.tech` currently serves a parked Hostinger page; canonical switch has not occurred.
- Task 1 focused tests passed (17 tests). Task 2 focused tests passed (3 files/10 tests). Task 3 focused unit tests passed (5 files/37 tests); its Chromium E2E coverage passed (10/10) at 390px and 1440px after installing the local test browser under `D:\laragon\playwright-browsers`. Task 4 re-ran Prisma generation, lint, typecheck, the full unit suite, and the production build with safe local values. No database connection was performed. Expected test fixtures log database-failure fallback messages; build logs a handled unavailable local database during static data collection.
- Firefox/WebKit browsers are now installed under `D:\laragon\playwright-browsers`. The full 303-test E2E suite cannot pass without the local PostgreSQL test database: database-backed registration cases fail with Prisma `P1001` against `127.0.0.1:5433`. The runner was stopped without starting Docker, applying migrations, or changing a database. CI and production checks have not been run.

## Next Action

1. Abangku must identify or authorize creation of an isolated disposable PostgreSQL test database before the full E2E gate can run; do not point E2E at production or an unknown local database.
2. After the full E2E gate passes, review the complete diff and prepare one PR for Abangku's review without merging it.
3. After Abangku merges, verify the exact merged PR and only then move the clean main checkout from `D:\laragon\www\NetLoka` to `D:\laragon\www\Zenoba`.
3. Domain/VPS actions remain separately authorized and begin only after the app release is merged.
