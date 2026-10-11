# Netloka — Agent Handoff

Last updated: **2026-10-11 17:09 WITA**. Read `AGENTS.md` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba with a separate public `/about` page, while retaining the homepage structure and learner behavior.
- Approved scope: Zenoba is independently operated by solo founder Fikri Haikal; no legal-entity, founding-year, user-count, or unsupported corporate claim may be published.
- Approved safety boundary: the first cutover preserves PostgreSQL data, Docker volumes/networks, backups, and `/srv/netloka`; the legacy domain will later redirect to `zenoba.tech`.
- Task phase: native execution started; Application Identity Tasks 1–3 are locally implemented and verified, with Task 4 (repository identity audit) next.
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
- Task 1 focused tests passed (17 tests). Task 2 focused tests passed (3 files/10 tests). Task 3 focused unit tests passed (5 files/37 tests); its Chromium E2E coverage passed (10/10) at 390px and 1440px after installing the local test browser under `D:\laragon\playwright-browsers`. The full Vitest suite passed (150 files/923 tests) after generating the ignored Prisma Client with a local example `DATABASE_URL`; no database connection was performed. Expected test fixtures log database-failure fallback messages.
- Firefox/WebKit coverage, lint, typecheck, build, CI, and production checks have not been run for this implementation checkpoint.

## Next Action

1. Implement and test Application Identity Task 4: classify the remaining repository-wide Netloka references, change current/local identity to Zenoba, and preserve only documented historical or production-continuity identifiers.
2. Continue remaining application identity tasks, then complete local/CI review and create a PR for Abangku.
3. Domain/VPS actions remain separately authorized and begin only after the app release is merged.
