# Netloka Roadmap

> **Project:** Netloka  
> **Domain:** `netloka.biz.id`  
> **Product:** Interactive IT infrastructure learning platform
> **Primary audience:** SMK TKJ students, beginners, and learners preparing for practical network, sysadmin, security, cloud, and field-infrastructure work
> **Core experience:** Learn → Interact → Practice → Challenge → Consultant Project  
> **Status:** Milestones 0–6 historically delivered; Milestone 7 operationally active; Milestones 8–11 learning renewal planned (Welcome pilot first); Milestone 12 premium activation gated
> **Timezone for project logs:** WITA / GMT+8

---

## 1. Product Direction

Netloka is not intended to be a conventional LMS consisting mainly of long-form reading and video. The product should teach IT infrastructure through short lessons, reusable interactive visualizations, practice labs, troubleshooting scenarios, and project-based simulations. Networking is the first implemented domain and the intended MVP curriculum; renewed instructional completeness is tracked in Milestones 8–11. Future domains remain out of MVP scope until the roadmap intentionally activates them.

The MVP must establish four core product areas:

1. **Learn** — structured learning paths, modules, lessons, quizzes, and progress.
2. **Labs** — reusable interactive networking practice.
3. **Challenges** — scenario-based troubleshooting without step-by-step handholding.
4. **Consultant** — case-based IT consultant simulation covering requirement analysis, device procurement, budgeting, topology, IP/VLAN planning, documentation, and scoring.

### MVP Learning Paths

1. Network Foundations
2. IPv4 & Subnetting
3. Switching & LAN
4. Routing & Network Services
5. Wireless & Troubleshooting
6. Network Planning & IT Consultant

### Future Learning Paths

These are intentionally **out of MVP scope**, but the architecture must not prevent adding them later:

- CCTV & Video Surveillance
- Fiber Optic
- PABX, IP PBX & VoIP
- MikroTik
- Cisco
- Linux & Server Administration
- Network Security

---

# 2. Technical Baseline

Current architecture:

- **Web framework:** Next.js 16 + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI components:** reusable local primitives following shadcn/ui patterns, plus Lucide where a functional icon is justified
- **Database:** PostgreSQL
- **ORM:** Prisma 7 with the PostgreSQL driver adapter
- **Authentication:** NextAuth.js 4 with credentials, JWT sessions, and Prisma adapter integration
- **Interactive diagrams:** deterministic React, CSS, and SVG components
- **Animation:** CSS/SVG/JavaScript interactions with reduced-motion support; self-hosted Lottie blocks remain supported by the lesson schema
- **Deployment target:** Docker on VPS; production deployment has not yet been performed
- **Reverse proxy:** Caddy
- **DNS / edge:** Cloudflare
- **Object storage:** Cloudflare R2 later when user-generated or larger assets justify it
- **Repository operations:** Git + GitHub CLI (`gh`)
- **Testing:** unit/integration tests plus browser E2E for critical user flows

Architecture principle:

> Start as a modular monolith. Do not introduce microservices, Kubernetes, a real VM lab, or distributed infrastructure until demonstrated product requirements justify them.

---

# 3. Milestones & Sprints

## Milestone 0 — Project Foundation ✅ COMPLETE

**Goal:** Establish a reproducible, testable, deployable project skeleton and development workflow.

### Sprint 0 — Repository & Environment Bootstrap ✅

Deliverables:

- Next.js + TypeScript project
- Tailwind baseline
- formatting/linting/type-checking
- unit test runner
- E2E test foundation
- PostgreSQL local development through Docker Compose
- environment variable validation
- project folder conventions
- CI workflow
- basic health page/endpoint
- documentation baseline
- initial staging deployment path documented

**Exit criteria:** A fresh clone can be installed, tested, built, and started using documented commands.

---

## Milestone 1 — Core Product Shell ✅ COMPLETE

**Goal:** A user can authenticate, enter Netloka, navigate the application, and own persistent learning progress.

### Sprint 1 — Authentication, User Model & Application Shell ✅

Deliverables:

