#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
readonly REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd -P)"
readonly VALIDATOR="$SCRIPT_DIR/validate-staging-env.sh"
readonly COMPOSE_FILE="$REPO_DIR/compose.staging.yml"
readonly DEPLOY_SCRIPT="$SCRIPT_DIR/deploy-staging.sh"
readonly DEPLOYMENT_PLAN="$REPO_DIR/docs/superpowers/plans/2026-08-24-staging-deployment.md"

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

assert_line_order() {
  local file="$1"
  local first="$2"
  local second="$3"
  local first_line
  local second_line

  first_line="$(grep -nF -- "$first" "$file" | head -n 1 | cut -d: -f1)"
  second_line="$(grep -nF -- "$second" "$file" | head -n 1 | cut -d: -f1)"

  [[ -n "$first_line" ]] || fail "missing expected line: $first"
  [[ -n "$second_line" ]] || fail "missing expected line: $second"
  (( first_line < second_line )) || fail "expected '$first' before '$second'"
}

assert_rendered_topology() {
  local rendered_compose="$1"

  node - "$rendered_compose" <<'NODE'
const fs = require("node:fs");

const compose = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exit(1);
};
const serviceNetworks = (serviceName) =>
  Object.keys(compose.services?.[serviceName]?.networks ?? {}).sort();
const hasOwn = (value, property) =>
  Object.prototype.hasOwnProperty.call(value ?? {}, property);
const internalNetwork = compose.networks?.netloka_staging_internal;
const edgeNetwork = compose.networks?.netloka_staging_edge;
const postgresVolume = compose.volumes?.netloka_staging_postgres_data;

if (compose.name !== "netloka-staging") {
  fail("Compose project name must remain netloka-staging");
}

if (internalNetwork?.internal !== true) {
  fail("netloka_staging_internal must stay internal");
}

if (internalNetwork?.name !== "netloka-staging_netloka_staging_internal") {
  fail("netloka_staging_internal must retain its project-scoped network name");
}

if (hasOwn(internalNetwork, "external")) {
  fail("netloka_staging_internal must not declare an external network");
}

if (
  edgeNetwork?.name !== "netloka_staging_edge" ||
  edgeNetwork?.driver !== "bridge"
) {
  fail("netloka_staging_edge must be the explicitly named bridge network");
}

if (hasOwn(edgeNetwork, "external")) {
  fail("netloka_staging_edge must not declare an external network");
}

if (postgresVolume?.name !== "netloka-staging_netloka_staging_postgres_data") {
  fail("PostgreSQL volume must retain its project-scoped volume name");
}

if (hasOwn(postgresVolume, "external")) {
  fail("PostgreSQL volume must not declare an external volume");
}

if (JSON.stringify(serviceNetworks("db")) !== JSON.stringify(["netloka_staging_internal"])) {
  fail("db must remain only on netloka_staging_internal");
}

if (compose.services?.db?.ports !== undefined) {
  fail("db must not publish host ports");
}

if (
  JSON.stringify(serviceNetworks("app")) !==
  JSON.stringify(["netloka_staging_edge", "netloka_staging_internal"])
) {
  fail("app must join both the internal and Netloka staging edge networks");
}

if (edgeNetwork?.internal === true) {
  fail("netloka_staging_edge must not be internal");
}

if (JSON.stringify(serviceNetworks("migrate")) !== JSON.stringify(["netloka_staging_internal"])) {
  fail("migrate must remain only on netloka_staging_internal");
}

const appPorts = compose.services?.app?.ports ?? [];
if (
  appPorts.length !== 1 ||
  appPorts[0].host_ip !== "127.0.0.1" ||
  String(appPorts[0].published) !== "3001" ||
  appPorts[0].target !== 3000
) {
  fail("app must publish only 127.0.0.1:3001:3000");
}
NODE
}

fake_bin="$work_dir/bin"
docker_log="$work_dir/docker.log"
external_env="$work_dir/staging.env"
rendered_compose="$work_dir/compose.json"
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

assert_line_order \
  "$DEPLOY_SCRIPT" \
  'git pull --ff-only origin main' \
  'STAGING_ENV_FILE="$ENV_FILE" "$REPO_DIR/scripts/validate-staging-env.sh"'

if [[ "$(grep -Fc -- 'env_file: ${STAGING_ENV_FILE:?STAGING_ENV_FILE must point to the external staging environment file}' "$DEPLOYMENT_PLAN")" -ne 3 ]]; then
  fail "staging deployment plan must require external STAGING_ENV_FILE for all three env_file examples"
fi

if grep -Fq -- 'env_file: .env' "$DEPLOYMENT_PLAN"; then
  fail "staging deployment plan must not reference repository .env"
fi

if grep -Fq -- '.env.staging.test' "$DEPLOYMENT_PLAN"; then
  fail "staging deployment plan manual validation must use an external temporary environment file"
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

if ! STAGING_ENV_FILE="$external_env" docker compose \
  --env-file "$external_env" \
  -f "$COMPOSE_FILE" \
  --profile maintenance \
  config --format json >"$rendered_compose"; then
  fail "real staging Compose configuration could not render"
fi

assert_rendered_topology "$rendered_compose"

grep -Fq -- '--env-file' "$docker_log" || fail "validator did not pass an explicit Compose env file"
grep -Fq -- 'config' "$docker_log" || fail "validator did not render Compose configuration"

if grep -Fq -- "$secret_value" "$work_dir/output"; then
  fail "validator printed environment values"
fi

echo "PASS: staging environment path validation"
