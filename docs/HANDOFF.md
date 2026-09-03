# Netloka — Agent Handoff

Last updated: **2026-09-03 23:44 WITA**. This is a development snapshot, not a live status feed. Follow [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not require the previous chat to understand this file.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**, not a networking-only product. Networking is the first implemented learning domain.
- Product journey: **Learn → Interact → Practice → Challenge → Consultant Project**.
- Other navbar domains remain noninteractive **Soon** entries. Keep established English product terms; do not implement future domains without approved scope.
- [ROADMAP.md](../ROADMAP.md) records Milestones 0–6 complete. **Milestone 7 is active**, Sprint 16 covers stabilization/feature refinement; Sprint 15 security/environment/deployment gates remain open.
- Current phase is **feature development**, not deployment. Staging and production have not been deployed/verified. Configuration files and CI builds are not evidence of a live deployment.
- Current planning task: Member Workspace & Course Commerce Foundation. The owner approved the architecture/design but no application implementation has started. The next agent must review the written spec, obtain/record owner approval of that document, then create the task-by-task implementation plan before code.

## 2. Git and delivery checkpoint

Verified on 2026-09-03:

| Item | Last verified state |
| --- | --- |
| Repository | [notyourkise/NetLoka](https://github.com/notyourkise/NetLoka) |
| Main checkout | `C:/laragon/www/netloka`, branch `main` |
| Main / origin/main | `3a735da181339bd98b0c6218389b3d83debd67bf` (observed synchronized after PR #17 merge) |
| Last feature PR | [#17 — profile dropdown menu, account modal, avatar upload, and flame streak](https://github.com/notyourkise/NetLoka/pull/17), merged; re-verify live PR/CI facts before relying on this snapshot |
| Current planning branch/worktree | `codex/course-commerce-plan` at `C:/laragon/www/netloka/.worktrees/codex-course-commerce-plan`, based on `3a735da` |
| Current task PR | None. Documentation is local and uncommitted at this checkpoint. |

Retained worktrees (not cleanup targets for this planning task):

- `.worktrees/codex-fix-m0-sprint-0` → branch `docs/staging-progress`, last observed at `8460136`. Unrelated work; do not delete or repurpose it.

Paths are local checkout hints, not portable requirements. Rediscover worktrees on another machine. After this planning PR eventually merges, do not resume a former branch merely because this snapshot names it.

## 3. Implemented feature baseline

The merged baseline contains:

- Learning catalog, typed reusable lesson blocks, prerequisites/progress, quizzes, and XP ledger.
- Deterministic IPv4, topology, terminal, lab, and challenge logic; consultant procurement/scoring and portfolio flows.
- Cross-domain Learn/Labs/Challenges/Consultant navigation with Networking available and future domains marked Soon.
- Landing-page Sign In/Create Account modal driven by `/?auth=sign-in` and `/?auth=sign-up`; legacy `/sign-in` and `/sign-up` redirect to it.
- Conditional Google provider and visible disabled `Setup pending` button until Google credentials exist. Provider/account-creation code exists; live Google authentication remains unverified.
- Standalone forgot/reset-password pages, server handlers, Hostinger-compatible SMTP adapter, hashed expiring single-use tokens, and migration files. These are implemented, not yet validated with a live database/mailbox.

Do not equate this feature list or older completed checkboxes with a fresh full-product audit. [PLAN.md](../PLAN.md) contains the detailed active tasks; [CHANGELOG.md](../CHANGELOG.md) preserves historical evidence.

## 4. Actual codebase map

Inspect these entry points and their dependencies for the active task; planned directory trees are not an authoritative inventory.

| Area | Actual source of interest |
| --- | --- |
| Landing and navigation | `src/app/page.tsx`, `src/components/navigation/app-header.tsx`, `src/components/marketing/` |
| Protected application routes | `src/app/(app)/`, `src/app/(app)/layout.tsx`, `src/middleware.ts` |
| Auth UI and redirects | `src/features/auth/components/`, `src/app/(auth)/`, `src/features/auth/callback-url.ts` |
| Auth/session | `src/features/auth/auth.ts`, `src/lib/auth.ts`, `src/app/api/auth/` |
| Password recovery | `src/features/auth/password-reset.ts`, `src/features/auth/email/password-reset-email.ts` |
| Learning/content/progress | `src/features/learning/`, `src/features/learning/blocks/`, `src/app/api/learning/` |
| Quiz and XP | `src/features/quiz/`, `src/features/xp/ledger.ts` |
| Simulation/domain logic | `src/features/network-logic/ipv4/`, `src/features/network-logic/simulation/`, `src/features/network-logic/terminal/` |
| Practice and projects | `src/features/labs/`, `src/features/challenges/`, `src/features/consultant/` and matching API routes |
| Profile | `src/features/profile/`, `src/app/api/user/profile/route.ts` |
| Database/content seed | `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`, `src/lib/db/client.ts` |
| Configuration | `src/lib/env/server.ts`, `.env.example`, `next.config.ts`, `prisma.config.ts` |
| Tests | Colocated `*.test.ts(x)` under `src/`, `src/test/setup.ts`, `src/e2e/`, `vitest.config.ts`, `playwright.config.ts` |
| CI and package scripts | `.github/workflows/ci.yml`, `package.json`, `package-lock.json` |
| Deployment guidance | `docs/deployment/staging.md`, `docs/deployment/cloudflare-and-caddy.md` |

Current stack from package/config files: Next.js 16.3.x, React 19.2.x, TypeScript 5, Tailwind 4, Prisma 7/PostgreSQL, NextAuth 4/JWT, npm (Node >=20.19). Do not upgrade dependencies as part of unrelated work. The Nodemailer 9 alias `nodemailer-secure` is intentional; see [ADR 0002](decisions/0002-auth-modal-and-password-recovery.md), which supersedes ADR 0001's old NextAuth v5 selection language.

Example flows to retrace before related changes:

- Learning: lesson route/block UI → progress/quiz API → session + input validation → learning/quiz services → Prisma progress/attempts and XP ledger → updated UI.
- Credentials: landing modal → registration API or NextAuth credentials → password validation/hash verification + Prisma user → JWT session and validated local callback.
- Recovery: forgot-password form → validated email API → credential-account lookup → token digest persistence + SMTP → reset form/API → transactional token consumption + password update. Read failure and concurrency paths too; generic body text does not eliminate SMTP timing leakage.

## 5. Verification evidence and its limits

### Merged auth feature (historical application evidence)

- [CI run 33713239705](https://github.com/notyourkise/NetLoka/actions/runs/33713239705) was rechecked with `gh`: **success** for head `48df6c2e42fa8a1eaabf517f9003481c2dbf5380`.
- All five jobs succeeded: **Lint & Type Check**, **Test Suite**, **Browser E2E Tests**, **Production Build**, **Quality Gate**. That workflow's browser job runs **Chromium**, not all three browsers.
- The 2026-09-03 changelog records local ESLint/typecheck, 35 Vitest suites / 160 tests, 72 Playwright tests across Chromium/Firefox/WebKit, Prisma validation, production build, and visual/keyboard checks on the feature code. These are prior-task results, not newly executed checks for this docs task.
- Focused tests mock Prisma/SMTP. The browser server used placeholder DB credentials and exercised degraded health, not successful live persistence. No live email or Google journey was proven by those green results.

### Current planning checkpoint

- Owner-approved design: `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`. It defines the protected member workspace, hybrid lifetime catalog, course/package/order/entitlement boundaries, non-production sandbox lifecycle, locked public-UI boundary, Sprint 17 workstreams, and Milestone 8 activation gates.
- `ROADMAP.md` and `PLAN.md` now contain the planned Sprint 17 workstreams. This is planning, not implementation: no application source, Prisma migration, lockfile, CI configuration, credential, live payment, deployment, or PR has been created.
- Isolated planning worktree was clean at creation and based on `3a735da`. `npm ci` could not complete because Windows reported `EPERM` while unlinking the checkout's `lightningcss` native binary. Therefore no fresh baseline test is claimed for this planning task. Investigate a clean dependency setup before an implementation agent uses test results as evidence.
- Historical audit and application-test observations below are retained as history only. Rerun relevant checks on the actual implementation branch and never expose a development test server publicly.

For future application work, use actual npm scripts in `package.json`: `npm ci`, `npm run db:generate`, lint, typecheck, unit tests, E2E, and build as appropriate. Read `.github/workflows/` afresh to determine all expected jobs; do not assume this five-job inventory is permanent.

## 6. Open work and decisions

See [the approved commerce design](superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md), [technical debt](TECHNICAL_DEBT.md), [ADR 0002](decisions/0002-auth-modal-and-password-recovery.md), [auth plan](superpowers/plans/2026-09-02-auth-modal-password-reset.md), and [stabilization priorities](superpowers/plans/2026-09-02-mvp-stabilization-repair-priorities.md).

1. **Before public password recovery (TD-06):** implement/verify abuse protection, throttling, and timing-resistant handling. Generic response bodies alone are insufficient.
2. **Integration verification (TD-07):** apply the reset-token migration to an approved isolated/staging database; verify real SMTP delivery, replacement/expiry/consumption, reset-to-sign-in, and Google OAuth after configuration. Docker was unavailable during the previous feature review; recheck availability instead of assuming it remains unavailable.
3. **Session policy (TD-08):** password changes currently do not revoke issued JWT sessions. Ask the user to settle the required policy before implementation.
4. **Dependency remediation (TD-09):** the 2026-09-03 production audit recorded one high and one moderate finding via Prisma/mysql2. PostgreSQL usage does not make that audit clean. Rerun the audit when tackling this task; do not apply a blind major downgrade. No new mail-adapter finding was recorded in that review.
5. **Release gates (TD-04/TD-05):** CSP, deployed WAF verification, staging/production validation, migration/backup/restore/smoke verification, and final Critical/High review remain open. The user is still developing features; do not deploy without explicit approval.
6. **Maintenance (TD-01):** tracked Next.js middleware-to-proxy deprecation.
7. **Commerce activation:** Midtrans/Dynamic QRIS remains deferred until Milestone 8 entry gates. The owner currently has no NPWP/merchant readiness; do not ask for, store, or use live payment credentials. Phase 1 uses no real payment.

Secrets must be configured privately, never written in this document or PR logs. Previously shared SMTP credentials need rotation before live use; do not recover or repeat them from chat. Google OAuth client credentials are pending. Confirm the environment and authority before sending live emails or applying migrations.

Documentation nuance: ROADMAP keeps aggregate UI/final-readiness review open, while PLAN and CHANGELOG record completed checks for the merged feature diff. Those are different scopes; do not mark the whole sprint or MVP complete on the strength of PR #14 alone.

## 7. Resume here

1. Verify live Git/worktree/PR/CI state and reconcile this snapshot before any change. Do not edit `main`, delete unrelated worktrees, or rely on the historical profile/auth results as fresh evidence.
2. Review the approved commerce design and Sprint 17 section in `PLAN.md`. Ask Abangku to review the committed design document; after written-spec approval, create a detailed task-by-task implementation plan before code.
3. Before implementation, resolve the `npm ci` file-lock blocker in a clean isolated workspace and establish fresh test evidence. If it recurs, report it rather than proceeding with unverified baseline assumptions.
4. Start only the approved Sprint 17 scope on a dedicated worktree. Preserve public landing/auth UI exactly. Implement one workstream at a time with TDD and server-side authorization; use non-production fixtures only for sandbox payment.
5. Publish only after local review/verification. Use `gh` for PR and CI evidence; Abangku owns review and merge. After a confirmed merge, fast-forward main and perform only explicitly authorized, verified local cleanup.
