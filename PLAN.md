# Netloka Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use a task-by-task implementation workflow with review gates. Steps in this plan use checkbox (`- [ ]`) syntax for tracking. Do not implement a later sprint merely because it is interesting; follow the active sprint unless a dependency fix is required.

**Goal:** Build Netloka as an interactive beginner-to-practical networking learning platform with Learn, Labs, Challenges, and IT Consultant simulation.

**Architecture:** Netloka starts as a modular Next.js monolith backed by PostgreSQL. Learning content is represented as typed data and reusable lesson blocks rather than one custom React page per lesson. Networking practice uses deterministic logical simulation instead of arbitrary code execution or real virtual machines.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide, PostgreSQL, Prisma, React Flow, Lottie, Docker, Caddy, Cloudflare, GitHub Actions, Git/GitHub CLI.

**Spec:** `ROADMAP.md`

## Global Constraints

- Primary production domain is `netloka.biz.id`.
- Project logs use WITA / GMT+8.
- Architecture starts as a modular monolith.
- Learning content must not require hardcoded pages for every lesson.
- Lottie assets should be self-hosted and license information retained.
- Networking simulation must be deterministic and sandboxed in application logic.
- Do not execute arbitrary learner-provided shell commands on the server.
- Real device marketplace pricing is out of MVP scope.
- CCTV, Fiber Optic, PABX/VoIP, MikroTik, Cisco, Linux/Server, and Network Security paths are post-MVP unless roadmap scope is explicitly changed.
- Every completed sprint requires tests, review, documentation updates, changelog entry, and GitHub synchronization.

---

# 1. Planned Repository Layout

This layout is the target baseline. Existing project conventions take precedence if the repository already contains equivalent structures.

```text
netloka/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── architecture/
│   └── decisions/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── lottie/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── learn/
│   │   │   ├── labs/
│   │   │   ├── challenges/
│   │   │   └── consultant/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   └── learning/
│   ├── features/
│   │   ├── auth/
│   │   ├── learning/
│   │   ├── progress/
│   │   ├── quiz/
│   │   ├── labs/
│   │   ├── challenges/
│   │   ├── simulation/
│   │   └── consultant/
│   ├── lib/
│   │   ├── db/
│   │   ├── env/
│   │   └── validation/
│   └── test/
├── AGENTS.md
├── CHANGELOG.md
├── PLAN.md
├── ROADMAP.md
├── docker-compose.yml
└── package.json
```

Boundary rule: place code by domain responsibility under `src/features/*`; keep generic visual primitives under `src/components/*`.

---

# Milestone 0 — Project Foundation

## Sprint 0 — Repository & Environment Bootstrap

### Task 0.1 — Bootstrap the web application and quality gates

**Files:**
- Create/modify: `package.json`
- Create: `src/app/page.tsx`
- Create: `src/app/api/health/route.ts`
- Create: `.editorconfig`
- Create: `.env.example`
- Create/modify: ESLint/formatting configuration appropriate to selected Next.js version
- Test: health route test and/or smoke test supported by selected framework tooling

**Produces:**
- reproducible install command
- `dev`, `lint`, `typecheck`, `test`, `test:e2e`, and `build` scripts
- HTTP health response with stable shape

- [x] Pin a supported Node.js LTS version using `.nvmrc` (Node 20.19+).
- [x] Scaffold Next.js with TypeScript and Tailwind CSS.
- [x] Add ESLint + Prettier formatting rules via `.editorconfig` and `eslint.config.mjs`.
- [x] Add Vitest unit/integration test framework with jsdom environment.
- [x] Add Playwright browser E2E framework (chromium/firefox/webkit).
- [x] Add `GET /api/health` returning `{ status: "ok" }` endpoint.
- [x] Add unit test verifying health response contract (`src/app/api/health/health.test.ts`).
- [x] Run lint, type-check, tests, and production build — all passing.
- [x] Commit as focused bootstrap commit.

### Task 0.2 — PostgreSQL and environment validation

