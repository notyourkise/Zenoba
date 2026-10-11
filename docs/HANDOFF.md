# Zenoba — Agent Handoff

Last updated: **2026-10-11 21:00 WITA**. Read `AGENTS.md` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba with a separate public `/about` page, while retaining learner behavior and removing the final homepage CTA so FAQ flows directly into the footer.
- Approved scope: Zenoba is independently operated by solo founder Fikri Haikal. The owner verified that Netloka began in May 2026, Zenoba was founded individually in 2026, and Zenoba became the new identity in October 2026. No legal-entity, user-count, or unsupported corporate claim may be published.
- Latest approved story: information overload leaves beginners unsure where to start; the product provides direction through roadmaps and career paths. Netloka was independently started in May 2026, then renamed Zenoba in October 2026 for a fresher, more distinctive identity. The origin chapter has no invented date. History descriptions are hidden initially, revealed on planet hover/focus, and toggled with tap/click; Escape dismisses them. Titles/dates stay visible, without history cards.
- Approved safety boundary: the first cutover preserves PostgreSQL data, Docker volumes/networks, backups, and `/srv/netloka`; the legacy domain will later redirect to `zenoba.tech`.
- Task phase: Application Identity Tasks 1–4 plus the owner-approved About/CTA refinement are locally implemented and locally verified. The Journey now uses a full-width orbit with unboxed milestones; Visi/Misi use direct headings without eyebrow labels. The owner explicitly deferred WebKit and long-running E2E investigation from the current rebrand goal; local Docker smoke validation is complete. This does not authorize a merge, local-folder move, or domain/VPS change.
- Local application changes and local Docker rebuilds are implemented. No production application, domain, DNS, OAuth, VPS, production deployment, or GitHub remote mutation has been performed for this rebrand.

## Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `D:\laragon\www\NetLoka`, clean `main` at `7fdd7afcd72870743ee7702e9b2b322f059acbd9` |
| Planning worktree | `D:\laragon\www\NetLoka-zenoba-rebrand-plan` on `codex/zenoba-rebrand-plan`, based on `7fdd7af`; history interaction refinement and this snapshot are delivered in the same local commit after verified base `79fd6c7` (resolve live HEAD) |
| Planning changes | Design spec, two plans, project-plan reference, local Docker checkpoint, and the approved About/CTA refinements are committed locally |
| GitHub repository | `notyourkise/NetLoka`; rename is outside the first-cutover scope |
| Production history | Previous handoff records `/srv/netloka/production` and `netloka.biz.id`; VPS state is not re-verified in this documentation checkpoint |

## Planning Artifacts

- Design: `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`
- Application/local identity: `docs/superpowers/plans/2026-10-11-zenoba-application-identity-rebrand.md`
- Domain cutover: `docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`
- The plans split app/local work from external cutover, preventing a branding release from becoming a data migration.

## Evidence and Limits

- History-interaction verification (uncommitted changes on `79fd6c7`): baseline About/Journey tests 7/7; new behavior tests failed before implementation (missing history buttons); final focused tests 10/10 passed, including hover leave, focus/blur, Escape, and tap toggling. `npm run lint`, `npm run typecheck`, `git diff --check`, and `docker compose build app` passed. Rebuilt app via `docker compose up -d app`; health returned 200. Browser smoke confirmed initial hidden descriptions and desktop/mobile click toggling at 1440px/390px. Hover behavior is unit-tested; no full E2E, WebKit, CI, or production validation ran. Existing build warnings remain unchanged.
- Latest About refinement reuses `StarField`, `JourneyDriftingPlanets`, `ConstellationPath`, planet textures/positions, and Saturn rings from `src/components/marketing/it-infrastructure-journey.tsx` via `ZenobaHistoryJourney`. Its decorative planets do not invoke learning-path dialogs. Three historical milestones remain unchanged; the other planets are visual elements, not fabricated historical events. Focused About/Journey tests passed 7/7, lint/typecheck passed, Docker production build passed with existing middleware/Edge/catalogue warnings, and desktop (1440px) / mobile (390px) visual checks passed on the rebuilt local app. Full E2E/WebKit and CI were not rerun, per approved scope.
- Public inspection found no `/about` route, unsupported learner-volume claims, and stale pre-launch legal wording; implementation plans correct these without changing product behavior.
- `zenoba.tech` currently serves a parked Hostinger page; canonical switch has not occurred.
- Task 1 focused tests passed (17 tests). Task 2 focused tests passed (3 files/10 tests). Task 3 focused unit tests passed (5 files/37 tests); its Chromium E2E coverage passed (10/10) at 390px and 1440px after installing the local test browser under `D:\laragon\playwright-browsers`. Task 4 re-ran Prisma generation, lint, typecheck, the full unit suite, and the production build with safe local values. The later dashboard-label correction has focused unit coverage (18/18), full-unit coverage (150 files/924 tests), and the active-source inventory now leaves only the intentional historical About-page Netloka reference.
- The owner authorized an isolated local Docker PostgreSQL test database only: `zenoba-postgres` is healthy on loopback `127.0.0.1:5433`, its six existing migrations were applied, and the development seed completed. The local production app `zenoba-app` is healthy on `http://localhost:3000`; `/api/health` returned 200 with a connected database. `/about` was reviewed locally at mobile and 1440px desktop after moving its milestones onto a full-width orbit; the homepage no longer returned the removed final CTA. The full 303-test E2E run previously found a flaky Firefox runtime failure and a reproducible WebKit redirect; at the owner's direction these are deferred rather than blocking the rebrand's local-running milestone. No VPS, domain, production database, or production container was changed. CI and production checks have not been run.

## Next Action

1. Review the complete rebrand diff and, if Abangku authorizes publishing it, prepare one PR for Abangku's review without merging it.
2. Keep WebKit and long-running full-E2E investigation as a separate follow-up; do not let it block the current rebrand-local-running goal.
3. After Abangku merges, verify the exact merged PR and only then move the clean main checkout from `D:\laragon\www\NetLoka` to `D:\laragon\www\Zenoba`.
4. Domain/VPS actions remain separately authorized and begin only after the app release is merged.
