# Developer Operations and Internal Accounts Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver VPS-provisioned developer and internal-learner roles, mutually isolated workspaces, a safe read-only developer portal, and audited elevated entitlement management.

**Architecture:** Keep Netloka as one modular monolith. Put authorization, developer read models, elevation, and audit behavior under focused server-only feature modules; use Server Components for read views and Route Handlers only for explicit mutations. Middleware remains an optimistic navigation layer because current Next.js 16 Webpack behavior keeps `src/middleware.ts`; database-backed guards are authoritative.

**Tech Stack:** Next.js 16.3 App Router with Webpack, React 19.2, TypeScript 5, NextAuth.js 4 JWT sessions, Prisma 7/PostgreSQL 16, Zod, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-07-developer-portal-and-learner-experience-design.md`

## Global Constraints

- Public email and Google registration always create `LEARNER`.
- `INTERNAL_LEARNER` and `DEVELOPER` are assigned only through a VPS CLI with direct database access; no HTTP promotion path exists.
- Developers use credentials plus mandatory 2FA and cannot enter learner routes.
- Internal learners use the ordinary learner UI, retain prerequisites/assessments, receive all-course access, and never enter ordinary learner/business analytics.
- System, curriculum, database, deployment, backup, and configuration surfaces are read-only on the web.
- The only initial developer web mutations are entitlement grant/revoke after password-plus-2FA elevation, a written reason, idempotency, and atomic audit evidence.
- No response may expose password hashes, OAuth/reset/session tokens, 2FA secrets/backup codes, private assessment keys, or raw environment values.
- Do not add Redis, a second application, a remote shell, an SQL console, or a curriculum editor.
- Do not replace `src/middleware.ts` with `src/proxy.ts` until TD-01 is independently revalidated against the installed Next.js Webpack runtime.
- Every database change is tested on disposable fresh and representative legacy fixtures; never run migration repair against real user data without separate authorization.

---

## Sprint 34 — Role, Persistence, and Authorization Foundation

> **Delivery update (2026-09-09):** Tasks 1–6 were merged through PR #45–#50. Sprint closure remains open because post-merge review found two High authorization gaps: the learning-path detail query must reuse the internal-learner access policy, and learner mutation APIs must enforce the centralized learner-role boundary. `PLAN.md` Tasks 34.7–34.9 own those corrections before Sprint 35 implementation.

### Task 1: Reconcile the migration baseline and add privileged-role persistence

**Files:**

- Modify: `prisma/schema.prisma`
- Inspect first: existing `prisma/migrations/` and approved environments' `_prisma_migrations` records
- Create after the evidence gate: `prisma/migrations/20260908090000_developer_operations_baseline/migration.sql`
- Create: `docs/operations/migration-baseline-runbook.md`
- Create: `src/features/authorization/role.ts`
- Create: `src/features/authorization/role.test.ts`
- Create: `src/features/authorization/persistence.test.ts`
- Modify: `.github/workflows/ci.yml`

**Interfaces:**

- Produces: Prisma `UserRole`; `APP_ROLES`; `isLearnerRole(role)`; `isDeveloperRole(role)`.
- Produces persistence for `DeveloperElevationSession`, `DeveloperAuditEvent`, and `SecurityEvent` used by later tasks.

- [x] **Step 1: Write failing role-contract tests**

```ts
import { describe, expect, it } from "vitest";
import { isDeveloperRole, isLearnerRole } from "./role";

describe("role boundaries", () => {
  it("keeps developer outside learner authority", () => {
    expect(isLearnerRole("LEARNER")).toBe(true);
    expect(isLearnerRole("INTERNAL_LEARNER")).toBe(true);
    expect(isLearnerRole("DEVELOPER")).toBe(false);
    expect(isDeveloperRole("DEVELOPER")).toBe(true);
  });
});
```

- [x] **Step 2: Run the focused test and confirm the missing-module failure**

Run: `npx vitest run src/features/authorization/role.test.ts`
Expected: FAIL because `src/features/authorization/role.ts` does not exist.

- [x] **Step 3: Add the enum and focused persistence models**

```prisma
enum UserRole {
  LEARNER
  INTERNAL_LEARNER
  DEVELOPER
}

