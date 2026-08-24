#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
readonly REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd -P)"
readonly VALIDATOR="$SCRIPT_DIR/validate-staging-env.sh"
readonly COMPOSE_FILE="$REPO_DIR/compose.staging.yml"

work_dir="$(mktemp -d)"

cleanup() {
  rm -rf -- "$work_dir"
}

trap cleanup EXIT

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_success() {
  local description="$1"
  shift

  if ! "$@" >"$work_dir/output" 2>&1; then
    cat "$work_dir/output" >&2
    fail "$description"
  fi
}

assert_failure() {
  local description="$1"
  local expected_message="$2"
  shift 2

  if "$@" >"$work_dir/output" 2>&1; then
    fail "$description unexpectedly succeeded"
  fi

  grep -Fq -- "$expected_message" "$work_dir/output" || {
    cat "$work_dir/output" >&2
    fail "$description did not report: $expected_message"
  }
}

fake_bin="$work_dir/bin"
docker_log="$work_dir/docker.log"
external_env="$work_dir/staging.env"
secret_value="DO_NOT_PRINT_STAGING_SECRET"
repo_env="$COMPOSE_FILE"

mkdir -p "$fake_bin"
printf 'POSTGRES_PASSWORD=%s\n' "$secret_value" >"$external_env"

cat >"$fake_bin/docker" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

[[ "$1" == "compose" ]] || exit 91
[[ "${STAGING_ENV_FILE:-}" == "$EXPECTED_ENV_FILE" ]] || exit 92

printf '%s\n' "$*" >"$DOCKER_LOG"

for argument in "$@"; do
  if [[ "$argument" == "config" ]]; then
    exit "${COMPOSE_CONFIG_EXIT:-0}"
  fi
done

exit 93
EOF
chmod +x "$fake_bin/docker"

run_validator() {
  local environment_file="$1"
  local compose_config_exit="$2"

  if [[ "$environment_file" == "__UNSET__" ]]; then
    env -u STAGING_ENV_FILE \
      PATH="$fake_bin:$PATH" \
      DOCKER_LOG="$docker_log" \
      EXPECTED_ENV_FILE="" \
      COMPOSE_CONFIG_EXIT="$compose_config_exit" \
      "$VALIDATOR"
    return
  fi

  PATH="$fake_bin:$PATH" \
    DOCKER_LOG="$docker_log" \
    EXPECTED_ENV_FILE="$environment_file" \
    COMPOSE_CONFIG_EXIT="$compose_config_exit" \
    STAGING_ENV_FILE="$environment_file" \
    "$VALIDATOR"
}

grep -Fq -- 'env_file: ${STAGING_ENV_FILE:?STAGING_ENV_FILE must point to the external staging environment file}' "$COMPOSE_FILE" || \
  fail "compose.staging.yml must require STAGING_ENV_FILE"

if grep -Fq -- '${STAGING_ENV_FILE:-.env}' "$COMPOSE_FILE"; then
  fail "compose.staging.yml must not fall back to repository .env"
fi

assert_failure \
  "missing STAGING_ENV_FILE" \
  "STAGING_ENV_FILE is required" \
  run_validator "__UNSET__" 0

assert_failure \
  "repository environment path" \
  "must be outside the repository" \
  run_validator "$repo_env" 0

assert_failure \
  "non-regular environment path" \
  "Missing readable staging environment file" \
  run_validator "$work_dir" 0

assert_failure \
  "Compose render failure" \
  "Staging Compose configuration could not render" \
  run_validator "$external_env" 73

assert_success \
  "external staging environment path renders Compose configuration" \
  run_validator "$external_env" 0

grep -Fq -- '--env-file' "$docker_log" || fail "validator did not pass an explicit Compose env file"
grep -Fq -- 'config' "$docker_log" || fail "validator did not render Compose configuration"

if grep -Fq -- "$secret_value" "$work_dir/output"; then
  fail "validator printed environment values"
fi

echo "PASS: staging environment path validation"
