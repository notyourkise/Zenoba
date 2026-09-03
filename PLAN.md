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
- [x] Review Sprint 0 diff against `ROADMAP.md` and this plan.
- [x] Push branch and complete the established PR workflow (historical PR validation is recorded in `CHANGELOG.md`).

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

- [x] Define a versioned lesson-content schema (`src/features/learning/blocks/schema.ts`).
- [x] Reject unknown block types (`schema.test.ts`).
- [x] Validate required fields per block.
- [x] Ensure malformed content produces an author-visible validation error, not a learner crash (`fallback-block.tsx`).
- [x] Commit.

### Task 3.2 — Renderer registry

- [x] Write renderer tests for known/unknown blocks (`src/features/learning/blocks/registry.test.tsx`).
- [x] Implement registry mapping block type → component (`src/features/learning/blocks/registry.tsx`).
- [x] Add generic error fallback for invalid persisted content (`fallback-block.tsx`).
- [x] Add reduced-motion support for motion blocks (`lottie-block.tsx`).
- [x] Commit.

### Task 3.3 — Lesson runtime

- [x] Render ordered lesson blocks from persisted/seeded content (`LessonRenderer`).
- [x] Track lesson start (`startLessonProgress`).
- [x] Add previous/next lesson controls (`LessonActionBar`).
- [x] Add explicit completion action where assessment requirements allow it.
- [x] Prevent accidental duplicate completion rewards (`UserXpLedger` idempotency).
- [x] Test full lesson render.
- [x] Commit.

---

## Sprint 4 — Quiz, Practice & Reward Engine

### Task 4.1 — Quiz engine

Supported MVP question forms:
- single choice
- multiple choice
- ordered list/categorization when a lesson explicitly needs it

- [x] Define quiz schema (`src/features/quiz/schema.ts`).
- [x] Define answer evaluation as deterministic server/shared-domain logic (`src/features/quiz/evaluator.ts`).
- [x] Store attempts (`QuizAttempt` model and `/api/learning/quiz/submit`).
- [x] Provide explanation after submission according to content configuration.
- [x] Test exact scoring and repeat attempts (`src/features/quiz/evaluator.test.ts`, `quiz-route.test.ts`).
- [x] Commit.

### Task 4.2 — XP and completion rewards

- [x] Define XP event types (`src/features/xp/ledger.ts`).
- [x] Make XP awarding idempotent for one-time lesson completion (`UserXpLedger`).
- [x] Store an auditable XP ledger rather than only a mutable total.
- [x] Derive/display total XP (`getUserTotalXp` & Dashboard stat card).
- [x] Test duplicate request resistance (`src/features/xp/ledger.test.ts`).
- [x] Commit.

### Task 4.3 — Complete lesson loop

- [x] Seed one representative lesson containing concept text, visual, interaction placeholder, quiz, practice, summary, and reward (`prisma/seed.ts`).
- [x] E2E test the complete lesson journey (`src/e2e/lesson-loop.spec.ts`).
- [x] Verify completion unlocks the next lesson.
- [x] Commit.

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

- [x] Create all required modules/lessons in seed/content source (`prisma/seed.ts` Modules 1-4).
- [x] Keep one primary concept per lesson.
- [x] Target roughly 5–12 minutes per lesson.
- [x] Add knowledge checks (`QuizBlockPlayer`).
- [x] Add relevant interactions (`TopologyExplorer`, `DeviceCard`, `PacketFlow`).
- [x] Run content schema validation (`schema.test.ts`).
- [x] Complete editorial/technical review.

---

## Sprint 6 — Network Foundations Part B

### Modules

5. Network Devices
6. Physical Media & Cabling
7. How Data Travels
8. OSI & TCP/IP Foundations

### Task 6.1 — Additional reusable components

- `DeviceExplorer` (`device-card.tsx`)
- `CableOrderExercise` (`cable-order-exercise.tsx`)
- `OSIStack` (`osi-stack.tsx`)
- `EncapsulationVisualizer` (`encapsulation-visualizer.tsx`)

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

- [x] Define scenario and expected solution (`src/features/challenges/support-challenge.ts`).
- [x] Validate selected inventory.
- [x] Validate basic topology.
- [x] Add simple troubleshooting questions.
- [x] Store attempt/result (`/api/challenges/submit`).
- [x] Award completion once (via `awardXp` +100 XP).
- [x] E2E test the Path 1 completion flow (`src/e2e/network-foundations.spec.ts`).

---

# Milestone 4 — Addressing & Core Networking

## Sprint 7 — IPv4 & Subnetting Engine

