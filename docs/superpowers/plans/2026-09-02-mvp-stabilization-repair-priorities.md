# MVP Stabilization Repair Priorities

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore clean quality gates, resolve the observed UI accessibility regressions, synchronize product documentation, and prepare a controlled handoff into security hardening and staging deployment.

**Architecture:** Treat UI regressions, repository hygiene, security hardening, and deployment as separate review gates. Finish and verify each gate before advancing; production deployment remains prohibited until staging migration, backup, restore, smoke, and security checks have passed.

**Tech Stack:** Next.js 16.3.2, React 19, TypeScript 5, Tailwind CSS 4, Vitest, Testing Library, Playwright, ESLint, Prisma 7, Docker, Caddy, Cloudflare.

**Spec:** `ROADMAP.md` Milestone 7, `PLAN.md` Sprint 15–16, `docs/TECHNICAL_DEBT.md`

## Global Constraints

- Netloka remains in feature development; no deployment is authorized by this plan alone.
- Networking is the first available learning domain; future IT Infrastructure domains remain non-interactive and labeled `Soon`.
- Use test-driven development for every bug fix: reproduce RED, implement the smallest correction, then verify GREEN.
- Do not discard, reset, overwrite, or silently commit unrelated working-tree changes.
- Do not route learner-controlled terminal input to a host shell, process, SSH connection, Docker socket, or arbitrary executor.
- Keep decorative icons out of cards, badges, and CTA labels unless explicitly requested.
- Record meaningful changes in `CHANGELOG.md` using WITA / GMT+8.

---

## Priority Gate 0 — Preserve the Current Worktree

### Task 1: Inventory and isolate the active stabilization diff

**Priority:** P0 — must happen before additional implementation.

**Files:**
- Inspect: all modified and untracked paths from `git status --short`
- Inspect: `CHANGELOG.md`
- Inspect: `PLAN.md`
- Do not modify application files in this task

**Interfaces:**
- Consumes: the current dirty `main` worktree at commit `e42ee68`
- Produces: a reviewed file inventory and an explicit decision about which files belong to the active UI stabilization work

- [ ] **Step 1: Capture repository evidence**

  Run:

  ```powershell
  git status --short
  git branch --show-current
  git log --oneline --decorate -10
  git diff --stat
  git diff --staged --stat
  ```

  Expected: branch is `main`; modified and untracked files are visible; no destructive command is used.

- [ ] **Step 2: Classify every changed path**

  Record each path as one of:

  ```text
  active-ui-stabilization
  documentation-alignment
  unrelated-user-work
  generated-artifact
  uncertain-needs-review
  ```

  Expected: no uncertain file is staged or committed until reviewed.

- [ ] **Step 3: Create a safe branch only after the inventory is understood**

  Run:

  ```powershell
  git switch -c codex/mvp-stabilization
  ```

  Expected: the working tree is preserved exactly on a focused branch. If this branch already exists, stop and inspect it rather than inventing another branch name.

- [ ] **Step 4: Re-run the inventory**

  Run:

  ```powershell
  git status --short
  git branch --show-current
  ```

  Expected: all prior changes remain present and the current branch is `codex/mvp-stabilization`.

---

## Priority Gate 1 — Restore Lint and Accessibility Correctness

### Task 2: Give animated CTA labels one accessible name

**Priority:** P0 — current Chromium E2E gate fails and all animated CTA names are duplicated.

**Files:**
- Modify: `src/components/ui/sliding-button-label.tsx`
- Create: `src/components/ui/sliding-button-label.test.tsx`
- Verify: `src/e2e/foundation.spec.ts`

**Interfaces:**
- Consumes: `SlidingButtonLabelProps { text: string; className?: string; containerClassName?: string }`
- Produces: unchanged visual two-line animation with only one text copy exposed to the accessibility tree

- [ ] **Step 1: Write the failing accessible-name test**

  Render a link containing `SlidingButtonLabel text="Jelajahi"`, then assert:

  ```tsx
  expect(screen.getByRole("link", { name: "Jelajahi", exact: true })).toBeVisible();
  expect(
    screen.queryByRole("link", { name: "Jelajahi Jelajahi", exact: true })
  ).not.toBeInTheDocument();
  ```

- [ ] **Step 2: Run the focused test and confirm RED**

  Run:

  ```powershell
  npm test -- --run src/components/ui/sliding-button-label.test.tsx
  ```

  Expected: the exact `Jelajahi` accessible-name assertion fails because both visual copies currently contribute to the name.