model DeveloperElevationSession {
  id          String    @id @default(cuid())
  userId      String
  tokenHash   String    @unique
  authVersion Int
  issuedAt    DateTime  @default(now())
  lastUsedAt  DateTime?
  expiresAt   DateTime
  revokedAt   DateTime?
  ipHash      String?
  userAgent   String?   @db.Text
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, expiresAt])
  @@map("developer_elevation_sessions")
}

model DeveloperAuditEvent {
  id           String   @id @default(cuid())
  actorUserId  String?
  targetUserId String?
  actorKind    String
  action       String
  reason       String?  @db.Text
  requestId    String   @unique
  correlationId String
  beforeState  Json?
  afterState   Json?
  result       String
  createdAt    DateTime @default(now())

  @@index([actorUserId, createdAt])
  @@index([targetUserId, createdAt])
  @@index([action, createdAt])
  @@map("developer_audit_events")
}

model SecurityEvent {
  id        String   @id @default(cuid())
  userId    String?
  type      String
  severity  String
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
  @@index([type, createdAt])
  @@map("security_events")
}
```

Update `User.role` to `UserRole @default(LEARNER)` and add `authVersion Int @default(1)`, `lastLoginAt DateTime?`, and `lastActiveAt DateTime?` plus the elevation relation. Keep audit actor/target identifiers scalar so CLI-originated evidence can exist without inventing a web actor.

- [ ] **Step 4: Establish the migration-history evidence gate**

Delivery note: the fresh-database baseline and runbook were merged, but inspection/rehearsal against an explicitly approved retained environment has not been evidenced, so the complete step remains open.

Read `_prisma_migrations` from each explicitly approved retained environment without mutation and compare checksums/schema with Git. If any retained environment applied the old files, do not rewrite or delete them; document and obtain a separate owner-approved forward/baselining procedure. If no retained environment uses them, create the reviewed complete baseline from empty. In both cases, the fresh path must succeed with `prisma migrate deploy` and a sanitized legacy fixture must prove schema/data parity. Never run `migrate reset` against retained data.

Run: `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`
Expected: complete SQL for every current model, not only the new developer tables.

- [x] **Step 5: Change CI from schema push to migration deployment**

```yaml
- name: Apply database migrations
  env:
    DATABASE_URL: ${{ env.DATABASE_URL }}
  run: npm run db:deploy
```

Keep seed after migration. Add a second disposable legacy-fixture job or script that validates schema parity and preserved IDs.

- [ ] **Step 6: Verify persistence gates**

Delivery note: fresh deployment and generated persistence coverage passed in CI; the representative retained/legacy identity-preservation portion remains unverified.

Run: `npm run db:generate`
Run: `npx vitest run src/features/authorization/role.test.ts src/features/authorization/persistence.test.ts`
Run on disposable DB: `npm run db:deploy && npm run db:seed && npm run db:seed`
Expected: generated enum types, fresh migration success, idempotent second seed, and preserved legacy fixture identities.

- [x] **Step 7: Commit**

```bash
git add prisma src/features/authorization .github/workflows/ci.yml
git commit -m "feat(auth): establish role and audit persistence"
```

### Task 2: Add server-authoritative role guards

**Files:**

- Create: `src/features/authorization/types.ts`
- Create: `src/features/authorization/guards.ts`
- Create: `src/features/authorization/guards.test.ts`
- Modify: `src/lib/auth.ts`

**Interfaces:**

- Produces: `Actor`, `requireDeveloperActor()`, `requireLearnerActor()`, `getFreshActor()`.
- Consumes: Prisma `UserRole` and existing `getSession()`.

- [x] **Step 1: Write failing guard tests for unauthenticated, stale-role, and cross-workspace access**

```ts
expect(await requireActorForArea("developer", developerActor)).toMatchObject({
  role: "DEVELOPER",
});
await expect(
  requireActorForArea("developer", learnerActor),
).rejects.toMatchObject({ code: "FORBIDDEN" });
await expect(
  requireActorForArea("learner", developerActor),
).rejects.toMatchObject({ code: "FORBIDDEN" });
```

- [x] **Step 2: Confirm failure**

Run: `npx vitest run src/features/authorization/guards.test.ts`
Expected: FAIL because the centralized guards do not exist.

- [x] **Step 3: Implement explicit projections and fresh database checks**

```ts
export interface Actor {
  id: string;
  email: string;
  role: "LEARNER" | "INTERNAL_LEARNER" | "DEVELOPER";
  authVersion: number;
  twoFactorEnabled: boolean;
}