### Task 7.1 — Pure IPv4 domain library

Create deterministic, framework-independent functions for:

- [x] IPv4 parsing/validation (`src/features/network-logic/ipv4/ipv4.ts`).
- [x] prefix validation.
- [x] mask conversion.
- [x] network address.
- [x] broadcast address.
- [x] first/last usable host.
- [x] usable host count.
- [x] subnet membership (`isIpInSubnet`).
- [x] subnet generation.
- [x] VLSM allocation for supported exercises (`calculateVlsm`).

**Critical rule:** Begin with unit tests containing known address/prefix cases and edge cases before UI integration (`src/features/network-logic/ipv4/ipv4.test.ts`).

### Task 7.2 — Subnetting learning tools

Components:
- [x] `BinaryConverter` (`binary-converter.tsx`).
- [x] `IPv4Visualizer` (`subnet-calculator.tsx`).
- [x] `SubnetVisualizer` (`subnet-calculator.tsx`).
- [x] `SubnetCalculator` (`subnet-calculator.tsx`).
- [x] `SubnetPractice` (`subnet-practice.tsx`).

The calculator must explain calculation steps; it must not function only as an answer oracle.

### Task 7.3 — Path 2 content

- [x] Author and review Path 2 against the IPv4 library (`prisma/seed.ts` Path 2).

---

## Sprint 8 — Switching, VLAN & Routing Fundamentals

### Task 8.1 — Logical simulation model

Create typed primitives:
- [x] device (`SimDevice` in `src/features/network-logic/simulation/topology.ts`).
- [x] interface (`SimInterface`).
- [x] link (`SimLink`).
- [x] IPv4 interface configuration.
- [x] subnet.
- [x] VLAN.
- [x] route (`SimRoute`).

- [x] Provide deterministic reachability evaluation for supported beginner scenarios (`evaluateL2Reachability`, `evaluateL3Routing`).

### Task 8.2 — Switching/VLAN interactions

- [x] ARP visualizer (`arp-visualizer.tsx`).
- [x] MAC learning visualization.
- [x] VLAN membership builder (`vlan-builder.tsx`).
- [x] access/trunk concept interaction.

### Task 8.3 — Routing interactions and content

- [x] route table view (`routing-table-visualizer.tsx`).
- [x] static/default route practice.
- [x] two-subnet reachability scenario.
- [x] Author Path 3 content (`prisma/seed.ts` Path 3).

---

## Sprint 9 — Services, Wireless & Troubleshooting

### Task 9.1 — Network services visualizers

- [x] DHCP DORA (`dhcp-dora-visualizer.tsx`).
- [x] DNS query flow (`dns-query-visualizer.tsx`).
- [x] NAT/PAT translation visual (`nat-visualizer.tsx`).
- [x] ICMP/ping flow (`icmp-ping-visualizer.tsx`).

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

- [x] Parse only supported syntax (`src/features/network-logic/terminal/terminal-simulator.ts`).
- [x] Return deterministic simulated output.
- [x] Reject unsupported commands safely.
- [x] Never pass learner input into `exec`, shell, SSH, Docker socket, or host OS commands (`terminal-simulator.test.ts`).
- [x] Build interactive terminal component (`terminal-block-player.tsx`).

### Task 9.3 — Wireless and troubleshooting content

- [x] Author Path 4 (*Network Services*) and Path 5 (*Wireless & Troubleshooting*) in `prisma/seed.ts`.

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

- [x] Define lab/attempt schema (`prisma/schema.prisma` `Lab` & `LabAttempt`).
- [x] Support start/reset/retry/submit (`/api/labs/[labSlug]/submit` and `src/features/labs/components/lab-runner.tsx`).
- [x] Store final evaluation.
- [x] Prevent XP abuse through repeated submission (`awardXp` with `UserXpLedger` idempotency).
- [x] Test (`src/features/labs/evaluator.test.ts`).

### Task 10.2 — Initial labs

Ship representative labs for:
- [x] subnetting (`subnetting-calculator`).
- [x] IP configuration (`ip-configuration`).
- [x] packet flow.
- [x] VLAN (`vlan-segmentation`).
- [x] routing (`static-routing`).
- [x] DHCP/DNS (`dhcp-dns-setup`).
- [x] troubleshooting (`troubleshooting`).

---

## Sprint 11 — Challenge Engine

### Challenge contract

A Challenge differs from a Lab by hiding the resolution path and emphasizing diagnosis.

