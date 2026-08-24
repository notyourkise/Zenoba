# Prisma 7 Security Remediation Design

**Date:** 2026-08-24

## Goal

Remove the Prisma 6 CLI dependency chain containing the audited `deepmerge-ts` advisory while preserving Netloka's PostgreSQL development workflow.

## Confirmed constraints

- Use Prisma ORM 7.9.1 for both `prisma` and `@prisma/client`.
- Retain PostgreSQL, Docker loopback exposure at `127.0.0.1:5433`, and the existing baseline migration.
- Prisma 7 requires ESM, `prisma.config.ts`, the `prisma-client` generator with an explicit generated-client path, and a PostgreSQL driver adapter.
- Keep generated client source out of version control; `postinstall` generates it after normal package installation.
- Verify a live PostgreSQL connection locally without adding a database service to CI.

## Design

1. Make the package ESM and raise Node's declared floor to Prisma 7's required Node 20.19.0.
2. Add `prisma.config.ts` as the CLI-only source for `DATABASE_URL`; remove the database URL from `schema.prisma`.
3. Generate the client into `src/generated/prisma`, ignored by Git, using the `prisma-client` provider.
4. Replace Prisma's old engine-backed connection with `@prisma/adapter-pg` and `pg` in the existing singleton.
5. Reuse the singleton in the seed script and add a `db:verify` script that performs `SELECT 1` against the configured database.
6. Validate install, generation, migrations, runtime connection, lint, type-check, unit tests, E2E, build, and `npm audit --omit=dev`.

## Out of scope

- Application data models and new database migrations.
- Cloudflare, staging, or production deployment.
- Altering the existing user-owned Sprint 1 working tree.
