# Zenoba Operator Readiness & Governance Runbook

## Current rebrand instructions — 2026-10-12 WITA

- Zenoba is independently operated by Fikri Haikal, not a corporation or separate legal entity.
- Customer complaints, account help, privacy requests, and operational inquiries: `founder@zenoba.tech`.
- Transactional email sender/SMTP user: `hello@zenoba.tech`; founder must not be used for sending. Local credentials and live delivery remain unverified.
- `zenoba.tech` is the intended new domain, not proof of a completed cutover. Preserve existing production databases, volumes, backups, and `/srv/netloka` paths.
- The dated baseline below is historical evidence, not current contact or integration instructions. Its old mailbox statements do not verify Zenoba delivery. Recheck readiness before release.

## Historical baseline — 2026-09-18 (superseded contacts)

Last updated: **2026-09-18 15:05 WITA**.

## 1. Context and Objective

This runbook establishes the formal operational readiness, organizational ownership, data governance, and regulatory compliance baseline for the Netloka learning platform as defined in **Milestone 15 / Sprint 41 / Task 41.1**.

Netloka (`netloka.biz.id`) operates as an interactive IT infrastructure education platform tailored for SMK TKJ students, beginners, and aspiring systems/network engineers.

---

## 2. Organization Ownership & Operator Identity

Netloka operates under an individual developer and independent operator model in accordance with applicable Indonesian digital platform regulations:

- **Entity / Operator Identity:** Pengelola Perseorangan Platform Netloka
- **Lead Developer & System Operator:** Fikri Haikal
- **Primary Platform Domain:** `netloka.biz.id`
- **Official Operational & Privacy Mailbox:** `noreply@haikalariadma.my.id`
- **Mailbox Infrastructure:** Hostinger Business Mailbox (active, monitored inbox)
- **Applicable Legal Framework:**
  - Undang-Undang No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).
  - Undang-Undang No. 1 Tahun 2024 tentang Perubahan Kedua atas UU No. 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE).
  - Peraturan Menteri Komunikasi dan Informatika No. 5 Tahun 2020 tentang Penyelenggara Sistem Elektronik Lingkup Privat.

---

## 3. Operational Roles and Escalation Matrix

| Role | Designated Lead | Primary Contact | Responsibilities |
| --- | --- | --- | --- |
| **Data Controller (Pengendali Data Pribadi)** | Fikri Haikal | `noreply@haikalariadma.my.id` | Fulfilling data subject rights, privacy compliance, policy updates, retention oversight. |
| **System & Infrastructure Operator** | Fikri Haikal | `noreply@haikalariadma.my.id` | Server administration, Docker containers, database maintenance, deployment execution. |
| **Security & Incident Officer** | Fikri Haikal | `noreply@haikalariadma.my.id` | Vulnerability assessment, incident response, secret rotation, security event triage. |
| **Billing & Commercial Operator** | Fikri Haikal | `noreply@haikalariadma.my.id` | Midtrans QRIS reconciliation, order settlement, entitlement troubleshooting. |

---

## 4. Third-Party Data Processors & Infrastructure Registry

All external services integrated with Netloka are documented with strict functional boundaries:

| Service / Provider | Corporate Entity | Functional Role | Data Processed | Boundary & Controls |
| --- | --- | --- | --- | --- |
| **Cloudflare** | Cloudflare, Inc. (USA) | DNS, CDN Edge, DDoS mitigation, Edge SSL | Client IP, TLS handshake, request headers | Proxied traffic; HTTPS enforced; no persistent user data stored. |
| **Caddy Server** | Open Source (Internal VPS) | Reverse proxy, local TLS management | HTTP request routing, connection logs | Runs locally on VPS; headers forwarded to Next.js; logs rotated. |
| **Hostinger** | Hostinger International Ltd. (Cyprus/Lithuania) | SMTP relay & operational mailbox | Recipient email address, password reset token URLs | Dedicated Hostinger mailbox (`noreply@haikalariadma.my.id`); TLS encrypted. |
| **Google Cloud OAuth** | Google LLC (USA) | Federated OAuth 2.0 authentication | Google User ID, verified email, name, avatar | Scopes restricted to `openid`, `email`, `profile`. `allowDangerousEmailAccountLinking: false` enforced. |
| **PostgreSQL Database** | Internal (VPS Linux) | Persistent relational datastore | User accounts, progress, attempts, audit logs | Bound to local loopback / Docker network; encrypted connection string; daily backups. |
| **Midtrans** *(Sprint 42)* | PT Midtrans (Indonesia) | Dynamic QRIS payment gateway | Order ID, gross amount, transaction status | Server-to-server signature validation; webhook idempotency; no credit card data stored. |

