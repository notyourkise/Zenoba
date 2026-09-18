# Staging Environment Verification Runbook

**Document version:** 1.0  
**Effective date:** 2026-09-18 WITA  
**Environment:** Staging (`https://staging.netloka.biz.id`)  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Contact / Mailbox:** noreply@haikalariadma.my.id  
**Host deployment root:** `/srv/netloka/staging`  
**Compose project:** `netloka-staging`

---

## 1. Scope and Isolation Boundaries

The Netloka staging environment is an isolated, production-like replica established to validate infrastructure, migrations, security controls, email dispatch, and user journeys prior to production release.

Strict operational isolation rules:

1. **Host root isolation:** Staging runs exclusively from `/srv/netloka/staging`. It has no access to `/opt/netloka` (production root) or any other host site.
2. **Configuration isolation:** Configuration is read from `/srv/netloka/staging/.env` (permissions `0600`, owned by `deploy:deploy`). It must never reside inside the Git repository.
3. **Database isolation:** Staging uses its own PostgreSQL container and volume (`netloka-staging_netloka_staging_postgres_data`). No database connections, schemas, credentials, or backups are shared with production.
4. **Network isolation:**
   - PostgreSQL (`db`) and migration runner (`migrate`) reside exclusively on the internal network `netloka-staging_netloka_staging_internal`. The database port is not published to the host.
   - Application (`app`) joins the internal network and the project-scoped bridge network `netloka_staging_edge`.
   - Application listens on loopback only at `127.0.0.1:3001` for the host Nginx reverse proxy.
5. **Domain and routing isolation:** Staging operates on `staging.netloka.biz.id`, completely segregated from `netloka.biz.id`.

---

## 2. Inventory and Configuration Categories

All secret values must reside solely in `/srv/netloka/staging/.env` and must never be committed to Git, printed in logs, or pasted into documentation.

| Configuration Category | Environment Key | Staging Policy / Purpose |
| --- | --- | --- |
| Node Environment | `NODE_ENV` | Must be `production` to enforce optimized bundling and secure defaults. |
| Database Container | `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Dedicated staging database credentials. |
| Database URL | `DATABASE_URL` | Connects to Docker internal service: `postgresql://...db:5432/netloka?schema=public`. |
| NextAuth Secret | `NEXTAUTH_SECRET`, `AUTH_SECRET` | Cryptographically random 32+ character secrets for JWT signing and session validation. |
| Application URLs | `NEXTAUTH_URL`, `APP_URL` | Fixed to `https://staging.netloka.biz.id`. |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Provisioned staging OAuth client credentials with authorized callback `https://staging.netloka.biz.id/api/auth/callback/google`. |
| SMTP Configuration | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | Hostinger SMTP service (`smtp.hostinger.com`, port `465`, secure `true`, user/from `noreply@haikalariadma.my.id`). |
| Commerce Gate | `PAYMENT_MODE` | Set to `disabled` during Sprint 41. Live or sandbox payment is strictly prohibited until Sprint 42. |

---

## 3. Step-by-Step Staging Verification Protocol

### Step 1: Pre-Flight Environment Validation

Run as the `deploy` user from `/srv/netloka/staging/repo`:

```bash
set -euo pipefail
STAGING_ENV_FILE=/srv/netloka/staging/.env /srv/netloka/staging/repo/scripts/validate-staging-env.sh
```

**Verification criteria:**
- Script exits with code 0.
- Confirms `.env` file exists outside the repo and has permissions `0600`.
- Confirms Docker Compose configuration renders cleanly without syntax errors or missing variables.

### Step 2: Database Connectivity and Migration Status

Verify PostgreSQL health and forward-only migration status:

```bash
set -euo pipefail
compose=(docker compose --project-name netloka-staging --env-file /srv/netloka/staging/.env -f compose.staging.yml)

# Verify database container is running and healthy
"${compose[@]}" ps db

# Check migration status
STAGING_ENV_FILE=/srv/netloka/staging/.env "${compose[@]}" run --rm migrate npx prisma migrate status
```

**Verification criteria:**
- `db` service reports status `healthy`.
- Database has no published host port (`ss -ltn '( sport = :5432 )'` returns empty).
- `prisma migrate status` confirms the database schema is fully up-to-date with all applied forward-only migrations.

### Step 3: Application Health and Container Healthcheck

Deploy and check the application container:

```bash
STAGING_ENV_FILE=/srv/netloka/staging/.env "${compose[@]}" up -d --build app
"${compose[@]}" ps app
```

Test internal loopback HTTP endpoint:

```bash
curl -i http://127.0.0.1:3001/api/health
```

**Verification criteria:**
- App container reports `healthy` in `docker compose ps app`.
- Endpoint returns HTTP `200 OK` with JSON `{ "status": "healthy", "database": "connected" }`.
- Response latency is under 500ms.

### Step 4: Reverse Proxy and TLS Verification

Verify host Nginx reverse proxy configuration and TLS termination:

```bash
# Validate Nginx syntax
sudo /usr/sbin/nginx -t

# Check public endpoint via curl
curl -Iv https://staging.netloka.biz.id/api/health
```

