# Netloka — Agent Handoff

Last updated: **2026-09-17 15:30 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Active milestone/sprint:
  - **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** In Progress
- Task: **Task 40.3: Close OAuth account-linking and live-email verification gaps** (Task 3 in M15 plan).
- Scope delivered in Task 40.3:
  - Safe OAuth account linking: explicit `allowDangerousEmailAccountLinking: false` in GoogleProvider (`src/features/auth/auth.ts`).
  - Verified provider email requirement: rejects unverified Google profiles (`email_verified === false`) and logs `AUTH_OAUTH_UNVERIFIED_EMAIL_REJECTED`.
  - Credentials-first account conflict defense: rejects automatic Google OAuth sign-in for accounts created with password credentials without prior linked Google account, logging `AUTH_OAUTH_CONFLICTING_CREDENTIALS_REJECTED`.
  - Conflicting provider identity defense: rejects mismatched `providerAccountId` for established Google accounts with `AUTH_OAUTH_CONFLICTING_ACCOUNT_ID_REJECTED` (CRITICAL severity).
  - Privileged developer isolation: blocks Google OAuth authentication for `DEVELOPER` role users (`AUTH_OAUTH_DEVELOPER_REJECTED`).
  - Forced public `LEARNER` role: enforced across `/api/auth/register` and NextAuth `jwt` and `session` callbacks.
  - Operational runbook: created `docs/operations/auth-live-verification.md` detailing isolated staging test procedures and security rationale.
  - Environment documentation: updated `.env.example` with staging Google OAuth and Hostinger SMTP instructions.
- Phase: Task 40.3 fully implemented, locally verified, and ready for commit, push, PR, and CI.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `ce3275a` |
| Origin | `origin/main` at `ce3275a`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-40-oauth-linking` |
| Task branch | `codex/sprint-40-oauth-linking` |
| Base commit | `ce3275a` (Merge pull request #74 from notyourkise/codex/sprint-40-rate-limiter) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | Stopped |

## 3. Milestone & Sprint Progress

- **Milestone 14 (Learner Experience and Mastery Quality):** **COMPLETE & MERGED**
- **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** In Progress
    - [x] Task 40.1: Shared persistent session invalidation and abuse defense (PR #73 merged).
    - [x] Task 40.2: Persistent password-reset abuse controls with a multi-instance-safe limiter (PR #74 merged).
    - [x] Task 40.3: Safe OAuth linking and live email verification.
    - [ ] Task 40.4: Database migration rehearsal and forward-only compatibility.
  - Sprint 41 (Staging, Recovery, and Operational Readiness): Planned
  - Sprint 42 (Midtrans Gateway and Controlled Commercial Activation): Gated (requires explicit owner approval for live activation)

## 4. Verification Evidence and Limits

- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (143 test files / 877 tests passed, 100%).
- `npx vitest run src/features/auth/auth-options.test.ts src/features/auth/auth-route.test.ts`: **Passed** (29/29 tests passed).
- `npm run build`: **Passed** (Next.js production build succeeded, 53 routes compiled).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Commit Task 40.3 changes to `codex/sprint-40-oauth-linking`.
2. Push branch to GitHub via `git push -u origin codex/sprint-40-oauth-linking`.
3. Open PR via `gh pr create` targeting `main`.
4. Monitor CI checks.
5. Report ready for review and merge to Abangku.
6. After merge by Abangku, sync `main` and proceed to Task 40.4 (Database migration rehearsal and forward-only compatibility).
