# Welcome to Networking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task after the owner approves the detailed design. Steps use checkbox (`- [ ]`) syntax for tracking. This task delivered planning only; do not interpret this file as permission to start application work.

**Goal:** Deliver a four-lesson Welcome to Networking reference module whose visible learning outcomes are taught, practiced, assessed, and required for progression.

**Architecture:** Extend the existing modular monolith and typed lesson renderer. Keep content definitions, private assessment definitions, deterministic evaluation, and persistent user evidence distinct. Reuse existing routes and IDs; all completion decisions are server-authoritative.

**Tech Stack:** Existing Next.js 16.3.2, React 19.2.8, TypeScript 5, Tailwind 4, Zod, Prisma 7/PostgreSQL, Vitest, Playwright. No new runtime dependency is planned.

**Spec:** [Learning Outcomes and Curriculum Renewal](../specs/2026-09-05-learning-outcomes-and-curriculum-design.md)

## Global constraints

- Owner milestone: **Milestone 8** only. Sprint 21, 22, 23, and 24 each belong only to M8.
- Owner approved outcomes at path/module/lesson levels, reference-module-first rollout, mandatory lesson quizzes, mandatory module test, retry, and passing before progression.
- Detailed design review still confirms proposed numeric thresholds (3/3 formative, 8/10 module concepts plus all essential practical criteria), new lesson wording, and legacy-user bridge policy.
- Preserve `network-foundations`, `welcome-to-networking`, `intro-to-networking`, and `everyday-networks` identities; no wipe, reset, duplicate XP, or automatic history upgrade.
- Public landing/auth UI, live payments, deployment, premium content, certificates, admin CMS, and arbitrary shell execution are excluded.
- Every path/module/lesson exposes Capaian Pembelajaran with observable outcomes and traceable evidence.
- Existing production/security work is a regression boundary. Use a private disposable DB and dedicated server port, not another worktree's environment or process.
- Do not claim M7 production completion as a prerequisite to local pilot work. Review its implemented dependencies; operational launch gates remain open independently.

## Read and inspect before each sprint

1. Mandatory project document order in `AGENTS.md`; current Git/worktrees/PR/CI rather than this dated snapshot.
2. This plan, its spec, [outcome matrix](../../curriculum/networking-outcomes.md), and [program plan](2026-09-05-learning-curriculum-renewal.md).
3. `prisma/seed.ts`, `prisma/schema.prisma`, all actual migrations, `src/features/learning/{queries,progress,prerequisites,types}.ts`.
4. `src/features/learning/blocks/{schema.ts,registry.tsx,lesson-renderer.tsx}`, `src/features/quiz/{schema,evaluator}.ts`, quiz UI/API, and XP ledger.
5. `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/page.tsx`, `src/app/api/learning/progress/route.ts`, commerce access guard, current auth helper.
6. `src/e2e/lesson-loop.spec.ts`, `src/e2e/network-foundations.spec.ts`, Playwright config, CI workflow, relevant Next.js bundled documentation before application edits.

Baseline: main `a95b025860b8c1788f8fbf48f8d98cd34929da4d`. Seed/content and completion issues are inspection findings, not runtime reproductions. Existing CI does not establish a real authenticated database journey.

## Planned file ownership and interfaces

Existing files below are actual baseline paths. New files are proposed implementation destinations, not currently callable code. Adjust paths only after inspecting newer source and record the correction.