export async function requireDeveloperActor(): Promise<Actor> {
  const actor = await getFreshActor();
  if (!actor || actor.role !== "DEVELOPER")
    throw new AuthorizationError("FORBIDDEN");
  return actor;
}
```

Do not return password, OAuth, reset, session, or 2FA-secret fields.

- [x] **Step 4: Run focused tests**

Run: `npx vitest run src/features/authorization/guards.test.ts src/lib/auth.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/features/authorization src/lib/auth.ts src/lib/auth.test.ts
git commit -m "feat(auth): enforce database-backed workspace roles"
```

### Task 3: Force safe registration and credentials-only developer login

**Files:**

- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/features/auth/auth.ts`
- Modify: `src/features/auth/auth-route.test.ts`
- Modify: `src/features/auth/auth-options.test.ts`
- Create: `src/features/auth/post-login.ts`
- Create: `src/features/auth/post-login.test.ts`

**Interfaces:**

- Produces: `getPostLoginDestination(role): "/dashboard" | "/developer"`.
- Consumes: fresh database role and existing password/TOTP verification.

- [x] **Step 1: Add malicious role-payload and OAuth-profile tests**

```ts
it("ignores privileged role in public registration", async () => {
  await POST(
    request({
      email: "learner@example.test",
      password: "valid-pass",
      role: "DEVELOPER",
    }),
  );
  expect(prisma.user.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ role: "LEARNER" }),
    }),
  );
});
```

Also assert a database `DEVELOPER` is rejected from Google sign-in and credentials sign-in requires enabled 2FA.

- [x] **Step 2: Run and observe failure**

Run: `npx vitest run src/features/auth/auth-route.test.ts src/features/auth/auth-options.test.ts src/features/auth/post-login.test.ts`
Expected: FAIL because role forcing and role destinations are incomplete.

- [x] **Step 3: Implement safe defaults and remove automatic email linking**

Set `role: "LEARNER"` explicitly on credentials registration. Remove `allowDangerousEmailAccountLinking: true`. In the sign-in callback, load the database user and reject Google account use when `role === "DEVELOPER"`.

```ts
export function getPostLoginDestination(role: UserRole) {
  return role === "DEVELOPER" ? "/developer" : "/dashboard";
}
```

- [x] **Step 4: Run focused auth tests**

Run: `npx vitest run src/features/auth`
Expected: PASS with public users always ordinary learners.

- [x] **Step 5: Commit**

```bash
git add src/app/api/auth/register/route.ts src/features/auth
git commit -m "fix(auth): prevent privileged public account creation"
```

### Task 4: Add VPS-only role management CLI

**Files:**

