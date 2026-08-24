# Netloka Staging Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a repeatable, isolated manual staging deployment for Netloka on the approved VPS.

**Architecture:** A standalone Next.js image runs as the `app` service in the `netloka-staging` Compose project and publishes only host loopback port 3001. A private PostgreSQL service has no host port and stores data in its own named volume. Host Nginx proxies the staging hostname; a narrowly scoped root bootstrap establishes the Nginx/Certbot interface for the non-root deploy user.

**Tech Stack:** Node 20.19, Next.js 16 standalone output, Docker Engine 29.7, Docker Compose 2.40, PostgreSQL 16, Prisma 7, host Nginx, Certbot, cron.

**Spec:** `docs/superpowers/specs/2026-08-24-staging-deployment-design.md`

## Global Constraints

- Use `/srv/netloka/staging` as the VPS root, owned by `deploy`.
- Use only the `netloka-staging` Compose project and its Netloka-specific resources.
- Publish the app only as `127.0.0.1:3001:3000`; publish no database port.
- Do not commit staging secrets, certificate email, private keys, or database credentials.
- Before every pending migration, the atomic backup command must succeed.
- Do not run broad Docker cleanup commands or mutate unrelated host workloads.
- Production, Cloudflare API automation, object-storage replication, and CI deployment remain out of scope.

---

### Task 1: Build a production-ready Netloka container

**Files:**
- Create: `Dockerfile`, `.dockerignore`
- Modify: `next.config.ts`, `package.json`
- Test: Docker image build and standalone health endpoint

**Interfaces:**
- Produces: a Node 20.19 image whose runtime command is `node server.js` on port 3000.
- Produces: `npm run db:deploy`, which invokes `prisma migrate deploy` for the maintenance service.

- [ ] **Step 1: Add the Prisma production-migration command**

Modify `package.json` scripts:

```json
"db:deploy": "prisma migrate deploy"
```

- [ ] **Step 2: Configure Next standalone output**

Modify `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

- [ ] **Step 3: Add the multi-stage Dockerfile**

Create `Dockerfile` with three stages:

```dockerfile
FROM node:20.19-alpine AS base
WORKDIR /app

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run db:generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 4: Exclude unsafe and unnecessary Docker build context**

Create `.dockerignore` with at least:

```text
.git
.worktrees
.next
node_modules
src/generated
.env
.env.*
!.env.example
coverage
playwright-report
test-results
backups
```

- [ ] **Step 5: Verify the image locally**

Run:

```powershell
docker build -t netloka-staging-test:local .
docker run --rm -d --name netloka-staging-test -p 127.0.0.1:3101:3000 netloka-staging-test:local
Invoke-WebRequest http://127.0.0.1:3101/api/health
docker stop netloka-staging-test
```

Expected: the health response has HTTP 200 and `status: "ok"`; no container remains after the test.

- [ ] **Step 6: Commit the container runtime**

```powershell
git add Dockerfile .dockerignore next.config.ts package.json package-lock.json
git commit -m "feat: add staging application container"
```

### Task 2: Create isolated Compose, deploy, and backup operations

**Files:**
- Create: `compose.staging.yml`, `deploy/staging.env.example`, `scripts/deploy-staging.sh`, `scripts/backup-staging-postgres.sh`
- Test: `docker compose config`, Bash syntax validation, local private-network runtime

**Interfaces:**
- Consumes: a private VPS `.env` containing `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
- Produces: services `app`, `db`, and profile-gated `migrate` under project name `netloka-staging`.
- Produces: an atomic backup file named `netloka-staging-YYYYmmdd-HHMMSS.dump`.

- [ ] **Step 1: Add the staging environment template**

Create `deploy/staging.env.example`:

```dotenv
POSTGRES_USER=netloka
POSTGRES_PASSWORD=replace-with-a-long-random-password
POSTGRES_DB=netloka
NODE_ENV=production
```

The real VPS `.env` additionally sets `DATABASE_URL` to the internal `db:5432` hostname and never enters Git.

- [ ] **Step 2: Add the Compose project**

Create `compose.staging.yml` with:

```yaml
name: netloka-staging
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    env_file: ${STAGING_ENV_FILE:?STAGING_ENV_FILE must point to the external staging environment file}
    volumes:
      - netloka_staging_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 5s
      timeout: 5s
      retries: 12
    networks: [netloka_staging_internal]
  app:
    build: { context: ., dockerfile: Dockerfile }
    restart: unless-stopped
    env_file: ${STAGING_ENV_FILE:?STAGING_ENV_FILE must point to the external staging environment file}
    environment:
      PORT: 3000
      HOSTNAME: 0.0.0.0
    ports: ["127.0.0.1:3001:3000"]
    depends_on:
      db: { condition: service_healthy }
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 12
    networks: [netloka_staging_internal]
  migrate:
    build: { context: ., dockerfile: Dockerfile, target: builder }
    env_file: ${STAGING_ENV_FILE:?STAGING_ENV_FILE must point to the external staging environment file}
    command: npm run db:deploy
    profiles: ["maintenance"]
    depends_on:
      db: { condition: service_healthy }
    networks: [netloka_staging_internal]
