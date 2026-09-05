# Netloka — Agent Handoff

Last updated: **2026-09-05 16:19 WITA**. This is a development snapshot, not a live status feed. Read [AGENTS.md](../AGENTS.md), then verify Git, files, PRs, and checks before acting. Do not depend on prior chat history.

## 1. Product and active work

- Netloka is an interactive **IT infrastructure learning platform**. Networking is its first available learning domain; the product journey is **Learn → Interact → Practice → Challenge → Consultant Project**.
- Milestones 0–6 are complete; **Milestone 7 remains active**. Staging/production and other launch gates remain unverified.
- Sprint 17 merged in PR #18, account security merged in PR #19, Sprint 18 merged in PR #20, Sprint 19 merged in PR #21, Sprint 20 merged in PR #22, and card icon fix merged in PR #23.
- **Current task:** Fix profile display name / username synchronization and remove separate profile flame streak.
- **Owner-approved scope:**
  - Fix username / display name updates so changes persist and reflect immediately across the app (dashboard, profile header, sidebar, drawer, and client session) without requiring re-login.
  - Update `getCurrentUser()` in `src/lib/auth.ts` to query fresh user state from PostgreSQL (`prisma.user.findUnique`).
  - Support `trigger === "update"` in NextAuth `jwt` callback (`src/features/auth/auth.ts`) and map `token.name` into `session.user.name`.
  - Wire `useSession().update({ name })` and `onNameUpdated` callback into `ProfileForm` (`src/features/profile/profile-form.tsx`).
  - Update `AccountModal` and `LearnerWorkspaceShell` with reactive state overrides.
  - Remove disconnected flame streak button, countdown timer, `flameData`, and `localStorage` streak claiming from `AccountModal`. Dashboard streak flame (`user?.streakCount`) is the single source of truth.
- **Current phase:** Implementation locally verified. All unit tests, typecheck, linter, E2E, and build passing. Ready for commit, push, PR, and Abangku's review.

## 2. Verified Git and worktree checkpoint

Verified locally on 2026-09-05:

| Item | State |
| --- | --- |
| Repository | `notyourkise/NetLoka` |
| Main checkout | `C:/laragon/www/netloka`, branch `main` |
| Verified main / `origin/main` | `d7705621bf8cfcf25716e29ccac0a1fa6683ecc4` — merge PR #23 |
| Last confirmed merge before this task | PR #23 — fix: remove interactive labs icon from main content card |
| Implementation worktree | `C:/laragon/www/netloka/.worktrees/codex-fix-profile-username-sync-flame` |
| Implementation branch | `codex/fix-profile-username-sync-flame` |

Retained unrelated worktree (not a cleanup target):

- `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` → `docs/staging-progress` (last observed `8460136`).

## 3. UI and Feature Changes

- `src/lib/auth.ts`:
  - `getCurrentUser()` queries `prisma.user.findUnique` when a session exists so Server Components always receive fresh user data from PostgreSQL.
- `src/features/auth/auth.ts`:
  - Added `trigger === "update"` handling in `jwt` callback to update `token.name`, `token.headline`, and `token.picture`.
  - Mapped `token.name` into `session.user.name` in `session` callback.
- `src/features/profile/profile-form.tsx`:
  - Connected `useSession().update({ name })` to sync client NextAuth token.
  - Added `onNameUpdated` prop to notify parent components immediately.
  - Added empty/whitespace name validation.
- `src/components/navigation/account-modal/account-modal.tsx`:
  - Added `nameOverride` and derived `displayName` for immediate UI reactivity.
  - Removed `flameData`, `setFlameData`, `handleClaimFlame`, `hasClaimedToday`, `midnightCountdown`, `getDeviceLocalDate`, `getYesterdayDeviceDate`, and `getTimeUntilMidnight`.
  - Removed flame button and countdown from Level Progression card.
- `src/components/navigation/learner-workspace-shell.tsx`:
  - Added `userOverride` state and passed `onUserUpdated={setUserOverride}` to `AccountModal` so sidebar and mobile drawer reflect name changes immediately.
- Tests:
  - Added `src/features/profile/profile-form.test.tsx` (6 tests).
  - Added `src/lib/auth.test.ts` (6 tests).
  - Updated `src/features/auth/auth-options.test.ts` (8 tests).
  - Updated `src/components/navigation/app-header.test.tsx` and `learner-workspace-shell.test.tsx`.

## 4. Verification status and limits

- Local verification completed:
  - `npm run db:generate`: Prisma client generated successfully.
  - `npm run typecheck`: 0 errors.
  - `npm run lint`: 0 errors / 0 warnings.
  - `npm test`: 51 test files (250 tests) 100% green.
  - `npx playwright test src/e2e/member-workspace.spec.ts --project=chromium`: 5 passed 100% green.
  - `npm run build`: 34 of 34 routes compiled and generated successfully.
  - `git diff --check`: Clean (0 whitespace errors).

## 5. Next action

1. Commit changes on `codex/fix-profile-username-sync-flame` with conventional commit message `fix: sync profile display name updates and unify streak flame on dashboard`.
2. Push branch to `origin/codex/fix-profile-username-sync-flame` using Git transport.
3. Open a Pull Request targeting `main` via `gh pr create`.
4. Monitor and verify all applicable GitHub Actions CI checks on the PR head.
5. Report PR as ready for Abangku's review and merge.

## 6. Known open product/deployment gates

- Public password recovery still needs real isolated/staging migration and SMTP delivery verification, reset abuse/timing protection, and approved session-revocation policy.
- Google OAuth needs live provider configuration/verification after private credentials are deployed securely.
- Milestone 8 Dynamic QRIS/Midtrans stays deferred until premium course content, pricing, merchant/legal/tax, provider, and staging/deployment gates are satisfied. Do not request/store live payment credentials in this task.
- Staging and production have not been verified or deployed for the current feature set.

