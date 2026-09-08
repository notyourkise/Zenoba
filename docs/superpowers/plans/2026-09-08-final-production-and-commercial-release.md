# Final Production and Commercial Release Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the deferred security, deployment, gateway, and live-payment work only after product quality and operator gates are evidenced, then release through a controlled and recoverable process.

**Architecture:** Harden the modular monolith with shared PostgreSQL-backed session revocation and abuse controls, exercise forward-only migrations and recovery in staging, then implement the existing Midtrans payment boundary behind the established gateway interface. Provider webhooks—not browser redirects—authoritatively transition orders and entitlements. Production activation remains a separate, explicit owner action after staging evidence.

**Tech Stack:** Next.js 16, NextAuth 4, Prisma/PostgreSQL, Docker Compose, Caddy, Cloudflare, Midtrans Dynamic QRIS, Vitest, Playwright, GitHub Actions.

**Prerequisite:** Milestones 13–14 are merged and synchronized. Sprint 33 gate evidence is refreshed. No provider, staging, or production action may proceed from this plan alone; each external-state step requires the credentials, authority, and exact environment named below.

---

## Global Release Gates

- Real premium courses, prices, package composition, refund/dispute terms, operator identity, privacy contact, retention handling, and merchant/tax readiness must have owner-approved evidence.
- Secrets stay in approved secret stores or environment configuration and never enter Git, logs, screenshots, test fixtures, or documentation.
- Tests and rehearsals use disposable or explicitly approved staging data. Never run destructive migration/restore tests against the real user database.
- Production writes, DNS changes, provider live-mode changes, migrations, restore actions, and deployment require explicit Abangku authorization at execution time.
- Current official Next.js, Auth.js/NextAuth, Cloudflare, Caddy, Docker, and Midtrans documentation must be verified during execution; record links and access dates in the release evidence.
- Payment entitlement is created only from a verified, idempotently processed provider event with matched order, merchant, currency, and amount.

## Sprint 40 — Persistent Security and Release Baseline

