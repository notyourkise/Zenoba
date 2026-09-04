# Netloka — Agent Handoff

Last updated: **2026-09-05 03:37 WITA**. This is a development snapshot, not a live status feed. Read [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not depend on prior chat history.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**. Networking is its first available learning domain; the product journey is **Learn → Interact → Practice → Challenge → Consultant Project**.
- Milestones 0–6 are complete; **Milestone 7 remains active**. Staging/production and other launch gates remain unverified.
- Sprint 17 merged in PR #18, account security merged in PR #19, and Sprint 18 (Dashboard distillation) merged in PR #20.
- **Current task:** Cosmic Orbital Workspace UI Redesign (Sprint 19).
- **Owner-approved scope:** Transform `/dashboard`, `LearnerSidebar`, and `LearnerMobileDrawer` into a cosmic, orbital-themed workspace matching the user-provided reference design (`media_1788549989073.png`). Include Earth orbital hero banner with Netloka quote, 4 stats cards with 3D glowing flame, circular donut gauge, resume card, and 3 exploration cards with flowing luminous waves.
- **Current phase:** Implementation locally verified. All unit tests, Playwright E2E tests, build, and linter passing. Ready for commit, push, PR, and Abangku's review.

## 2. Verified Git and worktree checkpoint

Verified locally on 2026-09-05:

| Item | State |
| --- | --- |
| Repository | `notyourkise/NetLoka` |
| Main checkout | `C:/laragon/www/netloka`, branch `main` |
| Verified main / `origin/main` | `2999efa23f9b3d99cedba01af6984c3c6889ed65` — merge PR #20 |
| Last confirmed merge before this task | PR #20 — refactor: focus learner dashboard (sprint 18) |
| Implementation worktree | `C:/laragon/www/netloka/.worktrees/codex-dashboard-sidebar-cosmic-redesign` |
| Implementation branch | `codex/dashboard-sidebar-cosmic-redesign` |
| Stashed main edits | `stash@{0}: On main: local-dashboard-changes-before-sync-pr-20` |

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

- Local verification completed:
  - `npm run db:generate`: Prisma client generated successfully.
  - `npm run typecheck`: 0 errors.
  - `npm run lint`: 0 errors / 0 warnings.
  - `npm test`: 49 test files (235 tests) 100% green.
  - `npx playwright test src/e2e/member-workspace.spec.ts --project=chromium`: 5 passed 100% green.
  - `npm run build`: 34 of 34 routes compiled and generated successfully.
  - `impeccable detect.mjs`: 0 antipatterns (`[]`).
  - `git diff --check`: Clean (0 whitespace errors).
  - Public landing files (`src/app/page.tsx`, `src/components/marketing/`): 0 diff.

## 6. Next action

1. Commit changes on `codex/dashboard-distillation` with conventional commit message `refactor: focus learner dashboard`.
2. Push branch to `origin/codex/dashboard-distillation` using GitHub CLI.
3. Open a Pull Request targeting `main`.
4. Monitor and verify all applicable GitHub Actions CI checks on the PR head.
5. Report PR as ready for Abangku's review and merge.

## 7. Known open product/deployment gates

- Public password recovery still needs real isolated/staging migration and SMTP delivery verification, reset abuse/timing protection, and approved session-revocation policy.
- Google OAuth needs live provider configuration/verification after private credentials are deployed securely.
- Milestone 8 Dynamic QRIS/Midtrans stays deferred until premium course content, pricing, merchant/legal/tax, provider, and staging/deployment gates are satisfied. Do not request/store live payment credentials in this task.
- Staging and production have not been verified or deployed for the current feature set.