networks:
  netloka_staging_internal:
    internal: true
volumes:
  netloka_staging_postgres_data:
```

- [ ] **Step 3: Add an atomic PostgreSQL backup script**

Create `scripts/backup-staging-postgres.sh` with `set -euo pipefail`, `umask 077`, a `mktemp` file under `/srv/netloka/staging/backups/postgres`, and a cleanup trap. Execute the dump only through the staging Compose project:

```bash
STAGING_ENV_FILE="$STAGING_ROOT/.env" docker compose --project-name netloka-staging --env-file "$STAGING_ROOT/.env" -f "$REPO_DIR/compose.staging.yml" exec -T db \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$temporary_dump"
mv "$temporary_dump" "$final_dump"
find "$BACKUP_DIR" -type f -name 'netloka-staging-*.dump' -mtime +6 -delete
```

The script must reject a missing `.env`, never echo its values, and delete its temporary dump on any failure.

- [ ] **Step 4: Add the fast-forward-only deploy script**

Create `scripts/deploy-staging.sh` with `set -euo pipefail`. It must:

```bash
git fetch origin main
git checkout main
git pull --ff-only origin main
STAGING_ENV_FILE="$STAGING_ROOT/.env" docker compose --project-name netloka-staging --env-file "$STAGING_ROOT/.env" -f compose.staging.yml up -d db
if STAGING_ENV_FILE="$STAGING_ROOT/.env" docker compose --project-name netloka-staging --env-file "$STAGING_ROOT/.env" -f compose.staging.yml run --rm migrate npx prisma migrate status 2>&1 | grep -q "Following migration.*have not yet been applied"; then
  "$REPO_DIR/scripts/backup-staging-postgres.sh"
fi
STAGING_ENV_FILE="$STAGING_ROOT/.env" docker compose --project-name netloka-staging --env-file "$STAGING_ROOT/.env" -f compose.staging.yml --profile maintenance run --rm migrate
STAGING_ENV_FILE="$STAGING_ROOT/.env" docker compose --project-name netloka-staging --env-file "$STAGING_ROOT/.env" -f compose.staging.yml up -d --build app
```

It must verify only the `netloka-staging` service health plus the staging health URL, and must never use Docker prune, `down -v`, or commands targeting generic Docker resources.

- [ ] **Step 5: Validate Compose and scripts locally**

Run:

```powershell
bash -n scripts/deploy-staging.sh
bash -n scripts/backup-staging-postgres.sh
$stagingEnvFile = Join-Path ([System.IO.Path]::GetTempPath()) "netloka-staging-compose-$PID.env"
Copy-Item deploy/staging.env.example $stagingEnvFile
$env:STAGING_ENV_FILE = $stagingEnvFile
docker compose --env-file $stagingEnvFile -f compose.staging.yml config
Remove-Item Env:STAGING_ENV_FILE
Remove-Item $stagingEnvFile
```

Expected: Bash returns zero and Compose renders an app bound only to `127.0.0.1:3001`, with no `ports` key for `db`.

- [ ] **Step 6: Commit isolated staging operations**

```powershell
git add compose.staging.yml deploy/staging.env.example scripts/deploy-staging.sh scripts/backup-staging-postgres.sh
git commit -m "feat: add isolated staging compose operations"
```

### Task 3: Add host bootstrap and operator runbook

**Files:**
- Create: `deploy/nginx/staging.netloka.biz.id.conf`, `deploy/bootstrap-staging-host.sh`, `docs/deployment/staging.md`
- Test: Bash syntax validation; VPS Nginx syntax validation after the administrator bootstrap

**Interfaces:**
- Consumes: the staging Compose app on loopback port 3001.
- Produces: one dedicated Nginx site, root-owned restricted sudo wrappers, and an operator procedure.

- [ ] **Step 1: Add the dedicated Nginx site**

Create `deploy/nginx/staging.netloka.biz.id.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name staging.netloka.biz.id;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- [ ] **Step 2: Add a root-only bootstrap**