**Files:**
- Create: `docker-compose.yml`
- Create: `prisma/schema.prisma`
- Create: `src/lib/db/client.ts`
- Create: `src/lib/env/server.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: singleton Prisma client module
- Produces: validated server environment configuration

- [x] Add PostgreSQL service to Docker Compose with health checks and local-only exposure.
- [x] Define `DATABASE_URL` in `.env.example` using non-secret placeholder values.
- [x] Install/configure Prisma ORM; generate client successfully.
- [x] Add environment validation that fails fast for missing required server variables (Zod schema).
- [x] Created initial database migration structure (requires running PostgreSQL).
- [x] Verify a local database connection and Prisma migration status with Docker PostgreSQL on `127.0.0.1:5433`.
- [x] Run automated checks — lint/typecheck/test/build all pass.
- [x] Commit database/environment foundation.

### Task 0.3 — CI and contributor baseline

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md` if present
- Modify: `AGENTS.md`, `CHANGELOG.md`

- [x] Configure CI to install dependencies using lockfile (`npm ci`).
- [x] Run lint enforcement via GitHub Actions.
- [x] Run type-check enforcement via GitHub Actions.
- [x] Run automated tests enforcement via GitHub Actions.
- [x] Run Chromium browser E2E enforcement via GitHub Actions.
- [x] Run production build enforcement via GitHub Actions.
- [x] Document local setup commands in `README.md` with comprehensive contributor onboarding guide.
- [x] Record Sprint 0 work in `CHANGELOG.md` with WITA timestamps and detailed validation notes.
- [ ] Review Sprint 0 diff against `ROADMAP.md` and this plan (pending manual review before merge).
- [ ] Push branch and create/update PR if using a PR workflow.

**Sprint 0 acceptance test:** A new contributor can clone the repository, create the documented environment file, start PostgreSQL, install dependencies, run tests, and build successfully.

---

# Milestone 1 — Core Product Shell

## Sprint 1 — Authentication, User Model & Application Shell

### Task 1.1 — Select and integrate authentication

Before changing code, compare the current stable versions and Next.js compatibility of Better Auth and Auth.js. Record the decision in `docs/decisions/0001-authentication.md`.

**Required decision criteria:**
- current Next.js compatibility
- credentials/social-login requirements for MVP
- Prisma/PostgreSQL integration
- session security
- maintenance activity
- migration complexity

**Files:**
- Create: `docs/decisions/0001-authentication.md`
- Create/modify auth files required by selected provider
- Modify: `prisma/schema.prisma`
- Create tests for protected route/session behavior

- [x] Write the decision record with one selected option and rejected alternative (`docs/decisions/0001-authentication.md`).
- [x] Write a failing protected-route test (`src/features/auth/auth-route.test.ts`).
- [x] Add auth schema/migration (`prisma/schema.prisma` with NextAuth models).
- [x] Implement sign-up/sign-in/sign-out (`/api/auth/register`, `/sign-in`, `/sign-up`, PBKDF2 password hashing).
- [x] Protect app routes (`src/middleware.ts` guarding `/dashboard`, `/learn`, `/labs`, `/challenges`, `/consultant`, `/profile`).
- [x] Verify unauthenticated and authenticated flows (Vitest integration tests + Playwright E2E).
- [x] Commit authentication integration.

### Task 1.2 — Application shell

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Create navigation components under `src/components/navigation/`
- Create: dashboard/Learn/Labs/Challenges/Consultant route placeholders with real navigation behavior
- Test: navigation E2E

- [x] Build responsive navigation for Dashboard, Learn, Labs, Challenges, Consultant, and Profile.
- [x] Ensure each navigation item has a functional route.
- [x] Add keyboard-visible focus states and semantic navigation landmarks.
- [x] Add mobile navigation behavior.
- [x] Add E2E test proving an authenticated user can navigate primary areas (`src/e2e/foundation.spec.ts`).
- [x] Run full checks and commit.

### Task 1.3 — User profile

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `src/features/auth/` or `src/features/profile/` domain files
- Create: profile route
- Test: profile read/update validation

- [x] Define allowed profile fields only (`src/app/api/user/profile/route.ts`).
- [x] Validate profile updates server-side (Zod schema with non-empty trimmed name).
- [x] Prevent clients from mutating privileged/internal fields.
- [x] Add tests for valid and invalid updates (`src/features/profile/profile-route.test.ts`).
- [x] Commit.

