# Netloka Roadmap

> **Project:** Netloka  
> **Domain:** `netloka.biz.id`  
> **Product:** Interactive networking learning platform  
> **Primary audience:** SMK TKJ students, networking beginners, and learners preparing for network/sysadmin work  
> **Core experience:** Learn → Interact → Practice → Challenge → Consultant Project  
> **Status:** Milestone 0 foundation and security remediation complete; deployment tasks pending target configuration
> **Timezone for project logs:** WITA / GMT+8

---

## 1. Product Direction

Netloka is not intended to be a conventional LMS consisting mainly of long-form reading and video. The product should teach networking through short lessons, reusable interactive visualizations, practice labs, troubleshooting scenarios, and project-based simulations.

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

Initial architecture:

- **Web framework:** Next.js + TypeScript
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui + Lucide
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Better Auth or Auth.js, selected during Sprint 1 after compatibility review
- **Interactive diagrams:** React Flow where node/edge editing is needed
- **Animation:** self-hosted Lottie assets plus CSS/SVG/JavaScript interactions
- **Deployment:** Docker on VPS
- **Reverse proxy:** Caddy
- **DNS / edge:** Cloudflare
- **Object storage:** Cloudflare R2 later when user-generated or larger assets justify it
- **Repository operations:** Git + GitHub CLI (`gh`)
- **Testing:** unit/integration tests plus browser E2E for critical user flows

Architecture principle:

> Start as a modular monolith. Do not introduce microservices, Kubernetes, a real VM lab, or distributed infrastructure until demonstrated product requirements justify them.

---

# 3. Milestones & Sprints

## Milestone 0 — Project Foundation

**Goal:** Establish a reproducible, testable, deployable project skeleton and development workflow.

### Sprint 0 — Repository & Environment Bootstrap

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

## Milestone 1 — Core Product Shell

**Goal:** A user can authenticate, enter Netloka, navigate the application, and own persistent learning progress.

### Sprint 1 — Authentication, User Model & Application Shell

Deliverables:

- landing page
- sign up / sign in / sign out
- user profile
- protected application routes
- main navigation: Learn, Labs, Challenges, Consultant
- responsive application shell
- database-backed user model
- basic accessibility and error states

### Sprint 2 — Learning Catalog & Progress Model

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

## Milestone 2 — Learning Engine

**Goal:** Netloka can render reusable, interactive lessons without hardcoding every lesson as a custom page.

### Sprint 3 — Lesson Block Renderer

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

### Sprint 4 — Quiz, Practice & Reward Engine

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

## Milestone 3 — Network Foundations Content

**Goal:** Release the first complete beginner learning path and validate Netloka's interactive teaching model.

### Sprint 5 — Network Foundations Part A

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

### Sprint 6 — Network Foundations Part B

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

## Milestone 4 — Addressing & Core Networking

**Goal:** Build the networking logic that later powers Labs, Challenges, and Consultant Mode.

### Sprint 7 — IPv4 & Subnetting Engine

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

### Sprint 8 — Switching, VLAN & Routing Fundamentals

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

### Sprint 9 — Network Services, Wireless & Troubleshooting

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

## Milestone 5 — Labs & Challenges

**Goal:** Turn reusable learning interactions into independent practice experiences.

### Sprint 10 — Lab Engine

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

### Sprint 11 — Challenge Engine

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

## Milestone 7 — Production Readiness & MVP Launch

### Sprint 15 — Quality, Security & Deployment

Deliverables:

- critical E2E flows
- accessibility pass
- responsive pass
- security review
- rate limiting where needed
- secure headers
- database migration procedure
- backups and restore test
- Docker production configuration
- Caddy
- Cloudflare setup documentation
- staging → production release workflow
- uptime monitoring
- production deployment at `netloka.biz.id`

### Sprint 16 — MVP Stabilization

Deliverables:

- launch bug fixes
- performance profiling
- slow query review
- content corrections
- analytics/event instrumentation
- learning funnel review
- technical debt register
- post-MVP roadmap revision

**MVP exit criteria:** Netloka is production-accessible, stable, recoverable, measurable, and usable by real learners.

---

# 4. Milestone Dependency Map

```text
M0 Foundation
     ↓
M1 Core Product Shell
     ↓
M2 Learning Engine
     ↓
M3 Network Foundations
     ↓
M4 Addressing & Core Networking
     ↓
M5 Labs & Challenges
     ↓
M6 IT Consultant Mode
     ↓
M7 Production Launch
```

Parallelism is allowed only when interfaces are already stable and separate work cannot corrupt shared state.

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
