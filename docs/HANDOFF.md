# Netloka — Agent Handoff

Last updated: **2026-09-17 15:16 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Active milestone/sprint:
  - **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** In Progress
- Task: **Task 40.2: Replace in-memory password-reset abuse controls with a multi-instance-safe limiter** (Task 2 in M15 plan).
- Scope delivered in Task 40.2:
  - Persistent PostgreSQL rate limiting model `AuthRateLimit` (`key`, `count`, `expiresAt`, `createdAt`, `updatedAt`, indexed on `expiresAt`).
  - Forward-only migration SQL `prisma/migrations/20260908095000_auth_rate_limits/migration.sql`.
  - Privacy-preserving identity hashing (`hashRateLimitKey`) using one-way SHA-256 digests of normalized identity and scoped IP in `src/features/auth/rate-limiter.ts`.
  - Atomic PostgreSQL-backed fixed-window limiter (`checkRateLimitAsync`) with automatic window reset, counter increment, and graceful in-memory fallback on database connection errors.
  - Rate limiting integration on `/api/auth/forgot-password` (5 requests/15m per IP, 3 requests/15m per email) and `/api/auth/reset-password` (10 requests/15m per IP).
  - Retention cleanup utility `pruneExpiredRateLimits` in `src/features/auth/rate-limit-cleanup.ts`.
- Phase: Task 40.2 fully implemented, locally verified, and ready for commit, push, PR, and CI.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `b030e36` |
| Origin | `origin/main` at `b030e36`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-40-rate-limiter` |
| Task branch | `codex/sprint-40-rate-limiter` |
| Base commit | `b030e36` (Merge pull request #73 from notyourkise/codex/sprint-40-session-security) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | Stopped |

## 3. Milestone & Sprint Progress

- **Milestone 14 (Learner Experience and Mastery Quality):** **COMPLETE & MERGED**
- **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** In Progress
    - [x] Task 40.1: Shared persistent session invalidation and abuse defense (PR #73 merged).
    - [x] Task 40.2: Persistent password-reset abuse controls with a multi-instance-safe limiter.
    - [ ] Task 40.3: Safe OAuth linking and live email verification.
    - [ ] Task 40.4: Database migration rehearsal and forward-only compatibility.
  - Sprint 41 (Staging, Recovery, and Operational Readiness): Planned
  - Sprint 42 (Midtrans Gateway and Controlled Commercial Activation): Gated (requires explicit owner approval for live activation)

## 4. Verification Evidence and Limits

- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (143 test files / 870 tests passed, 100%).
- `npx vitest run src/features/auth/rate-limiter.test.ts src/features/auth/rate-limit-cleanup.test.ts src/features/auth/password-reset-route.test.ts`: **Passed** (20/20 tests passed).
- `npm run build`: **Passed** (Next.js production build succeeded, 53 routes compiled).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Commit Task 40.2 changes to `codex/sprint-40-rate-limiter`.
2. Push branch to GitHub via `git push -u origin codex/sprint-40-rate-limiter`.
3. Open PR via `gh pr create` targeting `main`.
4. Monitor CI checks.
5. Report ready for review and merge to Abangku.
6. After merge by Abangku, sync `main` and proceed to Task 40.3 (Safe OAuth linking and live email verification).