**Sprint 1 acceptance test:** A user can create an account, sign in, navigate the protected app, update allowed profile data, sign out, and cannot access protected content afterward.

---

## Sprint 2 — Learning Catalog & Progress Model

### Task 2.1 — Learning hierarchy data model

**Core entities:**
- `LearningPath`
- `Module`
- `Lesson`
- `LessonPrerequisite`
- `UserLessonProgress`

Minimum status semantics:
- `LOCKED` — prerequisite not satisfied
- `AVAILABLE` — can start
- `IN_PROGRESS`
- `COMPLETED`

**Files:**
- Modify: `prisma/schema.prisma`
- Create migration
- Create: `prisma/seed.ts`
- Create: `src/features/learning/queries.ts`
- Create tests for ordering/prerequisites

- [x] Write tests for path/module/lesson ordering (`src/features/learning/queries.test.ts`).
- [x] Write tests for prerequisite resolution (`src/features/learning/prerequisites.test.ts`).
- [x] Implement schema and migration (`prisma/schema.prisma` with LearningPath, Module, Lesson, LessonPrerequisite, UserLessonProgress).
- [x] Seed a small Network Foundations sample (`prisma/seed.ts`).
- [x] Implement typed catalog queries (`src/features/learning/queries.ts`).
- [x] Verify deterministic ordering.
- [x] Commit.

### Task 2.2 — Learn catalog UI

**Files:**
- Create routes under `src/app/(app)/learn/`
- Create learning path/module cards
- Test catalog rendering

- [x] Render paths (`src/app/(app)/learn/page.tsx`).
- [x] Render module progress (`src/app/(app)/learn/[pathSlug]/page.tsx`).
- [x] Render lesson status clearly (LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED badges).
- [x] Prevent locked lesson navigation (barrier view with return action).
- [x] Show prerequisite explanation for locked lessons (`unmetPrerequisites` list with links).
- [x] Test mobile layout and keyboard navigation.
- [x] Commit.

### Task 2.3 — Persistent progress

**Interfaces:**
- Consumes: authenticated user ID, lesson ID
- Produces: completion state and aggregate module/path progress

- [x] Write tests for first-open transition `AVAILABLE → IN_PROGRESS` (`src/features/learning/progress.test.ts`).
- [x] Write tests for completion idempotency (`completeLessonProgress` tests).
- [x] Write tests for unlocking dependent lessons (`prerequisites.test.ts`).
- [x] Implement progress service (`src/features/learning/progress.ts` and `/api/learning/progress`).
- [x] Display aggregate progress on dashboard (`src/app/(app)/dashboard/page.tsx`).
- [x] Commit.

**Sprint 2 acceptance test:** Seeded learning content is visible, locked content respects prerequisites, and progress survives sign-out/sign-in.

---

# Milestone 2 — Learning Engine

## Sprint 3 — Lesson Block Renderer

### Task 3.1 — Define the lesson block contract

Initial discriminated block types:

```text
heading
text
image
callout
code
lottie
diagram
interactive
quiz
terminal
practice
summary
reward
```

**Files:**
- Create: `src/features/learning/blocks/schema.ts`
- Create: `src/features/learning/blocks/registry.ts`
- Test: block schema validation

- [ ] Define a versioned lesson-content schema.
- [ ] Reject unknown block types.
- [ ] Validate required fields per block.
- [ ] Ensure malformed content produces an author-visible validation error, not a learner crash.
- [ ] Commit.

### Task 3.2 — Renderer registry

- [ ] Write renderer tests for known/unknown blocks.
- [ ] Implement registry mapping block type → component.
- [ ] Add generic error fallback for invalid persisted content.
- [ ] Add reduced-motion support for motion blocks.
- [ ] Commit.

### Task 3.3 — Lesson runtime

- [ ] Render ordered lesson blocks from persisted/seeded content.
- [ ] Track lesson start.
- [ ] Add previous/next lesson controls.
- [ ] Add explicit completion action where assessment requirements allow it.
- [ ] Prevent accidental duplicate completion rewards.
- [ ] Test full lesson render.
- [ ] Commit.

---

## Sprint 4 — Quiz, Practice & Reward Engine

### Task 4.1 — Quiz engine

