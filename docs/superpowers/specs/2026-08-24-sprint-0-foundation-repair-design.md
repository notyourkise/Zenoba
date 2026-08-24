# Sprint 0 Foundation Repair Design

**Status:** Approved for specification review
**Date:** 2026-08-24
**Scope:** Milestone 0 / Sprint 0 only

## Goal

Make the Netloka foundation reproducible from a fresh clone and satisfy Sprint 0's documented acceptance criteria before starting Sprint 1.

## Repository and Branching

- The canonical remote is `https://github.com/notyourkise/NetLoka.git`.
- `main` is the primary branch.
- Existing uncommitted Sprint 1 work remains untouched in the primary checkout.
- Sprint 0 repair work happens in an isolated worktree on `codex/fix-m0-sprint-0`, created from the committed `main` baseline.
- The repair is committed and pushed as a focused branch, then proposed to `main` through GitHub.

## Sprint 0 Repair Scope

### Dependency and CI reproducibility

- Track the npm lockfile and remove the ignore rule that prevents it from being committed.
- Keep npm as the package manager because the project scripts and CI use npm.
- Update GitHub Actions to run on `main`, install the lockfile deterministically, run lint, typecheck, unit tests, Playwright E2E tests, and the production build.
- Install the required Playwright browser in CI before E2E execution.

### Database foundation

- Bind local PostgreSQL only to `127.0.0.1`.
- Create a reproducible initial Prisma migration for the Sprint 0 schema.
- Start PostgreSQL through Docker Compose, wait for its health check, and verify the Prisma connection against the running service.

### Test foundation

- Replace the health test's manually assembled object with a test that calls the real route handler and validates its HTTP response.
- Add a minimal Playwright smoke test for the landing page and health endpoint so `npm run test:e2e` is a real gate.
- Preserve the stable health response contract: `status` is `"ok"` and `timestamp` is a valid ISO-8601 string.

### Documentation and completion state

- Correct `PLAN.md`, `ROADMAP.md`, `README.md`, and `CHANGELOG.md` only when verified repository behavior supports the claimed state.
- Record all meaningful changes using WITA timestamps.
- Do not mark Sprint 0 complete until lint, typecheck, unit tests, E2E tests, production build, Docker-backed Prisma validation, and the diff review all pass.

## Out of Scope

- Authentication, protected routes, user profile, and all Sprint 1 work.
- Learning catalog, progress, lesson blocks, quizzes, labs, challenges, and consultant functionality.
- Production deployment, Caddy, Cloudflare, and user-facing product redesign.

## Acceptance Criteria

From a clean checkout of `main` plus the repair branch, a contributor can run `npm ci`, copy `.env.example` to `.env`, start Docker Compose, apply the Prisma migration, run unit and E2E tests, and produce a production build. GitHub Actions executes the same quality gates on pull requests to `main`.
