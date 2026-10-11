# Zenoba Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use a task-by-task implementation workflow with review gates. Steps in this plan use checkbox (`- [ ]`) syntax for tracking. Do not implement a later sprint merely because it is interesting; follow the active sprint unless a dependency fix is required.

**Goal:** Build Zenoba as an interactive beginner-to-practical networking learning platform with Learn, Labs, Challenges, and IT Consultant simulation.

**Architecture:** Zenoba starts as a modular Next.js monolith backed by PostgreSQL. Learning content is represented as typed data and reusable lesson blocks rather than one custom React page per lesson. Networking practice uses deterministic logical simulation instead of arbitrary code execution or real virtual machines.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide, PostgreSQL, Prisma, React Flow, Lottie, Docker, Caddy, Cloudflare, GitHub Actions, Git/GitHub CLI.

**Spec:** `ROADMAP.md`

**Current planning checkpoint (2026-09-19):** Milestones 0–15 are fully completed and verified. Milestone 15 (Final Production and Commercial Release, Sprints 40–42) is complete with Sprint 40 (Persistent Security), Sprint 41 (Staging & Recovery), and Sprint 42 (Midtrans Gateway & Controlled Activation) signed off. Production launch formally authorized by owner on 2026-09-19: Option 1 Phased Public Launch releasing the complete 6-path Networking curriculum 100% free of charge with commercial payment processing held off (`PAYMENT_MODE="disabled"`).

**Evidence correction:** Historical checked tasks remain delivery history, not proof of current deployment. The `a95b025` inspection found 5 paths/13 modules/15 lessons and non-authoritative completion; merged PR #27–#39 subsequently repaired assessment/progression. A current source-registry recount verifies 6 paths/31 modules/65 lessons/195 formative quizzes/6 capstones. A complete fresh-database baseline now exists and CI applies it with `db:deploy`; retained-database upgrade rehearsal and staging/production remain unverified.

## Approved Upcoming Work — Zenoba Rebrand

- SMTP follow-up (2026-10-12): credentials configured privately and eligible local account confirmed, but both 465/587 TCP connections time out before authentication. Owner deferred local SMTP testing to a separately authorized VPS release; authentication and delivery remain UNVERIFIED, not passed. No reset email has been sent; do not put credentials in Git.
- Publication authorized by owner (2026-10-12): review complete branch, run relevant local checks, push and create one PR to main, inspect applicable CI without weakening it. Owner retains review/merge authority. No folder move or VPS/domain action before the separate gates. Final review also restores generic backup/restore defaults/prefixes to the retained legacy stack and verifies scripts against Docker test doubles, not a real database.

- Final-review fixes approved by owner (2026-10-12), local only: preserve legacy production resource/database/origin identifiers in both production manifests; align support with `founder@zenoba.tech` and staging sender examples with `hello@zenoba.tech`; correct the `.tech` DNS lesson; remove the corporation claim; read legacy browser preferences as fallback without overwriting new preferences; reconcile current documentation and narrowly classify legacy references. No VPS, domain, database migration, GitHub publication, or folder move. Acceptance: focused regression tests, lint/typecheck, Compose configuration validation, and diff review. WebKit and long-running release gates remain deferred.