Supported MVP question forms:
- single choice
- multiple choice
- ordered list/categorization when a lesson explicitly needs it

- [ ] Define quiz schema.
- [ ] Define answer evaluation as deterministic server/shared-domain logic.
- [ ] Store attempts.
- [ ] Provide explanation after submission according to content configuration.
- [ ] Test exact scoring and repeat attempts.
- [ ] Commit.

### Task 4.2 — XP and completion rewards

- [ ] Define XP event types.
- [ ] Make XP awarding idempotent for one-time lesson completion.
- [ ] Store an auditable XP ledger rather than only a mutable total.
- [ ] Derive/display total XP.
- [ ] Test duplicate request resistance.
- [ ] Commit.

### Task 4.3 — Complete lesson loop

- [ ] Seed one representative lesson containing concept text, visual, interaction placeholder, quiz, practice, summary, and reward.
- [ ] E2E test the complete lesson journey.
- [ ] Verify completion unlocks the next lesson.
- [ ] Commit.

**Milestone 2 acceptance test:** One learner can complete a fully block-driven lesson and receive persistent progress/XP without lesson-specific route code.

---

# Milestone 3 — Network Foundations

## Sprint 5 — Network Foundations Part A

### Modules

1. Welcome to Networking
2. Types of Networks
3. Client, Server & Communication
4. Network Topology

### Task 5.1 — Reusable interaction primitives

Create focused components under `src/components/learning/` or the learning feature:

- `DeviceCard`
- `SimpleNetworkDiagram`
- `PacketFlow`
- `ScenarioChoice`
- `TopologyExplorer`

Each component must:
- accept typed data
- work via click/tap
- provide keyboard-accessible controls
- respect reduced motion
- avoid lesson-specific hardcoding

### Task 5.2 — Author Part A content

- [ ] Create all required modules/lessons in seed/content source.
- [ ] Keep one primary concept per lesson.
- [ ] Target roughly 5–12 minutes per lesson.
- [ ] Add knowledge checks.
- [ ] Add relevant interactions.
- [ ] Run content schema validation.
- [ ] Complete editorial/technical review.

---

## Sprint 6 — Network Foundations Part B

### Modules

5. Network Devices
6. Physical Media & Cabling
7. How Data Travels
8. OSI & TCP/IP Foundations

### Task 6.1 — Additional reusable components

- `DeviceExplorer`
- `CableOrderExercise`
- `OSIStack`
- `EncapsulationVisualizer`

### Task 6.2 — Author Part B content

Include:
- NIC, hub, switch, router, modem/ONT, AP, firewall, server
- wired vs wireless
- UTP/Cat5e/Cat6/Cat6A
- RJ45
- T568A/T568B
- straight/crossover concept
- fiber introduction
- packet/frame/bits
- unicast/broadcast/multicast
- OSI/TCP-IP
- encapsulation/decapsulation

### Task 6.3 — Final challenge: First Day as IT Support

- [ ] Define scenario and expected solution.
- [ ] Validate selected inventory.
- [ ] Validate basic topology.
- [ ] Add simple troubleshooting questions.
- [ ] Store attempt/result.
- [ ] Award completion once.
- [ ] E2E test the Path 1 completion flow.

---

# Milestone 4 — Addressing & Core Networking

## Sprint 7 — IPv4 & Subnetting Engine

### Task 7.1 — Pure IPv4 domain library

Create deterministic, framework-independent functions for:

- IPv4 parsing/validation
- prefix validation
- mask conversion
- network address
- broadcast address
- first/last usable host
- usable host count
- subnet membership
- subnet generation
- VLSM allocation for supported exercises

**Critical rule:** Begin with unit tests containing known address/prefix cases and edge cases before UI integration.

### Task 7.2 — Subnetting learning tools

Components:
- `BinaryConverter`
- `IPv4Visualizer`
- `SubnetVisualizer`
- `SubnetCalculator`
- `SubnetPractice`

The calculator must explain calculation steps; it must not function only as an answer oracle.

### Task 7.3 — Path 2 content

Author and review Path 2 against the IPv4 library.

---

## Sprint 8 — Switching, VLAN & Routing Fundamentals

### Task 8.1 — Logical simulation model