| Responsibility | Proposed files | Consumers |
| --- | --- | --- |
| Public curriculum definitions and outcomes | New `src/features/learning/content/schema.ts`, `network-foundations/welcome.ts`, `network-foundations/path.ts`, `validate.ts` | Seed, overview/lesson queries, content tests |
| Private question/rubric definitions | New `src/features/learning/assessment/welcome.server.ts`, `schema.ts`, `evaluate.ts` | Authenticated server submission service; never imported by client components |
| Public/private projection | New `src/features/learning/content/public-projection.ts` | `queries.ts` and lesson renderer; strips private answers/rubrics |
| Assessment persistence and completion policy | New `src/features/learning/assessment/service.ts`, `completion.ts`; existing `progress.ts`, XP ledger, Prisma schema | Quiz/progress API and module final API |
| Outcome and lesson runtime UI | New `src/features/learning/components/learning-outcomes.tsx`; existing renderer, action bar, quiz player, lesson/path pages | All pilot lessons; old content compatibility |
| Beginner connectivity exercise | New `src/features/network-logic/simulation/simple-connectivity.ts`, `src/features/learning/blocks/components/simple-connectivity-exercise.tsx` | Lesson activity and module practical evaluator |
| Module final route | New `src/app/(app)/learn/[pathSlug]/[moduleSlug]/assessment/page.tsx`, `src/app/api/learning/modules/[moduleId]/assessment/route.ts` | Pilot module final assessment |
| Isolation and evidence | New `src/e2e/welcome-to-networking.spec.ts`; adapt `playwright.config.ts`, `.github/workflows/ci.yml` | Full authenticated E2E against disposable PostgreSQL |

Proposed boundary types (design contracts, not implementation):

```ts
type LearningOutcome = { id: string; text: string };
type LearningEvidence = {
  outcomeId: string;
  teachingBlockIds: string[];
  activityIds: string[];
  assessmentItemIds: string[];
};
type AssessmentSubmission = {
  assessmentId: string;
  version: string;
  requestId: string;
  answers: Record<string, string | string[]>;
  practiceState?: unknown; // validated by the named scenario schema before scoring
};
type AssessmentDecision = {
  passed: boolean;
  conceptScore: number;
  conceptMax: number;
  essentialPracticePassed: boolean;
  unmetOutcomeIds: string[];
};
type CompletionDecision = {
  allowed: boolean;
  missingEvidenceIds: string[];
  unmetPrerequisiteIds: string[];
};
```

`evaluateAssessment(definition, submission): AssessmentDecision` is pure and receives a server-owned definition. `getCompletionDecision(userId, lessonId): Promise<CompletionDecision>` reads current-version evidence. Server session supplies userId; request bodies never select the actor. Proposed `AssessmentAttempt` persistence stores owner, assessment/module/lesson identity, definition version, validated answers, score, pass, and unique `(userId, requestId)`. A request ID reused with different payload must be rejected. Review exact Prisma model/index design in Sprint 21; no fabricated migration file is named before generation.

## Sprint 21 — Curriculum contracts and reproducible data foundation

**Objective:** Turn the reference design into validated public/private content contracts and a safe persistence plan. Exit before starting scoring implementation: reviewed contracts, tested content coverage, and a reproducible disposable schema path.

### Task 21.1 — Confirm measurable content and assessment policy

**Context:** Spec sections 3–6, outcome matrix P1-M1, current seed and packet-flow vocabulary.

**Files:** New `docs/curriculum/welcome-to-networking-content.md`; update this spec only with recorded owner decisions. New content schema and `src/features/learning/content/schema.test.ts`.

- [ ] Record owner acceptance of numeric thresholds and treatment of existing learners before locking behavior.
- [ ] Author the four lessons' complete Indonesian prose, examples, feedback, three quiz items each, ten final items, and the three practical criteria described in the spec. Map every item to an outcome.
- [ ] Review incorrect-option explanations for misconceptions; exclude IP/MAC/HTTP prerequisites from beginner lessons.
- [ ] Write failing tests for duplicate IDs, missing outcome evidence, empty teaching stage, unknown question reference, and prerequisite cycle; confirm expected failures.
- [ ] Implement the smallest content validators and rerun focused tests.
- [ ] Review the authored lesson and commit content contract changes after checks.

Example acceptance test contract:

```ts
it('rejects an outcome without assessment evidence', () => {
  const lesson = structuredClone(validWelcomeLesson);
  lesson.evidence[0].assessmentItemIds = [];
  expect(validateCurriculumLesson(lesson).success).toBe(false);
});
```

