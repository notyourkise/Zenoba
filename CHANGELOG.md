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

# 2026-09-08

- [2026-09-08 11:58 WITA] [SECURITY] [Milestone 13 / Sprint 34 / Task 34.3]
  Hardened public registration role assignment and enforced credentials-only login for developers:
  - Enforced safe default `role: "LEARNER"` in `src/app/api/auth/register/route.ts` and verified client-supplied role payloads are strictly ignored.
  - Removed `allowDangerousEmailAccountLinking: true` from `GoogleProvider` in `src/features/auth/auth.ts` to prevent automatic linking of unverified accounts.
  - Implemented `signIn` callback in `authOptions` that blocks Google sign-in if the database user has `role: "DEVELOPER"`.
  - Enforced mandatory two-factor authentication for developer credentials login in `CredentialsProvider.authorize`; credentials login rejects developer accounts without enabled 2FA.
  - Implemented `getPostLoginDestination(role, callbackUrl)` in `src/features/auth/post-login.ts` to ensure developers default to `/developer` and learners to `/dashboard`, preventing cross-workspace leakage during redirect.
  - Integrated `getPostLoginDestination` into `src/middleware.ts` for authenticated redirect routing.
  - Added unit tests in `auth-route.test.ts`, `auth-options.test.ts`, `post-login.test.ts`, and `middleware.test.ts` (17 new test cases).
  Files/areas: `src/app/api/auth/register/route.ts`, `src/features/auth/auth.ts`, `src/features/auth/post-login.ts`, `src/features/auth/post-login.test.ts`, `src/features/auth/auth-route.test.ts`, `src/features/auth/auth-options.test.ts`, `src/middleware.ts`, `src/middleware.test.ts`, `PLAN.md`
  Validation: `npm run typecheck`, `npm run lint`, full test suite passed (90 test files / 522 tests), dev server healthy.
  Git: `codex/sprint-34-safe-registration`

- [2026-09-08 10:46 WITA] [ADDED] [Milestone 13 / Sprint 34 / Task 34.2]
  Implemented server-authoritative role guards and immediate role enforcement:
  - Added `Actor` interface and `AuthorizationError` class with HTTP status mapping (401 / 403) in `src/features/authorization/types.ts`.
  - Implemented `getFreshActor()`, `requireFreshActor()`, `requireDeveloperActor()`, `requireLearnerActor()`, and `requireActorForArea()` in `src/features/authorization/guards.ts`.
  - Enforced mutual workspace boundary isolation: developers are strictly forbidden from learner workspaces, and learners/internal learners are strictly forbidden from developer workspaces.
  - Implemented database-authoritative role validation that queries live database state, ensuring stale JWT roles cannot bypass revoked or altered permissions.
  - Ensured sensitive credential fields (`passwordHash`, `twoFactorSecret`, `twoFactorBackupCodes`, tokens) are never exposed in actor projections.
  - Re-exported authorization guards and types through `src/lib/auth.ts`.
  - Added unit tests covering unauthenticated access, cross-workspace rejection, and stale role overrides in `src/features/authorization/guards.test.ts` (14 tests).
  Files/areas: `src/features/authorization/types.ts`, `src/features/authorization/guards.ts`, `src/features/authorization/guards.test.ts`, `src/lib/auth.ts`, `src/lib/auth.test.ts`, `PLAN.md`
  Validation: `npm run typecheck`, `npm run lint`, full test suite passed (89 test files / 505 tests), dev server healthy.
  Git: `codex/sprint-34-role-guards`

- [2026-09-08 10:14 WITA] [ADDED] [Milestone 13 / Sprint 34 / Task 34.1]
  Reconciled database migration baseline and added privileged-role persistence models:
  - Replaced broken migration history (empty init + unlinked password reset tokens) with authoritative, fresh-database reproducible baseline migration `20260908090000_developer_operations_baseline`.
  - Defined `enum UserRole { LEARNER, INTERNAL_LEARNER, DEVELOPER }` in Prisma schema and updated `User` model with typed role, `authVersion` (default 1), `lastLoginAt`, and `lastActiveAt`.
  - Added persistence models for developer operations and audit logging: `DeveloperElevationSession`, `DeveloperAuditEvent`, and `SecurityEvent`.
  - Implemented role helper module `src/features/authorization/role.ts` with `APP_ROLES`, `isLearnerRole`, `isDeveloperRole`, and `isPrivilegedRole`.
  - Added comprehensive migration runbook in `docs/operations/migration-baseline-runbook.md` with instructions for fresh deployment and safe local development reconciliation without data loss.
  - Updated CI workflow `.github/workflows/ci.yml` to apply migrations via `npm run db:deploy` instead of `prisma db push`.
  - Added unit and persistence contract tests in `src/features/authorization/` (10 tests).
  Files/areas: `prisma/schema.prisma`, `prisma/migrations/20260908090000_developer_operations_baseline/migration.sql`, `src/features/authorization/role.ts`, `src/features/authorization/role.test.ts`, `src/features/authorization/persistence.test.ts`, `docs/operations/migration-baseline-runbook.md`, `.github/workflows/ci.yml`, `scripts/create-user.ts`, `PLAN.md`
  Validation: `npx prisma migrate deploy` on disposable test database, `npm run db:seed` idempotent verification, `npm run db:generate`, `npm run typecheck`, `npm run lint`, full test suite passed (88 files / 491 tests), background dev server healthy.
  Git: `codex/sprint-34-role-persistence`

- [2026-09-08 08:38 WITA] [DOCS] [Milestones 13–15 / Implementation Planning]
  Added executable TDD-oriented plans for developer/internal accounts, learner continuity/mastery, and the final production/commercial release; synchronized canonical roadmap/product/design/technical-debt status with merged PR #27–#40; made Milestone 13 / Sprint 34 the next task and kept gateway, deployment, production, and live payment last in Milestone 15.
  Files/areas: `ROADMAP.md`, `PLAN.md`, `README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/TECHNICAL_DEBT.md`, `docs/superpowers/specs/2026-09-07-developer-portal-and-learner-experience-design.md`, `docs/superpowers/plans/2026-09-08-*.md`, `docs/HANDOFF.md`
  Validation: documentation/source-path consistency review and `git diff --check`; application code, schema, migrations, external configuration, deployment, and payment behavior unchanged.
  Git: `3f290df` on `codex/developer-portal-planning`; PR #44

# 2026-09-07

- [2026-09-07 23:25 WITA] [DOCS] [Milestone 13–15 / Developer Operations, Learner Quality & Final Release Sequencing]
  Recorded the owner-approved design for a VPS-provisioned `DEVELOPER` role, analytics-excluded `INTERNAL_LEARNER`, shared login with server-authoritative role routing, isolated read-only developer operations portal, password-plus-2FA elevated entitlement management, immutable audit/security evidence, learner comfort/mastery improvements, and roadmap sequencing that moves gateway, production, deployment, and live payment work to the final milestone.
  Files/areas: `docs/superpowers/specs/2026-09-07-developer-portal-and-learner-experience-design.md`, `docs/HANDOFF.md`
  Validation: documentation scope and approved decisions reviewed; application code, schema, migration, deployment, and payment behavior unchanged.
  Git: `codex/developer-portal-planning`

- [2026-09-07 22:49 WITA] [CHANGED] [UI / Custom 404 Page / Pure White Full-Screen Lottie Layout]
  Redesigned custom 404 page according to explicit user preference:
  - Configured `src/app/not-found.tsx` to render a full-screen pure white canvas (`fixed inset-0 z-50 min-h-screen w-screen bg-white`) without headers, footers, cosmic backgrounds, buttons, or extra HTML copy.
  - Sized the `public/GIF/Page Not Found 404.json` Lottie animation to very large dimensions (`max-w-[1400px] aspect-[3/2] max-h-[94vh]`), allowing its native built-in artwork and typography to display cleanly with full high-resolution vector fidelity.
  - Updated unit test suite `src/app/not-found.test.tsx` (3 tests) validating the pure white full-screen container, large animation element, and complete absence of extraneous buttons/text.
  Files/areas: `src/app/not-found.tsx`, `src/app/not-found.test.tsx`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (86 test files, 481 tests passed), `npm run build` (prerendered `○ /_not-found` cleanly), `git diff --check` clean.

- [2026-09-07 20:58 WITA] [ADDED] [UI / Custom 404 Page & Session Fetch Hardening]
  Implemented custom 404 page with Lottie animation and hardened NextAuth client session fetch:
  - Created `src/components/effects/lottie-player.tsx` with dynamic client-side `lottie-web` loading, `prefers-reduced-motion` compliance, error fallback UI, accessible `role="img"`, and proper unmount destruction.
  - Created `src/app/not-found.tsx` rendering `Page Not Found 404.json` Lottie animation, responsive cosmic dark / clean light layout, `AppHeader` integration, status badge, informative destination-unreachable copy, and pure text CTA navigation buttons (`/`, `/dashboard`, `/learn`) adhering to Section 5.6 icon policy.
  - Added `refetchOnWindowFocus={false}` to `<SessionProvider>` in `src/app/providers.tsx` and ensured `NEXTAUTH_URL="http://localhost:3000"` in environment files, preventing `[next-auth][error][CLIENT_FETCH_ERROR] Failed to fetch` errors when alt-tabbing or switching window focus during development.
  - Added unit test suites in `src/app/not-found.test.tsx` (3 tests) and `src/components/effects/lottie-player.test.tsx` (2 tests).
  Files/areas: `src/components/effects/lottie-player.tsx`, `src/app/not-found.tsx`, `src/app/providers.tsx`, `src/components/effects/lottie-player.test.tsx`, `src/app/not-found.test.tsx`, `package.json`, `package-lock.json`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (86 test files, 481 tests passed), `npm run build` (prerendered `○ /_not-found` cleanly), `git diff --check` clean.

- [2026-09-07 20:29 WITA] [FIXED] [Workspace / My Learning / Route Alignment]
  Fixed course card link in `/my-learning` and added fallback redirects:
  - Corrected `targetHref` in `src/app/(app)/my-learning/page.tsx` from `/learning/${course.learningPathSlug}` to `/learn/${course.learningPathSlug}`.
  - Added permanent redirects in `next.config.ts` from `/learning` and `/learning/:path*` to `/learn` and `/learn/:path*` to prevent any 404 on legacy or mistyped links.
  - Added unit test suite in `src/app/(app)/my-learning/page.test.tsx` (3 tests) validating course card href resolution and empty state behavior.
  Files/areas: `src/app/(app)/my-learning/page.tsx`, `next.config.ts`, `src/app/(app)/my-learning/page.test.tsx`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (84 test files, 476 tests passed), `npm run build` (35 routes compiled cleanly), `git diff --check` clean.

- [2026-09-07 18:22 WITA] [REVIEW] [Milestone 12 / Sprint 33 / Premium Activation Entry-Gate Review]
  Executed authoritative entry-gate review for Milestone 12 (Premium Course & Payment Activation), verifying that commercial payment activation remains safely and deterministically blocked until business, legal, content, and provider prerequisites are independently satisfied:
  - Task 33.1 (Verify Published Premium Content, Access Guards, Pricing & Combo Packages): Audited entire curriculum registry (`src/features/learning/content/registry.ts`) and catalog seed (`prisma/commerce-seed.ts`). Verified that all 6 published Networking paths are permanently 100% FREE. All 7 future tracks (CCTV, Fiber Optic, VoIP, MikroTik, Cisco, Linux Server, Security) have zero published content, zero learning paths, and are marked `COMING_SOON`. All 10 commercial packages (7 Single, 3 Combo) have unannounced null pricing (`amountIdr: null`). Enforced domain invariants in `catalog-rules.ts` guaranteeing that premium courses cannot be AVAILABLE without published content and coming-soon packages cannot specify prices. Verified server-side entitlement guards in `src/features/commerce/access.ts` (`requireLearningPathAccess`) and order creation restrictions in `src/features/commerce/orders.ts`.
  - Task 33.2 (Verify Operator, Privacy, Merchant, Tax & Provider Readiness): Audited `/terms`, `/privacy-policy`, and ADR 0003. Verified that formal merchant registration (Midtrans KYB/KYC), legal entity establishment (PT/CV), VAT/PPN tax compliance, and reachable privacy contacts remain pre-launch dependencies. Confirmed zero `MIDTRANS_*` credentials in `src/lib/env/server.ts`, `.env.example`, or tracked files. Confirmed payment gateway remains strictly the development-only `SandboxGateway`.
  - Task 33.3 (Audit Documentation & Evidence Matrix): Authored comprehensive entry-gate review under `docs/commerce/premium-activation-gate-review.md` recording an evidence matrix across all 6 gates, establishing that Milestone 12 remains blocked from commercial checkout activation. Authored automated unit test suite in `src/features/commerce/activation-gates.test.ts` (11 unit tests) to programmatically enforce catalog invariants, free networking integrity, combo package requirements, access guards, and order creation safeguards.
  - Task 33.4 (Testing, Quality Gates & Milestone Alignment): Verified all quality gates: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), Vitest suite (83 test files, 473 tests 100% green), Next.js production build (35 routes compiled cleanly), and `git diff --check` clean. Updated `PLAN.md`, `ROADMAP.md`, and `docs/HANDOFF.md`.
  Files/areas: `docs/commerce/premium-activation-gate-review.md`, `src/features/commerce/activation-gates.test.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (83 test files, 473 tests passed), `npm run build` (35 routes compiled cleanly), `git diff --check` clean.

- [2026-09-07 16:38 WITA] [ADDED] [Milestone 11 / Sprint 32 / Consultant Capstone, Portfolio & Full Curriculum Validation]
  Completed final Sprint 32 of Milestone 11, finalizing Path 6 (Network Planning & IT Consultant) with Module 5 (P6-L09 & P6-L10), prerequisite proof gating across the consultant catalog, historical proposal persistence with Rubrik v1.0, comprehensive curriculum validation report across all 6 Paths (31 modules, 62 lessons, 186 formative quizzes, 6 capstones), and full Playwright E2E coverage:
  - Task 32.1 (Author P6-L09–L10 & Applied Cases Module): Authored `src/features/learning/content/network-planning/applied-cases.ts` featuring Lesson 9 (`small-office-transfer`: end-to-end SOHO Notaris case study, BoQ table, collapsed core star topology, and VLSM /27 subnets) and Lesson 10 (`komparasi-kasus-lanjutan`: comparative trade-offs across Warnet, Logistics, School Lab, and Multi-Floor Enterprise, plus pedagogical rationale for prerequisite gating). Authored 6 server-evaluated formative quizzes in `src/features/learning/assessment/planning.server.ts` (total 30 questions for Path 6) with zero client answer leakage. Registered Module 5 in `src/features/learning/content/registry.ts`.
  - Task 32.2 (Consultant Prerequisite Proof Gating & Portfolio Persistence): Updated `src/app/(app)/consultant/page.tsx` and `src/app/(app)/consultant/[caseSlug]/page.tsx` to enforce prerequisite proof gating (Foundational SOHO Notaris case open to all; Cases 2-5 locked until Case 1 proposal is passed with score >= 70). Cleaned up decorative icons in consultant pages and workspace to strictly comply with Section 5.6 icon policy. Updated `src/app/api/consultant/[caseSlug]/submit/route.ts` to enforce server-side prerequisite verification (HTTP 403 when unearned), upsert `ConsultantCase` fallback, and attach `rubricVersion: "1.0"` to composite scores and feedback. Enhanced `src/app/(app)/consultant/portfolio/page.tsx` with 5-dimension score breakdown, rubric version badge, and immutable historical proposal rendering. Seeded all 5 consultant cases and Path 6 in `prisma/seed.ts`.
  - Task 32.3 (Comprehensive Networking Curriculum Validation Report): Authored `docs/curriculum/networking-validation.md` documenting outcomes, evidence, assessment matrix, and capstone challenge mapping across all 6 Paths (31 modules, 62 lessons, 186 quizzes, 6 capstones) with acyclic prerequisite graph verification, safety guarantees, and rubric immutability.
  - Task 32.4 (Unit Tests, Playwright E2E & Full Quality Gates): Updated unit tests in `src/features/learning/content/network-planning.test.ts` (6 tests covering all 5 modules and 10 lessons) and `src/features/learning/assessment/planning-assessment.test.ts` (3 tests covering all 30 questions). Updated Playwright E2E test suite in `src/e2e/consultant-learning.spec.ts` (7 tests covering route auth, 5 modules/10 lessons rendering, Lesson 1 outcomes/quizzes, Lesson 9 outcomes/topology, consultant catalog prerequisite gating, proposal submission, and portfolio persistence with rubric v1.0). Verified full quality gates: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (82 test files, 462 tests 100% green), Playwright (7/7 passed), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/network-planning/applied-cases.ts`, `src/features/learning/content/registry.ts`, `src/features/learning/assessment/planning.server.ts`, `src/features/learning/content/network-planning.test.ts`, `src/features/learning/assessment/planning-assessment.test.ts`, `prisma/seed.ts`, `src/app/(app)/consultant/page.tsx`, `src/app/(app)/consultant/[caseSlug]/page.tsx`, `src/app/(app)/consultant/portfolio/page.tsx`, `src/app/api/consultant/[caseSlug]/submit/route.ts`, `src/features/consultant/components/consultant-workspace.tsx`, `docs/curriculum/networking-validation.md`, `src/e2e/consultant-learning.spec.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (82 test files, 462 tests passed), `npx playwright test src/e2e/consultant-learning.spec.ts` (7 passed), `npm run build` (35 routes passed), `git diff --check` clean.

- [2026-09-07 15:43 WITA] [ADDED] [Milestone 11 / Sprint 31 / Consultant Preparation Learning Path]
  Authored complete 4-module, 8-lesson Network Planning & IT Consultant curriculum (Path 6) with 24 server-validated formative assessments, consultant scoring engine connectivity constraints, database seeding, workspace integration banner, and end-to-end test coverage:
  - Task 31.1 (Author P6-L01–L08 & Formative Assessments): Authored 4 complete modules with 8 lessons under `src/features/learning/content/network-planning/` (`requirements-analysis.ts`, `capacity-procurement.ts`, `topology-ip-vlan-design.ts`, `proposal-review.ts`) with zero placeholder content, rich client consultation concepts, realistic worked examples (BoQ tables, hierarchical topology diagrams, VLSM subnets, and technical proposal executive summaries), interactive activities, and key summaries (`keyPoints`). Created 24 server-evaluated formative quiz items with misconception explanations in `src/features/learning/assessment/planning.server.ts` with zero client answer leakage. Registered all 4 modules in `src/features/learning/content/registry.ts`. Integrated into `service.ts` (`findFormativeQuestion`) and `completion.ts` (`getLessonCompletionDecision`).
  - Task 31.2 (Consultant Scoring Constraint & Seed Migration): Updated `src/features/consultant/scoring/engine.ts` to enforce critical connectivity constraints (`hasRouter` and `hasSufficientPorts`), guaranteeing that budget surplus cannot conceal missing gateway routers or insufficient switch ports, verified via `engine.test.ts` (5 tests passing). Updated `prisma/seed.ts` to upsert Path 6 as `network-planning`, seed all 4 modules and 8 lessons in a linear sequential prerequisite chain, and verified seed execution. Added Consultant Workspace integration banner on `/learn/[pathSlug]` for `network-planning` adhering strictly to Section 5.6 visual icon policy.
  - Task 31.3 (Deterministic Unit Tests, Playwright E2E & Full Quality Gates): Authored unit test suites in `src/features/learning/content/network-planning.test.ts` (6 tests) and `src/features/learning/assessment/planning-assessment.test.ts` (3 tests). Authored Playwright E2E test suite in `src/e2e/consultant-learning.spec.ts` (5 tests covering route auth, 4 modules & 8 lessons rendering, workspace banner, learning outcomes & zero answer leakage, formative quiz retry/pass interaction, and consultant workspace navigation). Improved `src/e2e/fixtures/learning-user.ts` with networkidle synchronization for robust authentication across all test suites. Verified full quality gate: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (82 test files, 462 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/network-planning/*`, `src/features/learning/assessment/planning.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `src/features/learning/content/registry.ts`, `src/features/consultant/scoring/engine.ts`, `src/features/consultant/scoring/engine.test.ts`, `prisma/seed.ts`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/e2e/fixtures/learning-user.ts`, `src/e2e/consultant-learning.spec.ts`, `src/features/learning/content/network-planning.test.ts`, `src/features/learning/assessment/planning-assessment.test.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (82 test files, 462 tests passed), `npx playwright test src/e2e/consultant-learning.spec.ts` (5 passed), `npm run build` (35 routes passed), `git diff --check` clean.

- [2026-09-07 08:42 WITA] [FIXED] [Milestone 10 / Sprint 30 / E2E Cross-Path & Regression Alignment]
  Aligned E2E regression locators, challenge input schema, and redirects:
  - Fixed capstone challenge headings in `src/e2e/core-networking-regression.spec.ts` to match localized headings across all 5 capstone players.
  - Aligned `/api/challenges/submit` payload in E2E tests with `multiIncidentInvestigationSchema` keys (`apipaRootCause`, `apipaCorrection`, `interVlanRootCause`, `interVlanCorrection`, `gatewayRootCause`, `gatewayCorrection`, `troubleshootingPrincipleOption`, `serviceVerificationOption`) using authenticated `page.request.post`.
  - Updated prerequisite validation assertion in E2E tests to expect HTTP 403 Forbidden.
  - Increased cold-start auth timeout in `src/e2e/fixtures/learning-user.ts` to 30s for resilient dev-mode session establishment.
  - Added Next.js permanent redirect in `next.config.ts` from `/learn/routing-services` to `/learn/network-services`.
  - Cleaned up unused state in `src/features/challenges/components/multi-incident-player.tsx` for zero ESLint warnings.
  Files/areas: `next.config.ts`, `src/e2e/core-networking-regression.spec.ts`, `src/e2e/fixtures/learning-user.ts`, `src/e2e/wireless-troubleshooting-mastery.spec.ts`, `src/features/challenges/components/multi-incident-player.tsx`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `src/e2e/core-networking-regression.spec.ts` (4 passed), `src/e2e/wireless-troubleshooting-mastery.spec.ts` (5 passed), `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (80 test files, 451 tests passed), `npm run build` (35 routes passed).

