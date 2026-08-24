# AGENTS.md — Netloka Agent Operating Instructions

This file is the operational contract for AI coding agents and automated contributors working on Netloka.

The instructions apply to the entire repository unless a more specific `AGENTS.md` exists deeper in the directory tree.

---

# 1. Project Context

**Project:** Netloka  
**Domain:** `netloka.biz.id`  
**Purpose:** Interactive networking learning platform for SMK TKJ learners, networking beginners, and learners preparing for practical network/sysadmin work.

Core product areas:

- Learn
- Labs
- Challenges
- Consultant

Core learning experience:

```text
Learn → Interact → Practice → Challenge → Consultant Project
```

Netloka must teach concepts through deterministic interactions and real-world reasoning, not merely long-form reading.

---

# 2. Mandatory Context Retrieval Before Coding

Before making code changes, read the following in this exact order:

1. `AGENTS.md`
2. `ROADMAP.md`
3. `PLAN.md`
4. `CHANGELOG.md`
5. Relevant source files, tests, migrations, ADRs, and documentation for the active task

Do **not** begin implementation from the user's latest sentence alone.

After reading the documentation:

1. Determine the active milestone and sprint.
2. Identify the exact task(s) in `PLAN.md`.
3. Read the latest changelog entries relevant to those tasks.
4. Inspect the repository and recent work.
5. Review the previous completed sprint/milestone when the current work depends on it.

Useful repository context commands:

```bash
git status
git branch --show-current
git log --oneline --decorate -10
git diff
git diff --staged
gh auth status
gh repo view
gh pr status
```

Use `gh issue list` / `gh pr list` when issue or PR context is relevant.

---

# 3. Active Work Selection

Default behavior:

- Continue the **current active sprint** from `ROADMAP.md` / `PLAN.md`.
- Prefer unfinished tasks in that sprint before starting later work.
- Do not silently jump to a later milestone.
- Do not implement future learning paths unless the roadmap has been intentionally changed.

If documentation and repository state disagree:

1. inspect Git history and current code
2. inspect recent changelog entries
3. determine whether implementation or documentation is stale
4. update the stale source of truth as part of the work
5. record the correction in `CHANGELOG.md`

Do not guess and continue with contradictory project state.

---

# 4. Required Review Before New Dependent Work

Before starting a new sprint or milestone that depends on the previous one, review the most recently completed work.

Review at minimum:

- requirements coverage
- architecture consistency
- code quality
- tests
- type safety
- security implications
- database migrations
- accessibility/responsive behavior for UI changes
- duplicated or misplaced domain logic
- unfinished placeholders
- documentation accuracy

Classify findings:

- **Critical** — security/data-loss/system-breaking; must fix immediately
- **High** — likely correctness/regression issue; must fix before dependent work
- **Medium** — should fix in current sprint when reasonably related
- **Low** — may be tracked as technical debt

Record significant review findings and resolutions in `CHANGELOG.md`.

---

# 5. Implementation Principles

## 5.1 Architecture

Netloka starts as a **modular monolith**.

Do not introduce:

- microservices
- Kubernetes
- message brokers
- VM-per-user labs
- container-per-user labs
- arbitrary remote shell systems

unless `ROADMAP.md` is explicitly revised with a documented reason.

Prefer domain-focused modules under:

```text
src/features/<domain>/
```

Generic reusable visual primitives may live under:

```text
src/components/
```

## 5.2 Keep domain logic outside UI

Examples of domain logic that must not be duplicated across React components:

- IPv4 parsing
- subnet calculations
- reachability
- route evaluation
- VLAN validation
- quiz scoring
- XP rules
- consultant scoring
- budget calculation

Implement these as deterministic, testable domain functions/services.

## 5.3 Learning content must be data-driven

Do not build each lesson as a one-off hardcoded route.

Use the typed lesson block/content system defined in the active plan.

When a new lesson needs a new interaction:

