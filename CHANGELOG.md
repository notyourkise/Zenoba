# Netloka Changelog

All notable project changes are recorded here.

## Logging Rules

- Timezone: **WITA / GMT+8**
- Timestamp format: `YYYY-MM-DD HH:mm WITA`
- Newest entries appear first within the current date.
- Log meaningful project changes, not every keystroke.
- Code changes should reference the sprint/task and commit/PR when available.
- Never rewrite historical entries to make the project appear cleaner; append corrections instead.

### Entry Categories

- `ADDED` — new feature, file, capability, content, test, or infrastructure
- `CHANGED` — intentional behavior/design/architecture change
- `FIXED` — bug or regression fix
- `REMOVED` — deleted behavior or obsolete code
- `SECURITY` — security hardening or vulnerability fix
- `DOCS` — planning/documentation changes
- `REFACTOR` — internal restructure without intentional user-visible behavior change
- `TEST` — meaningful testing additions/changes
- `DEPLOY` — deployment/environment/release changes
- `REVIEW` — milestone/sprint/code review findings and resolution
- `MILESTONE` — milestone status transition
- `SPRINT` — sprint status transition

### Recommended Entry Format

```text
- [YYYY-MM-DD HH:mm WITA] [CATEGORY] [Milestone X / Sprint Y / Task Y.Z]
  Summary of the change.
  Files/areas: `path`, `path`
  Validation: tests/build/review performed
  Git: commit SHA and/or PR number when available
```

---

# 2026-08-25

- [2026-08-25 15:00 WITA] [SPRINT] [Milestone 1 / Sprint 2]
  Completed Sprint 2 — Learning Catalog & Progress Model.
  1. Extended Prisma data model with LearningPath, Module, Lesson, LessonPrerequisite, and UserLessonProgress (`prisma/schema.prisma`).
  2. Implemented pure deterministic prerequisite resolution engine and progress percentage calculator (`src/features/learning/prerequisites.ts`).
  3. Implemented persistent progress service (`startLessonProgress`, `completeLessonProgress`, `getUserProgressSummary`) and API endpoint (`/api/learning/progress`).
  4. Created typed learning catalog queries (`src/features/learning/queries.ts`) with deterministic status resolution.
  5. Built learning catalog UI (`/learn`), path detail view with module cards and prerequisite badges (`/learn/[pathSlug]`), and lesson runner view (`/learn/[pathSlug]/[moduleSlug]/[lessonSlug]`) with interactive action bar.
  6. Connected user progress statistics to Dashboard (`/dashboard`) displaying real-time metrics and active learning path progress.
  7. Seeded Network Foundations curriculum sample with modules, lessons, and prerequisite chains (`prisma/seed.ts`).
  8. Added 24 new unit and integration tests (total 40 tests across 8 suites in Vitest) and 2 new E2E tests (total 7 tests in Playwright).
  Files/areas: `prisma/schema.prisma`, `prisma/seed.ts`, `src/features/learning/`, `src/app/(app)/learn/`, `src/app/(app)/dashboard/`, `src/app/api/learning/`, `src/e2e/learning-catalog.spec.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test` (40/40 passed), `npm run build` (15 routes), and `npx playwright test` (7/7 passed).
  Git: `0ae2eb9`

- [2026-08-25 14:43 WITA] [SPRINT] [Milestone 1 / Sprint 1]
  Completed Sprint 1 — Authentication, User Model & Application Shell.
  1. Integrated NextAuth.js with Prisma adapter, JWT sessions, and deterministic PBKDF2 password hashing (`src/features/auth/password.ts`).
  2. Implemented registration API (`/api/auth/register`), sign-in page (`/sign-in`), sign-up page (`/sign-up`), and route protection middleware (`src/middleware.ts`).
  3. Built responsive and accessible Application Shell (`src/app/(app)/layout.tsx`, `src/components/navigation/app-header.tsx`) with routes for Dashboard, Learn, Labs, Challenges, Consultant, and Profile.
  4. Implemented secure User Profile API (`/api/user/profile`) and interactive client form (`src/features/profile/profile-form.tsx`) preventing unauthorized mutations.
  5. Added comprehensive unit, integration, and E2E test suites (16 unit/integration tests passing in Vitest, 5 browser E2E tests passing in Playwright).
  Files/areas: `src/features/auth/`, `src/features/profile/`, `src/components/navigation/`, `src/app/(app)/`, `src/app/(auth)/`, `src/app/api/`, `src/lib/auth.ts`, `src/middleware.ts`, `src/types/next-auth.d.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npx playwright test` all pass cleanly with 0 errors.
  Git: `53935bb`