- Status: **in progress; Application Identity Tasks 1–4 are locally implemented and verified. Zenoba is running locally through Docker and the focused smoke checks are green. At the owner's direction, WebKit and other long-running E2E investigation are deferred from this rebrand scope. Release, PR, merge, local-folder transition, and separately authorized domain migration remain pending.**
- Latest approved refinement: `/about` opens with paired Visi/Misi cards without eyebrow labels. History uses only Mercury, Saturnus, and Jupiter, retaining the homepage planet textures, Saturn rings, star-field, and luminous path style with a shortened three-stop winding route. Planet names and chapter headings/dates remain visible. The homepage ends directly with the footer after FAQ.
- History interaction refinement: three chapters tell the owner's origin story (information overload and unclear starting points), Netloka's independent May 2026 founding, and the fresh Zenoba identity in October 2026. Short descriptions appear in the actual IT Journey pop-up component above desktop planets, with planet name, chapter title, and `Tutup`; mobile uses the same pop-up inline. Hover/focus reveals details, tap/click toggles, and Escape or `Tutup` dismisses them. Preserve homepage behavior; verify focused component tests, lint/typecheck, and local Docker/browser smoke only.
- Legal copy refinement: simplify Privacy Policy into general user-facing language while retaining data categories/purposes, cookies, third-party providers, storage, privacy rights, child-consent limitations, and individual controller identity. Remove internal implementation details and the blanket 30-day response claim. Route privacy/security/operational/account/Terms inquiries to `founder@zenoba.tech`. Public contact copy only: no mailbox provisioning, SMTP sender changes, consent-flow implementation, or claim of legal certification. Verify mailto destinations, copy consistency, lint/typecheck, and local Docker responses.
- Design: `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`
- Tab-icon refinement: use the owner-selected `zenoba-symbol-white.png` for the browser tab only. Preserve navbar/footer logo, Apple touch app icon, source assets, and layout. Supersedes the prior browser app-icon choice; verify rebuilt local metadata and focused Chromium smoke.
- Logo assets: owner supplied six PNGs under `public/logos` and approved their use. Replace header/footer text wordmarks with the clean black horizontal asset, rendered white through CSS inversion on dark surfaces; keep original files unchanged (white variants have visible extraction artifacts). Register the supplied app icon in root metadata. Preserve layout, navigation, homepage content, auth, and external configuration; verify image loading, responsive fit, focused unit tests, lint/typecheck, Docker build, and local browser smoke. No asset regeneration or new dependency.
- About bottom-content removal: owner requested removing the entire pictured `Nilai dan produk` section and its bottom Home/Terms/Privacy navigation. About now ends with the three-planet history; shared header, homepage footer, legal routes, vision/mission, and history interactions remain unchanged. This supersedes the initial About bottom-link requirement. Verify focused About/Journey tests, lint/typecheck, Docker build, and local response; no long-running E2E/WebKit.
- Outgoing email refinement: owner selected the existing `hello@zenoba.tech` mailbox for transactional sending; `founder@zenoba.tech` remains incoming customer support only. Update example/local/legacy production Compose sender defaults, preserve configurable sender and reset behavior, and apply only local Compose settings. SMTP password, actual delivery, external staging/production environments, and DNS/VPS remain unverified or separately authorized. Acceptance: local sender/user are hello, founder legal contacts unchanged, focused reset/contact tests pass; no real email sent.
- Application/local identity plan: `docs/superpowers/plans/2026-10-11-zenoba-application-identity-rebrand.md`
- Domain cutover plan: `docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`
- Scope boundary: preserve the homepage structure and production database/volume/network/backup/VPS-root identifiers during the first cutover. External DNS, OAuth, email, and VPS mutations require separate contemporaneous authorization.

## Global Constraints

- Primary production domain is `zenoba.tech`.
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
zenoba/
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

# Milestone 7 — Production Readiness Foundation — IMPLEMENTED BASELINE / LIVE RELEASE DEFERRED TO M15

## Sprint 15 — Quality, Security & Deployment — IMPLEMENTED BASELINE / EXTERNAL VERIFICATION DEFERRED

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
- [x] Verify production database is not publicly exposed (isolated Docker bridge network `zenoba-network`).
- [x] Test database backup (`scripts/backup-db.sh`).
- [x] Test restore into a disposable database (`scripts/restore-db.sh`).
- [x] Build production Docker image (`Dockerfile` multi-stage node:20-alpine standalone).
- [x] Configure Caddy (`Caddyfile` with automatic HTTPS, zstd/gzip, and proxying).
- [x] Document Cloudflare DNS/proxy settings (`docs/deployment/cloudflare-and-caddy.md`).
- [x] Deploy staging & production readiness documentation.
- [x] Run smoke tests & critical-path tests (20 Playwright E2E tests passed).
- [x] Prepare production deployment configuration and runbook for `zenoba.tech`.
- [ ] Configure and deploy the staging environment using real target infrastructure.
- [ ] Run staging smoke tests, critical-path E2E, migration, backup, and restore verification.
- [ ] Deploy production to `zenoba.tech`.
- [ ] Run post-deploy health, security-header, migration, and critical-path smoke verification.

---

## Sprint 16 — MVP Stabilization & Feature Refinement — IMPLEMENTED BASELINE / PRE-LAUNCH GATES DEFERRED

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

## Sprint 17 — Member Workspace & Commerce Foundation 🚀 IMPLEMENTED / MERGED

**Approved design:** `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`
**Task-by-task execution plan:** `docs/superpowers/plans/2026-09-03-member-workspace-course-commerce.md`
**Implementation status:** Full implementation across Tasks 1 through 9 completed and locally verified. All gates (ESLint, TypeScript, Vitest 218 tests, Playwright 37 E2E tests, and Next.js 31 routes build) passed.

### Scope and non-negotiable boundaries

- [x] Preserve the locked pre-login landing/auth UI exactly: no edits to `src/app/page.tsx`, `src/components/marketing/`, public navigation, or auth modal without explicit owner authorization.
- [x] Scope visual changes to authenticated `(app)` routes: default black `#000000` / white `#ffffff` workspace surface, no public cosmic background, while preserving the functional Settings theme toggle.
- [x] Keep Networking free. List CCTV & Video Surveillance, Fiber Optic, PABX/IP PBX/VoIP, MikroTik, Cisco, Linux & Server Administration, and Network Security as noninteractive `Coming soon` / `Price announced at launch` premium catalog entries until content is published.
- [x] Use seed/config management only. Exclude admin dashboard, promotion/coupon, subscription, renewal, invoice/tax automation, self-service refund, and production payment activation.

