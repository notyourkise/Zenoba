#!/usr/bin/env bash

set -euo pipefail
umask 077

readonly STAGING_HOST="staging.netloka.biz.id"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SITE_SOURCE="$SCRIPT_DIR/nginx/$STAGING_HOST.conf"
readonly SITE_AVAILABLE="/etc/nginx/sites-available/$STAGING_HOST.conf"
readonly SITE_ENABLED="/etc/nginx/sites-enabled/$STAGING_HOST.conf"
readonly CERTBOT_WRAPPER="/usr/local/sbin/netloka-staging-certbot"
readonly SUDOERS_FILE="/etc/sudoers.d/netloka-staging-deploy"

temporary_sudoers=""

cleanup() {
  if [[ -n "$temporary_sudoers" && -f "$temporary_sudoers" ]]; then
    rm -f -- "$temporary_sudoers"
  fi
}

trap cleanup EXIT

if [[ "$EUID" -ne 0 ]]; then
  echo "This bootstrap must be run by root." >&2
  exit 1
fi

if [[ ! -f "$SITE_SOURCE" ]]; then
  echo "Missing dedicated staging Nginx site: $SITE_SOURCE" >&2
  exit 1
fi

if [[ -e "$SITE_ENABLED" && ! -L "$SITE_ENABLED" ]]; then
  echo "Refusing to replace non-symlink Nginx site: $SITE_ENABLED" >&2
  exit 1
fi

if [[ -L "$SITE_ENABLED" && "$(readlink -f "$SITE_ENABLED")" != "$SITE_AVAILABLE" ]]; then
  echo "Refusing to replace unrelated Nginx site link: $SITE_ENABLED" >&2
  exit 1
fi

install -D -o root -g root -m 0644 "$SITE_SOURCE" "$SITE_AVAILABLE"
ln -sfn "$SITE_AVAILABLE" "$SITE_ENABLED"

read -r -s -p "Certificate email for $STAGING_HOST: " certificate_email
printf '\n'

if [[ -z "$certificate_email" ]]; then
  echo "A certificate email is required." >&2
  exit 1
fi

install -o root -g root -m 0755 /dev/stdin "$CERTBOT_WRAPPER" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
exec /usr/bin/certbot renew --cert-name staging.netloka.biz.id
EOF

temporary_sudoers="$(mktemp /etc/sudoers.d/.netloka-staging-deploy.XXXXXX)"
cat >"$temporary_sudoers" <<'EOF'
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload nginx
deploy ALL=(root) NOPASSWD: /usr/local/sbin/netloka-staging-certbot
EOF
chmod 0440 "$temporary_sudoers"
visudo -cf "$temporary_sudoers"
install -o root -g root -m 0440 "$temporary_sudoers" "$SUDOERS_FILE"

/usr/sbin/nginx -t
/usr/bin/systemctl reload nginx

/usr/bin/certbot --nginx --non-interactive --agree-tos --email "$certificate_email" -d "$STAGING_HOST"
