# Member Workspace & Course Commerce Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first authenticated learner workspace and a server-authoritative, provider-neutral foundation for lifetime course access, while keeping Networking free and leaving the locked public landing/auth experience untouched.

**Architecture:** Extend the modular monolith with `src/features/commerce/`. Prisma/PostgreSQL are the authority for catalog, immutable order snapshots, payment-event idempotency, and entitlements. Only the protected `(app)` layout becomes a workspace shell with a sidebar/drawer. The public `/` page and public `AppHeader` behavior remain unchanged. A non-production sandbox exercises the payment state machine through server-only APIs; no browser state can produce a paid order or entitlement. Midtrans/QRIS is deferred to Milestone 8.

> Historical numbering update (2026-09-05): premium activation called M8 throughout this archived plan now belongs to **Milestone 12**, following owner-approved learning renewal M8–M11. This changes numbering only, not the original activation gates. See [ROADMAP.md](../../../ROADMAP.md).

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5, Prisma 7/PostgreSQL, NextAuth.js 4, Zod, Tailwind CSS 4, `next-themes`, Vitest/Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`; `ROADMAP.md` Milestone 7 / Sprint 17; `PLAN.md` Sprint 17.

## Global Constraints

- Start implementation only from a newly verified `main` in an isolated `codex/<task-slug>` worktree. Never edit `main` or unrelated worktrees.
- Before each task, trace callers/consumers and establish a focused baseline. The historical Windows `npm ci` `EPERM` lock is not passing test evidence.
- Do not change `src/app/page.tsx`, `src/components/marketing/`, public portions of `src/components/navigation/app-header.tsx`, or public auth-modal UI/UX.
- Public first-load remains dark. Authenticated workspace default is `#000000` / `#ffffff`; Settings theme toggle must work normally after login without changing public default markup/styles.
- Networking remains free. CCTV & Video Surveillance, Fiber Optic, PABX/IP PBX/VoIP, MikroTik, Cisco, Linux & Server Administration, and Network Security remain passive `Coming soon` / `Price announced at launch` premium tracks until real content is published.
- `SINGLE` packages contain exactly one premium course; `COMBO` packages contain two or more premium courses only. No subscriptions, renewals, coupons, customer refunds, prices, live payment methods, or production QRIS belong in Sprint 17.
- Derive price/package/course composition on the server. Client body/query/state/redirects must never set paid state or grant access. Do not log or persist secrets, QR payloads, or raw provider data.
- Read the relevant Next.js 16 files under `node_modules/next/dist/docs/` before writing App Router code; use no new dependency unless the installed stack cannot do the work.

## Delivery Flow

```text
Authenticated session
  -> workspace sidebar/drawer -> dashboard, learning, catalog, packages, orders, profile/settings
  -> owner-scoped commerce read models -> Prisma

Future available package only
  -> create-order API -> server-side PENDING snapshot
  -> verified provider/sandbox event -> PAID transaction + lifetime entitlements
  -> entitlement resolver -> linked premium learning path/API action
```

Existing Networking lessons, labs, challenges, and consultant cases are free. Do not blanket-guard them. Sprint 17 guards only a `LearningPath` explicitly linked to a premium `Course`; premium labs/challenges/consultant work requires a separately approved content-mapping design.

---

### Task 1: Record the commerce ADR and add pure catalog contracts

**Files:** Create `docs/decisions/0003-member-workspace-course-commerce.md`, `src/features/commerce/types.ts`, `src/features/commerce/catalog-rules.ts`, `src/features/commerce/catalog-rules.test.ts`.

**Interfaces:** `CourseAccessTier`, `CatalogStatus`, `PackageKind`, `OrderState`, `PaymentAttemptState`, `EntitlementState`, `PaymentProvider`; `validatePackageDefinition(input) -> ValidatedPackageDefinition`; `validateCourseAvailability(input) -> void`.

- [ ] **Write RED tests.** Cover one valid free Networking course, a valid coming-soon premium course, a valid available premium course with a published linked path, and rejection of free sellable courses, available premium without content, invalid Single/Combo sizes, free/duplicate package courses, price on coming-soon package, and missing/nonpositive price on available package.

  ```ts
  expect(() => validatePackageDefinition({
    kind: "COMBO", status: "AVAILABLE", amountIdr: 125000,
    courses: [{ slug: "networking", accessTier: "FREE" }],
  })).toThrow("Combo packages require at least two premium courses");
  ```

