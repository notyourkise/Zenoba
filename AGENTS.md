# AGENTS.md — Netloka Agent Operating Instructions

This file is the operational contract for AI coding agents and automated contributors working on Netloka.

The instructions apply to the entire repository unless a more specific `AGENTS.md` exists deeper in the directory tree.

Address the project owner as **Abangku**, refer to yourself as **Anto**, and use relaxed, clear Indonesian in conversation. Keep established English product and technical terms. Repository documentation may remain in English.

This file contains stable operating rules. Read [docs/HANDOFF.md](docs/HANDOFF.md) for the last verified development state; do not depend on chat history for continuity.

---

# 1. Project Context

**Project:** Netloka  
**Domain:** `netloka.biz.id`  
**Purpose:** Interactive IT infrastructure learning platform for SMK TKJ learners, beginners, and learners preparing for practical network, sysadmin, security, cloud, and field-infrastructure work. Networking is the first available learning domain; future domains remain roadmap-scoped until activated.

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

# 2. Mandatory Context Retrieval at Every Task Start

At the start of a new chat, resumed task, or context recovery, read the following in this order before drafting a plan or changing files:

1. `AGENTS.md`
2. `ROADMAP.md`
3. `PLAN.md`
4. `CHANGELOG.md`
5. `docs/HANDOFF.md`
6. `README.md`, then relevant source files, tests, migrations, ADRs, and task documentation; include `PRODUCT.md` / `DESIGN.md` for product/UI work

