# Security Incident Response & Outage Runbook

Last updated: **2026-09-18 15:05 WITA**.

## 1. Purpose and Scope

This runbook establishes the formal Standard Operating Procedure (SOP) for detecting, categorizing, containing, remediating, and reporting security incidents, service outages, and data security events for the Netloka platform (`netloka.biz.id`).

- **Operator / Primary Incident Commander:** Fikri Haikal (Lead Developer & Operator)
- **Incident Escalation Email:** `noreply@haikalariadma.my.id`
- **Regulatory Notification Requirement:** UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (Pasal 46: kewajiban pemberitahuan kegagalan pelindungan data pribadi maksimal 3 x 24 jam).

---

## 2. Incident Severity Classification Matrix

| Level | Severity | Description & Triggers | Target Response SLA | Target Resolution SLA |
| --- | --- | --- | --- | --- |
| **SEV-1** | **Critical** | Personal data breach, server intrusion, compromised developer elevation secret, complete application outage, or ongoing DDoS bypassing Cloudflare. | **< 15 minutes** | **< 4 hours** |
| **SEV-2** | **High** | Critical service degraded: SMTP failure preventing password resets, Google OAuth outage, PostgreSQL connection pool exhaustion, payment webhook processing failure. | **< 1 hour** | **< 12 hours** |
| **SEV-3** | **Medium** | Isolated simulator bug, assessment scoring engine anomaly, partial curriculum loading error, elevated 4xx/5xx error spikes on non-auth routes. | **< 6 hours** | **< 48 hours** |
| **SEV-4** | **Low** | Minor UI layout glitch, cosmetic copy typo, non-blocking build warnings. | Next regular sprint cycle | Standard backlog |

---

## 3. Incident Handling Lifecycle

```text
[1. DETECT] → [2. CONTAIN] → [3. INVESTIGATE] → [4. ERADICATE & RESTORE] → [5. NOTIFY] → [6. POST-MORTEM]
```

### 3.1 Phase 1: Detection & Identification
Monitor authoritative operational telemetry:
1. **Security Audit Events:** Inspect `security_events` table in PostgreSQL:
   ```sql
   SELECT "type", "severity", "userId", "metadata", "createdAt" 
   FROM "security_events" 
   WHERE "severity" IN ('WARN', 'CRITICAL') 
   ORDER BY "createdAt" DESC 
   LIMIT 50;
   ```
2. **Next.js & Application Logs:** Inspect Docker container logs (`docker compose logs -f app`).
3. **Edge Telemetry:** Inspect Cloudflare Firewall Events, WAF blocks, and DNS health status.
4. **Endpoint Health:** Query `GET /api/health` to assess database latency and runtime status.

---

### 3.2 Phase 2: Containment & Isolation
Execute immediate containment actions according to incident scope:

#### Scenario A: Compromised User or Developer Account
1. Invalidate all active JWT sessions immediately by updating `validAfter`:
   ```sql
   INSERT INTO "user_security_states" ("userId", "validAfter", "updatedAt")
   VALUES ('<TARGET_USER_ID>', NOW(), NOW())
   ON CONFLICT ("userId") 
   DO UPDATE SET "validAfter" = NOW(), "updatedAt" = NOW();
   ```
2. Revoke any active developer elevation sessions:
   ```sql
   UPDATE "developer_elevation_sessions" 
   SET "revokedAt" = NOW() 
   WHERE "userId" = '<TARGET_USER_ID>' AND "revokedAt" IS NULL;
   ```

#### Scenario B: Distributed Abuse or Denial of Service (DoS)
1. Enable **Cloudflare "Under Attack" Mode** on `netloka.biz.id` via Cloudflare Dashboard.
2. Block offending IP ranges or ASNs at Cloudflare WAF.
3. PostgreSQL rate limiter (`AuthRateLimit`) automatically isolates abusive password reset attempts.

#### Scenario C: Severe Data Corruption or Application Crash
1. Put Caddy into maintenance mode to prevent further database corruption:
   ```caddy
   # /etc/caddy/Caddyfile emergency maintenance response
   respond "Netloka sedang dalam pemeliharaan sistem darurat. Silakan coba beberapa saat lagi." 503
   ```
2. Reload Caddy: `systemctl reload caddy`.

---

### 3.3 Phase 3 & 4: Eradication, Recovery & Secret Rotation
1. **Secret Rotation Protocol:**
   If environment secrets are suspected to be exposed, immediately rotate them in `.env`:
   - `AUTH_SECRET` & `NEXTAUTH_SECRET`: Generate new 32-byte hex secret (`openssl rand -hex 32`). All active learner sessions will be cleanly logged out.
   - `SMTP_PASSWORD`: Rotate in Hostinger Webmail/Control Panel and update `.env`.
   - `GOOGLE_CLIENT_SECRET`: Rotate in Google Cloud Console.
   - `DATABASE_URL`: Rotate PostgreSQL user password via `ALTER USER netloka WITH PASSWORD '...';`.
2. **Database Snapshot Restore:**
   If database integrity was compromised, restore from the latest clean pre-deployment backup per [`release-baseline-verification.md`](file:///c:/laragon/www/netloka/docs/operations/release-baseline-verification.md):
   ```bash
   pg_restore --clean --if-exists -v -h 127.0.0.1 -U netloka -d netloka /var/backups/netloka/netloka_pre_deploy_<TIMESTAMP>.dump
   ```
3. Restart application containers:
   ```bash
   docker compose down && docker compose up -d
   ```

---

### 3.4 Phase 5: Notification & Legal Disclosure (UU PDP Pasal 46)

If an incident involves unauthorized access, disclosure, or alteration of **personal data**:

1. **Notification Deadline:** The operator must submit written notification within **maksimal 3 x 24 jam (72 jam)** to:
   - **Lembaga Pelindungan Data Pribadi / Komdigi**.
   - **Subjek Data Pribadi (Pengguna yang terdampak)** melalui email terdaftar.
2. **Mandatory Notification Contents:**
   - Deskripsi data pribadi yang terungkap atau terkompromikan.
   - Kapan dan bagaimana kegagalan pelindungan data terjadi.
   - Langkah penanganan dan pemulihan yang telah diambil oleh pengelola.
   - Kontak yang dapat dihubungi oleh pengguna (`noreply@haikalariadma.my.id`).

---

### 3.5 Phase 6: Post-Mortem & Corrective Architecture Action

Within 5 business days following a SEV-1 or SEV-2 incident, the Incident Commander must document:
1. **Root Cause Analysis (RCA):** The technical vulnerability or operational failure.
2. **Impact Assessment:** Number of affected accounts, duration of downtime, data affected.
3. **Corrective Plan:** Preventive code patches, automated test additions, or architectural revisions.
4. **Log Retention:** Retain all associated logs and forensic evidence securely for 12 months.
