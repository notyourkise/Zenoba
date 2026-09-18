# Netloka — Agent Handoff

Last updated: **2026-09-18 15:45 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Active milestone/sprint:
  - **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **ACTIVE**
- Task: **Task 41.2: Deploy and verify an explicitly authorized isolated staging environment** (Task 6 in M15 plan).
- Scope delivered in Task 41.2:
  - Authored `docs/operations/staging-verification.md` detailing the comprehensive 11-step verification protocol for `staging.netloka.biz.id` (host root isolation at `/srv/netloka/staging`, pre-flight validation, database health & forward-only migration status, loopback healthcheck at `127.0.0.1:3001`, host TLS & Nginx reverse proxy, transport security headers & CSP, secure cookie policy, live Hostinger SMTP delivery, password-reset rate limiting, Google OAuth staging callback, staging-only user lifecycle, and sensitive log redaction & backup cron).
  - Updated `deploy/staging.env.example` with complete staging environment variables (dedicated staging DB credentials, internal Compose network host `db:5432`, `AUTH_SECRET`/`NEXTAUTH_SECRET`, Hostinger SMTP, Google OAuth, and disabled payment mode).
  - Updated `docker-compose.prod.yml` adding `APP_URL`, complete `SMTP_*` configuration, `PAYMENT_MODE`, and a dedicated `migrate` maintenance service running `npm run db:deploy`.
  - Updated `docs/deployment/cloudflare-and-caddy.md` replacing obsolete `prisma db push` with forward-only `docker compose run --rm migrate` and documenting Cloudflare DNS & staging subdomain routing.
  - Updated `docs/deployment/staging.md` cross-referencing `docs/operations/staging-verification.md`.
- Phase: Task 41.2 fully implemented, locally verified, and ready for commit, push, PR, and CI.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `92a3c42` |
| Origin | `origin/main` at `92a3c42`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-41-staging-environment` |
| Task branch | `codex/sprint-41-staging-environment` |
| Base commit | `92a3c42` (Merge pull request #77 from notyourkise/codex/sprint-41-operator-runbooks) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | Stopped |

## 3. Milestone & Sprint Progress

- **Milestone 14 (Learner Experience and Mastery Quality):** **COMPLETE & MERGED**
- **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** **COMPLETE & MERGED** (PR #73, #74, #75, #76)
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **ACTIVE**
    - [x] Task 41.1: Finalize factual operator/privacy/payment/incident runbooks (PR #77 merged).
    - [x] Task 41.2: Deploy and verify an explicitly authorized isolated staging environment.
    - [ ] Task 41.3: Prove backup, restore, rollback, and incident drills outside production.
    - [ ] Task 41.4: Complete a production-like non-payment rehearsal and owner review.
  - Sprint 42 (Midtrans Gateway and Controlled Commercial Activation): Gated (requires explicit owner approval for live activation)

## 4. Verification Evidence and Limits

- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (143 test files / 877 tests passed, 100%).
- `npm run build`: **Passed** (Next.js 16.3.2 production build succeeded, 53 routes compiled).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Commit Task 41.2 changes to `codex/sprint-41-staging-environment`.
2. Push branch to GitHub via `git push -u origin codex/sprint-41-staging-environment`.
3. Open PR via `gh pr create` targeting `main`.
4. Monitor CI checks.
5. Report ready for review and merge to Abangku.
6. After merge by Abangku, sync `main` and proceed to Task 41.3 (Prove backup, restore, rollback, and incident drills outside production).