### Workstream 17.1 — Commerce domain and catalog

- [x] Create and review an ADR plus Prisma migration for Course, Package, PackageCourse, Order, OrderLine, PaymentAttempt, and Entitlement; generate and inspect the Prisma client.
- [x] Implement pure, test-first domain rules: Course publication/access-tier consistency; Single Course exactly one premium course; Combo Package at least two premium courses; no free course in a package; price only for available packages; immutable order/line snapshots.
- [x] Implement deterministic seed/config catalog data and published catalog queries without exposing test fixtures in production.
- [x] Acceptance: invalid catalog/package data fails deterministically; all required tracks render correctly; no unavailable item can create an order.

### Workstream 17.2 — Authenticated shell and learner workspace

- [x] Replace only `src/app/(app)/layout.tsx` and authenticated navigation with a persistent desktop sidebar and an equivalent accessible mobile drawer.
- [x] Implement Overview, My Learning, Course Catalog, My Packages, and Orders routes/read models; reuse existing Profile/Settings rather than duplicating account controls.
- [x] Preserve login callback flow to `/dashboard`, current route protection, keyboard behavior, responsive layout, and the Settings theme toggle.
- [x] Acceptance: public locked surfaces have no diff; an authenticated user sees the specified destinations; mobile drawer is keyboard/focus accessible; no horizontal overflow or obscured content.

### Workstream 17.3 — Server-side access and lifetime entitlement

- [x] Implement one entitlement resolver and course/content guard used by future premium route/API actions; do not infer access from client state, sidebar selection, or query parameters.
- [x] Integrate free Networking authorization without issuing a commercial purchase; link published premium courses to their learning path before access is granted.
- [x] Scope every order, package, and entitlement query to the current session user; return safe authorization failures for direct premium URL/API attempts.
- [x] Acceptance: one user cannot read/mutate another user's commerce data; free Networking remains usable; protected premium fixture requires an active entitlement.

### Workstream 17.4 — Sandbox payment lifecycle

- [x] Define provider-neutral payment contract and a `SandboxGateway` restricted by explicit development/test environment configuration.
- [x] Create pending order/payment attempt server-side; verify sandbox event; atomically transition valid orders to Paid and grant lifetime entitlements; handle expiry/cancellation deterministically.
- [x] Enforce idempotency by provider event identity and transaction boundaries; client redirect/status cannot change access.
- [x] Acceptance: replayed successful event grants once; expired/cancelled order grants none; browser-provided amount/status/entitlement is ignored; test fixture is absent from production catalog.

### Workstream 17.5 — Verification, documentation, and delivery

- [x] Add focused unit/domain, API authorization, migration, E2E, accessibility, responsive, theme, sidebar/drawer, catalog, ownership, and sandbox-lifecycle coverage.
- [x] Run actual project checks from a clean isolated worktree: dependency setup, Prisma generation, lint, typecheck, tests, E2E, build, and `git diff --check`; record command, revision, environment, and live-integration limitations.
- [x] Review final migration, transaction/idempotency design, security/secret handling, authorization, UI diff, and documentation; resolve Critical/High findings.
- [x] Update ROADMAP, PLAN, CHANGELOG (WITA), HANDOFF, ADRs, README only when facts change; deliver a focused PR via `gh`, verify every applicable latest-head CI job, and wait for owner review/merge.

### Deferred activation — Milestone 15 (reviewed in Milestone 12; historically former Milestone 8)

- [ ] Do not add Midtrans credentials, production Dynamic QRIS, active premium price, checkout, or provider webhook until Milestone 15 and every retained Milestone 12 entry gate are independently verified.

---

## Sprint 18 — Dashboard Distillation & Workspace Focus — MERGED

**Approved design:** `docs/superpowers/specs/2026-09-05-dashboard-distillation-design.md`
**Task-by-task execution plan:** `docs/superpowers/plans/2026-09-05-dashboard-distillation.md`
**Status:** Merged in PR #20; later UI revisions are recorded under Sprints 19–20. This is not the active implementation task.

### Scope and non-negotiable boundaries

- [x] Replace only the authenticated `/dashboard` marketing/card-heavy composition with a one-column, text-led learner workspace.
- [x] Keep the locked pre-login landing page, marketing components, public navigation, and auth modal unchanged.
- [x] Remove public-dashboard-only pillars, roadmap/UKK, platform highlights, FAQ, promotional footer, decorative icons, and repeated card grids from `/dashboard`; retain public material on the landing page.
- [x] Use existing user-scoped progress/path read models, retain all authorization behavior, and load independent reads concurrently after session resolution.
- [x] Cover active, zero-progress, and no-path states; add progress-bar semantics, keyboard/responsive/theme review, and no-public-regression verification.
- [x] Do not introduce a next-lesson resolver, database migration, API, new dependency, commerce change, payment behavior, or deployment work.