- landing page
- sign up / sign in / sign out
- user profile
- protected application routes
- main navigation: Learn, Labs, Challenges, Consultant
- responsive application shell
- database-backed user model
- basic accessibility and error states

### Sprint 2 — Learning Catalog & Progress Model ✅

Deliverables:

- learning path → module → lesson data model
- prerequisite model
- user lesson/module/path progress
- dashboard progress overview
- content seed mechanism
- lesson status: locked / available / in progress / completed
- course navigation

**Milestone exit criteria:** A user can log in, see a seeded learning path, open available lessons, and retain progress.

---

## Milestone 2 — Learning Engine ✅ COMPLETE

**Goal:** Netloka can render reusable, interactive lessons without hardcoding every lesson as a custom page.

### Sprint 3 — Lesson Block Renderer ✅

Initial block types:

- heading
- text
- image
- callout
- code
- Lottie
- diagram
- interactive
- quiz
- terminal
- practice
- summary
- reward

Deliverables:

- typed lesson block schema
- renderer registry
- lesson navigation
- lesson completion
- reduced-motion behavior
- invalid block fallback
- content validation

### Sprint 4 — Quiz, Practice & Reward Engine ✅

Deliverables:

- single-choice quiz
- multiple-choice quiz
- ordering/categorization interaction where required
- answer explanations
- attempt records
- XP rules
- lesson completion reward
- achievement-ready event model
- score calculation

**Milestone exit criteria:** A lesson can execute the complete Intro → Concept → Visual → Interactive → Knowledge Check → Practice → Summary → XP loop.

---

## Milestone 3 — Network Foundations Content ✅ COMPLETE

**Goal:** Release the first complete beginner learning path and validate Netloka's interactive teaching model.

### Sprint 5 — Network Foundations Part A ✅

Modules:

1. Welcome to Networking
2. Types of Networks
3. Client, Server & Communication
4. Network Topology

Primary reusable interactions:

- device cards
- simple network connection visualization
- topology explorer
- scenario selection
- request/response packet flow

### Sprint 6 — Network Foundations Part B ✅

Modules:

5. Network Devices
6. Physical Media & Cabling
7. How Data Travels
8. OSI & TCP/IP Foundations

Primary reusable interactions:

- device explorer
- cable/T568 ordering activity
- packet flow
- OSI stack
- encapsulation/decapsulation visualizer

Final challenge:

**First Day as IT Support**

**Milestone exit criteria:** Path 1 is completable end-to-end and includes a final challenge.

---

## Milestone 4 — Addressing & Core Networking ✅ COMPLETE

**Goal:** Build the networking logic that later powers Labs, Challenges, and Consultant Mode.

### Sprint 7 — IPv4 & Subnetting Engine ✅

Learning content:

- binary fundamentals
- IPv4 structure
- public/private IP
- loopback/APIPA
- subnet mask
- CIDR
- network/host portion
- network ID
- broadcast
- host range
- subnetting
- VLSM
- IP planning

Reusable tools:

- binary converter
- IPv4 visualizer
- subnet visualizer
- subnet calculator
- subnet practice generator

### Sprint 8 — Switching, VLAN & Routing Fundamentals ✅

Learning content:

- Ethernet
- MAC
- ARP
- switch learning
- broadcast/unicast/multicast
- VLAN
- access/trunk
- inter-VLAN concept
- gateway
- routing table
- static/default routing

Reusable logical simulation primitives:

- device
- interface
- link
- subnet
- route
- VLAN membership
- reachability evaluator

### Sprint 9 — Network Services, Wireless & Troubleshooting ✅

Learning content:

- DHCP
- DNS
- NAT/PAT
- ICMP
- TCP/UDP
- common ports
- HTTP/HTTPS
- SSH
- wireless fundamentals
- 2.4/5/6 GHz overview
- channels/interference
- WPA2/WPA3
- troubleshooting methodology
- common diagnostic commands

Reusable interactions:

- DHCP DORA flow
- DNS flow
- NAT visualizer
- ping simulator
- terminal simulator
- troubleshooting scenario evaluator

**Milestone exit criteria:** Learning Paths 2–5 have an MVP-complete instructional and practice foundation.

