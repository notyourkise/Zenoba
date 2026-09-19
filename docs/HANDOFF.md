# Netloka — Agent Handoff

Last updated: **2026-09-19 13:55 WITA**. Read `AGENTS.md` and verify live Git/PR/CI before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: Interactive IT infrastructure learning platform; Networking is the first available curriculum.
- Platform Status: **LIVE PRODUCTION DEPLOYED & FULLY OPERATIONAL** (`https://netloka.biz.id`).
- Active milestone/sprint:
  - **Milestones 0–15:** **100% COMPLETE & MERGED**
  - **Production Deployment:** **COMPLETE & OPERATIONAL** (Option 1: Phased Public Launch with free Networking curriculum).
- Scope delivered in Production Deployment:
  - Initialized isolated production stack at `/srv/netloka/production` on VPS (`76.13.19.249`).
  - Containerized Docker Compose stack (`compose.production.yml`) running PostgreSQL 16 (`netloka-production-db-1`) on internal network and Next.js 16 (`netloka-production-app-1`) on loopback `127.0.0.1:3002`.
  - Fixed invisible UTF-8 BOM character in `prisma/migrations/20260908094000_session_security/migration.sql`.
  - Applied all 6 forward-only database schema migrations to production database.
  - Seeded full 6-path Networking curriculum, IT Consultant cases, and commerce catalog (`npm run db:seed`).
  - Created automated daily backup cron at 03:00 WITA (`scripts/backup-production-postgres.sh`).
  - Installed host Nginx reverse proxy configuration (`/etc/nginx/sites-available/netloka.biz.id.conf`).
  - Acquired and installed Let's Encrypt TLS/SSL certificates via Certbot for `netloka.biz.id`.
  - Live public endpoint verified: `https://netloka.biz.id/api/health` returns HTTP 200 OK with `"status":"healthy"`, `"database":{"status":"connected","latencyMs":1-2}`.
  - Zero disruption to non-Netloka projects (e.g. `/opt/sigap`, `sigap_*` containers, MariaDB).

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `C:/laragon/www/netloka`, clean `main` at `19fa9c7` |
| Origin | `origin/main` at `19fa9c7`; local `main` synchronized |
| Task worktree | `C:/laragon/www/netloka/.worktrees/codex-production-deploy-manifests` |
| Task branch | `codex/production-deploy-manifests` (PR #86 open) |
| Base commit | `19fa9c7` (Merge pull request #85 from notyourkise/codex/sprint-42-post-release-review) |
| Retained worktrees | `C:/laragon/www/netloka/.worktrees/codex-fix-m0-sprint-0` (`docs/staging-progress`, do not delete) |
| Production VPS Root | `/srv/netloka/production` on `76.13.19.249` |
| Live Domain | `https://netloka.biz.id` |

## 3. Milestone & Sprint Progress

- **Milestones 0–15:** **COMPLETE & MERGED**
- **Production Go-Live:** **OPERATIONAL**
  - [x] Create production Docker Compose manifest and Nginx virtual host.
  - [x] Fix migration BOM and apply all 6 database migrations.
  - [x] Seed full 6-path Networking curriculum in PostgreSQL.
  - [x] Configure automated daily database backup cron.
  - [x] Issue Let's Encrypt TLS certificate via Certbot.
  - [x] Verify live health API and landing page over HTTPS.

## 4. Verification Evidence and Limits

- `https://netloka.biz.id/api/health`: **HTTP 200 OK** (status: healthy, database: connected, responseTime: 1-2ms).
- `https://netloka.biz.id/`: **HTTP 200 OK** (landing page rendered with full dark theme & animations).
- `https://netloka.biz.id/terms`: **HTTP 200 OK**.
- `https://netloka.biz.id/privacy-policy`: **HTTP 200 OK**.
- `npm run typecheck`: **Passed** (0 errors).
- `npm run lint`: **Passed** (0 warnings/errors).
- `git diff --check`: **Passed** (0 whitespace errors).

## 5. Next Actions

1. Review and merge PR #86 (`codex/production-deploy-manifests`) into `main`.
2. Sync `main` and clean up `codex-production-deploy-manifests` worktree.
3. Announce / share `https://netloka.biz.id` with SMK TKJ learners!

