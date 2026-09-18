# Non-Payment Production Rehearsal & Sprint 41 Review Runbook

**Document version:** 1.0  
**Effective date:** 2026-09-18 WITA  
**Milestone / Sprint:** Milestone 15 / Sprint 41 / Task 41.4  
**Environment:** Staging / Production-like Configuration (`https://staging.netloka.biz.id`)  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Contact / Mailbox:** noreply@haikalariadma.my.id  
**Commerce Mode:** `PAYMENT_MODE=disabled` (Strictly non-commercial gate)

---

## 1. Executive Summary & Non-Payment Boundary

This rehearsal exercises the complete end-to-end platform capabilities under a production-like staging configuration with payment strictly disabled (`PAYMENT_MODE=disabled`).

Strict release boundary rules:

1. **Zero live provider mode:** No production Midtrans merchant credentials, live endpoints, or webhooks are active.
2. **Zero real monetary charges:** All commerce transactions are either disabled or simulated using internal entitlement elevation.
3. **Owner review requirement:** Entering Sprint 42 (Midtrans Gateway and Controlled Commercial Activation) requires explicit owner sign-off on this rehearsal evidence.

---

## 2. 9-Part End-to-End Rehearsal Protocol

### Part 1: Registration and Authentication Baseline

1. **New Learner Registration:**
   - Endpoint: `/api/auth/register` (UI: `/sign-up`).
   - Input: Test email, full name, secure password.
   - Result: User created in database with role strictly set to `LEARNER`. Password stored as cryptographic hash (bcrypt/argon2).
2. **Credential Sign-In:**
   - Endpoint: NextAuth credentials provider (`/sign-in`).
   - Result: Successful sign-in issues session token over HTTPS with secure attributes (`Secure`, `HttpOnly`, `SameSite=Lax`).
3. **Abuse Defense:**
   - Anti-enumeration timing defense confirmed on invalid credentials (constant-time response).

### Part 2: Role Isolation and Privileged Access Controls

1. **Unauthorized Access Rejection:**
   - Learner attempts access to `/developer`, `/developer/system`, `/developer/users`.
   - Result: Middleware redirects learner to `/dashboard` with an access-denied error.
2. **Developer Elevation Verification:**
   - Verified developer account authenticates and accesses `/developer`.
   - Privilege elevation requires re-verification of developer credentials.
   - All privileged elevation events are immutably logged to `SecurityAuditLog`.

### Part 3: Interactive Learning Journey and Progress Tracking

1. **Curriculum Navigation:**
   - Learner opens path `/learn/welcome-to-networking` and navigates through modules.
   - Reusable interactive blocks (topology canvas, protocol explorer, terminal simulator) render deterministically.
2. **Formative Quiz Submission:**
   - Learner answers quiz questions and submits via `/api/learning/quiz/submit`.
   - Server validates answers, updates `LessonProgress`, records earned XP in `XpLedger`, and recalculates streak count.
   - Real-time UI updates show earned XP and updated level progress.

### Part 4: Module Assessment and Mastery Evaluation

1. **Assessment Execution:**
   - Learner completes all module lessons and initiates module assessment (`/assessment`).
   - Answers evaluated against server-authoritative rubric in an atomic database transaction.
2. **Mastery and Remediation Derivation:**
   - Assessment score updates module mastery percentage.
   - If score is below passing threshold, system automatically suggests targeted remediation links to weak topics.
   - Zero historical assessments or grades are silently altered.

### Part 5: Developer Operational Views and System Health

1. **Developer Portal Inspection:**
   - Access `/developer/system`: Inspect database health, environment mode, and uptime metrics.
   - Access `/developer/users`: Inspect user roster, role distributions, and verification statuses.
   - Access `/developer/curriculum`: Inspect curriculum paths, modules, lessons, and quiz completion analytics.
2. **Public Health Endpoint:**
   - `curl -i http://127.0.0.1:3001/api/health` returns HTTP 200 with `{ "status": "healthy", "database": "connected" }`.

### Part 6: Elevated Entitlement Mutation (Non-Payment)

1. **Manual Entitlement Grant:**
   - Developer navigates to `/developer/users/[userId]` and grants a premium course package entitlement for testing.
   - Database creates `UserEntitlement` record linked to the user with `status: ACTIVE`.
2. **Access Verification:**
   - Learner account immediately gains access to premium materials without any payment gateway invocation.
3. **Revocation Test:**
   - Developer revokes the test entitlement; learner access is cleanly rescinded.

### Part 7: Live Transactional Email and Rate Limiting

1. **Password Reset Dispatch:**
   - User requests password reset via `/forgot-password`.
   - System generates secure 30-minute token and dispatches transactional email via Hostinger SMTP (`smtp.hostinger.com:465`).
   - Email delivered from `noreply@haikalariadma.my.id` with valid reset link.
2. **Abuse Rate Limiter Check:**
   - Rapidly submit 4 password reset requests within 15 minutes.
   - System enforces rate limit with HTTP 429 / delay via PostgreSQL `RateLimitEntry`.

### Part 8: Application Rollback and Disaster Recovery Sanity

1. **Container Recreation & Health:**
   - Recreate `app` container via `docker compose up -d --build app`.
   - App restarts cleanly, joins `netloka_staging_edge` and `netloka-staging_internal`, and passes healthcheck in under 15 seconds.
2. **Database Integrity:**
   - Confirm all existing users, progress records, and audit logs remain intact across restarts.

### Part 9: Commerce Gate & Non-Payment Verification

1. **Disabled Payment Verification:**
   - Inspect `.env` and runtime environment: `PAYMENT_MODE="disabled"`.
   - Attempting to submit an order or initiate checkout returns clear disabled notification (`Payment processing is currently disabled`).
   - Confirm zero external HTTP requests to `api.midtrans.com` or `api.sandbox.midtrans.com`.

---

## 3. Sprint 41 Operational Review & Audit Findings

| Review Area | Verification Criteria | Status | Evidence / Notes |
| --- | --- | --- | --- |
| Task 41.1 | Operator, privacy, terms, and incident runbooks finalized | PASSED | PR #77 merged. Legal pages updated to 18 September 2026. Mailbox `noreply@haikalariadma.my.id` verified. |
| Task 41.2 | Isolated staging environment deployed and verified | PASSED | PR #78 merged. Staging verification runbook and compose manifests aligned with forward-only migrations. |
| Task 41.3 | Backup, restore, rollback, and incident drills proved | PASSED | PR #79 merged. `scripts/restore-staging-postgres.sh` and `dr-rehearsal-drill.md` established. RTO < 15m. |
| Task 41.4 | Production-like non-payment rehearsal executed | PASSED | All 9 user journey parts verified. Zero real charges or live payment mode enabled. |

### Severity Finding Audit
- **Critical findings:** 0
- **High findings:** 0
- **Medium findings:** 0
- **Low findings:** 0

---

## 4. Sprint 42 Readiness Gate & Transition Sign-Off

With all 4 tasks of Sprint 41 verified and merged, the platform has satisfied all infrastructure, operational, disaster recovery, and legal prerequisites.

**Next Sprint:** Sprint 42 — Midtrans Gateway and Controlled Commercial Activation  
**Preconditions for Sprint 42 Execution:**
- Dynamic QRIS boundary approved from official Midtrans documentation (Task 42.1).
- Server-only gateway adapter implemented and sandbox tested (Task 42.2 & Task 42.3).
- **Separate explicit owner authorization** must be granted before any live production deployment or real payment activation (Task 42.4).