### Task 1: Replace in-memory session revocation with shared persistence

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260908094000_session_security/migration.sql`
- Modify: `src/features/auth/session-revocation.ts`
- Modify: `src/features/auth/session-revocation.test.ts`
- Modify: `src/lib/auth.ts`
- Test: auth integration tests

**Step 1: Write failing tests** for two simulated application instances, password reset invalidation, explicit developer-session invalidation, expiry cleanup, database failure, and unaffected newer sessions.

```prisma
model UserSecurityState {
  userId         String   @id
  validAfter     DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Step 2: Implement a shared `validAfter` check** in the server session callback/guards. Fail closed for privileged routes when the store is unavailable; use a documented safe behavior for ordinary read-only learner requests.

**Step 3: Verify migration, focused tests, auth regression, typecheck, and lint**, then commit.

### Task 2: Replace in-memory password-reset abuse controls with a shared limiter

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260908095000_auth_rate_limits/migration.sql`
- Modify: `src/features/auth/rate-limiter.ts`
- Modify: `src/features/auth/rate-limiter.test.ts`
- Modify: `src/app/api/auth/forgot-password/route.ts`
- Modify: `src/app/api/auth/reset-password/route.ts`
- Create: `src/features/auth/rate-limit-cleanup.ts`
- Create: `src/features/auth/rate-limit-cleanup.test.ts`

Define an atomic PostgreSQL-backed fixed-window contract keyed by a one-way digest of normalized identity plus scoped IP. Test concurrent requests, boundary time, expiry, multi-instance behavior, enumeration-neutral responses, and database failure. Keep the existing timing defense. Review indexes and retention before commit.

### Task 3: Close OAuth account-linking and live-email verification gaps

**Files:**
- Modify: `src/lib/auth.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/features/auth/auth.ts`
- Modify: `src/features/auth/auth-route.test.ts`
- Modify: `src/features/auth/auth-options.test.ts`
- Modify: `.env.example`
- Create: `docs/operations/auth-live-verification.md`

Remove `allowDangerousEmailAccountLinking`. Write tests for credentials-first and Google-first accounts, verified/unverified provider email, conflicting provider identity, disabled developer Google login, and forced public `LEARNER` role. Verify SMTP and Google OAuth only in an approved isolated staging environment; local mocks do not count as live proof.

### Task 4: Rehearse the forward-only migration chain and dependency/security gates

**Files:**
- Inspect: `prisma/migrations/`
- Inspect/modify if evidence requires it: `.github/workflows/ci.yml`
- Inspect/modify if evidence requires it: `package.json`
- Update: `docs/TECHNICAL_DEBT.md`
- Create: `docs/operations/release-baseline-verification.md`

Start from an empty disposable database and a sanitized pre-M13 snapshot, run `prisma migrate deploy`, verify stable IDs/evidence/orders/entitlements, and exercise rollback through backup restore—not reverse destructive migrations. Run `npm audit --omit=dev`, license/dependency review, CSP/header checks, secret scanning, full local gates, and current-head CI. Sprint 40 cannot close with an unexplained High/Critical result.

## Sprint 41 — Staging, Recovery, and Operational Readiness

### Task 5: Finalize operator, privacy, payment, and incident runbooks

**Files:**
- Create: `docs/operations/operator-readiness.md`
- Create: `docs/operations/incident-response.md`
- Modify: `docs/deployment/staging.md`
- Modify after owner supplies the real operator facts: `src/app/(legal)/terms/page.tsx`
- Modify after owner supplies the real operator facts: `src/app/(legal)/privacy-policy/page.tsx`
- Modify: `docs/decisions/0003-legal-pages-and-policy-boundaries.md` when superseded
- Modify: `.env.example` with placeholders only

Record named ownership, privacy contact, retention/deletion/export handling, child/guardian policy where applicable, processors/locations, refund/dispute path, provider outage handling, security incident response, backup owner, and escalation contacts. Stop if a required factual/legal decision is absent; do not invent it.

### Task 6: Deploy and verify an isolated staging environment

**Files:**
- Inspect/modify if verified staging evidence requires it: `Dockerfile`
- Inspect/modify if verified staging evidence requires it: `docker-compose.prod.yml`
- Inspect/modify if verified staging evidence requires it: `Caddyfile`
- Inspect/modify if verified staging evidence requires it: `.github/workflows/ci.yml`
- Modify: `docs/deployment/cloudflare-and-caddy.md`
- Modify: `docs/deployment/staging.md`
- Create: `docs/operations/staging-verification.md`

With explicit staging authorization, validate environment inventory, TLS, DNS, CSP, secure cookies, OAuth callback, SMTP, database connectivity, `prisma migrate deploy`, health endpoints, log redaction, monitoring, alerts, and a staging-only user lifecycle. Document exact deployed commit and config categories without values. Application implementation completion is not deployment evidence.

### Task 7: Prove backup, restore, rollback, and incident drills

Create an encrypted staging backup, restore it into a separate verified target, compare critical row counts/checksums, run learner/auth/commerce smoke tests, and measure recovery time. Rehearse application rollback while keeping forward-compatible database state. Record failures and repeat until criteria pass; never point restore commands at production.

### Task 8: Complete the non-payment production rehearsal

Using a production-like staging configuration, exercise registration/login, role isolation, learning, assessments, developer read views, elevated entitlement mutation using test packages, email, health/alerts, and rollback. Confirm no live provider mode or real charge is enabled. Resolve Critical/High issues and obtain Abangku’s review of the release evidence before Sprint 42.

## Sprint 42 — Midtrans Gateway and Controlled Commercial Activation

### Task 9: Refresh and approve the exact Midtrans boundary

**Files:**
- Modify: `docs/decisions/0004-member-workspace-course-commerce.md`
- Create: `docs/operations/midtrans-release-runbook.md`
- Modify: `.env.example`

Against current official Midtrans documentation and the owner’s verified merchant configuration, document Dynamic QRIS request fields, signature validation, notification statuses, expiry, retries, idempotency, reconciliation, refunds/disputes, sandbox/live endpoints, secret rotation, and rollback. Confirm real products, amounts, and package mappings. If Midtrans or the product catalog changes, revise and reapprove this plan before code.

### Task 10: Implement the Midtrans adapter behind the existing gateway contract

**Files:**
- Create: `src/features/commerce/payments/midtrans-gateway.ts`
- Create: `src/features/commerce/payments/midtrans-gateway.test.ts`
- Modify: `src/features/commerce/payments.ts`
- Modify: `src/features/commerce/payments.test.ts`
- Modify: `src/features/commerce/payments/types.ts`
- Modify: `.env.example`

**Step 1: Write contract tests using recorded synthetic fixtures** for create charge, timeout, invalid response, amount/currency mismatch, expiry, and safe error mapping.

```ts
export interface PaymentGateway {
  provider: PaymentProvider;
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult>;
  verifyEvent(payload: unknown, headers?: Record<string, string>): Promise<NormalizedPaymentEvent>;
}
```

**Step 2: Implement server-only credentials, strict timeouts, request correlation, and redacted logs.** Browser code receives only the safe payment instruction.

**Step 3: Run contract, commerce regression, typecheck, lint, and secret scans**, then commit.

### Task 11: Add verified webhook processing, idempotency, and reconciliation

**Files:**
- Create: `src/app/api/commerce/midtrans/events/route.ts`
- Create: `src/app/api/commerce/midtrans/events/route.test.ts`
- Modify: `src/features/commerce/payments.ts`
- Modify: `src/features/commerce/payments.test.ts`
- Create: `src/features/commerce/payments/reconciliation.ts`
- Create: `src/features/commerce/payments/reconciliation.test.ts`
- Create: `scripts/reconcile-midtrans.ts`
- Create: `scripts/reconcile-midtrans.test.ts`
- Modify: `src/features/security/events.ts`

Test invalid signature, replay, out-of-order events, duplicate success, wrong merchant/order/amount/currency, expired/cancelled/denied states, database rollback, and concurrent delivery. Store a unique provider event/reference before changing order state; entitlement creation and immutable audit occur atomically. Reconciliation is a VPS/operator CLI with dry-run by default and a required reason for repair mode.

### Task 12: Verify sandbox and staging end to end

With sandbox credentials, cover charge creation, QR display, successful/failed/expired/cancelled events, duplicate delivery, delayed notification, reconciliation, entitlement access, refund/dispute operator flow, and no access from browser redirect alone. Repeat the approved subset in staging, confirm monitoring/redaction, and record exact commit, provider mode, order IDs with safe redaction, and limitations.

### Task 13: Activate production only through an explicit owner-controlled gate

After all earlier gates pass, present a release checklist containing the exact commit, migration version, backups, environment, DNS/TLS, live merchant mode, products/prices, monitoring, rollback owner, smoke tests, and unresolved risks. Abangku must explicitly authorize the production deployment and separate live-payment switch. Deploy one reviewed revision, migrate forward, smoke test without uncontrolled real charges, enable the approved catalog/payment mode, observe the agreed window, and roll back on threshold breach.

### Task 14: Complete post-release review and documentation

**Files:**
- Modify: `PLAN.md`
- Modify: `ROADMAP.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/HANDOFF.md`
- Modify: `docs/TECHNICAL_DEBT.md`
- Modify: `docs/operations/staging-verification.md`
- Modify: `docs/operations/midtrans-release-runbook.md`

Run the full applicable suite and live smoke checks, verify current-head CI and deployed revision independently, review audit/security/payment evidence, and classify remaining debt. Keep labels distinct: locally verified, CI passed, ready for review, merged, synchronized, deployed, payment activated. Create/update the PR and leave merge to Abangku.

## Milestone 15 Acceptance Criteria

- Session invalidation and password-reset abuse controls work across multiple application instances.
- OAuth linking is explicit and safe; public registration cannot create internal or developer roles.
- Fresh and upgraded databases migrate reproducibly; backup/restore and application rollback are proven outside production.
- Staging evidence covers TLS, auth, email, authorization, observability, privacy-safe logs, and core learner/developer journeys.
- Midtrans events are verified, idempotent, reconciled, and solely authoritative for payment-derived entitlement.
- Legal/operator/catalog/provider prerequisites are factual and owner-approved.
- Production deployment and live payment activation occur only after separate explicit authorization, with observed smoke/monitoring/recovery evidence.
- No Critical/High finding remains, and repository, GitHub, deployed revision, and handoff evidence agree.
