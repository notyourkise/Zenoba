# Dashboard Distillation & Workspace Focus — Design

**Status:** Owner-approved scope; planning only. No application code has been changed by this document.

**Milestone / sprint:** Milestone 7 / proposed Sprint 18

**Decision date:** 2026-09-05 WITA

## Problem

The authenticated `/dashboard` currently repeats public marketing material and turns a learner workspace into a long secondary landing page. It renders four statistic cards, four pillar cards, five roadmap cards, four platform-highlight cards, four FAQ cards, a promotional footer, and numerous decorative icons. That makes the next learning action hard to find and conflicts with the owner preference for a quiet, text-led interface.

The persistent authenticated sidebar already provides the primary workspace navigation. Repeating its destinations and public product explanation in the dashboard is unnecessary.

## Approved product decision

`/dashboard` becomes a focused learner starting point, not a marketing page.

- Remove the following sections from the authenticated dashboard only: **4 Pilar Utama Netloka**, **Roadmap & UKK**, platform highlights, FAQ, and the promotional footer.
- Keep that public-oriented material on the locked pre-login landing page. Do not edit `src/app/page.tsx`, `src/components/marketing/`, public navigation, or auth-modal UI for this work.
- Do not use decorative icons, icon-only controls, icon badges, or a grid of cards in the new dashboard. Each required action can be expressed with visible text.
- Retain the existing black/white authenticated workspace surface and the functional theme setting. This is not a redesign of the sidebar, account modal, catalog, payments, learning content, or public pages.

## Target experience

The page uses one responsive reading column with ordinary section boundaries, clear headings, whitespace, and text links. It should feel like an operational home screen for a signed-in learner.

```text
Authenticated sidebar (existing)
└── Dashboard content
    ├── Welcome + one-sentence orientation
    ├── Continue learning
    │   ├── current path title and compact completion context
    │   └── one primary text action
    ├── Learning progress
    │   └── completed lessons | in progress | XP, as inline text metrics
    └── Practice
        └── Labs | Challenges | Consultant, as ordinary text links
```

### Content and states

| State | Primary content | Primary action |
| --- | --- | --- |
| A published path has progress | The first active path, its lesson completion count, and a labelled progress indicator | `Continue learning` to the path |
| A published path exists with 0% progress | The first available path with an invitation to begin | `Start learning` to the path |
| No published path is returned | A concise empty state that explains no path is available yet | Text link to `Course catalog` when that destination remains available |
| A signed-in learner has no recorded lesson activity | Metrics show zero values truthfully; they do not disappear or imply an error | The path action above remains the only primary action |

The initial implementation may use the same currently selected `activePath` rule as the existing page until product requirements define a true "next lesson" resolver. It must not claim that it resumes an exact lesson unless a server-authoritative lesson-level continuation URL is available.

### Copy and visual rules

- Use a direct welcome heading and a short orientation sentence; no status badge or celebratory visual.
- Use an explicit `Continue learning` / `Start learning` text link or button based on recorded progress. It is the only visually primary CTA in the dashboard body.
- Show progress as text first (for example, `12 of 24 lessons completed`) and a horizontal indicator second. The indicator has a visible label and programmatic progress-bar semantics.
- Display `Completed`, `In progress`, and `XP` as compact values separated by layout rules or natural spacing, not individual containers with card styling.
- Render `Labs`, `Challenges`, and `Consultant` as secondary text links under `Practice`; do not create feature cards for them.
- Use responsive layout primitives so the page remains one column. Metrics and secondary links may wrap naturally on narrow viewports, never requiring horizontal scroll.
- Keep readable foreground/background contrast for the existing black/white theme modes and retain visible keyboard focus.

## Existing flow and planned change

```text
GET /dashboard
  → existing protected `(app)` layout and session resolution
  → DashboardPage resolves current user
  → getUserProgressSummary(user.id) + getLearningPathsWithProgress(user.id)
  → server-rendered dashboard content inside LearnerWorkspaceShell
```

Authorization, learning-path visibility, progress ownership, and the sidebar remain unchanged. The dashboard will continue to consume the existing read models. Once the current user is resolved, both independent reads should run concurrently with `Promise.all`; no database schema, migration, API, payment, or authentication behavior is in scope.

## Affected boundaries

| Area | Change |
| --- | --- |
| `src/app/(app)/dashboard/page.tsx` | Replace marketing/card-heavy composition with the focused server-rendered workspace view; remove unused Lucide imports and helper card components; fetch independent reads concurrently; add progress semantics. |
| `src/features/learning/progress.ts` | Read-only consumer; no behavioral change expected. |
| `src/features/learning/queries.ts` | Read-only consumer; no behavioral change expected. |
| `src/components/navigation/learner-workspace-shell.tsx` | Read-only existing shell; no redesign. |
| dashboard-focused test file | Add regression coverage for the selected path, progress semantics, empty state, and removed marketing/icon composition. |
| `src/e2e/member-workspace.spec.ts` | Revisit only if its authenticated-fixture capability supports a deterministic signed-in dashboard assertion. Do not invent or bypass authentication merely for visual coverage. |

## Acceptance criteria

- An authenticated learner can immediately identify one next learning action without scanning marketing content.
- The dashboard contains no decorative SVG/icon markup and no repeated card grid for metrics, pillars, roadmap, features, or FAQ.
- The dashboard no longer renders the five named public-marketing sections, while the locked public landing files receive no diff.
- A learner with an active path sees a correct path link, text completion context, and a labelled progress bar with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
- A learner with zero progress sees `Start learning`; a learner with progress sees `Continue learning`.
- A no-path response is clear, non-broken, and navigable without fabricated progress.
- The existing protected-route behavior, sidebar navigation, theme setting, learning authorization, and free Networking access remain unchanged.
- Keyboard focus, contrast, 200% zoom, and narrow mobile widths remain usable; the content has no horizontal overflow.
- Focused automated tests, lint, typecheck, unit suite, applicable E2E suite, production build, and GitHub Actions all pass before an implementation PR is presented for review.

## Non-goals

- Changing the locked pre-login landing page or authentication modal.
- Altering the authenticated sidebar information architecture or account/settings modal.
- Adding a next-lesson data model, recommendation engine, notifications, streaks, social features, or analytics.
- Changing course catalog, pricing, package, entitlement, sandbox payment, or future Dynamic QRIS behavior.
- Creating new icons, illustrations, cards, dependencies, migrations, routes, APIs, or environment variables.

## Risks and implementation guards

1. **False continuation claim.** Current read models expose path progress, not a confirmed last incomplete lesson. Link to the path unless a future approved resolver supplies an exact lesson.
2. **Locked public UI regression.** Limit code changes to authenticated dashboard/tests/docs and verify `src/app/page.tsx` plus `src/components/marketing/` have no diff.
3. **Accessibility regression from minimalism.** Removing visual containers must not remove heading hierarchy, focus styling, text labels, or progress semantics.
4. **Misleading test coverage.** Existing member-workspace Playwright tests emphasize access control. Add deterministic component/server-page coverage first; only add signed-in E2E coverage when the repository has a supported authenticated fixture.
5. **Existing user-owned local edits.** The main checkout currently has a user-owned dashboard change. Start implementation later from a newly synchronized isolated worktree and never overwrite that change.

## Required implementation reference

The ordered, test-first execution details are in [the implementation plan](../plans/2026-09-05-dashboard-distillation.md). An implementation agent must re-read `AGENTS.md`, the current handoff, this design, the plan, relevant source/tests, and current Git state before editing code.