- Create: `scripts/set-user-role.ts`
- Create: `scripts/set-user-role.test.ts`
- Create: `src/features/authorization/role-management.ts`
- Create: `src/features/authorization/role-management.test.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: `setUserRoleFromCli({ email, role, operator, reason, requestId })`.
- Consumes: role persistence, auth version, audit event, existing session/elevation invalidation services.

- [x] **Step 1: Write service tests**

Test ordinary promotion, developer precondition failure without password/2FA, auth-version increment, elevation revocation, unknown email, and immutable CLI audit evidence.

- [x] **Step 2: Confirm failure**

Run: `npx vitest run src/features/authorization/role-management.test.ts scripts/set-user-role.test.ts`
Expected: FAIL because the service and CLI do not exist.

- [x] **Step 3: Implement the transaction and interactive CLI**

```ts
export type RoleChangeInput = {
  email: string;
  role: UserRole;
  operator: string;
  reason: string;
  requestId: string;
};
```

The CLI accepts email/role, prompts for operator and reason, prints a redacted before/after summary, and requires typing the target email to confirm. It never accepts a password, 2FA secret, or database URL as a command-line argument.

Add: `"user:set-role": "tsx scripts/set-user-role.ts"`.

- [x] **Step 4: Verify CLI behavior using a mocked/disposable database**

Run: `npx vitest run src/features/authorization/role-management.test.ts scripts/set-user-role.test.ts`
Expected: PASS; no HTTP route is introduced.

- [x] **Step 5: Commit**

```bash
git add scripts/set-user-role.ts scripts/set-user-role.test.ts src/features/authorization package.json package-lock.json
git commit -m "feat(auth): add audited VPS role provisioning"
```

### Task 5: Route one login form into isolated workspaces

**Files:**

- Create: `src/app/(auth)/continue/page.tsx`
- Create: `src/app/(auth)/continue/page.test.tsx`
- Modify: `src/features/auth/components/auth-modal.tsx`
- Modify: `src/features/auth/components/auth-modal.test.tsx`
- Modify: `src/middleware.ts`
- Modify: `src/middleware.test.ts`
- Modify: `src/app/(app)/layout.tsx`

**Interfaces:**

- Consumes: `getPostLoginDestination`, `requireLearnerActor`, `requireDeveloperActor`.
- Produces: one fixed callback route and strict workspace route behavior.

- [x] **Step 1: Add redirect and cross-workspace tests**

Assert both login modes use `/continue`, the server page sends developer to `/developer`, learners to `/dashboard`, developer requests to `/learn` are denied, and learner requests to `/developer` are denied.

- [x] **Step 2: Confirm expected failures**

Run: `npx vitest run src/features/auth/components/auth-modal.test.tsx src/app/(auth)/continue/page.test.tsx src/middleware.test.ts`
Expected: FAIL before the route and matchers exist.

- [x] **Step 3: Implement server redirect and optimistic middleware routing**

```tsx
export default async function ContinuePage() {
  const actor = await getFreshActor();
  if (!actor) redirect("/?auth=sign-in");
  redirect(getPostLoginDestination(actor.role));
}
```

Keep database authorization in layouts/APIs because Next.js documents middleware/proxy as an optimistic check, not full session management.

- [x] **Step 4: Run focused tests and authenticated routing E2E**

Run: `npx vitest run src/middleware.test.ts src/features/auth src/app/(auth)/continue/page.test.tsx`
Run: `npx playwright test src/e2e/member-workspace.spec.ts --project=chromium`
Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/app src/features/auth src/middleware.ts src/middleware.test.ts
git commit -m "feat(auth): route accounts into isolated workspaces"
```

### Task 6: Give internal learners all-course access without analytics pollution

**Files:**

- Modify: `src/features/commerce/access.ts`
- Modify: `src/features/commerce/access.test.ts`
- Modify: `src/features/commerce/entitlements.ts`
- Modify: `src/features/commerce/entitlements.test.ts`
- Create: `src/features/analytics/cohort.ts`
- Create: `src/features/analytics/cohort.test.ts`

**Interfaces:**

- Produces: `ORDINARY_LEARNER_FILTER = { role: "LEARNER" }` and `isAnalyticsLearner(role)`.
- Consumes: fresh user role in course-access decisions.

- [x] **Step 1: Write failing internal-access and exclusion tests**

```ts
expect(
  await resolveCourseAccess(
    { userId: internalId, courseId: premiumId },
    prisma,
  ),
).toBe("INTERNAL");
expect(isAnalyticsLearner("INTERNAL_LEARNER")).toBe(false);
expect(isAnalyticsLearner("LEARNER")).toBe(true);
```

- [x] **Step 2: Confirm failure**

Run: `npx vitest run src/features/commerce/access.test.ts src/features/commerce/entitlements.test.ts src/features/analytics/cohort.test.ts`.

- [x] **Step 3: Implement one shared role-aware access path**

Extend the result union to `"FREE" | "ENTITLED" | "INTERNAL" | "DENIED"`. Query only user role and entitlement state. Do not create fake orders or entitlements for internal learners.

- [x] **Step 4: Run commerce and learning-access regressions**

Run: `npx vitest run src/features/commerce src/features/learning/queries.test.ts src/features/learning/progress.test.ts`
Expected: ordinary learner behavior unchanged; internal access passes.

- [x] **Step 5: Commit**

```bash
git add src/features/commerce src/features/analytics
git commit -m "feat(access): add analytics-safe internal learners"
```

---

## Sprint 35 — Read-Only Developer Portal

### Task 7: Build explicit developer read models

**Files:**