---

## 5. Data Subject Rights (Hak Subjek Data — UU PDP No. 27/2022)

Netloka recognizes and enforces the legal rights of data subjects:

### 5.1 Request Channel and SLA
- **Submission Channel:** Inquiries, export requests, and deletion requests must be directed to `noreply@haikalariadma.my.id`.
- **Response SLA:** Maximum **30 (thirty) calendar days** from verified identity confirmation.

### 5.2 Specific Rights Handling
1. **Right to Access & Information (Pasal 5 & 6):** Learners may request confirmation of personal data held, processing purpose, and third-party processors.
2. **Right to Rectification (Pasal 7):** Name can be updated directly via `/profile`. Email updates require verification via the operational mailbox.
3. **Right to Erasure / Deletion (Pasal 8):** Upon verified request, learner account records, authentication tokens, and progress drafts are permanently deleted or irreversibly anonymized in PostgreSQL.
4. **Right to Data Portability (Pasal 13):** A structured JSON export of learner progress, quiz attempts, and achievements will be provided upon verified request.
5. **Right to Withdraw Consent (Pasal 9):** Learners may terminate their account at any time, terminating all active JWT sessions.

---

## 6. Data Retention and Hygiene Policy

1. **Active Learner Data:**
   - Account profiles, curriculum progress (`UserLessonProgress`), quiz attempts, and XP ledger entries are retained indefinitely while the account remains active to provide continuous educational progression.
2. **Inactive Accounts:**
   - Accounts with no authentication activity for greater than 24 consecutive months are flagged for archival and subject to 30-day notice prior to cleanup.
3. **Authentication Security Tokens:**
   - Password reset tokens expire after **30 minutes**; expired tokens are cleaned up after 30 days.
   - Persistent rate limit records (`AuthRateLimit`) expire after **15 minutes**; automatically pruned via `pruneExpiredRateLimits`.
   - Developer elevation sessions expire after **15 minutes** (idle timeout) and maximum **4 hours** total duration.
4. **Security Audit Logs:**
   - `security_events` table logs are retained for **12 months** for forensic auditing before archival.

---

## 7. Educational & Child User Protection Policy

- **Target Learner Cohort:** SMK TKJ vocational students and self-taught beginners (frequently ages 15–18).
- **Zero Real Credential Policy:** Simulator terminals, topology builders, and consultant cases are strictly isolated sandbox environments. Learners are explicitly instructed never to input real production network passwords, school network credentials, or sensitive personal data into practice exercises.
- **Parental & Guardian Consent:** Terms of Service and Privacy Policy explicitly stipulate that underage learners utilize the educational platform with parent or guardian knowledge and consent.

---

## 8. Commercial Policy & Dispute Resolution

- **Product Categorization:** Paid digital educational curriculum access (modular networking courses and consultant case packs).
- **Payment Gateway:** Midtrans Dynamic QRIS (Indonesian Rupiah).
- **Refund Terms:** Once digital curriculum content or consultant simulation access has been unlocked and accessed, purchases are non-refundable, except in cases of verified duplicate transactions or persistent technical gateway failures.
- **Dispute Escalation:** Payment inquiries and transaction dispute claims are serviced via `noreply@haikalariadma.my.id` with order reference and Midtrans transaction ID within 7 business days.

---

## 9. Backup & Disaster Recovery Ownership

- **Lead Operator:** Fikri Haikal
- **Backup Frequency:**
  - Automated weekly PostgreSQL full snapshot dumps.
  - Mandatory manual pre-deployment binary snapshot before any database migration (`npm run db:deploy`).
- **Storage Location:** Secure off-site directory `/var/backups/netloka/` with restricted `0600` permissions.
- **Verification:** Backup restoration is rehearsed in an isolated staging environment per [`release-baseline-verification.md`](file:///c:/laragon/www/netloka/docs/operations/release-baseline-verification.md).