1. check whether an existing reusable block can express it
2. extend an existing block when the behavior remains conceptually the same
3. create a new reusable block only when it has a distinct responsibility

## 5.4 Simulated terminal safety

Learner commands are simulated.

Never route learner-controlled terminal text into:

```text
exec
execFile
spawn
shell
SSH
Docker socket
host command execution
```

unless the architecture is formally revised and a dedicated security design is approved.

## 5.5 YAGNI

Do not implement post-MVP capabilities merely because they might be useful later.

Future paths currently include:

- CCTV & Surveillance
- Fiber Optic
- PABX / IP PBX / VoIP
- MikroTik
- Cisco
- Linux / Server Administration
- Network Security

The present architecture should remain extensible for them without implementing them now.

---

# 6. Testing Rules

Use tests as a correctness gate, not as decoration.

For new domain behavior:

1. write or update a failing test
2. run the focused test and confirm the expected failure
3. implement the smallest correct behavior
4. run the focused test
5. run the broader relevant suite

Critical networking logic requires deterministic unit tests.

Examples:

- subnet calculations
- IP overlap
- usable host ranges
- route reachability
- VLAN segmentation rules
- procurement capacity
- consultant scoring

Critical user journeys require E2E coverage where practical.

At sprint completion run all project-defined checks, expected to include equivalents of:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

If scripts differ in the real repository, use the actual repository scripts and update documentation when appropriate.

Do not claim tests pass without actually running them.

---

# 7. Documentation Duties

Documentation is part of implementation.

## `ROADMAP.md`

Update when:

- sprint/milestone status changes
- milestone scope changes
- sprint boundaries change
- MVP scope changes
- a future path becomes active work

## `PLAN.md`

Update when:

- implementation details become more precise
- real file paths differ from planned paths
- tasks are decomposed/reordered
- new tests are required
- active sprint implementation details materially change

Do not use `PLAN.md` to quietly expand the product scope; roadmap-level scope changes belong in `ROADMAP.md`.

## `CHANGELOG.md`

Append an entry for meaningful changes including:

- sprint/milestone start/completion
- features
- fixes
- refactors
- code review findings/resolutions
- dependency/architecture changes
- migrations
- deployment changes
- documentation changes

All timestamps must use:

```text
WITA / GMT+8
```

Format:

```text
YYYY-MM-DD HH:mm WITA
```

When obtaining the time programmatically on Linux, use an explicit GMT+8/WITA-compatible timezone rather than assuming the host timezone is correct.

Example:

```bash
TZ=Asia/Makassar date '+%Y-%m-%d %H:%M WITA'
```

Do not use UTC timestamps and label them WITA.

---

# 8. Git & GitHub Workflow

## 8.1 Never destroy unrelated work

Before edits:

```bash
git status
```

Do not:

- discard user changes
- reset unrelated commits
- force-push shared branches
- rewrite history without explicit instruction

## 8.2 Branching

Prefer focused branches:

```text
feat/sprint-2-learning-catalog
fix/lesson-progress-unlock
refactor/ipv4-domain
docs/update-roadmap
```

If the repository intentionally uses direct-to-main development, follow the repository's established policy.

## 8.3 Commit style

Use clear conventional-style commits where appropriate:

```text
feat: add lesson progress tracking
fix: prevent duplicate XP award
test: cover subnet host boundaries
refactor: isolate IPv4 calculation domain
docs: update sprint 7 plan
chore: configure CI checks
```

Keep commits reviewable and focused.

## 8.4 GitHub CLI is required for GitHub operations

Before GitHub operations:

```bash
gh auth status
gh repo view
```

Use GitHub CLI for repository/PR/issue operations, for example:

```bash
gh pr status
gh pr view
gh pr create
gh pr checks
gh issue list
```

`gh` does not provide a general replacement for Git's code transport. Code pushes should therefore use authenticated Git after validating GitHub context with `gh`:

```bash
gh auth status
gh repo view
git push -u origin <branch>
```

After pushing, use `gh` to create/update/review the pull request.

