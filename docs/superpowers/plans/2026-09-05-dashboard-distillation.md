# Dashboard Distillation & Workspace Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the authenticated dashboard into a minimal, text-led learner workspace that foregrounds the next learning action and truthful progress, while preserving the locked public landing/auth experience.

**Architecture:** Keep `/dashboard` as a protected server component using the existing user, path-progress, and summary read models. Replace only its presentation composition; fetch independent progress/path reads concurrently after session resolution. Tests make the desired signed-in states explicit without altering the authorization or persistence boundary.

**Tech Stack:** Next.js 16 App Router, React 19 server components, TypeScript, Tailwind CSS 4, Vitest + Testing Library, Playwright where an existing authenticated fixture makes it deterministic.

**Spec:** [Dashboard Distillation & Workspace Focus Design](../specs/2026-09-05-dashboard-distillation-design.md)

## Global constraints

- Work only in a fresh isolated `codex/` implementation worktree based on verified current `origin/main`; do not implement from the planning worktree or edit `main`.
- Preserve the user-owned uncommitted dashboard edit in the main checkout. Never stash, reset, discard, or copy it without explicit owner direction.
- Public landing/auth UI is locked. `src/app/page.tsx`, `src/components/marketing/`, public navigation, and auth modal files must have no diff.
- Do not add decorative icons, emoji, icon-only controls, icons in cards/badges/CTA labels, a new dependency, persistence, migration, API, route, commerce behavior, or deployment work.
- Keep the existing session protection, learner workspace shell/sidebar, Settings theme behavior, learning access guards, and free Networking behavior unchanged.
- Do not claim exact lesson continuation from path-level data. Link to the selected learning path until a separately approved next-lesson resolver exists.
- Update `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, and `docs/HANDOFF.md` using verified facts only. Timestamps use WITA.

## File map and end-to-end flow

| Path | Responsibility in this work |
| --- | --- |
| `src/app/(app)/dashboard/page.tsx` | Protected dashboard server composition; the only application UI file expected to change. |
| `src/features/learning/progress.ts` | Existing user-scoped summary read model. Consume it, do not duplicate its logic in React. |
| `src/features/learning/queries.ts` | Existing path-with-progress read model. Consume it, do not change access rules. |
| `src/components/navigation/learner-workspace-shell.tsx` | Existing authenticated shell/sidebar boundary. Inspect to avoid duplication; no redesign planned. |
| `src/e2e/member-workspace.spec.ts` | Existing protected-route coverage. Extend only when an established authenticated fixture permits it. |
| `src/app/(app)/dashboard/page.test.tsx` | New focused regression coverage for this route's server-rendered states. |

```text
Browser /dashboard
  → existing middleware + `(app)` layout authentication
  → DashboardPage / getCurrentUser
  → Promise.all(getUserProgressSummary, getLearningPathsWithProgress)
  → selected path + compact presentation
  → text link to learning path / existing sidebar destinations
```

## Task 1 — Establish the route contract with a failing focused test

**Files:**

- Create: `src/app/(app)/dashboard/page.test.tsx`
- Read only: `src/app/(app)/dashboard/page.tsx`, `src/test/setup.ts`, existing colocated server-page test patterns, `src/features/learning/progress.ts`, `src/features/learning/queries.ts`

- [ ] Inspect current Vitest/Testing Library mocking patterns before copying imports or helper names.
- [ ] Mock `getCurrentUser`, `getUserProgressSummary`, and `getLearningPathsWithProgress` at their real module boundaries. Keep all mock data local and typed as narrowly as the existing test conventions permit.
- [ ] Write a red test for a learner with a 42% active path. It must assert: one dashboard heading; a `Continue learning` link to that path; visible text such as `10 of 24 lessons completed`; a `progressbar` named after the path with `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow="42"`; and absence of the public dashboard heading `4 Pilar Utama Netloka`.
- [ ] Assert the route output contains no `svg` element. This protects the approved no-decorative-icon requirement within the page itself; it does not police the surrounding existing shell.
- [ ] Add red tests for the zero-progress state (`Start learning`) and no-published-path state (plain explanatory empty state plus `Course catalog` link).

Illustrative assertion structure; adapt exact imports to repository conventions rather than introducing a new test utility:

```tsx
const screen = render(await DashboardPage());

