# Learner Experience and Mastery Quality Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make daily learning easier to resume, safer against lost work, and more effective through explicit mastery, remediation, and spaced review while preserving server-authoritative progression.

**Architecture:** Extend the existing modular learning feature with deterministic queue/mastery domain services, narrowly scoped persistence for drafts/bookmarks/review schedules, and learner-facing routes that consume those services. Assessment evidence remains authoritative; drafts and UI state never award progress or XP. Developer analytics consume cohort-filtered aggregates and exclude `INTERNAL_LEARNER` accounts.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma/PostgreSQL, Zod, Vitest, Playwright.

**Prerequisite:** Milestone 13 is merged and synchronized. Read the current Next.js guides in `node_modules/next/dist/docs/` before implementation because the installed framework version is authoritative.

---

## Global Constraints

- Preserve the hardcoded, typed curriculum registry; curriculum editing is not part of this milestone.
- All user identity comes from the authenticated server session. Never accept `userId` from a learner request body.
- A draft, bookmark, view event, or elapsed timer cannot complete a lesson, pass an assessment, or grant XP.
- Existing lesson/module/path evidence and stable content identifiers remain valid.
- Every new domain rule starts with a failing test, then the smallest implementation, then focused and broader verification.
- UI work must cover keyboard navigation, focus visibility, reduced motion, screen-reader labels, narrow screens, and empty/error/loading states.

## Sprint 37 — Continuity and Daily Comfort

### Task 1: Add an exact learning continuation resolver and prioritized queue — ✅ COMPLETE

**Files:**
- Create: `src/features/learning/continuation.ts`
- Create: `src/features/learning/continuation.test.ts`
- Modify: `src/features/learning/queries.ts`
- Create: `src/features/dashboard/queries.ts`
- Create: `src/features/dashboard/queries.test.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Test: `src/app/(app)/dashboard/page.test.tsx`

**Step 1: Write failing domain tests**

Cover a new learner, an interrupted lesson, a failed module assessment requiring remediation, an unlocked next lesson, and a completed curriculum. The strict priority is remediation, resumable work, next required assessment, then next unlocked lesson.

```ts
export type LearningQueueItem = {
  kind: "REMEDIATION" | "RESUME" | "ASSESSMENT" | "NEXT_LESSON";
  href: string;
  title: string;
  reason: string;
  priority: number;
};

export function resolveLearningQueue(
  curriculum: LearningGraph,
  evidence: LearnerEvidenceSnapshot,
): LearningQueueItem[];
```

Run `npm test -- src/features/learning/continuation.test.ts` and confirm the new expectations fail.

**Step 2: Implement the pure resolver and one database-backed query adapter**

Keep ordering logic in `continuation.ts`; queries only assemble the typed snapshot. Do not compute priorities in React.

**Step 3: Replace dashboard guesses with the resolver output**

Render one primary “Lanjutkan belajar” action plus a short ordered queue. Define useful completed and empty states.

**Step 4: Verify and commit**

Run the focused tests, `npm run typecheck`, and `npm run lint`.

```powershell
git add -- 'src/features/learning/continuation.ts' 'src/features/learning/continuation.test.ts' 'src/features/learning/queries.ts' 'src/features/dashboard/queries.ts' 'src/features/dashboard/queries.test.ts' 'src/app/(app)/dashboard/page.tsx' 'src/app/(app)/dashboard/page.test.tsx'
git commit -m "feat: add authoritative learning continuation queue"
```

### Task 2: Persist safe autosave drafts without creating assessment evidence

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260908091000_learning_drafts/migration.sql`
- Create: `src/features/learning/drafts/service.ts`
- Create: `src/features/learning/drafts/service.test.ts`
- Create: `src/app/api/learning/drafts/route.ts`
- Create: `src/app/api/learning/drafts/route.test.ts`
- Create: `src/features/learning/drafts/use-learning-draft.ts`
- Modify: `src/features/learning/blocks/components/concept-activity.tsx`
- Modify: `src/features/learning/blocks/components/terminal-block-player.tsx`
- Modify: `src/features/learning/blocks/components/subnet-practice.tsx`
- Modify: `src/features/learning/blocks/components/vlan-builder.tsx`
- Modify: `src/features/learning/blocks/components/cable-order-exercise.tsx`

**Step 1: Specify the persistence contract in failing tests**

```prisma
model LearningDraft {
  id             String   @id @default(cuid())
  userId         String
  lessonId       String
  activityId     String
  contentVersion String
  payload        Json
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId, activityId])
  @@index([userId, updatedAt])
}
```

Test ownership isolation, payload size/schema rejection, version mismatch, upsert behavior, deletion after authoritative submission, and absence of XP/progress side effects.

**Step 2: Add the migration and service**

Whitelist draftable block payload shapes. Reject assessment answer keys, secrets, arbitrary HTML, and oversized JSON.

**Step 3: Add authenticated API and debounced client hook**

Use a visible saved/saving/error status. Flush safely on navigation where practical; retain local unsent state after transient failure.

**Step 4: Verify and commit**