The task creates `validWelcomeLesson` from the fully authored L1 fixture and `validateCurriculumLesson` in `content/validate.ts`; they are not existing helpers. Focused command after files exist: `npm test -- src/features/learning/content/schema.test.ts`.

### Task 21.2 — Reconcile storage, versions, and migration history

**Context:** Current Prisma schema, all migrations, actual database setup scripts, approved legacy policy. Existing migration history does not create all current tables.

**Files:** `prisma/schema.prisma`; generated files under `prisma/migrations/`; new `docs/decisions/0005-learning-evidence-and-versioning.md`, `src/features/learning/assessment/persistence.test.ts`.

- [ ] Inventory schema versus migrations without touching the user's DB; record the exact missing-table baseline on a disposable DB.
- [ ] Review a migration strategy for both a fresh database and an existing populated database. Do not rewrite applied history or mark unrun migrations applied to the user's database.
- [ ] Define additive outcomes/version/attempt evidence storage and uniqueness/foreign keys; separate module assessment attempts from legacy lesson quiz records.
- [ ] Verify duplicate request resistance, correct user/lesson ownership, and historical attempts retained after content-version change.
- [ ] Generate reviewed migrations only after the schema strategy is accepted; run deploy on disposable DB, seed twice, verify stable IDs, and test upgrading a legacy fixture.
- [ ] Record rollback/restore approach and irreversibility limits; commit reviewed migration/ADR/tests together.

Acceptance: both fresh and legacy-fixture upgrade paths work without losing progress/XP. If migration reconstruction expands beyond the reviewed scope, record a dependency blocker rather than bypassing it with an undocumented `db push`.

### Task 21.3 — Seed public content and protect private assessments

**Files:** Proposed content files, `assessment/welcome.server.ts`, `content/public-projection.ts`, `prisma/seed.ts`; new `src/features/learning/content/welcome.test.ts` and `public-projection.test.ts`.

- [ ] Write failing fixture tests for four complete lessons, eight lesson outcomes, valid module/path outcomes, complete evidence map, and preserved original lesson slugs.
- [ ] Extract only the pilot definitions from the monolithic seed; preserve unrelated content and commercial catalog seeding.
- [ ] Implement a public projection containing prompts/options/outcomes but no correct-answer keys or private rubric. Validate private definitions separately.
- [ ] Run content/projection tests and repeat seed against disposable data; compare IDs/progress counts before and after.
- [ ] Commit and record Sprint 21 validation and owner review in handoff.

Risk: importing a private definition from client code leaks answers. Validate both module import boundaries and rendered/network payloads in Sprint 24.

## Sprint 22 — Authoritative assessment, progression, and reward

**Objective:** Correct answers and saved evidence control progression. Dependency: Sprint 21 content and persistence contracts accepted and verified.

### Task 22.1 — Connect real questions to quiz submission

**Files:** `src/app/api/learning/quiz/submit/route.ts`, `src/features/quiz/components/quiz-block-player.tsx`, `schema.ts`, `evaluator.ts`, `src/features/learning/assessment/service.ts`; tests `src/features/quiz/quiz-route.test.ts`, `evaluator.test.ts`.

- [ ] Add failing API tests: nonempty wrong answer fails; fabricated quiz ID rejected; a real quiz belonging to another lesson rejected; a locked or inaccessible lesson rejected; user identity comes only from session.
- [ ] Pass actual lesson ID through renderer/player; look up the versioned private question on server and call deterministic evaluation.
- [ ] Reject malformed JSON/answer type with 400, unknown references with 404, access/prerequisite denial with 403, version/request conflict with 409; persistence error returns a safe 500 and does not grant XP.
- [ ] Save validated attempts; remove swallowed storage failures and the player's network-success fallback. Preserve selected answers for retry when transport fails.
- [ ] Run `npm test -- src/features/quiz/quiz-route.test.ts src/features/quiz/evaluator.test.ts`; review private answer handling and commit.

### Task 22.2 — Enforce lesson/module gates on server

