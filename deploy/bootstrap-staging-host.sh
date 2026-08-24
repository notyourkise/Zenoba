#!/usr/bin/env bash

set -euo pipefail
umask 077

readonly STAGING_HOST="staging.netloka.biz.id"
readonly BOOTSTRAP_ROOT="/root/netloka-staging-bootstrap"
readonly SCRIPT_PATH="$(readlink -f "${BASH_SOURCE[0]}")"
readonly SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
readonly SITE_SOURCE="$SCRIPT_DIR/nginx/$STAGING_HOST.conf"
readonly SITE_AVAILABLE="/etc/nginx/sites-available/$STAGING_HOST.conf"
readonly SITE_ENABLED="/etc/nginx/sites-enabled/$STAGING_HOST.conf"
readonly CERTBOT_WRAPPER="/usr/local/sbin/netloka-staging-certbot"
readonly SUDOERS_FILE="/etc/sudoers.d/netloka-staging-deploy"

work_dir=""
site_available_existed=0
certbot_wrapper_existed=0
sudoers_file_existed=0
site_enabled_created=0
rollback_required=0

die() {
  echo "$*" >&2
  exit 1
}

require_root_owned_directory() {
  local path="$1"

  [[ -d "$path" && ! -L "$path" ]] || die "Expected root-owned directory: $path"
  [[ "$(stat -c '%U:%G' "$path")" == "root:root" ]] || die "Directory is not root-owned: $path"

  local mode
  mode="$(stat -c '%a' "$path")"
  (( (8#$mode & 022) == 0 )) || die "Directory is writable by group or others: $path"
}

require_root_owned_regular_file() {
  local path="$1"

  [[ -f "$path" && ! -L "$path" ]] || die "Expected root-owned regular file: $path"
  [[ "$(stat -c '%U:%G' "$path")" == "root:root" ]] || die "File is not root-owned: $path"

  local mode
  mode="$(stat -c '%a' "$path")"
  (( (8#$mode & 022) == 0 )) || die "File is writable by group or others: $path"
}

snapshot_dedicated_file() {
  local path="$1"
  local backup="$2"

  [[ ! -L "$path" ]] || die "Refusing symlinked dedicated target: $path"

  if [[ -e "$path" ]]; then
    require_root_owned_regular_file "$path"
    cp --preserve=mode,ownership,timestamps -- "$path" "$backup"
    return 0
  fi

  return 1
}

restore_dedicated_file() {
  local path="$1"
  local existed="$2"
  local backup="$3"

  if (( existed )); then
    local restore_temp
    restore_temp="$(mktemp "${path}.restore.XXXXXX")"

    if ! cp --preserve=mode,ownership,timestamps -- "$backup" "$restore_temp"; then
      rm -f -- "$restore_temp"
      return 1
    fi

    if ! mv -fT -- "$restore_temp" "$path"; then
      rm -f -- "$restore_temp"
      return 1
    fi
  else
    rm -f -- "$path"
  fi
}

rollback_host_changes() {
  set +e

  if (( site_enabled_created )) && [[ -L "$SITE_ENABLED" ]] && [[ "$(readlink -f "$SITE_ENABLED")" == "$SITE_AVAILABLE" ]]; then
    rm -f -- "$SITE_ENABLED"
  fi

  restore_dedicated_file "$SUDOERS_FILE" "$sudoers_file_existed" "$work_dir/sudoers.original"
  restore_dedicated_file "$CERTBOT_WRAPPER" "$certbot_wrapper_existed" "$work_dir/certbot-wrapper.original"
  restore_dedicated_file "$SITE_AVAILABLE" "$site_available_existed" "$work_dir/site-available.original"

  /usr/sbin/nginx -t && /usr/bin/systemctl reload nginx || \
    echo "Staging host rollback could not reload Nginx; administrator intervention is required." >&2

  rollback_required=0
}

cleanup() {
  local status=$?

  if (( rollback_required )); then
    rollback_host_changes
  fi

  if [[ -n "$work_dir" && -d "$work_dir" ]]; then
    rm -rf -- "$work_dir"
  fi

  exit "$status"
}

trap cleanup EXIT

if [[ "$EUID" -ne 0 ]]; then
  die "This bootstrap must be run by root."
fi

[[ "$SCRIPT_PATH" == "$BOOTSTRAP_ROOT/deploy/bootstrap-staging-host.sh" ]] || \
  die "Run only the reviewed root-owned bootstrap at $BOOTSTRAP_ROOT."

require_root_owned_directory "$BOOTSTRAP_ROOT"
require_root_owned_directory "$SCRIPT_DIR"
require_root_owned_directory "$SCRIPT_DIR/nginx"
require_root_owned_regular_file "$SCRIPT_PATH"
require_root_owned_regular_file "$SITE_SOURCE"
require_root_owned_directory "/etc/nginx/sites-available"
require_root_owned_directory "/etc/nginx/sites-enabled"
require_root_owned_directory "/etc/sudoers.d"
require_root_owned_directory "/usr/local/sbin"

[[ -x /usr/sbin/nginx ]] || die "Missing executable: /usr/sbin/nginx"
[[ -x /usr/bin/systemctl ]] || die "Missing executable: /usr/bin/systemctl"
[[ -x /usr/bin/certbot ]] || die "Missing executable: /usr/bin/certbot"
command -v visudo >/dev/null || die "Missing executable: visudo"

work_dir="$(mktemp -d /run/netloka-staging-bootstrap.XXXXXX)"

if snapshot_dedicated_file "$SITE_AVAILABLE" "$work_dir/site-available.original"; then
  site_available_existed=1
fi

if [[ -L "$SITE_ENABLED" ]]; then
  (( site_available_existed )) || die "Refusing enabled site with missing available target: $SITE_ENABLED"
  [[ "$(readlink -f "$SITE_ENABLED")" == "$SITE_AVAILABLE" ]] || \
    die "Refusing unrelated Nginx site link: $SITE_ENABLED"
elif [[ -e "$SITE_ENABLED" ]]; then
  die "Refusing non-symlink Nginx site target: $SITE_ENABLED"
fi

if snapshot_dedicated_file "$CERTBOT_WRAPPER" "$work_dir/certbot-wrapper.original"; then
  certbot_wrapper_existed=1
fi

if snapshot_dedicated_file "$SUDOERS_FILE" "$work_dir/sudoers.original"; then
  sudoers_file_existed=1
fi

read -r -s -p "Certificate email for $STAGING_HOST: " certificate_email
printf '\n'
[[ -n "$certificate_email" ]] || die "A certificate email is required."

install -o root -g root -m 0755 /dev/stdin "$work_dir/netloka-staging-certbot" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if (( "$#" != 0 )); then
  echo "This wrapper accepts no arguments." >&2
  exit 64
fi

exec /usr/bin/certbot renew --cert-name staging.netloka.biz.id
EOF

cat >"$work_dir/netloka-staging-deploy" <<'EOF'
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx
deploy ALL=(root) NOPASSWD: /usr/local/sbin/netloka-staging-certbot
EOF
chmod 0440 "$work_dir/netloka-staging-deploy"
visudo -cf "$work_dir/netloka-staging-deploy"

rollback_required=1

install -o root -g root -m 0644 "$SITE_SOURCE" "$SITE_AVAILABLE"

if [[ ! -e "$SITE_ENABLED" && ! -L "$SITE_ENABLED" ]]; then
  ln -s "$SITE_AVAILABLE" "$SITE_ENABLED"
  site_enabled_created=1
fi

install -o root -g root -m 0755 "$work_dir/netloka-staging-certbot" "$CERTBOT_WRAPPER"
install -o root -g root -m 0440 "$work_dir/netloka-staging-deploy" "$SUDOERS_FILE"

/usr/sbin/nginx -t
/usr/bin/systemctl reload nginx

/usr/bin/certbot --nginx --non-interactive --agree-tos --email "$certificate_email" -d "$STAGING_HOST"

rollback_required=0