- [ ] **Run RED:** `npm test -- src/features/commerce/catalog-rules.test.ts` — expected failure because module is absent.
- [ ] **Implement minimally.** Use string unions (matching current schema style), stable typed errors, and one exported final-order-state constant. No Prisma/React dependency in these rules.
- [ ] **Run GREEN:** same command; all pure invariants pass.
- [ ] **Document ADR.** Record Course-vs-LearningPath identity, lifetime entitlement, provider-neutral payment, PaymentEvent idempotency log, no free course in a package, sandbox-only payment, and deferred Midtrans/QRIS. Reject client-granted access and subscription architecture.

**Commit:** `docs: record member workspace commerce decision`

---

### Task 2: Add reviewed persistence and deterministic catalog seed

**Files:** Modify `prisma/schema.prisma`, `prisma/seed.ts`; create `prisma/migrations/<timestamp>_add_course_commerce/migration.sql`, `prisma/commerce-seed.ts`, `src/features/commerce/catalog-seed.test.ts`.

**Interfaces:** Prisma models `Course`, `Package`, `PackageCourse`, `Order`, `OrderLine`, `PaymentAttempt`, `PaymentEvent`, `Entitlement`; optional unique `Course.learningPathId` ↔ `LearningPath.commerceCourse`; `seedCommerceCatalog(prisma) -> Promise<void>`.

- [ ] **Write RED seed tests.** Mock the Prisma delegates and assert upsert of free `networking`, all seven premium tracks as `PREMIUM`/`COMING_SOON`, null price, no fixture slugs, and no unreleased `AVAILABLE` record.
- [ ] **Run RED:** `npm test -- src/features/commerce/catalog-seed.test.ts` — expected failure because seed/schema models are absent.
- [ ] **Add models and constraints.**
  - Course/Package slugs unique; Course link optional/unique.
  - PackageCourse composite key `[packageId, courseId]` plus order index.
  - Order reference unique with `userId`, `packageId`, state, provider, `totalAmountIdr`, currency, expiry/final timestamps.
  - OrderLine snapshots package/course slugs, titles, amounts independently from mutable catalog records.
  - PaymentAttempt belongs to Order; PaymentEvent has unique provider event id and belongs to attempt.
  - Entitlement unique `[userId, courseId]`, source order/type/state; reactivate in a transaction rather than duplicate.
  - Cascades from User only; catalog deletion must not erase paid history.
- [ ] **Add seed data.** Add seven `SINGLE` coming-soon premium packages plus exactly these non-actionable combos: `field-infrastructure-bundle` (CCTV + Fiber Optic), `network-operations-bundle` (MikroTik + Linux & Server Administration), and `secure-connectivity-bundle` (Cisco + Network Security). Networking has no commercial package. Call Task 1 validators before writes.
- [ ] **Create/inspect migration on an approved disposable local DB only.** Generate SQL with Prisma tooling, inspect every table/index/FK, never migrate user/staging/production data.
- [ ] **Run GREEN:** `npm test -- src/features/commerce/catalog-seed.test.ts; npm run db:generate` — expected deterministic seed test and Prisma generation success.

**Commit:** `feat: add commerce catalog persistence`

---

### Task 3: Implement catalog, entitlement, and owner-scoped read models

**Files:** Create `src/features/commerce/catalog.ts`, `src/features/commerce/entitlements.ts`, `src/features/commerce/access.ts`, and matching `catalog.test.ts`, `entitlements.test.ts`, `access.test.ts`.

**Interfaces:** `getCatalogForLearner(userId) -> CatalogView`; `getMyLearning(userId)`, `getMyPackages(userId)`, `getMyOrders(userId)`; `resolveCourseAccess({ userId, courseId }) -> "FREE" | "ENTITLED" | "DENIED"`; `requireLearningPathAccess({ userId, pathSlug }) -> Promise<void>`.

- [ ] **Write RED tests.** Assert Networking has `Free`; unreleased premium cards expose exact labels and `canCheckout: false`; paid entitlement grants only owner access; free access needs no order; unknown/unlinked path is not accidentally premium.

  ```ts
  await expect(requireLearningPathAccess({ userId: "learner-a", pathSlug: "premium-cctv" }))
    .rejects.toMatchObject({ code: "COURSE_ACCESS_DENIED" });
  ```