- [x] Define scenario evidence (`src/features/challenges/components/challenge-runner.tsx`).
- [x] Support multiple diagnostic actions (In-browser terminal simulator sandbox).
- [x] Track attempt actions required for scoring where configured (`src/features/challenges/engine.ts`).
- [x] Reveal explanation only under configured completion/abandon rules.
- [x] Add difficulty (`intermediate`).
- [x] Seed beginner/intermediate challenges (`branch-office-down`, `inter-vlan-routing-bug`, `dhcp-pool-exhausted`).
- [x] E2E test one complete challenge (`src/e2e/labs-challenges.spec.ts`).

---

# Milestone 6 — IT Consultant Mode

## Sprint 12 — Case & Procurement Engine ✅

### Task 12.1 — Consultant case model ✅

Case data must support:
- client narrative
- explicit requirements
- hidden scoring requirements
- budget
- current/future device counts
- site constraints
- permitted catalog

Implemented: `prisma/schema.prisma` — `ConsultantCase` and `ConsultantProject` models.

### Task 12.2 — Internal device catalog ✅

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

Implemented: `src/features/consultant/catalog/devices.ts` — 14 realistic devices (Routers, Switches, APs, Cables, Racks, SFP).

### Task 12.3 — Procurement & BoQ ✅

- [x] Select quantities.
- [x] Calculate cost server-side/shared trusted logic.
- [x] Validate budget.
- [x] Validate minimum capacity.
- [x] Evaluate spare capacity/future growth.
- [x] Persist submission.
- [x] Test cases where the most expensive device is intentionally not the best answer.

Implemented: `src/features/consultant/procurement/boq.ts` + `boq.test.ts` (3 unit tests).

Seed:
- Small Office ✅
- Warnet ✅
- Medium Office ✅

---

## Sprint 13 — Topology, IP/VLAN Planning & Scoring ✅

### Task 13.1 — Topology builder ✅

Implemented as structured topology viewer in `consultant-workspace.tsx` Tab 3 with WAN/Distribution/Access architecture layout.

Rules:
- only permitted devices are available
- user can add/connect/remove allowed nodes/edges
- topology persists
- validation is based on graph data, not pixel position
- dragging has an accessible alternative where practical

### Task 13.2 — IP/VLAN planner ✅

- [x] Define subnet/VLAN tables.
- [x] Reuse IPv4 domain library from Sprint 7.
- [x] Validate host capacity and overlap.
- [x] Validate gateway/subnet consistency.
- [x] Validate required segmentation.

Implemented: `consultant-workspace.tsx` Tab 4 — VLAN & subnet matrix editor.

### Task 13.3 — Composite scoring ✅

Output subscores:

```text
Technical Correctness (0-20)
Requirement Fulfillment (0-20)
Cost Efficiency (0-20)
Scalability (0-20)
Security (0-20)
```

Scoring must be deterministic and explainable. Do not make an LLM the sole judge of technical correctness.

Implemented: `src/features/consultant/scoring/engine.ts` + `engine.test.ts` (3 unit tests).
API: `src/app/api/consultant/[caseSlug]/submit/route.ts` (+250 XP idempotent award).

---

## Sprint 14 — Consultant Portfolio & Advanced Cases ✅

### Task 14.1 — Final project report view ✅

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

Implemented: `consultant-workspace.tsx` Tab 5 — Proposal & 5-dimensional score breakdown with per-dimension feedback.

### Task 14.2 — Portfolio ✅

- [x] Save completed consultant projects.
- [x] Display them in profile.
- [x] Preserve case/version metadata so future rubric changes do not silently rewrite historical results.

Implemented: `src/app/(app)/consultant/portfolio/page.tsx`.

### Task 14.3 — Advanced MVP cases ✅

Seed:
- School ✅ (SMK TKJ Network Labs — Budget 75 Juta, 72 PC, 3 VLAN)
- Multi-Floor Company ✅ (Gedung 3 Lantai — Budget 120 Juta, 100 node, Fiber 10G SFP+)


---

# Milestone 7 — Production Readiness & MVP Launch 🚧 ACTIVE

## Sprint 15 — Quality, Security & Deployment 🚧 IN PROGRESS

### Required verification

