# Release Baseline & Migration Verification Runbook

Last updated: **2026-09-17 16:40 WITA**.

## 1. Context and Purpose

This runbook documents the authoritative release baseline and verification procedures established in **Milestone 15 / Sprint 40 / Task 40.4**:
- Validation of the forward-only PostgreSQL schema migration chain.
- Backup-based rollback and disaster recovery protocols (prohibiting destructive reverse migrations).
- Zero-vulnerability production dependency security audit (`npm audit --omit=dev`).
- Enforcement of strict transport and runtime security headers (CSP, HSTS, frame protection).
- Comprehensive sprint exit verification for Sprint 40 (Persistent Security and Release Baseline).

---

## 2. Forward-Only Migration Architecture

Netloka enforces a strict forward-only database schema migration policy. All migrations are deterministic, ordered chronologically, and additive:

| Order | Migration Identifier | Purpose | Key Relational Entities |
| --- | --- | --- | --- |
| **01** | `20260908090000_developer_operations_baseline` | Canonical schema baseline from empty | `users`, `accounts`, `sessions`, `learning_paths`, `modules`, `lessons`, `quiz_attempts`, `assessment_attempts`, `labs`, `challenges`, `consultant_cases`, `orders`, `entitlements`, `developer_elevation_sessions`, `security_events` |
| **02** | `20260908091000_learning_drafts` | Idempotent multi-device learner progress drafts | `learning_drafts` table with composite unique index (`userId`, `lessonId`, `activityId`) |
| **03** | `20260908092000_lesson_bookmarks` | Learner content bookmarking and quick access | `lesson_bookmarks` table with composite unique index (`userId`, `lessonId`) |
| **04** | `20260908093000_review_schedule` | Deterministic SM-2-inspired spaced review queue | `review_schedules` table with composite unique index (`userId`, `outcomeId`) |
| **05** | `20260908094000_session_security` | Shared PostgreSQL-backed session revocation | `user_security_states` table (`userId`, `validAfter`) with cascade deletion |
| **06** | `20260908095000_auth_rate_limits` | Atomic shared password-reset rate limiting | `auth_rate_limits` table with hashed key and index on `expiresAt` |

### Application Command
In CI, staging, and production environments, migrations are applied using:
```bash
npm run db:deploy
```
*(Executes `prisma migrate deploy`, applying unapplied migrations without prompting or resetting data).*

---

## 3. Disaster Recovery and Rollback Protocol

### 3.1 Prohibited: Destructive "Down" Migrations
> **Important:** Writing reverse SQL scripts (`DROP TABLE`, `DROP COLUMN`) or running `prisma migrate reset` in production is strictly forbidden. Reverse migrations cause irreversible loss of learner progress, audit logs, order history, and entitlement grants.

### 3.2 Standard Procedure: Backup-Based Snapshot Recovery
In the event of an operational regression, schema corruption, or failed application deployment, system recovery must proceed via point-in-time PostgreSQL backup restoration.

#### Step 1: Pre-Deployment Snapshot (Mandatory Before Deployment)
Before executing `npm run db:deploy` during a production or staging release:
```bash
# Create timestamped directory
mkdir -p /var/backups/netloka

# Generate compressed custom-format binary backup
pg_dump -Fc -v -h 127.0.0.1 -U netloka -d netloka -f /var/backups/netloka/netloka_pre_deploy_$(date +%Y%m%d_%H%M%S).dump
```

#### Step 2: Disaster Recovery / Rollback Execution
If the deployment must be rolled back:
```bash
# 1. Put application into maintenance mode (Caddy/proxy return 503)
# 2. Terminate active database worker connections
psql -h 127.0.0.1 -U netloka -d postgres -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE datname = 'netloka' AND pid <> pg_backend_pid();
"

# 3. Restore database state cleanly from pre-deployment snapshot
pg_restore --clean --if-exists -v -h 127.0.0.1 -U netloka -d netloka /var/backups/netloka/netloka_pre_deploy_<TIMESTAMP>.dump

# 4. Rollback application server binary/container to previous Git release SHA
# 5. Disable maintenance mode and execute health check
curl -fsS https://netloka.biz.id/api/health
```

---

## 4. Production Dependency Security Baseline

Production dependencies (`npm audit --omit=dev`) are validated with **0 vulnerabilities**.

### Resolved Advisories (Task 40.4)
1. **Next.js (`next` & `eslint-config-next` @ 16.3.5)**:
   - Resolved **Critical** vulnerability GHSA-p293-qw3h-jr36 (Windows remote code execution).
   - Resolved **Critical** vulnerability GHSA-2xp9-vwfh-vxw4 (AVIF image optimization).
2. **Upstream Database Adapter Transitive (`mysql2` @ ^3.24.4 via package overrides)**:
   - Resolved **High** vulnerability GHSA-3f6p-5ww8-9rcr (Auth Plugin Downgrade credential leak).
   - Resolved **High** vulnerability GHSA-rgwj-5xj2-c3m3 (Unbounded zlib inflate decompression bomb).
3. **Image Processor (`sharp` @ ^0.35.4 via package overrides)**:
   - Resolved **High** vulnerabilities in libheif (GHSA-g89c-p67h-r497 / GHSA-2jg2-4ch7-h545).

---

## 5. Runtime & Transport Security Baseline

All application routes are shielded with hardened HTTP response headers configured in [`next.config.ts`](file:///c:/laragon/www/netloka/next.config.ts) and verified via automated tests (`src/lib/security-headers.test.ts`):

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 6. Sprint 40 Release Baseline Exit Status

All requirements for **Sprint 40 (Persistent Security and Release Baseline)** have been implemented and evidenced:
- [x] **Task 40.1:** Shared persistent session revocation (`UserSecurityState.validAfter` in PostgreSQL).
- [x] **Task 40.2:** Persistent multi-instance password-reset rate limiter (`AuthRateLimit` with one-way identity hashing).
- [x] **Task 40.3:** Safe OAuth account linking (`allowDangerousEmailAccountLinking: false`, developer block, email_verified check).
- [x] **Task 40.4:** Forward-only migration rehearsal, 0 production audit vulnerabilities, backup-based recovery runbook.
