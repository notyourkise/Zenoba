# Zenoba Domain Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `zenoba.tech` canonical while retaining application/data continuity and converting `netloka.biz.id` into a path/query-preserving compatibility redirect.

**Architecture:** Explicitly authorized operational cutover after the Zenoba app PR merges. Existing production application/database remains the origin; DNS, TLS, OAuth, email, reverse proxy, metadata, and redirect behavior move in stages. No database, volume, Docker-network, backup, or `/srv/netloka` rename occurs.

**Tech Stack:** Hostinger DNS/domain, Cloudflare when active, Nginx/Certbot, Docker Compose, NextAuth 4/Google OAuth, SMTP, curl, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`

## Global Constraints

- No external mutation before Abangku authorizes that exact service and cutover window.
- Netloka stays live until Zenoba DNS/TLS, anonymous routes, auth, reset email, and rollback are proven.
- Use HTTPS 308 redirect from both legacy apex/www and preserve `$request_uri`.
- Keep both old/new Google OAuth callback URIs until verified post-cutover monitoring ends.
- Do not change production database/history, Compose resource names, backups, `/srv/netloka`, port, or unrelated VPS projects.
- Do not show a Zenoba-domain support address before its monitored mailbox exists.
- Record external evidence; never claim deployment from local tests or expose secrets.

## Review Focus

- A legacy reset URL with encoded token/query preserves exact path/query — Task 4.
- New-domain cookies may require sign-in but must not lose account data — Task 3.
- Zenoba OAuth callback works before switch and Netloka callback remains for rollback — Task 2.
- DNS/TLS error keeps Netloka live and causes no redirect loop — Tasks 1 and 4.
- Old reset tokens remain usable through their normal expiry or fail normally without token loss — Tasks 3 and 4.

---

### Task 1: Authority, baseline, recovery point, and stop rule

**Files:**
- Create: `docs/operations/zenoba-domain-cutover-record.md`
- Modify: `docs/HANDOFF.md`

**Interfaces:** consumes merged app release, authorized Hostinger/Cloudflare/VPS access, health endpoint, and named approvals; produces a redacted baseline and rollback owner.

- [ ] **Step 1: Obtain authorization**

Record Abangku's approval for DNS/Cloudflare, TLS/Nginx/VPS, Google OAuth, email, and a cutover window. Missing authority stops that service’s changes.

- [ ] **Step 2: Capture baseline**

Record timestamp, app revision, `docker compose ps`, active proxy source, certificate status, and status of Netloka home/About/legal/health. Store only status, URL, revision, and redacted paths.

- [ ] **Step 3: Create recoverable backup**

Run existing production backup without renaming its Netloka path/name; verify new protected artifact and documented restore location. Never restore production during cutover.

- [ ] **Step 4: Apply stop rule**

If DNS is parked, health fails, backup fails, or `nginx -T` differs materially from repo assumptions, record STOP and keep Netloka unchanged.

- [ ] **Step 5: Commit records**

```bash
git add docs/operations/zenoba-domain-cutover-record.md docs/HANDOFF.md
git commit -m "docs: record Zenoba cutover baseline"
```

### Task 2: Zenoba staging, TLS, OAuth, and SMTP prerequisites

**Files:**
- Create: `deploy/nginx/staging.zenoba.tech.conf`, `deploy/nginx/zenoba.tech.conf`
- Modify: `compose.staging.yml`, `deploy/staging.env.example`, `.env.example`, active-proxy config only after verifying it, and deployment docs.
- Preserve: `compose.production.yml`, production private resources, current Netloka virtual host.

**Interfaces:** consumes a DNS staging record, verified app upstream, merged Zenoba metadata, provider credentials outside Git; produces a verified Zenoba staging origin without legacy redirect.

- [ ] **Step 1: Provision non-disruptive records**

Create selected `staging.zenoba.tech` DNS to staging. Prepare Zenoba apex/www records but do not alter Netloka. Verify from two resolvers and record results.

- [ ] **Step 2: Add proxy templates**

Create Zenoba virtual-host templates with `server_name zenoba.tech www.zenoba.tech`, verified upstream, forwarded host/proto headers, and no redirect to Netloka. Copy active TLS conventions from `nginx -T`; validate with `nginx -t` before reload.

- [ ] **Step 3: Set staged origins safely**

Set staged `APP_URL`/`NEXTAUTH_URL` to HTTPS Zenoba origin in secret storage, not Git. Verify reset URL includes staged host and `/reset-password?token=...`.

- [ ] **Step 4: Complete OAuth/mail prerequisites**

Add `https://staging.zenoba.tech/api/auth/callback/google` and `https://zenoba.tech/api/auth/callback/google` while retaining Netloka callbacks. Provision/test a monitored Zenoba mailbox only when authorized; otherwise retain existing `EMAIL_FROM` and legal contact.