**Files:** `learning/assessment/{completion,service,evaluate}.ts`, `learning/progress.ts`, `learning/prerequisites.ts`, existing progress API, new module assessment API; tests `src/features/learning/assessment/completion.test.ts`, `module-route.test.ts`, existing progress tests.

- [ ] Write failing tests for complete-before-quiz, prerequisite bypass via direct POST, old-version evidence, another user's pass, and theory-only module pass.
- [ ] Implement `getCompletionDecision` using accepted current-version evidence; check it in every completion path, not only the button.
- [ ] Implement final module concept score and essential practical criteria independently. A failed gate returns missing outcome/evidence IDs without pre-submit keys.
- [ ] Make retry/resume deterministic; preserve historical evidence and follow the accepted legacy bridge rule.
- [ ] Run focused completion/module/progress suites and commit after internal review.

```ts
it('does not pass a module on concepts alone', () => {
  const result = evaluateAssessment(welcomeFinalDefinition, theoryPassPracticeFail);
  expect(result.conceptScore).toBeGreaterThanOrEqual(8);
  expect(result.essentialPracticePassed).toBe(false);
  expect(result.passed).toBe(false);
});
```

Fixtures are authored in `assessment/completion.test.ts` from private final definition: eight correct answers, invalid local printer connection. Proposed numeric assertion is updated if owner selects a different threshold.

### Task 22.3 — Make evidence/progress/XP consistent under retries

**Files:** `src/features/xp/ledger.ts`, `ledger.test.ts`, `src/features/learning/progress.ts`, `assessment/service.ts`; new `src/features/learning/assessment/transactions.test.ts`.

- [ ] Reproduce concurrent duplicate submit and injected persistence failure on disposable PostgreSQL; verify no partial success is accepted.
- [ ] Make the attempt, completion change, and one-time reward atomic where they form a single action; use database uniqueness as the final guard.
- [ ] Reject reused request IDs with changed payloads; return the existing result for identical retries. Failed attempts do not create completion rewards.
- [ ] Re-run existing Labs/Challenges/Consultant XP tests because ledger behavior is shared; verify legitimate repeated practice remains possible.
- [ ] Commit with DB-specific evidence and explicitly distinguish mocked tests from integration tests.

## Sprint 23 — Four complete lessons and final module experience

**Objective:** The owner can use the entire pilot in the existing learner workspace. Dependencies: S21 content, S22 trusted scoring/completion.

### Task 23.1 — Render outcomes and ordered learning stages

**Files:** Existing path/lesson pages, `learning/queries.ts`, `types.ts`, renderer/schema/registry, new `components/learning-outcomes.tsx`; tests `src/features/learning/components/learning-outcomes.test.tsx`, renderer tests.

- [ ] Add failing render tests for path/module/lesson outcome headings, correct scope text, ordered stages, and absent private keys.
- [ ] Render outcomes before concept content; show the module overview inside the existing path view and retain existing lesson routes.
- [ ] Replace generic fallback claims for pilot content with a safe unavailable-content state; missing content must not offer verified completion.
- [ ] Verify old nonpilot block content still renders and no public landing/auth files change.
- [ ] Run focused rendering/query tests, review copy, and commit.

### Task 23.2 — Deliver beginner-safe deterministic practice

**Files:** New simple-connectivity domain/component and their `.test.ts`/`.test.tsx` peers; existing registry; inspect PacketFlow before any extension.

- [ ] Test two clients and local printer, client-B broken branch, working local network without Internet, and restored branch.
- [ ] Implement pure connectivity decisions from declared node/link/resource state. Reuse compatible topology primitives; do not equate physical connection with arbitrary service health.
- [ ] Implement prediction/change/run/reset with visible text controls and keyboard alternatives; textual results match visual state.
- [ ] Ensure final assessment re-evaluates submitted state on server; an animation click never grants a pass.
- [ ] Test reduced motion, keyboard activation, narrow layout, and text feedback; commit after focused checks.

### Task 23.3 — Finish module assessment and remedial navigation

