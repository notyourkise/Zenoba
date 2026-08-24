# Sprint 0 Foundation Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Milestone 0 / Sprint 0 reproducible from a clean clone, verified locally, and enforceable through GitHub Actions.

**Architecture:** Keep the existing Next.js modular-monolith baseline. Strengthen the project boundary around deterministic installation, local-only PostgreSQL, a valid Prisma migration history, real health-route tests, and a Playwright smoke journey. Work occurs in `codex/fix-m0-sprint-0`, isolated from the uncommitted Sprint 1 work in the primary checkout.

**Tech Stack:** Next.js 16, TypeScript, npm, Vitest, Playwright, PostgreSQL 16, Prisma 6, Docker Compose, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-24-sprint-0-foundation-repair-design.md`

## Global Constraints

- `main` remains the primary branch and `https://github.com/notyourkise/NetLoka.git` remains the canonical remote.
- Do not include any uncommitted Sprint 1 authentication/profile files in this branch.
- Keep npm as the only package manager and commit `package-lock.json`.
- Bind the development database to `127.0.0.1`, never all interfaces.
- Use real route-handler calls in unit tests and a real browser for E2E tests.
- Do not mark Sprint 0 complete until lint, typecheck, unit tests, E2E tests, production build, Docker-backed Prisma validation, documentation review, and GitHub PR checks pass.
- Record meaningful project changes in `CHANGELOG.md` using WITA timestamps.

## File Structure

- `.gitignore`: tracks the npm lockfile and ignores the project-local worktree directory.
- `package-lock.json`: exact dependency graph used by `npm ci` locally and in CI.
- `docker-compose.yml`: local-only PostgreSQL endpoint and health check.
- `prisma/migrations/`: Prisma-created `init` migration directory and SQL script.
- `src/app/api/health/health.test.ts`: integration-level route contract tests.
- `src/e2e/foundation.spec.ts`: browser smoke tests for the landing page and health endpoint.
- `.github/workflows/ci.yml`: deterministic CI sequence for lint, typecheck, unit tests, E2E tests, and build.
- `README.md`, `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`: verified setup and Sprint 0 status.

---

### Task 1: Isolate the repair branch and make npm installation reproducible

**Files:**
- Modify: `.gitignore`
- Add: `package-lock.json`

**Produces:** A clean worktree can install exactly the committed dependency graph with `npm ci`.

- [ ] **Step 1: Prepare the primary checkout for a project-local worktree**

In the primary checkout only, update `.gitignore` by deleting `package-lock.json` and adding this exact entry:

```text
.worktrees/
```

Then commit only this setup file:

```powershell
git add .gitignore
git commit -m "chore: ignore local worktrees"
```

- [ ] **Step 2: Create the isolated worktree**

Run:

```powershell
git check-ignore -q .worktrees
git worktree add .worktrees/codex-fix-m0-sprint-0 -b codex/fix-m0-sprint-0 main
```

Expected: the new worktree starts on `codex/fix-m0-sprint-0` with no Sprint 1 files.

- [ ] **Step 3: Generate the lockfile from the declared package manifest**

Run:

```powershell
npm install --package-lock-only
```

Expected: `package-lock.json` is created or synchronized without changing runtime source code.

- [ ] **Step 4: Verify deterministic installation**

Run:

```powershell
npm ci --ignore-scripts
```

Expected: exit code 0 with dependencies matching `package-lock.json`.

- [ ] **Step 5: Commit the repository reproducibility changes**

```powershell
git add .gitignore package-lock.json
git commit -m "chore: track npm lockfile"
```

### Task 2: Test the real health route contract

**Files:**
- Modify: `src/app/api/health/health.test.ts`

**Produces:** Tests call `GET()` directly and validate the actual `NextResponse` body, status, and timestamp.

- [ ] **Step 1: Replace the mock-object test with a failing route invocation test**

Use this test shape:

```ts
import { describe, expect, it } from "vitest";
import { GET } from "./route";

it("returns the health contract", async () => {
  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.status).toBe("ok");
  expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
});
```

- [ ] **Step 2: Run the focused test**

Run:

```powershell
npm test -- src/app/api/health/health.test.ts
```

Expected: PASS because the existing handler already provides the specified public contract; no production change is required if it passes.

- [ ] **Step 3: Commit the route-contract test**

```powershell
git add src/app/api/health/health.test.ts
git commit -m "test: cover health route contract"
```

### Task 3: Create a browser smoke test and enforce it in CI

**Files:**
- Add: `src/e2e/foundation.spec.ts`
- Modify: `.github/workflows/ci.yml`

**Produces:** `npm run test:e2e` runs at least one real browser test locally; GitHub Actions runs Playwright after installing browsers.

- [ ] **Step 1: Add a failing Playwright smoke test**

Create `src/e2e/foundation.spec.ts` with:

```ts
import { expect, test } from "@playwright/test";

test("renders the Netloka landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome to Netloka" })).toBeVisible();
});

test("serves the health endpoint", async ({ request }) => {
  const response = await request.get("/api/health");
  const body = await response.json();

  expect(response.ok()).toBeTruthy();
  expect(body.status).toBe("ok");
  expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
});
```

- [ ] **Step 2: Run the focused browser test and verify it passes**

Run:

```powershell
npm run test:e2e -- --project=chromium src/e2e/foundation.spec.ts
```

Expected: 2 passing tests in Chromium.

- [ ] **Step 3: Update CI branches and Playwright execution**

