# Migration Baseline Runbook

Last updated: **2026-09-08 WITA**.

## 1. Context and History

During Milestones 0–12, database schemas were maintained primarily through Prisma schema declarations pushed directly via `prisma db push` in development and early CI runs.
The historical `prisma/migrations/` directory contained:
- `20260824152000_init`: An empty migration file created during repository bootstrap.
- `20260902_add_password_reset_tokens`: A partial migration adding the `password_reset_tokens` table referencing the `users` table, which had never been declared in prior migrations.

As a consequence, running `prisma migrate deploy` from an empty database failed with:
`ERROR: relation "users" does not exist`.

## 2. Baseline Architecture

In **Milestone 13 (Sprint 34 / Task 34.1)**, the migration history is formally reconciled into a single authoritative, fresh-database reproducible baseline migration:

- **Baseline Migration:** `prisma/migrations/20260908090000_developer_operations_baseline/migration.sql`
- **Scope:** Defines the complete relational schema from empty, including:
  - `UserRole` enum (`LEARNER`, `INTERNAL_LEARNER`, `DEVELOPER`)
  - Core authentication (`users`, `accounts`, `sessions`, `verification_tokens`, `password_reset_tokens`)
  - Extended user attributes (`authVersion`, `lastLoginAt`, `lastActiveAt`, 2FA attributes)
  - Curriculum and progression (`learning_paths`, `modules`, `lessons`, `user_lesson_progress`, `user_xp_ledger`)
  - Practice and assessments (`quiz_attempts`, `assessment_attempts`, `labs`, `lab_attempts`, `challenges`, `challenge_attempts`, `consultant_cases`, `consultant_projects`)
  - Commerce and entitlements (`courses`, `packages`, `package_courses`, `orders`, `order_lines`, `payment_attempts`, `payment_events`, `entitlements`)
  - Developer operations and audit logging (`developer_elevation_sessions`, `developer_audit_events`, `security_events`)

## 3. Deployment to Fresh Databases (CI / Staging / Production)

For any fresh PostgreSQL instance (such as GitHub Actions CI runners, new staging VPS, or production):

```bash
# Generate Prisma client
npm run db:generate

# Apply all pending migrations (reproducible from empty)
npm run db:deploy

# Seed canonical curriculum and default data
npm run db:seed
```

All CI workflows (e.g. `.github/workflows/ci.yml`) now use `npm run db:deploy` instead of `prisma db push`.

## 4. Reconciliation for Retained Development Databases

If a development database already contains existing data from previous `prisma db push` workflows, **never run `prisma migrate reset`** if you wish to retain local user progress.

Follow this reconciliation procedure:

### Step 4.1: Inspect Current State
Check existing tables and migration tracking:
```bash
npx prisma migrate status
```

### Step 4.2: Apply Incremental Schema Changes (if not present)
If upgrading from the pre-M13 schema, execute the following SQL patch to align the existing database with the baseline models:

```sql
-- 1. Create UserRole enum and alter users.role
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('LEARNER', 'INTERNAL_LEARNER', 'DEVELOPER');
  END IF;
END$$;

-- Map legacy roles before casting
UPDATE "users" SET "role" = 'DEVELOPER' WHERE "role" = 'ADMIN';
UPDATE "users" SET "role" = 'LEARNER' WHERE "role" NOT IN ('LEARNER', 'INTERNAL_LEARNER', 'DEVELOPER');

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::"UserRole");
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'LEARNER';

-- 2. Add authVersion and timestamp columns to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "authVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3);

-- 3. Create DeveloperElevationSession table
CREATE TABLE IF NOT EXISTS "developer_elevation_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "authVersion" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "ipHash" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "developer_elevation_sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "developer_elevation_sessions_tokenHash_key" ON "developer_elevation_sessions"("tokenHash");
CREATE INDEX IF NOT EXISTS "developer_elevation_sessions_userId_expiresAt_idx" ON "developer_elevation_sessions"("userId", "expiresAt");
ALTER TABLE "developer_elevation_sessions" DROP CONSTRAINT IF EXISTS "developer_elevation_sessions_userId_fkey";
ALTER TABLE "developer_elevation_sessions" ADD CONSTRAINT "developer_elevation_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Create DeveloperAuditEvent table
CREATE TABLE IF NOT EXISTS "developer_audit_events" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "targetUserId" TEXT,
    "actorKind" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "requestId" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "beforeState" JSONB,
    "afterState" JSONB,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "developer_audit_events_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "developer_audit_events_requestId_key" ON "developer_audit_events"("requestId");
CREATE INDEX IF NOT EXISTS "developer_audit_events_actorUserId_createdAt_idx" ON "developer_audit_events"("actorUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "developer_audit_events_targetUserId_createdAt_idx" ON "developer_audit_events"("targetUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "developer_audit_events_action_createdAt_idx" ON "developer_audit_events"("action", "createdAt");

-- 5. Create SecurityEvent table
CREATE TABLE IF NOT EXISTS "security_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "security_events_userId_createdAt_idx" ON "security_events"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "security_events_type_createdAt_idx" ON "security_events"("type", "createdAt");
```

### Step 4.3: Mark the Baseline Migration as Applied
Clear legacy or failed migration entries from `_prisma_migrations` and mark the baseline migration as applied:

```sql
DELETE FROM "_prisma_migrations" WHERE "migration_name" IN ('20260824152000_init', '20260902_add_password_reset_tokens');
```

Then resolve the baseline migration:
```bash
npx prisma migrate resolve --applied 20260908090000_developer_operations_baseline
```

### Step 4.4: Verify State
```bash
npx prisma migrate status
npm run db:verify
```
Expected output:
- `Database schema is up to date!`
- All model relationships and tables functional.
