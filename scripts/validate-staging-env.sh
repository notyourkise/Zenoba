#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
readonly REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd -P)"
readonly COMPOSE_FILE="$REPO_DIR/compose.staging.yml"

die() {
  echo "$*" >&2
  exit 1
}

[[ -n "${STAGING_ENV_FILE:-}" ]] || die "STAGING_ENV_FILE is required."
[[ -f "$STAGING_ENV_FILE" && -r "$STAGING_ENV_FILE" ]] || \
  die "Missing readable staging environment file: $STAGING_ENV_FILE"
[[ -f "$COMPOSE_FILE" ]] || die "Missing staging Compose file: $COMPOSE_FILE"

environment_file="$(realpath -e -- "$STAGING_ENV_FILE")" || \
  die "Unable to resolve staging environment file: $STAGING_ENV_FILE"

case "$environment_file" in
  "$REPO_DIR" | "$REPO_DIR"/*)
    die "STAGING_ENV_FILE must be outside the repository."
    ;;
esac

if ! STAGING_ENV_FILE="$environment_file" docker compose \
  --env-file "$environment_file" \
  -f "$COMPOSE_FILE" \
  config >/dev/null 2>&1; then
  die "Staging Compose configuration could not render."
fi