- [ ] **Step 5: Run staging smoke**

Verify HTTPS, `/`, `/about`, legal, health, credentials login, Google OAuth, forgot/reset password, and learner progress after new-domain sign-in. Record any expected cookie reauthentication.

- [ ] **Step 6: Commit safe templates**

```bash
git add deploy/nginx compose.staging.yml deploy/staging.env.example .env.example docs
git commit -m "chore: prepare Zenoba domain cutover"
```

### Task 3: Release Zenoba app revision to existing production origin

**Files:**
- Modify: `CHANGELOG.md`, `docs/HANDOFF.md`, `docs/operations/zenoba-domain-cutover-record.md`

**Interfaces:** consumes CI-passed merged release, backup, staging evidence, and deploy authority; produces Zenoba code on existing origin, while Netloka remains live.

- [ ] **Step 1: Verify candidate**

Confirm merged main SHA, current CI, clean deployment source, and zero pending migration. Stop on mismatch.

- [ ] **Step 2: Deploy with existing procedure**

Use current deployment and `/srv/netloka` root; do not rename Compose resources or run a database migration. Record revision/health.

- [ ] **Step 3: Smoke test origin**

On Netloka verify anonymous home/About/legal/health, credentials sign-in, Google OAuth, reset issue/consume, learner paths, Developer denial for learner, and payment-disabled behavior.

- [ ] **Step 4: Enforce rollback**

Any failure redeploys prior verified app revision without DB rollback; DNS remains unchanged.

- [ ] **Step 5: Commit redacted release record**

```bash
git add CHANGELOG.md docs/HANDOFF.md docs/operations/zenoba-domain-cutover-record.md
git commit -m "docs: record Zenoba production release"
```

### Task 4: Canonical switch and compatibility redirects

**Files:**
- Modify: `deploy/nginx/netloka.biz.id.conf`, `deploy/nginx/zenoba.tech.conf`
- Modify: authorized DNS/proxy/VPS state outside Git, `docs/operations/zenoba-domain-cutover-record.md`, `CHANGELOG.md`, `docs/HANDOFF.md`

**Interfaces:** consumes verified Zenoba TLS/host, existing app upstream, both callbacks, cutover authority; produces Zenoba canonical traffic and exact legacy redirects.

- [ ] **Step 1: Activate Zenoba DNS/TLS**

Point apex/www to production; issue/validate certificates; run `nginx -t`; confirm `curl --fail --location https://zenoba.tech/api/health` before changing Netloka.

- [ ] **Step 2: Set production origin values**

Set secret-store `APP_URL`/`NEXTAUTH_URL` to `https://zenoba.tech`, redeploy app only, confirm reset mail uses Zenoba link, retain callbacks.

- [ ] **Step 3: Convert legacy hosts after Zenoba passes**

Make HTTP and HTTPS Netloka apex/www return `308 https://zenoba.tech$request_uri`. Never redirect Zenoba back to Netloka.

- [ ] **Step 4: Run probes**

```bash
curl -I 'https://netloka.biz.id/learn?from=bookmark'
curl -I 'https://netloka.biz.id/reset-password?token=abc%2B123&source=mail'
curl --fail --location 'https://zenoba.tech/api/health'
```

Verify 308/Location, final URL, TLS, no loop, anonymous pages, credentials, OAuth, real reset email, and learner data after sign-in.

- [ ] **Step 5: Roll back on failure**

Restore prior Netloka route/DNS and origin settings, retain data/callbacks, record failure, stop.

- [ ] **Step 6: Commit evidence**

```bash
git add deploy/nginx docs/operations/zenoba-domain-cutover-record.md CHANGELOG.md docs/HANDOFF.md
git commit -m "deploy: switch canonical domain to Zenoba"
```

### Task 5: Compatibility monitoring

**Files:** Modify `docs/operations/zenoba-domain-cutover-record.md`, `docs/HANDOFF.md`, `CHANGELOG.md`.

- [ ] **Step 1: Monitor agreed signals**

Check health, TLS expiry, redirect errors, auth failures, reset delivery, and legacy deep links for the agreed period; do not infer active-user counts without analytics evidence.

- [ ] **Step 2: Keep compatibility**

Maintain Netloka redirects and both OAuth callbacks until agreed monitoring completes. Do not retire legacy domain or private identifiers.

- [ ] **Step 3: Close or create a separate follow-up**

Record results, canonical URL, rollback status, and remaining work. A GitHub rename, domain retirement, DB/volume/network rename, or VPS-root move requires a new design and authority.

- [ ] **Step 4: Commit handoff**

```bash
git add docs/operations/zenoba-domain-cutover-record.md docs/HANDOFF.md CHANGELOG.md
git commit -m "docs: record Zenoba cutover monitoring"
```
