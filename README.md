# Netloka — Interactive Networking Learning Platform

[![CI](https://github.com/notyourkise/NetLoka/actions/workflows/ci.yml/badge.svg)](https://github.com/notyourkise/NetLoka/actions)
![Node.js LTS](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

**Domain:** `netloka.biz.id`  
**Architecture:** Modular monolith (Next.js + TypeScript + PostgreSQL)  
**Timezone:** WITA / GMT+8

---

## 🎯 Purpose

Netloka is an interactive networking learning platform for SMK TKJ students, networking beginners, and learners preparing for practical network/sysadmin work. 

**Core experience:** Learn → Interact → Practice → Challenge → Consultant Project

### MVP Product Areas

1. **Learn** — structured learning paths, modules, lessons, quizzes, and progress tracking
2. **Labs** — reusable interactive networking practice
3. **Challenges** — scenario-based troubleshooting without step-by-step handholding
4. **Consultant** — case-based IT consultant simulation (procurement, topology, IP/VLAN planning, scoring)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.x + TypeScript 5.x
- **Styling:** Tailwind CSS 4.x + shadcn/ui
- **Database:** PostgreSQL 16.x + Prisma ORM
- **Testing:** Vitest (unit/integration) + Playwright (E2E)
- **Linting:** ESLint + Prettier
- **Deployment:** Docker on VPS → Caddy reverse proxy → Cloudflare

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
│   │   └── learning/     # Learning-specific components
│   ├── features/         # Domain-focused feature modules
│   │   ├── auth/         # Authentication
│   │   ├── learning/     # Learning engine
│   │   ├── progress/     # Progress tracking
│   │   └── ...
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
3. **Create focused branch**: `feat/sprint-X-task-name` or `fix/task-name`
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
| M0 | Project Foundation | ✅ In Progress |
| M1 | Core Product Shell | 📋 Planned |
| M2 | Learning Engine | 📋 Planned |
| M3 | Network Foundations | 📋 Planned |
| M4 | Addressing & Core Networking | 📋 Planned |
| M5 | Labs & Challenges | 📋 Planned |
| M6 | IT Consultant Mode | 📋 Planned |
| M7 | Production Launch | 📋 Planned |

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