---

# 2026-08-24

- [2026-08-24 20:04 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  Strengthened the staging edge-network repair after review: rendered Compose assertions now enforce the exact managed bridge, absence of external network/volume declarations, and project-scoped internal network and PostgreSQL volume names. The design spec, plan, and runbook now describe the dual-homed topology and correctly state that loopback publication—not the edge network—provides host Nginx access.
  Files/areas: `scripts/test-staging-env-path.sh`, `docs/superpowers/specs/2026-08-24-staging-deployment-design.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`, `docs/deployment/staging.md`
  Validation: controlled RED assertion demonstrated; real Compose config render without container runtime passed; ignored task report records commands and exits
  Git: pending

- [2026-08-24 19:54 WITA] [FIXED] [Milestone 0 / Sprint 0]
  Repaired the staging app edge topology by attaching only `app` to the managed `netloka_staging_edge` bridge network while preserving the internal-only database and migration network boundary.
  Files/areas: `compose.staging.yml`, `scripts/test-staging-env-path.sh`, `docs/deployment/staging.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused topology assertions demonstrated RED before the change; focused regression test passed with a real `docker compose config --profile maintenance --format json` render using a temporary external safe environment file and without starting containers
  Git: pending

- [2026-08-24 19:35 WITA] [FIXED] [Milestone 0 / Sprint 0]
  Moved staging environment validation after the fast-forward update and immediately before the first Compose operation; synchronized all staging-plan `env_file` examples and external temporary-file validation guidance; recorded a real local Compose config render with a safe external environment file.
  Files/areas: `scripts/deploy-staging.sh`, `scripts/test-staging-env-path.sh`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused ordering/path regression test and `docker compose ... config` render passed without starting a container or exposing environment values.
  Git: pending

- [2026-08-24 19:26 WITA] [DEPLOY] [Milestone 0 / Sprint 0]
  Required an explicit external `STAGING_ENV_FILE` for staging Compose operations, added a pre-Docker path/config validator, and made the deploy, backup, runbook, and deployment-plan commands preserve that explicit path.
  Files/areas: `compose.staging.yml`, `scripts/validate-staging-env.sh`, `scripts/deploy-staging.sh`, `scripts/backup-staging-postgres.sh`, `scripts/test-staging-env-path.sh`, `docs/deployment/staging.md`, `docs/superpowers/plans/2026-08-24-staging-deployment.md`
  Validation: focused red/green shell validation, Bash syntax checks, lint, type-check, and unit tests passed without Docker runtime access.
  Git: pending

- [2026-08-24 15:48 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  GitHub Actions validation passed for Prisma security-remediation pull request #2: lint/type-check, unit tests, Chromium browser E2E, production build, and quality gate.
  Validation: GitHub Actions run 32702942803 passed.
  Git: PR #2

- [2026-08-24 15:44 WITA] [SECURITY] [Milestone 0 / Sprint 0]
  Upgraded Prisma ORM to 7.9.1, migrated the PostgreSQL client to `@prisma/adapter-pg`, and pinned transitive `deepmerge-ts` to 8.0.2 through npm overrides. This removes the audited Prisma 6 CLI advisory path without changing the database schema.
  Files/areas: `package.json`, `prisma.config.ts`, `prisma/schema.prisma`, `src/lib/db/client.ts`, `scripts/verify-db.ts`, `.github/workflows/ci.yml`
  Validation: `npm audit --omit=dev` reports 0 vulnerabilities; Prisma validation/migration status, live `SELECT 1`, lint, typecheck, unit tests, three-browser E2E, and production build passed locally.
  Git: d05ca0b

- [2026-08-24 15:25 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  GitHub Actions validation passed for pull request #1: lint/type-check, unit tests, Chromium browser E2E, production build, and the aggregate quality gate.
  Remaining blockers to Sprint 0 completion are the reviewed Prisma security-remediation decision and the unconfigured Cloudflare/staging deployment tasks.
  Validation: GitHub Actions run 32701246112 passed.
  Git: PR #1

- [2026-08-24 15:20 WITA] [REVIEW] [Milestone 0 / Sprint 0]
  Re-audited the foundation before Sprint 1. Resolved the missing lockfile, absent Prisma migration history, unsafe default Docker port collision, placeholder health test, absent browser smoke coverage, and the Vitest/Playwright test-runner overlap.
  Remaining decision: `npm audit --omit=dev` reports a high advisory in Prisma CLI 6.19.3 through `deepmerge-ts`; the available automatic remediation requires a Prisma 7 major upgrade and is not applied without a reviewed migration decision.
  Validation: `npm ci`, Docker/Prisma migration validation, lint, typecheck, unit test, three-browser E2E, and production build executed; GitHub CI and deployment validation pending.
  Git: pending

- [2026-08-24 15:20 WITA] [FIXED] [Milestone 0 / Sprint 0 / Task 0.2]
  Bound the local PostgreSQL container to loopback-only host port `5433` to avoid interfering with the existing PostgreSQL service on `5432`, and committed the explicit empty Prisma baseline migration.
  Files/areas: `docker-compose.yml`, `.env.example`, `prisma/migrations/`
  Validation: container healthy; `prisma generate`, `prisma validate`, `prisma migrate deploy`, and `prisma migrate status` passed.
  Git: cd1491d

- [2026-08-24 15:20 WITA] [TEST] [Milestone 0 / Sprint 0 / Tasks 0.1, 0.3]
  Added a route-handler health contract test, landing-page and health-endpoint browser smoke tests, Playwright CI coverage, and a correct Vitest exclusion for browser specs.
  Files/areas: `src/app/api/health/health.test.ts`, `src/e2e/foundation.spec.ts`, `.github/workflows/ci.yml`, `vitest.config.ts`
  Validation: focused unit test, Chromium E2E, and the three-browser E2E suite passed.
  Git: 191f934, a547a11, 86e3a1f

- [2026-08-24 13:44 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.3]
  Completed Repository & Environment Bootstrap sprint with full verification suite passing.
  Created GitHub Actions CI workflow enforcing lint, typecheck, test, and build gates on all PRs.
  Documented local setup commands in README.md for contributor onboarding.
  Validation: All quality gates pass locally; CI configured for future automated runs.
  Git: `0317625`

- [2026-08-24 13:44 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.2]
  Completed PostgreSQL & environment validation tasks with all configuration files created.
  Created docker-compose.yml, Prisma schema, singleton DB client, and environment validation module.
  Note: Local DB connection verification pending until Docker Desktop is started separately.
  Validation: Database client imports correctly; environment validation fails gracefully on missing variables.
  Git: 0317625

- [2026-08-24 13:43 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Bootstrapped Next.js 16.x monorepo with TypeScript 5.x and Tailwind CSS 4.x.
  Installed Vitest framework for unit/integration testing with jsdom environment.
  Configured Playwright for browser E2E testing against Chromium, Firefox, and WebKit.
  Created HTTP health endpoint at `/api/health` returning deterministic `{status: "ok"}` response.
  Added corresponding unit test verifying health endpoint response contract.
  Validation: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` all pass successfully.
  Git: 0317625

- [2026-08-24 13:41 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Initialized npm dependency management with Node.js LTS v20 pinning (.nvmrc).
  Installed production dependencies: @prisma/client, zod, lucide-react, react-hook-form.
  Installed devDependencies: @playwright/test, vitest, playwright, eslint, tailwindcss plugins.
  Updated package.json scripts to include quality gate commands (lint, typecheck, test, test:e2e, build).
  Validation: `npm install` completes without errors; dependencies audited successfully.
  Git: 0317625

- [2026-08-24 13:40 WITA] [SPRINT] [Milestone 0 / Sprint 0 / Task 0.1]
  Scaffolds Next.js application structure with App Router conventions.
  Creates src/app directory layout with globals.css, root layout, and home page.
  Validates project folder structure matches AGENTS.md requirements for modular monolith architecture.
  Validation: Directory structure reviewed against PLAN.md repository layout specification.
  Git: 0317625

- [2026-08-24 13:21 WITA] [DOCS] [Project Planning]
  Established the initial Netloka implementation documentation set: `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`, and `AGENTS.md`.
  Scope includes the MVP learning platform, reusable lesson engine, Network Foundations, IPv4/subnetting, switching/routing/services, Labs, Challenges, IT Consultant Mode, and production readiness.
  Future CCTV, Fiber Optic, PABX/VoIP, MikroTik, Cisco, Linux/Server, and Network Security learning paths are explicitly retained as post-MVP directions.
  Domain baseline: `netloka.biz.id`.
  Validation: cross-document scope and milestone consistency review performed.
  Git: not yet committed.

- [2026-08-24 13:21 WITA] [MILESTONE] [Milestone 0]
  Milestone 0 — Project Foundation defined and ready to begin.
  Current active sprint: Sprint 0 — Repository & Environment Bootstrap.
  Git: not yet committed.

---

# Unreleased

Use this section only for changes already made in the working tree that do not yet have an exact completion timestamp. Before merge/release, convert them into timestamped WITA entries.

_Currently no unreleased changes. All Sprint 0 work has been migrated to timestamped entries above._