- [ ] **Run RED:** `npm test -- src/features/commerce/catalog.test.ts src/features/commerce/entitlements.test.ts src/features/commerce/access.test.ts`.
- [ ] **Implement.** Return safe DTOs, not raw Prisma/payment fields. All service queries filter by supplied `userId`; `requireLearningPathAccess` returns for free/uncommercialized paths and requires active entitlement only for an explicitly linked premium path.
- [ ] **Run GREEN:** same command — catalog status, owner isolation, free access, and denial path pass.

**Commit:** `feat: add commerce catalog and entitlement queries`

---

### Task 4: Implement server-created pending orders and idempotent payment transitions

**Files:** Create `src/features/commerce/orders.ts`, `src/features/commerce/payments/types.ts`, `src/features/commerce/payments/sandbox-gateway.ts`, `src/features/commerce/payments.ts`, `src/features/commerce/orders.test.ts`, `src/features/commerce/payments.test.ts`.

**Interfaces:** `createPendingOrder({ userId, packageSlug, now }) -> { reference, state: "PENDING", expiresAt }`; `recordVerifiedPaymentEvent({ provider, providerEventId, providerReference, orderReference, status, now }) -> PaymentEventResult`; `PaymentGateway` with `createCheckout`/`verifyEvent`; only `SandboxGateway` this sprint.

- [ ] **Write RED state-machine tests.** Mock transaction-capable Prisma. Assert server price/composition snapshot, rejected coming-soon packages, immutable owner/lines, ignored browser amount, PENDING→PAID atomic order/event/entitlement update, no duplicate grants on replay, and no grant for expiry/cancellation/mismatched reference/unknown order.

  ```ts
  const first = await recordVerifiedPaymentEvent(successEvent);
  const replay = await recordVerifiedPaymentEvent(successEvent);
  expect(first.entitlementsGranted).toBe(2);
  expect(replay.entitlementsGranted).toBe(0);
  ```

- [ ] **Run RED:** `npm test -- src/features/commerce/orders.test.ts src/features/commerce/payments.test.ts`.
- [ ] **Implement.** Only a persisted `AVAILABLE` package whose premium courses have published linked paths may create an order. Generate opaque references and snapshots in one transaction. Record the payment event before state effect; validate provider/reference/expiry/transitions; upsert one entitlement per course. Replayed event is a successful no-op, final order never regresses.
- [ ] **Run GREEN:** same command — all transition/replay protections pass.

**Commit:** `feat: add idempotent commerce payment lifecycle`

---

### Task 5: Expose protected commerce APIs and fail closed outside sandbox

**Files:** Modify `src/lib/env/server.ts`, `.env.example`; create `src/app/api/commerce/orders/route.ts`, `src/app/api/commerce/orders/[reference]/route.ts`, `src/app/api/commerce/sandbox/events/route.ts`, `src/features/commerce/commerce-route.test.ts`.

**Interfaces:** `POST /api/commerce/orders` accepts only `{ packageSlug }`; `GET /api/commerce/orders/[reference]` is owner-scoped; `POST /api/commerce/sandbox/events` is non-production-only and requires server-only secret.

- [ ] **Write RED route tests.** Cover anonymous 401, malformed 400, unavailable package with no payment data, ignored extra amount/state/user fields, cross-user lookup without disclosure, production sandbox 404, missing/bad secret 401, and one valid non-production event delegation.
- [ ] **Run RED:** `npm test -- src/features/commerce/commerce-route.test.ts`.
- [ ] **Add fail-closed configuration.** `PAYMENT_MODE` is only `disabled | sandbox`, defaults `disabled`; `SANDBOX_PAYMENT_EVENT_SECRET` is validated only on sandbox request. Document safe placeholders. Reject sandbox when `NODE_ENV === "production"`; add no Midtrans variable.
- [ ] **Implement minimal routes.** Authenticate then Zod-validate. Pass only session `user.id`/slug to service. Status is read-only. Sandbox API has no UI link, returns 404 in production before reading body, and compares bearer secret in constant time.
- [ ] **Run GREEN:** same test command — authorization/client-tampering/fail-closed cases pass.

**Commit:** `feat: add protected commerce APIs`

---

### Task 6: Replace only the protected shell with accessible learner navigation and a real theme preference

