#!/usr/bin/env bash

set -euo pipefail
umask 077

readonly PROJECT_NAME="netloka-production"
readonly PROD_ROOT="/srv/netloka/production"
readonly REPO_DIR="$PROD_ROOT/repo"
readonly ENV_FILE="$PROD_ROOT/.env"
readonly COMPOSE_FILE="$REPO_DIR/compose.production.yml"
readonly BACKUP_DIR="$PROD_ROOT/backups/postgres"
readonly LOCK_FILE="$BACKUP_DIR/.netloka-production-backup.lock"

temporary_dump=""

cleanup() {
  if [[ -n "$temporary_dump" && -f "$temporary_dump" ]]; then
    rm -f -- "$temporary_dump"
  fi
}

trap cleanup EXIT

if [[ ! -r "$ENV_FILE" ]]; then
  echo "Missing readable production environment file: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing production Compose file: $COMPOSE_FILE" >&2
  exit 1
fi

if [[ ! -d "$BACKUP_DIR" ]]; then
  echo "Missing production backup directory: $BACKUP_DIR" >&2
  exit 1
fi

exec 9>"$LOCK_FILE"
flock -x 9

timestamp="$(TZ=Asia/Makassar date '+%Y%m%d-%H%M%S')"
final_dump="$BACKUP_DIR/netloka-production-$timestamp.dump"

while [[ -e "$final_dump" ]]; do
  sleep 1
  timestamp="$(TZ=Asia/Makassar date '+%Y%m%d-%H%M%S')"
  final_dump="$BACKUP_DIR/netloka-production-$timestamp.dump"
done

temporary_dump="$(mktemp "$BACKUP_DIR/.netloka-production-XXXXXXXX.dump.tmp")"

PRODUCTION_ENV_FILE="$ENV_FILE" docker compose \
  --project-name "$PROJECT_NAME" \
  --env-file "$ENV_FILE" \
  -f "$COMPOSE_FILE" \
  exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' >"$temporary_dump"

mv -- "$temporary_dump" "$final_dump"
temporary_dump=""

find "$BACKUP_DIR" -type f -name 'netloka-production-*.dump' -mtime +6 -delete