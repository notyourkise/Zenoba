# Netloka — Agent Handoff

Last updated: **2026-09-03 12:26 WITA**. This is a development snapshot, not a live status feed. Follow [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not require the previous chat to understand this file.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**, not a networking-only product. Networking is the first implemented learning domain.
- Product journey: **Learn → Interact → Practice → Challenge → Consultant Project**.
- Other navbar domains remain noninteractive **Soon** entries. Keep established English product terms; do not implement future domains without approved scope.
- [ROADMAP.md](../ROADMAP.md) records Milestones 0–6 complete. **Milestone 7 is active**, Sprint 16 covers stabilization/feature refinement; Sprint 15 security/environment/deployment gates remain open.
- Current phase is **feature development**, not deployment. Staging and production have not been deployed/verified. Configuration files and CI builds are not evidence of a live deployment.
- Current approved task: improve agent workflow/context continuity in `AGENTS.md`, add this handoff, and record it in `CHANGELOG.md`. No application behavior change, deployment, or removal of old branches is included.

## 2. Git and delivery checkpoint

Verified on 2026-09-03:

| Item | Last verified state |
| --- | --- |
| Repository | [notyourkise/NetLoka](https://github.com/notyourkise/NetLoka) |
| Main checkout | `C:/laragon/www/netloka`, branch `main`, clean at task start |
| Main / origin/main | `33b7caa07fa2f930a0d9e259adbf1166836a252d` (local refs matched) |
| Last feature PR | [#14 — feat(auth): add landing-page modal, Google readiness, and password recovery](https://github.com/notyourkise/NetLoka/pull/14) |
| PR #14 state | `MERGED` into `main` by the user, 2026-09-03 12:06 WITA |
| PR #14 head | `48df6c2e42fa8a1eaabf517f9003481c2dbf5380` |
| PR #14 merge commit | `33b7caa07fa2f930a0d9e259adbf1166836a252d`; main was pulled after merge |
| Current docs branch | `codex/agent-workflow-handoff`, based on that main commit |
| Current docs worktree | `C:/laragon/www/netloka/.worktrees/codex-agent-workflow-handoff` |
| Current docs delivery | Locally verified documentation edits; no commit, push, or PR yet. Awaiting user direction on publication. |

Retained worktrees (not cleanup targets for this documentation task):

- `.worktrees/codex-auth-modal-password-reset` → branch `codex/auth-modal-password-reset`, last observed at `48df6c2`. PR merged, but the previous instruction only requested pulling main; cleanup remains unperformed. Recheck local changes and authorization before removing it.
- `.worktrees/codex-fix-m0-sprint-0` → branch `docs/staging-progress`, last observed at `8460136`. Unrelated work; do not delete or repurpose it.

Paths are local checkout hints, not portable requirements. Rediscover worktrees on another machine. After this docs PR eventually merges, do not resume this task merely because the snapshot still names its former branch.

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

### Current documentation task

- Baseline: clean main and clean newly created worktree; `git diff --check` passed before edits.
- Documentation verification passed: `git diff --check`, 10 local Markdown links, 39 source-path references, and exact preservation of the Next.js generated block. Independent read-only review found no material issues in the documentation change. Only `AGENTS.md`, `CHANGELOG.md`, and this file changed; main remains clean. This is local verification, not PR/CI readiness.
- Application source, migration, lockfile, and CI configuration changes are out of scope. Do not claim this docs branch has fresh CI before it is published and checked.
- Fresh local check on 2026-09-03: `npm ci`, `npm run db:generate`, and `npm test` succeeded; **35 suites / 160 tests passed** on unchanged application code at base `33b7caa` with uncommitted documentation edits. Safe placeholder database/auth values were used. The health test observed a database authentication failure and passed its degraded-health contract; this is not live integration success. Lint, typecheck, E2E, and build were not rerun for these documentation-only edits.
- Fresh full `npm audit --json` (including development dependencies) reports **7 findings: 4 moderate, 2 high, 1 critical**. The critical report concerns Vitest's exposed UI-server behavior; this task ran `vitest run`, not a public UI server. Other findings include Vite/tooling and Prisma/mysql2. This broader audit differs from the historical production-only audit below. No dependency or lockfile was changed; assess remediation in a separate approved task and do not expose development servers publicly.

For future application work, use actual npm scripts in `package.json`: `npm ci`, `npm run db:generate`, lint, typecheck, unit tests, E2E, and build as appropriate. Read `.github/workflows/` afresh to determine all expected jobs; do not assume this five-job inventory is permanent.

## 6. Open work and decisions

See [technical debt](TECHNICAL_DEBT.md), [ADR 0002](decisions/0002-auth-modal-and-password-recovery.md), [auth plan](superpowers/plans/2026-09-02-auth-modal-password-reset.md), and [stabilization priorities](superpowers/plans/2026-09-02-mvp-stabilization-repair-priorities.md).

1. **Before public password recovery (TD-06):** implement/verify abuse protection, throttling, and timing-resistant handling. Generic response bodies alone are insufficient.
2. **Integration verification (TD-07):** apply the reset-token migration to an approved isolated/staging database; verify real SMTP delivery, replacement/expiry/consumption, reset-to-sign-in, and Google OAuth after configuration. Docker was unavailable during the previous feature review; recheck availability instead of assuming it remains unavailable.
3. **Session policy (TD-08):** password changes currently do not revoke issued JWT sessions. Ask the user to settle the required policy before implementation.
4. **Dependency remediation (TD-09):** the 2026-09-03 production audit recorded one high and one moderate finding via Prisma/mysql2. PostgreSQL usage does not make that audit clean. Rerun the audit when tackling this task; do not apply a blind major downgrade. No new mail-adapter finding was recorded in that review.
5. **Release gates (TD-04/TD-05):** CSP, deployed WAF verification, staging/production validation, migration/backup/restore/smoke verification, and final Critical/High review remain open. The user is still developing features; do not deploy without explicit approval.
6. **Maintenance (TD-01):** tracked Next.js middleware-to-proxy deprecation.

Secrets must be configured privately, never written in this document or PR logs. Previously shared SMTP credentials need rotation before live use; do not recover or repeat them from chat. Google OAuth client credentials are pending. Confirm the environment and authority before sending live emails or applying migrations.

Documentation nuance: ROADMAP keeps aggregate UI/final-readiness review open, while PLAN and CHANGELOG record completed checks for the merged feature diff. Those are different scopes; do not mark the whole sprint or MVP complete on the strength of PR #14 alone.

## 7. Resume here

1. Verify live Git/worktree state; do not edit `main` or reopen already merged feature implementation.
2. The current documentation task is locally implemented and reviewed; do not recreate it. Preserve application code and existing worktrees. Recheck the diff for any edits made after this snapshot.
3. Await the user's direction on publishing this documentation change. Once authorized, commit/push/create a focused documentation PR and record its actual delivery state; this task has not yet been published.
4. Once published, verify every expected CI job for the current head and hand the PR to Abangku. Final review/merge belongs to the user.
5. After the user merges and authorizes synchronization/cleanup, verify the merge, fast-forward main, and remove only verified safe task branches/worktrees according to AGENTS.md. Update this snapshot through the documented handoff process.
6. Before taking the next feature/security task, ask which priority Abangku wants if none has been selected; do not treat this open-work list as automatic authorization.