expect(screen.getByRole("link", { name: "Continue learning" }))
  .toHaveAttribute("href", "/learn/network-foundations");
expect(screen.getByRole("progressbar", { name: "Network Foundations progress" }))
  .toHaveAttribute("aria-valuenow", "42");
expect(screen.queryByText("4 Pilar Utama Netloka")).not.toBeInTheDocument();
expect(document.querySelector("svg")).toBeNull();
```

- [ ] Run `npm test -- --run src/app/(app)/dashboard/page.test.tsx` (quote the path if the shell treats parentheses specially). Confirm the test fails because the current dashboard still renders the old card/marketing composition or lacks the specified semantics.
- [ ] Record the exact failing command/result in the task notes or later changelog entry; do not modify production code in this task.

## Task 2 — Replace the dashboard composition with the focused workspace view

**Files:**

- Modify: `src/app/(app)/dashboard/page.tsx`
- Verify no diff: `src/app/page.tsx`, `src/components/marketing/`, `src/components/navigation/learner-workspace-shell.tsx`

- [ ] Keep current authentication/session behavior. Resolve `getCurrentUser()` first; keep its existing defensive fallback behavior if the code currently permits it.
- [ ] After a user ID is available, replace sequential summary/path calls with `Promise.all([getUserProgressSummary(user.id), getLearningPathsWithProgress(user.id)])`. Preserve the existing safe fallbacks when no session user exists; do not make a new persistence call.
- [ ] Derive the selected `activePath` from the existing returned list and preserve its current deterministic selection rule unless a test exposes an existing bug. Do not invent a last-incomplete-lesson URL.
- [ ] Remove all Lucide imports and all helper components dedicated to `StatCard`, `PillarCard`, `RoadmapStep`, `FeatureHighlightCard`, and `FaqCard` once unused. Do not replace them with visually equivalent bordered tiles.
- [ ] Render the following semantic, single-column sections in the server component:
  1. `h1` welcome heading with one short orientation sentence.
  2. `h2` **Continue learning** with the selected path title, a text completion sentence, a labelled `<div role="progressbar">`, and exactly one primary visible-text action. Use `Continue learning` when `progressPercent > 0`; use `Start learning` when it is zero.
  3. `h2` **Learning progress** with completed lessons, in-progress count, and XP as compact inline text metrics rather than card elements.
  4. `h2` **Practice** with ordinary visible-text links to the existing Labs, Challenges, and Consultant destinations.
- [ ] For the no-path state, render a concise `h2`/paragraph empty state and a visible `Course catalog` text link. Do not render a fake 0%-of-0 progress bar or a disabled primary CTA.
- [ ] Ensure the progress indicator has `aria-label={`${activePath.title} progress`}`, numeric `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow={activePath.progressPercent}`, and visible text context. Clamp only if the existing domain read model does not already guarantee 0–100; do not put progress calculation logic in the page.
- [ ] Use existing theme-aware black/white utility patterns. Keep 44px-or-greater pointer targets for interactive text actions, keyboard-visible focus, and natural wrapping at mobile widths. Use whitespace and simple separators—not shadows, rounded containers, card grids, or decorative assets—to create hierarchy.
- [ ] Run the focused Task 1 test and confirm it passes.

## Task 3 — Complete state, accessibility, and regression coverage

**Files:**

- Modify: `src/app/(app)/dashboard/page.test.tsx`
- Conditionally modify: `src/e2e/member-workspace.spec.ts` only if repository-supported authenticated fixture exists
- Read only: `playwright.config.ts`, `src/e2e/` fixtures/helpers, `src/components/navigation/learner-workspace-shell.tsx`

- [ ] Add/assert the truthful progress metrics for active, new, and empty states. Zero values must remain visible and must not turn into errors or decorative placeholders.
- [ ] Confirm the test renders no `svg`, no old public section headings, and only one body-level primary learning action for an active/new path. Keep assertions behavior-focused; do not couple tests to arbitrary Tailwind class strings.
- [ ] Inspect the Playwright suite for a supported authenticated user/session fixture. If it exists, add one signed-in `/dashboard` test asserting the resume action, semantic progress indicator, absent public heading, and no horizontal overflow at mobile viewport. If it does not exist, do **not** fabricate authentication or add test-only production bypasses; record that component coverage plus manual signed-in QA is the boundary.
- [ ] Manually inspect, using a real authorized local development account and isolated development data only: desktop, 375px mobile, keyboard tab sequence, focus visibility, 200% zoom, dark/light/system theme, active path, zero-progress path, and no-path state. Confirm public `/` still has its prior content through source diff and normal route smoke check; do not alter its locked UI.
- [ ] Run the focused tests again after all assertions are finalized.

## Task 4 — Review, documentation, and delivery gate

**Files:**

- Modify: `PLAN.md`, `ROADMAP.md`, `CHANGELOG.md`, `docs/HANDOFF.md`
- Read: `.github/workflows/`, `package.json`, current `AGENTS.md`

- [ ] Review the complete diff for data-access regressions, accidental public-file changes, lingering unused icon/helper code, accessibility semantics, mobile overflow, theme regressions, and misleading continuation copy. Resolve Critical/High findings before delivery.
- [ ] Update the dashboard task checkbox/status in `PLAN.md`, Sprint 18 status in `ROADMAP.md`, concise WITA evidence in `CHANGELOG.md`, and actual branch/worktree/verification/next action in `docs/HANDOFF.md`. Do not mark the sprint complete before its PR is merged and synchronization is verified.
- [ ] From the isolated implementation worktree, run the real project gates in this order and preserve outputs: `npm ci`, `npm run db:generate`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, and `git diff --check`. If a baseline or environment service blocks an applicable check, investigate and report the limitation; do not weaken checks.
- [ ] Read every applicable workflow in `.github/workflows/`; commit with a focused conventional message such as `refactor: focus learner dashboard` only after local review/gates are satisfactory.
- [ ] Validate GitHub context using `gh auth status`, `gh repo view`, and `gh pr status`; push the isolated branch and create one structured PR targeting `main`. Include scope/non-goals, no migrations/configuration, local evidence, screenshots for this UI change, known test limitations, and acceptance-criteria mapping.
- [ ] Verify the exact latest-head PR status, mergeability, and every applicable GitHub Actions job. Report it **ready for user review** only after all expected checks are green and local review is complete. Abangku alone reviews and merges.
- [ ] After Abangku confirms merge, follow the repository handoff workflow: verify the merged PR, fast-forward only a clean main checkout, preserve unrelated changes, and remove only the verified task worktree/branch when safe.

## Verification matrix

| Concern | Required evidence |
| --- | --- |
| Active learner flow | Focused route test for selected path link, completion copy, and 42% labelled progress bar; manual signed-in smoke. |
| New learner flow | Focused route test for zero progress and `Start learning`. |
| Empty catalog/path flow | Focused route test for explanatory state and `Course catalog` link. |
| Information reduction | Tests prove absent old public heading and no page-local SVG; diff confirms helper/card removal. |
| Accessibility | Progress ARIA assertions plus keyboard/focus, contrast, 200% zoom, and mobile manual checks. |
| Authorization and data | Existing route protection and user-scoped read models unchanged; relevant unit/E2E regression suite passes. |
| Public UI lock | `git diff -- src/app/page.tsx src/components/marketing/` is empty. |
| Release quality | Lint, typecheck, unit, applicable E2E, build, diff check, self-review, and latest-head GitHub Actions evidence. |

## Dependencies and unresolved decisions

- No external provider, database migration, payment configuration, or owner credential is needed.
- The owner has approved removal of public marketing blocks from `/dashboard`; that material remains on the public landing page.
- Exact-resume lesson routing remains intentionally deferred until a server-authoritative lesson-level resolver is separately designed and approved.
- Authenticated browser E2E depends on the repository already providing a safe fixture. Lack of such a fixture is a test-coverage limitation to record, not a reason to weaken authentication.