Run draft service/route tests, Prisma generation, typecheck, and lint.

```powershell
git add -- 'prisma/schema.prisma' 'prisma/migrations' 'src/features/learning/drafts' 'src/app/api/learning/drafts' 'src/features/learning'
git commit -m "feat: add safe learner draft autosave"
```

### Task 3: Standardize lesson navigation and public error behavior — ✅ COMPLETE

**Files:**
- Create: `src/features/learning/navigation.ts`
- Create: `src/features/learning/navigation.test.ts`
- Create: `src/lib/errors/public-error.ts`
- Create: `src/lib/errors/public-error.test.ts`
- Modify: `src/features/learning/components/lesson-action-bar.tsx`
- Modify: `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/page.tsx`

**Step 1: Write failure-first tests** for previous/next boundaries, locked destinations, failed assessment remediation, unknown IDs, network failure, and safe public messages.

```ts
export type LessonNavigation = {
  previous: NavigationTarget | null;
  next: NavigationTarget | null;
  exitHref: string;
  completionAction: NavigationTarget | null;
};
```

**Step 2: Implement one resolver and one safe error mapper.** Never show success after an unresolved request and never expose stack traces/database messages.

**Step 3: Apply consistent disabled/loading/retry/focus behavior** to the lesson action bar and completion flow.

**Step 4: Verify and commit** with focused tests, typecheck, lint, and relevant learning E2E.

### Task 4: Add curriculum search and learner bookmarks — ✅ COMPLETE

**Files:**
- Create: `src/features/learning/search.ts`
- Create: `src/features/learning/search.test.ts`
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260908092000_lesson_bookmarks/migration.sql`
- Create: `src/features/learning/bookmarks/service.ts`
- Create: `src/features/learning/bookmarks/service.test.ts`
- Create: `src/app/api/learning/bookmarks/route.ts`
- Create: `src/app/(app)/learn/search/page.tsx`
- Modify: `src/components/navigation/learner-sidebar.tsx`
- Modify: `src/components/navigation/learner-mobile-drawer.tsx`
- Modify: `src/app/(app)/learn/[pathSlug]/[moduleSlug]/[lessonSlug]/page.tsx`
- Test: `src/e2e/learning-continuity.spec.ts`

**Step 1: Test deterministic search ranking** over title, summary, outcome, module, and path labels. Search only the server-known public curriculum projection.

**Step 2: Add an ownership-scoped bookmark model/service** with a unique `(userId, lessonId)` constraint. A stale content ID returns a recoverable result instead of breaking the page.

**Step 3: Build accessible search and bookmark UI** with text labels, query-state URLs, keyboard behavior, and clear empty results.

**Step 4: Verify Sprint 37** with focused tests, authenticated Playwright coverage, migration review, responsive/accessibility checks, then commit.

## Sprint 38 — Mastery, Remediation, and Feedback

### Task 5: Derive outcome mastery from authoritative evidence — COMPLETED (2026-09-16)

**Files:**
- Create: `src/features/learning/mastery.ts`
- Create: `src/features/learning/mastery.test.ts`
- Create: `src/features/learning/mastery-queries.ts`
- Create: `src/features/learning/mastery-queries.test.ts`
- Create: `src/app/(app)/learn/mastery/page.tsx`
- Modify: `src/components/navigation/learner-sidebar.tsx`
- Modify: `src/components/navigation/learner-mobile-drawer.tsx`

**Step 1: Define and test the derivation contract**

```ts
export type MasteryState = "NOT_STARTED" | "IN_PROGRESS" | "NEEDS_REVIEW" | "MASTERED";

