#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_NAME="zenoba-staging"
readonly STAGING_ROOT="/srv/zenoba/staging"
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

STAGING_ENV_FILE="$ENV_FILE" "$REPO_DIR/scripts/validate-staging-env.sh"

STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d db
STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" build migrate

if ! STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" run --rm migrate npx prisma migrate status; then
  echo "Migration status is not clean; a backup is required before migration resolution." >&2
fi

"$REPO_DIR/scripts/backup-staging-postgres.sh"
STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" --profile maintenance run --rm migrate

if ! STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" run --rm migrate npx prisma migrate status; then
  echo "Migration state remains non-clean after deployment; refusing to start the app." >&2
  exit 1
fi

STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d --build app

for _ in {1..24}; do
  if STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
    break
  fi

  sleep 5
done

if ! STAGING_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
  echo "Zenoba staging app did not become healthy." >&2
  exit 1
fi

curl --fail --silent --show-error --max-time 15 http://127.0.0.1:3001/api/health >/dev/null