- Create: `src/features/developer/overview/queries.ts`
- Create: `src/features/developer/overview/queries.test.ts`
- Create: `src/features/developer/users/queries.ts`
- Create: `src/features/developer/users/queries.test.ts`
- Create: `src/features/developer/curriculum/health.ts`
- Create: `src/features/developer/curriculum/health.test.ts`
- Create: `src/features/developer/system/health.ts`
- Create: `src/features/developer/system/health.test.ts`

**Interfaces:**

- Produces: `getDeveloperOverview(now)`, `searchDeveloperUsers(input)`, `getDeveloperUserDetail(userId)`, `getDeveloperUserPackageHistory(userId)`, `getCurriculumHealth()`, `getSystemHealth()`.
- Consumes: `requireDeveloperActor`, `ORDINARY_LEARNER_FILTER`, Prisma, curriculum registry, redacted environment status.

- [ ] **Step 1: Write projection tests that forbid secret fields**

Define expected DTOs and assert serialized results omit `passwordHash`, `twoFactorSecret`, `twoFactorBackupCodes`, account tokens, reset tokens, raw answers, and raw environment values.

- [ ] **Step 2: Confirm failure**

Run: `npx vitest run src/features/developer`
Expected: FAIL because read models do not exist.

- [ ] **Step 3: Implement bounded DTOs and metric definitions**

```ts
export type DeveloperOverview = {
  ordinaryLearners: number;
  internalLearners: number;
  newLearners7d: number;
  newLearners30d: number;
  activeLearners7d: number;
  database: { status: "healthy" | "degraded"; latencyMs: number | null };
  curriculum: {
    paths: number;
    modules: number;
    lessons: number;
    assessments: number;
    capstones: number;
  };
};
```

Cap search results at 50, require at least two normalized characters, and paginate histories. Package history must distinguish active/revoked entitlement sources from immutable paid/expired/cancelled order snapshots; manual access never rewrites an order. Use `Promise.allSettled` for independent overview panels so one failure becomes a degraded result.

- [ ] **Step 4: Run focused read-model tests**

Run: `npx vitest run src/features/developer`
Expected: PASS with internal users excluded from ordinary metrics.

- [ ] **Step 5: Commit**

```bash
git add src/features/developer
git commit -m "feat(developer): add safe operational read models"
```

### Task 8: Build the developer shell and read-only pages

**Files:**

- Create: `src/app/(developer)/developer/layout.tsx`
- Create: `src/app/(developer)/developer/page.tsx`
- Create: `src/app/(developer)/developer/users/page.tsx`
- Create: `src/app/(developer)/developer/users/[userId]/page.tsx`
- Create: `src/app/(developer)/developer/access/page.tsx`
- Create: `src/app/(developer)/developer/curriculum/page.tsx`
- Create: `src/app/(developer)/developer/system/page.tsx`
- Create: `src/app/(developer)/developer/security/page.tsx`
- Create: `src/app/(developer)/developer/account/page.tsx`
- Create: `src/features/developer/components/developer-shell.tsx`
- Create: `src/features/developer/components/developer-shell.test.tsx`
- Create: `src/app/(developer)/developer/developer-pages.test.tsx`

**Interfaces:**

- Consumes: all Task 7 read models and `requireDeveloperActor()`.
- Produces: text-led, keyboard-accessible, responsive developer navigation.

- [ ] **Step 1: Write shell/page tests**

Assert semantic navigation, current-page label, no learner links, no secret content, empty/degraded states, pagination links, and no system mutation buttons.

- [ ] **Step 2: Confirm failure**

Run: `npx vitest run src/features/developer/components src/app/(developer)/developer/developer-pages.test.tsx`.

- [ ] **Step 3: Implement server-rendered pages**

Use query parameters for search/filter/pagination and direct server read models. Follow existing workspace typography and focus treatment, but keep developer information density higher. Do not introduce decorative icons or icon-only controls.

- [ ] **Step 4: Verify unit and responsive browser behavior**

Run: `npx vitest run src/features/developer src/app/(developer)`
Run: `npx playwright test src/e2e/developer-portal.spec.ts --project=chromium` after Task 12 adds the fixture.
Expected: developer-only access, usable mobile table alternatives, keyboard focus, and isolated degraded panels.

