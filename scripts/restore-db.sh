#!/usr/bin/env bash
set -euo pipefail

# Zenoba Database Disaster Recovery Restore Script
# Usage: ./scripts/restore-db.sh <path_to_backup_file.sql.gz>

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"
if [ ! -f "$BACKUP_FILE" ]; then
    echo "[ERROR] Backup file '$BACKUP_FILE' not found!"
    exit 1
fi

CONTAINER_NAME="${DB_CONTAINER:-zenoba-db}"
DB_USER="${POSTGRES_USER:-zenoba}"
DB_NAME="${POSTGRES_DB:-zenoba}"

echo "[WARNING] This will overwrite database '${DB_NAME}' with contents from '${BACKUP_FILE}'!"
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "[ABORTED] Restore cancelled by user."
    exit 1
fi

echo "[INFO] Restoring database..."
gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"

echo "[SUCCESS] Database restore completed successfully!"