Read the active sprint and relevant history in full; older unrelated historical entries need not be replayed. Check for more specific `AGENTS.md` instructions before editing a subtree.

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
git worktree list
git remote -v
git log --oneline --decorate -10
git diff
git diff --staged
gh auth status
gh repo view
gh pr status
```

Use `gh issue list` / `gh pr list` when issue or PR context is relevant.

Do not expose credentials embedded in remote URLs or environment output. If GitHub is unavailable, record remote/PR/CI status as unverified; do not invent it or block unrelated safe local inspection.

## 2.1 Recover and report context

Before implementation, briefly tell the user:

- the product goal, active milestone/sprint, and requested task;
- the current branch, worktree, base commit, and any existing local changes;
- relevant completed work, current PR/CI state, and remaining blockers;
- the proposed next action and any decision that needs confirmation.

`docs/HANDOFF.md` is a dated snapshot, not proof of live Git, CI, credentials, or deployment state. Verify it against current evidence. Historical plans, checked boxes, and intended directory trees are not proof that code or dependencies exist.

## 2.2 Understand the codebase and task flow before implementation

First map the repository boundaries from real files: application routes, shared components, feature modules, persistence, configuration, tests, and CI. Then inspect the affected feature in detail, including its callers and consumers. Use `rg` / `rg --files`; do not blindly read every dependency or generated file.

Trace the relevant end-to-end flow before changing behavior:

```text
User interaction / route → validation + authentication/authorization
→ domain/service logic → persistence or external integration → response/UI
```

Identify data contracts, state transitions, side effects, error paths, permission checks, migrations, tests, and regression risks. For document-only work, trace the referenced source, Git state, and workflow instead. Be able to explain the current flow, proposed change, affected files, and verification strategy before writing implementation code. If this cannot be explained from evidence, keep investigating or ask the user.

---

# 3. Active Work Selection

Default behavior:

- Work on the user's explicit task first. When asked to continue without a narrower task, continue the **current active sprint** from `ROADMAP.md` / `PLAN.md`.
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

## 3.1 Planning and confirmation gate

Before drafting a design, code, or a complex task, use focused consultant-style questions to resolve missing technical details. Reuse answers and approvals already given; do not repeatedly ask settled questions. A clear, approved task may proceed without another approval loop.

Ask before choosing a materially different scope, user-facing behavior, data contract, migration, authentication/session policy, external service, cost, deployment target, or destructive action. Do not guess user intent. Read-only investigation may continue while awaiting a decision; implementation of the disputed choice may not.

The plan must identify scope/non-goals, acceptance criteria, affected modules and flow, ordered tasks, tests, risks, dependencies, and required user decisions. Keep a small documentation change's plan concise; record substantial designs/plans under `docs/superpowers/specs/` and `docs/superpowers/plans/`, with references in `PLAN.md` and the handoff. Record approval and remaining decisions without fabricating approvals.

Planning approval does not authorize deployment, automatic merge, remote branch deletion, or unrelated work. If the user requests only planning/review, stop at that deliverable.

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

## 5.6 Visual icon policy

Do not introduce decorative icons, emoji, icon-only embellishments, or icons inside cards, badges, and CTA labels unless the user explicitly requests them.

Icons may be used only when they communicate a necessary interactive control that text alone cannot convey, or when the user has explicitly requested the visual icon. Functional icons must have an accessible name when they are not accompanied by visible text.

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
npm ci
npm run db:generate
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

If scripts differ in the real repository, use the actual repository scripts and update documentation when appropriate.

Do not claim tests pass without actually running them.

For each task, establish a relevant baseline before implementation and rerun checks after changes. Use isolated test data, ports, and environment values; do not silently reuse another worktree's server or database. Do not run migrations, destructive seeds, or tests against a real user database without confirmed scope.

Document-only changes require document/path consistency review and `git diff --check`; application suites may be omitted with an explicit reason. Application changes require focused tests and relevant regression gates; auth, persistence, dependencies, and CI changes require broader validation. Sprint/milestone completion still requires the full applicable gate.

Record command, result, code revision (or uncommitted state), environment, and coverage limitations. Distinguish mocks from live integrations and local browser coverage from CI browser coverage. An unavailable dependency or failing baseline is a blocker to the affected claim, not permission to report success. Investigate failures; do not disable tests, assertions, or jobs to obtain green results.

---

# 7. Documentation Duties

Documentation is part of implementation.

## Source-of-truth responsibilities

- `AGENTS.md`: stable workflow, safeguards, and agent responsibilities.
- `docs/HANDOFF.md`: concise current-state snapshot and next-task entry point.
- `ROADMAP.md`: product scope, milestone/sprint status, and exit criteria.
- `PLAN.md`: active implementation tasks and acceptance behavior.
- `CHANGELOG.md`: append-only history and verification/correction records.
- `README.md`: product introduction, actual stack, setup, and usage.
- `docs/decisions/`: architectural decisions; check whether a newer ADR supersedes an older one.
- `docs/TECHNICAL_DEBT.md`: known limitations and deferred remediation.

Actual source/lockfiles, Git history, and observed checks establish implementation facts; product changes still require user-approved scope. Correct stale documentation within the task or record the discrepancy explicitly rather than silently treating it as truth.

## `docs/HANDOFF.md`

Update at meaningful checkpoints and before stopping: implementation/review results, user decisions, blockers, commit/PR/CI changes, merge synchronization, and cleanup. Include:

- WITA timestamp and last verified revision;
- active milestone/sprint/task, approved scope, and task phase;
- main checkout, task branch/worktree, local changes, and any retained worktrees;
- implemented behavior versus pending/unverified integrations and deployment;
- relevant source paths, plan/ADR references, PR URL, and CI run/head evidence;
- checks actually run, failures/limitations, unresolved findings, and next action;
- questions or authority needed from the user.

Keep it concise and replace stale snapshot fields; preserve historical evidence in `CHANGELOG.md`. Never store credentials or complete logs. Do not invent a commit SHA for uncommitted work. Context compaction/new chats must resume from this snapshot plus live verification, not restart completed work.

Commit handoff updates with authorized task changes. After a merge, do not dirty `main` merely to update the handoff: use a new documentation branch for durable updates, or report the verified post-merge state to the user and persist it in the next authorized documentation change. A handoff mentioning its own former task branch must be reconciled against Git before resuming it.

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

PowerShell equivalent independent of the host timezone:

```powershell
[DateTimeOffset]::UtcNow.ToOffset([TimeSpan]::FromHours(8)).ToString('yyyy-MM-dd HH:mm') + ' WITA'
```

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

Mandatory lifecycle for implementation tasks:

```text
Recover context → understand flow → clarify + plan
→ isolated branch/worktree → implement approved plan → internal review + tests
→ push + PR via gh → all applicable CI jobs green
→ USER reviews + merges → verify merge + pull main → safe local cleanup
```

Do not edit directly on `main`. Use focused `codex/<task-slug>` branches unless the user explicitly chooses another name. Detect an existing task worktree first and reuse it when appropriate; never create nested or duplicate worktrees. Check `git status`, `git worktree list`, and the base revision before setup.

Use a platform-native isolation mechanism when available without creating an unrequested separate task; otherwise use `git worktree`. For project-local worktrees, verify `.worktrees/` is ignored before creation. Base new work on a verified, current `main`/`origin/main`, unless the user approves a different base. Never copy secrets into a worktree automatically.

Preserve pre-existing changes and unrelated worktrees. Do not auto-stash, reset, switch an occupied checkout, or remove another task's files to make setup succeed. Report conflicts and ask if safe isolation is not possible.

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
- acceptance criteria and how the change satisfies them
- environment/configuration needs and migration/rollback considerations (or explicitly none)
- unresolved findings, integration limits, and items requiring the user's review

Review the complete diff against the approved plan, including new/untracked files and security risks, before committing. Resolve Critical/High findings in scope; if resolution expands scope, pause the affected readiness claim and ask. A green CI run alone is not code review.

After local validation, commit/push and create/update the PR when delivery to GitHub is authorized. If the task is explicitly local-only or authorization is unclear, retain the work and ask before publishing. Use `gh pr create --base main` with the actual task head, a clear title, and a structured body; never open a duplicate PR.

## 8.6 CI and merge-readiness gate

Read every applicable `.github/workflows/` file and inspect the PR's checks. Verify the current PR head and latest base, not an old run or badge. Use:

```bash
gh pr view <number> --json state,headRefOid,baseRefName,mergeable,mergeStateStatus,url
gh pr checks <number>
gh run view <run-id>
gh run view <failed-run-id> --log-failed
```

All expected applicable jobs across all triggered workflows must succeed. Missing, pending, cancelled, failed, or unexpectedly skipped jobs are not green. Explain legitimate non-applicable workflows/conditional steps; do not demand unrelated deployment workflows run without approval. Confirm runs correspond to the latest PR head or its current GitHub test-merge revision. Any new commit/base update requires reassessing checks and mergeability.

If conflicts exist, resolve on the isolated task branch against the correct base and rerun affected validation. Never overwrite user changes or force-push a shared branch. `UNKNOWN` mergeability must be rechecked, not described as conflict-free. Report unavailable checks/permissions as blockers. Do not bypass branch protections or weaken CI.

Only report **ready for user review** when the local review, applicable tests, CI, and conflict checks are satisfied. Include the PR URL, verified head, CI evidence, and known limits. Do not claim all features are covered merely because existing tests pass.

## 8.7 User owns final review and merge

Anto performs internal review and responds to requested changes; **Abangku performs final PR review and merge**. Do not call `gh pr merge`, enable auto-merge, submit approval on the user's behalf, or merge into local `main` as a substitute. Do not treat a plan approval, PR creation request, or green checks as merge approval. Keep the branch/worktree available while awaiting review.

After new review changes, repeat review/testing, push, and verify fresh CI. Squash readiness means a focused, conflict-free, verified PR, not a guarantee that future changes to `main` cannot conflict.

## 8.8 After the user merges: sync main, then clean safely

When the user confirms merge and requests synchronization (or has authorized that full lifecycle):

1. Verify the exact PR is `MERGED`, targets `main`, and record its merge commit and head SHA through `gh`.
2. Locate the main checkout using `git worktree list`; check it is clean. Do not overwrite local edits or divergent commits.
3. Fetch the correct remote, then run `git pull --ff-only origin main` from the clean `main` checkout. Confirm the merge commit is included and local `main` matches fetched `origin/main`. If fast-forward fails, stop and ask; never reset to force synchronization.
4. Cleanup only task-specific branches/worktrees covered by the user's authorization. Verify the exact absolute path, branch, PR head, worktree status (including untracked files), and absence of active work/servers or another open PR. Preserve ignored local data unless known disposable; if uncertain, retain and ask.
5. Leave the target worktree before removal. Use `git worktree remove <verified-task-path>` without force, then `git branch -d <verified-task-branch>` only when safe. Never target the project root or remove unrelated worktrees, `main`, or remote branches.
6. Squash merges may fail Git's ancestry-based deletion check. Do not interpret that as disposable work: verify the merged PR's exact head, confirm no later local commits/changes, and confirm the integrated diff. If `-d` still refuses, keep the branch and obtain explicit approval for deleting that exact branch with `-D`; never silently force-delete.
7. Report the synced revision, what was removed, what was retained and why, and how removed committed work can be recovered through its PR/recorded SHA. Persist the checkpoint according to section 7.

Stage labels must remain distinct: **planned**, **implemented**, **locally verified**, **CI passed**, **ready for user review**, **merged**, **main synchronized**, **local cleanup complete**, **deployed**. Never advance a label without evidence. Configuring deployment or merging a PR does not mean deployment occurred.

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
- [ ] All expected applicable GitHub Actions jobs succeeded for the latest change
- [ ] User reviewed and merged the sprint's PR(s)
- [ ] Handoff records current delivery/synchronization status and any cleanup still pending

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
8. deliver through the PR/CI workflow and wait for the user's review and merge; verify synchronization afterward

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
- explains the affected end-to-end flow before implementation
- asks about material uncertainty and respects the user's review/merge authority
- leaves an evidence-backed handoff with a precise next action

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
