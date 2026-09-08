# Netloka — Agent Handoff

Last updated: **2026-09-08 10:46 WITA**. Read AGENTS.md and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first curriculum.
- Active milestone/sprint: **Milestone 13 / Sprint 34 — Role, Persistence, and Authorization Foundation**.
- Task: **Task 34.2: Add central database-authoritative role guards and immediate role enforcement**.
- Scope delivered:
  1. Defined `Actor` interface, `WorkspaceArea`, and `AuthorizationError` in `src/features/authorization/types.ts`.
  2. Implemented `getFreshActor()`, `requireFreshActor()`, `requireDeveloperActor()`, `requireLearnerActor()`, and `requireActorForArea()` in `src/features/authorization/guards.ts`.
  3. Enforced mutual boundary isolation between developer and learner workspaces.
  4. Enforced live database checks over stale JWT claims without exposing sensitive credentials.
  5. Re-exported authorization guards and types through `src/lib/auth.ts`.
  6. Added comprehensive unit tests in `src/features/authorization/guards.test.ts` (14 tests).
- **Phase:** Implemented and locally verified against all project quality gates. Ready for PR creation.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, branch `main` at `5e5f01e` |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-34-role-guards` |
| Task branch | `codex/sprint-34-role-guards` |
| Base commit | `5e5f01e` (Merge pull request #45 from notyourkise/codex/sprint-34-role-persistence) |
| Retained unrelated worktree | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | `task-3530` active and healthy on `http://localhost:3000` |

## 3. Key Files Changed / Added

1. `src/features/authorization/types.ts`: `Actor`, `WorkspaceArea`, `AuthorizationError`.
2. `src/features/authorization/guards.ts`: Server-authoritative role guards and actor loaders.
3. `src/features/authorization/guards.test.ts`: Guard tests covering isolation, errors, and stale role prevention.
4. `src/lib/auth.ts`: Integrated `authVersion` projection and re-exported guards.
5. `src/lib/auth.test.ts`: Updated findUnique select assertion.
6. `PLAN.md` & `CHANGELOG.md`: Progress tracking and immutable WITA changelog record.

## 4. Verification Evidence

- `npm run db:generate`: **Passed**.
- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (89 test files / 505 tests passed).
- `git diff --check`: **Passed** (0 formatting/whitespace errors).
- Background dev server: **Healthy** (`/api/health` 200 OK).

## 5. Next Actions

1. Commit and push task branch `codex/sprint-34-role-guards`.
2. Open PR via `gh pr create` targeting `main`.
3. Verify all 5 CI jobs green on GitHub Actions.
4. Submit PR for review and merge by Abangku.
5. After merge and synchronization, proceed to Task 34.3 (Force public email/Google registration to `LEARNER`; prohibit Google login for developers).