Create `deploy/bootstrap-staging-host.sh`. It must require execution as root, install only the dedicated Nginx site, prompt interactively for the certificate email without echoing it, create a root-owned wrapper for the exact staging Certbot invocation, validate Nginx before reload, and create `/etc/sudoers.d/netloka-staging-deploy` with only:

```sudoers
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx
deploy ALL=(root) NOPASSWD: /usr/local/sbin/netloka-staging-certbot
```

The script must run `visudo -cf` before installing the sudoers file and must not modify any other site configuration.

- [ ] **Step 3: Write the staging runbook**

Create `docs/deployment/staging.md` with explicit commands for:

```bash
sudo mkdir -p /srv/netloka/staging/backups/postgres
sudo chown -R deploy:deploy /srv/netloka/staging
chmod 700 /srv/netloka/staging
chmod 600 /srv/netloka/staging/.env
crontab -e
```

The cron entry uses `CRON_TZ=Asia/Makassar` and runs the backup script at 03:00 daily. The runbook separates root-only bootstrap from normal `deploy` operations, requires manual backup before destructive maintenance, and gives a rollback command that never removes the staging database volume.

- [ ] **Step 4: Validate host artifacts before deployment**

Run:

```powershell
bash -n deploy/bootstrap-staging-host.sh
ssh netloka-staging "test -d /srv/netloka/staging && test -w /srv/netloka/staging"
```

Expected: the script is syntactically valid and the approved root is writable by `deploy`.

- [ ] **Step 5: Commit host deployment artifacts**

```powershell
git add deploy/nginx/staging.netloka.biz.id.conf deploy/bootstrap-staging-host.sh docs/deployment/staging.md
git commit -m "docs: add staging host deployment runbook"
```

### Task 4: Deploy and validate staging with the approved VPS boundary

**Files:**
- Modify: `README.md`, `ROADMAP.md`, `PLAN.md`, `CHANGELOG.md`
- Test: local full suite and VPS staging validation

**Interfaces:**
- Consumes: merged deployment artifacts and a root administrator performing the one-time bootstrap.
- Produces: a live staging health endpoint and documentation evidence.

- [ ] **Step 1: Run the full local quality suite**

Run:

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npx prisma validate
npx prisma migrate status
```

Expected: all commands exit zero.

- [ ] **Step 2: Prepare the VPS private environment**

As `deploy`, create the approved directory, clone `main` into `/srv/netloka/staging/repo`, generate a random PostgreSQL password locally on the VPS, and write the private `.env` with mode 600. Do not print or commit that file.

- [ ] **Step 3: Pause for the root-only bootstrap checkpoint**

Provide the administrator the committed `deploy/bootstrap-staging-host.sh` command. Do not bypass the unavailable sudo prompt, do not request its password, and do not modify Nginx or Certbot until the administrator confirms this one-time command completed.

- [ ] **Step 4: Run deploy and validate only Netloka resources**

As `deploy`, run `/srv/netloka/staging/repo/scripts/deploy-staging.sh`. Verify:

```bash
ss -ltn '( sport = :3001 )'
STAGING_ENV_FILE=/srv/netloka/staging/.env docker compose --project-name netloka-staging --env-file /srv/netloka/staging/.env -f /srv/netloka/staging/repo/compose.staging.yml ps
curl --fail --silent --show-error https://staging.netloka.biz.id/api/health
```

Expected: the app has a healthy service, port 3001 is loopback-only, no database port appears in Compose output, and the public health endpoint returns HTTP 200.

- [ ] **Step 5: Install and validate the daily backup**

As `deploy`, install the documented cron entry, run the backup script manually once, verify a final `.dump` file exists, and confirm no temporary dump remains. Do not inspect or alter unrelated cron jobs.

- [ ] **Step 6: Synchronize project status and create the PR**

Update the M0 staging task state, append WITA changelog entries with verified local/VPS evidence, push this focused branch, open a PR against `main`, and verify GitHub Actions checks.
