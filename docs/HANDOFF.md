# Netloka — Agent Handoff

Last updated: **2026-09-18 23:32 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Active milestone/sprint:
  - **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **COMPLETE & MERGED** (PR #77, #78, #79, #80 merged)
  - **Sprint 42 (Midtrans Gateway and Controlled Commercial Activation):** **ACTIVE** (Task 42.1 complete, gated at Task 42.4)
- Task: **Task 42.1: Refresh and approve the exact Dynamic QRIS/provider boundary from current official documentation** (Task 9 in M15 plan).
- Scope delivered in Task 42.1:
  - Authored `docs/operations/midtrans-release-runbook.md` specifying Midtrans Core API Dynamic QRIS integration (`payment_type: "qris"`, `qris.acquirer: "gopay"`), cryptographic SHA-512 signature formula (`order_id + status_code + gross_amount + ServerKey`), webhook event idempotency deduplication (`providerEventId = "${transaction_id}_${transaction_status}"`), status mapping to Netloka order state machine (`settlement`/`capture` -> `PAID`, `expire` -> `EXPIRED`, `cancel`/`deny` -> `CANCELLED`), 15-minute countdown expiry, VPS reconciliation protocol (`GET /v2/{order_id}/status`), credential rotation checklist, and consumer protection / dispute terms under UU Perlindungan Konsumen & UU PDP.
  - Updated `docs/decisions/0004-member-workspace-course-commerce.md` formally recording Midtrans Core API Dynamic QRIS adoption behind `PaymentGateway`.
  - Updated `.env.example` adding Midtrans configuration keys (`MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_MERCHANT_ID`, `MIDTRANS_IS_PRODUCTION="false"`).
  - Updated `PLAN.md` and `CHANGELOG.md` marking Task 42.1 complete.
- Phase: Task 42.1 completed, verified locally across all test suites, ready for commit, push, PR creation, and review.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `6cd3d5a` |
| Origin | `origin/main` at `6cd3d5a`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-sprint-42-midtrans-boundary` |
| Task branch | `codex/sprint-42-midtrans-boundary` |
| Base commit | `6cd3d5a` (Merge pull request #80 from notyourkise/codex/sprint-41-rehearsal-review) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Background dev server | Stopped |

## 3. Milestone & Sprint Progress

- **Milestone 14 (Learner Experience and Mastery Quality):** **COMPLETE & MERGED**
- **Milestone 15 (Final Production and Commercial Release):** **ACTIVE**
  - **Sprint 40 (Persistent Security and Release Baseline):** **COMPLETE & MERGED** (PR #73, #74, #75, #76)
  - **Sprint 41 (Staging, Recovery, and Operational Readiness):** **COMPLETE & MERGED** (PR #77, #78, #79, #80)
  - **Sprint 42 (Midtrans Gateway and Controlled Commercial Activation):** **ACTIVE** (gated for live activation)
    - [x] Task 42.1: Refresh and approve the exact Dynamic QRIS/provider boundary from current official documentation.
    - [ ] Task 42.2: Implement the server-only adapter, verified/idempotent webhook processing, and VPS reconciliation CLI.
    - [ ] Task 42.3: Verify sandbox and staging success/failure/expiry/replay/reconciliation flows.
    - [ ] Task 42.4: Request separate explicit owner authorization for production deployment and live-payment activation.
    - [ ] Task 42.5: Complete post-release smoke/monitoring/recovery review and synchronize evidence.

## 4. Verification Evidence and Limits

- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `npm test`: **Passed** (143 test files / 877 tests passed, 100%).
- `npm run build`: **Passed** (Next.js 16.3.2 production build succeeded, 53 routes compiled).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Stage and commit Task 42.1 changes to `codex/sprint-42-midtrans-boundary`.
2. Push branch to GitHub via `git push -u origin codex/sprint-42-midtrans-boundary`.
3. Open PR via `gh pr create` targeting `main`.
4. Monitor CI checks.
5. Report ready for review and merge to Abangku.
6. After merge by Abangku, sync `main` and proceed to Task 42.2 (Implement server-only adapter, idempotent webhook, and reconciliation CLI).