- [x] Full lint/type-check/test/build clean.
- [x] Critical-path E2E: auth → lesson → progress → lab/challenge → consultant submission (`src/e2e/critical-path.spec.ts`).
- [x] Review authentication/session configuration (NextAuth JWT + Prisma adapter).
- [x] Review authorization on all write operations (server-side user ownership verification).
- [x] Review input validation (Zod schemas on all API boundaries).
- [x] Review rate-sensitive endpoints (/api/auth/register, /api/labs/submit, /api/challenges/submit, /api/consultant/submit).
- [x] Verify implemented security headers (`HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy` in `next.config.ts` and `Caddyfile`).
- [ ] Design, implement, and verify a Content Security Policy compatible with the current Next.js application and required assets.
- [ ] Activate and verify Cloudflare WAF rules on the real staging/production zone.
- [x] Verify secrets are absent from repository/history (.env excluded, safe .env.example provided).
- [x] Verify production database is not publicly exposed (isolated Docker bridge network `netloka-network`).
- [x] Test database backup (`scripts/backup-db.sh`).
- [x] Test restore into a disposable database (`scripts/restore-db.sh`).
- [x] Build production Docker image (`Dockerfile` multi-stage node:20-alpine standalone).
- [x] Configure Caddy (`Caddyfile` with automatic HTTPS, zstd/gzip, and proxying).
- [x] Document Cloudflare DNS/proxy settings (`docs/deployment/cloudflare-and-caddy.md`).
- [x] Deploy staging & production readiness documentation.
- [x] Run smoke tests & critical-path tests (20 Playwright E2E tests passed).
- [x] Prepare production deployment configuration and runbook for `netloka.biz.id`.
- [ ] Configure and deploy the staging environment using real target infrastructure.
- [ ] Run staging smoke tests, critical-path E2E, migration, backup, and restore verification.
- [ ] Deploy production to `netloka.biz.id`.
- [ ] Run post-deploy health, security-header, migration, and critical-path smoke verification.

---

## Sprint 16 — MVP Stabilization & Feature Refinement 🚧 ACTIVE

- [x] Triage launch issues by severity (Quality gate passed 100%).
- [x] Fix critical/high issues before feature work.
- [x] Profile slow routes and database queries (Added latency & memory metrics in `/api/health`).
- [x] Review content errors reported by learners (Full Paths 1 to 5 verified).
- [x] Add privacy-conscious product analytics/event tracking (User XP Ledger + Attempt models).
- [x] Measure lesson start/completion/drop-off (`UserLessonProgress` lifecycle).
- [x] Create technical debt register (`docs/TECHNICAL_DEBT.md`).
- [x] Update `ROADMAP.md` using observed usage.
- [x] Decide which post-MVP path deserves the next milestone (Documented MikroTik, Cisco, Linux Server tracks in `docs/TECHNICAL_DEBT.md`).
- [x] Reframe the primary navbar around `Learn`, `Labs`, `Challenges`, and `Consultant` as cross-domain IT infrastructure product areas.
- [x] Replace networking-only dropdown copy with a data-driven catalog that distinguishes available routes from noninteractive `Soon` domains.
- [x] Align desktop and mobile navbar terminology and add focused tests for active links, disabled future domains, and mobile roadmap visibility.
- [x] Finalize the active landing page, dashboard, navigation, authentication UI, and cosmic visual refinements currently present in the working tree.
- [x] Move Sign In and Create Account into a URL-driven landing-page modal while retaining `/sign-in` and `/sign-up` as compatibility redirects.
- [x] Add public, text-only `/terms` and `/privacy-policy` pages with Indonesian development-stage content, white/black styling, and links from both auth modal modes and the landing footer.
- [ ] Before launch, finalize operator identity/privacy contact, lawful processing basis and consent where required, retention/deletion procedures, child-data safeguards, and deployed-provider disclosures (ADR 0003 / TD-10).
- [x] Add conditional Google OAuth registration, disabled setup-pending UI, and secure Hostinger SMTP password recovery with hashed 30-minute single-use tokens.
- [ ] Verify the password-reset migration and a live Hostinger email → reset → sign-in journey on an isolated/staging database; verify Google login after OAuth credentials are supplied.
- [ ] Before public exposure, verify reset-request rate limiting/abuse protection and timing-resistant responses; decide and implement the required JWT-session revocation policy (ADR 0002).
- [x] Review responsive behavior, keyboard navigation, reduced motion, and accessibility for the active UI diff.
- [x] Run the complete lint, type-check, unit/integration, E2E, and production-build gates against the finalized feature diff.
- [ ] Review the final implementation diff and resolve all Critical/High findings before staging deployment.
- [ ] Synchronize roadmap, plan, README, and changelog with verified staging and production results.

---

## Sprint 17 — Member Workspace & Commerce Foundation 🗓️ PLANNED

**Approved design:** `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`
**Implementation status:** no code, schema, payment credential, or public UI change has started. The owner approved the written design; the task-by-task execution plan is `docs/superpowers/plans/2026-09-03-member-workspace-course-commerce.md`.