export type OutcomeMastery = {
  outcomeId: string;
  state: MasteryState;
  latestAttemptAt: Date | null;
  evidenceVersion: string | null;
  remediationLessonIds: string[];
};
```

Current-version passed evidence can produce `MASTERED`; failed or superseded evidence cannot. The resolver must be deterministic and preserve historical evidence display without silently regrading it.

**Step 2: Implement the query adapter and mastery page** grouped by path/module, with plain-language explanations and direct remediation actions.

**Step 3: Verify and commit** with focused tests and learner-route authorization coverage.

### Task 6: Build the remediation center and feed it into the learning queue — COMPLETED (2026-09-16)

**Files:**
- Create: `src/features/learning/remediation.ts`
- Create: `src/features/learning/remediation.test.ts`
- Create: `src/app/(app)/learn/remediation/page.tsx`
- Modify: `src/features/learning/continuation.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/(app)/learn/mastery/page.tsx`

Map failed evidence to the smallest set of prerequisite lessons/outcomes. Test deduplication, ordering, recovered mastery, and unavailable mappings. The UI must explain what to review and why without exposing answer keys. Re-run continuation/mastery tests before commit.

### Task 7: Add privacy-safe assessment analytics for developer review — COMPLETED (2026-09-16)

**Files:**
- Create: `src/features/developer/analytics/assessment-analytics.ts`
- Create: `src/features/developer/analytics/assessment-analytics.test.ts`
- Modify: `src/app/(developer)/developer/learning/page.tsx`
- Modify: `src/features/developer/overview/queries.ts`
- Modify: `src/features/developer/overview/queries.test.ts`

**Step 1: Test cohort and aggregation rules.** Exclude `INTERNAL_LEARNER` and `DEVELOPER`, suppress tiny cohorts where individual inference is possible, and report item/outcome failure rates without exposing learner answers.

```ts
export type AssessmentHealth = {
  assessmentId: string;
  outcomeId: string;
  attemptCount: number;
  firstAttemptPassRate: number | null;
  retryPassRate: number | null;
  medianAttemptsToPass: number | null;
};
```

**Step 2: Implement aggregate queries and a read-only table** with filters, definitions, empty states, and content-version labels.

**Step 3: Verify developer authorization, query plans, and tests**, then commit.

### Task 8: Improve Consultant feedback without changing historical scores — COMPLETED (2026-09-16)

**Files:**
- Create: `src/features/consultant/feedback.ts`
- Create: `src/features/consultant/feedback.test.ts`
- Modify: `src/features/consultant/components/consultant-workspace.tsx`
- Modify: `src/app/(app)/consultant/portfolio/page.tsx`
- Modify: `src/features/consultant/scoring/engine.ts`
- Test: `src/features/consultant/scoring/engine.test.ts`
- Test: `src/e2e/critical-path.spec.ts`

Build feedback from persisted rubric evidence: strengths, blocking issues, and prioritized next actions linked to learning outcomes. Historical projects retain their original rubric/content version and score. Test versioned rendering, missing evidence, essential connectivity failures, and budget-only success. Complete Sprint 38 with focused and regression checks.

## Sprint 39 — Spaced Review and Learner-Quality Acceptance

### Task 9: Add deterministic spaced-review scheduling — COMPLETED (2026-09-16)

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260908093000_review_schedule/migration.sql`
- Create: `src/features/learning/review-scheduler.ts`
- Create: `src/features/learning/review-scheduler.test.ts`
- Create: `src/features/learning/review-service.ts`
- Create: `src/features/learning/review-service.test.ts`
- Create: `src/app/(app)/learn/review/page.tsx`
- Modify: `src/features/learning/continuation.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`

**Step 1: Test scheduler boundaries with an injected clock**

```ts
export type ReviewRating = "AGAIN" | "HARD" | "GOOD";
export type ReviewSchedule = {
  outcomeId: string;
  dueAt: Date;
  intervalDays: number;
  consecutiveSuccesses: number;
};
```

Use a simple documented interval table, not an adaptive black box. A review answer is server-evaluated before the schedule changes; repeated requests are idempotent.

**Step 2: Persist the schedule and add the review session UI.** Review items link to source lessons and never replace mandatory module/path gates.

**Step 3: Integrate due reviews into the queue** below required remediation but above optional new learning.

**Step 4: Verify and commit** with injected-time tests, concurrency/idempotency tests, migration review, and authenticated E2E.

### Task 10: Run accessibility, responsive, performance, and failure-path regression

**Files:**
- Create: `src/e2e/learner-quality.spec.ts`
- Modify when a demonstrated regression requires it: `src/features/learning/components/lesson-action-bar.tsx`
- Modify when a demonstrated regression requires it: `src/components/navigation/learner-workspace-shell.tsx`
- Modify when a demonstrated regression requires it: `src/components/navigation/learner-workspace-shell.test.tsx`
- Create: `docs/testing/milestone-14-learner-quality-review.md`

Cover 320px/mobile, tablet, desktop, keyboard-only flow, focus restoration, reduced motion, loading/error/offline retry, draft recovery after reload, search/bookmarks, remediation, mastery, and due review. Capture measured route performance and query counts; fix only milestone regressions or documented High issues.

### Task 11: Complete the Milestone 14 review and delivery gate

**Files:**
- Modify: `PLAN.md`
- Modify: `ROADMAP.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/HANDOFF.md`
- Modify: `docs/TECHNICAL_DEBT.md`

Run Prisma generation/migrations on disposable databases, focused tests, full unit/integration tests, typecheck, lint, authenticated E2E, build, migration review, security/privacy review, accessibility/responsive review, and complete diff review. Record exact commands, revision, environment, limits, and WITA timestamps. Resolve Critical/High findings, create a focused PR, verify current-head CI, and leave merge to Abangku.

## Milestone 14 Acceptance Criteria

- Returning learners receive the exact highest-priority next action and a transparent short queue.
- Recoverable learner work survives refresh/network failure without becoming assessment evidence.
- Search, bookmarks, navigation, public errors, and empty states are consistent and accessible.
- Mastery and remediation derive solely from authoritative, versioned evidence.
- Developer assessment analytics exclude internal accounts and protect small cohorts and answer content.
- Consultant feedback is actionable while historical scores remain reproducible.
- Spaced review is deterministic, idempotent, optional relative to mandatory progression, and covered by authenticated E2E.
- No Critical/High review findings remain; applicable local and current-head CI gates pass before the PR is called ready.