Create typed primitives:
- device
- interface
- link
- IPv4 interface configuration
- subnet
- VLAN
- route

Provide deterministic reachability evaluation for supported beginner scenarios.

### Task 8.2 — Switching/VLAN interactions

- ARP visualizer
- MAC learning visualization
- VLAN membership builder
- access/trunk concept interaction

### Task 8.3 — Routing interactions and content

- route table view
- static/default route practice
- two-subnet reachability scenario

---

## Sprint 9 — Services, Wireless & Troubleshooting

### Task 9.1 — Network services visualizers

- DHCP DORA
- DNS query flow
- NAT/PAT translation visual
- ICMP/ping flow

### Task 9.2 — Terminal simulator

Supported commands are interpreted by the simulation, not executed by the server shell.

Initial command set:
- `ipconfig`
- `ip`
- `ping`
- `arp`
- `traceroute` / `tracert`
- `route`
- `nslookup`
- `dig`
- `netstat`

- [ ] Parse only supported syntax.
- [ ] Return deterministic simulated output.
- [ ] Reject unsupported commands safely.
- [ ] Never pass learner input into `exec`, shell, SSH, Docker socket, or host OS commands.

### Task 9.3 — Wireless and troubleshooting content

Author Path 5 and integrate scenario-driven troubleshooting.

---

# Milestone 5 — Labs & Challenges

## Sprint 10 — Lab Engine

### Lab contract

A Lab contains:
- metadata
- difficulty
- instructions
- initial state
- permitted interactions
- deterministic evaluator
- hint policy
- success criteria
- XP rule

### Task 10.1 — Lab persistence and attempts

- [ ] Define lab/attempt schema.
- [ ] Support start/reset/retry/submit.
- [ ] Store final evaluation.
- [ ] Prevent XP abuse through repeated submission.
- [ ] Test.

### Task 10.2 — Initial labs

Ship representative labs for:
- subnetting
- IP configuration
- packet flow
- VLAN
- routing
- DHCP/DNS
- troubleshooting

---

## Sprint 11 — Challenge Engine

### Challenge contract

A Challenge differs from a Lab by hiding the resolution path and emphasizing diagnosis.

- [ ] Define scenario evidence.
- [ ] Support multiple diagnostic actions.
- [ ] Track attempt actions required for scoring where configured.
- [ ] Reveal explanation only under configured completion/abandon rules.
- [ ] Add difficulty.
- [ ] Seed beginner/intermediate challenges.
- [ ] E2E test one complete challenge.

---

# Milestone 6 — IT Consultant Mode

## Sprint 12 — Case & Procurement Engine

### Task 12.1 — Consultant case model

Case data must support:
- client narrative
- explicit requirements
- hidden scoring requirements
- budget
- current/future device counts
- site constraints
- permitted catalog

### Task 12.2 — Internal device catalog

Use fictional product names with realistic capabilities.

Core attributes should support:
- category
- price
- port count
- port speed
- managed/unmanaged
- VLAN capability
- PoE/PoE+
- uplink capability
- rackmount
- wireless properties where relevant
- capacity metadata required by scoring

### Task 12.3 — Procurement & BoQ

- [ ] Select quantities.
- [ ] Calculate cost server-side/shared trusted logic.
- [ ] Validate budget.
- [ ] Validate minimum capacity.
- [ ] Evaluate spare capacity/future growth.
- [ ] Persist submission.
- [ ] Test cases where the most expensive device is intentionally not the best answer.

Seed:
- Small Office
- Warnet
- Medium Office

---

## Sprint 13 — Topology, IP/VLAN Planning & Scoring

### Task 13.1 — Topology builder

Use React Flow for the editor if it still satisfies current project requirements.

Rules:
- only permitted devices are available
- user can add/connect/remove allowed nodes/edges
- topology persists
- validation is based on graph data, not pixel position
- dragging has an accessible alternative where practical

### Task 13.2 — IP/VLAN planner

- [ ] Define subnet/VLAN tables.
- [ ] Reuse IPv4 domain library from Sprint 7.
- [ ] Validate host capacity and overlap.
- [ ] Validate gateway/subnet consistency.
- [ ] Validate required segmentation.

### Task 13.3 — Composite scoring

Output subscores:

