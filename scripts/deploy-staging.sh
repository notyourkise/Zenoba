#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_NAME="netloka-staging"
readonly STAGING_ROOT="/srv/netloka/staging"
readonly REPO_DIR="$STAGING_ROOT/repo"
readonly ENV_FILE="$STAGING_ROOT/.env"
readonly COMPOSE_FILE="$REPO_DIR/compose.staging.yml"

if [[ ! -r "$ENV_FILE" ]]; then
  echo "Missing readable staging environment file: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing staging Compose file: $COMPOSE_FILE" >&2
  exit 1
fi

cd "$REPO_DIR"

compose=(
  docker compose
  --project-name "$PROJECT_NAME"
  --env-file "$ENV_FILE"
  -f "$COMPOSE_FILE"
)

git fetch origin main
git checkout main
git pull --ff-only origin main

STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d db

migration_status=""
migration_status_exit=0
migration_status="$(STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" run --rm migrate npx prisma migrate status 2>&1)" || migration_status_exit=$?

if grep -q "Following migration.*have not yet been applied" <<<"$migration_status"; then
  "$REPO_DIR/scripts/backup-staging-postgres.sh"
elif ((migration_status_exit != 0)); then
  echo "Unable to determine Netloka staging migration status." >&2
  exit "$migration_status_exit"
fi

STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" --profile maintenance run --rm migrate
STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d --build app

for _ in {1..24}; do
  if STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
    break
  fi

  sleep 5
done

if ! STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
  echo "Netloka staging app did not become healthy." >&2
  exit 1
fi

curl --fail --silent --show-error --max-time 15 http://127.0.0.1:3001/api/health >/dev/null