**Files:** New module assessment page/API, new `src/features/learning/components/module-assessment-player.tsx` and test, existing lesson action bar and progress read models.

- [ ] Test locked final access before required lessons, failed concepts, failed practical, complete pass, reload, and transport failure.
- [ ] Render the ten-item final and practical scenario; display proposed/approved threshold before starting and explanations only after full submit.
- [ ] Show unmet outcomes and direct lesson links; keep retries accessible without losing completed lesson history.
- [ ] Resolve the next available lesson/module from authoritative evidence; a passed pilot must not claim all of Path 1 is complete.
- [ ] Run relevant UI/API tests, review accessibility and all transitions, then commit.

## Sprint 24 — Authenticated validation and owner reference approval

**Objective:** Establish a verified reference before any bulk curriculum rollout. Dependencies: S21–23 reviewed, merged, and synchronized according to project policy.

### Task 24.1 — Build isolated authenticated journey coverage

**Files:** `playwright.config.ts`, `.github/workflows/ci.yml`, new `src/e2e/welcome-to-networking.spec.ts`, new `src/e2e/fixtures/learning-user.ts`.

- [ ] Configure an explicit test DB and dedicated port; disable existing-server reuse for this isolated integration run. Never print credentials or use production database URLs.
- [ ] Create two disposable learner accounts with real persisted sessions via the actual supported auth flow. Do not bypass middleware as proof of authenticated behavior.
- [ ] Exercise outcomes → incorrect quiz → retry → lesson pass → direct locked access denied → four lessons → failed final → remediation → passed final → reload/resume → next-stage access.
- [ ] Verify user B cannot reuse A's evidence; duplicate requests do not increase XP; final answers are absent from pre-submit HTML/payload.
- [ ] CI provisions PostgreSQL and applies migrations/seed for this suite; run Chromium in CI and explicitly report local Firefox/WebKit coverage.

### Task 24.2 — Validate teaching quality and regression

**Files:** New `docs/curriculum/welcome-to-networking-review.md`; affected unit/E2E tests and documentation only as findings require.

- [ ] Review all eight lesson outcomes against actual teaching, quiz, practical, and final evidence; zero uncovered outcomes.
- [ ] Manually exercise at 360px, tablet, desktop, 200% zoom, keyboard-only, reduced motion, and both supported themes; record observed results, not only intended behavior.
- [ ] Verify preserved lesson URLs and progress upgrade fixtures; review lessons outside the pilot, Labs, Challenges, Consultant, commercial access, and public auth.
- [ ] Invite owner review of the complete module. Record actual learner observations if available; do not invent usability evidence.
- [ ] Resolve Critical/High findings before requesting reference approval; record remaining limitations.

### Task 24.3 — Complete the milestone delivery gate

- [ ] Run actual full project commands: `npm ci`, `npm run db:generate`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `git diff --check` in the isolated environment. Add migration/seed checks from S21 and named authenticated E2E from S24.
- [ ] Record command, revision, DB/server isolation, results, browser scope, and live-integration limits; a failure blocks only the corresponding claim but must be resolved for milestone completion.
- [ ] Review complete diff, update PLAN/ROADMAP/CHANGELOG/HANDOFF, commit/push/open PR when authorized, and verify every applicable CI job on the latest head.
- [ ] Abangku performs final review and merge; verify merge and synchronization before marking M8 complete. Preserve the branch until review.
- [ ] Obtain owner acceptance that this module is the reusable reference before Sprint 25 starts. Premium/payment and deployment remain separately gated.

## Acceptance summary

A new learner sees correct outcomes at all three levels, studies four complete lessons, receives accurate feedback, cannot advance without required passes, can retry/resume, and completes a separately assessed module without duplicate rewards. A historical learner retains recorded progress and follows an explicitly approved bridge policy. Missing content/evidence, wrong answers, inaccessible lessons, spoofed identities, and failed requests never create mastery. The reference is usable with keyboard/reduced motion and verified against real disposable persistence.