```text
Technical Correctness
Requirement Fulfillment
Cost Efficiency
Scalability
Security
```

Scoring must be deterministic and explainable. Do not make an LLM the sole judge of technical correctness.

---

## Sprint 14 — Consultant Portfolio & Advanced Cases

### Task 14.1 — Final project report view

Show:
- requirement analysis
- selected devices
- BoQ
- topology
- IP plan
- VLAN plan
- security notes
- score
- feedback

### Task 14.2 — Portfolio

- [ ] Save completed consultant projects.
- [ ] Display them in profile.
- [ ] Preserve case/version metadata so future rubric changes do not silently rewrite historical results.

### Task 14.3 — Advanced MVP cases

Seed:
- School
- Multi-Floor Company

---

# Milestone 7 — Production Readiness

## Sprint 15 — Quality, Security & Deployment

### Required verification

- [ ] Full lint/type-check/test/build clean.
- [ ] Critical-path E2E: auth → lesson → progress → lab/challenge → consultant submission.
- [ ] Review authentication/session configuration.
- [ ] Review authorization on all write operations.
- [ ] Review input validation.
- [ ] Review rate-sensitive endpoints.
- [ ] Verify security headers.
- [ ] Verify secrets are absent from repository/history.
- [ ] Verify production database is not publicly exposed.
- [ ] Test database backup.
- [ ] Test restore into a disposable database.
- [ ] Build production Docker image.
- [ ] Configure Caddy.
- [ ] Document Cloudflare DNS/proxy settings.
- [ ] Deploy staging.
- [ ] Run smoke tests.
- [ ] Deploy production to `netloka.biz.id`.

---

## Sprint 16 — MVP Stabilization

- [ ] Triage launch issues by severity.
- [ ] Fix critical/high issues before feature work.
- [ ] Profile slow routes and database queries.
- [ ] Review content errors reported by learners.
- [ ] Add privacy-conscious product analytics/event tracking.
- [ ] Measure lesson start/completion/drop-off.
- [ ] Create technical debt register.
- [ ] Update `ROADMAP.md` using observed usage.
- [ ] Decide which post-MVP path deserves the next milestone.

---

# 2. Sprint Execution Protocol

At the beginning of every sprint:

1. Read `AGENTS.md`.
2. Read `ROADMAP.md`.
3. Read the active sprint section in `PLAN.md`.
4. Read the most recent relevant entries in `CHANGELOG.md`.
5. Inspect repository state: `git status`, recent commits, open PRs/issues when relevant.
6. Review the last completed sprint/milestone before starting dependent work.
7. Identify active acceptance criteria.
8. Work task-by-task using tests as the primary correctness gate.

At the end of every sprint:

1. Run the complete relevant verification suite.
2. Review the diff against the sprint requirements.
3. Fix all critical/high-severity findings.
4. Update `PLAN.md` checkbox/status information.
5. Update `ROADMAP.md` status if milestone/sprint state changed.
6. Append `CHANGELOG.md` entries in WITA.
7. Commit documentation with the implementation or in a dedicated documentation commit.
8. Push to GitHub.
9. Create/update PR and include test evidence.
10. Do not mark the sprint complete until the review gate is satisfied.

---

# 3. Change Management

A roadmap change is required when:

- a milestone is added/removed
- sprint boundaries materially change
- MVP scope expands/contracts
- a future path is promoted into MVP
- architecture changes from modular monolith
- a real runtime lab/VM/container approach is introduced

A normal `PLAN.md` update is sufficient when:

- a task is decomposed further
- file paths are adjusted to match the real repository
- testing details improve
- implementation order changes without altering roadmap scope

Every such change must also be recorded in `CHANGELOG.md`.

---

# 4. Planning Quality Rules

- No `TBD`, `TODO`, or vague “implement later” entries for the active sprint.
- A task must have testable acceptance behavior.
- Prefer small focused domain modules over large utility files.
- Do not duplicate networking calculation logic in UI components.
- Keep technical correctness in deterministic domain logic.
- Do not hardcode lesson content directly into route components.
- Do not introduce a dependency only because it is popular; record consequential architectural choices in `docs/decisions/`.
- Preserve backward compatibility for persisted lesson/case data through explicit schema/content versions.