In `.github/workflows/ci.yml`:

- replace every branch list `[main, develop]` with `[main]`;
- delete the unused `Pnpm_VERSION` environment entry;
- add a `test-e2e` job after the unit-test job;
- install dependencies with `npm ci`;
- run `npx playwright install --with-deps chromium`;
- run `npm run test:e2e -- --project=chromium`;
- make the `build` job depend on `test-e2e`;
- include `test-e2e` in `quality-gate.needs` and its success condition.

- [ ] **Step 4: Commit E2E coverage and CI enforcement**

```powershell
git add src/e2e/foundation.spec.ts .github/workflows/ci.yml
git commit -m "test: add Sprint 0 browser smoke coverage"
```

### Task 4: Secure and verify the local PostgreSQL foundation

**Files:**
- Modify: `docker-compose.yml`
- Add: `prisma/migrations/` generated by `prisma migrate dev --name init`

**Produces:** Docker exposes PostgreSQL only to the local host and Prisma has a committed initial migration.

- [ ] **Step 1: Change the Docker port binding**

Replace the compose port mapping with:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

- [ ] **Step 2: Start the service and wait for the health check**

Run:

```powershell
docker compose up -d
docker compose ps
```

Expected: service `postgresql` is `healthy`.

- [ ] **Step 3: Create the initial migration through Prisma**

Run:

```powershell
npm run db:generate
npm run db:migrate -- --name init
```

Expected: a timestamped migration directory exists under `prisma/migrations/` and Prisma reports that the migration was applied.

- [ ] **Step 4: Verify database connectivity and migration state**

Run:

```powershell
npx prisma validate
npx prisma migrate status
```

Expected: schema valid and database schema up to date.

- [ ] **Step 5: Commit Docker and migration artifacts**

```powershell
git add docker-compose.yml prisma/migrations
git commit -m "chore: verify local PostgreSQL foundation"
```

### Task 5: Run complete verification and synchronize project documentation

**Files:**
- Modify: `README.md`
- Modify: `ROADMAP.md`
- Modify: `PLAN.md`
- Modify: `CHANGELOG.md`

**Produces:** Documentation accurately states that Sprint 0 is complete only after all checks have succeeded.

- [ ] **Step 1: Run every local quality gate**

Run:

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Expected: every command exits 0.

- [ ] **Step 2: Update setup and status documentation from verified results**

- In `README.md`, use `npm ci` as the standard installation command and mark M0 complete.
- In `ROADMAP.md`, change the project status to Milestone 0 complete and Sprint 1 ready to start.
- In `PLAN.md`, mark the locally verified Sprint 0 task checkboxes complete. Leave the push/PR checkbox unchecked until Task 6 completes.
- In `CHANGELOG.md`, add WITA-timestamped `FIXED`, `TEST`, `REVIEW`, `SPRINT`, and `MILESTONE` entries with `Git: pending` until their commit hashes exist.

- [ ] **Step 3: Review the final diff**

Run:

```powershell
git diff main...HEAD --check
git diff main...HEAD
```

Expected: no whitespace errors, no Sprint 1 files, and all changes map to this plan.

- [ ] **Step 4: Commit documentation and verification status**

```powershell
git add README.md ROADMAP.md PLAN.md CHANGELOG.md
git commit -m "docs: complete Sprint 0 foundation"
```

### Task 6: Publish and review the Sprint 0 repair

**Files:**
- No source-file changes required.

**Produces:** A pushed repair branch and GitHub pull request with CI evidence.

- [ ] **Step 1: Push the branch**

Run:

```powershell
git push -u origin codex/fix-m0-sprint-0
```

- [ ] **Step 2: Create the pull request**

Run:

```powershell
gh pr create --base main --head codex/fix-m0-sprint-0 --title "fix: complete Sprint 0 foundation" --body "## Milestone/Sprint\nMilestone 0 / Sprint 0\n\n## Summary\n- Tracks the npm lockfile and enforces reproducible CI\n- Adds real health and browser smoke coverage\n- Secures and verifies local PostgreSQL with a committed Prisma migration\n- Synchronizes Sprint 0 documentation\n\n## Tests\n- npm run lint\n- npm run typecheck\n- npm test\n- npm run test:e2e\n- npm run build\n- npx prisma validate\n- npx prisma migrate status\n\n## Migrations\nInitial Prisma migration added.\n\n## Limitations\nSprint 1 authentication work remains intentionally out of scope."
```

- [ ] **Step 3: Review the pull request checks**

Run:

```powershell
gh pr checks --watch
```

Expected: all configured GitHub Actions checks pass before the branch is merged.

### Task 7: Record GitHub verification and finalize Sprint 0 documentation

**Files:**
- Modify: `PLAN.md`
- Modify: `CHANGELOG.md`

**Produces:** Sprint 0's GitHub synchronization checkbox and changelog reflect the actual PR and passing check results.

- [ ] **Step 1: Update final GitHub evidence**

- Mark Sprint 0's push/PR checkbox in `PLAN.md` as complete.
- Append a WITA-timestamped changelog correction with the actual repair branch commit and pull request number.

- [ ] **Step 2: Commit and push the final documentation update**

```powershell
git add PLAN.md CHANGELOG.md
git commit -m "docs: record Sprint 0 GitHub verification"
git push
```

- [ ] **Step 3: Confirm the updated pull request remains green**

Run:

```powershell
gh pr checks --watch
```

Expected: all configured GitHub Actions checks pass after the final documentation commit.