- [ ] **Step 5: Commit**

```bash
git add -- 'src/app/(developer)' 'src/features/developer/components'
git commit -m "feat(developer): add read-only operations portal"
```

---

## Sprint 36 — Elevation, Entitlements, and Audit

### Task 9: Persist safe activity and security events

**Files:**

- Create: `src/features/security/events.ts`
- Create: `src/features/security/events.test.ts`
- Create: `src/features/analytics/activity.ts`
- Create: `src/features/analytics/activity.test.ts`
- Modify: `src/features/auth/auth.ts`
- Modify: `src/app/(app)/layout.tsx`
- Modify: `src/app/(developer)/developer/layout.tsx`

**Interfaces:**

- Produces: `recordSecurityEvent(input)` and `touchUserActivity(userId, now)` with a 15-minute write throttle.
- Consumes: minimal sanitized metadata only.

- [ ] **Step 1: Write throttling and redaction tests**

Assert a second activity touch within 15 minutes performs no update and forbidden metadata keys (`password`, `token`, `secret`, `answer`) are rejected.

- [ ] **Step 2: Confirm failure and implement minimal services**

Run: `npx vitest run src/features/security/events.test.ts src/features/analytics/activity.test.ts`.

```ts
export const ACTIVITY_WRITE_INTERVAL_MS = 15 * 60 * 1000;
```

Record successful login time in the auth callback and touch activity in authenticated layouts. Security-event writes for authentication failure are best-effort and must not replace the original generic error.

- [ ] **Step 3: Run auth/activity tests and commit**

Run: `npx vitest run src/features/security src/features/analytics src/features/auth`
Expected: PASS.

```bash
git add src/features/security src/features/analytics src/features/auth/auth.ts src/app
git commit -m "feat(security): persist redacted activity events"
```

### Task 10: Add password-plus-2FA elevation

**Files:**

- Create: `src/features/developer/elevation/service.ts`
- Create: `src/features/developer/elevation/service.test.ts`
- Create: `src/app/api/developer/elevation/route.ts`
- Create: `src/app/api/developer/elevation/route.test.ts`
- Create: `src/features/developer/components/elevation-dialog.tsx`
- Create: `src/features/developer/components/elevation-dialog.test.tsx`

**Interfaces:**

- Produces: `createDeveloperElevation`, `requireElevatedDeveloperSession`, `revokeDeveloperElevation`.
- Consumes: developer guard, password/TOTP verification, elevation persistence, security-event service.

- [x] **Step 1: Write expiry, revocation, password, TOTP, and rate-limit tests**

```ts
expect(ELEVATION_TTL_MS).toBe(10 * 60 * 1000);
await expect(createDeveloperElevation(wrongPassword)).rejects.toMatchObject({
  code: "INVALID_ELEVATION",
});
await expect(
  requireElevatedDeveloperSession(expiredToken),
).rejects.toMatchObject({ code: "ELEVATION_REQUIRED" });
```

- [x] **Step 2: Confirm failure**

Run: `npx vitest run src/features/developer/elevation src/app/api/developer/elevation`.

- [x] **Step 3: Implement opaque token storage and secure cookie handling**

Generate 32 random bytes, store only SHA-256 hash, bind to `authVersion`, and set a `netloka_dev_elevation` cookie with `httpOnly`, `secure` in production, `sameSite: "strict"`, `path: "/developer"`, and ten-minute expiry. Apply origin validation and a dedicated rate-limit key.

- [x] **Step 4: Run focused tests and commit**

Run: `npx vitest run src/features/developer/elevation src/app/api/developer/elevation src/features/developer/components/elevation-dialog.test.tsx`
Expected: PASS.

```bash
git add src/features/developer/elevation src/features/developer/components/elevation-dialog* src/app/api/developer/elevation
git commit -m "feat(developer): require password and 2FA elevation"
```

### Task 11: Implement atomic entitlement grant/revoke

**Files:**

- Create: `src/features/developer/access/mutations.ts`
- Create: `src/features/developer/access/mutations.test.ts`
- Create: `src/app/api/developer/entitlements/route.ts`
- Create: `src/app/api/developer/entitlements/route.test.ts`
- Create: `src/features/developer/components/entitlement-action-form.tsx`
- Create: `src/features/developer/components/entitlement-action-form.test.tsx`
- Modify: `src/app/(developer)/developer/access/page.tsx`