Never expose authentication tokens in logs, commits, screenshots, or documentation.

## 8.5 Pull request expectations

A PR description should include:

- milestone/sprint/task
- summary
- notable architectural decisions
- migrations
- tests executed and results
- screenshots for meaningful UI changes when practical
- known limitations
- documentation/changelog status

Before declaring PR ready:

```bash
gh pr checks
```

Review failures rather than rerunning blindly.

---

# 9. Sprint Completion Gate

A sprint may be marked complete only when all relevant items are satisfied:

- [ ] Active `PLAN.md` tasks complete
- [ ] Acceptance behavior manually/automatically verified
- [ ] Focused tests pass
- [ ] Full relevant test suite passes
- [ ] Type-check passes
- [ ] Lint passes
- [ ] Production build passes
- [ ] Security-sensitive code reviewed
- [ ] Database migration reviewed where applicable
- [ ] Responsive/accessibility checks performed for UI changes
- [ ] Last implementation diff reviewed
- [ ] Critical/high findings resolved
- [ ] `PLAN.md` updated
- [ ] `ROADMAP.md` status updated
- [ ] `CHANGELOG.md` updated in WITA
- [ ] Changes committed
- [ ] Branch pushed to GitHub
- [ ] PR created/updated when applicable

Do not mark a sprint complete while known Critical or High findings remain.

---

# 10. Milestone Completion Gate

Before marking a milestone complete:

1. review all sprints contained in the milestone
2. verify milestone exit criteria in `ROADMAP.md`
3. run milestone-level regression tests
4. inspect unresolved technical debt
5. review security/data migrations
6. ensure documentation reflects the actual repository
7. append a `[MILESTONE]` and `[REVIEW]` entry to `CHANGELOG.md`
8. push and merge through the established GitHub workflow

A milestone review is mandatory even if every sprint was individually reviewed.

---

# 11. Changelog Discipline During Coding

Examples:

```text
- [2026-08-24 15:42 WITA] [ADDED] [Milestone 0 / Sprint 0 / Task 0.2]
  Added PostgreSQL Docker service and Prisma database client.
  Files/areas: `docker-compose.yml`, `prisma/schema.prisma`, `src/lib/db/client.ts`
  Validation: migration applied; database integration tests passed
  Git: abc1234
```

For a fix discovered during review:

```text
- [2026-08-25 10:15 WITA] [FIXED] [Milestone 1 / Sprint 2]
  Fixed prerequisite resolver incorrectly unlocking lessons when only one of multiple required lessons was complete.
  Validation: prerequisite unit suite passed; regression test added
  Git: def5678
```

Do not add fake commit SHAs or PR numbers. Write `Git: pending` until they exist, then append a later correction/update entry if necessary.

---

# 12. Security Rules

Never commit:

- `.env`
- database credentials
- API tokens
- private keys
- Cloudflare credentials
- GitHub tokens
- production secrets

Use `.env.example` with safe placeholders.

Treat authorization separately from authentication. Being signed in does not grant permission to mutate another user's:

- progress
- attempts
- profile
- consultant projects
- XP

Validate all externally controlled data server-side.

Avoid exposing internal scoring answers/rubrics to the browser when doing so would allow trivial cheating.

---

# 13. Dependency Rules

Before adding a dependency:

1. verify the capability is not already available
2. check maintenance/compatibility
3. avoid packages for trivial utility behavior
4. prefer well-maintained libraries with clear licenses
5. record consequential architectural dependencies in `docs/decisions/`

Do not replace stable project foundations in the middle of a sprint without documenting why.

---

# 14. Definition of Agent Success

A good Netloka agent does not merely produce code.

It:

- understands the current roadmap
- continues the correct sprint
- preserves existing work
- implements only justified scope
- writes deterministic tests
- reviews its own changes
- keeps documentation synchronized
- records meaningful changes in WITA
- uses Git/GitHub safely
- leaves the repository in a state another agent can understand immediately

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
