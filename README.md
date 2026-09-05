# Netloka — Interactive Networking Learning Platform

[![CI](https://github.com/notyourkise/NetLoka/actions/workflows/ci.yml/badge.svg)](https://github.com/notyourkise/NetLoka/actions)
![Node.js LTS](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

**Domain:** `netloka.biz.id`  
**Architecture:** Modular monolith (Next.js + TypeScript + PostgreSQL)  
**Development status:** Milestones 0–6 historically implemented; Milestone 7 operationally active; learning renewal planned in Milestones 8–11; staging/production not verified for the current feature set

**Timezone:** WITA / GMT+8

---

## 🎯 Purpose

Netloka is an interactive IT infrastructure learning platform for SMK TKJ students, beginners, and learners preparing for practical network, sysadmin, security, cloud, and field-infrastructure work. Networking is the first available learning domain, while future domains remain clearly labeled as upcoming work.

**Core experience:** Learn → Interact → Practice → Challenge → Consultant Project

### MVP Product Areas

1. **Learn** — structured learning paths, modules, lessons, quizzes, and progress tracking
2. **Labs** — reusable interactive networking practice
3. **Challenges** — scenario-based troubleshooting without step-by-step handholding
4. **Consultant** — case-based IT consultant simulation (procurement, topology, IP/VLAN planning, scoring)

### Planned learning curriculum renewal

The next learning target is **Welcome to Networking** as a four-lesson reference module. The planned experience shows **Capaian Pembelajaran** at path, module, and lesson levels, then introduction, concept, worked example, visualization, practice, quiz, summary, and server-verified completion. Lesson quizzes and module final assessments must be passed, with retries and remediation. These are planned requirements, not current production capabilities.

- Milestone 8 / Sprints 21–24: contracts, assessment/progress repair, Welcome lessons, and reference validation.
- Milestone 9 / Sprints 25–26: complete Network Foundations and its final challenge.
- Milestone 10 / Sprints 27–30: IPv4, Switching, Routing/Services, and Wireless/Troubleshooting curriculum.
- Milestone 11 / Sprints 31–32: Consultant learning path and full curriculum validation.
- Milestone 12 / Sprints 33–34: premium/payment activation, renumbered from M8 and still separately gated.

Read the [curriculum outcome matrix](docs/curriculum/networking-outcomes.md), [design](docs/superpowers/specs/2026-09-05-learning-outcomes-and-curriculum-design.md), [program plan](docs/superpowers/plans/2026-09-05-learning-curriculum-renewal.md), and [Welcome pilot plan](docs/superpowers/plans/2026-09-05-welcome-to-networking.md). Current seed coverage is 5 paths/13 modules/15 lessons; it does not yet implement the complete planned learning loop. Existing migration history also requires reconciliation before claiming fresh-database setup reproducibility; see [technical debt](docs/TECHNICAL_DEBT.md).

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
cd netloka
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

Until both Google values are configured, the Google button remains visible but disabled with `Setup pending`. Register the OAuth callback as `http://localhost:3000/api/auth/callback/google` locally and `https://netloka.biz.id/api/auth/callback/google` for production. Never commit real SMTP or OAuth credentials.

Password-reset links expire after 30 minutes and require the password-reset database migration to be deployed.

Development validation uses mocked SMTP/database boundaries. Live Hostinger delivery, Google login, and applying the new migration still require integration verification. Before public exposure, complete reset-request abuse/timing protection and review existing JWT-session revocation behavior. See [ADR 0002](docs/decisions/0002-auth-modal-and-password-recovery.md) for the implementation and verification boundaries.

### Terms and Privacy Policy

Public routes `/terms` and `/privacy-policy` provide Indonesian development-stage policies. Both use a text-only white/black reading layout, independent of the application's dark theme. Sign In and Create Account expose clearly labeled new-tab links so reading a policy does not discard form input; the landing footer also links to both documents. These links are notices, not a stored acceptance or parental-consent workflow.

The policies describe the current implementation, not certified legal compliance. Operator identity, a reachable privacy contact, retention/deletion procedures, child-data consent, and deployed infrastructure disclosures remain pre-launch work. See [legal content notes](docs/decisions/0003-legal-pages-and-policy-boundaries.md). Rotate any OAuth secret shared outside private configuration; do not copy it into tracked files. Adding legal pages does not activate Google OAuth or verify Google branding.

4. **Start PostgreSQL (using Docker)**

```bash
docker compose up -d
```

The Netloka container listens only on `127.0.0.1:5433`, avoiding a local PostgreSQL service already using port `5432`. Wait until `docker compose ps` reports `healthy`.

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
netloka/
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
| M7 | Production Readiness & MVP Launch | 🚧 Active — feature stabilization and deployment pending |
| M8 | Learning Outcomes & Welcome Pilot (S21–24) | Planned — first learning target |
| M9 | Network Foundations Completion (S25–26) | Planned — after pilot acceptance |
| M10 | Core Networking Curriculum (S27–30) | Planned — Paths 2–5 |
| M11 | Consultant Learning & Curriculum Validation (S31–32) | Planned |
| M12 | Premium & Payment Activation (S33–34; formerly M8) | Planned — separate activation gates |

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

© 2026 Netloka. All rights reserved.

---

Built with ❤️ for networking education.
