# Prisma 7 Security Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Netloka from Prisma 6 to Prisma 7 and remove the audited Prisma 6 CLI advisory path.

**Architecture:** Prisma CLI reads `DATABASE_URL` from `prisma.config.ts`. The generated ESM client is kept under an ignored source directory, while the existing server-only singleton constructs it with the PostgreSQL `pg` driver adapter. A local verification script proves the adapter can query the Docker database.

**Tech Stack:** Node.js 20.19+, TypeScript, Prisma ORM 7.9.1, `@prisma/adapter-pg`, `pg`, PostgreSQL 16, Next.js 16.

**Spec:** `docs/superpowers/specs/2026-08-24-prisma-7-security-remediation-design.md`

## Global Constraints

- Keep PostgreSQL Docker exposure at `127.0.0.1:5433`.
- Do not add models or create an application schema migration.
- Do not commit `.env` or generated Prisma client output.
- Preserve the existing isolated Sprint 1 worktree.

---

### Task 1: Upgrade Prisma packages and CLI configuration

**Files:**
- Modify: `package.json`, `package-lock.json`, `.gitignore`, `tsconfig.json`, `prisma/schema.prisma`
- Create: `prisma.config.ts`

- [x] Add Prisma 7.9.1 packages plus the PostgreSQL adapter and driver.
- [x] Set ESM and Node 20.19+ package requirements; configure client generation at `src/generated/prisma`.
- [x] Create `prisma.config.ts` that loads `.env` for CLI commands and supplies `DATABASE_URL`.
- [x] Generate the client and run `prisma validate` plus `prisma migrate status`.
- [x] Commit the dependency and CLI migration.

### Task 2: Migrate runtime client and add live connection verification

**Files:**
- Modify: `src/lib/db/client.ts`, `prisma/seed.ts`, `package.json`
- Create: `scripts/verify-db.ts`

- [x] Add a failing connection-verification script that imports the singleton and expects `SELECT 1 AS ok` to return `1`.
- [x] Create the singleton with `PrismaPg` using the validated database URL; update seed imports to use it.
- [x] Run `npm run db:verify` against Docker PostgreSQL and `npm run db:seed`.
- [x] Commit the runtime adapter migration.

### Task 3: Verify security and synchronize documentation

**Files:**
- Modify: `README.md`, `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`

- [x] Run `npm audit --omit=dev`; confirm the Prisma 6/deepmerge-ts advisory path is absent.
- [x] Run lint, type-check, unit tests, three-browser E2E, build, Prisma validation, migration status, and `git diff --check`.
- [ ] Update Sprint 0 status and WITA changelog with verified facts.
- [ ] Commit, push, create a PR, and verify GitHub Actions checks.
