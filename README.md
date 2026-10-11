# Zenoba — Interactive Networking Learning Platform

[![CI](https://github.com/notyourkise/NetLoka/actions/workflows/ci.yml/badge.svg)](https://github.com/notyourkise/NetLoka/actions)
![Node.js LTS](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

**Domain:** `zenoba.tech`
**Architecture:** Modular monolith (Next.js + TypeScript + PostgreSQL)  
**Development status:** Milestones 0–6 are historically implemented; the Milestone 7 application baseline, Milestones 8–12, and Sprint 34 are merged; Milestone 13 remains active with Sprint 34 authorization-review findings open and Sprint 35 planned next; staging/production and live payment remain unverified and deliberately last in Sprint 42

**Timezone:** WITA / GMT+8

---

## 🎯 Purpose

Zenoba is an interactive IT infrastructure learning platform for SMK TKJ students, beginners, and learners preparing for practical network, sysadmin, security, cloud, and field-infrastructure work. Networking is the first available learning domain, while future domains remain clearly labeled as upcoming work.

**Core experience:** Learn → Interact → Practice → Challenge → Consultant Project

### MVP Product Areas

1. **Learn** — structured learning paths, modules, lessons, quizzes, and progress tracking
2. **Labs** — reusable interactive networking practice
3. **Challenges** — scenario-based troubleshooting without step-by-step handholding
4. **Consultant** — case-based IT consultant simulation (procurement, topology, IP/VLAN planning, scoring)

### Current learning baseline and planned quality program

The Networking curriculum renewal is implemented in the typed registry: six paths, 31 modules, 65 lessons, 195 formative quizzes, and six capstones. Lessons and module assessments use server-authoritative evidence and gated progression. This is repository evidence, not a claim that staging or production is deployed.

- Milestones 8–11 / Sprints 21–32: merged curriculum, assessments, six paths, and Consultant validation.
- Milestone 12 / Sprint 33: merged commercial entry-gate review; activation remains blocked.
- Milestone 13 / Sprints 34–36: Sprint 34 role/persistence/routing/internal-access implementation is merged with closure findings open; the separate developer portal, elevation, and audit remain pending.
- Milestone 14 / Sprints 37–39: resume/queue/autosave, search/bookmarks, mastery/remediation, feedback, and spaced review.
- Milestone 15 / Sprints 40–42: persistent security, staging/recovery, Midtrans, production, deployment, and live payment—last and separately gated.

Read the [approved developer/learner design](docs/superpowers/specs/2026-09-07-developer-portal-and-learner-experience-design.md) and its detailed [developer](docs/superpowers/plans/2026-09-08-developer-operations-and-internal-accounts.md), [learner quality](docs/superpowers/plans/2026-09-08-learner-experience-and-mastery.md), and [final release](docs/superpowers/plans/2026-09-08-final-production-and-commercial-release.md) plans. Fresh-database migration reproducibility is implemented in CI; retained-database upgrade rehearsal remains pending. See [technical debt](docs/TECHNICAL_DEBT.md).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.3.x + React 19.2.x + TypeScript 5.x
- **Styling:** Tailwind CSS 4.x with reusable local shadcn-style primitives
- **Database:** PostgreSQL 16.x + Prisma ORM 7.x
- **Authentication:** NextAuth.js 4.x with credentials/JWT sessions and Prisma integration
- **Testing:** Vitest (unit/integration) + Playwright (E2E)
- **Linting:** ESLint + Prettier
- **Deployment target:** Docker on VPS → Caddy reverse proxy → Cloudflare; configuration exists, deployment is pending

---

## 🚀 Quick Start

### Prerequisites

- Node.js LTS (v20.19.0 or higher)
- npm (comes with Node.js)
- Docker (for local PostgreSQL development)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/notyourkise/NetLoka.git
cd zenoba
```

2. **Install dependencies**

```bash
npm ci
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your actual database URL if needed
```

Authentication uses credentials by default. Optional integrations are configured only through `.env`:

```dotenv
APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# Enable Google only after both values are available
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Hostinger Email SMTP
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="noreply@example.com"
SMTP_PASSWORD="replace-with-email-account-password"
EMAIL_FROM="noreply@example.com"
```

Until both Google values are configured, the Google button remains visible but disabled with `Setup pending`. Register the OAuth callback as `http://localhost:3000/api/auth/callback/google` locally and `https://zenoba.tech/api/auth/callback/google` for production. Never commit real SMTP or OAuth credentials.

Password-reset links expire after 30 minutes and require the password-reset database migration to be deployed.

Development validation uses mocked SMTP/database boundaries. Live Hostinger delivery, Google login, and applying the new migration still require integration verification. Before public exposure, complete reset-request abuse/timing protection and review existing JWT-session revocation behavior. See [ADR 0002](docs/decisions/0002-auth-modal-and-password-recovery.md) for the implementation and verification boundaries.

### Terms and Privacy Policy

Public routes `/terms` and `/privacy-policy` provide Indonesian development-stage policies. Both use a text-only white/black reading layout, independent of the application's dark theme. Sign In and Create Account expose clearly labeled new-tab links so reading a policy does not discard form input; the landing footer also links to both documents. These links are notices, not a stored acceptance or parental-consent workflow.

The policies describe the current implementation, not certified legal compliance. Operator identity, a reachable privacy contact, retention/deletion procedures, child-data consent, and deployed infrastructure disclosures remain pre-launch work. See [legal content notes](docs/decisions/0003-legal-pages-and-policy-boundaries.md). Rotate any OAuth secret shared outside private configuration; do not copy it into tracked files. Adding legal pages does not activate Google OAuth or verify Google branding.

4. **Start PostgreSQL (using Docker)**

```bash
docker compose up -d
```

The Zenoba container listens only on `127.0.0.1:5433`, avoiding a local PostgreSQL service already using port `5432`. Wait until `docker compose ps` reports `healthy`.

5. **Initialize the database**

```bash
npm run db:generate
npx prisma migrate deploy
```

6. **Run development server**

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000)

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot-reload) |
| `npm run build` | Build production-ready application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npm run typecheck` | Type-check TypeScript without emitting files |
| `npm test` | Run unit/integration tests with Vitest |
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:seed` | Run database seed script |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:verify` | Verify the configured PostgreSQL connection with `SELECT 1` |

---

## 🏃‍♂️ Running Tests

### Unit/Integration Tests

```bash
npm test
```

Vitest runs all test files in `src/**/*.{test,spec}.{ts,tsx}` with jsdom environment.

### E2E Tests

```bash
npm run test:e2e
```

Playwright will:
1. Start the dev server (`npm run dev`)
2. Run browser tests against chromium, firefox, and webkit
3. Stop the server when done

For specific browsers only:

```bash
npx playwright test --project=chromium
```

---

## 📁 Repository Structure

```text
zenoba/
├── .github/workflows/    # CI/CD pipelines
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Prisma data model
│   ├── migrations/       # Generated migrations
│   └── seed.ts           # Database seed data
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   │   └── health/   # Health check endpoint
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── navigation/   # Application and marketing navigation
│   │   ├── marketing/    # Interactive landing-page sections
│   │   └── effects/      # Shared visual effects
│   ├── features/         # Domain-focused feature modules
│   │   ├── auth/         # Authentication
│   │   ├── learning/     # Learning engine
│   │   ├── network-logic/# IPv4, topology, and terminal simulation
│   │   ├── quiz/         # Quiz validation and scoring
│   │   ├── xp/           # Idempotent XP ledger
│   │   ├── labs/         # Deterministic lab engine
│   │   ├── challenges/   # Troubleshooting challenge engine
│   │   └── consultant/   # Procurement, planning, and scoring
│   ├── lib/              # Shared utilities
│   │   ├── db/client.ts  # Prisma singleton
│   │   └── env/server.ts # Environment validation
│   └── test/             # Test utilities & mocks
├── public/               # Static assets
├── docs/                 # Documentation
│   └── decisions/        # Architecture decision records
├── AGENTS.md            # Agent operating instructions
├── CHANGELOG.md         # Project changelog (WITA timezone)
├── PLAN.md              # Detailed implementation plan
├── ROADMAP.md           # Strategic roadmap & milestones
├── docker-compose.yml   # Local PostgreSQL service
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript configuration
└── vitest.config.ts     # Vitest configuration
```

---

## 📋 Code Quality Gates

Before any commit or PR:

```bash
npm run lint       # ESLint checks
npm run typecheck  # TypeScript validation
npm test           # All tests must pass
npm run test:e2e   # Browser smoke tests must pass
npm run build      # Production build must succeed
```

All these checks are enforced by GitHub Actions CI.

---

## 🔐 Security

**Never commit:**
- `.env` file
- Database credentials
- API tokens
- Private keys
- Cloudflare/Docker secrets

Use `.env.example` with safe placeholders instead.

---

## 📅 Development Workflow

1. **Read documentation first** (AGENTS.md → ROADMAP.md → PLAN.md → CHANGELOG.md)
2. **Identify active sprint/task** from PLAN.md
3. **Create focused isolated branch/worktree**: `codex/<task-slug>` under the workflow in `AGENTS.md`
4. **Implement with tests** (write failing test first, then implementation)
5. **Run full verification suite** before committing
6. **Update CHANGELOG.md** with WITA timestamp
7. **Open PR** with complete description including:
   - Milestone/sprint/task reference
   - Summary of changes
   - Notable architectural decisions
   - Migration details
   - Tests executed
   - Known limitations
   - Documentation status

---

## 🗺️ Roadmap Overview

| Milestone | Focus Area | Status |
|-----------|------------|--------|
| M0 | Project Foundation | ✅ Complete |
| M1 | Core Product Shell | ✅ Complete |
| M2 | Learning Engine | ✅ Complete |
| M3 | Network Foundations | ✅ Complete |
| M4 | Addressing & Core Networking | ✅ Complete |
| M5 | Labs & Challenges | ✅ Complete |
| M6 | IT Consultant Mode | ✅ Complete |
| M7 | Production Readiness Foundation | Application foundation merged; live operations moved to M15 |
| M8 | Learning Outcomes & Welcome Pilot (S21–24) | Complete / merged |
| M9 | Network Foundations Completion (S25–26) | Complete / merged |
| M10 | Core Networking Curriculum (S27–30) | Complete / merged |
| M11 | Consultant Learning & Curriculum Validation (S31–32) | Complete / merged |
| M12 | Commercial Readiness Gate Review (S33) | Complete / merged; activation blocked |
| M13 | Developer Operations & Internal Accounts (S34–36) | Complete / merged |
| M14 | Learner Experience & Mastery Quality (S37–39) | Complete / merged |
| M15 | Final Production & Commercial Release (S40–42) | Active next / gated |

See [ROADMAP.md](ROADMAP.md) for detailed milestones and sprints.

---

## 🤝 Contributing

This project follows the **Agent Success** principles outlined in AGENTS.md. Before making changes:

1. Read the relevant documentation thoroughly
2. Understand the current sprint scope
3. Write deterministic tests for new domain logic
4. Keep changes focused and reviewable
5. Synchronize documentation after implementation

---

## 📄 License

© 2026 Zenoba. All rights reserved.

---

Built with ❤️ for networking education.