- [ ] **Step 3: Hide only the animated duplicate from assistive technology**

  Keep the first label unchanged and add `aria-hidden="true"` to the second visual label span. Do not hide the outer container or the first text copy.

- [ ] **Step 4: Verify focused unit and browser tests**

  Run:

  ```powershell
  npm test -- --run src/components/ui/sliding-button-label.test.tsx
  npx playwright test src/e2e/foundation.spec.ts --project=chromium
  ```

  Expected: the unit test passes and the foundation suite passes 7/7.

- [ ] **Step 5: Commit the isolated accessible-name correction**

  ```powershell
  git add src/components/ui/sliding-button-label.tsx src/components/ui/sliding-button-label.test.tsx src/e2e/foundation.spec.ts
  git commit -m "fix: expose one accessible name for animated labels"
  ```

### Task 3: Remove effect-driven tab-window state synchronization

**Priority:** P0 — current repository lint exits with an error.

**Files:**
- Modify: `src/components/marketing/live-simulator-showcase.tsx`
- Modify: `src/components/marketing/live-simulator-showcase.test.tsx`

**Interfaces:**
- Consumes: `activeTab`, `visibleStartIndex`, `SHOWCASE_TABS`, and `VISIBLE_TAB_COUNT`
- Produces: one explicit tab-selection handler that updates the selected tab and visible three-tab window from the same user event

- [ ] **Step 1: Add a regression test for selecting an off-window simulator tab**

  In the existing showcase test, navigate the tab window, select a newly visible tab, and assert that the selected simulator panel and its tab remain available without an effect-based synchronization step.

- [ ] **Step 2: Run the focused test and confirm the behavior is covered**

  Run:

  ```powershell
  npm test -- --run src/components/marketing/live-simulator-showcase.test.tsx
  ```

  Expected: the new assertion either fails against the current handler boundary or establishes the regression contract before refactoring.

- [ ] **Step 3: Replace the synchronization effect with an event handler**

  Introduce a handler with this responsibility:

  ```ts
  function handleSelectTab(tabId: ShowcaseTabId): void
  ```

  It must set `activeTab`, calculate the selected tab index, and adjust `visibleStartIndex` only when the selected index is outside the current three-tab window. Remove the `useEffect` whose only job is calling `setVisibleStartIndex` after `activeTab` changes.

- [ ] **Step 4: Run focused tests and lint**

  ```powershell
  npm test -- --run src/components/marketing/live-simulator-showcase.test.tsx
  npm run lint
  ```

  Expected: showcase tests pass and `react-hooks/set-state-in-effect` is absent.

### Task 4: Correct simulator tab semantics

**Priority:** P1 — current lint reports an accessibility warning.

**Files:**
- Modify: `src/components/marketing/live-simulator-showcase.tsx`
- Modify: `src/components/marketing/live-simulator-showcase.test.tsx`

**Interfaces:**
- Consumes: the simulator tab selector and active simulator content panel
- Produces: a valid `tablist` → `tab` → `tabpanel` relationship with stable IDs and `aria-controls`/`aria-labelledby`

- [ ] **Step 1: Add semantic assertions**

  Assert that the selector exposes a `tablist`, every simulator selector exposes role `tab`, the active tab has `aria-selected="true"`, and its associated panel exposes role `tabpanel`.

- [ ] **Step 2: Run the focused test and confirm RED**

  ```powershell
  npm test -- --run src/components/marketing/live-simulator-showcase.test.tsx
  ```

  Expected: role-based assertions fail because the current buttons have no tab semantics.

- [ ] **Step 3: Implement the complete tab relationship**

  Add `role="tablist"` to the selector container, `role="tab"` and `aria-controls` to each selector button, and `role="tabpanel"` plus `aria-labelledby` to the displayed simulator content. Preserve keyboard-visible focus styles.

- [ ] **Step 4: Verify focused tests and lint**

  ```powershell
  npm test -- --run src/components/marketing/live-simulator-showcase.test.tsx
  npm run lint
  ```

  Expected: tests pass and the `aria-selected` warning is absent.

- [ ] **Step 5: Commit the simulator tab corrections**

  ```powershell
  git add src/components/marketing/live-simulator-showcase.tsx src/components/marketing/live-simulator-showcase.test.tsx
  git commit -m "fix: stabilize simulator tab state and semantics"
  ```

