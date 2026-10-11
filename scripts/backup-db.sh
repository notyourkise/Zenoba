#!/usr/bin/env bash
set -euo pipefail

# Zenoba Automated Database Backup Script
# Usage: ./scripts/backup-db.sh

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
# Legacy production defaults are private identifiers, not public branding.
BACKUP_FILE="${BACKUP_DIR}/netloka_backup_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="${DB_CONTAINER:-netloka-db}"
DB_USER="${POSTGRES_USER:-netloka}"
DB_NAME="${POSTGRES_DB:-netloka}"

echo "[INFO] Starting database backup for '${DB_NAME}' from container '${CONTAINER_NAME}'..."

docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[SUCCESS] Backup completed successfully: ${BACKUP_FILE} (${FILESIZE})"

# Retention: keep last 14 daily backups
find "$BACKUP_DIR" -type f -name "netloka_backup_*.sql.gz" -mtime +14 -delete
echo "[INFO] Cleaned up backups older than 14 days."