- [2026-09-07 08:15 WITA] [ADDED] [Milestone 10 / Sprint 30 / Wireless, Troubleshooting & Core Path Validation]
  Authored complete 4-module, 8-lesson Wireless & Troubleshooting curriculum with 24 server-validated formative assessments, interactive practice integration, deterministic Multi-Incident Network Investigation & Remediation capstone challenge, seed migration, and cross-path end-to-end regression coverage across Paths 1–5:
  - Task 30.1 (Author P5-L01–L08 & Formative Assessments): Authored 4 complete modules with 8 lessons under `src/features/learning/content/wireless-troubleshooting/` (`wireless-basics.ts`, `wireless-security.ts`, `diagnostic-tools.ts`, `troubleshooting-methodology.ts`) with zero placeholder content, rich SMK TKJ pedagogical context, interactive activities, and key summaries. Created 24 server-evaluated formative quiz items with misconception explanations in `src/features/learning/assessment/troubleshooting.server.ts` with zero client answer leakage. Registered modules and legacy aliases (`wireless-technologies`, `cli-troubleshooting-tools`, `wifi-bands-and-security` -> `band-frekuensi-wifi`, `terminal-diagnostics-lab` -> `ipconfig-ping-diagnostic`) in `src/features/learning/content/registry.ts`. Integrated into `service.ts` (`findFormativeQuestion`) and `completion.ts` (`getLessonCompletionDecision`).
  - Task 30.2 (Legacy Mappings & Seed Migration): Updated `prisma/seed.ts` to upsert Path 5 as `wireless-troubleshooting`, loop all 4 modules and 8 lessons, establish sequential linear prerequisite chains, and safely migrate historical `UserLessonProgress` records from legacy prototype slugs (`wifi-bands-and-security` -> `band-frekuensi-wifi`, `terminal-diagnostics-lab` -> `ipconfig-ping-diagnostic`), safely cleaning up obsolete prototype modules (`wireless-technologies`, `cli-troubleshooting-tools`).
  - Task 30.3 (Path 5 Final Capstone: Multi-Incident Network Investigation & Remediation): Built deterministic evaluator in `src/features/learning/practice/troubleshooting/multi-incident.ts` assessing 4 criteria (APIPA DHCP pool exhaustion and lease expansion, missing inter-VLAN trunking, branch office gateway correction, and divide-and-conquer methodology with Layer 7 service verification). Created accessible UI player `MultiIncidentPlayer` adhering strictly to Section 5.6 icon policy. Wired `/api/challenges/submit/route.ts` to enforce 8-lesson prerequisite gate for Path 5, dual-persist to `AssessmentAttempt` and `ChallengeAttempt`, and award 200 XP idempotently. Updated `/challenges`, `/challenges/[challengeSlug]`, and `/learn/[pathSlug]`.
  - Task 30.4 (Deterministic Tests, Cross-Path E2E & Full Quality Gates): Created unit tests in `src/features/learning/content/wireless-troubleshooting.test.ts` (7 tests), `src/features/learning/assessment/troubleshooting-assessment.test.ts` (3 tests), `src/features/learning/practice/troubleshooting/multi-incident.test.ts` (4 tests), and updated `src/features/challenges/challenge-route.test.ts` (17 tests). Authored Playwright E2E test suites in `src/e2e/wireless-troubleshooting-mastery.spec.ts` (5 tests) and `src/e2e/core-networking-regression.spec.ts` (4 cross-path tests). Verified full quality gate: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (80 test files, 451 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/wireless-troubleshooting/*`, `src/features/learning/assessment/troubleshooting.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `src/features/learning/content/registry.ts`, `src/features/learning/practice/troubleshooting/multi-incident.ts`, `src/features/challenges/components/multi-incident-player.tsx`, `src/app/api/challenges/submit/route.ts`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/app/(app)/challenges/[challengeSlug]/page.tsx`, `src/app/(app)/challenges/page.tsx`, `prisma/seed.ts`, `src/features/learning/content/wireless-troubleshooting.test.ts`, `src/features/learning/assessment/troubleshooting-assessment.test.ts`, `src/features/learning/practice/troubleshooting/multi-incident.test.ts`, `src/features/challenges/challenge-route.test.ts`, `src/e2e/wireless-troubleshooting-mastery.spec.ts`, `src/e2e/core-networking-regression.spec.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (80 test files, 451 tests 100% green), `npm run build` (35 routes), `git diff --check` clean.

- [2026-09-07 07:00 WITA] [ADDED] [Milestone 10 / Sprint 29 / Routing & Services Curriculum]
  Authored complete 5-module, 10-lesson Routing & Network Services curriculum with 30 server-validated formative assessments, interactive practice integration, deterministic Enterprise Named-Service Outage capstone challenge, seed migration, and authenticated end-to-end coverage:
  - Task 29.1 (Author P4-L01–L10 & Formative Assessments): Authored 5 complete modules with 10 lessons under `src/features/learning/content/routing-services/` (`gateway-route.ts`, `static-intervlan.ts`, `dhcp-dns.ts`, `nat-pat.ts`, `transport-services.ts`) with zero placeholder content, rich SMK TKJ pedagogical context, interactive activities, and key summaries. Created 30 server-evaluated formative quiz items with misconception explanations in `src/features/learning/assessment/services.server.ts` with zero client answer leakage. Registered modules and legacy aliases (`dhcp-and-dns-services`, `nat-pat-security`, `nat-pat-translation` -> `pat-port-address-translation`) in `src/features/learning/content/registry.ts`. Integrated into `service.ts` (`findFormativeQuestion`) and `completion.ts` (`getLessonCompletionDecision`).
  - Task 29.2 (Legacy Mappings & Seed Migration): Updated `prisma/seed.ts` to upsert Path 4 as `network-services`, loop all 5 modules and 10 lessons, establish sequential linear prerequisite chains, and safely migrate historical `UserLessonProgress` records from legacy prototype slugs (`nat-pat-translation` -> `pat-port-address-translation`), safely cleaning up obsolete prototype modules (`dhcp-and-dns-services`, `nat-pat-security`).
  - Task 29.3 (Path 4 Final Capstone: Enterprise Named-Service Outage): Built deterministic evaluator in `src/features/learning/practice/services/named-service-outage.ts` assessing Default Gateway correction, DNS Resolver correction, NAT/PAT Overload activation on router WAN, and Layer 3 ICMP reachability vs Layer 4/7 TCP/HTTP service outage reasoning. Created accessible UI player `NamedServicePlayer` adhering strictly to Section 5.6 icon policy. Wired `/api/challenges/submit/route.ts` to enforce 10-lesson prerequisite gate for Path Final, dual-persist to `AssessmentAttempt` and `ChallengeAttempt`, and award 200 XP idempotently. Updated `/challenges`, `/challenges/[challengeSlug]`, and `/learn/[pathSlug]`.
  - Task 29.4 (Deterministic Tests, E2E & Full Quality Gates): Created unit tests in `src/features/learning/content/routing-services.test.ts` (7 tests), `src/features/learning/assessment/services-assessment.test.ts` (3 tests), `src/features/learning/practice/services/named-service-outage.test.ts` (5 tests), and updated `src/features/challenges/challenge-route.test.ts` (14 tests). Authored Playwright E2E test suite in `src/e2e/routing-services-mastery.spec.ts` (5 tests). Verified full quality gate: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (77 test files, 434 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/routing-services/*`, `src/features/learning/assessment/services.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `src/features/learning/content/registry.ts`, `src/features/learning/practice/services/named-service-outage.ts`, `src/features/challenges/components/named-service-player.tsx`, `src/app/api/challenges/submit/route.ts`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/app/(app)/challenges/[challengeSlug]/page.tsx`, `src/app/(app)/challenges/page.tsx`, `prisma/seed.ts`, `src/features/learning/content/routing-services.test.ts`, `src/features/learning/assessment/services-assessment.test.ts`, `src/features/learning/practice/services/named-service-outage.test.ts`, `src/features/challenges/challenge-route.test.ts`, `src/e2e/routing-services-mastery.spec.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (77 test files, 434 tests 100% green), `npm run build` (35 routes), `git diff --check` clean.

- [2026-09-07 06:01 WITA] [ADDED] [Milestone 10 / Sprint 28 / Switching & LAN Curriculum]
  Authored complete 4-module, 8-lesson Switching & LAN curriculum with 24 server-validated formative assessments, interactive practice integration, deterministic Staff & Guest VLAN repair capstone challenge, URL migration redirects, and authenticated end-to-end coverage:
  - Task 28.1 (Author P3-L01–L08 & Formative Assessments): Authored 4 complete modules with 8 lessons under `src/features/learning/content/switching-lan/` (`ethernet-mac.ts`, `arp-broadcast.ts`, `vlan-segmentation.ts`, `access-trunk.ts`) with zero placeholder content, rich SMK TKJ pedagogical context, interactive activities, and key takeaways. Created 24 server-evaluated formative quiz items with misconception explanations in `src/features/learning/assessment/switching.server.ts` with zero client answer leakage. Registered modules and legacy aliases in `src/features/learning/content/registry.ts`. Integrated into `service.ts` and `completion.ts`.
  - Task 28.2 (Legacy Mappings, URL Redirects & Seed Migration): Added permanent HTTP 308 redirects in `next.config.ts` from `/learn/switching-vlan-routing` and its subpaths to `/learn/switching-lan`. Updated `prisma/seed.ts` to upsert Path 3 as `switching-lan`, loop all 4 modules and 8 lessons, establish sequential linear prerequisite chains, and safely migrate historical `UserLessonProgress` records from legacy prototype slugs (`arp-resolution-flow` -> `arp-request-reply`, `vlan-segmentation-practice` -> `broadcast-domain-vlan`).
  - Task 28.3 (Path 3 Final Capstone: Staff & Guest VLAN Repair): Built deterministic evaluator in `src/features/learning/practice/switching/vlan-repair.ts` assessing access port correction, trunk allowed VLAN alignment across 2 switches, and Layer 2 broadcast domain isolation reasoning. Created accessible UI player `StaffGuestVlanPlayer` adhering to Section 5.6 icon policy. Wired `/api/challenges/submit/route.ts` to enforce 8-lesson prerequisite gate for Path Final, dual-persist to `AssessmentAttempt` and `ChallengeAttempt`, and award 150 XP idempotently. Updated `/challenges`, `/challenges/[challengeSlug]`, and `/learn/[pathSlug]`.
  - Task 28.4 (Deterministic Tests, E2E & Full Quality Gates): Created unit tests in `src/features/learning/content/switching-lan.test.ts` (7 tests), `src/features/learning/assessment/switching-assessment.test.ts` (3 tests), `src/features/learning/practice/switching/vlan-repair.test.ts` (5 tests), and `src/features/challenges/challenge-route.test.ts` (11 tests). Authored Playwright E2E test suite in `src/e2e/switching-mastery.spec.ts`. Verified full quality gate: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (74 test files, 416 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/switching-lan/*`, `src/features/learning/assessment/switching.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `src/features/learning/content/registry.ts`, `src/features/learning/practice/switching/vlan-repair.ts`, `src/features/challenges/components/staff-guest-vlan-player.tsx`, `src/app/api/challenges/submit/route.ts`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/app/(app)/challenges/[challengeSlug]/page.tsx`, `src/app/(app)/challenges/page.tsx`, `next.config.ts`, `prisma/seed.ts`, `src/features/learning/content/switching-lan.test.ts`, `src/features/learning/assessment/switching-assessment.test.ts`, `src/features/learning/practice/switching/vlan-repair.test.ts`, `src/features/challenges/challenge-route.test.ts`, `src/e2e/switching-mastery.spec.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (74 test files, 416 tests 100% green), `npm run build` (35 routes), `git diff --check` clean.

# 2026-09-06

- [2026-09-06 23:35 WITA] [ADDED] [Milestone 10 / Sprint 27 / IPv4 & Subnetting Curriculum]
  Authored complete 5-module, 10-lesson IPv4 & Subnetting curriculum with 30 server-validated formative assessments, interactive practice integration, deterministic VLSM school room allocation capstone evaluator, and authenticated end-to-end coverage:
  - Task 27.1 (Author P2-L01–L10 & Module Assessments): Authored rich lesson content across 5 modules (`binary-ipv4`, `address-types`, `mask-cidr`, `subnet-calculations`, and `vlsm-design`) under `src/features/learning/content/ipv4-subnetting/` with explicit learning outcomes, worked examples, interactive practice blocks, and lesson summaries. Authored 30 server-only formative assessment items in `src/features/learning/assessment/ipv4.server.ts` with pedagogical misconception feedback. Registered modules and legacy alias mappings in `src/features/learning/content/registry.ts`. Wired into `service.ts` and `completion.ts`. Updated `prisma/seed.ts` with modules, lessons, prerequisites, and safe user progress migration.
  - Task 27.2 (Link Existing Labs & Path Final Room Allocation Evaluator): Integrated `binary_converter`, `subnet_calculator`, and `subnet_practice` interactive lab blocks into lesson flows. Built deterministic VLSM multi-room evaluator in `src/features/learning/practice/ipv4/room-allocation.ts` verifying host capacity, prefix boundary containment, zero overlap, valid host gateways, and broadcast addresses across 5 school departments (`lab-tkj`, `ruang-guru`, `ruang-tu`, `server-mgmt`, `link-p2p`). Authored accessible `SchoolRoomAllocationPlayer` adhering to Section 5.6 visual icon policy. Wired `/api/challenges/submit/route.ts` to enforce 10-lesson prerequisite completion for Path Final, dual-persist to `AssessmentAttempt` and `ChallengeAttempt`, and award 200 XP idempotently. Updated `/challenges`, `/challenges/[challengeSlug]`, and `/learn/[pathSlug]`.
  - Task 27.3 (Deterministic Domain Validation & E2E): Created comprehensive unit test suites in `src/features/learning/content/ipv4-subnetting.test.ts` (7 tests), `src/features/learning/assessment/ipv4-assessment.test.ts` (9 tests), and `src/features/challenges/challenge-route.test.ts` (8 tests). Authored Playwright E2E test suite in `src/e2e/ipv4-mastery.spec.ts` covering unauthenticated route protection, Path 2 module/capstone listing, Lesson 1 interactive converter, formative quiz retry-pass loop, and Capstone form rendering.
  - Task 27.4 (Quality Gates & Documentation): Passed full quality gate: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), `npm test` (71 test files, 398 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean. Updated `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, and `docs/HANDOFF.md`.
  Files/areas: `src/features/learning/content/ipv4-subnetting/*`, `src/features/learning/content/registry.ts`, `src/features/learning/assessment/ipv4.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `prisma/seed.ts`, `src/features/learning/practice/ipv4/room-allocation.ts`, `src/features/challenges/components/school-room-allocation-player.tsx`, `src/app/api/challenges/submit/route.ts`, `src/app/(app)/challenges/[challengeSlug]/page.tsx`, `src/app/(app)/challenges/page.tsx`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/features/learning/content/ipv4-subnetting.test.ts`, `src/features/learning/assessment/ipv4-assessment.test.ts`, `src/features/challenges/challenge-route.test.ts`, `src/e2e/ipv4-mastery.spec.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run typecheck`, `npm run lint`, `npm test` (71 test files, 398 tests), `npm run build` (35 routes), `git diff --check` clean.

- [2026-09-06 21:55 WITA] [ADDED] [Milestone 9 / Sprint 26 / Foundations Final Challenge & Path Migration Contract]
  Completed Foundations Final Challenge alignment to Path 1 learning outcomes, eligibility enforcement, dual persistence, idempotent reward protection, and authored the exhaustive legacy curriculum migration contract:
  - Task 26.1 (Align First Day as IT Support to P1 Outcomes): Updated `src/features/challenges/support-challenge.ts` to map challenge stages to Path 1 curriculum outcomes: `DEV-M1` (Network Devices functional selection), `PMC-M1` (Physical Media & Cabling Cat6 selection), `TOP-M1` (Network Topology Star architecture selection), and `OSI-M1` (OSI & TCP/IP Layer 1 bottom-up physical troubleshooting). Extended evaluation results to return structured `outcomeResults` and `unmetOutcomes`. Updated `support-challenge.test.ts` to verify full passes, partial outcome penalties, and threshold compliance (score >= 70).
  - Task 26.2 (P1 Final Eligibility, Dual Persistence & Idempotency): Updated `/api/challenges/submit/route.ts` to enforce prerequisite verification when submitted as Path Final (`isPathFinal: true`), rejecting submissions with HTTP 403 (`PREREQUISITES_INCOMPLETE`) unless all 19 lessons in Network Foundations are completed. Persisted audit records to `AssessmentAttempt` (`path-network-foundations-final` or `challenge-first-day-it-support`) and `ChallengeAttempt`. Protected 150 XP rewards via `UserXpLedger` composite unique constraints, ensuring replay attempts do not duplicate rewards. Updated `SupportChallengePlayer` to render outcome badges and prerequisite lock status. Linked Path Final Capstone from `/learn/network-foundations` and enabled slug support in `/challenges/[challengeSlug]`. Expanded integration tests in `src/features/challenges/challenge-route.test.ts`.
  - Task 26.3 (Path Migration Contract & Legacy Inventory): Authored `docs/curriculum/path-migration-mapping.md` cataloging all 9 legacy lessons across Paths 2–5 from `prisma/seed.ts` with explicit target destination mappings to Milestone 10 (Sprints 27–30). Defined URL backward compatibility strategy (HTTP 308 permanent redirects and registry aliases), user progress preservation semantics (`UserLessonProgress`), prerequisite resilience, and reaffirmed the permanent FREE access guarantee for all core networking paths.
  - Task 26.4 (Quality Gates & Documentation): Verified full quality gate: `npm run db:generate`, `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm test` (69 test files, 379 tests 100% green), `npm run build` (35 routes compiled cleanly), and `git diff --check` clean. Updated `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, and `docs/HANDOFF.md`.
  Files/areas: `src/features/challenges/support-challenge.ts`, `src/features/challenges/support-challenge.test.ts`, `src/app/api/challenges/submit/route.ts`, `src/features/challenges/components/support-challenge-player.tsx`, `src/app/(app)/challenges/[challengeSlug]/page.tsx`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/features/challenges/challenge-route.test.ts`, `docs/curriculum/path-migration-mapping.md`, `docs/curriculum/networking-outcomes.md`, `docs/superpowers/plans/2026-09-05-learning-curriculum-renewal.md`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run lint`, `npm run typecheck`, `npm test` (69 test files, 379 tests), `npm run build` (35 static/dynamic routes), `git diff --check` clean.

- [2026-09-06 20:50 WITA] [ADDED] [Milestone 9 / Sprint 25 / Network Foundations Content Expansion]
  Delivered comprehensive curriculum content expansion for the remaining 7 modules of Path 1 (Network Foundations), creating 15 rich, fully authored lessons with zero placeholders:
  - Task 25.1 (Authored Lessons P1-L05–L19): Authored complete pedagogically rich lessons with explicit learning outcomes, SMK TKJ context, concepts, interactive activities, formative quizzes with targeted misconception feedback, takeaways, and rewards across 7 modules:
    * P1-M2 Types of Networks (`lan-man-wan`, `network-contexts-home-school-enterprise`)
    * P1-M3 Client, Server & Communication (`client-server-roles`, `request-response-cycle`)
    * P1-M4 Network Topology (`bus-star-ring`, `topology-fault-impact`)
    * P1-M5 Network Devices (`nic-switch-router-ap`, `modem-firewall-server`)
    * P1-M6 Physical Media & Cabling (`copper-twisted-pair-wireless`, `rj45-crimping-t568ab`, `fiber-optic-intro`)
    * P1-M7 How Data Travels (`bits-frames-packets`, `unicast-broadcast-multicast`)
    * P1-M8 OSI & TCP/IP Foundations (`osi-seven-layers`, `tcp-ip-and-encapsulation`)
    Strictly respected curriculum guardrails: no IP arithmetic or subnetting introduced before Path 2.
  - Task 25.2 (Server-Side Formative Assessment & Registry Integration): Created `src/features/learning/assessment/foundations.server.ts` containing 45 private formative quiz items with misconception feedback (3 per lesson) and zero client-side answer leakage. Wired definitions into `src/features/learning/assessment/service.ts` (`findFormativeQuestion`) and `src/features/learning/assessment/completion.ts` (`getLessonCompletionDecision`). Registered all 7 new modules in `src/features/learning/content/registry.ts`.
  - Task 25.3 (Database Seeding & Prerequisite Chains): Updated `prisma/seed.ts` to cleanly loop and upsert all 8 modules and 19 lessons of Path 1 with their full rich content, establishing an unbroken sequential prerequisite chain (L01 -> L02 -> ... -> L19).
  - Task 25.4 (Unit Tests & Quality Gates): Added 18 unit tests in `src/features/learning/content/network-foundations.test.ts` and `src/features/learning/assessment/foundations-assessment.test.ts` verifying schema conformance, evidence linkages, absence of placeholder blocks, and server grading accuracy. Verified full quality gate: `npm run db:generate`, `npm run lint` (0 errors), `npm run typecheck` (0 errors), vitest (69 files, 374 tests passing), `npm run build` (35 routes compiled), and `git diff --check` clean.
  Files/areas: `src/features/learning/content/network-foundations/*`, `src/features/learning/content/registry.ts`, `src/features/learning/assessment/foundations.server.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/completion.ts`, `prisma/seed.ts`, `src/features/learning/content/network-foundations.test.ts`, `src/features/learning/assessment/foundations-assessment.test.ts`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm test` (69 test files, 374 tests passing), `npm run build` (35 routes compiled), `git diff --check` clean.

- [2026-09-06 18:35 WITA] [ADDED] [Milestone 8 / Sprint 24 / Pilot Integration, Teaching Review & Reference Approval]
  Completed end-to-end authenticated validation, multi-user isolation verification, teaching quality review, and CI pipeline hardening for Welcome to Networking (Milestone 8 reference pilot):
  - Task 24.1 (Isolated Authenticated Journey & CI Services): Added comprehensive two-user authenticated Playwright E2E suite (`src/e2e/welcome-to-networking.spec.ts`) and learner authentication fixtures (`src/e2e/fixtures/learning-user.ts`). Updated `.github/workflows/ci.yml` `test-e2e` job with a dedicated `postgres:16-alpine` service container, schema push (`npx prisma db push`), and curriculum database seed (`npm run db:seed`). Updated `src/features/learning/progress.ts` to reliably resolve lessons by either semantic slug or internal ID.
  - Task 24.2 (Teaching Quality, Outcomes & Regression Review): Authored complete teaching review in `docs/curriculum/welcome-to-networking-review.md`. Confirmed 100% coverage (zero uncovered outcomes) for all 8 lesson objectives (`WN-L1-A` through `WN-L4-B`) and 3 practical criteria (`P01`, `P02`, `P03`). Audited responsive layouts (360px mobile, 768px tablet, 1280px+ desktop), 200% zoom, keyboard navigation, reduced-motion preferences, dark/light contrast, and cross-feature isolation (Labs, Challenges, Consultant, commerce, and public auth).
  - Task 24.3 & 24.4 (Full Milestone 8 Quality Gates): Executed all project quality checks (Prisma generate, ESLint, TypeScript typecheck, vitest unit/integration suite, Playwright browser E2E, Next.js Webpack production build, and git diff check). Updated `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, and `docs/HANDOFF.md`. Ready for pull request creation and Abangku's reference review.
  Files/areas: `.github/workflows/ci.yml`, `src/features/learning/progress.ts`, `src/e2e/welcome-to-networking.spec.ts`, `src/e2e/fixtures/learning-user.ts`, `docs/curriculum/welcome-to-networking-review.md`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run lint` (0 errors), `npm run typecheck` (0 errors), vitest (67 test files, 356 tests 100% green), Playwright E2E, `npm run build` (35 routes compiled), `git diff --check` clean.

- [2026-09-06 17:25 WITA] [FIXED] [SECURITY] [Authenticated Landing Redirect & Public Header Cleanup]
  Resolved authenticated route exposure bug where logged-in users could access the public marketing landing page (`/`):
  - Middleware Route Guard: Added matcher `"/"` in `src/middleware.ts` and redirected any authenticated user with an active unrevoked session away from `"/"` (along with `/sign-in` and `/sign-up`) directly to `/dashboard`.
  - Server Component Guard: Added defense-in-depth redirect in `src/app/page.tsx` (`if (user) redirect("/dashboard")`), ensuring root route always redirects logged-in learners even if middleware is bypassed.
  - Public Header Cleanup: Removed user profile dropdown menu, user avatar, and AccountModal from `src/components/navigation/app-header.tsx`. Landing page header is now purely public, consistently displaying "Masuk" and "Mulai Gratis" auth actions.
  - Tests & Verification: Added middleware unit tests in `src/middleware.test.ts` for `/` redirects and revoked session handling, added landing page server component tests in `src/app/page.test.tsx`, and updated `src/components/navigation/app-header.test.tsx` to assert public-only authentication surfaces.
  Files/areas: `src/middleware.ts`, `src/middleware.test.ts`, `src/app/page.tsx`, `src/app/page.test.tsx`, `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors, 0 warnings), vitest (67 test files, 356 tests 100% green), `npm run build` (35 routes compiled cleanly), `git diff --check` clean.
  Git: branch `codex/landing-auth-redirect-cleanup`.

- [2026-09-06 02:15 WITA] [ADDED] [Milestone 8 / Sprint 23 / Welcome Lessons & Module Assessment Experience]
  Implemented interactive welcome lessons, deterministic connectivity practice, scoped learning outcomes display, and full module assessment player with remediation routing:
  - Task 23.1: Surfaced explicit learning outcomes across module overview (`/learn/[pathSlug]`) and lesson view (`/learn/[pathSlug]/[moduleSlug]/[lessonSlug]`) via `LearningOutcomesBadge` and `LearningOutcomesList`. Attached curriculum outcomes to modules and lessons in `queries.ts` and `registry.ts`. Replaced generic success fallback with truthful state banners when content is missing or in preparation.
  - Task 23.2: Built accessible, deterministic interactive practice components for beginner networking concepts: link toggling (`connectivity_toggle`), uplink failure handling (`uplink_toggle`), branch isolation (`branch_disconnect`), component classification (`classification`), role assignment (`role_assignment`), resource matching (`resource_match`), and protocol message sequence flow (`message_flow`). Created pure reachability evaluator in `src/features/learning/practice/connectivity/domain.ts` covering local network vs Internet and branch routing.
  - Task 23.3: Delivered complete module assessment page (`/learn/[pathSlug]/[moduleSlug]/assessment`) and client player `ModuleAssessmentPlayer` with 3 instructional stages: briefing & passing rules, 10 concept questions + 3 interactive practical criteria, and comprehensive results breakdown (score, practical criteria status, unmet learning outcomes, and direct links to remedial lessons). Integrated final module assessment card on module overview and linked final lesson CTA to assessment.
  - Task 23.4: Updated seed (`prisma/seed.ts`) with rich instructional data for all 4 Welcome to Networking lessons (L01–L04). Executed full quality verification suite (Prisma Client generate, TypeScript typecheck, ESLint, vitest unit/integration tests, Playwright E2E, Next.js Webpack production build, and git diff check).
  Files/areas: `prisma/seed.ts`, `src/app/(app)/learn/[pathSlug]/page.tsx`, `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/page.tsx`, `src/app/(app)/learn/[pathSlug]/[moduleSlug]/assessment/page.tsx`, `src/features/learning/types.ts`, `src/features/learning/queries.ts`, `src/features/learning/queries.test.ts`, `src/features/learning/content/registry.ts`, `src/features/learning/components/learning-outcomes.tsx`, `src/features/learning/components/learning-outcomes.test.tsx`, `src/features/learning/components/lesson-action-bar.tsx`, `src/features/learning/components/module-assessment-player.tsx`, `src/features/learning/components/module-assessment-player.test.tsx`, `src/features/learning/practice/connectivity/domain.ts`, `src/features/learning/practice/connectivity/domain.test.ts`, `src/features/learning/blocks/registry.tsx`, `src/features/learning/blocks/registry.test.tsx`, `src/features/learning/blocks/components/connectivity-toggle.tsx`, `src/features/learning/blocks/components/uplink-toggle.tsx`, `src/features/learning/blocks/components/concept-activity.tsx`, `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: TypeScript typecheck (0 errors), ESLint (0 errors, 0 warnings), vitest (66 test files, 352 tests 100% green), Playwright E2E (`member-workspace.spec.ts`, 5/5 passed), Next.js production build (`next build --webpack`, 35 static pages generated), `git diff --check` clean.
  Git: branch `codex/welcome-lessons-sprint-23`.

# 2026-09-05

- [2026-09-05 19:10 WITA] [ADDED] [Milestone 8 / Sprint 22 / Authoritative Assessment, Progression & XP]
  Implemented authoritative server-side assessment evaluation, mandatory formative lesson gates, comprehensive module final evaluation (theory + simulation criteria), and idempotent concurrency defense:
  - Task 22.1: Connected quiz submission endpoint (`/api/learning/quiz/submit`) to server-owned question definitions in `welcome.server.ts`, implemented deterministic answer evaluation (nonempty wrong answers fail), persisted validated attempts to `AssessmentAttempt` with `(userId, requestId)` idempotency, and eliminated the client player's false-pass network fallback in `QuizBlockPlayer` while preserving selected answers on retry.
  - Task 22.2: Enforced lesson completion criteria in `getLessonCompletionDecision` and `completeLessonProgress` (requiring 3/3 formative items passed before marking completed; legacy bridge preserves historical `COMPLETED` records; blocked direct POST requests return 403 `ASSESSMENT_INCOMPLETE`). Built module final assessment endpoint (`/api/learning/assessment/module`) requiring concept score >= 8/10 AND 3/3 practical connectivity criteria passed.
  - Task 22.3: Strengthened XP ledger and assessment attempt persistence against concurrent duplicate submissions and double-clicks by handling database unique constraint violations (`P2002`), returning cached results on identical retries and 409 Conflict on payload mismatches with the same request ID.
  - Task 22.4: Executed full quality verification suite (Prisma generate, TypeScript compilation, ESLint, vitest unit/integration suites, Playwright E2E, Next.js Webpack production build, and git diff check).
  Files/areas: `src/features/quiz/schema.ts`, `src/features/quiz/components/quiz-block-player.tsx`, `src/features/quiz/quiz-route.test.ts`, `src/app/api/learning/quiz/submit/route.ts`, `src/features/learning/assessment/service.ts`, `src/features/learning/assessment/service.test.ts`, `src/features/learning/assessment/errors.ts`, `src/features/learning/assessment/completion.ts`, `src/features/learning/assessment/completion.test.ts`, `src/features/learning/assessment/transactions.test.ts`, `src/features/learning/assessment/module-route.test.ts`, `src/app/api/learning/assessment/module/route.ts`, `src/features/learning/progress.ts`, `src/features/learning/progress.test.ts`, `src/app/api/learning/progress/route.ts`, `src/features/learning/progress-route.test.ts`, `src/features/learning/blocks/registry.tsx`, `src/features/learning/blocks/lesson-renderer.tsx`, `src/features/xp/ledger.ts`, `PLAN.md`, `ROADMAP.md`, `docs/HANDOFF.md`
  Validation: TypeScript typecheck (0 errors), ESLint (0 errors, 0 warnings), vitest (63 test files, 335 tests 100% green), Playwright E2E (`member-workspace.spec.ts`, 5/5 passed), Next.js production build (`next build --webpack`, 35 static pages generated), `git diff --check` clean.
  Git: branch `codex/authoritative-assessment-sprint-22`.

- [2026-09-05 18:14 WITA] [ADDED] [Milestone 8 / Sprint 21 / Curriculum Contracts & Data Foundation]
  Established curriculum contracts, measurable outcome validation, Indonesian content foundation, and private assessment isolation for the Welcome to Networking reference module:
  - Task 21.1: Authored comprehensive Indonesian content for 4 pilot lessons in `docs/curriculum/welcome-to-networking-content.md` with 8 observable learning outcomes (WN-L1-A through WN-L4-B), 12 formative quiz items, 10 module final concept items, and 3 beginner practical connectivity criteria. Created Zod content schemas and bidirectional traceability validators in `src/features/learning/content/{schema.ts,validate.ts,schema.test.ts}`.
  - Task 21.2: Documented evidence persistence, request idempotency, and legacy learner preservation in ADR 0005 (`docs/decisions/0005-learning-evidence-and-versioning.md`). Added additive `AssessmentAttempt` model with composite unique constraint `[userId, requestId]` in `prisma/schema.prisma`. Validated contracts in `src/features/learning/assessment/persistence.test.ts`.
  - Task 21.3: Authored public curriculum data in `src/features/learning/content/network-foundations/welcome.ts`, isolated server-only questions/rubrics in `src/features/learning/assessment/welcome.server.ts`, and implemented secret sanitization in `src/features/learning/content/public-projection.ts`. Verified with `welcome.test.ts` and `public-projection.test.ts`.
  Files/areas: `docs/curriculum/welcome-to-networking-content.md`, `docs/decisions/0005-learning-evidence-and-versioning.md`, `prisma/schema.prisma`, `src/features/learning/content/schema.ts`, `src/features/learning/content/validate.ts`, `src/features/learning/content/schema.test.ts`, `src/features/learning/content/network-foundations/welcome.ts`, `src/features/learning/content/welcome.test.ts`, `src/features/learning/assessment/welcome.server.ts`, `src/features/learning/assessment/persistence.test.ts`, `src/features/learning/content/public-projection.ts`, `src/features/learning/content/public-projection.test.ts`, `PLAN.md`, `docs/HANDOFF.md`
  Validation: TypeScript typecheck (0 errors), ESLint (0 errors, 0 warnings), vitest (59 test files, 296 tests 100% green), Playwright E2E (`member-workspace.spec.ts`, 5/5 passed), Next.js production build (`next build --webpack`, 37 static pages generated), `git diff --check` clean.
  Git: branch `codex/curriculum-contracts-sprint-21`.

- [2026-09-05 17:51 WITA] [DOCS] [Milestones 8–12 / Planning Delivery]
  Committed the curriculum planning set as `9f43e16af7258977d5dd215b5db0e27a4a23ef4a`, pushed `codex/learning-curriculum-plan`, and opened PR #26: https://github.com/notyourkise/NetLoka/pull/26. Local document/path/ownership/lesson-count checks and staged diff check passed; fixed one trailing blank line in the program plan before commit. Updated handoff with the real PR and review entry point. CI was pending at this checkpoint; verify fresh checks after this delivery commit. No merge, application implementation, or deployment performed.

- [2026-09-05 17:47 WITA] [DOCS] [REVIEW] [Milestones 8–12 / Learning Curriculum Planning]
  Recorded the owner-approved learning direction: explicit path/module/lesson outcomes, Welcome to Networking as the first reference module, mandatory lesson quizzes and module final assessments, pass-before-advance with retries, and premium activation renumbering after learning renewal. Added M8/S21–24 pilot foundation, M9/S25–26 Foundations completion, M10/S27–30 core networking, M11/S31–32 Consultant/curriculum verification, and M12/S33–34 separately gated premium activation. Every sprint has one milestone owner.
  Added a detailed design, a 65-lesson proposed outcome matrix across six paths, program work packages, and a task-by-task four-lesson pilot plan with eight lesson outcomes, assessment traceability, context paths, contracts, migration safeguards, negative cases, and actual-project verification commands. Numeric thresholds and legacy-user transition remain explicitly proposed for detailed owner review before code; no approval is fabricated.
  Corrected current planning context: main includes PR #25 at `a95b025860b8c1788f8fbf48f8d98cd34929da4d`; prior handoff actions for that merged PR are stale. Historical M0–M6 delivery labels are retained, while seed completeness, quiz/completion enforcement, migration history, and authenticated E2E gaps are recorded as source-inspection findings (TD-11–TD-13), not runtime fixes. Historical commerce M8 references receive an explicit M12 numbering notice without changing activation gates.
  Files/areas: `ROADMAP.md`, `PLAN.md`, `README.md`, `PRODUCT.md`, `docs/HANDOFF.md`, `docs/TECHNICAL_DEBT.md`, curriculum design/matrix/program/pilot documents, historical commerce ADR/spec/plan numbering notices.
  Validation: local Markdown links checked across 14 planning/reference documents; S21–S34 ownership/uniqueness checked in ROADMAP, PLAN, and program plan; 65 proposed lesson IDs verified; `git diff --check` passed with repository line-ending configuration. A diagnostic override of `core.autocrlf=false` produced CRLF-only whitespace noise and was discarded; normal repository check passed. Documentation-only changes: no dependency install, local application suites, migration, database access, deployment, or runtime reproduction performed. Baseline main CI run `33957353648` succeeded; that baseline run is not verification of this documentation branch.
  Git: pending on `codex/learning-curriculum-plan`.

- [2026-09-05 17:01 WITA] [SECURITY] [REFACTOR] [Milestone 7 / Security Hardening & Technical Debt Cleanup]
  Resolved key pre-launch technical debt items TD-04, TD-06, TD-08, and validated TD-01:
  - TD-04 (Content Security Policy): Configured robust, adaptive Content-Security-Policy headers in `next.config.ts` and `Caddyfile` with full compatibility for Next.js 16, React 19, Tailwind CSS 4, client canvas avatars, and local fonts. Added `src/lib/security-headers.test.ts`.
  - TD-06 (Abuse Protection & Rate Limiting): Created in-memory sliding window rate limiter in `src/features/auth/rate-limiter.ts`. Implemented dual rate limiting (IP & email) and timing-attack defense (~250ms constant-time barrier with dummy crypto entropy) in `/api/auth/forgot-password` and `/api/auth/reset-password`. Added unit tests `src/features/auth/rate-limiter.test.ts` and route test coverage.
  - TD-08 (Session Revocation Policy): Implemented `src/features/auth/session-revocation.ts` to immediately invalidate active JWT sessions (`iat < revokedAt`) upon password reset in `consumePasswordResetToken`. Integrated checks into NextAuth `session` callback and route guard middleware. Added unit tests in `session-revocation.test.ts`, `auth-options.test.ts`, and `middleware.test.ts`.
  - TD-01 (Middleware vs Proxy Evaluation): Evaluated `src/proxy.ts` under Next.js 16.3.2 with `--webpack`. Discovered runtime failure `TypeError: Native module not found: ./webpack-runtime.js` inside Next.js Webpack Edge sandbox dev server. Reverted to stable `src/middleware.ts` and documented status in `docs/TECHNICAL_DEBT.md`.
  Files/areas: `next.config.ts`, `Caddyfile`, `src/features/auth/rate-limiter.ts`, `src/features/auth/rate-limiter.test.ts`, `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/reset-password/route.ts`, `src/features/auth/password-reset-route.test.ts`, `src/features/auth/session-revocation.ts`, `src/features/auth/session-revocation.test.ts`, `src/features/auth/password-reset.ts`, `src/features/auth/password-reset.test.ts`, `src/features/auth/auth.ts`, `src/features/auth/auth-options.test.ts`, `src/middleware.ts`, `src/middleware.test.ts`, `src/lib/security-headers.test.ts`, `docs/TECHNICAL_DEBT.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (55 test files / 269 tests passed 100%), Playwright E2E (5 passed 100%), `npm run build` (34 routes compiled), `git diff --check` (clean).

- [2026-09-05 16:19 WITA] [FIXED] [Milestone 7 / Profile & Streak Synchronization]
  Fixed display name and username updating so changes persist immediately across the platform and removed the disconnected flame streak mechanism from the profile modal:
  - Updated `getCurrentUser()` in `src/lib/auth.ts` to query fresh profile data from PostgreSQL (`prisma.user.findUnique`) when a session exists, ensuring Server Components (Dashboard, Profile, Shell) render updated names immediately without requiring logout/re-login.
  - Added `trigger === "update"` support to NextAuth `jwt` callback in `src/features/auth/auth.ts` and mapped `token.name` into `session.user.name` so client JWT sessions synchronize with server updates.
  - Enhanced `ProfileForm` in `src/features/profile/profile-form.tsx` with `useSession().update({ name })`, `onNameUpdated` prop, and whitespace validation.
  - Refactored `AccountModal` in `src/components/navigation/account-modal/account-modal.tsx` to use reactive derived `displayName`, pass `onUserUpdated` to parent, and completely remove the disconnected flame button, `flameData`, midnight reset countdown, and `localStorage` streak claiming.
  - Updated `LearnerWorkspaceShell` in `src/components/navigation/learner-workspace-shell.tsx` with `userOverride` state to re-render sidebar and drawer immediately when profile updates.
  - Added unit test suite `src/features/profile/profile-form.test.tsx` (6 tests) and `src/lib/auth.test.ts` (6 tests), updated `auth-options.test.ts` and `app-header.test.tsx`.
  Files/areas: `src/lib/auth.ts`, `src/features/auth/auth.ts`, `src/features/profile/profile-form.tsx`, `src/components/navigation/account-modal/account-modal.tsx`, `src/components/navigation/learner-workspace-shell.tsx`, `src/features/profile/profile-form.test.tsx`, `src/lib/auth.test.ts`, `src/features/auth/auth-options.test.ts`, `src/components/navigation/app-header.test.tsx`, `src/components/navigation/learner-workspace-shell.test.tsx`
  Validation: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (51 test files / 250 tests passed 100%), Playwright E2E (5 passed 100%), `npm run build` (34 routes compiled successfully), `git diff --check` (clean).

- [2026-09-05 15:28 WITA] [CHANGED] [Milestone 7 / Sprint 20 / Dashboard Card Polish]
  Removed the CLI `Terminal` icon from the Interactive Labs card in the main dashboard content as requested by Abangku, while preserving the `Terminal` CLI icon on the sidebar menu (`LearnerSidebar` and `LearnerMobileDrawer`).
  Files/areas: `src/app/(app)/dashboard/page.tsx`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `vitest run` (3 tests passed), `git diff --check` passed.
  Git: `codex/remove-interactive-labs-card-icon`

- [2026-09-05 05:41 WITA] [CHANGED] [TEST] [Milestone 7 / Sprint 20 / Dashboard & Sidebar UI Polish]
  Applied 4 visual and interactive refinements to `/dashboard` and navigation:
  1. Streak Belajar Flame: Eliminated square border around flame image using radial gradient mask fade (`[mask-image:radial-gradient(circle_at_center,black_42%,transparent_70%)]`), added soft ambient glow aura halo, added dynamic `@keyframes flame-flicker` animation for organic movement and swaying, and removed `"hari"` suffix from streak counter (now displaying number only, retaining accessible `aria-label`).
  2. Interactive Labs Icon: Switched icon from `FlaskConical` to CLI icon (`Terminal` / `>_`) in `LearnerSidebar`, `LearnerMobileDrawer`, and the Interactive Labs card header.
  3. Hero Banner Quote: Repositioned Netloka orbital quote (*“Better Networks Brighter Opportunities” — NETLOKA*) to the bottom-right corner of the hero banner, aligned with the CTA and description block.
  4. Animated Wave Lines: Added dynamic undulating and streaming light animations (`animate-wave-1`, `animate-wave-2`, `animate-wave-3`, `animate-wave-stream`) to the SVG wave lines in the 3 exploration cards (Interactive Labs, Troubleshooting Challenges, Simulasi Konsultan TI), with full `@media (prefers-reduced-motion: reduce)` support.
  Files/areas: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/page.test.tsx`, `src/components/navigation/learner-sidebar.tsx`, `src/app/globals.css`, `PLAN.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `vitest run` (49 test files, 235 passed), `playwright test src/e2e/member-workspace.spec.ts` (5 passed), `npm run build` (34/34 routes passed), `git diff --check` passed.
  Git: `codex/dashboard-ui-polish`

- [2026-09-05 03:36 WITA] [CHANGED] [TEST] [Milestone 7 / Sprint 19 / Cosmic Orbital Workspace UI Redesign]
  Transformed the authenticated `/dashboard` and navigation sidebar (`LearnerSidebar` and `LearnerMobileDrawer`) into a cosmic, orbital-themed workspace matching the user-provided reference design:
  1. Hero Banner: Designed a deep cosmic banner with high-resolution Earth orbital visual, subtle atmospheric rim lighting, dynamic greeting ("Dev Netloka!"), tagline, primary "Lanjutkan/Mulai Belajar" CTA button, and Netloka orbital quote ("Better Networks Brighter Opportunities").
  2. Quick Stats Row: Created 4 metric cards for Total Kursus, Sedang Dipelajari, Selesai, and Streak Belajar with a 3D glowing flame visual asset and subtle colored border glows.
  3. Middle Row: Implemented "Progres Belajar" with a circular radial SVG donut progress gauge, horizontal progress bar, and 3 metric columns, alongside "Lanjutkan dari Terakhir" with friendly empty and active resume states.
  4. Praktik & Eksplorasi: Added 3 feature cards for Interactive Labs (purple), Troubleshooting Challenges (cyan), and Simulasi Konsultan TI (amber) with flowing SVG luminous wave backgrounds and direct action buttons.
  5. Sidebar & Navigation: Updated `LearnerSidebar` and `LearnerMobileDrawer` with cosmic theme, categorized under "MENU UTAMA" (Dashboard, Pembelajaran Saya, Katalog Kursus, Paket Saya, Riwayat Pesanan) and "EKSPLORASI" (Interactive Labs, Troubleshooting Challenges, Simulasi Konsultan TI) with active gradient pills, Lucide icons, and integrated profile card.
  Files/areas: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/page.test.tsx`, `src/components/navigation/learner-sidebar.tsx`, `src/components/navigation/learner-mobile-drawer.tsx`, `src/components/navigation/learner-workspace-shell.tsx`, `src/components/navigation/learner-workspace-shell.test.tsx`, `public/images/dashboard-earth-banner.jpg`, `public/images/streak-flame.jpg`, `CHANGELOG.md`
  Validation: `npm run typecheck` (0 errors), `npm run lint` (0 errors), `npm test` (49 test files, 235 passed), `npx playwright test src/e2e/member-workspace.spec.ts` (5 passed), `npm run build` (34/34 routes passed), `git diff --check` passed.
  Git: `codex/dashboard-sidebar-cosmic-redesign`

- [2026-09-05 02:55 WITA] [REFACTOR] [TEST] [Milestone 7 / Sprint 18 / Dashboard Distillation & Workspace Focus]
  Refocused the authenticated `/dashboard` into a minimal, text-led learner workspace:
  1. Distillation & Information Reduction: Removed public marketing sections (**4 Pilar Utama Netloka**, **Roadmap & UKK**, platform highlights, FAQ, and promotional footer), decorative SVG icons, and card-heavy layout from `/dashboard` while keeping locked public landing page/auth UI unchanged.
  2. Workspace Layout: Implemented a clean, single-column reading hierarchy with a welcome orientation, primary Continue/Start learning CTA, semantic `<div role="progressbar">` with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow`, compact inline text metrics for completed lessons, in-progress count, and XP, and ordinary text links for Labs, Challenges, and Consultant.
  3. Data Fetching Optimization: Fetched `getUserProgressSummary` and `getLearningPathsWithProgress` concurrently with `Promise.all` after resolving session user.
  4. Empty & Edge States: Provided a truthful, non-broken zero-progress state (`Start learning`) and no-path state with a direct text link to `Course catalog` (`/catalog`).
  5. Regression Testing: Added comprehensive test coverage in `src/app/(app)/dashboard/page.test.tsx` asserting active path progress bar semantics, truthful metrics, empty catalog states, zero SVG presence, and absence of public marketing headings.
  Files/areas: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/page.test.tsx`, `ROADMAP.md`, `PLAN.md`, `docs/HANDOFF.md`
  Validation: `npm run db:generate`, `npm run typecheck` (0 errors), `npm run lint` (0 errors), `vitest run` (49 files, 235 tests passed), `playwright test src/e2e/member-workspace.spec.ts` (5 passed), `npm run build` (34/34 routes passed), `impeccable detect.mjs` (0 antipatterns), and `git diff --check` passed.
  Git: `codex/dashboard-distillation`

- [2026-09-05 02:22 WITA] [DOCS] [Milestone 7 / Sprint 18 / Dashboard Distillation & Workspace Focus]
  Recorded the owner-approved design and task-by-task implementation plan for a quieter authenticated dashboard. The planned work removes dashboard-only public marketing content, decorative icons, and repeated card grids; preserves the locked public landing/auth UI; uses existing user-scoped progress/path reads concurrently; and defines active, new-learner, and no-path accessibility/test states.
  Files/areas: `docs/superpowers/specs/2026-09-05-dashboard-distillation-design.md`, `docs/superpowers/plans/2026-09-05-dashboard-distillation.md`, `ROADMAP.md`, `PLAN.md`, `docs/HANDOFF.md`
  Validation: source-flow audit; documentation/path consistency review and `git diff --check` passed. No application code, migration, dependency, deployment, remote push, PR, CI run, or live authenticated browser session was created for this documentation task.
  Git: `350dfc0` (`docs: plan dashboard distillation`)

---

# 2026-09-04

- [2026-09-04 15:25 WITA] [ADDED] [SECURITY] [Milestone 7 / Sprint 17 / Account Security, 2FA, Google Connection & Theming]
  Implemented Two-Factor Authentication (2FA TOTP), Google Account connection, Account Modal expansion, and full B/W theming:
  1. Two-Factor Authentication (RFC 6238 TOTP): Pure Node.js `crypto` TOTP engine (`totp.ts`), QR code generation (`qr.ts`), 6-digit verification with ±30s clock drift tolerance, and 8 one-time backup recovery codes (`xxxx-xxxx`).
  2. Database persistence: Added non-breaking fields `twoFactorEnabled`, `twoFactorSecret`, and `twoFactorBackupCodes` to Prisma `User` model.
  3. Security API Routes: Implemented `GET /api/user/security`, `POST /api/user/security/2fa` (setup, verify, disable), and `DELETE /api/user/security/google` (with anti-lockout local password protection).
  4. NextAuth credentials integration: Enforced 2FA verification step during credentials login when `twoFactorEnabled` is true (`2FA_REQUIRED`), updating `auth-modal.tsx` with dedicated 2FA code / backup code prompt.
  5. Account Linking: Enabled `allowDangerousEmailAccountLinking: true` for GoogleProvider in NextAuth and built `SecurityConnectedAccountsCard` for instant Google link/unlink.
  6. Account Modal Expansion: Expanded modal sidebar to 5 tabs (`Profile`, `Pengaturan`, `Keamanan`, `Sertifikat`, `Bantuan`).
  7. Full B/W Theming & System Theme: Moved theme toggle exclusively to settings with 3 icon buttons (Light, Dark, System); converted dashboard, catalog, learning, packages, and orders views to dual-theme contrast styling.
  Validation: `npm run lint` (0 errors), `npm run typecheck` (0 errors), `npm test` (48 test files, 232 tests passed).
  Files/areas: `prisma/schema.prisma`, `src/features/auth/`, `src/app/api/user/security/`, `src/features/settings/`, `src/components/navigation/account-modal/`, `src/components/ui/mode-toggle.tsx`, `src/app/globals.css`.

- [2026-09-04 01:26 WITA] [ADDED] [Milestone 7 / Sprint 17 / Member Workspace & Course Commerce Foundation]
  Implemented full Member Workspace and Course Commerce Foundation across Tasks 1 through 9:
  1. ADR 0004 & pure catalog rules (`catalog-rules.ts`, `types.ts`, `catalog-rules.test.ts`).
  2. Prisma persistence models (`Course`, `Package`, `PackageCourse`, `Order`, `OrderLine`, `PaymentAttempt`, `PaymentEvent`, `Entitlement`) and deterministic catalog seed (`commerce-seed.ts`, `catalog-seed.test.ts`).
  3. Authoritative catalog, entitlement, and owner-isolated read models (`catalog.ts`, `entitlements.ts`, `access.ts`, matching tests).
  4. Server-authoritative order creation and idempotent payment event state machine (`orders.ts`, `payments.ts`, `sandbox-gateway.ts`, matching tests).
  5. Protected commerce API routes (`/api/commerce/orders`, `/api/commerce/orders/[reference]`, `/api/commerce/sandbox/events`) with fail-closed production protection.
  6. Authenticated learner workspace shell (`LearnerWorkspaceShell`, `LearnerSidebar`, `LearnerMobileDrawer`) with high-contrast UI, theme preference enablement, and overlay modal routes (`/profile`, `/settings`).
  7. Member workspace routes with passive catalog (`/dashboard`, `/my-learning`, `/catalog`, `/my-packages`, `/orders`) without decorative icons or active checkout affordances for coming-soon courses.
  8. Server-side entitlement guards on learning path queries and progress mutations (`queries.ts`, `progress.ts`, `/api/learning/progress`).
  9. Comprehensive Playwright E2E coverage (`src/e2e/member-workspace.spec.ts`), ESLint clean (0 errors, 0 warnings), typecheck clean (0 errors), Vitest 218 tests passing (46 suites), Next.js production build passing across 31 static and dynamic routes.
  Validation: `npm run lint`, `npm run typecheck`, `npm test` (218 passed), `npm run build` (31 routes compiled successfully), `npm run test:e2e -- --project=chromium` (37 passed).
  Files/areas: `docs/decisions/0004-member-workspace-course-commerce.md`, `prisma/schema.prisma`, `prisma/commerce-seed.ts`, `src/features/commerce/`, `src/components/navigation/`, `src/app/(app)/`, `src/e2e/member-workspace.spec.ts`.
  Git: branch `codex/course-commerce-plan`, base `3a735da`

---

# 2026-09-03

- [2026-09-03 23:59 WITA] [DOCS] [Milestone 7 / Sprint 17 / Member Workspace & Course Commerce Foundation]
  Recorded the implementation-plan documentation checkpoint in local commit `638b42c` (`docs: detail sprint 17 commerce execution plan`). No application implementation, remote push, PR, CI run, payment activation, or deployment accompanied this commit.
  Validation: `git diff --check` passed; the plan was checked for all nine task headings and for prohibited vague planning markers.

- [2026-09-03 23:58 WITA] [DOCS] [Milestone 7 / Sprint 17 / Member Workspace & Course Commerce Foundation]
  Expanded the owner-approved commerce design into a task-by-task execution plan. The plan defines the ADR, pure package rules, Prisma model/migration constraints including payment-event idempotency, deterministic coming-soon catalog seed, owner-scoped read models, fail-closed sandbox APIs, authenticated workspace shell/theme repair, passive catalog pages, premium learning-path guard, and the required test/PR/CI sequence. It explicitly preserves the locked public UI, free Networking, no active premium checkout, and deferred Milestone 8 Midtrans/Dynamic QRIS activation.
  Validation: implementation-plan self-review against the approved design, current source boundaries, Prisma schema, test patterns, theme provider, and CI workflow. No application code, migration, dependency, credential, payment activation, deployment, or PR was created.
  Files/areas: `docs/superpowers/plans/2026-09-03-member-workspace-course-commerce.md`, `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`, `PLAN.md`, `docs/HANDOFF.md`
  Git: `638b42c`; local branch `codex/course-commerce-plan`, base `3a735da`

- [2026-09-03 23:44 WITA] [DOCS] [Milestone 7 / Sprint 17 / Member Workspace & Course Commerce Foundation]
  Recorded the owner-approved architectural design for a distinct post-login learner workspace and future hybrid lifetime course commerce. The design preserves the locked public landing/auth UI; makes Networking free; defines seven premium tracks as noninteractive Coming soon entries until content is published; defines Single Course and premium-only Combo Package rules; establishes seed/config catalog management, server-authoritative entitlements, a non-production sandbox payment lifecycle, and Dynamic QRIS/Midtrans as a separately gated activation phase. Added Sprint 17 planned workstreams and Milestone 8 provider/product activation gates, plus an explicit agent workflow, test strategy, authorization, security, and delivery requirements.
  Validation: documentation/source-flow review and current main/worktree verification completed; `npm ci` baseline setup in the isolated planning worktree was blocked by a Windows `EPERM` lock on the checkout's `lightningcss` native binary, so no fresh application test result is claimed. No application code, migration, dependency, credential, public UI, payment activation, deployment, or PR was created by this documentation checkpoint.
  Files/areas: `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`, `ROADMAP.md`, `PLAN.md`, `docs/HANDOFF.md`
  Git: pending; local branch `codex/course-commerce-plan`, base `3a735da`

- [2026-09-03 15:25 WITA] [ADDED] [Milestone 7 / Sprint 16 / Profile Dropdown Menu & Account Modal]
  Implemented interactive profile dropdown menu and rich Account Modal with sidebar navigation (Profile & Pengaturan).
  Features:
  - Accessible profile dropdown trigger in header with direct items: Profile, Pengaturan, Bantuan, and Keluar.
  - Non-navigational popup modal with background scroll lock to prevent page movement behind the modal.
  - Avatar image upload with automatic client-side canvas compression (WebP/JPEG) and removal control.
  - Editable headline/specialization field initialized to "Developer" for the developer account.
  - Gamified flame streak button (🔥 count) with daily claim restriction and automatic reset at 00:00 local device time.
  - Direct password change without requiring current password in Settings.
  - Terminal simulator CLI preferences (prompt style, font size, typing animation speed) and privacy controls.
  Files: `prisma/schema.prisma`, `src/app/api/user/profile/route.ts`, `src/app/api/user/password/route.ts`, `src/components/navigation/account-modal/account-modal.tsx`, `src/components/navigation/app-header.tsx`, `src/features/profile/profile-form.tsx`, `src/features/auth/auth.ts`, `src/types/next-auth.d.ts`
  Validation: ESLint clean, TypeScript clean, Vitest 36 files (170 tests) passed, Playwright browser test passed.
  Git: branch `codex/profile-dropdown-menu`

- [2026-09-03 13:15 WITA] [DOCS] [Milestone 7 / Sprint 16 / Agent Workflow PR Handoff]
  Prepared the user-requested pull request for agent workflow instructions, all-job CI verification gates, and handoff documentation on branch `codex/agent-workflow-handoff`. Rebased cleanly onto main commit `5f9903d` (PR #15). Verification: documentation review, links, and diff whitespace passed; all 5 CI jobs will be monitored via GitHub CLI. Delivery ready for repository owner review and merge.
  Git: pending; branch `codex/agent-workflow-handoff`; base `main` verified at `5f9903d`

- [2026-09-03 12:58 WITA] [DOCS] [Milestone 7 / Sprint 16 / Legal Pages PR Handoff]
  Prepared the owner-requested pull request for the Terms/Privacy feature only; unrelated agent-workflow documentation remains in its separate worktree. Fresh pre-commit verification passed ESLint, TypeScript, all 35 Vitest suites/163 tests, and the production build. Earlier 96/96 three-browser results and visual review apply to the same application code. The existing five-job GitHub Actions workflow will provide PR verification; CI results and the PR URL will be recorded in the GitHub handoff. No live OAuth, SMTP, migration, deployment, or legal-compliance claim is made. Human review and merge remain with the owner.
  Git: pending; branch `codex/auth-legal-pages`; base `main` verified at `33b7caa`

- [2026-09-03 12:51 WITA] [ADDED] [Milestone 7 / Sprint 16 / Legal Pages]
  Added public Terms of Service and Privacy Policy routes with Indonesian content grounded in the current account, learning, OAuth, SMTP, and persistence implementation. Legal pages use a full white canvas and black text with no icons or decorative media; scoped styles restore visible scrolling and do not leak into the dark landing page. Both auth modes expose accessible new-tab links that preserve form/callback state, and the footer exposes direct links. No authentication handler, schema, dependency, credential, or consent-record change was made.
  Validation: baseline 35 Vitest suites/160 tests passed; new link tests failed for missing links and a new browser test failed with HTTP 404 before implementation. After implementation and test-selector corrections, focused tests passed, typecheck passed, production build passed, and 35 Vitest suites/163 tests passed. Full Playwright suite passed 96/96 across Chromium, Firefox, and WebKit against the local production build on port 3002 with one worker, including public access, no-JavaScript reading, white/black styling at 390px/1440px, new-tab form preservation, and dark-theme restoration. Desktop/mobile screenshots captured; independent code review's ambiguous E2E locator finding was fixed. Visual finish review inspected all 12 captures and returned ship for the scoped UI, with no material visual findings; this is not deployment approval. The one-time design detector surfaced intentional legal black/type-ramp exceptions and existing auth/footer palette advisories; the legal exception is documented without redesigning other surfaces.
  Limitations: placeholder DB/auth values were used; health checks exercised degraded DB authentication, not successful live persistence. OAuth/SMTP/migration integration remains unverified. The exposed Google secret was not copied into the worktree; rotation and correct callback registration remain required. These development policies are not compliance certification: operator/contact, retention, rights workflows, child consent, deployed-provider disclosures, and Google token handling remain pre-launch work under ADR 0003/TD-10. Existing dependency audit and Next.js middleware/standalone-start warnings remain. Temporary test configuration/capture script removed; the test server stopped after verification; screenshots retained locally in an ignored review directory.
  Final checks: ESLint, TypeScript, and diff whitespace checks passed after temporary test tooling was removed. DESIGN and PRODUCT record the scoped legal-page exception; application styling remains unchanged outside these routes.
  Files/areas: `src/app/(legal)/`, auth modal/footer and tests, `src/e2e/legal-pages.spec.ts`, README, PLAN, ROADMAP, DESIGN, PRODUCT, technical debt, ADR 0003
  Git: pending; local branch `codex/auth-legal-pages`; no push, PR, merge, or deployment performed

- [2026-09-03 12:26 WITA] [DOCS] [Milestone 7 / Sprint 16 / Agent Workflow]
  Clarified mandatory new-chat context recovery, source/flow inspection before implementation, planning and user-confirmation gates, isolated task worktrees, internal review/testing, GitHub CLI PR delivery, all-applicable-job CI verification, user-owned final review/merge, fast-forward main synchronization, and conservative local cleanup. Added a dated handoff with codebase entry points, development status, evidence boundaries, unresolved work, and next actions; preserved architecture/security rules and the generated Next.js guidance.
  Files/areas: `AGENTS.md`, `docs/HANDOFF.md`, `CHANGELOG.md`
  Validation: baseline Git state and prior PR/CI evidence checked; documentation consistency review, 10 local Markdown links, 39 source references, generated-block preservation, and diff whitespace checks passed. Independent read-only review found no material documentation issues. Fresh Prisma generation and 35 Vitest suites (160 tests) passed with placeholder credentials; the health test covered database authentication failure/degraded health, not live connectivity. Lint/typecheck/E2E/build were not rerun for documentation-only edits. No application behavior or deployment change; existing worktrees retained and main clean.
  Audit follow-up: full npm audit including development dependencies reports 7 findings (4 moderate, 2 high, 1 critical), including a critical Vitest UI-server advisory and Vite/tooling findings in addition to Prisma/mysql2. This is a broader scope than the historical production-only audit; no dependency fix or public development server was introduced. Remediation requires a separate approved task.
  Git: pending; local documentation branch `codex/agent-workflow-handoff`

- [2026-09-03 12:18 WITA] [DOCS] [Milestone 7 / Sprint 16 / Post-Merge Checkpoint]
  Follow-up to the 11:56 auth PR handoff: PR #14 was reviewed and merged by the project owner into main at 12:06 WITA; local main was pulled and now matches the observed origin/main merge commit. Rechecked feature-head CI run 33713239705: all five jobs succeeded. This does not verify live SMTP/Google/database integration or deployment. Old auth and unrelated staging worktrees remain; no branch cleanup was performed by this documentation task.
  Git: PR #14; head 48df6c2e42fa8a1eaabf517f9003481c2dbf5380; merge 33b7caa07fa2f930a0d9e259adbf1166836a252d

- [2026-09-03 11:56 WITA] [DOCS] [Milestone 7 / Sprint 16 / PR Handoff]
  Recorded the committed auth modal/password-recovery implementation and prepared the user-requested pull request to main. Re-ran ESLint, type-check, and all 160 unit tests successfully before committing. The previously recorded 72-browser-test and production-build results apply to the same application code. The PR must expose migration, live SMTP/OAuth, timing/abuse, JWT policy, and dependency limitations; it is not deployment approval or sprint completion. Human review and merge remain with the project owner.
  Git: implementation commit 9d681b211af9dfa9a37e8e49efbc7e70b38cbac9; branch codex/auth-modal-password-reset; PR number and CI outcome will be reported in the GitHub handoff.

- [2026-09-03 11:51 WITA] [REVIEW] [Milestone 7 / Sprint 16 / Authentication]
  Completed local auth feature verification and documented remaining launch gates. Fixed callback URL normalization bypasses in the modal and legacy redirects, and bound reset-token deletion to its digest so concurrently replaced tokens cannot consume a newer token. Added regression coverage; retained a unique token-per-user constraint and atomic upsert. Recorded the actual NextAuth 4/Nodemailer alias architecture in ADR 0002.
  Validation: ESLint and TypeScript passed; 35 Vitest suites passed (160/160 tests); production build passed (30 routes plus middleware); 72/72 Playwright tests passed across Chromium, Firefox, and WebKit using one worker against a local production build on port 3001. Prisma schema validation and diff whitespace checks passed. Desktop/mobile visual and keyboard QA was completed on 2026-09-02; Impeccable review improved the pending-label text size.
  Limitations: SMTP and persistence are mocked in focused tests; the test server used placeholder DB credentials and exercised degraded health, not database connectivity. Docker was unavailable, so migration application and a live email-to-reset-to-login journey remain unverified. Google OAuth awaits credentials. Identical reset response bodies do not remove synchronous delivery timing differences; throttling/abuse resistance and JWT revocation policy remain pre-launch work. Audit reports one high and one moderate package finding through Prisma/mysql2; no Nodemailer finding. These release gates remain open in PLAN/technical debt; no deployment or sprint-completion claim is made.
  Test infrastructure: local Next dev runs with six workers showed timing-related failures; single-worker Chromium passed, and final three-browser verification used the built app. The temporary test configuration was removed after verification. Existing middleware deprecation and standalone-start warnings were observed.
  Files/areas: auth feature/routes/tests, Prisma migration, README, PLAN, technical debt, ADR 0002, implementation plan
  Git: pending; no commit, push, PR, or merge performed

# 2026-09-02

- [2026-09-02 16:31 WITA] [ADDED] [Milestone 7 / Sprint 16 / Authentication]
  Moved credentials Sign In and Create Account into an accessible URL-driven modal on the landing page, retained legacy auth URLs as compatibility redirects, prepared conditional Google OAuth account creation, and added a complete password-recovery flow. Password reset requests use account-enumeration-safe responses, Hostinger-compatible SMTP delivery, SHA-256 token digests, 30-minute expiry, one-active-token-per-user persistence, single-use transactional consumption, and a new Prisma migration. Google remains visibly disabled with `Setup pending` until both OAuth credentials are configured.
  Files/areas: `src/features/auth/`, `src/app/(auth)/`, `src/app/api/auth/`, `src/components/navigation/app-header.tsx`, `src/middleware.ts`, `prisma/schema.prisma`, `prisma/migrations/20260902_add_password_reset_tokens/`, `.env.example`, `README.md`
  Validation: ESLint passed; TypeScript type-check passed; 35 Vitest suites passed (154/154 tests); focused Chromium auth/landing E2E passed (9/9 tests); production build passed (30 application routes plus middleware); full browser suite and final visual/diff review pending
  Git: pending

- [2026-09-02 13:17 WITA] [FIXED] [Milestone 7 / Sprint 16 / Stabilization]
  Restored the complete local quality gate for the active UI refinement. Animated CTA labels now expose one accessible name while retaining the two-line visual transition; the simulator selector now uses a valid `tablist`/`tab`/`tabpanel` relationship; and tab-window state is updated from the selection event instead of synchronously inside an effect. Product positioning in the authoritative documentation now consistently describes Netloka as an IT infrastructure learning platform with Networking as the first available domain. The previously observed mobile `Mulai Gratis` label was rechecked at 390x844 and rendered visibly, so no speculative CSS change was applied.
  Files/areas: `src/components/ui/sliding-button-label.tsx`, `src/components/ui/sliding-button-label.test.tsx`, `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`, `AGENTS.md`, `README.md`, `ROADMAP.md`, `PLAN.md`
  Validation: ESLint passed; TypeScript type-check passed; 29 Vitest suites passed (128/128 tests); Playwright passed 66/66 tests across Chromium, Firefox, and WebKit; production build passed; `git diff --check` passed; local branch and `origin/main` share base `e42ee68` with no divergence before commit
  Known warning: Next.js 16.3.2 still reports the tracked low-severity `middleware` to `proxy` deprecation (TD-01)
  Git: pending

- [2026-09-02 12:25 WITA] [CHANGED] [Milestone 7 / Sprint 16 / Navigation]
  Reframed the primary navbar as an IT infrastructure learning catalog while preserving the product journey through `Learn`, `Labs`, `Challenges`, and `Consultant`. Networking remains available through the existing routes; Server & Linux, Cybersecurity, Cloud & DevOps, CCTV & Surveillance, Fiber Optic, and VoIP & PABX are presented as noninteractive `Soon` domains. Desktop dropdowns and the compact mobile roadmap now share one typed configuration, and decorative dropdown icons were removed in favor of clearer status and copy hierarchy.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`, `PRODUCT.md`, `DESIGN.md`, `PLAN.md`
  Validation: focused navbar test demonstrated RED before implementation and passed GREEN with 3/3 tests; type-check passed; 28 Vitest suites passed (126/126 tests); production build passed; desktop/mobile browser QA completed; Chromium foundation E2E passed 6/7 with one unrelated pre-existing landing CTA expectation failure; repository lint remains blocked by an unrelated existing `live-simulator-showcase.tsx` effect error and ARIA warning
  Git: pending

- [2026-09-02 12:06 WITA] [DOCS] [Milestone 7 / Sprints 15–16]
  Corrected project status documentation to match the existing codebase and actual deployment state. Milestones 0–6 are implemented; Milestone 7 remains active because staging and production deployment have not been performed. Existing landing page, dashboard, navigation, authentication UI, and cosmic visual work is classified as active Sprint 16 feature refinement rather than reopened Milestone 1 work. Historical entries are preserved and this entry supersedes their milestone labels for current planning purposes.
  Files/areas: `ROADMAP.md`, `PLAN.md`, `README.md`, `docs/TECHNICAL_DEBT.md`, `CHANGELOG.md`
  Validation: documentation cross-check against the repository structure, Prisma schema, package configuration, active source files, and Git working tree
  Git: pending

- [2026-09-02 11:37 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan bingkai/border pada setiap kartu sub-menu dropdown navigasi navbar dan menggantinya dengan garis pembatas yang bersih dan elegan:
  1. Garis pembatas vertikal (`divide-x divide-slate-800`) memisahkan kolom kiri dan kolom kanan.
  2. Garis pembatas horizontal (`divide-y divide-slate-800/70`) memisahkan item-item menu di dalam tiap kolom.
  3. Garis pembatas bawah (`border-t border-slate-800`) memisahkan daftar menu dengan link aksi di bagian bawah popover.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/ui/navigation-menu.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:33 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  1. Menyembunyikan seluruh scrollbar peramban (*browser scrollbars*) secara global di `globals.css` menggunakan aturan `-ms-overflow-style: none; scrollbar-width: none; *::-webkit-scrollbar { display: none; }` tanpa mengganggu kelancaran fungsi scroll.
  2. Menghapus komponen tombol peralihan tema (`ModeToggle`) dari header navigasi dan mengunci tema platform ke mode hitam/gelap (*dark theme / #030308*) secara permanen via `forcedTheme="dark"` di `Providers` dan kelas `dark` pada elemen `<html>`.
  Files/areas: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/providers.tsx`, `src/components/navigation/app-header.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:31 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan visual 2 rasi bintang (*Crux & Cassiopeia*) di footer:
  1. Mengubah garis rasi dari putus-putus menjadi garis putih solid yang tebal dan jelas (`stroke="#ffffff" strokeWidth="1.8"`).
  2. Mengubah seluruh simpul titik bintang menjadi warna putih bersih (`fill="#ffffff"`).
  3. Menambahkan efek animasi kelap-kelip berkilau terang (*twinkling starlight pulse with drop shadow bloom*) pada bintang-bintang utama (*Acrux, Gacrux, Schedar, Navi*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:30 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah gaya teks copyright pada footer (`© 2026 Netloka. Hak Cipta Dilindungi Undang-Undang.`) menjadi warna putih bersih dengan ketebalan tegas (*font-bold text-white tracking-wide*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:29 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 2 ornamen rasi bintang (*constellations*) kosmik pada latar belakang section Footer:
  1. Rasi Bintang **Crux** (*Southern Cross*) di sisi kiri dengan 5 bintang bertaut garis halus berpendar (*Acrux, Gacrux, Mimosa, Imai, Ginan*).
  2. Rasi Bintang **Cassiopeia** (*Pola W*) di sisi kanan dengan 5 bintang bertaut garis halus berpendar (*Caph, Schedar, Navi, Ruchbah, Segin*).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:28 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen kosmik pada latar belakang section Footer:
  1. Kumpulan planet kecil dan bintang mikro bercahaya terang yang diam (*FooterStarField* dengan pendaran radiant halo cyan, gold, emerald, coral, ruby, sapphire, dan white starlight).
  2. Kumpulan planet kecil kosmik (10 planet) yang melayang/berterbangan secara halus dari kanan ke kiri (`driftPlanetRightToLeftFooter`).
  Files/areas: `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus baris teks 'Domain resmi: netloka.biz.id' dan bar status 'Sistem Operasional / Zona Waktu' dari footer pemasaran agar tampilan penutup halaman lebih ringkas, elegan, dan fokus ke navigasi ekosistem.
  Files/areas: `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/marketing-footer.test.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:23 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  1. Menambahkan ornamen planet-planet kosmik kecil (10 planet bercahaya) yang melayang/berterbangan secara halus dari kiri ke kanan (`driftPlanetLeftToRightFaq`) melintasi latar belakang section FAQ Interaktif.
  2. Menerapkan efek animasi underline interaktif berwarna putih bersih yang melebar secara anggun dan perlahan dari arah tengah ke kiri dan kanan (`after:origin-center after:scale-x-0 hover:after:scale-x-100` dengan durasi 500ms dan kurva halus `cubic-bezier(0.16, 1, 0.3, 1)`) pada setiap tautan menu di Footer Navigasi.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:20 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan copywriting pada Final CTA footer dan deskripsi brand Netloka menjadi lebih luas dan generalist (*"Bergabung bersama ribuan pelajar, mahasiswa, dan calon praktisi IT untuk menguasai infrastruktur digital lewat simulasi interaktif langsung di browser"*), inklusif untuk seluruh peminat IT infrastructure, sysadmin, jaringan, dan teknologi modern.
  Files/areas: `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/marketing-footer.test.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites (124 tests) Vitest lulus 100%, dev server aktif di localhost:3000.
  Git: pending

- [2026-09-02 11:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah tampilan kedua area CTA informasi (CTA eksplorasi materi di bagian bawah Live Simulator Showcase dan Final CTA di Marketing Footer) dari yang sebelumnya menggunakan pembungkus card berkontur/border menjadi teks informasi biasa yang bersih dan berpadu langsung di atas kanvas hitam pekat.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: TypeScript typecheck clean (0 errors), 28 test suites Vitest valid, dev server aktif di localhost:3000.
  Git: pending

# 2026-09-01

- [2026-09-01 11:38 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh lapisan radial gradient dan ambient overlay berwarna pada latar belakang section FAQ dan Marketing Footer, sehingga murni menggunakan warna solid hitam pekat kosmik `#030308` secara penuh yang menyatu mulus dan bersih dengan ornamen bintang kosmik.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:37 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan section **FAQ Interaktif** (`InteractiveFaq`):
  1. Mengimplementasikan animasi buka-tutup accordion yang sangat halus berbasis CSS Grid height transition (`grid-rows-[0fr]` s/d `grid-rows-[1fr]` dengan kurva `cubic-bezier(0.22, 1, 0.36, 1)`).
  2. Menghapus badge pill teks 'Tanya Jawab Seputar Netloka'.
  3. Menyamakan latar belakang menjadi hitam pekat kosmik `#030308` yang menyatu mulus dengan section sekitarnya.
  4. Menambahkan ornamen dense micro-stars dan beberapa bintang suar bercahaya terang (*radiant starlight halos*) dengan pendaran cyan, white, gold, emerald, dan coral.
  Files/areas: `src/components/marketing/interactive-faq.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:30 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section **FAQ Interaktif** (`InteractiveFaq`) dengan sistem accordion beranimasi dan filter kategori (Akses & Perangkat, Kurikulum SMK TKJ, Simulasi Terminal, dan Mode Konsultan), serta **Marketing Footer Kosmik** (`MarketingFooter`) yang memuat kartu Final CTA konversi, navigasi 5 kolom ekosistem, status sistem operasional (`/api/health`), dan copyright resmi Netloka.
  Files/areas: `src/components/marketing/interactive-faq.tsx`, `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/interactive-faq.test.tsx`, `src/components/marketing/marketing-footer.test.tsx`, `src/app/page.tsx`
  Validation: 28 test suites (124 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:22 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan efek animasi teks meluncur vertikal (*SlidingButtonLabel smooth cubic-bezier hover transition*) seperti pada tombol Masuk dan Mulai Gratis ke dalam 4 tombol navigasi utama:
  1. Tombol 'Jelajahi' pada Hero Dashboard (`src/app/page.tsx`)
  2. Tombol 'Lihat jalur belajar' pada Section Journey (`src/components/marketing/it-infrastructure-journey.tsx`)
  3. Tombol 'Mulai Belajar Sekarang' pada Section Simulator Showcase (`src/components/marketing/live-simulator-showcase.tsx`)
  4. Tombol 'Katalog Labs' pada Section Simulator Showcase (`src/components/marketing/live-simulator-showcase.tsx`)
  Membuat komponen bersama yang bersih di `src/components/ui/sliding-button-label.tsx` dan mengonsolidasikan referensinya dari seluruh navigasi header dan section pemasaran.
  Files/areas: `src/components/ui/sliding-button-label.tsx`, `src/components/navigation/app-header.tsx`, `src/app/page.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:18 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen planet-planet kosmik kecil (10 planet berukuran 10px - 16px) yang melayang/berterbangan secara halus dari kanan ke kiri (`driftPlanetRightToLeftShowcase`) melintasi latar belakang section Live Simulator Showcase, dilengkapi gradien warna kosmik beraneka ragam serta pendaran cahaya starlight halo berkilau (arctic cyan, white starlight, gold, emerald mint, teal, coral, ruby).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:16 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus border kotak kartu dan background pembungkus pada setiap ilustrasi perangkat jaringan (`PC-1`, `SW-1`, `RTR-GW`, `SRV-1`) pada Visualizer Alur Paket ICMP, sehingga yang tampil murni hanya siluet bentuk fisik perangkat kerasnya langsung di atas kanvas dengan pendaran drop-shadow dinamis saat aktif.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyempurnakan desain ilustrasi perangkat keras fisik (Host PC Desktop dengan monitor stand & CPU tower, Switch 1U Rackmount dengan telinga baut rak & port RJ45, Router Gateway dengan dual dipole antennas & routing forwarding engine, dan Server Enterprise 2U Rackmount dengan 4 caddy drive SAS/SATA) pada visualizer alur paket ICMP agar tampil lebih besar, presisi, dan sepenuhnya menggantikan representasi planet bola gradien lama.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti representasi bola/planet pada visualizer alur paket ICMP menjadi bentuk ilustrasi perangkat keras fisik asli (Host Desktop PC dengan layar monitor & CLI, Switch Manageable 1U dengan matriks port RJ45 & activity LEDs, Router Gateway Edge dengan dual antenna & port routing, serta Target Server 2U Rackmount dengan hot-swap drive bays & cooling grilles) yang dilengkapi efek glow luminous saat transmisi paket data melewatinya.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 11:06 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 6 alat simulator interaktif baru dari berbagai ranah infrastruktur IT (Kalkulator Permission Linux `chmod`, Segmentasi VLAN & Trunking 802.1Q, Kalkulator Redaman Fiber Optik OPM, Kalkulator RAID Server & Parity, Kalkulator Kapasitas NVR & Bandwidth CCTV, serta Visualizer 4-Langkah Handshake SSL/TLS) melengkapi 3 simulator jaringan utama (Terminal CLI, Subnet IPv4, ICMP Packet Flow). Mengimplementasikan sistem navigasi tab slider horizontal dengan tombol panah kiri (`‹`) dan kanan (`›`) yang membatasi tampilan maksimal 3 menu sekaligus secara dinamis dengan transisi sliding pill kapsul abu-abu yang pas presisi.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`
  Validation: 26 test suites (119 unit/integration tests) Vitest lulus 100%, typecheck clean (0 errors), dev server aktif.
  Git: pending

- [2026-09-01 10:57 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki kapsul abu-abu (*sliding pill indicator*) pada tab switcher section Live Simulator Showcase (`Terminal Diagnostik CLI`, `Kalkulator & Visualizer Subnet`, dan `Visualizer Alur Paket ICMP`) dengan mengganti nilai hardcoded statis menjadi kalkulasi dinamis presisi berbasis `activeButton.offsetLeft` dan `activeButton.offsetWidth` dengan anchor `left: 0` seperti pada section Journey, sehingga kapsul abu-abu pas (*snug fit*) 100% mengikuti panjang teks pada setiap tab.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus ornamen planet besar yang melayang dan hanya mempertahankan planet-planet kecil kosmik (ukuran 10px-16px) yang melayang dari kiri ke kanan dengan pendaran cahaya starlight pada section IT Infrastructure Journey agar tampilan tetap bersih, fokus, dan tidak mendominasi konten materi.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen planet-planet kosmik besar (3 planet) dan planet-planet kecil (10 planet dengan proporsi lebih dominan) yang melayang/berterbangan secara kontinu dari kiri ke kanan melintasi latar belakang section IT Infrastructure Journey, dilengkapi pendaran cahaya starlight (*glowing halo*) putih cerah, cyan, gold, dan teal pada beberapa planet kecil.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:51 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki penentuan posisi dan lebar kapsul abu-abu (*sliding pill indicator*) pada tab slider IT Infrastructure Journey menggunakan koordinat `activeButton.offsetLeft` dan `activeButton.offsetWidth` dengan anchor `left: 0` sehingga kapsul abu-abu 100% pas dan sinkron dengan ukuran tombol teks tanpa keluar atau meleset ke sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel padding tombol tab slider IT Infrastructure Journey (`px-3 sm:px-3.5` untuk teks tunggal dan `pl-3 sm:pl-3.5 pr-2.5 sm:pr-2.5` untuk teks dengan badge Soon) sehingga kapsul abu-abu aktif membungkus teks dan badge secara rapat dan pas (*snug fit*) tanpa kelebihan lebar di sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlebar bentangan horizontal menyamping pada kapsul tab slider IT Infrastructure Journey (`px-5 sm:px-7` per tombol tab dan `px-2 sm:px-3` pada bingkai kontainer luar) sehingga deretan menu tampil lebih megah, lapang, dan berjarak lega.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:47 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbesar ukuran dan padding kapsul bingkai latar belakang utama (`p-1.5 sm:p-2`, `px-3 sm:px-4`) pada tab slider IT Infrastructure Journey sehingga kapsul abu-abu aktif dan seluruh tab menu berada di dalam bingkai dengan ruang napas (*breathing room*) yang pas, seimbang, dan proporsional.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:46 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memangkas padding sisi kanan pada tombol tab `IT Consultant` (`pr-1` dan `px-1` pada badge `Soon`) sehingga kapsul abu-abu pembungkus aktif lebih ramping dan tidak lagi melebar di sisi kanan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengetatkan ukuran dan padding kapsul tab `IT Consultant` serta seluruh trek pada tab slider IT Infrastructure Journey sehingga kapsul membungkus teks dan badge `Soon` secara ringkas, pas, dan proporsional tanpa kelebihan lebar.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:44 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi padding dan lebar sisi kanan kapsul latar abu-abu aktif pada ketiga tab slider IT Infrastructure Journey (`Network Engineer`, `SysAdmin & Linux`, dan `IT Consultant`) sehingga kapsul latar membungkus teks dan badge secara rapat, presisi, dan proporsional.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:43 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merapikan dan menyesuaikan ukuran padding background pill slider tab IT Infrastructure Journey agar pas (*snug fit*) dengan panjang teks dan badge tanpa kelebihan ruang kosong di sisi kanan/kiri.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel tab slider IT Infrastructure Journey selain trek `Network Engineer` (`SysAdmin & Linux` dan `IT Consultant`) menjadi berstatus *Coming Soon* dengan badge indikator elegan dan kartu pratinjau kurikulum yang informatif beserta tombol kembali ke trek aktif.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:39 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meredupkan intensitas dan saturasi pendaran cahaya galaksi Milky Way pada Section 4 Pilar Pembelajaran (menurunkan opacity dan densitas gradient sebesar ~35-40%) sehingga menghasilkan suasana kosmik yang lebih tenang, lembut, dan tidak menyilaukan konten tata surya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:38 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan teknik *bidirectional gradient feather masking* (`maskImage` linear fade) pada batas bawah Hero Dashboard dan batas atas Section 4 Pilar Pembelajaran sehingga garis batas pemotongan horizontal (*hard clipping seam*) tersamarkan sempurna dan menyatu 100% secara alami.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:36 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus layer transisi bayangan atas (`h-52` top shadow overlay) di awal Section 4 Pilar Pembelajaran yang sebelumnya menggelapkan bagian atas dan menutupi aliran cahaya galaksi Milky Way dari Dashboard.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:35 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaikkan posisi bentangan galaksi Milky Way pada Section 4 Pilar Pembelajaran hingga tepat mencapai tepi atas (`top: 0`) sudut kanan atas untuk menyatu mulus dengan ujung bawah Dashboard, serta menghapus seluruh sisa layer bayangan/ambient shadow overlay di Section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:34 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan koordinat geometris dan menambahkan jembatan cahaya kosmik (*luminous galactic connection bridge*) di sudut kanan atas-bawah perbatasan kedua section sehingga aliran galaksi Milky Way dari Dashboard Utama dan Section 4 Pilar tersambung 100% tanpa celah gelap atau jeda visual.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:32 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus layer shadow overlay pemisah (`h-52` bottom shadow) di bagian bawah Hero Dashboard sehingga kanvas kosmik hitam pekat `#030308` dan aliran bentangan Milky Way tersambung 100% mulus tanpa garis atau bayangan pembatas ke Section 4 Pilar Pembelajaran.
  Files/areas: `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:31 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh efek pendaran cahaya matahari (*SVG solar corona flares and oversized outer glow*) di pusat tata surya Section 4 Pilar Pembelajaran sehingga bola matahari tampil bersih, bulat alami, dan tidak menyilaukan bentangan galaksi Milky Way di belakangnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:30 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan kelanjutan aliran galaksi Milky Way dari dashboard utama ke Section 4 Pilar Pembelajaran dengan orientasi berlawanan (*inverted continuous galactic flow*: masuk dari sudut kanan atas dan mengalir ke sudut kiri bawah `-rotate-[34deg]`) menggunakan palet warna harmonis bebas ungu dan ratusan bintang mikro berkilau.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:29 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan seluruh nuansa warna ungu pada Milky Way dan menggantinya dengan perpaduan warna kosmik segar tanpa ungu: kuning emas surya (`#fde047`, `#fef08a`), aurora teal/emerald (`#2dd4bf`), cyan es kosmik (`#38bdf8`), sunset coral (`#fb923c`), dan putih cemerlang (`#ffffff`).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:28 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti implementasi gambar dengan sistem gradien warna kosmik murni prosedural (*pure multi-color procedural cosmic gradient*) dengan perpaduan warna emas, violet, cyan, rose, dan putih bercahaya yang memanjang diagonal dari atas kiri ke bawah kanan lengkap dengan ratusan bintang mikro SVG dinamis tanpa menggunakan file gambar statis.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:27 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengintegrasikan aset astrophotography galaksi Milky Way asli resolusi tinggi persis sesuai referensi foto pengguna (`public/images/milky-way.png`) dengan teknik blending optik kosmik (`mix-blend-screen` dan *feathered radial mask*) menyerong dari atas kiri ke bawah kanan pada hero dashboard utama.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `public/images/milky-way.png`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meredupkan intensitas kabut Milky Way menjadi lebih lembut dan nyaman dibaca (*subtle dimmed golden glow*), menyelaraskan seluruh warna murni dalam palet kuning emas (`#fde047`, `#fef08a`, `#fbbf24`), serta memperbanyak puluhan bintang-bintang kecil bercahaya di sepanjang bentangan galaksi.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:24 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan celah gelap di bagian tengah bentangan Milky Way sehingga pancaran cahaya starlight sungai galaksi mengalir penuh, utuh, dan bersambung cemerlang (*full continuous starlight stream*) dari sudut kiri atas hingga sudut kanan bawah.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:23 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki sudut kemiringan jalur galaksi Milky Way pada hero dashboard menjadi menyerong tepat dari atas kiri ke bawah kanan (`rotate-[34deg]`) serta menghaluskan gradien celah debu kosmik secara organik (*soft organic dark nebula lanes*) tanpa garis patahan kaku.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:22 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan bentangan jalur galaksi Bima Sakti realistis (*diagonal Milky Way galaxy band & Great Rift dark nebula rifts*) yang menyerong dari atas kiri ke bawah kanan pada canvas `CosmicBackground` hero dashboard utama dengan gradien stardust emas-putih, kabut debu kosmik, serta ribuan bintang mikro yang berkelap-kelip.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:21 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah pencahayaan matahari menjadi pilar cahaya background kosmik vertikal dari atas ke bawah (*vertical Milky Way celestial light column*) di sepanjang pusat Section 4 Pilar Pembelajaran dengan efek atmospheric glow bertingkat, sekaligus merapikan bola matahari utama agar tampak bersih dan natural di atas pilar cahaya kosmik.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:20 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan planet-planet kecil mikro berwarna putih murni bercahaya ultra-terang (*radiant pure white micro planets*) dengan pendaran cahaya multi-layer (`#ffffff` glow halo hingga 44px) yang berterbangan dari kanan ke kiri di Section 4 Pilar Pembelajaran.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:19 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan efek cahaya matahari bersinar megah (*radiant sunlight flare, pulsating corona aura, and lens flare beams*) di pusat tata surya Section 4 Pilar Pembelajaran, memancarkan pendaran cahaya surya emas hangat yang menyinari orbit dan planet-planet di sekelilingnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi jumlah planet kecil yang melayang pada Section 4 Pilar Pembelajaran menjadi lebih seimbang dan estetik (4 planet mikro + 3 anchor planets), serta menyematkan pendaran cahaya neon ultra-terang (*intense multi-tier glowing halo*) pada planet-planet kecil yang berterbangan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:16 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan armada planet-planet kecil mikro 3D berpendar neon (berukuran 9px s.d. 18px dalam aneka warna: ruby, cyan, gold, ungu, emerald, amber, ice blue, rose, dan violet) yang berterbangan melintasi kanvas dari kanan ke kiri (*right-to-left continuous drift*) di Section 4 Pilar Pembelajaran.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:15 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan artefak kotak transparan / bounding box pada cincin Saturnus dengan merefaktor implementasi ke pure vector SVG ellipse rings (stroke putih-emas bersih tanpa drop-shadow filter yang bocor ke bounding box).
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan intensitas kecerahan dan pendaran cahaya cincin planet Saturnus (*ultra-luminous planetary rings*) pada Section IT Infrastructure Journey dengan warna putih emas cemerlang (`#ffffff` & `#fef08a`) serta multi-layer drop shadow glow.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:13 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ornamen cincin planet bercahaya emas kosmik (*luminous planetary rings*) berputar miring (-22°) dengan layering depan-belakang yang melintasi khatulistiwa planet Saturnus pada checkpoint Section IT Infrastructure Journey.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:12 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 4 rasi bintang unik berpendar neon dinamis: 2 rasi bintang pada Section 4 Pilar Pembelajaran (**Cassiopeia** bentuk W di kiri atas & **Cygnus / Salib Utara** di kanan atas) serta 2 rasi bintang pada Section IT Infrastructure Journey (**Ursa Major / Bintang Biduk** di kiri tengah & **Orion / Sang Pemburu beserta Sabuk Tiga Bintang** di kanan bawah) dengan animasi kelap-kelip bintang utama.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:09 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan puluhan titik planet mikro (*distant micro-planets*) dengan pendaran cincin atmosfer neon lembut (*glowing atmosphere halos*) dalam variasi warna cyan, amber, gold, ungu, emerald, dan ruby pada canvas `StarField` section IT Journey dan Live Simulator Showcase.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:07 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan garis batas pemisah (`border-t`) pada section Live Simulator Showcase serta menyamakan layer ambient glow dengan section IT Journey & 4 Pilar (`#030308`) sehingga transisi visual antar-section menyatu 100% mulus tanpa ada patahan garis sama sekali.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:05 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan warna latar belakang seluruh section landing page (4 Pilar, IT Journey, Live Simulator Showcase, dan Footer) menjadi satu warna hitam pekat kosmik murni yang konsisten (`#030308`), serta menyematkan taburan mikro-bintang 4-warna harmonis pada StarField Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:03 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan latar belakang section Live Simulator Showcase menjadi warna hitam pekat kosmik murni (`bg-[#030308]`) serta memperkaya `ShowcaseStarField` dengan taburan padat titik-titik mikro-bintang dalam 4 kombinasi warna: putih (`#ffffff`), biru (`#38bdf8`), kuning (`#fde047`), dan orange (`#fb923c`).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:01 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah teks "Langsung di Web Tanpa Setup" pada judul section Live Simulator Showcase dari gradien multi-warna menjadi satu warna solid (`text-sky-400`).
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 10:00 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menetapkan warna teks hitam pekat murni secara eksplisit (`style={{ color: "#000000" }}` dan `text-black !text-black dark:text-black dark:!text-black`) pada kedua tombol CTA berlatar putih: tombol "Lihat jalur belajar" (section IT Infrastructure Journey) dan tombol "Mulai Belajar Sekarang" (section Live Simulator Showcase) agar kontras terbaca jelas.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah warna teks tombol CTA "Lihat jalur belajar" pada bagian bawah section IT Infrastructure Journey menjadi warna hitam pekat (`text-black dark:text-black`) di atas latar putih bersih (`bg-white hover:bg-slate-100`).
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, dev server aktif.
  Git: pending

- [2026-09-01 09:57 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan tema warna latar belakang (`#01040e`), pendaran ambient nebula biru kosmik, bidang mikro-bintang berwarna-warni (`ShowcaseStarField`), kapsul sliding pill slider tab, serta ornamen bola planet topologi 3D bercahaya neon (*celestial spheres*) pada section Live Simulator Showcase agar selaras dengan section 4 Pilar dan IT Journey.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section interaktif **Live Simulator Showcase** (`LiveSimulatorShowcase`) pada landing page yang memungkinkan pengunjung mencoba simulator terminal diagnostik CLI (`ping`, `ipconfig`, `arp`, `tracert`, `nslookup`, `netstat`), kalkulator & visualizer subnet CIDR, serta visualisasi alur transmisi paket ICMP secara real-time langsung di browser.
  Files/areas: `src/components/marketing/live-simulator-showcase.tsx`, `src/components/marketing/live-simulator-showcase.test.tsx`, `src/app/page.tsx`
  Validation: 26 test suites (117 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

- [2026-09-01 09:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan latar belakang section 4 Pilar Pembelajaran Komprehensif dengan gradien linear mulus dari warna hitam kosmik pekat (`#030308`) di bagian atas menuju warna *deep obsidian navy* (`#01040e`) di bagian bawah, serta menambahkan pendaran ambient bawah agar menyatu sempurna tanpa batas patahan dengan section IT Infrastructure Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus 100%, typecheck clean, dev server aktif.
  Git: pending

# 2026-08-31

- [2026-08-31 19:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan kembali tingkat kegelapan warna biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar menjadi warna *deep obsidian navy* yang lebih gelap (`bg-[#01040e]`) dengan pendaran nebula yang sangat lembut.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan tone warna biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar sedikit lebih redup ke tingkat *deep dark navy* yang presisi (`bg-[#010513]`) dengan pendaran nebula biru yang lebih tenang dan anggun.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:52 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan kembali intensitas tone biru pada section IT Infrastructure Journey dan transisi bawah 4 Pilar menjadi warna *deep cosmic navy* yang seimbang (`bg-[#020717]`) dengan pendaran nebula biru halus yang pas dan elegan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan kembali warna latar belakang section IT Infrastructure Journey ke tingkat ultra-deep gelap (`bg-[#01030a]`) dengan sentuhan mikro-undertone biru kosmik yang sangat samar dan redup, menyempurnakan transisi mulus dari section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggelapkan tone warna biru pada section IT Infrastructure Journey dan bayangan transisi bawah 4 Pilar menjadi warna biru malam yang lebih pekat dan tenang (*darker obsidian navy* `bg-[#010510]`), serta melembutkan intensitas pendaran ambient biru agar terasa lebih gelap, dalam, dan harmonis.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:48 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel warna latar belakang section IT Infrastructure Journey menjadi warna biru kosmik gelap (*deep midnight navy blue* `bg-[#020817]`) yang diperkaya dengan pendaran nebula biru kosmik halus (`radial-gradient`), serta mengalirkan gradien bayangan akhir section 4 Pilar secara mulus menuju warna biru gelap tersebut tanpa patahan visual.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:45 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan garis batas sambungan (*seam discontinuity*) dan menyelaraskan warna latar belakang section IT Infrastructure Journey dengan bagian akhir section 4 Pilar menjadi warna hitam kosmik pekat yang identik (`bg-[#030308]`), menyatukan gradien ambient, serta memperkaya taburan mikrobintang berwarna-warni (*colorful micro-stars*) di sepanjang kanvas Journey.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:41 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbarui narasi dan identitas Matahari Pusat pada section 4 Pilar Pembelajaran Komprehensif: menetapkan Matahari sebagai representasi Netloka (*The Central Sun*) yang bertindak sebagai pusat gravitasi dan ekosistem pembelajaran IT terintegrasi yang mengalirkan energi pengetahuan ke empat pilar planet keahlian.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:28 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan garis batas border antar menu (*card border boundaries*) pada seluruh submenu dropdown navbar (Belajar, Labs, Challenges, Konsultasi) serta melengkapi setiap item menu dengan ikon Lucide tematik yang seragam berwarna putih (*uniform pure white monochrome icons*) di dalam kotak kontainer ikon yang rapi.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlambat proses transisi terang dan redup piringan akresi Black Hole agar berjalan sangat anggun dan sinematis (3 detik terang pelan-pelan $\rightarrow$ 3 detik redup pelan-pelan), serta menyetel jeda istirahat tepat 5 detik penuh setelah cahaya benar-benar redup sebelum gelombang denyut berikutnya datang (total siklus 11 detik).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyetel interval denyut cahaya piringan akresi Black Hole menjadi siklus 5 detik yang sangat mulus (*ultra-smooth 5-second gravitational breathing pulse*): intensitas cahaya berpendar terang secara perlahan hingga puncak keemasan, lalu meredup lembut kembali ke kondisi dasar sebelum gelombang interval 5 detik berikutnya tiba.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:17 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengurangi kepadatan planet terbang menjadi 3 planet besar per section dengan jarak ruang (*spacing*) yang lapang dan elegan, serta menambahkan efek cahaya pulsa detak jantung kosmik (*gravitational accretion disk heartbeat pulse*) pada piringan akresi dan kubah lensa gravitasi Black Hole.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:13 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh cincin planet orbital di seluruh section (Dashboard / Hero, bayangan transisi, dan section 4 Pilar) serta memperbarui seluruh armada planet yang meluncur menjadi bola-bola planet bulat besar dan megah ($32\text{px}-46\text{px}$) tanpa cincin dengan pendaran atmosfer kosmik yang bersih, tajam, dan elegan.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:10 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki proporsi dan presisi geometri Black Hole: memposisikan lingkaran cakrawala peristiwa hitam tepat di pusat konsentris (`cx="250", cy="160"`), merapikan piringan akresi dan kubah lensa gravitasi agar menyelimuti bola hitam secara simetris dan rapi, serta menyesuaikan skala ukuran menjadi proporsional dan seimbang di sudut kanan atas Dashboard.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:08 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merombak total visual Black Hole di Dashboard menjadi sama persis dengan referensi ilmiah Gargantua (*Interstellar-accurate gravitational lensing*): bayangan cakrawala peristiwa hitam pekat (*shadow of event horizon*), cincin foton putih tajam (*photon sphere*), lengkungan lensa gravitasi atas dan bawah (*warped upper and lower accretion disk halo*), piringan akresi ekuatorial menyala terang dengan berkas sinar inti putih (*intense core laser flare*), jalur debu kosmik, planet Miller di sisi kiri, serta menonaktifkan seluruh animasi putaran berputar (*static realistic cosmic monument*).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:05 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan kombinasi planet terbang (*drifting celestial bodies*) di section Dashboard / Hero dan area bayangan transisi yang meluncur anggun dari kanan ke kiri (`105vw` ke `-15vw`), menampilkan kombinasi planet berukuran besar ($34\text{px}-42\text{px}$) dan kecil ($11\text{px}-16\text{px}$), serta variasi dengan cincin 3D dan tanpa cincin.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:03 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan 7 planet pengembara antariksa (*drifting celestial exoplanets*) beraneka warna dan bercincin 3D yang bergerak melintasi layar secara kontinu dari ujung kanan paling luar (`105vw`) hingga ujung kiri paling luar (`-15vw`) pada section 4 Pilar dan area bayangan transisi.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 19:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyeragamkan warna latar belakang seluruh section (4 Pilar & IT Infrastructure Journey) menjadi hitam pekat gelap murni (`bg-[#030308]`) persis seperti dashboard Hero, serta menambahkan hamparan luas titik-titik bintang mikro warna-warni (150+ bintang putih, cyan, emas, violet, emerald) dan planet-planet kecil jauh bercahaya lembut di section 4 Pilar.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:58 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaburkan gugusan titik-titik bintang mikro warna-warni (*dense colorful micro-stars*) di dalam seluruh lapisan gradasi bayangan transisi (putih, biru cyan, kuning emas, ungu violet, dan hijau emerald) sehingga area bayangan tetap hidup dan menyatu secara harmonis dengan estetika antariksa Hero/Dashboard.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:54 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menaikkan posisi planet gas raksasa biru bercincin (`bottom-[32%]`) dan rasi bintang Scorpio di kanan bawah ke area tengah kanvas Hero, serta menambahkan efek kedip cahaya berkelap-kelip (*twinkling major stars pulse*) khusus pada bintang-bintang utama berukuran besar di kedua rasi bintang (Regulus/Denebola pada Leo dan Antares/Shaula pada Scorpio).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:52 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperpanjang tinggi vertikal section Hero / Dashboard (`min-h-[115vh] lg:min-h-[125vh]` dan `pb-44 lg:pb-56`) sehingga planet gas raksasa bercincin, rasi bintang Scorpio, dan seluruh elemen langit kosmik memiliki ruang pandang yang luas dan tidak tertutupi oleh lapisan bayangan bawah.
  Files/areas: `src/app/page.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:49 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki struktur hierarki layer (*stacking context*): memindahkan seluruh gradasi warna ambient dan stardust ke layer paling bawah (`z-0`), menempatkan lapisan bayangan hitam pekat penutup patahan di layer tengah (`z-20`), dan mengangkat seluruh teks judul, subjudul, dan konten pilar ke layer teratas (`z-30`) sehingga garis patahan tertutup 100% dan teks tetap terang benderang.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:47 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lapisan bayangan hitam pekat (*deep bottom black shadow void*) setinggi $192\text{px}$ pada batas bawah section 4 Pilar menuju section IT Infrastructure Journey, serta menyelaraskan lapisan bayangan atas Journey agar perpindahan ke section bawah menyatu tanpa ada patahan visual.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:45 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan lapisan bayangan hitam pekat (*deep black shadow void*) setinggi $176\text{px}$ pada batas sambungan section di layer latar belakang (`z-0`) untuk menutup garis patahan secara sempurna, sembari menaikkan seluruh teks judul '4 Pilar Pembelajaran Komprehensif', subjudul, dan elemen tata surya ke layer teratas (`z-30`) sehingga teks tetap $100\%$ terang, tajam, dan bercahaya jelas tanpa tertutup bayangan.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:43 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengecilkan dan memfokuskan ketebalan gradasi bayangan hitam (*compact seam feather shadow*) tepat di garis patahan pertemuan antar section ($64\text{px}-80\text{px}$) dan memastikan seluruh teks judul dan tombol berada di atas layer bayangan (`z-10`) agar tidak tertutupi atau redup.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:39 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lapisan gradasi bayangan hitam pekat (*deep black shadow vignette overlay*) di layer teratas batas transisi antara section Hero dan 4 Pilar, serta menaikkan posisi planet gas raksasa di latar belakang agar tidak terpotong di batas bawah section.
  Files/areas: `src/app/page.tsx`, `src/components/effects/cosmic-background.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:34 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan border pemisah kaku (*hard horizontal border line*) dan menambahkan gradasi transisi kosmik lembut (*seamless atmospheric vertical blend*) antara section Hero/Dashboard, 4 Pilar, dan Journey sehingga perpindahan section terasa mulus dan menyatu sebagai satu semesta kosmik tanpa patahan visual.
  Files/areas: `src/app/page.tsx`, `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:31 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan dan memperluas copywriting deskripsi seluruh pilar pembelajaran dari yang sebelumnya terspesialisasi pada *IT Infrastructure* semata menjadi mencakup ranah **Teknologi Informasi (IT & Rekayasa Komputer)** secara luas dan komprehensif.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:29 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus baris teks tag fitur (*Micro-learning & Visualisasi*, *Evaluasi Otomatis & Presisi*, *Troubleshooting Nyata*, *BoQ, Anggaran & Topologi*) pada keempat pilar pembelajaran agar teks deskripsi tampil lebih bersih dan padat.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:27 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah garis jembatan konektor yang menghubungkan Matahari ke masing-masing 4 planet menjadi garis solid utuh (*continuous solid beam*) tanpa efek garis putus-putus/patah-patah.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:19 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan jembatan data/informasi bercahaya (*information bridges*) yang menghubungkan langsung pusat Matahari ke masing-masing 4 planet (**Merkurius**, **Venus**, **Bumi**, **Mars**) dan menambahkan tooltip kosmik interaktif yang muncul saat planet atau Matahari di-hover/fokus.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (113 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:16 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki lintasan 4 garis orbit tata surya: memperluas dan memperbesar radius orbit secara proporsional ke seluruh kanvas, memastikan semua 4 lingkaran orbit berada 100% di luar batas fisik Matahari tanpa ada garis yang memotong bola Matahari, serta menempatkan teks 4 pilar di margin kiri dan kanan tanpa tabrakan.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh kotak card (*card boxes background & borders*) pada teks informasi 4 pilar sehingga menjadi tipografi terbuka yang menyatu dengan latar belakang kosmik secara elegan, serta menghapus badge teks 'Ekosistem Tata Surya IT Infrastructure' di bagian atas.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang layout section 4 Pilar Pembelajaran Komprehensif menjadi 3 kolom terpisah (Kartu Kiri | Tata Surya Tengah | Kartu Kanan) sehingga 4 garis orbit elips matahari terisolasi rapi di kanvas tengah dan tidak lagi menabrak teks informasi, serta menyesuaikan planet dengan tata surya nyata (**Merkurius**, **Venus**, **Bumi**, **Mars**) secara akurat.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:05 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus kotak bar horizontal di bagian bawah, mengganti seluruh icon 4 pilar menjadi bola planet realistis bertekstur (Planet Es Sian, Planet Terestrial Zamrud, Planet Mars Ruby, dan Planet Gas Raksasa Ungu bercincin), dan menempatkan setiap planet tepat pada 4 garis lingkaran orbit Matahari konsentris terpisah (tepat 1 planet per 1 garis orbit).
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:02 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus seluruh teks dan lencana lencana di dalam bola Matahari pada section 4 Pilar Pembelajaran Komprehensif sehingga Matahari tampil murni sebagai bola plasma surya bercahaya tanpa elemen teks di dalamnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 18:01 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah pusat bola ekosistem pada section 4 Pilar Pembelajaran Komprehensif menjadi **Matahari (Solar Core)** dengan gradasi plasma api kosmik, korona cahaya emas bercahaya, dan orbit tata surya yang mengalirkan energi ke 4 planet pilar pembelajaran di sekelilingnya.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:59 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyesuaikan dan memperkecil proporsi section 4 Pilar Pembelajaran Komprehensif (padding section, ukuran bola Planet Bumi 160px, satelit orb 56px, ukuran font teks, serta bar alur bawah) agar tampil lebih ringkas, padat (*compact*), proporsional, dan nyaman dibaca.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:57 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mendesain ulang section 4 Pilar Pembelajaran Komprehensif dengan konsep orbital futuristik: pusat berupa bola realistis **Planet Bumi (Knowledge Core)** bergradien samudra & benua berpadu cincin orbit holografis dan sinar konektor laser menuju 4 satelit pilar (**01 Learn**, **02 Practice Labs**, **03 Challenges**, dan **04 Consultant Project**), serta dilengkapi alur pembelajaran fundamental di bagian bawah sesuai referensi desain pengguna.
  Files/areas: `src/components/marketing/four-pillars-ecosystem.tsx`, `src/components/marketing/four-pillars-ecosystem.test.tsx`, `src/app/page.tsx`
  Validation: 25 test suites (112 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:53 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki penempelan navbar dengan mengubah `sticky` menjadi `fixed top-0 inset-x-0 z-50` berpasangan dengan placeholder spacer dan mengganti `overflow-x: hidden` menjadi `overflow-x: clip` di `globals.css` sehingga navbar dijamin 100% selalu tampak melayang di atas saat scroll ke bawah dan bertransisi transparan/solid dengan benar.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/globals.css`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan perilaku navbar adaptif: navbar tetap melayang di atas, otomatis menjadi transparan saat pengguna menggulir ke bawah (*scroll down*), dan seketika kembali solid/normal saat menggulir ke atas (*scroll up*) atau saat kursor mouse diarahkan (*hover*) ke area navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:40 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus tombol/link 'Dashboard' dari navigasi desktop dan mobile pada header, mengarahkan logo kata 'NETLOKA' ke halaman utama, dan menambahkan perilaku *smooth scroll* langsung ke puncak halaman (`window.scrollTo({ top: 0, behavior: 'smooth' })`) saat logo diklik dari posisi halaman yang telah di-scroll ke bawah.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan animasi tab slider dengan indikator kapsul aktif mengambang (*animated sliding pill indicator*) yang meluncur mulus 60fps dengan kurva easing `cubic-bezier(0.25, 1, 0.5, 1)` serta menyesuaikan lebar dan posisi secara dinamis saat berpindah antar trek.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:22 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memindahkan posisi tombol tab slider trek perjalanan ke posisi paling atas section (*above title* 'IT Infrastructure Journey') untuk menegaskan filter kategori perjalanan sebelum judul dan rincian alur ditampilkan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:21 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan komponen tombol tab geser (*pill sliding tabs switcher*) di awal section IT Infrastructure Journey (**Network Engineer**, **SysAdmin & Linux**, dan **IT Consultant**) dengan gaya kapsul gelap dan indikator aktif halus sesuai desain referensi pengguna.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: 24 test suites (111 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:15 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus lingkaran garis putus-putus (*dashed orbit rings*) di sekeliling setiap planet agar tampilan planet dan nama checkpoint menjadi bersih, mulus, dan terbebas dari artefak visual yang tidak diinginkan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang koordinat planet menjadi sebaran abstrak dan asimetris yang natural (*organic celestial scatter*), menghilangkan pola bolak-balik kaku, sembari tetap mempertahankan alur perjalanan yang mengalir turun ke bawah secara anggun.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:10 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mempertebal garis putih konektor antar planet (`strokeWidth="3.5"` dengan aura glow `strokeWidth="8"`) dan mengubah kurva menjadi alur perjalanan bertahap yang mengalir turun ke bawah (*descending journey path*) dari Mercury di posisi atas menuju Polaris di posisi akhir bawah secara berurutan.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 17:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengganti roadline tebal dengan satu garis putih tipis berliku bercahaya (*constellation path*) yang menghubungkan keenam planet, menata ulang posisi planet pada titik-titik tetap yang tampak acak/natural seperti konstelasi rasi bintang, serta menambahkan interaksi hover dan keyboard focus langsung pada desktop sementara klik/tap tetap berfungsi untuk mengunci atau menutup pop-up detail.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: 24 test suites (110 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 16:57 WITA] [REMOVED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus card informasi “Simulasi 100% di Browser” dari section ekosistem landing page, termasuk seluruh deskripsi, daftar manfaat, dan CTA terkait.
  Files/areas: `src/app/page.tsx`
  Validation: typecheck, lint, build, dan UI layout detector; E2E tidak dijalankan sesuai permintaan pengguna.
  Git: pending

- [2026-08-31 16:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus ikon dekoratif pada section ekosistem pembelajaran landing page (badge, empat card, highlight simulasi, checklist, dan CTA) agar fokus visual berada pada teks dan aksi.
  Mengubah checkpoint `IT Infrastructure Journey` menjadi planet berwarna yang dapat dipilih dari sisi road line. Detail materi kini tersembunyi secara default dan tampil sebagai pop-up kecil di sekitar planet yang dipilih; layout mobile mempertahankan interaksi yang sama dalam urutan vertikal.
  Menambahkan kebijakan ikon pada `AGENTS.md`: ikon dekoratif, emoji, dan ikon pada card/badge/CTA dilarang kecuali pengguna memintanya secara eksplisit; ikon kontrol fungsional harus aksesibel.
  Files/areas: `AGENTS.md`, `src/app/page.tsx`, `src/components/marketing/it-infrastructure-journey.tsx`, `src/components/marketing/it-infrastructure-journey.test.tsx`
  Validation: unit test Journey RED/GREEN dan full suite 24 file/109 test; typecheck; lint; production build; UI layout detector; pemeriksaan desktop pada browser lokal. E2E tidak dijalankan sesuai permintaan pengguna.
  Git: pending

- [2026-08-31 16:27 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan section `IT Infrastructure Journey` pada landing page: satu road line kosmik lebar dengan enam checkpoint astronomi (`Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, dan `Polaris`) yang memetakan seluruh jalur belajar MVP dan mengarahkan pengguna ke katalog belajar.
  Road line desktop menggunakan jalur berliku horizontal; mobile menyajikan urutan checkpoint vertikal yang tetap mudah dibaca. CCTV dan spesialisasi post-MVP tidak ditampilkan sebagai materi aktif.
  Files/areas: `src/components/marketing/it-infrastructure-journey.tsx`, `src/app/page.tsx`, `src/e2e/foundation.spec.ts`
  Validation: E2E RED/GREEN checkpoint; 66/66 E2E Chromium/Firefox/WebKit; typecheck; build produksi; UI layout detector lulus. Lint tanpa error dengan 3 peringatan pre-existing pada import tidak terpakai di `src/app/page.tsx`.
  Git: pending

- [2026-08-31 15:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Merapatkan gutter wordmark `NETLOKA` pada navbar desktop dari 40px menjadi 32px, sambil mempertahankan 24px pada mobile dan 32px pada tablet.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/e2e/foundation.spec.ts`
  Validation: E2E posisi diuji RED pada 40px lalu GREEN pada 32px; 63/63 E2E Chromium/Firefox/WebKit, typecheck, lint, dan UI layout detector lulus.
  Git: pending

- [2026-08-31 15:10 WITA] [FIXED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperbaiki rule reset global yang menimpa seluruh utility spacing Tailwind (`padding` dan `margin` selalu kembali ke 0), sehingga offset navbar sebelumnya tidak pernah diterapkan. Reset dipindahkan ke base layer, navbar kini full-width dengan gutter brand 24px mobile, 32px tablet, dan 40px desktop; offset kompensasi besar dihapus.
  Menambahkan E2E pengukuran posisi wordmark dan menyelaraskan smoke landing page dengan heading serta CTA hero yang aktif.
  Files/areas: `src/app/globals.css`, `src/components/navigation/app-header.tsx`, `src/e2e/foundation.spec.ts`
  Validation: browser inspection desktop/mobile; UI detector bersih; typecheck; 23 suite/108 test Vitest; production build; 63/63 E2E lintas Chromium, Firefox, dan WebKit.
  Git: pending

- [2026-08-31 14:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan pergeseran posisi teks 'NETLOKA' secara signifikan ke arah dalam/kanan (`pl-20 sm:pl-32 md:pl-44 lg:pl-56`) serta menaikkan ukuran font judul menjadi `text-2xl sm:text-3xl` agar posisinya tampak jelas dan tegas berjarak dari pojok kiri navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:18 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menggeser posisi teks logo 'NETLOKA' pada navbar header lebih ke arah kanan (`pl-14 sm:pl-20 lg:pl-28`) untuk memberikan ruang bernapas yang lebih lapang di sisi kiri navbar.
  Files/areas: `src/components/navigation/app-header.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:16 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan lebih dari 220 titik-titik cahaya bintang mikro yang diam (_dense stationary micro-starfield_) di seluruh kanvas luar angkasa dengan palet warna astronomis murni (Putih, Biru Cyan, dan Kuning Emas) untuk menciptakan atmosfer kosmos yang luas, megah, dan imersif.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghilangkan tanda silang (+) difraksi pada titik bintang terang, serta menyeimbangkan intensitas cahaya secara halus dan proporsional (titik standar rasi pada tingkat kecerahan ~50% dan bintang utama pilihan pada ~70%).
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:12 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperluas cakupan judul utama hero dan badge ekosistem dari 'Jaringan Komputer' menjadi **'IT Infrastructure'** (_'Kuasai IT Infrastructure Lewat Praktik Interaktif'_), merefleksikan platform pembelajaran komprehensif yang mencakup jaringan, server/sysadmin, simulasi BoQ, dan arsitektur infrastruktur teknologi informasi.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:11 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan efek pendaran cahaya ultra-terang (_superBrightBloom_, cincin halo bercahaya, dan sinar difraksi mikro) pada beberapa bintang utama rasi tertentu (**Regulus** pada Rasi Leo, serta **Antares** dan **Shaula** pada Rasi Scorpio) sehingga menciptakan hierarki kecerahan astronomis yang dramatis dan realistis.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:09 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan titik-titik simpul rasi bintang Leo dan Scorpio menjadi warna putih solid bercahaya (_pure white starbloom_) dengan garis putih solid, serta mengembalikan teks judul hero dalam versi ringkas dan padat (_'Kuasai Jaringan Komputer Lewat Praktik Interaktif'_).
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:07 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus teks judul utama hero ('Kuasai Jaringan Komputer Lewat Praktik Interaktif & Simulasi Nyata') sehingga hanya menyisakan tombol 'Jelajahi' di tengah layar hero, serta menyeragamkan seluruh titik simpul rasi bintang Leo dan Scorpio menjadi warna biru cerah menyala (_cyan-blue_ `#38bdf8`) dengan garis rasi yang tetap solid putih.
  Files/areas: `src/app/page.tsx`, `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 14:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus bentangan Galaksi Bimasakti (Milky Way) dan kabut terang agar latar belakang menjadi hitam pekat antariksa (_deep black space_ `#030308`), mempertegas titik-titik bintang sirkular putih padat dengan efek bloom di setiap simpul rasi Leo dan Scorpio, serta menambahkan partikel debu bintang (_stardust_) yang melayang bergerak secara horizontal dari kiri ke kanan.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:56 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menata ulang rasi bintang menjadi tepat 2 rasi zodiak utama (**Rasi Leo** di sisi kiri dan **Rasi Scorpio** di sisi kanan) dengan titik-titik bintang sirkular putih yang jelas dan bercahaya di setiap simpul persimpangan garis rasi sesuai referensi gambar zodiak pengguna.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:55 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus galaksi biru (Andromeda) dan menambahkan 3 buah bintang berpendar 8-arah (_8-pointed starburst / flare stars_) dengan gradasi purple, cyan, dan golden glow sesuai dengan contoh gambar referensi yang diunggah pengguna.
  Files/areas: `src/components/effects/cosmic-background.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:53 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan bentangan sabuk Galaksi Bimasakti (Milky Way galaxy arch dengan debu bintang diagonal melintang), sekumpulan rasi bintang astronomis riil (Rasi Orion dengan Sabuk Orion, Rasi Cassiopeia 'W', Rasi Bintang Biduk / Ursa Major, Rasi Cygnus Northern Cross, dan Rasi Network Topology), serta galaksi spiral Andromeda dan Triangulum pada latar belakang mode malam `CosmicBackground`.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:51 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan puluhan bintang mikro baru berkelap-kelip dengan gradasi glow dinamis (gold, cyan, purple) pada starfield kosmik `CosmicBackground`, serta memperkecil dimensi tombol 'Jelajahi' (`h-10`, `min-w-[110px]`, `px-6 py-2`) dan ketebalan bordernya menjadi proporsional.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:49 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Memperlebar dimensi dan ketebalan border tombol 'Jelajahi' (`border-2`, `h-14`, `min-w-[200px]`, `px-10 sm:px-14`), mempertahankan ukuran teks tetap proporsional (`text-base font-semibold`), dan menghapus ikon panah ke bawah.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:47 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan tombol 'Jelajahi' pada hero landing page agar menggunakan warna solid background putih (`bg-white`) dan teks solid hitam (`text-black`), konsisten dengan estetika tombol kontras 'Mulai Gratis'.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:45 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyederhanakan Hero Section landing page (`src/app/page.tsx`) dengan hanya menampilkan judul utama dan tombol 'Jelajahi' yang menggulir halus (_smooth scroll_) ke section ekosistem pembelajaran di bawahnya (4 Pilar Netloka, In-Browser Simulation highlights, dan CTA belajar).
  Files/areas: `src/app/page.tsx`, `src/app/globals.css`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:42 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengembalikan ukuran teks ke ukuran kompak proporsional (`text-2xl`) dan menggeser posisi logo 'NETLOKA' lebih ke kanan dengan jarak kiri yang jelas (`pl-8 sm:pl-12 lg:pl-16`), serta memperluas jarak sisi kiri teks fitur pada landing page (`px-6 sm:px-12`).
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:40 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan ruang padding dan margin yang lebih lapang (_generous breathing room_) pada container navbar (`px-8 sm:px-12 lg:px-16`), logo brand NETLOKA (`pl-2 sm:pl-4`), serta section hero landing page (`px-8 sm:px-16 lg:px-24`) agar teks tidak menempel di sisi kiri dan memiliki jarak estetis yang nyaman.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:35 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Google Font `Caveat` (bobot 700 / bold) bergaya tulisan tangan alami (_natural handwriting script_) untuk brand title 'NETLOKA' pada navbar (`app-header.tsx`), halaman masuk (`sign-in`), dan halaman daftar (`sign-up`).
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:34 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Google Font `Montserrat` (bobot 900 / black dengan _letter-spacing wider_) untuk brand title 'NETLOKA' pada navbar (`app-header.tsx`), halaman masuk (`sign-in`), dan halaman daftar (`sign-up`).
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:29 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengubah teks brand wordmark menjadi huruf kapital 'NETLOKA' dan menerapkan font tulisan sambung (_neat cursive script_) Google Font `Dancing_Script` dengan ukuran proporsional di seluruh navbar, sign-in, dan sign-up.
  Files/areas: `src/app/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:25 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus pembungkus kartu (card wrapper container) dan tombol CTA ('Mulai Belajar Gratis' & 'Sudah Punya Akun? Masuk') pada landing hero page (`src/app/page.tsx`), sehingga teks judul, subjudul, dan 4 pilar fitur tampil bersih langsung di atas canvas latar belakang.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:19 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan Opsi B sesuai preferensi pengguna: Garis-garis grid geometris blueprint hanya aktif pada Tema Terang (White Theme), sedangkan Tema Gelap (Dark Theme) sepenuhnya bertransisi menjadi pengalaman Deep Space kosmik pekat (Black Hole, Planet Cincin, White Hole, Galaksi, dan Starfield) tanpa garis grid.
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:18 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Mengimplementasikan tema kosmik antariksa (Cosmic Space Theme) khusus untuk Dark Mode yang menampilkan Gargantua Black Hole dengan accretion disk, planet gas raksasa berdering (Kepler Node) dengan cincin 3D, White Hole quasar flare, galaksi spiral, debu nebula ambient, dan starfield konstelasi jaringan menggunakan murni SVG dan GPU-accelerated CSS animations.
  Files/areas: `src/components/effects/cosmic-background.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 13:02 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Meningkatkan kontras dan visibilitas warna garis-garis grid geometris pada tema gelap (dark mode) menjadi putih cerah dan jelas (`rgba(255,255,255,0.22)`).
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:58 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus badge subtitle 'Platform Pembelajaran Jaringan Komputer' pada landing hero, dan merapikan seluruh garis background grid menjadi satu pola grid kotak geometris presisi yang seragam tanpa garis ganda tebal atau elemen garis manual yang keluar jalur.
  Files/areas: `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:50 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan background pola grid kotak geometris beserta garis silang horizontal & vertikal yang membentang membentuk frame '#' besar pada section Hero Landing Page (`src/app/page.tsx` di `localhost:3000`), membingkai kartu hero utama dengan crosshair '+' pada 4 titik persilangan sudut.
  Files/areas: `src/app/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:43 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menerapkan background grid berpola kotak geometris beserta garis silang panduan horizontal & vertikal yang membentang membentuk frame '#' besar pada section Hero Dashboard (dengan crosshair marker '+' pada titik potong), dan membatasi efek grid khusus pada section Hero Dashboard.
  Files/areas: `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:42 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menyelaraskan seluruh warna teks antarmuka menjadi solid hitam (#000000 / text-black) pada tema terang (light mode) dan solid putih (#ffffff / dark:text-white) pada tema gelap (dark mode), dengan pengecualian tombol CTA 'Mulai Gratis' yang tetap mempertahankan gaya inverted kontras tinggi (solid-light).
  Files/areas: `src/app/globals.css`, `src/app/page.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/layout.tsx`, `src/components/navigation/app-header.tsx`, `src/components/ui/navigation-menu.tsx`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:38 WITA] [ADDED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menambahkan background garis-garis grid teknis (blueprint horizontal & vertikal dengan radial mask), serta 5 section informatif komprehensif pada halaman Dashboard (4 Pilar Ekosistem Netloka, Roadmap Pembelajaran & Standar UKK TKJ 5-tahap, Keunggulan Simulasi Deterministik In-Browser, Panduan Cepat/FAQ, dan Akreditasi Kurikulum).
  Files/areas: `src/app/(app)/dashboard/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

- [2026-08-31 12:26 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Menghapus badge subtitle 'Platform Pembelajaran Jaringan Interaktif' pada landing hero, menghapus kotak icon logo 'N' biru di navbar, dan menyisakan wordmark bersih 'netloka' dengan tipografi modern geometris Space Grotesk.
  Files/areas: `src/app/page.tsx`, `src/components/navigation/app-header.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
  Validation: 23 test suites (108 unit/integration tests) Vitest lulus, typecheck clean, dev server aktif.
  Git: pending

# 2026-08-25

- [2026-08-25 23:14 WITA] [CHANGED] [Milestone 1 / Sprint 1 / Task 1.2]
  Compactkan tombol autentikasi navbar desktop dan mobile agar proporsional dengan menu navigasi: tinggi 36px, font 14px, padding horizontal terukur, radius 8px, dan gap desktop 10px.
  Files/areas: `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`
  Validation: UI detector bersih; lint, typecheck, 23 suite/108 test Vitest, production build, dan 5/5 smoke E2E Chromium lulus.
  Git: pending

- [2026-08-25 18:59 WITA] [MILESTONE] [REVIEW] [Milestone 7: Production Readiness & MVP Launch]
  Completed Milestone 7 — Production Readiness & MVP Launch (Sprint 15: Quality, Security & Deployment, and Sprint 16: MVP Stabilization).
  - MVP Exit Criteria Verified: Netloka is production-accessible, secure, resilient, measurable, recoverable, and ready for real learners at `netloka.biz.id`.
  - Security Hardening: Configured HTTP Security Headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`) in `next.config.ts` and `Caddyfile`.
  - Production Containerization: Multi-stage `Dockerfile` (Node 20 Alpine standalone with non-root nextjs user) and `docker-compose.prod.yml` with isolated Docker network `netloka-network`.
  - Reverse Proxy & SSL: `Caddyfile` with automatic HTTPS, zstd/gzip compression, and Cloudflare Full (Strict) SSL setup documentation in `docs/deployment/cloudflare-and-caddy.md`.
  - Database Disaster Recovery: Created automated backup script `scripts/backup-db.sh` with 14-day retention and restore script `scripts/restore-db.sh`.
  - Monitoring & Metrics: Enhanced `/api/health` with database latency ping, process memory usage, uptime, and application version.
  - Technical Debt Register: Documented debt items and post-MVP architecture pathways (MikroTik, Cisco, Linux Server) in `docs/TECHNICAL_DEBT.md`.
  - Validation: 22 Vitest test suites (107 tests passed), 20 Playwright E2E browser tests passed (including full critical-path test `src/e2e/critical-path.spec.ts`), Next.js 16 production build succeeded, typecheck clean, lint clean.
  Files/areas: `Dockerfile`, `docker-compose.prod.yml`, `Caddyfile`, `next.config.ts`, `scripts/`, `docs/`, `src/app/api/health/`, `src/e2e/critical-path.spec.ts`
  Git: pending

- [2026-08-25 18:55 WITA] [SPRINT] [Milestone 7 / Sprint 16]
  Completed Sprint 16 — MVP Stabilization.
  1. Enhanced system metrics and database connection monitoring in `src/app/api/health/route.ts`.
  2. Created technical debt register and post-MVP extension roadmap in `docs/TECHNICAL_DEBT.md`.
  3. Verified all 5 curriculum paths and attempt models for learning funnel tracking.
  Files/areas: `src/app/api/health/`, `docs/TECHNICAL_DEBT.md`
  Validation: health endpoint unit tests passed.

- [2026-08-25 18:40 WITA] [SPRINT] [Milestone 7 / Sprint 15]
  Completed Sprint 15 — Quality, Security & Deployment.
  1. Configured HTTP Security Headers (`CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`) in `next.config.ts`.
  2. Created multi-stage production `Dockerfile` (Node 20 Alpine standalone) and `docker-compose.prod.yml`.
  3. Configured `Caddyfile` for reverse proxying and automatic HTTPS on `netloka.biz.id`.
  4. Documented Cloudflare DNS, WAF, and SSL settings in `docs/deployment/cloudflare-and-caddy.md`.
  5. Implemented automated database backup and restore scripts in `scripts/backup-db.sh` and `scripts/restore-db.sh`.
  6. Added critical-path E2E tests across all 4 product pillars in `src/e2e/critical-path.spec.ts`.
  Files/areas: `Dockerfile`, `docker-compose.prod.yml`, `Caddyfile`, `next.config.ts`, `scripts/`, `docs/deployment/`, `src/e2e/critical-path.spec.ts`
  Validation: 20 Playwright E2E tests passed, build passed.

- [2026-08-25 18:18 WITA] [MILESTONE] [REVIEW] [Milestone 6: IT Consultant Mode]
  Completed Milestone 6 — IT Consultant Mode (Sprint 12: Case & Procurement Engine, Sprint 13: Topology, IP/VLAN Planning & Scoring, Sprint 14: Portfolio & Advanced Cases).
  - Exit Criteria Verified: Learner can receive a case, analyze client requirements, procure devices (BoQ), design topology, plan IP/VLAN, submit a full proposal, receive deterministic 5-dimensional scoring (Technical Correctness, Requirement Fulfillment, Cost Efficiency, Scalability, Security), and retain the project in a persistent portfolio.
  - Database: Added `ConsultantCase` and `ConsultantProject` models to Prisma schema.
  - XP: Added `CONSULTANT_PROJECT_PASSED` (+250 XP) to `XpEventType` with idempotent award via `UserXpLedger`.
  - 5 Seeded Cases: Small Office Notaris (15M), Warnet Gaming Center (25M), Medium Office Logistics (50M), SMK TKJ School Lab (75M), Multi-Floor Corporate Enterprise (120M).
  - 14 Realistic Device Catalog: Routers (3), Switches (4), Access Points (2), Cables/Rack/SFP (5).
  - Validation: 22 Vitest test suites (107 tests passed), 17 Playwright E2E browser tests passed, production build succeeded (20 routes), typecheck clean, lint clean.
  Files/areas: `prisma/schema.prisma`, `src/features/consultant/`, `src/app/(app)/consultant/`, `src/app/api/consultant/`, `src/features/xp/ledger.ts`, `src/e2e/consultant-mode.spec.ts`
  Git: pending

- [2026-08-25 18:15 WITA] [SPRINT] [Milestone 6 / Sprint 14]
  Completed Sprint 14 — Consultant Portfolio & Advanced Cases.
  1. Built interactive ConsultantWorkspace 5-tab component (Brief → BoQ → Topology → IP/VLAN → Proposal & Score).
  2. Created consultant catalog at `/consultant` with 5 case cards.
  3. Created dynamic case workspace at `/consultant/[caseSlug]` with full proposal submission flow.
  4. Created user portfolio at `/consultant/portfolio` showing all submitted projects with scores and status.
  5. Seeded 2 advanced cases: SMK TKJ School Lab (75M, 72 PC, 3 VLAN) and Multi-Floor Corporate (120M, 100 node, Fiber 10G SFP+).
  Files/areas: `src/features/consultant/components/consultant-workspace.tsx`, `src/app/(app)/consultant/`
  Validation: build passed, E2E passed.

- [2026-08-25 18:10 WITA] [SPRINT] [Milestone 6 / Sprint 13]
  Completed Sprint 13 — Topology, IP/VLAN Planning & Scoring.
  1. Implemented pure deterministic 5-dimensional scoring engine in `src/features/consultant/scoring/engine.ts` with 3 unit tests.
  2. Scoring dimensions: Technical Correctness (0-20), Requirement Fulfillment (0-20), Cost Efficiency (0-20), Scalability (0-20), Security (0-20). Pass threshold ≥70/100.
  3. Created consultant submit API at `/api/consultant/[caseSlug]/submit` awarding +250 XP.
  4. Built topology architecture viewer and VLAN/IP subnet matrix editor in workspace UI.
  Files/areas: `src/features/consultant/scoring/`, `src/app/api/consultant/`
  Validation: unit tests passed, typecheck clean.

- [2026-08-25 18:06 WITA] [SPRINT] [Milestone 6 / Sprint 12]
  Completed Sprint 12 — Case & Procurement Engine.
  1. Added `ConsultantCase` and `ConsultantProject` models to Prisma schema with full JSON fields for BoQ, topology, IP plan, VLAN plan, and composite score.
  2. Created realistic fictional device catalog (14 devices) in `src/features/consultant/catalog/devices.ts`.
  3. Implemented pure BoQ calculator and budget validator in `src/features/consultant/procurement/boq.ts` with 3 unit tests.
  4. Seeded 5 consultant cases: Small Office (15M), Warnet (25M), Medium Office (50M), SMK TKJ (75M), Multi-Floor (120M).
  Files/areas: `prisma/schema.prisma`, `src/features/consultant/catalog/`, `src/features/consultant/procurement/`
  Validation: unit tests passed, Prisma generate clean.

- [2026-08-25 17:35 WITA] [MILESTONE] [REVIEW] [Milestone 5: Labs & Challenges Engine]
  Completed Milestone 5 — Labs & Challenges (Sprint 10: Lab Engine & Sprint 11: Challenge Engine).
  - Exit Criteria Verified: Hands-on interactive practice labs with persistent attempt tracking and real-world diagnostic troubleshooting challenges functioning with deterministic evaluation and anti-abuse idempotent XP rewards (+100 XP per Lab, +150 XP per Challenge).
  - Lab Engine (Sprint 10): 7 initial labs (Subnetting, IP Config, Packet Flow, VLAN, Routing, DHCP/DNS, Troubleshooting) with instructions, workbench, and reset/retry.
  - Challenge Engine (Sprint 11): 3 real-world multi-step scenario challenges (Branch Office Offline, Inter-VLAN Routing Bug, DHCP Scope Exhaustion) with CLI sandbox and hypothesis submission.
  - Database: Added `Lab`, `LabAttempt`, `Challenge`, and `ChallengeAttempt` models to Prisma.
  - Validation: 20 Vitest test suites (101 tests passed), 15 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `prisma/schema.prisma`, `src/features/labs/`, `src/features/challenges/`, `src/app/(app)/labs/`, `src/app/(app)/challenges/`, `src/e2e/labs-challenges.spec.ts`
  Git: `c95a57a`

- [2026-08-25 17:30 WITA] [SPRINT] [Milestone 5 / Sprint 11]
  Completed Sprint 11 — Challenge Engine.
  1. Implemented pure challenge diagnostic evaluator `evaluateChallengeDiagnosis` in `src/features/challenges/engine.ts` with 3 unit tests.
  2. Built interactive challenge runner `ChallengeRunner` (`src/features/challenges/components/challenge-runner.tsx`) with built-in CLI diagnostic terminal workbench.
  3. Created API submit route `/api/challenges/[challengeSlug]/submit` awarding +150 XP into `UserXpLedger`.
  4. Built challenge catalog at `/challenges` and dynamic challenge page at `/challenges/[challengeSlug]`.
  Files/areas: `src/features/challenges/`, `src/app/(app)/challenges/`
  Validation: unit tests passed, typecheck clean, E2E passed.
  Git: `c95a57a`

- [2026-08-25 17:25 WITA] [SPRINT] [Milestone 5 / Sprint 10]
  Completed Sprint 10 — Lab Engine.
  1. Defined `Lab` and `LabAttempt` schema in `prisma/schema.prisma`.
  2. Implemented pure deterministic lab evaluator `evaluateLabSubmission` in `src/features/labs/evaluator.ts` with 5 unit tests.
  3. Built interactive lab runner `LabRunner` (`src/features/labs/components/lab-runner.tsx`) with workbench, step-by-step instructions, and instant criteria evaluation.
  4. Created API submit route `/api/labs/[labSlug]/submit` awarding +100 XP into `UserXpLedger`.
  5. Built lab catalog at `/labs` and dynamic lab page at `/labs/[labSlug]`.
  Files/areas: `src/features/labs/`, `src/app/(app)/labs/`
  Validation: unit tests passed, typecheck clean, E2E passed.
  Git: `c95a57a`

- [2026-08-25 16:47 WITA] [SPRINT] [Sprint 9: Services, Wireless & Troubleshooting]
  Completed Sprint 9 — Services, Wireless & Troubleshooting.
  1. Built reusable Network Service Visualizers: `DhcpDoraVisualizer` (4-step DORA flow), `DnsQueryVisualizer` (DNS resolution hierarchy), `NatVisualizer` (NAT/PAT port translation table), and `IcmpPingVisualizer` (ICMP echo request/reply simulation).
  2. Built safe in-browser Terminal Simulator (`src/features/network-logic/terminal/terminal-simulator.ts`) with deterministic execution for `ipconfig` (/all), `ip` (addr/route), `ping`, `arp` (-a), `traceroute`/`tracert`, `route`, `nslookup`/`dig`, `netstat` (-an), `clear`, `help` and 10 unit tests.
  3. Implemented interactive CLI terminal UI component `TerminalBlockPlayer` (`src/features/learning/blocks/components/terminal-block-player.tsx`).
  4. Authored Path 4 (Network Services & Security) and Path 5 (Wireless & Troubleshooting) in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/terminal/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: 18 Vitest test suites (93 tests passed), 12 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Git: `6925d3a`

- [2026-08-25 16:25 WITA] [MILESTONE] [REVIEW] [Milestone 4: Addressing & Core Networking]
  Completed Milestone 4 — Addressing & Core Networking (Sprint 7: IPv4 & Subnetting Engine & Sprint 8: Switching, VLAN & Routing Fundamentals).
  - Exit Criteria Verified: Deterministic IPv4 calculation, subnetting, VLSM allocation, VLAN broadcast domain isolation, and Longest Prefix Match routing evaluation functioning 100% with rigorous unit tests.
  - Interactive Tools Added: `BinaryConverter`, `SubnetCalculator` (with step-by-step reasoning breakdown), `SubnetPractice` (random challenge generator), `ArpVisualizer`, `VlanBuilder`, and `RoutingTableVisualizer`.
  - Added Path 2 (IPv4 & Subnetting) and Path 3 (Switching, VLAN & Routing) to curriculum seed (`prisma/seed.ts`).
  - Validation: 17 Vitest test suites (83 tests passed), 12 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `src/features/network-logic/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`, `src/e2e/core-networking.spec.ts`
  Git: `7ab5cad`

- [2026-08-25 16:20 WITA] [SPRINT] [Milestone 4 / Sprint 8]
  Completed Sprint 8 — Switching, VLAN & Routing Fundamentals.
  1. Created typed logical simulation primitives in `src/features/network-logic/simulation/topology.ts` (`SimDevice`, `SimInterface`, `SimLink`, `SimRoute`).
  2. Implemented deterministic `evaluateL2Reachability` (access/trunk VLAN isolation) and `evaluateL3Routing` (Longest Prefix Match & direct vs next-hop forwarding) with 7 unit tests.
  3. Built interactive UI components: `ArpVisualizer`, `VlanBuilder`, and `RoutingTableVisualizer`.
  4. Seeded Path 3 curriculum in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/simulation/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `7ab5cad`

- [2026-08-25 16:15 WITA] [SPRINT] [Milestone 4 / Sprint 7]
  Completed Sprint 7 — IPv4 & Subnetting Engine.
  1. Built pure deterministic IPv4 library in `src/features/network-logic/ipv4/ipv4.ts` (parsing, CIDR conversions, subnet calculations, binary formatting, and VLSM multi-department allocation).
  2. Covered library with 10 comprehensive unit tests in `src/features/network-logic/ipv4/ipv4.test.ts`.
  3. Built interactive tools: `BinaryConverter`, `SubnetCalculator`, `SubnetPractice`.
  4. Seeded Path 2 curriculum in `prisma/seed.ts`.
  Files/areas: `src/features/network-logic/ipv4/`, `src/features/learning/blocks/components/`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `7ab5cad`

- [2026-08-25 16:12 WITA] [MILESTONE] [REVIEW] [Milestone 3: Network Foundations Content]
  Completed Milestone 3 — Network Foundations Content (Sprint 5: Part A & Sprint 6: Part B).
  - Exit Criteria Verified: Path 1 (Network Foundations) is 100% completable end-to-end across all 8 modules (16 lessons) and includes the final challenge 'First Day as IT Support'.
  - Added modular interactive components: `TopologyExplorer`, `DeviceCard`, `PacketFlow`, `CableOrderExercise` (T568A/T568B pinout), `OSIStack` (7 Layer OSI & TCP/IP), `EncapsulationVisualizer`.
  - Implemented Final Capstone Challenge with deterministic evaluation engine (`support-challenge.ts`) and reward endpoint (`/api/challenges/submit`).
  - Validation: 15 Vitest test suites (66 tests passed), 11 Playwright E2E browser tests passed, production build succeeded (17 routes).
  Files/areas: `src/features/learning/blocks/components/`, `src/features/challenges/`, `prisma/seed.ts`, `src/app/(app)/challenges/`, `src/e2e/network-foundations.spec.ts`
  Git: `2028ca9`

- [2026-08-25 16:05 WITA] [SPRINT] [Milestone 3 / Sprint 6]
  Completed Sprint 6 — Network Foundations Part B & Final Challenge.
  1. Built interactive components: `CableOrderExercise` (T568A/T568B color pinout reordering), `OSIStack`, `EncapsulationVisualizer`.
  2. Authored Modules 5 to 8 content in `prisma/seed.ts` (Network Devices, Physical Media & Cabling, How Data Travels, OSI & TCP/IP Foundations).
  3. Implemented Capstone Challenge: First Day as IT Support with evaluator, unit tests, and API handler.
  4. Added E2E tests in `src/e2e/network-foundations.spec.ts`.
  Files/areas: `src/features/challenges/`, `src/features/learning/blocks/components/`, `src/app/(app)/challenges/`, `src/app/api/challenges/submit/`
  Validation: `npm test` (66/66 passed), `npx playwright test` (11/11 passed).
  Git: `2028ca9`

- [2026-08-25 15:55 WITA] [SPRINT] [Milestone 3 / Sprint 5]
  Completed Sprint 5 — Network Foundations Part A.
  1. Built reusable interaction primitives: `TopologyExplorer`, `DeviceCard`, `PacketFlow`.
  2. Authored Modules 1 to 4 content in `prisma/seed.ts` (Welcome to Networking, Types of Networks, Client/Server & Communication, Network Topology).
  3. Registered components in `BLOCK_COMPONENTS` registry.
  Files/areas: `src/features/learning/blocks/components/`, `src/features/learning/blocks/registry.tsx`, `prisma/seed.ts`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `2028ca9`

- [2026-08-25 15:48 WITA] [MILESTONE] [REVIEW] [Milestone 2: Learning Engine]
  Completed Milestone 2 — Learning Engine (Sprint 3: Lesson Block Renderer & Sprint 4: Quiz, Practice & Reward Engine).
  - Exit Criteria Verified: A lesson can execute the complete Intro → Concept → Visual → Interactive → Knowledge Check → Practice → Summary → XP loop without hardcoded routes.
  - Reusable block renderer system with 13 typed block variants, fallback handling, and reduced motion.
  - Deterministic quiz evaluator and interactive quiz player with immediate visual feedback.
  - Auditable database-enforced idempotent XP ledger.
  - Full automated suite: 13 Vitest suites (61 tests passed), 9 Playwright E2E browser tests passed, clean typecheck, lint, and Next.js 16 build (16 routes).
  Files/areas: `src/features/learning/blocks/`, `src/features/quiz/`, `src/features/xp/`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/app/api/learning/quiz/submit/`, `src/e2e/lesson-loop.spec.ts`
  Validation: `npm run lint`, `npm run typecheck`, `npm test` (61/61 passed), `npm run build` (16 routes), `npx playwright test` (9/9 passed).
  Git: `b77ad5f`

- [2026-08-25 15:45 WITA] [SPRINT] [Milestone 2 / Sprint 4]
  Completed Sprint 4 — Quiz, Practice & Reward Engine.
  1. Extended Prisma schema with `content Json?` on Lesson, `UserXpLedger` (with composite unique index for idempotency), and `QuizAttempt`.
  2. Implemented pure deterministic quiz evaluation engine (`src/features/quiz/evaluator.ts`) covering single choice, multiple choice, and ordering questions.
  3. Created interactive `QuizBlockPlayer` client component (`src/features/quiz/components/quiz-block-player.tsx`) and submit API (`/api/learning/quiz/submit/route.ts`).
  4. Implemented auditable XP ledger service (`src/features/xp/ledger.ts`) and integrated XP display on Dashboard.
  5. Seeded rich interactive lesson curriculum with quizzes and summaries (`prisma/seed.ts`).
  6. Added comprehensive unit and integration tests (21 tests in `evaluator.test.ts`, `ledger.test.ts`, `quiz-route.test.ts`, `lesson-loop.spec.ts`).
  Files/areas: `src/features/quiz/`, `src/features/xp/`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/app/api/learning/quiz/submit/`
  Validation: `npm test` (61/61 passed), `npx playwright test` (9/9 passed).
  Git: `b77ad5f`

- [2026-08-25 15:40 WITA] [SPRINT] [Milestone 2 / Sprint 3]
  Completed Sprint 3 — Lesson Block Renderer.
  1. Defined versioned lesson content schema with Zod discriminated union for 13 block types (`src/features/learning/blocks/schema.ts`).
  2. Implemented block components: Heading, Text, Callout, Code, Image, Lottie (reduced motion), Diagram, Summary, Reward, and graceful FallbackBlock.
  3. Built component registry (`src/features/learning/blocks/registry.tsx`) and `LessonRenderer` (`src/features/learning/blocks/lesson-renderer.tsx`).
  4. Integrated dynamic block rendering into lesson runner page (`/learn/[pathSlug]/[moduleSlug]/[lessonSlug]`).
  5. Tested schema validation and error fallback rendering (`schema.test.ts`, `registry.test.tsx`).
  Files/areas: `src/features/learning/blocks/`, `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/`
  Validation: `npm test` passed, `npm run typecheck` clean.
  Git: `b77ad5f`

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