---

## Priority Gate 2 — Close the Observed Mobile UI Risk

### Task 5: Reproduce and resolve the visually blank mobile sign-up CTA

**Priority:** P1 — observed during visual QA, but root cause is not yet confirmed.

**Files:**
- Inspect: `src/components/navigation/app-header.tsx`
- Inspect: `src/components/ui/button.tsx`
- Inspect: `src/app/globals.css`
- Modify only the file proven to cause the defect
- Test: `src/components/navigation/app-header.test.tsx`
- Verify: `src/e2e/foundation.spec.ts`

**Interfaces:**
- Consumes: mobile menu state and the `/sign-up` CTA
- Produces: a visible `Mulai Gratis` label with an exact accessible name at mobile widths in both supported color schemes

- [ ] **Step 1: Add a mobile browser reproduction**

  Set the viewport to `390x844`, open the mobile menu, locate the `/sign-up` link, and capture its text color, background color, opacity, visibility, and bounding box.

- [ ] **Step 2: Determine whether the defect is reproducible**

  Expected proof of a defect requires the element to be present while its text lacks visible contrast, has zero dimensions, is clipped, or is otherwise visually absent. If the defect cannot be reproduced, record the browser, theme, viewport, and screenshot evidence and do not guess at a CSS change.

- [ ] **Step 3: Write the smallest failing regression assertion**

  Use a component test for deterministic class/markup defects or Playwright screenshot/contrast evidence for browser-only behavior. The assertion must fail for the confirmed root cause, not merely search for existing text in the DOM.

- [ ] **Step 4: Implement one root-cause correction and verify both themes**

  Verify at `390x844` in light and dark mode that the text is visible, the accessible name is exactly `Mulai Gratis`, and the CTA remains within the viewport.

- [ ] **Step 5: Commit only if a defect was reproduced and fixed**

  ```powershell
  git add src/components/navigation/app-header.tsx src/components/navigation/app-header.test.tsx src/e2e/foundation.spec.ts
  git commit -m "fix: keep mobile sign-up CTA label visible"
  ```

---

## Priority Gate 3 — Synchronize Product Documentation

### Task 6: Align the product definition across authoritative documents

**Priority:** P1 — current documents contradict the approved broader IT Infrastructure direction.

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `ROADMAP.md`
- Review: `PRODUCT.md`
- Review: `DESIGN.md`
- Modify: `PLAN.md`
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: the approved product direction and navbar information architecture
- Produces: one consistent statement that Netloka is an interactive IT Infrastructure learning platform with Networking as the first available domain

- [ ] **Step 1: Enumerate contradictory product statements**

  ```powershell
  rg -n "networking learning platform|Interactive networking|Purpose:|Product:" AGENTS.md README.md ROADMAP.md PRODUCT.md DESIGN.md
  ```

- [ ] **Step 2: Update only product-positioning language**

  Preserve MVP scope: networking content remains the implemented curriculum, while Server & Linux, Cybersecurity, Cloud & DevOps, CCTV & Surveillance, Fiber Optic, and VoIP & PABX remain future domains labeled `Soon`.

- [ ] **Step 3: Update the active Sprint 16 checklist and changelog**

  Mark only the documentation-alignment item complete. Do not mark UI stabilization, staging, or production complete.

- [ ] **Step 4: Verify consistency**

  ```powershell
  rg -n "networking learning platform|Interactive networking" AGENTS.md README.md ROADMAP.md PRODUCT.md DESIGN.md
  git diff --check
  ```

  Expected: legacy positioning is removed or explicitly qualified as the current MVP domain; diff check passes.

- [ ] **Step 5: Commit documentation separately**

  ```powershell
  git add AGENTS.md README.md ROADMAP.md PRODUCT.md DESIGN.md PLAN.md CHANGELOG.md
  git commit -m "docs: align Netloka with IT infrastructure direction"
  ```

---

## Priority Gate 4 — Complete the Local Stabilization Gate

### Task 7: Run the complete local quality gate and review the final diff

**Priority:** P1 — required before security/deployment work.

**Files:**
- Review: all files classified as active UI stabilization or documentation alignment
- Modify: `PLAN.md` and `CHANGELOG.md` only after verification results are known

**Interfaces:**
- Consumes: completed Tasks 1–6
- Produces: a clean, reviewable stabilization branch with recorded verification evidence

