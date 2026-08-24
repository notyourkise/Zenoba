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

temporary_dump=""

cleanup() {
  if [[ -n "$temporary_dump" && -f "$temporary_dump" ]]; then
    rm -f -- "$temporary_dump"
  fi
}

trap cleanup EXIT

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

exec 9>"$LOCK_FILE"
flock -x 9

timestamp="$(TZ=Asia/Makassar date '+%Y%m%d-%H%M%S')"
final_dump="$BACKUP_DIR/netloka-staging-$timestamp.dump"

while [[ -e "$final_dump" ]]; do
  sleep 1
  timestamp="$(TZ=Asia/Makassar date '+%Y%m%d-%H%M%S')"
  final_dump="$BACKUP_DIR/netloka-staging-$timestamp.dump"
done

temporary_dump="$(mktemp "$BACKUP_DIR/.netloka-staging-XXXXXXXX.dump.tmp")"

STAGING_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' >"$temporary_dump"

mv -- "$temporary_dump" "$final_dump"
temporary_dump=""

find "$BACKUP_DIR" -type f -name 'netloka-staging-*.dump' -mtime +6 -delete
