# Zenoba — Agent Handoff

Last updated: **2026-10-11 19:03 WITA**. Read `AGENTS.md` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba with a separate public `/about` page, while retaining the homepage structure and learner behavior.
- Approved scope: Zenoba is independently operated by solo founder Fikri Haikal; no legal-entity, founding-year, user-count, or unsupported corporate claim may be published.
- Approved safety boundary: the first cutover preserves PostgreSQL data, Docker volumes/networks, backups, and `/srv/netloka`; the legacy domain will later redirect to `zenoba.tech`.
- Task phase: Application Identity Tasks 1–4 are locally implemented and locally verified. Task 5 release/PR preparation is blocked on two full-E2E browser findings; it does not authorize a merge, local-folder move, or domain/VPS change.
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
- Task 1 focused tests passed (17 tests). Task 2 focused tests passed (3 files/10 tests). Task 3 focused unit tests passed (5 files/37 tests); its Chromium E2E coverage passed (10/10) at 390px and 1440px after installing the local test browser under `D:\laragonplaywright-browsers`. Task 4 re-ran Prisma generation, lint, typecheck, the full unit suite, and the production build with safe local values. The later dashboard-label correction has focused unit coverage (18/18), full-unit coverage (150 files/924 tests), and the active-source inventory now leaves only the intentional historical About-page Netloka reference.
- The owner authorized an isolated local Docker PostgreSQL test database only: `zenoba-postgres` is healthy on loopback `127.0.0.1:5433`, its six existing migrations were applied, and the development seed completed. The full 303-test E2E run now reaches all browser projects but is not green: developer analytics failed once in Firefox with `NS_BINDING_ABORTED` / `Error in input stream` (the focused Firefox file subsequently passed 3/3), while the WebKit multi-user anti-spoofing test reproducibly has its locked-assessment navigation interrupted by a redirect to `/dashboard`. No VPS, domain, production database, or production container was changed. CI and production checks have not been run.

## Next Action

1. Diagnose and repair the reproducible WebKit multi-user authentication/navigation finding without weakening the anti-spoofing assertion; then re-run the complete three-browser E2E suite against the same isolated local database. Treat the Firefox failure as flaky only if fresh full-suite evidence is clean.
2. After the full E2E gate passes, review the complete diff and prepare one PR for Abangku's review without merging it.
3. After Abangku merges, verify the exact merged PR and only then move the clean main checkout from `D:\laragon\www\NetLoka` to `D:\laragon\www\Zenoba`.
3. Domain/VPS actions remain separately authorized and begin only after the app release is merged.
