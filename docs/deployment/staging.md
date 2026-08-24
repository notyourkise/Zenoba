# Staging operator runbook

This runbook operates only the Netloka staging environment at
`/srv/netloka/staging`. It does not authorize changes to production,
other Nginx sites, or non-Netloka Docker resources.

## One-time administrator setup

An administrator with root access performs these commands once. The `deploy`
account cannot run the bootstrap through unrestricted sudo.

```bash
sudo mkdir -p /srv/netloka/staging/backups/postgres
sudo chown -R deploy:deploy /srv/netloka/staging
chmod 700 /srv/netloka/staging
```

As `deploy`, clone the repository into the approved root and create the
private environment file. Copy values from `deploy/staging.env.example`, add a
database URL that uses the internal `db:5432` host, and keep the file only on
the VPS.

```bash
git clone <repository-url> /srv/netloka/staging/repo
install -m 600 /dev/null /srv/netloka/staging/.env
chmod 600 /srv/netloka/staging/.env
```

The administrator must not execute a root bootstrap from the `deploy`-owned
checkout. Obtain the reviewed commit identifier and SHA-256 values through the
approved review channel, then copy exactly those two reviewed artifacts into a
root-owned staging directory before execution. The following procedure has no
certificate email value; the bootstrap prompts for it later without echoing it.

```bash
set -euo pipefail

REVIEWED_COMMIT=<approved-commit>
REVIEWED_BOOTSTRAP_SHA256=<approved-bootstrap-sha256>
REVIEWED_NGINX_SHA256=<approved-nginx-sha256>

[[ "$REVIEWED_COMMIT" =~ ^[0-9a-f]{40}$ ]] || { echo "Invalid reviewed commit." >&2; exit 1; }
[[ "$REVIEWED_BOOTSTRAP_SHA256" =~ ^[0-9a-f]{64}$ ]] || { echo "Invalid bootstrap checksum." >&2; exit 1; }
[[ "$REVIEWED_NGINX_SHA256" =~ ^[0-9a-f]{64}$ ]] || { echo "Invalid Nginx checksum." >&2; exit 1; }
git -C /srv/netloka/staging/repo rev-parse --verify "${REVIEWED_COMMIT}^{commit}" >/dev/null

sudo install -d -o root -g root -m 0700 /root/netloka-staging-bootstrap/deploy/nginx
sudo sh -c 'git -C "$1" show "$2" > "$3"' sh /srv/netloka/staging/repo "$REVIEWED_COMMIT:deploy/bootstrap-staging-host.sh" /root/netloka-staging-bootstrap/deploy/bootstrap-staging-host.sh
sudo sh -c 'git -C "$1" show "$2" > "$3"' sh /srv/netloka/staging/repo "$REVIEWED_COMMIT:deploy/nginx/staging.netloka.biz.id.conf" /root/netloka-staging-bootstrap/deploy/nginx/staging.netloka.biz.id.conf
printf '%s  %s\n' "$REVIEWED_BOOTSTRAP_SHA256" /root/netloka-staging-bootstrap/deploy/bootstrap-staging-host.sh | sudo sha256sum -c -
printf '%s  %s\n' "$REVIEWED_NGINX_SHA256" /root/netloka-staging-bootstrap/deploy/nginx/staging.netloka.biz.id.conf | sudo sha256sum -c -
sudo chown -R root:root /root/netloka-staging-bootstrap
sudo chmod 0700 /root/netloka-staging-bootstrap /root/netloka-staging-bootstrap/deploy /root/netloka-staging-bootstrap/deploy/nginx
sudo chmod 0700 /root/netloka-staging-bootstrap/deploy/bootstrap-staging-host.sh
sudo chmod 0644 /root/netloka-staging-bootstrap/deploy/nginx/staging.netloka.biz.id.conf
sudo /root/netloka-staging-bootstrap/deploy/bootstrap-staging-host.sh
```

The bootstrap asks for the operational certificate email interactively. Do not
put that value in this runbook, repository files, shell history, or chat. It
performs all preflight and temporary-file preparation before changing host
paths, installs only the dedicated `staging.netloka.biz.id` Nginx site, checks
Nginx syntax before reloading it, and installs the restricted sudo policy. If
Nginx validation or Certbot fails, it restores a pre-existing approved staging
site, wrapper, and sudoers file, or removes only the dedicated paths it
created. It never removes an existing approved staging resource.

After the bootstrap, the `deploy` user may run only these host-maintenance
commands through sudo:

```bash
sudo /usr/sbin/nginx -t
sudo /usr/bin/systemctl reload nginx
sudo /usr/local/sbin/netloka-staging-certbot
```

The certificate wrapper accepts no arguments and renews only the fixed staging
certificate.

## Normal deploy operation

Run as `deploy` from the staging repository:

```bash
/srv/netloka/staging/repo/scripts/deploy-staging.sh
```

The script operates only the `netloka-staging` Compose project. Do not use
Docker prune commands, `down -v`, or commands that target generic Docker
resources.

## Backups and scheduled backup

Before destructive maintenance, including any change that could destroy or
invalidate data, make and verify a manual backup first:

```bash
/srv/netloka/staging/repo/scripts/backup-staging-postgres.sh
ls -l /srv/netloka/staging/backups/postgres/netloka-staging-*.dump
```

As `deploy`, install the daily user cron entry with `crontab -e`:

```cron
CRON_TZ=Asia/Makassar
0 3 * * * /srv/netloka/staging/repo/scripts/backup-staging-postgres.sh >> /srv/netloka/staging/backups/postgres/backup.log 2>&1
```

The backup job creates atomic PostgreSQL dumps and retains the most recent
seven days locally. Do not add this entry to a system-wide crontab.

## Scoped validation

After a deployment, validate only staging resources:

```bash
sudo /usr/sbin/nginx -t
ss -ltn '( sport = :3001 )'
docker compose --project-name netloka-staging --env-file /srv/netloka/staging/.env -f /srv/netloka/staging/repo/compose.staging.yml ps
curl --fail --silent --show-error https://staging.netloka.biz.id/api/health
```

Confirm that port 3001 is loopback-only, the app is healthy, the database has
no published host port, and the public health endpoint returns HTTP 200.

## Application rollback

Record the deployed revision before updating it. To roll back application code
only, check out a known-good revision and recreate only the staging app:

```bash
cd /srv/netloka/staging/repo
git checkout <known-good-revision>
STAGING_ENV_FILE=/srv/netloka/staging/.env docker compose --project-name netloka-staging --env-file /srv/netloka/staging/.env -f compose.staging.yml up --no-deps -d --build app
```

This rollback deliberately does not run `docker compose down`, `down -v`, or
any volume-removal command. It does not roll back database migrations; restore
database data manually only from a verified pre-migration dump and an approved
recovery procedure.