**Interfaces:**

- Produces: `mutateDeveloperEntitlement(input)`.
- Consumes: elevated developer, target user, package and its server-side course composition, request ID, reason, entitlement/audit tables.

- [ ] **Step 1: Write transaction, replay, and immutable-history tests**

```ts
const input = {
  action: "GRANT",
  targetUserId,
  packageId,
  reason: "Support case NL-42",
  requestId,
} as const;
expect((await mutateDeveloperEntitlement(input)).affectedCourses).toHaveLength(
  2,
);
expect((await mutateDeveloperEntitlement(input)).idempotentReplay).toBe(true);
```

Also assert mismatched replay returns 409, an unavailable/empty package is rejected, every package course changes atomically, audit failure rolls back, developer target is forbidden, blank/short reason is rejected, and order rows are untouched.

- [ ] **Step 2: Confirm failure**

Run: `npx vitest run src/features/developer/access src/app/api/developer/entitlements`.

- [ ] **Step 3: Implement the schema and atomic service**

```ts
const EntitlementMutationSchema = z.object({
  action: z.enum(["GRANT", "REVOKE"]),
  targetUserId: z.string().cuid(),
  packageId: z.string().cuid(),
  reason: z.string().trim().min(12).max(1000),
  requestId: z.string().uuid(),
});
```

Inside one Prisma transaction, re-read actor/target/package and its current server-side course composition, grant or revoke each entitlement, and create one audit event containing the bounded course IDs and before/after states. Do not accept course membership, price, order state, source actor, or before/after state from the client.

- [ ] **Step 4: Run focused tests and commit**

Run: `npx vitest run src/features/developer/access src/app/api/developer/entitlements src/features/developer/components/entitlement-action-form.test.tsx`
Expected: PASS.

```bash
git add -- 'src/features/developer/access' 'src/features/developer/components/entitlement-action-form.tsx' 'src/features/developer/components/entitlement-action-form.test.tsx' 'src/app/api/developer/entitlements' 'src/app/(developer)/developer/access/page.tsx'
git commit -m "feat(developer): audit entitlement administration"
```

### Task 12: Verify Milestone 13 end to end and synchronize documentation

**Files:**

- Create: `src/e2e/developer-portal.spec.ts`
- Create: `src/e2e/fixtures/developer-user.ts`
- Modify: `src/e2e/fixtures/learning-user.ts`
- Modify: `ROADMAP.md`
- Modify: `PLAN.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/HANDOFF.md`
- Modify: `docs/TECHNICAL_DEBT.md`

**Interfaces:**

- Consumes: all Milestone 13 behavior.
- Produces: isolated three-role authenticated evidence and release handoff.

- [ ] **Step 1: Add three-role E2E fixtures and journeys**

Cover public role escalation rejection, login redirect, workspace isolation, internal premium access without analytics inclusion, read-only portal, redaction, elevation expiry, grant/revoke, idempotent replay, audit visibility, and direct API denial.

- [ ] **Step 2: Run focused and full local gates**

Run: `npm run db:generate`
Run: `npm run lint`
Run: `npm run typecheck`
Run: `npm test`
Run: `npx playwright test src/e2e/developer-portal.spec.ts src/e2e/member-workspace.spec.ts --project=chromium`
Run: `npm run build`
Run: `git diff --check`
Expected: all commands succeed against an isolated migrated/seeded database.

- [ ] **Step 3: Review the complete diff**

Confirm no role-promotion HTTP route, no secret projection, no developer learning access, no internal analytics contamination, no web infrastructure mutation, no migration against retained data, and no Critical/High finding.

- [ ] **Step 4: Update documentation and commit**

Record exact WITA timestamp, commands, test counts, environment boundaries, commit state, and remaining Milestone 14 entry point.

```bash
git add src/e2e ROADMAP.md PLAN.md CHANGELOG.md docs
git commit -m "test(developer): verify privileged workspace boundaries"
```

- [ ] **Step 5: Deliver through PR/CI without merging**

Push the focused branch, create/update its PR with `gh`, verify every current-head CI job, and leave final review/merge to Abangku.