**Files:** Modify `src/app/(app)/layout.tsx`, `src/app/providers.tsx`, `src/app/(app)/profile/page.tsx`, `src/app/(app)/settings/page.tsx`, `src/components/navigation/account-modal/account-modal.tsx`, `src/components/ui/mode-toggle.tsx`; create `src/components/navigation/learner-workspace-shell.tsx`, `learner-sidebar.tsx`, `learner-mobile-drawer.tsx`, `learner-account-route-modal.tsx`, and tests `learner-workspace-shell.test.tsx`, `mode-toggle.test.tsx`.

**Interfaces:** labelled links to `/dashboard`, `/my-learning`, `/catalog`, `/my-packages`, `/orders`, `/profile`, `/settings`; route-bound profile/settings AccountModal with safe close to dashboard; a `ModeToggle` backed by `next-themes` without forced dark.

- [ ] **Write RED component tests.** Assert desktop/mobile provide same seven destinations, drawer trigger has label, focus moves to drawer, Escape closes/restores focus, selecting link closes drawer, and public header is not imported. Assert default dark and Settings click sends `setTheme("light")`, then `setTheme("dark")`.
- [ ] **Run RED:** `npm test -- src/components/navigation/learner-workspace-shell.test.tsx src/components/ui/mode-toggle.test.tsx`.
- [ ] **Implement isolated shell.** Remove `AppHeader` only from protected layout. At `md+` render persistent text-labelled sidebar; below it render accessible drawer and correctly inset content. Use explicit workspace black/white styling with light-mode readable variants; no decorative card/CTA icons.
- [ ] **Repair theme behavior.** Change provider from forced dark to `defaultTheme="dark"`; initial public dark remains the same but deliberate authenticated user preference now works. Keep toggle in authenticated Settings only and change only its wording from `Cosmic Dark` to `Workspace dark`.
- [ ] **Reuse account controls.** Make profile/settings routes wrappers around current `AccountModal` tabs, closing to dashboard; retain profile/password/CLI/privacy contracts. Do not duplicate these forms.
- [ ] **Run GREEN and inspect 375px/desktop keyboard flow.** Same test command; expected focus, visibility, and both theme modes pass.

**Commit:** `feat: add authenticated learner workspace shell`

---

### Task 7: Build learner pages with passive coming-soon catalog

**Files:** Modify `src/app/(app)/dashboard/page.tsx`; create `src/app/(app)/my-learning/page.tsx`, `catalog/page.tsx`, `my-packages/page.tsx`, `orders/page.tsx`, `src/features/commerce/components/catalog-grid.tsx`, `catalog-grid.test.tsx`, `order-list.tsx`, `order-list.test.tsx`.

**Interfaces:** dashboard uses learning/commerce summary; `CatalogGrid` receives `CatalogView` and renders `accessLabel`, `availabilityLabel`, `priceLabel`, `canCheckout`; ownership pages accept only Task 3 DTOs.

- [ ] **Write RED UI/read-model tests.** Assert Networking `Free`; seven tracks and three combos show exact `Coming soon` / `Price announced at launch`; `canCheckout: false` renders no buy/checkout control; empty order/package states are clear; one user's DTO never surfaces another user record.

  ```tsx
  expect(screen.getByText("Price announced at launch")).toBeVisible();
  expect(screen.queryByRole("button", { name: /buy|checkout/i })).not.toBeInTheDocument();
  ```

- [ ] **Run RED:** `npm test -- src/features/commerce/components/catalog-grid.test.tsx src/features/commerce/components/order-list.test.tsx`.
- [ ] **Implement server pages.** Each calls `getCurrentUser` and owner-scoped query. Rebuild dashboard as concise workspace Overview—continue learning, progress, active packages, recent orders, recommendation—without `CosmicBackground`. My Learning shows free Networking plus entitled premium paths only.
- [ ] **Keep current products completely passive.** Do not make a checkout page/UI while all package records remain coming-soon. Task 5 API stays infrastructure-only until Milestone 8 has real available content/products.
- [ ] **Run GREEN:** same command — correct statuses and no fake purchase path.

**Commit:** `feat: add learner catalog and ownership pages`

---

### Task 8: Enforce premium entitlement at learning read and mutation boundaries

**Files:** Modify `src/features/learning/queries.ts`, `progress.ts`, `src/app/api/learning/progress/route.ts`, their existing tests; create `src/features/commerce/learning-access.integration.test.ts`.

