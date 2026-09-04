# Netloka — Agent Handoff

Last updated: **2026-09-05 02:28 WITA**. This is a development snapshot, not a live status feed. Read [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not depend on prior chat history.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**. Networking is its first available learning domain; the product journey is **Learn → Interact → Practice → Challenge → Consultant Project**.
- Milestones 0–6 are complete; **Milestone 7 remains active**. Staging/production and other launch gates remain unverified.
- Sprint 17's workspace/commerce work merged in PR #18, and the account-security/theming work merged in PR #19. Neither merge is evidence of deployment.
- **Current task:** Dashboard Distillation & Workspace Focus (proposed Sprint 18).
- **Owner-approved scope:** Change authenticated `/dashboard` into a quiet, text-led learner workspace. Remove its public marketing sections, decorative icons, and repeated card grids. Keep public landing/auth UI exactly as it is; public material stays on the landing page.
- **Current phase:** Documentation plan complete in this worktree; no dashboard application code, migration, dependency, remote push, PR, CI run, or deployment has been created for this task.

## 2. Verified Git and worktree checkpoint

Verified locally on 2026-09-05:

| Item | State |
| --- | --- |
| Repository | `notyourkise/NetLoka` |
| Main checkout | `C:/laragon/www/netloka`, branch `main` |
| Verified main / `origin/main` | `6082a7022e7f8383d2571b40afdf6e21e8f26c2b` — merge PR #19 |
| Last confirmed merge before this docs task | PR #19 — Account Security, 2FA, Google Account Connection, Account Modal Expansion, and B/W Theming |
| Planning worktree | `C:/laragon/www/netloka/.worktrees/codex-dashboard-distillation-plan` |
| Planning branch | `codex/dashboard-distillation-plan`, based on `6082a70` |
| Planning documentation commit | `350dfc0` — `docs: plan dashboard distillation` |
| Planning worktree local changes | None expected after the checkpoint commit below; verify with `git status` before acting. |
| Main checkout local changes | A user-owned modification to `src/app/(app)/dashboard/page.tsx`; preserve it. It is not part of this planning branch and must never be reset, stashed, or overwritten without owner instruction. |

Retained unrelated worktree (not a cleanup target):

- `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` → `docs/staging-progress` (last observed `8460136`).

## 3. Dashboard evidence and approved design

The planning audit could not browser-inspect authenticated content because an unauthenticated local browser is redirected from `/dashboard` to the Sign In modal. The audit therefore traced current source and its consumers:

- `src/app/(app)/dashboard/page.tsx` is a 531-line server page containing four statistic cards, four pillar cards, five roadmap steps, four feature cards, four FAQ cards, promotional footer content, and numerous Lucide imports.
- `src/components/navigation/learner-workspace-shell.tsx` already owns the authenticated shell and sidebar. It already provides Dashboard, My Learning, Course Catalog, My Packages, and Orders destinations, so dashboard should not reintroduce marketing/navigation tiles.
- `src/features/learning/progress.ts` exposes the user-scoped summary; `src/features/learning/queries.ts` exposes learning paths with progress. The current page awaits these independent reads sequentially; the planned implementation uses `Promise.all` after user resolution.
- Current page-level progress uses a visual `<div>` but has no `role="progressbar"` semantics. The plan requires a labelled semantic progress bar and truthful text context.
- The page should not promise exact lesson resumption because current read models only provide path-level progress.

Design and implementation references:

- [Dashboard Distillation & Workspace Focus Design](superpowers/specs/2026-09-05-dashboard-distillation-design.md)
- [Dashboard Distillation & Workspace Focus Implementation Plan](superpowers/plans/2026-09-05-dashboard-distillation.md)
- [Member Workspace and Course Commerce Design](superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md)

## 4. Actual codebase map for the next implementation agent

| Area | Paths to read before changing code |
| --- | --- |
| Protected dashboard and shell | `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/layout.tsx`, `src/components/navigation/learner-workspace-shell.tsx` |
| Learning read models | `src/features/learning/progress.ts`, `src/features/learning/queries.ts` |
| Authorization/session | `src/lib/auth.ts`, `src/features/auth/auth.ts`, `src/middleware.ts` |
| Existing workspace tests | `src/e2e/member-workspace.spec.ts`, `src/test/setup.ts`, colocated `*.test.tsx`, `playwright.config.ts` |
| Product/workflow truth | `AGENTS.md`, `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`, this handoff, dashboard design/plan |
| CI and scripts | `.github/workflows/`, `package.json`, `package-lock.json` |

Trace before implementation:

```text
Browser /dashboard → existing route/session protection → DashboardPage → current user
→ user-scoped progress/path read models → server-rendered dashboard → existing workspace shell/sidebar
```

## 5. Verification status and limits

- Planning-task validation still required before commit: documentation/path consistency review and `git diff --check`.
- No application suite is required for a documentation-only branch; no application suite result should be reported for this task.
- Historical PR #18 and #19 test evidence is not fresh verification of a future dashboard implementation.
- A signed-in local browser audit requires an authorized local development account and isolated data. Do not bypass authentication or use production data merely to create dashboard screenshots/tests.

## 6. Next action

1. Finish the documentation-only review, commit the plan/checkpoint on `codex/dashboard-distillation-plan`, and report its local status. Do not push or create a PR unless Abangku asks.
2. When Abangku requests implementation, recover context again and create/reuse a **fresh** isolated implementation worktree based on current `origin/main`; do not implement in this planning worktree or in the dirty main checkout.
3. Execute plan Tasks 1–4 test-first. Ask Abangku before any material scope or data-contract change; no new decision is presently needed for the approved dashboard scope.
4. Before an implementation PR, run all applicable local quality gates, inspect latest-head GitHub Actions, and wait for Abangku's review/merge. Synchronize a clean main checkout and clean only the verified task worktree/branch afterward.

## 7. Known open product/deployment gates

- Public password recovery still needs real isolated/staging migration and SMTP delivery verification, reset abuse/timing protection, and approved session-revocation policy.
- Google OAuth needs live provider configuration/verification after private credentials are deployed securely.
- Milestone 8 Dynamic QRIS/Midtrans stays deferred until premium course content, pricing, merchant/legal/tax, provider, and staging/deployment gates are satisfied. Do not request/store live payment credentials in this task.
- Staging and production have not been verified or deployed for the current feature set.
