# Netloka — Agent Handoff

Last updated: **2026-09-04 15:25 WITA**. This is a development snapshot, not a live status feed. Follow [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not require the previous chat to understand this file.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**, not a networking-only product. Networking is the first implemented learning domain.
- Product journey: **Learn → Interact → Practice → Challenge → Consultant Project**.
- Other navbar domains remain noninteractive **Soon** entries. Keep established English product terms; do not implement future domains without approved scope.
- [ROADMAP.md](../ROADMAP.md) records Milestones 0–6 complete. **Milestone 7 is active**.
- Current task: **Account Security, 2FA (TOTP), Google Account Connection, Account Modal Expansion, and B/W Theming**.
- Status: Fully implemented, validated with 48 test files (232 tests passing), lint and typecheck clean, dev server verified. Creating PR for review and merge by Abangku.

## 2. Git and delivery checkpoint

Verified on 2026-09-04:

| Item | Last verified state |
| --- | --- |
| Repository | [notyourkise/NetLoka](https://github.com/notyourkise/NetLoka) |
| Main checkout | `C:/laragon/www/netloka`, branch `main` |
| Main / origin/main | `e8ef1a4980a373b43db0425785086d670d8a56d9` |
| Last merged PR | [#18 — Member Workspace and Course Commerce Foundation](https://github.com/notyourkise/NetLoka/pull/18) |
| Current task branch | `codex/account-security-2fa-and-theme` |
| Current task PR | Preparing PR creation via `gh pr create` |

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

#### Sprint 17 Implementation Evidence

- Tasks 1–9 implemented in full on `codex/course-commerce-plan` based on `3a735da`.
- `npm run lint` passed (0 errors, 0 warnings).
- `npm run typecheck` passed (0 errors).
- `npm test` passed: 46 test files, 218 tests passing.
- `npm run test:e2e -- --project=chromium` passed: 37 tests passing across legacy critical paths and new member-workspace routes.
- `npm run build` passed: 31 static and dynamic routes successfully compiled and optimized.
- Public landing page (`src/app/page.tsx`), marketing components, and auth modals strictly preserved without modification.
- Seven future premium tracks marked passive `Coming soon` / `Price announced at launch` with zero checkout affordances.
- Sandbox payment lifecycle isolated with fail-closed production protection (`getCommerceEnvironment`).

## 6. Open work and decisions

See [the approved commerce design](superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md), [technical debt](TECHNICAL_DEBT.md), [ADR 0002](decisions/0002-auth-modal-and-password-recovery.md), [ADR 0004](decisions/0004-member-workspace-course-commerce.md), and [stabilization priorities](superpowers/plans/2026-09-02-mvp-stabilization-repair-priorities.md).

1. **Sprint 17 PR Review & Merge:** Abangku performs final review and merge on GitHub.
2. **Commerce activation (Milestone 8 entry gates):** Midtrans/Dynamic QRIS remains deferred until Milestone 8 entry gates. The owner currently has no NPWP/merchant readiness; do not ask for, store, or use live payment credentials. Phase 1 uses no real payment.
3. **Before public password recovery (TD-06):** implement/verify abuse protection, throttling, and timing-resistant handling. Generic response bodies alone are insufficient.
4. **Integration verification (TD-07):** apply the reset-token migration to an approved isolated/staging database; verify real SMTP delivery, replacement/expiry/consumption, reset-to-sign-in, and Google OAuth after configuration.
5. **Session policy (TD-08):** password changes currently do not revoke issued JWT sessions. Ask the user to settle the required policy before implementation.
6. **Dependency remediation (TD-09):** rerun production audit when tackling this task.
7. **Release gates (TD-04/TD-05):** staging/production validation and final Critical/High review before production launch.

## 7. Resume here

1. PR created on branch `codex/course-commerce-plan` targeting `main`.
2. Monitor GitHub Actions CI jobs until all checks are green.
3. Abangku performs final review and merge of the PR.
4. After merge confirmation: fast-forward `main` (`git pull --ff-only origin main`) and safely remove task worktree/branch.
