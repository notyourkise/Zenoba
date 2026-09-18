# Production Release & Commercial Activation Checklist

**Document version:** 1.0  
**Effective date:** 2026-09-19 WITA  
**Milestone / Sprint:** Milestone 15 / Sprint 42 / Task 42.4  
**Project:** Netloka (`netloka.biz.id`)  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Operator Mailbox:** noreply@haikalariadma.my.id  
**Target Git Head:** Commit `437deaf` on `main` (clean, verified)

---

## 1. Executive Summary & Readiness Gate

All development, persistent security controls, schema migrations, backup/restore drills, non-payment rehearsals, and Midtrans Dynamic QRIS sandbox verifications are fully implemented and verified across 148 test files (918 tests passed, 100%).

In accordance with `AGENTS.md` and `docs/superpowers/plans/2026-09-08-final-production-and-commercial-release.md` (Task 13), **production deployment and live commercial payment activation cannot occur automatically**. They require separate explicit authorization from the project owner (**Abangku**).

---

## 2. Release Verification Matrix

| Checklist Item | Requirement | Verified Repository State | Gate Status |
|---|---|---|---|
| **1. Reviewed Commit & Revision** | Clean commit on `main` passing all local and CI gates | Commit `437deaf` on `main` (PR #83 merged) | **VERIFIED** |
| **2. Database Migrations** | Forward-only, additive, non-destructive migration sequence | 6 migrations verified; zero down-migrations; Prisma Client 7.9.1 generated cleanly | **VERIFIED** |
| **3. Disaster Recovery & Backups** | Proven automated backup and point-in-time restore outside production | Verified in Sprint 41 drill (`backup-db.sh`, `restore-db.sh`, PostgreSQL binary format) | **VERIFIED** |
| **4. Server Infrastructure & TLS** | Production VPS deployment ready with reverse proxy & TLS | Docker Compose manifest ready (`docker-compose.staging.yml` / production), TLS 1.3 | **VERIFIED** |
| **5. Mailbox & Transactional Email** | Verified email delivery for password resets and notifications | Hostinger SMTP (`noreply@haikalariadma.my.id`), SSL port 465, rate limited | **VERIFIED** |
| **6. Midtrans Gateway Adapter** | Server-authoritative Core API Dynamic QRIS with timing-safe SHA-512 signatures | Tested across 10 end-to-end sandbox lifecycle scenarios (Task 42.3) | **VERIFIED** |
| **7. VPS Status Reconciliation CLI** | Administrative discrepancy repair tool for lost webhooks | `scripts/reconcile-midtrans.ts` tested; audit logging to `SecurityEvent` verified | **VERIFIED** |
| **8. Curriculum & Course Access** | 6-path Networking curriculum free; access guards enforced | All 6 Networking paths available free; `resolveCourseAccess` strictly enforced | **VERIFIED** |
| **9. Monitoring & Health Contract** | Health check contracts and security incident ledger | `/api/health` returns comprehensive JSON; `SecurityEvent` table operational | **VERIFIED** |
| **10. Owner Deployment Authorization** | Explicit decision on initial production mode and payment switch | Pending owner decision below | **PENDING OWNER SIGN-OFF** |

---

## 3. Commercial Catalog & Pricing Status

1. **Free Curriculum Tier:**
   - The foundational curriculum across all 6 Networking learning paths (Network Foundations, IPv4 & Subnetting, Switching & Local Networks, Routing & Network Services, Network Planning & Cabling, Wireless & Troubleshooting) remains **100% free of charge**.
   - No payment is required for learners to complete lessons, interactive terminal simulators, packet tracers, quizzes, or module assessments.
2. **Premium Bundle Tier:**
   - Commercial course packages remain marked as `COMING_SOON` until Abangku authors real premium content (e.g., MikroTik MTCNA or Advanced Security) and formally authorizes pricing.
   - If an unauthorized checkout request is made for a coming-soon package, `createPendingOrder` throws a validation error and blocks transaction creation.

---

## 4. Production Deployment & Payment Switch Options

Abangku may choose one of the following operational launch strategies:

### Option 1: Phased Public Launch (Recommended)
- **Settings:** `PAYMENT_MODE="disabled"`, `MIDTRANS_IS_PRODUCTION="false"`.
- **Learner Experience:** The full 6-path Networking learning platform is deployed live on `netloka.biz.id`. All IT infrastructure labs and assessments are immediately accessible 100% free for SMK TKJ students and beginners.
- **Benefits:** Zero financial or merchant compliance risk during initial traffic ramp-up. Allows observation of server stability, database connection pooling, and email delivery before commercial transactions.

### Option 2: Production Staging Rehearsal (Pre-Live Smoke Test)
- **Settings:** `PAYMENT_MODE="sandbox"`, `MIDTRANS_SERVER_KEY="SB-Mid-server-..."`, `MIDTRANS_IS_PRODUCTION="false"`.
- **Learner Experience:** Platform deployed on production or isolated staging domain. Operator can run simulated QRIS payments using the Midtrans Simulator to verify real network routing before live switch.

### Option 3: Full Live Commercial Activation
- **Settings:** `PAYMENT_MODE="live"`, `MIDTRANS_IS_PRODUCTION="true"`.
- **Prerequisites:**
  1. Abangku provides live Midtrans Merchant credentials (`MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `MIDTRANS_MERCHANT_ID`) in `/srv/netloka/production/.env` on the VPS.
  2. Abangku approves official IDR pricing for premium packages.
  3. Operator legal terms (individual business operator Fikri Haikal) are published on `/terms` and `/privacy-policy`.

---

## 5. Rollback SOP & Incident Thresholds

If unexpected errors occur during production launch:

1. **Rollback Trigger Criteria:**
   - Application crash-loop or HTTP 500 error rate exceeding 1% over 5 minutes.
   - Database connection exhaustion or unhandled migration exception.
   - Unauthorized payment event or signature bypass attempt.
2. **Rollback Procedure:**
   - Revert container image to previous stable build tag:
     ```bash
     docker compose pull app:previous-stable && docker compose up -d app
     ```
   - Restore database snapshot if schema corruption occurred:
     ```bash
     bash scripts/restore-db.sh /srv/netloka/backups/pre-release-backup.dump
     ```
3. **Rollback Authority:**
   - Operator Fikri Haikal (`noreply@haikalariadma.my.id`).