- [ ] **Step 1: Run all repository checks**

  ```powershell
  npm run lint
  npm run typecheck
  npm test
  npm run test:e2e
  npm run build
  git diff --check
  ```

  Expected: every command exits zero. The Next.js middleware deprecation warning may remain only if explicitly accepted and tracked as TD-01.

- [ ] **Step 2: Review the final implementation diff**

  Inspect requirements coverage, architecture, tests, type safety, security, accessibility, responsive behavior, reduced motion, and unrelated file inclusion. Resolve all Critical and High findings before continuing.

- [ ] **Step 3: Update project records with exact evidence**

  Record test counts, browser coverage, build result, known low-severity warning, files changed, and `Git: pending` in `CHANGELOG.md`. Update `PLAN.md` only for gates actually completed.

- [ ] **Step 4: Commit the verified stabilization record**

  ```powershell
  git add PLAN.md CHANGELOG.md
  git commit -m "docs: record MVP stabilization verification"
  ```

---

## Priority Gate 5 — Security Hardening Before Staging

### Task 8: Create and execute a separate CSP hardening plan

**Priority:** P2 — mandatory before production, independent from the UI repairs.

**Files:**
- Create plan: `docs/superpowers/plans/2026-09-02-content-security-policy.md`
- Expected implementation areas: `next.config.ts`, `Caddyfile`, security-header tests, deployment documentation

**Interfaces:**
- Consumes: the verified local application asset/script/style requirements
- Produces: a tested CSP compatible with Next.js, local assets, fonts, scripts, styles, images, and required connections

- [ ] **Step 1: Inventory every required resource origin and inline behavior**
- [ ] **Step 2: Write failing security-header assertions**
- [ ] **Step 3: implement the narrowest compatible CSP**
- [ ] **Step 4: verify application flows and browser console violations**
- [ ] **Step 5: document rollback and deployment verification commands**

No Cloudflare WAF claim is permitted until tested against a real configured zone.

---

## Priority Gate 6 — Staging Validation, Then Production

### Task 9: Execute deployment validation as a separately authorized project

**Priority:** P2 for staging; P3 for production.

**Files:**
- Follow: `docs/deployment/staging.md`
- Follow: `docs/deployment/cloudflare-and-caddy.md`
- Follow: existing backup, restore, migration, and smoke-test scripts
- Update after evidence: `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`

**Interfaces:**
- Consumes: clean local gates, reviewed CSP, real staging infrastructure, and explicitly supplied external environment configuration
- Produces: verified staging evidence; only then may a separate production authorization be requested

- [ ] **Step 1: Obtain explicit authorization and real staging configuration**
- [ ] **Step 2: Validate the external staging environment file without exposing secrets**
- [ ] **Step 3: Deploy staging and verify health, migrations, headers, and Cloudflare WAF**
- [ ] **Step 4: Run backup and restore verification against staging data**
- [ ] **Step 5: Run smoke and critical-path E2E against staging**
- [ ] **Step 6: Review staging evidence and resolve all Critical/High findings**
- [ ] **Step 7: Request separate production authorization**
- [ ] **Step 8: Deploy production and run post-deploy verification**

Production must not start merely because staging deployment succeeds; it requires an explicit go/no-go review.

---

## Deferred Low-Priority Maintenance

These items do not block local feature stabilization but remain tracked:

1. **P3:** Migrate deprecated `src/middleware.ts` to the Next.js `proxy` convention with authentication regression coverage.
2. **P4:** Persist long-running terminal simulator state using a browser-local mechanism only if learner usage demonstrates the need.
3. **P4:** Expand subnet visualization beyond the current IPv4 `/16`–`/30` focus in a post-MVP milestone.
4. **P4:** Implement future learning domains only after roadmap activation; keep current navbar entries labeled `Soon`.

## Exit Criteria

- [ ] Working changes are isolated and reviewable on a focused branch.
- [ ] ESLint, type-check, unit/integration tests, full E2E, and production build all exit zero.
- [ ] Animated CTA labels expose exactly one accessible name.
- [ ] Simulator tab state and accessibility semantics are correct.
- [ ] The mobile sign-up CTA observation is either reproduced and fixed or closed with documented evidence.
- [ ] Authoritative product documentation consistently describes the broader IT Infrastructure direction.
- [ ] CSP is tested before production.
- [ ] Staging migration, backup, restore, smoke, security-header, WAF, and critical-path checks pass.
- [ ] Production deployment occurs only after explicit authorization and staging go/no-go approval.
