#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_NAME="netloka-production"
readonly PROD_ROOT="/srv/netloka/production"
readonly REPO_DIR="$PROD_ROOT/repo"
readonly ENV_FILE="$PROD_ROOT/.env"
readonly COMPOSE_FILE="$REPO_DIR/compose.production.yml"

if [[ ! -r "$ENV_FILE" ]]; then
  echo "Missing readable production environment file: $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing production Compose file: $COMPOSE_FILE" >&2
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

PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d db
PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" build migrate

if ! PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" run --rm migrate npx prisma migrate status; then
  echo "Migration status check reported pending migrations." >&2
fi

if [[ -f "$REPO_DIR/scripts/backup-production-postgres.sh" ]]; then
  bash "$REPO_DIR/scripts/backup-production-postgres.sh" || true
fi

PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" --profile maintenance run --rm migrate

if ! PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" run --rm migrate npx prisma migrate status; then
  echo "Migration state remains non-clean after deployment; refusing to start the app." >&2
  exit 1
fi

PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" up -d --build app

for _ in {1..24}; do
  if PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
    break
  fi

  sleep 5
done

if ! PRODUCTION_ENV_FILE="$ENV_FILE" "${compose[@]}" ps --format json app | grep -q '"Health":"healthy"'; then
  echo "Netloka production app did not become healthy." >&2
  exit 1
fi

curl --fail --silent --show-error --max-time 15 http://127.0.0.1:3002/api/health >/dev/null
echo "Netloka production deployment successful and healthy!"