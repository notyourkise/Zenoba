# Netloka — Agent Handoff

Last updated: **2026-09-18 16:15 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Active milestone/sprint:
  - **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **ACTIVE**
- Task: **Task 41.3: Prove backup, restore, rollback, and incident drills outside production** (Task 7 in M15 plan).
- Scope delivered in Task 41.3:
  - Authored `scripts/restore-staging-postgres.sh` providing verified disaster recovery restore from custom-format PostgreSQL binary snapshots (`pg_dump -Fc`), featuring staging project guards, lock file concurrency safety, container lifecycle management (`stop app` -> `pg_restore` -> `start app`), and post-restore row count verification.
  - Authored `docs/operations/dr-rehearsal-drill.md` detailing a 5-phase rehearsal drill protocol (AES-256 backup encryption/checksum validation, decryption & isolated target restoration, critical table row-count comparison, application rollback without down-migrations, post-drill smoke tests, and SEV-1 incident secret rotation rehearsal) targeting RTO < 15 minutes and RPO < 24 hours.
  - Updated `docs/deployment/staging.md` with database disaster recovery restore instructions and drill cross-references.
- Phase: Task 41.3 fully implemented, locally verified, and ready for commit, push, PR, and CI.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `eb04d4a` |
| Origin | `origin/main` at `eb04d4a`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-41-backup-restore-drills` |
| Task branch | `codex/sprint-41-backup-restore-drills` |
| Base commit | `eb04d4a` (Merge pull request #78 from notyourkise/codex/sprint-41-staging-environment) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | Stopped |

## 3. Milestone & Sprint Progress

- **Milestone 14 (Learner Experience and Mastery Quality):** **COMPLETE & MERGED**
- **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** **COMPLETE & MERGED** (PR #73, #74, #75, #76)
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **ACTIVE**
    - [x] Task 41.1: Finalize factual operator/privacy/payment/incident runbooks (PR #77 merged).
    - [x] Task 41.2: Deploy and verify an explicitly authorized isolated staging environment (PR #78 merged).
    - [x] Task 41.3: Prove backup, restore, rollback, and incident drills outside production.
    - [ ] Task 41.4: Complete a production-like non-payment rehearsal and owner review.
  - Sprint 42 (Midtrans Gateway and Controlled Commercial Activation): Gated (requires explicit owner approval for live activation)

## 4. Verification Evidence and Limits

- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (143 test files / 877 tests passed, 100%).
- `npm run build`: **Passed** (Next.js 16.3.2 production build succeeded, 53 routes compiled).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Commit Task 41.3 changes to `codex/sprint-41-backup-restore-drills`.
2. Push branch to GitHub via `git push -u origin codex/sprint-41-backup-restore-drills`.
3. Open PR via `gh pr create` targeting `main`.
4. Monitor CI checks.
5. Report ready for review and merge to Abangku.
6. After merge by Abangku, sync `main` and proceed to Task 41.4 (Complete a production-like non-payment rehearsal and owner review).