**Verification criteria:**
- Nginx configuration test syntax is OK.
- TLS negotiation succeeds with TLS 1.2 or TLS 1.3.
- Certificate is valid and issued for `staging.netloka.biz.id`.
- Request returns HTTP `200 OK`.

### Step 5: Edge and Transport Security Headers

Verify that all required HTTP security headers are present on responses:

```bash
curl -s -D - https://staging.netloka.biz.id/ -o /dev/null
```

**Verification criteria:**
- `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options`: `nosniff`
- `X-Frame-Options`: `DENY`
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Content-Security-Policy`: contains `frame-ancestors 'none'` and safe source directives.

### Step 6: Cookie Security Policy

Inspect cookies set during session generation (e.g. sign-in):

**Verification criteria:**
- Over HTTPS, session and CSRF cookies use the `__Secure-` or `__Host-` prefix where applicable.
- All session cookies have `Secure; HttpOnly; SameSite=Lax`.
- No sensitive session token is accessible via JavaScript `document.cookie`.

### Step 7: SMTP and Transactional Email Delivery

Verify live transactional email dispatch via Hostinger SMTP:

1. Navigate to `https://staging.netloka.biz.id/forgot-password`.
2. Request a password reset for a designated test account (e.g. `test-staging@netloka.biz.id`).
3. Verify receipt of the password reset email in the test mailbox.
4. Verify email headers:
   - Sender: `noreply@haikalariadma.my.id`
   - Return-Path: `noreply@haikalariadma.my.id`
   - TLS delivery: encrypted transport
5. Verify the reset link points to `https://staging.netloka.biz.id/reset-password?token=...`.
6. Confirm the reset token expires after 30 minutes.

### Step 8: Abuse Controls and Rate Limiting

Verify persistent PostgreSQL-backed password reset rate limiting:

1. Trigger more than 3 password reset requests for the same address within 15 minutes.
2. Confirm the system enforces rate limiting with an HTTP 429 response or enumeration-neutral delay.
3. Confirm timing defense prevents username enumeration.

### Step 9: Google OAuth Authentication

Verify Google OAuth integration in staging:

1. Navigate to `https://staging.netloka.biz.id/sign-in`.
2. Initiate sign-in with a pre-authorized test Google account.
3. Verify redirect to Google authentication consent screen.
4. Complete consent; verify redirect back to `https://staging.netloka.biz.id/api/auth/callback/google`.
5. Verify successful authentication and assignment of the `LEARNER` role.
6. Verify account linking safeguard: attempting to link a Google account with an existing credentials account without verified ownership is rejected.
7. Verify developer login block: accounts with the `DEVELOPER` role are prohibited from logging in via Google OAuth.

### Step 10: Staging-Only User Lifecycle Journey

Execute a complete end-to-end learner journey:

1. **Register:** Create a new test learner account at `/sign-up`.
2. **Dashboard:** Access `/dashboard`; verify initial stats (0 XP, Level 1).
3. **Learn:** Open path `/learn/welcome-to-networking`, complete lesson 1, and submit formative quiz.
4. **XP & Progress:** Confirm XP awards and progress persistence in database.
5. **Session Invalidation:** Update password via `/settings` or trigger password reset; verify prior session is invalidated.
6. **Log Out:** Log out and verify redirection to `/sign-in`.

### Step 11: Sensitive Log Redaction and Backup Verification

Check Docker and host logs:

```bash
docker compose --project-name netloka-staging -f compose.staging.yml logs --tail=100 app
```

**Verification criteria:**
- Zero plaintext passwords, auth tokens, database credentials, or SMTP secrets appear in stdout/stderr logs.
- Daily automated backup cron is verified:
  ```bash
  crontab -l | grep backup-staging-postgres.sh
  ```
- Staging backup file exists and is non-empty:
  ```bash
  ls -lh /srv/netloka/staging/backups/postgres/
  ```

---

## 4. Verification Sign-Off Template

When staging verification is executed, record the results in the following format:

```text
Staging Verification Sign-Off
=============================
Date & Time (WITA): YYYY-MM-DD HH:mm WITA
Deployed Git Commit: <commit-sha>
Operator: Pengelola Perseorangan Platform Netloka (Fikri Haikal)
Verified By: Anto (AI Pair) & Abangku (Owner)

Checklist Results:
[x] Step 1: Pre-Flight Environment Validation
[x] Step 2: Database Connectivity & Migration Status
[x] Step 3: Application Health & Internal Healthcheck
[x] Step 4: Reverse Proxy & TLS Verification
[x] Step 5: Edge & Transport Security Headers
[x] Step 6: Cookie Security Policy
[x] Step 7: SMTP & Transactional Email Delivery
[x] Step 8: Abuse Controls & Rate Limiting
[x] Step 9: Google OAuth Authentication
[x] Step 10: Staging-Only User Lifecycle Journey
[x] Step 11: Sensitive Log Redaction & Backup Verification

Status: VERIFIED / PROCEED TO TASK 41.3
Notes: All staging checks passed without regression or credential exposure.
```