**Interfaces:** `getLearningPathDetail`/`getLessonDetail` invoke `requireLearningPathAccess`; `startLessonProgress`/`completeLessonProgress` resolve parent path then invoke same guard before any progress or XP write. Denied premium page read becomes not-found; denied premium mutation returns safe 403.

- [ ] **Write RED integration/regression tests.** Free Networking remains readable/startable/completable; premium linked path requires active entitlement for queries and progress; denied attempt creates no progress/XP; entitled user passes. Assert Lab/Challenge/Consultant tests get no commerce dependency and remain free.
- [ ] **Run RED:** `npm test -- src/features/learning/queries.test.ts src/features/learning/progress.test.ts src/features/learning/progress-route.test.ts src/features/commerce/learning-access.integration.test.ts`.
- [ ] **Implement one guard at both boundaries.** Include parent path relation in lesson queries, guard before prerequisite/persistence/XP, translate only typed access denial in routes, preserve existing prerequisite/not-found errors. Never infer entitlement from route slug alone.
- [ ] **Run GREEN:** same command — direct bypass has no side effect and free existing areas still work.

**Commit:** `feat: enforce premium learning entitlements`

---

### Task 9: Browser coverage, final review, documentation, and PR readiness

**Files:** Create `src/e2e/member-workspace.spec.ts`; modify `src/e2e/critical-path.spec.ts`, `PLAN.md`, `docs/HANDOFF.md`, `CHANGELOG.md`; update `ROADMAP.md`/`README.md` only when facts change.

**Interfaces:** E2E uses deterministic authenticated fixture/session and no real payment/email account. Final records include actual command results, revision, environment, and CI limitations.

- [ ] **Add E2E first.** Cover existing unauthenticated redirect; workspace navigation; 375px drawer open/close/Escape/focus restore; fresh dark workspace; deliberate Settings theme change; free/coming-soon catalog; owner-only order reference; denied premium direct path; Networking Learn/Labs/Challenges/Consultant regression.
- [ ] **Run full local gates from a clean isolated worktree.** Resolve, rather than hide, the Windows native-binary lock. Run:

  ```powershell
  npm ci
  npm run db:generate
  npm run lint
  npm run typecheck
  npm test
  npm run test:e2e -- --project=chromium
  npm run build
  git diff --check
  ```

  Run Firefox/WebKit locally when installed; CI currently covers Chromium only. Record pass/fail/limitations truthfully.
- [ ] **Review full diff.** Inspect migration, endpoints, transaction/idempotency, owner scoping, sandbox production denial, secrets/raw payloads, public file no-diff, responsive/sidebar/drawer behavior, focus/labels/contrast, and dark/light workspace. Resolve all Critical/High findings.
- [ ] **Update records.** Mark plan checkboxes only with evidence; append WITA changelog; update handoff with branch/commit/worktree/checks/limits. Keep Sprint 17/Milestone 7 in progress and Milestone 8 deferred until user review/merge and gates.
- [ ] **Create review PR only when asked/authorized.** Verify `gh auth status`/`gh repo view`, commit/push isolated branch, create one structured `gh pr create --base main`, inspect every applicable workflow/current head, and wait for Abangku's review. Include migration/rollback notes, UI screenshots, test evidence, and no-live-payment limit. Never merge, auto-merge, approve, or deploy.

**Commits:** `test: cover member workspace commerce flows`; `docs: record sprint 17 verification`

---

## Final Acceptance Checklist

- [ ] Public landing/navigation/auth modal have no intentional implementation change.
- [ ] `/dashboard` is an accessible black/white member workspace with responsive sidebar/drawer; Profile/Settings reuse existing controls and theme works by deliberate setting.
- [ ] Networking is free with no order/entitlement; premium tracks and premium-only combos are passive coming-soon cards without checkout.
- [ ] Reviewed migration/seed establishes catalog, immutable orders, payment events, and lifetime entitlements.
- [ ] Only verified idempotent server payment event grants access; client-crafted/replayed/expired/cancelled/mismatched events grant nothing.
- [ ] Linked premium learning paths are guarded for reads/progress; existing Networking Labs/Challenges/Consultant remain unrestricted.
- [ ] Fresh test/build/CI evidence is recorded, PR is ready for Abangku, and no deployment/payment activation occurred.