### Delivery sequence

- [x] Follow Tasks 1–4 in the approved plan: red focused tests → minimal dashboard refactor → state/accessibility/regression coverage → full review, quality gate, PR, CI, owner review, merge synchronization, and safe cleanup.
- [x] Do not mark Sprint 18 complete until application work is implemented, locally verified, CI-passed on its latest PR head, merged by Abangku, and main is synchronized. (Merged in PR #20).

---

## Sprint 19 — Cosmic Orbital Workspace UI Redesign (Merged in PR #21)

**Scope & Design Reference:** User-provided reference design screenshot (`media_1788549989073.png`)
**Goal:** Transform the authenticated learner dashboard and sidebar navigation into a deep cosmic, orbital-themed workspace matching the approved visual design.

### Scope and non-negotiable boundaries
- [x] Hero Banner: Photorealistic orbital Earth visual (`/images/dashboard-earth-banner.jpg`), atmospheric rim light, Zenoba orbital quote ("Better Networks Brighter Opportunities"), dynamic personalized welcome ("Dev Zenoba!"), and primary "Lanjutkan/Mulai Belajar" action button.
- [x] Quick Stats: 4 responsive metric cards (Total Kursus, Sedang Dipelajari, Selesai, and Streak Belajar with 3D glowing flame asset).
- [x] Progres & Aktivitas: Circular radial SVG donut meter (0% Selesai), text progress context, semantic horizontal progress bar, and 3 metric columns alongside "Lanjutkan dari Terakhir" card (empty & resume states).
- [x] Praktik & Eksplorasi: 3 featured action cards with custom flowing luminous wave SVG backgrounds (Interactive Labs, Troubleshooting Challenges, Simulasi Konsultan TI).
- [x] Sidebar Navigation: Categorized into "MENU UTAMA" and "EKSPLORASI" with active gradient pills, Lucide icons, and integrated profile card for both desktop and mobile drawer.
- [x] Test Coverage: Full unit test coverage in `src/app/(app)/dashboard/page.test.tsx` and `src/components/navigation/learner-workspace-shell.test.tsx`.
- [x] Verification: TypeScript typecheck, ESLint, full vitest suite (49 files, 235 tests), Playwright E2E tests, and Next.js production build passing 100%.

---

## Sprint 20 — Dashboard & Sidebar UI Polish — MERGED

**Scope & Reference:** User-requested refinement (image `media_1788557237327.png`)
**Goal:** Polish visual elements and animations on the cosmic dashboard and navigation:
- [x] Streak Flame Refinement: Eliminate dark square border around flame using radial gradient mask feathering (`[mask-image:radial-gradient(circle_at_center,black_42%,transparent_70%)]`), add ambient glow aura, add dynamic `@keyframes flame-flicker` animation for natural flame movement, and remove `"hari"` suffix from streak counter (display number only, retaining `aria-label` for screen readers).
- [x] Interactive Labs Icon: Switch icon from `FlaskConical` to CLI icon (`Terminal` / `>_`) in `LearnerSidebar`, `LearnerMobileDrawer`, and the Interactive Labs card.
- [x] Quote Positioning: Move Zenoba quote (*“Better Networks Brighter Opportunities” — ZENOBA*) from top-right to bottom-right of the hero banner, aligned with the bottom CTA and description row.
- [x] Animated Wave Lines: Implement flowing wave animations (`animate-wave-1`, `animate-wave-2`, `animate-wave-3`, `animate-wave-stream`) for the SVG wave lines in the 3 exploration cards (Interactive Labs, Troubleshooting Challenges, Simulasi Konsultan TI) with full `prefers-reduced-motion: reduce` fallback.
- [x] Test Coverage & Verification: Update unit tests for number-only streak assertion; all quality gates (typecheck, lint, vitest, E2E, build) green.

---

# Learning Curriculum Renewal and Approved Next Program — Milestones 8–15

Milestones 8–11 were implemented and merged through PR #27–#39; Sprint 33's entry-gate review merged in PR #40 and did not authorize payment activation. The owner-approved next direction adds isolated developer/internal roles and learner-quality work before all gateway, deployment, production, and live-payment tasks. Each sprint belongs to exactly one milestone.

Canonical detail: [program plan](docs/superpowers/plans/2026-09-05-learning-curriculum-renewal.md), [pilot tasks](docs/superpowers/plans/2026-09-05-welcome-to-networking.md), [design](docs/superpowers/specs/2026-09-05-learning-outcomes-and-curriculum-design.md), [outcome matrix](docs/curriculum/networking-outcomes.md).

## Milestone 8 — Learning Outcomes, Assessment Foundation & Welcome Pilot — COMPLETE / MERGED

**Goal:** Deliver Welcome to Networking as an owner-reviewed reference with explicit outcomes, accurate assessment, mandatory passing, retry, persistent evidence, and safe progression.

**Dependency:** Review existing M1/M2 learning/auth/progress and M7 merged baseline; local development does not wait for production deployment.

### Sprint 21 — Curriculum Contracts & Reproducible Data Foundation

**Exclusive owner:** M8. **Required context:** Spec §§2–6; current seed, block schema, Prisma schema/migrations, commerce ADR; M2 Sprint 3–4 history.

- [x] Task 21.1: Confirm exact assessment/legacy policy and author mapped pilot content.
- [x] Task 21.2: Reconcile migration history on disposable data; design additive versioned evidence storage.
- [x] Task 21.3: Extract pilot definitions; enforce public/private projection and evidence completeness.
- [x] Task 21.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Schema rejects incomplete outcomes; fresh and legacy DB fixtures preserve IDs; seed twice does not duplicate content.

### Sprint 22 — Authoritative Assessment, Progression & XP

**Exclusive owner:** M8. **Required context:** Sprint 21 contracts; quiz API/evaluator/player; progress/prerequisites; XP ledger and commerce access.

- [x] Task 22.1: Wire server-owned questions to real lesson identity and persist validated attempts.
- [x] Task 22.2: Enforce lesson and final-module gates, including direct API access and current-version evidence.
- [x] Task 22.3: Make evidence/progress/reward consistent under concurrency, retry, and storage failure.
- [x] Task 22.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Wrong nonempty answers fail; no direct completion bypass; duplicate events grant once; failed practical blocks module pass.

### Sprint 23 — Welcome Lessons & Module Assessment Experience

**Exclusive owner:** M8. **Required context:** Sprint 21 content and S22 services; outcome matrix P1-M1; current lesson/path UI, visualizers, PRODUCT/DESIGN.

- [x] Task 23.1: Render scoped objectives and ordered instructional stages without generic success fallback.
- [x] Task 23.2: Implement beginner-safe connectivity practice and server-evaluated scenario evidence.
- [x] Task 23.3: Deliver final module test, outcome feedback, retry, and correct next-stage navigation.
- [x] Task 23.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** All 8 lesson outcomes visibly taught/tested; keyboard/reduced-motion controls work; unresolved network request never shows success.

### Sprint 24 — Pilot Integration, Teaching Review & Reference Approval

**Exclusive owner:** M8. **Required context:** S21–23 merged work; actual CI/Playwright config; `src/e2e/lesson-loop.spec.ts`; AGENTS sprint/milestone gates.

- [x] Task 24.1: Add two-user authenticated E2E and isolated PostgreSQL/server setup.
- [x] Task 24.2: Review outcome coverage, responsive/accessibility behavior, legacy records, and dependent feature regressions.
- [x] Task 24.3: Run full gates, deliver PR/CI, obtain owner reference acceptance and verify merge synchronization.
- [x] Task 24.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Fail→remediate→retry→pass→reload→unlock is verified; spoofed evidence denied; owner accepts before bulk authoring.

**Exit:** Four complete lessons, full outcome-to-evidence coverage, authentic database/E2E proof, preserved legacy identities, no Critical/High findings, and owner acceptance of the reusable reference.

## Milestone 9 — Network Foundations Curriculum Completion — COMPLETE / MERGED

**Goal:** Complete the remaining Network Foundations modules using the accepted reference and assess transfer through First Day as IT Support.

**Dependency:** M8 complete and owner-approved as the reference.

### Sprint 25 — Network Foundations Content Expansion — COMPLETE

**Exclusive owner:** M9. **Required context:** M8 reference review; matrix P1-M2–M8; original Sprint 5–6 coverage; device/topology/cable/OSI/encapsulation blocks.

- [x] Task 25.1: Author lessons P1-L05–L19 with concepts, worked examples, meaningful interaction, quiz explanations, and summaries.
- [x] Task 25.2: Map every module outcome to final concept/practical evidence and extend existing interactions only where required.
- [x] Task 25.3: Validate content graph and verify representative beginning/middle/end module journeys before full path release.
- [x] Task 25.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Every listed P1 lesson is authored; no heading-plus-reward lesson; no IP arithmetic assessed before Path 2.

### Sprint 26 — Foundations Final Challenge & Path Migration Contract — COMPLETE

**Exclusive owner:** M9. **Required context:** S25 curriculum; `support-challenge.ts`, `/api/challenges/submit`, `queries.ts`, prerequisite graph, schema Course relationship.

- [x] Task 26.1: Align First Day as IT Support to P1 outcomes; grade inventory/topology/diagnosis evidence through a shared activity identity.
- [x] Task 26.2: Implement/test P1 final eligibility and persistence; keep standalone challenge replay from duplicating rewards.
- [x] Task 26.3: Inventory all old lesson IDs/URLs/progress and document explicit source→destination mapping for later paths; obtain review before writes.
- [x] Task 26.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** P1 final rejects ineligible/spoofed attempts; all old links resolve; mappings retain progress and preserve FREE access.

**Exit:** All P1 module outcomes taught and assessed, path final passed in authenticated E2E, old URLs/progress preserved, owner-reviewed curriculum mapping for later paths.

## Milestone 10 — Core Networking Curriculum & Applied Practice — COMPLETE

**Goal:** Deliver Paths 2–5 with measurable objectives, complete lessons, module gates, linked practice, and path-level troubleshooting evidence.

**Dependency:** M9 complete; S26 approves exact lesson/URL migration before path restructuring.

### Sprint 27 — IPv4 & Subnetting Curriculum — COMPLETE

**Exclusive owner:** M10. **Required context:** M9 closeout; matrix P2-M1–M5; Sprint 7 domain/tests; IPv4/SubnetPractice and accepted content contracts.

- [x] Task 27.1: Author P2-L01–L10 and module assessments covering biner, address types, masks, host bounds, subnetting and VLSM.
- [x] Task 27.2: Link existing subnet/IP labs with shared identity and add path-final room-allocation evidence.
- [x] Task 27.3: Validate calculations, capacity/overlap, bad inputs and boundary prefixes with deterministic domain tests and authenticated path E2E.
- [x] Task 27.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** All P2 outcomes taught/assessed; worked example followed by independent values; invalid/overlapping plan fails.

### Sprint 28 — Switching & LAN Curriculum — COMPLETE

**Exclusive owner:** M10. **Required context:** S27 address outcomes; S26 approved mappings; matrix P3; Sprint 8 primitives and VLAN/ARP components.

- [x] Task 28.1: Author P3-L01–L08 with MAC learning, ARP, broadcast scope, VLAN and access/trunk concepts.
- [x] Task 28.2: Apply only reviewed legacy switching/routing mappings, preserve URLs/IDs, and link VLAN lab evidence.
- [x] Task 28.3: Build/test a staff/guest final scenario with incorrect port/trunk and verify preserved isolation after repair.
- [x] Task 28.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Expected L2 recipient/forwarding/isolation results are deterministic; required module evidence blocks premature final.

### Sprint 29 — Routing & Services Curriculum — COMPLETE

**Exclusive owner:** M10. **Required context:** S28 closeout; matrix P4; S26 mapping; routing table, DHCP/DNS/NAT/ICMP/terminal domain and API consumers.

- [x] Task 29.1: Author P4-L01–L10, separating gateway/routes, DHCP/DNS, NAT/PAT and transport/service outcomes.
- [x] Task 29.2: Map current routing/service lessons to the approved path structure and link reusable labs without duplication.
- [x] Task 29.3: Assess a failing named-service scenario; require diagnosis, corrected settings, and verified expected connectivity.
- [x] Task 29.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Correct next hop/return route, leases, name resolution and translation tested separately; no false pass on ping alone.

### Sprint 30 — Wireless, Troubleshooting & Core Path Validation — COMPLETE

**Exclusive owner:** M10. **Required context:** S27–29 evidence; matrix P5; current three challenge scenarios, terminal parser and evaluators.

- [x] Task 30.1: Author P5-L01–L08 with wireless tradeoffs, guest security, tool choice and diagnostic method.
- [x] Task 30.2: Tie observable command/evidence state to diagnosis and repair; map current challenges to taught outcomes.
- [x] Task 30.3: Run cross-path new-user/returning-user regression, content coverage, migration consistency and milestone review.
- [x] Task 30.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Diagnosis plus expected restored behavior required; outcome graph remains acyclic; all P2–P5 path finals verified.

**Exit:** Each of Paths 2–5 passes its own content/domain/security/E2E gates; cross-path prerequisite graph has no missing evidence or cycles.

## Milestone 11 — Consultant Learning Path & Curriculum Validation — COMPLETE / MERGED

**Goal:** Teach requirement analysis through proposal creation before independent Consultant work, then verify the full Networking journey.

**Dependency:** M10 complete; review existing M6 procurement/topology/scoring limitations before dependency work.

### Sprint 31 — Consultant Preparation Learning Path — COMPLETE

**Exclusive owner:** M11. **Required context:** M10 closeout; matrix P6-M1–M4; M6 procurement/BoQ/topology/IP/VLAN/scoring, existing saved projects.

- [x] Task 31.1: Author P6-L01–L08 with requirement analysis, capacity/procurement, topology/IP/VLAN, documentation and review.
- [x] Task 31.2: Add the reviewed instructional Path 6 and lesson/module assessments; retain FREE Networking behavior.
- [x] Task 31.3: Connect guided exercises to the existing Consultant workspace and review essential connectivity/security constraints in scoring.
- [x] Task 31.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Each requirement has design evidence and acceptance test; budget success cannot conceal missing critical connectivity.

### Sprint 32 — Consultant Capstone, Portfolio & Full Curriculum Review — COMPLETE / MERGED (PR #39)

**Exclusive owner:** M11. **Required context:** S31 reviewed learning content; matrix P6-M5; five existing cases; portfolio persistence; all prior path reviews.

- [x] Task 32.1: Author P6-L09–L10 and final Small Office transfer scenario; introduce advanced cases only after prerequisite proof.
- [x] Task 32.2: Preserve proposal, case/rubric/content version, scoring evidence and feedback in portfolio; never silently regrade old work.
- [x] Task 32.3: Run full outcome/evidence coverage, authenticated end-to-end sample chain and domain regressions; record milestone review and owner acceptance.
- [x] Task 32.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** All six paths have complete taught/assessed outcomes; portfolio reproduces historical results; no Critical/High finding open.

**Exit:** Path 6 and retained proposal evidence verified; all six paths have outcome coverage and a reviewed curriculum-level regression report.

## Milestone 12 — Commercial Readiness Gate Review — COMPLETE / BLOCKED FROM ACTIVATION

**Goal:** Review the former M8 premium/provider entry gates without implementing or activating a payment provider.

**Dependency:** M7 operational gates and M8–M11 curriculum gates complete, real premium content and pricing separately approved, merchant/legal/provider prerequisites verified.

### Sprint 33 — Premium Activation Entry-Gate Review — COMPLETE / MERGED (PR #40)

**Exclusive owner:** M12. **Required context:** Former M8 scope in ADR 0004 and archived commerce spec; M7 operational evidence; M8–M11 curriculum reviews.

- [x] Task 33.1: Verify actual published premium content, access guards, owner-approved price and valid premium Combo Package.
- [x] Task 33.2: Verify operator/privacy/merchant/tax readiness and private provider/staging configuration through approved channels.
- [x] Task 33.3: Record evidence and unresolved gates before authorizing provider implementation; no credentials in documentation.
- [x] Task 33.4: Full relevant validation, documentation, internal review, current-head PR/CI, owner merge, and synchronization.

**Acceptance:** Every entry gate has current evidence; absent premium products keep milestone blocked from activation.

**Exit result:** Review completed, but absent real premium products/pricing and unverified operator/provider/deployment prerequisites keep activation blocked. No live payment or deployment action is authorized.

## Milestone 13 — Developer Operations and Internal Accounts — ACTIVE

Detailed executable plan: [Developer Operations and Internal Accounts](docs/superpowers/plans/2026-09-08-developer-operations-and-internal-accounts.md).

### Sprint 34 — Role, Persistence, and Authorization Foundation

- [x] Task 34.1: Establish a complete fresh-database baseline, switch CI to migration deployment, and document the still-unverified retained-database upgrade procedure before adding privileged-role persistence.
- [x] Task 34.2: Add central database-authoritative role guards and immediate role enforcement.
- [x] Task 34.3: Force public email/Google registration to `LEARNER`; prohibit Google login for developers.
- [x] Task 34.4: Add the only privileged provisioning path: a VPS CLI with explicit target, role, actor, and reason.
- [x] Task 34.5: Route the shared login to isolated learner/developer workspaces.
- [x] Task 34.6: Give `INTERNAL_LEARNER` full learning access while excluding it from business/learner analytics.

**Merged evidence:** Tasks 34.1–34.8 are merged into `main` via PR #45–#53 (PR #53 completed at merge commit `eca9066` with all applicable CI jobs passing).

**Sprint 34 closure findings — resolved:**

- [x] Task 34.7: Route learning-path detail access through the shared role-aware access policy so `INTERNAL_LEARNER` receives the promised all-course access when premium paths exist. (Merged in PR #52).
- [x] Task 34.8: Enforce `requireLearnerActor()` / the centralized learner-area role boundary on learner mutation APIs so a `DEVELOPER` cannot bypass workspace isolation through direct requests. (Merged in PR #53).
- [x] Task 34.9: Add focused regression coverage, rerun the relevant/full gates, complete Sprint 34 review, and deliver through PR/CI and owner merge.

**Acceptance:** No public/UI/HTTP path can grant a privileged role; stale JWT role cannot bypass current database role; developer and learner surfaces deny each other; internal learner access does not pollute cohorts. All criteria satisfied and verified.

### Sprint 35 — Read-Only Developer Portal

- [x] Task 35.1: Build explicit, privacy-safe read models for overview, users, package/order history, learning, curriculum, system, security, and account views.
- [x] Task 35.2: Build the separate `/developer` shell and responsive/read-only pages with safe empty/error/loading states.
- [x] Task 35.3: Verify query performance, authorization, accessibility, responsive behavior, and safe logging.

**Acceptance:** Developer sees operational and user/package context without raw secrets, raw learner answers, curriculum mutation, shell access, or system mutation. All criteria satisfied and verified. Tasks 35.1–35.3 completed and tested.

### Sprint 36 — Elevation, Entitlements, and Audit — ✅ COMPLETE

- [x] Task 36.1: Persist safe activity/security events and immutable audit records.
- [x] Task 36.2: Add mandatory developer 2FA and password-plus-2FA elevated sessions with ten-minute expiry.
- [x] Task 36.3: Implement atomic package grant/revoke with a written reason; preserve all order history.
- [x] Task 36.4: Complete security review, authenticated E2E, full gates, PR/CI, owner review/merge, and synchronization.

**Exit:** Role provisioning, workspace isolation, internal cohort behavior, developer read views, elevation, entitlement changes, and audit evidence are verified with no open Critical/High findings. Milestone 13 complete.

## Milestone 14 — Learner Experience and Mastery Quality — ACTIVE / NEXT

Detailed executable plan: [Learner Experience and Mastery Quality](docs/superpowers/plans/2026-09-08-learner-experience-and-mastery.md).

### Sprint 37 — Continuity and Daily Comfort

- [x] Task 37.1: Add exact resume and a deterministic prioritized learning queue.
- [x] Task 37.2: Add safe autosave drafts that never create progress/XP/evidence.
- [x] Task 37.3: Standardize lesson navigation and public error behavior.
- [x] Task 37.4: Add typed curriculum search and ownership-scoped bookmarks.

### Sprint 38 — Mastery, Remediation, and Feedback

- [x] Task 38.1: Derive learner mastery from current authoritative evidence.
- [x] Task 38.2: Add remediation mapping/center and integrate it into the queue.
- [x] Task 38.3: Add privacy-safe outcome/item analytics excluding internal/developer cohorts.
- [x] Task 38.4: Improve Consultant feedback without silently regrading historical work.

### Sprint 39 — Spaced Review and Learner-Quality Acceptance

- [x] Task 39.1: Add deterministic, idempotent spaced-review scheduling.
- [x] Task 39.2: Run accessibility, responsive, performance, offline/error, and authenticated E2E regression.
- [x] Task 39.3: Complete the milestone review, full gates, PR/CI, owner review/merge, and synchronization.

**Exit:** Learners can resume, recover drafts, search/bookmark, understand mastery/remediation, receive useful Consultant feedback, and complete due reviews through accessible, server-authoritative flows.

## Milestone 15 — Final Production and Commercial Release — ACTIVE

Detailed executable plan: [Final Production and Commercial Release](docs/superpowers/plans/2026-09-08-final-production-and-commercial-release.md).

### Sprint 40 — Persistent Security and Release Baseline

- [x] Task 40.1: Replace in-memory session revocation with shared PostgreSQL persistence.
- [x] Task 40.2: Replace in-memory password-reset abuse controls with a multi-instance-safe limiter.
- [x] Task 40.3: Reverify that unsafe OAuth email linking remains disabled and verify live email/OAuth in isolated staging.
- [x] Task 40.4: Rehearse fresh/upgrade migrations, dependency/security checks, and backup-based rollback.

### Sprint 41 — Staging, Recovery, and Operational Readiness

- [x] Task 41.1: Finalize factual operator/privacy/payment/incident runbooks.
- [x] Task 41.2: Deploy and verify an explicitly authorized isolated staging environment.
- [x] Task 41.3: Prove backup, restore, rollback, and incident drills outside production.
- [x] Task 41.4: Complete a production-like non-payment rehearsal and owner review.

### Sprint 42 — Midtrans Gateway and Controlled Commercial Activation

- [x] Task 42.1: Refresh and approve the exact Dynamic QRIS/provider boundary from current official documentation.
- [x] Task 42.2: Implement the server-only adapter, verified/idempotent webhook processing, and VPS reconciliation CLI.
- [x] Task 42.3: Verify sandbox and staging success/failure/expiry/replay/reconciliation flows.
- [x] Task 42.5: Complete post-release smoke/monitoring/recovery review and synchronize evidence.

**Exit:** Persistent security controls, migrations, staging, recovery, operator/legal/catalog gates, provider integrity, and separately authorized production/live activation are independently evidenced. Gateway and deployment were the last work performed. Milestone 15 is COMPLETE.

Exact files, interfaces, TDD steps, risks, test fixtures, and verification commands are in the three linked 2026-09-08 implementation plans. Planning approval does not authorize implementation, external configuration, deployment, or live payment.

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
