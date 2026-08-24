# Netloka Staging Deployment Design

**Date:** 2026-08-24

## Goal

Deploy the current `main` branch to an isolated Docker Compose staging environment at `staging.netloka.biz.id` without modifying any other VPS workload, container, database, network, or volume.

## Confirmed Environment

- VPS: Hostinger Ubuntu 24.04.4 LTS; Docker Engine 29.7.2 and Compose 2.40.3.
- Deployment identity: non-root `deploy` through SSH alias `netloka-staging`; it belongs to the `docker` group.
- Deployment root: `/srv/netloka/staging`, owned by `deploy`.
- Host Nginx is active and ports 80/443 are occupied by it; port 3001 is currently unused.
- Cloudflare proxies `staging.netloka.biz.id` to the VPS using Full (Strict) TLS and Always Use HTTPS.
- Host Nginx terminates origin TLS using Certbot; its staging upstream is `127.0.0.1:3001`.
- PostgreSQL runs in the Netloka Compose project only, with its own named volume and no published port.
- Backups run daily at 03:00 WITA as `pg_dump -Fc`, retained locally for seven days under `/srv/netloka/staging/backups/postgres/`.

## Architecture

```text
Internet
  -> Cloudflare proxy (Full Strict)
  -> host Nginx + Certbot certificate
  -> 127.0.0.1:3001
  -> netloka-staging-app (container port 3000)
  -> internal netloka-staging network
  -> netloka-staging-postgres (no host port)
  -> named volume netloka_staging_postgres_data
```

The Compose project name is `netloka-staging`. Every container, network, and volume uses this project identity and is separate from all non-Netloka Docker resources.

## Repository Artifacts

- `Dockerfile`: multi-stage Node 20.19+ image that generates Prisma Client and builds the standalone Next.js application.
- `.dockerignore`: excludes secrets, local build output, Git metadata, dependencies, and test artifacts from image context.
- `compose.staging.yml`: defines only `app`, `db`, and a maintenance-only `migrate` service. The app binds `127.0.0.1:3001:3000`; database has no `ports` entry.
- `scripts/deploy-staging.sh`: fetches `origin/main`, refuses non-fast-forward deployment, builds the isolated Compose project, runs `prisma migrate deploy`, and restarts the app.
- `scripts/backup-staging-postgres.sh`: creates a date-stamped custom-format database dump and removes backups older than seven days. It reads no credentials from source files.
- `deploy/nginx/staging.netloka.biz.id.conf`: host Nginx virtual host that proxies only the staging domain to loopback port 3001 and forwards standard proxy headers.
- `deploy/bootstrap-staging-host.sh`: root-only, one-time bootstrap. It creates the Nginx site, a root-owned Certbot wrapper containing no email in source, and a restrictive sudoers policy for `deploy`.
- `docs/deployment/staging.md`: operator procedure covering initial bootstrap, secret creation, deployment, rollback, pre-migration backup, cron setup, validation, and recovery.

## Secrets and Permissions

- The staging `.env` is created only on the VPS at `/srv/netloka/staging/.env`, owned by `deploy`, with mode `600`.
- It supplies database credentials, `DATABASE_URL`, and `NODE_ENV=production`; it is excluded from Git and Docker build context.
- The existing operational certificate email is entered only interactively into the root bootstrap process. It must never be committed, written into project documentation, or printed by scripts.
- `deploy` receives no unrestricted sudo access. The bootstrap installs root-owned wrappers so the allowed passwordless commands are limited to Nginx syntax validation, Nginx reload, and issuing/renewing the fixed staging certificate.
- The bootstrap itself cannot be run by `deploy` today because non-interactive sudo is unavailable. A VPS administrator must run it once with root privileges; no password or private key is transmitted through this repository or chat.

## Deployment and Migration Flow

1. The operator creates `/srv/netloka/staging`, clones the repository as `deploy`, and creates the private `.env`.
2. A VPS administrator runs the root-only bootstrap to install the narrowly scoped host configuration.
3. The operator runs the deploy script. It first creates a manual backup if a migration is pending, then pulls `origin/main` with fast-forward-only semantics.
4. Compose builds the app image, starts the database, runs `prisma migrate deploy` through the maintenance service, then starts or replaces the app.
5. The deploy script verifies the Docker health check and `https://staging.netloka.biz.id/api/health`.
6. Rollback restores the prior Git revision, rebuilds only the Netloka Compose project, and does not remove the database volume. Database rollback is manual and only from a verified pre-migration dump.

## Backup Operations

- A `deploy` user cron entry with `CRON_TZ=Asia/Makassar` invokes the backup script at 03:00 daily.
- The script uses `umask 077`, runs `pg_dump -Fc` into a temporary file in the approved backup directory, and renames it to its final timestamped filename only after a successful exit.
- Failed or incomplete temporary dumps are removed and never treated as valid backups. Local retention is seven days.
- The deploy script invokes the same backup script before every pending migration. No destructive migration proceeds automatically unless the pre-migration backup succeeds.
- External R2/S3 synchronization is explicitly deferred and is not simulated with local credentials.

## Validation

- Local: lint, type-check, unit tests, three-browser E2E, production build, Prisma validation, and migration status remain green before staging deployment.
- VPS: validate DNS resolution; Nginx configuration syntax; a valid TLS certificate; Docker Compose service health; application publication only on `127.0.0.1:3001`; no PostgreSQL host port; internal application-to-database connectivity; expected migration state; and the successful public health endpoint response.
- Isolation: all staging Docker resources use the `netloka-staging` namespace or an explicitly approved Netloka staging name. Read-only host or Docker inspection is permitted only for validation or collision detection. Never stop, restart, recreate, remove, prune, rename, or otherwise mutate unrelated containers, networks, volumes, images, databases, or host Nginx virtual hosts; never use broad cleanup commands such as `docker system prune` or `docker volume prune`.

## Out of Scope

- Production deployment and production database.
- GitHub Actions deployment automation.
- Cloudflare API mutations.
- R2/S3 backup synchronization.
- Any change to existing Docker projects, databases, host Nginx sites, or the user-owned Sprint 1 worktree.