---

## Milestone 5 — Labs & Challenges ✅ COMPLETE

**Goal:** Turn reusable learning interactions into independent practice experiences.

### Sprint 10 — Lab Engine ✅

Deliverables:

- lab catalog
- lab instructions
- lab state
- reset/retry
- deterministic validation
- hints
- result summary
- XP/progress integration
- initial labs:
  - subnetting
  - IP configuration
  - packet flow
  - VLAN
  - routing
  - DHCP/DNS
  - ping/troubleshooting

### Sprint 11 — Challenge Engine ✅

Deliverables:

- scenario definition format
- hidden expected state
- multi-step troubleshooting
- evidence/command outputs
- attempt scoring
- explanations after completion
- challenge difficulty
- initial beginner → intermediate challenge set

**Milestone exit criteria:** Users can repeatedly practice Labs and solve unguided troubleshooting Challenges independently from lessons.

---

## Milestone 6 — IT Consultant Mode ✅ COMPLETE

**Goal:** Deliver Netloka's flagship case-based network planning experience.

### Sprint 12 — Consultant Case & Procurement Engine ✅

Deliverables:

- consultant case model
- client requirements
- requirement analysis submission
- internal fictional-but-realistic device catalog
- device capability filters
- procurement cart
- BoQ calculation
- budget validation
- capacity checks
- future-growth checks

Initial cases:

1. Small Office ✅
2. Warnet ✅
3. Medium Office ✅

### Sprint 13 — Topology, IP/VLAN Planning & Scoring ✅

Deliverables:

- Topology builder (structured architecture viewer)
- controlled device inventory
- connection rules
- IP plan editor
- VLAN plan editor
- topology validation
- segmentation checks
- composite scoring:
  - technical correctness (0-20)
  - requirement fulfillment (0-20)
  - cost efficiency (0-20)
  - scalability (0-20)
  - security (0-20)
- actionable feedback

### Sprint 14 — Consultant Portfolio & Advanced Cases ✅

Deliverables:

- network documentation summary
- final proposal/result view
- saved consultant project
- user portfolio entry
- School case ✅ (SMK TKJ Network Labs)
- Multi-Floor Company case ✅ (Gedung 3 Lantai Enterprise)
- consultant progression
- printable/export-ready result structure, with actual export implementation deferred unless needed for launch

**Milestone exit criteria:** A learner can receive a case, analyze it, procure devices, design a network, submit a solution, receive multidimensional scoring, and retain the project. ✅

---

## Milestone 7 — Production Readiness & MVP Launch 🚧 ACTIVE

### Sprint 15 — Quality, Security & Deployment 🚧 IN PROGRESS

Deliverables:

- critical E2E flows (`src/e2e/critical-path.spec.ts`) ✅
- accessibility pass ✅
- responsive pass ✅
- security review & hardening ✅
- rate-sensitive endpoint review and WAF guidance documented ✅
- implemented secure HTTP headers (`HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) ✅
- Content Security Policy design and implementation ⏳
- Cloudflare WAF activation and verification on the deployed environment ⏳
- database migration procedure ✅
- automated backup & restore test (`scripts/backup-db.sh`, `scripts/restore-db.sh`) ✅
- Docker production configuration (`Dockerfile` multi-stage, `docker-compose.prod.yml`) ✅
- Caddy reverse proxy (`Caddyfile` automatic HTTPS) ✅
- Cloudflare setup documentation (`docs/deployment/cloudflare-and-caddy.md`) ✅
- staging → production release workflow documented ✅
- uptime & database monitoring (`/api/health`) ✅
- production deployment configuration for `netloka.biz.id` ✅
- staging deployment and environment verification ⏳
- production deployment and post-deploy smoke verification ⏳

### Sprint 16 — MVP Stabilization & Feature Refinement 🚧 ACTIVE

Deliverables:

- previously completed quality-gate baseline ✅
- performance profiling & DB health metrics ✅
- slow query review & database latency measurement ✅
- content corrections (Paths 1 to 5 verified) ✅
- analytics/event instrumentation (`UserXpLedger`) ✅
- learning funnel review (`UserLessonProgress`) ✅
- technical debt register (`docs/TECHNICAL_DEBT.md`) ✅
- post-MVP roadmap revision (MikroTik, Cisco, Linux Server tracks) ✅
- landing page, dashboard, navigation, and authentication UI refinement 🚧
- landing-page Sign In/Register modal with legacy-route compatibility ✅
- public Terms and Privacy Policy pages with text-only white/black styling and auth-modal/footer links ✅ (operational legal/privacy launch gates remain open; ADR 0003)
- conditional Google OAuth configuration and email-recovery implementation ✅ (live OAuth/SMTP/migration verification pending)
- pre-launch reset abuse/timing protection, session policy, and dependency remediation ⏳ (ADR 0002; TD-06–TD-09)
- responsive, accessibility, regression, and final-diff review for the active UI work ⏳
- staging validation before production launch ⏳

### Sprint 17 — Member Workspace & Commerce Foundation 🚀 IMPLEMENTED / MERGED

**Goal:** Make the post-login experience a distinct learner workspace and establish a server-authoritative course catalog, package, order, sandbox payment, and lifetime-entitlement foundation. This sprint is fully implemented and locally verified across all 9 tasks. It does not activate live payments or change the locked public landing/auth experience.

Deliverables:

- persistent desktop sidebar and equivalent accessible mobile drawer for authenticated routes
- post-login workspace with Overview, My Learning, Course Catalog, My Packages, Orders, Profile, and Settings
- default authenticated black (`#000000`) / white (`#ffffff`) visual surface without the public cosmic background; Settings theme toggle remains functional
- `Course`, `Package`, package composition, order, payment-attempt, and lifetime-entitlement persistence/domain services
- Networking catalog entry marked Free and always accessible; seven planned premium tracks visible as noninteractive `Coming soon` entries with `Price announced at launch`
- Single Course package rule (exactly one premium course) and Combo Package rule (two or more premium courses; no free Networking course)
- server-side entitlement guards for future premium learning content; sidebar/UI is never an authorization boundary
- sandbox-only payment gateway contract, idempotent `Pending → Paid/Expired/Cancelled` order lifecycle, and test-only fixture products
- seed/config catalog management only; no admin dashboard, production checkout, live QRIS, payment secrets, refund UI, subscription, renewal, promotions, or invoice/tax automation
- complete migration/security/accessibility/responsive/regression review and PR/CI gate

**Reference design:** `docs/superpowers/specs/2026-09-03-member-workspace-course-commerce-design.md`

### Sprint 18 — Dashboard Distillation & Workspace Focus — MERGED (PR #20)

**Goal:** Refocus the authenticated dashboard on the learner's immediate next step and truthful learning progress. Remove duplicated public-marketing content, decorative icons, and card-heavy layout from `/dashboard` only, while preserving the owner-locked pre-login landing/auth UI exactly.

Deliverables:

- one-column, text-led authenticated dashboard with a single primary learning action
- active, zero-progress, and no-published-path states backed by existing user-scoped learning read models
- labelled, semantic progress indicator and compact text progress metrics
- text-only secondary links to Labs, Challenges, and Consultant without feature cards
- concurrent independent dashboard read-model loading after session resolution
- focused dashboard regression tests, responsive/accessibility review, full project quality gates, PR, and current-head GitHub Actions verification

**Reference design:** `docs/superpowers/specs/2026-09-05-dashboard-distillation-design.md`

### Sprint 19 — Cosmic Orbital Workspace UI Redesign — MERGED (PR #21)

Owner-requested authenticated dashboard/sidebar redesign. Historical delivery details remain in PLAN.md and CHANGELOG.md; later learning plans do not reopen public landing or workspace redesign.

### Sprint 20 — Dashboard & Sidebar UI Polish — MERGED (PR #22)

Flame, quote placement, sidebar CLI icon, and wave refinements. Subsequent card-icon adjustment merged as PR #23, profile synchronization as PR #24, and security hardening as PR #25; these follow-ups do not create additional sprint ownership.

**Current evidence note (2026-09-05):** PR #25 introduced CSP and in-memory reset abuse/session controls. Earlier Sprint 15–16 checklists are historical scope records; operational and multi-process/live integration validation is separate. This curriculum documentation task does not certify public production security.

**MVP exit criteria:** Netloka must be deployed to staging and production, pass post-deploy smoke and critical-path verification, and be stable, recoverable, measurable, and usable by real learners. Not yet satisfied. Learning scope claimed at launch must also have the corresponding outcome/assessment evidence from the renewal milestones; planned content is not published-content evidence.

---

## Curriculum renewal — owner-approved planning direction (2026-09-05)

The owner approved explicit outcomes at path/module/lesson levels, Welcome to Networking as the first reference module, mandatory lesson quizzes and module final assessments with retry, and insertion of learning milestones before premium activation. All new sprints are **PLANNED**, not implemented. Exact numeric thresholds and legacy transition policy require detailed design review before code.

Read [curriculum design](docs/superpowers/specs/2026-09-05-learning-outcomes-and-curriculum-design.md), [outcome matrix](docs/curriculum/networking-outcomes.md), [program plan](docs/superpowers/plans/2026-09-05-learning-curriculum-renewal.md), and [Welcome pilot plan](docs/superpowers/plans/2026-09-05-welcome-to-networking.md).

Historical Milestones 0–6 and their sprint delivery records remain intact. Their checked curriculum claims do not certify the renewed learning outcomes: the inspected seed contains 5 paths/13 modules/15 lessons, no quiz or summary blocks, and incomplete instructional content. New learning milestones repair and expand that experience within Networking; they do not activate future premium domains. Milestone 7 remains operationally open.

## Milestone 8 — Learning Outcomes, Assessment Foundation & Welcome Pilot — IMPLEMENTED / IN REVIEW

**Goal:** Deliver Welcome to Networking as an owner-reviewed reference with explicit outcomes, accurate assessment, mandatory passing, retry, persistent evidence, and safe progression.

**Entry:** Review existing M1/M2 learning/auth/progress and M7 merged baseline; local development does not wait for production deployment.

### Sprint 21 — Curriculum Contracts & Reproducible Data Foundation — COMPLETE

**Owner:** Milestone 8 only.

A reviewed, versioned content/evidence contract and reproducible storage underpin the pilot.

- Confirm exact assessment/legacy policy and author mapped pilot content.
- Reconcile migration history on disposable data; design additive versioned evidence storage.
- Extract pilot definitions; enforce public/private projection and evidence completeness.

**Acceptance:** Schema rejects incomplete outcomes; fresh and legacy DB fixtures preserve IDs; seed twice does not duplicate content.

### Sprint 22 — Authoritative Assessment, Progression & XP — MERGED (PR #28)

**Owner:** Milestone 8 only.

Only verified current-user answers/evidence can complete lessons or modules.

- Wire server-owned questions to real lesson identity and persist validated attempts.
- Enforce lesson and final-module gates, including direct API access and current-version evidence.
- Make evidence/progress/reward consistent under concurrency, retry, and storage failure.

**Acceptance:** Wrong nonempty answers fail; no direct completion bypass; duplicate events grant once; failed practical blocks module pass.

### Sprint 23 — Welcome Lessons & Module Assessment Experience — MERGED (PR #29)

**Owner:** Milestone 8 only.

Deliver four complete beginner lessons plus final test/remediation in the existing workspace.

- Render scoped objectives and ordered instructional stages without generic success fallback.
- Implement beginner-safe connectivity practice and server-evaluated scenario evidence.
- Deliver final module test, outcome feedback, retry, and correct next-stage navigation.

**Acceptance:** All 8 lesson outcomes visibly taught/tested; keyboard/reduced-motion controls work; unresolved network request never shows success.

### Sprint 24 — Pilot Integration, Teaching Review & Reference Approval — MERGED (PR #31)

**Owner:** Milestone 8 only.

Prove the complete pilot with real isolated persistence and owner teaching review.

- Add two-user authenticated E2E and isolated PostgreSQL/server setup.
- Review outcome coverage, responsive/accessibility behavior, legacy records, and dependent feature regressions.
- Run full gates, deliver PR/CI, obtain owner reference acceptance and verify merge synchronization.

**Acceptance:** Fail→remediate→retry→pass→reload→unlock is verified; spoofed evidence denied; owner accepts before bulk authoring.

**Milestone exit criteria:** Four complete lessons, full outcome-to-evidence coverage, authentic database/E2E proof, preserved legacy identities, no Critical/High findings, and owner acceptance of the reusable reference. Every implementation sprint also requires current-head checks, owner review/merge, and verified synchronization under AGENTS.md.

---

## Milestone 9 — Network Foundations Curriculum Completion — IMPLEMENTED / READY FOR REVIEW

**Goal:** Complete the remaining Network Foundations modules using the accepted reference and assess transfer through First Day as IT Support.

**Entry:** M8 complete and owner-approved as the reference.

### Sprint 25 — Network Foundations Content Expansion — COMPLETE

**Owner:** Milestone 9 only.

Author remaining P1 modules as complete learning experiences with individual outcomes.

- Author lessons P1-L05–L19 with concepts, worked examples, meaningful interaction, quiz explanations, and summaries.
- Map every module outcome to final concept/practical evidence and extend existing interactions only where required.
- Validate content graph and verify representative beginning/middle/end module journeys before full path release.

**Acceptance:** Every listed P1 lesson is authored; no heading-plus-reward lesson; no IP arithmetic assessed before Path 2.

### Sprint 26 — Foundations Final Challenge & Path Migration Contract — IMPLEMENTED

**Owner:** Milestone 9 only.

Verify P1 mastery and define safe mappings before reorganizing Paths 3–4 or adding Path 6.

- Align First Day as IT Support to P1 outcomes; grade inventory/topology/diagnosis evidence through a shared activity identity.
- Implement/test P1 final eligibility and persistence; keep standalone challenge replay from duplicating rewards.
- Inventory all old lesson IDs/URLs/progress and document explicit source→destination mapping for later paths; obtain review before writes.

**Acceptance:** P1 final rejects ineligible/spoofed attempts; all old links resolve; mappings retain progress and preserve FREE access.

**Milestone exit criteria:** All P1 module outcomes taught and assessed, path final passed in authenticated E2E, old URLs/progress preserved, owner-reviewed curriculum mapping for later paths. Every implementation sprint also requires current-head checks, owner review/merge, and verified synchronization under AGENTS.md.

---

## Milestone 10 — Core Networking Curriculum & Applied Practice — IN PROGRESS

**Goal:** Deliver Paths 2–5 with measurable objectives, complete lessons, module gates, linked practice, and path-level troubleshooting evidence.

**Entry:** M9 complete; S26 approves exact lesson/URL migration before path restructuring.

### Sprint 27 — IPv4 & Subnetting Curriculum — IMPLEMENTED

**Owner:** Milestone 10 only.

Students independently calculate and allocate valid IPv4 networks for stated host requirements.

- Author P2-L01–L10 and module assessments covering biner, address types, masks, host bounds, subnetting and VLSM.
- Link existing subnet/IP labs with shared identity and add path-final room-allocation evidence.
- Validate calculations, capacity/overlap, bad inputs and boundary prefixes with deterministic domain tests and authenticated path E2E.

**Acceptance:** All P2 outcomes taught/assessed; worked example followed by independent values; invalid/overlapping plan fails.

### Sprint 28 — Switching & LAN Curriculum — PLANNED

**Owner:** Milestone 10 only.

Students reason about MAC/ARP forwarding and correctly segment an access/trunk LAN.

- Author P3-L01–L08 with MAC learning, ARP, broadcast scope, VLAN and access/trunk concepts.
- Apply only reviewed legacy switching/routing mappings, preserve URLs/IDs, and link VLAN lab evidence.
- Build/test a staff/guest final scenario with incorrect port/trunk and verify preserved isolation after repair.

**Acceptance:** Expected L2 recipient/forwarding/isolation results are deterministic; required module evidence blocks premature final.

### Sprint 29 — Routing & Services Curriculum — PLANNED

**Owner:** Milestone 10 only.

Students trace inter-subnet and named-service access with routing/DHCP/DNS/NAT evidence.

- Author P4-L01–L10, separating gateway/routes, DHCP/DNS, NAT/PAT and transport/service outcomes.
- Map current routing/service lessons to the approved path structure and link reusable labs without duplication.
- Assess a failing named-service scenario; require diagnosis, corrected settings, and verified expected connectivity.

**Acceptance:** Correct next hop/return route, leases, name resolution and translation tested separately; no false pass on ping alone.

### Sprint 30 — Wireless, Troubleshooting & Core Path Validation — PLANNED

**Owner:** Milestone 10 only.

Students collect evidence and verify repairs across Paths 2–5.

- Author P5-L01–L08 with wireless tradeoffs, guest security, tool choice and diagnostic method.
- Tie observable command/evidence state to diagnosis and repair; map current challenges to taught outcomes.
- Run cross-path new-user/returning-user regression, content coverage, migration consistency and milestone review.

**Acceptance:** Diagnosis plus expected restored behavior required; outcome graph remains acyclic; all P2–P5 path finals verified.

**Milestone exit criteria:** Each of Paths 2–5 passes its own content/domain/security/E2E gates; cross-path prerequisite graph has no missing evidence or cycles. Every implementation sprint also requires current-head checks, owner review/merge, and verified synchronization under AGENTS.md.

---

## Milestone 11 — Consultant Learning Path & Curriculum Validation — PLANNED

**Goal:** Teach requirement analysis through proposal creation before independent Consultant work, then verify the full Networking journey.

**Entry:** M10 complete; review existing M6 procurement/topology/scoring limitations before dependency work.

### Sprint 31 — Consultant Preparation Learning Path — PLANNED

**Owner:** Milestone 11 only.

Students turn a client brief into a justified, testable network proposal.

- Author P6-L01–L08 with requirement analysis, capacity/procurement, topology/IP/VLAN, documentation and review.
- Add the reviewed instructional Path 6 and lesson/module assessments; retain FREE Networking behavior.
- Connect guided exercises to the existing Consultant workspace and review essential connectivity/security constraints in scoring.

**Acceptance:** Each requirement has design evidence and acceptance test; budget success cannot conceal missing critical connectivity.

### Sprint 32 — Consultant Capstone, Portfolio & Full Curriculum Review — PLANNED

**Owner:** Milestone 11 only.

Verify independent proposal work and the entire six-path curriculum.

- Author P6-L09–L10 and final Small Office transfer scenario; introduce advanced cases only after prerequisite proof.
- Preserve proposal, case/rubric/content version, scoring evidence and feedback in portfolio; never silently regrade old work.
- Run full outcome/evidence coverage, authenticated end-to-end sample chain and domain regressions; record milestone review and owner acceptance.

**Acceptance:** All six paths have complete taught/assessed outcomes; portfolio reproduces historical results; no Critical/High finding open.

**Milestone exit criteria:** Path 6 and retained proposal evidence verified; all six paths have outcome coverage and a reviewed curriculum-level regression report. Every implementation sprint also requires current-head checks, owner review/merge, and verified synchronization under AGENTS.md.

---

## Milestone 12 — Premium Course & Payment Activation — PLANNED

**Goal:** Preserve the former M8 premium/provider activation scope, strictly after content/product/operator/provider and deployment gates.

**Entry:** M7 operational gates and M8–M11 curriculum gates complete, real premium content and pricing separately approved, merchant/legal/provider prerequisites verified.

### Sprint 33 — Premium Activation Entry-Gate Review — PLANNED

**Owner:** Milestone 12 only.

Determine whether commercial activation prerequisites are independently satisfied.

- Verify actual published premium content, access guards, owner-approved price and valid premium Combo Package.
- Verify operator/privacy/merchant/tax readiness and private provider/staging configuration through approved channels.
- Record evidence and unresolved gates before authorizing provider implementation; no credentials in documentation.

**Acceptance:** Every entry gate has current evidence; absent premium products keep milestone blocked from activation.

### Sprint 34 — Provider Verification & Controlled Release — PLANNED

**Owner:** Milestone 12 only.

Execute only the separately approved provider activation/release design after all entry gates pass.

- Prepare and obtain owner review of exact provider adapter/webhook/reconciliation implementation plan with live-vs-sandbox boundaries.
- Verify provider sandbox and staging amount/signature/idempotency/reconciliation cases with isolated data, then review operational refund/dispute handling.
- Enable production only with explicit owner authorization; run post-deploy smoke/monitoring and record release/recovery evidence.

**Acceptance:** Provider event—not client redirect—controls entitlement; all release gates and operator actions recorded.

**Milestone exit criteria:** Only owner-authorized real premium products and provider integration can satisfy commercial activation; no readiness inferred from free curriculum completion. Every implementation sprint also requires current-head checks, owner review/merge, and verified synchronization under AGENTS.md.

---

### Premium renumbering and unchanged activation gates

Milestone 12 replaces the former **Milestone 8 — Premium Course & Payment Activation**. Historical changelog/commerce-document M8 references retain their original meaning; this note supersedes numbering only. No payment activation is authorized here.

Required gates remain: real published access-guarded premium content; owner-approved pricing and a Combo Package of at least two real premium courses; merchant/legal/tax/operator/privacy/retention/payment terms; private Midtrans credentials and verified Dynamic QRIS webhook; isolated staging/deployment/backup/monitoring evidence. Provider sandbox/staging/live verification and reconciliation/dispute/refund procedures remain required. Free Networking completion and Sprint 17 implementation cannot satisfy these gates on their own.

# 4. Milestone Dependency Map

```text
Reviewed M0–M6 foundation + merged M7 application baseline
    → M8 / S21–24: contracts, assessment, Welcome pilot and owner review
    → M9 / S25–26: complete Network Foundations and final challenge
    → M10 / S27–30: IPv4, switching, routing/services, wireless/troubleshooting
    → M11 / S31–32: Consultant learning and full curriculum validation

M7 operational launch gates + M8–M11 verified curriculum
    + separately approved real premium content/operator/provider readiness
    → M12 / S33–34: gated premium/payment activation
```

M7 remains active for operational work. M8 local development can start from its reviewed code without waiting for deployment; it does not mark M7 complete. A sprint has exactly one milestone owner; consuming or testing another milestone's features does not transfer ownership. Welcome is the only first implementation target. Later milestones require the preceding review gates.

---

# 5. Definition of Done for Every Sprint

A sprint is not complete merely because code exists.

Every sprint must satisfy all applicable checks:

- requirements in `PLAN.md` completed
- tests written and passing
- lint/type-check/build passing
- security-sensitive changes reviewed
- mobile/responsive behavior checked for UI work
- accessibility basics checked for UI work
- database migrations reviewed and reproducible
- documentation updated
- `CHANGELOG.md` updated using WITA / GMT+8
- current roadmap/plan statuses updated
- code review performed on the sprint diff
- no unresolved critical/high-severity review findings
- Git commits are meaningful and scoped
- branch pushed to GitHub
- PR created/updated with GitHub CLI when the repository workflow uses PRs

---

# 6. Scope Guardrails

Do **not** add these to MVP unless the roadmap is explicitly revised:

- real Cisco IOS or MikroTik emulation
- arbitrary shell execution
- VM/container-per-user network labs
- Kubernetes
- microservices
- marketplace price scraping
- real-world device pricing dependency
- AI-generated grading as the sole correctness mechanism
- CCTV learning path
- PABX/VoIP learning path
- full Fiber Optic path
- vendor certification path

The logical simulator must be deterministic and purpose-built for learning.

---

# 7. Post-MVP Direction

After MVP stabilization, prioritize based on learner usage and feedback rather than adding all planned paths at once.

Candidate future milestones:

- CCTV & Surveillance Path
- Fiber Optic Path
- PABX / VoIP Path
- MikroTik Path
- Cisco Path
- Linux / Server Administration Path
- Network Security Path
- advanced consultant scenarios combining networking, CCTV, fiber, voice, server, and security
