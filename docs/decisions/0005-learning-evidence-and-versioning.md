# ADR 0005: Learning Evidence, Versioning & Assessment Persistence

## Status

Accepted (2026-09-05 WITA — Milestone 8 / Sprint 21)

## Context

Netloka is transitioning from a completion-driven model (where clicking "Tandai Selesai" or submitting non-empty input completed a lesson) to an **Outcome-Driven Curriculum** (*Capaian Pembelajaran*). Under this new model:
1. Every lesson and module has observable, assessable outcomes.
2. Formative quizzes require mastery (3/3 correct with unlimited retries and explanatory feedback).
3. The module final assessment requires independent mastery of theoretical concepts (threshold 8/10) and essential practical connectivity criteria (3/3 passed).
4. Submissions must be server-authoritative, idempotent, and resilient to duplicate requests, network retries, and race conditions.
5. Legacy users with existing progress and XP in `UserLessonProgress` and `UserXpLedger` must not experience data loss, account reset, or arbitrary retroactive invalidation of their historical records.

## Decisions

### 1. Dedicated, Additive Persistence Model: `AssessmentAttempt`
Rather than overloading the legacy `quiz_attempts` table (which lacked request idempotency and module-level assessment scoping), we introduce an additive Prisma model `AssessmentAttempt`:
- `id`: Unique identifier (`cuid`).
- `userId`: Foreign key to `users.id` with `onDelete: Cascade`.
- `assessmentId`: Canonical assessment identifier (e.g. `assessment-welcome-final` or lesson quiz ID).
- `moduleId`: Optional foreign key to `modules.id`.
- `lessonId`: Optional foreign key to `lessons.id`.
- `version`: Semantic content version (default `"1.0"`).
- `score`: Scored points achieved.
- `passed`: Boolean indicator whether this attempt satisfied the passing criteria.
- `answersJson`: Complete JSON snapshot of submitted choices, practical states, and evaluation metadata.
- `requestId`: Client-provided or session-scoped UUID for idempotency.
- `createdAt`: Timestamp of attempt submission.

### 2. Strict Idempotency via Composite Unique Constraint
To prevent race conditions, rapid double-clicking, and duplicate XP/progress awards, the model enforces:
```prisma
@@unique([userId, requestId])
```
If a request with an existing `(userId, requestId)` is submitted:
- If the payload matches, the server returns the cached evaluation result without re-executing transactions or re-awarding XP.
- If the payload differs, the server rejects the request with HTTP 409 Conflict.

### 3. Server-Authoritative Evaluation & Secret Isolation
- Questions, correct answers, distractors, and practical scoring rubrics are defined strictly in `*.server.ts` files (e.g. `src/features/learning/assessment/welcome.server.ts`).
- These server definitions are NEVER imported into client components or exposed in public API projections.
- The public projection (`public-projection.ts`) strips `correctAnswer`, `rubricKey`, and internal scoring parameters before payload delivery to the browser.
- Client requests submit only the user's selected answers or topology configurations. The server scores and records the attempt.

### 4. Legacy User Progress & Bridge Policy
- Historical records in `user_lesson_progress` and `user_xp_ledger` are preserved 100% intact. No accounts, streaks, or XP points are wiped or reset.
- Historical completions are treated as historical records. They do not automatically grant "Mastery Certified" status on newly revised curriculum modules until the learner completes the updated assessment.
- When an existing learner opens a revised lesson, their historical completion status remains visible, but they have the opportunity to take the new interactive activities and formative quizzes to gain verified competency evidence.

### 5. Additive Database Migration Strategy
- In Sprint 21, the schema modification is strictly additive:
  - Adds `assessment_attempts` table.
  - Adds relation arrays to `User`, `Module`, and `Lesson`.
  - Zero existing tables or columns are dropped, altered, or renamed.
- Prisma client is regenerated via `npm run db:generate`.
- Live production databases are not altered without dedicated review and backup procedures.

## Consequences

- Complete two-way audit trail between learner submissions, learning outcomes, and progression decisions.
- Elimination of duplicate XP or race-condition exploits.
- Backward compatibility: existing learners retain all earned XP and historical records.
- Zero client bundle leakage of quiz answers or grading rubrics.