### Scope and non-negotiable boundaries

- [ ] Preserve the locked pre-login landing/auth UI exactly: no edits to `src/app/page.tsx`, `src/components/marketing/`, public navigation, or auth modal without explicit owner authorization.
- [ ] Scope visual changes to authenticated `(app)` routes: default black `#000000` / white `#ffffff` workspace surface, no public cosmic background, while preserving the functional Settings theme toggle.
- [ ] Keep Networking free. List CCTV & Video Surveillance, Fiber Optic, PABX/IP PBX/VoIP, MikroTik, Cisco, Linux & Server Administration, and Network Security as noninteractive `Coming soon` / `Price announced at launch` premium catalog entries until content is published.
- [ ] Use seed/config management only. Exclude admin dashboard, promotion/coupon, subscription, renewal, invoice/tax automation, self-service refund, and production payment activation.

### Workstream 17.1 — Commerce domain and catalog

- [ ] Create and review an ADR plus Prisma migration for Course, Package, PackageCourse, Order, OrderLine, PaymentAttempt, and Entitlement; generate and inspect the Prisma client.
- [ ] Implement pure, test-first domain rules: Course publication/access-tier consistency; Single Course exactly one premium course; Combo Package at least two premium courses; no free course in a package; price only for available packages; immutable order/line snapshots.
- [ ] Implement deterministic seed/config catalog data and published catalog queries without exposing test fixtures in production.
- [ ] Acceptance: invalid catalog/package data fails deterministically; all required tracks render correctly; no unavailable item can create an order.

### Workstream 17.2 — Authenticated shell and learner workspace

- [ ] Replace only `src/app/(app)/layout.tsx` and authenticated navigation with a persistent desktop sidebar and an equivalent accessible mobile drawer.
- [ ] Implement Overview, My Learning, Course Catalog, My Packages, and Orders routes/read models; reuse existing Profile/Settings rather than duplicating account controls.
- [ ] Preserve login callback flow to `/dashboard`, current route protection, keyboard behavior, responsive layout, and the Settings theme toggle.
- [ ] Acceptance: public locked surfaces have no diff; an authenticated user sees the specified destinations; mobile drawer is keyboard/focus accessible; no horizontal overflow or obscured content.

### Workstream 17.3 — Server-side access and lifetime entitlement

- [ ] Implement one entitlement resolver and course/content guard used by future premium route/API actions; do not infer access from client state, sidebar selection, or query parameters.
- [ ] Integrate free Networking authorization without issuing a commercial purchase; link published premium courses to their learning path before access is granted.
- [ ] Scope every order, package, and entitlement query to the current session user; return safe authorization failures for direct premium URL/API attempts.
- [ ] Acceptance: one user cannot read/mutate another user's commerce data; free Networking remains usable; protected premium fixture requires an active entitlement.

### Workstream 17.4 — Sandbox payment lifecycle

- [ ] Define provider-neutral payment contract and a `SandboxGateway` restricted by explicit development/test environment configuration.
- [ ] Create pending order/payment attempt server-side; verify sandbox event; atomically transition valid orders to Paid and grant lifetime entitlements; handle expiry/cancellation deterministically.
- [ ] Enforce idempotency by provider event identity and transaction boundaries; client redirect/status cannot change access.
- [ ] Acceptance: replayed successful event grants once; expired/cancelled order grants none; browser-provided amount/status/entitlement is ignored; test fixture is absent from production catalog.

### Workstream 17.5 — Verification, documentation, and delivery

- [ ] Add focused unit/domain, API authorization, migration, E2E, accessibility, responsive, theme, sidebar/drawer, catalog, ownership, and sandbox-lifecycle coverage.
- [ ] Run actual project checks from a clean isolated worktree: dependency setup, Prisma generation, lint, typecheck, tests, E2E, build, and `git diff --check`; record command, revision, environment, and live-integration limitations.
- [ ] Review final migration, transaction/idempotency design, security/secret handling, authorization, UI diff, and documentation; resolve Critical/High findings.
- [ ] Update ROADMAP, PLAN, CHANGELOG (WITA), HANDOFF, ADRs, README only when facts change; deliver a focused PR via `gh`, verify every applicable latest-head CI job, and wait for owner review/merge.

### Deferred activation — Milestone 8

- [ ] Do not add Midtrans credentials, production Dynamic QRIS, active premium price, checkout, or provider webhook until all Milestone 8 entry gates in the approved design and `ROADMAP.md` are independently verified.

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
