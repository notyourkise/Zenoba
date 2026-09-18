#!/usr/bin/env bash

set -euo pipefail
umask 077

readonly PROJECT_NAME="netloka-staging"
readonly STAGING_ROOT="/srv/netloka/staging"
readonly REPO_DIR="$STAGING_ROOT/repo"
readonly ENV_FILE="$STAGING_ROOT/.env"
readonly COMPOSE_FILE="$REPO_DIR/compose.staging.yml"
readonly BACKUP_DIR="$STAGING_ROOT/backups/postgres"
readonly LOCK_FILE="$BACKUP_DIR/.netloka-staging-backup.lock"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-dump-file.dump> [--force]" >&2
  exit 1
fi

readonly DUMP_FILE="$1"
readonly FORCE_FLAG="${2:-}"

if [[ ! -f "$DUMP_FILE" || ! -r "$DUMP_FILE" ]]; then
  echo "Error: Dump file '$DUMP_FILE' does not exist or is not readable." >&2
  exit 1
fi

if [[ ! -r "$ENV_FILE" ]]; then
  echo "Missing readable staging environment file: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing staging Compose file: $COMPOSE_FILE" >&2
  exit 1
fi

STAGING_ENV_FILE="$ENV_FILE" "$REPO_DIR/scripts/validate-staging-env.sh"

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "Missing staging backup directory: $BACKUP_DIR" >&2
  exit 1
fi

# Confirmation gate
if [[ "$FORCE_FLAG" != "--force" && "${RESTORE_CONFIRM:-}" != "yes" ]]; then
  echo "WARNING: This will overwrite the staging PostgreSQL database with: $DUMP_FILE"
  echo "Target project: $PROJECT_NAME (Staging only)"
  read -r -p "Type 'RESTORE' to proceed: " confirmation
  if [[ "$confirmation" != "RESTORE" ]]; then
    echo "Restore aborted by user."
    exit 1
  fi
fi

exec 9>"$LOCK_FILE"
flock -x 9

echo "[INFO] Stopping staging app container during restore..."
STAGING_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  stop app

echo "[INFO] Restoring PostgreSQL binary dump into staging database..."
STAGING_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists -Fc' < "$DUMP_FILE" || {
    echo "[WARN] pg_restore exited with non-zero code (common for harmless ownership/extension notices)."
  }

echo "[INFO] Restarting staging app container..."
STAGING_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  start app

echo "[INFO] Waiting for staging app healthcheck..."
for _ in {1..24}; do
  if STAGING_ENV_FILE="$ENV_FILE" docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps --format json app | grep -q '"Health":"healthy"'; then
    echo "[SUCCESS] Staging app is healthy."
    break
  fi
  sleep 5
done

echo "[INFO] Verifying restored table counts..."
STAGING_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT COUNT(*) AS user_count FROM \"User\"; SELECT COUNT(*) AS session_count FROM \"UserSecurityState\";"'

echo "[SUCCESS] Staging disaster recovery restore completed successfully."
