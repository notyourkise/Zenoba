# Disaster Recovery Rehearsal & Incident Drill Runbook

**Document version:** 1.0  
**Effective date:** 2026-09-18 WITA  
**Environment:** Staging / Isolated Drill Sandbox  
**Operator:** Pengelola Perseorangan Platform Netloka (Fikri Haikal)  
**Contact / Mailbox:** noreply@haikalariadma.my.id  
**Target RTO (Recovery Time Objective):** < 15 minutes  
**Target RPO (Recovery Point Objective):** < 24 hours (daily 03:00 WITA automated backups)

---

## 1. Principles and Safety Boundaries

Disaster Recovery (DR) rehearsals validate Netloka's resilience against data corruption, hardware failure, accidental deletion, and security compromise.

Strict safety rules:

1. **Non-production execution:** Drills must be performed strictly in the staging environment (`/srv/netloka/staging`) or an isolated local container. Never execute restore commands against the production database (`netloka-production`).
2. **Pre-drill snapshot:** Before initiating any drill in staging, capture and verify a baseline backup.
3. **No destructive down-migrations:** Application rollback is performed at the code/container level (`git checkout <known-good-commit>`). Schema rollbacks are achieved solely by restoring from a verified forward-only database snapshot.

---

## 2. Rehearsal Protocol: 5-Phase Drill

### Phase 1: Atomic Snapshot & Encryption Drill

1. **Create an atomic PostgreSQL binary dump:**
   ```bash
   set -euo pipefail
   STAGING_ENV_FILE=/srv/netloka/staging/.env /srv/netloka/staging/repo/scripts/backup-staging-postgres.sh
   LATEST_DUMP=$(ls -t /srv/netloka/staging/backups/postgres/netloka-staging-*.dump | head -n 1)
   echo "Captured baseline dump: $LATEST_DUMP"
   ```

2. **Compute pre-encryption SHA-256 checksum:**
   ```bash
   sha256sum "$LATEST_DUMP" > "$LATEST_DUMP.sha256"
   cat "$LATEST_DUMP.sha256"
   ```

3. **Encrypt the backup file using AES-256-CBC (PBKDF2):**
   ```bash
   # Use a designated drill passphrase (never store passphrases in repo)
   openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 \
     -in "$LATEST_DUMP" \
     -out "$LATEST_DUMP.enc"
   sha256sum "$LATEST_DUMP.enc" > "$LATEST_DUMP.enc.sha256"
   echo "Encrypted backup created: $LATEST_DUMP.enc"
   ```

**Pass criteria:**
- Dump file is non-empty and formatted as custom PostgreSQL binary (`-Fc`).
- Encryption generates a valid ciphertext file with recorded checksum.

---

### Phase 2: Decryption & Restoration Drill

1. **Decrypt the encrypted archive:**
   ```bash
   DECRYPTED_DUMP="/srv/netloka/staging/backups/postgres/drill-restore-test.dump"
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
     -in "$LATEST_DUMP.enc" \
     -out "$DECRYPTED_DUMP"
   ```

2. **Verify checksum match against original plaintext dump:**
   ```bash
   ORIGINAL_HASH=$(cut -d' ' -f1 < "$LATEST_DUMP.sha256")
   DECRYPTED_HASH=$(sha256sum "$DECRYPTED_DUMP" | cut -d' ' -f1)

   if [[ "$ORIGINAL_HASH" != "$DECRYPTED_HASH" ]]; then
     echo "Error: Checksum mismatch between original and decrypted dump!" >&2
     exit 1
   fi
   echo "Checksum verified: decrypted dump matches original baseline."
   ```

3. **Execute restore using the staging restore script:**
   ```bash
   STAGING_ENV_FILE=/srv/netloka/staging/.env RESTORE_CONFIRM=yes \
     /srv/netloka/staging/repo/scripts/restore-staging-postgres.sh "$DECRYPTED_DUMP" --force
   ```

**Pass criteria:**
- Checksums match perfectly (100% data integrity).
- Restore script stops `app`, restores database via `pg_restore`, restarts `app`, and confirms healthy status.
- Restoration elapsed time is under 5 minutes (well within the 15-minute RTO).

---

### Phase 3: Critical Data Inventory & Integrity Verification

Run the verification query inside the database container to compare row counts before and after the drill:

```sql
SELECT
  'User' AS table_name, COUNT(*) AS row_count FROM "User"
UNION ALL
SELECT 'UserSecurityState', COUNT(*) FROM "UserSecurityState"
UNION ALL
SELECT 'RateLimitEntry', COUNT(*) FROM "RateLimitEntry"
UNION ALL
SELECT 'LessonProgress', COUNT(*) FROM "LessonProgress"
UNION ALL
SELECT 'QuizAttempt', COUNT(*) FROM "QuizAttempt"
UNION ALL
SELECT 'Order', COUNT(*) FROM "Order"
UNION ALL
SELECT 'UserEntitlement', COUNT(*) FROM "UserEntitlement"
UNION ALL
SELECT 'SecurityAuditLog', COUNT(*) FROM "SecurityAuditLog";
```

**Pass criteria:**
- All critical table row counts match the pre-drill baseline.
- Zero orphaned foreign keys or dangling relations.

---

### Phase 4: Application Rollback Rehearsal

Simulate an application code regression where the database schema is ahead of the previous code revision:

1. **Record current deployed commit:**
   ```bash
   CURRENT_COMMIT=$(git -C /srv/netloka/staging/repo rev-parse HEAD)
   PREVIOUS_COMMIT=$(git -C /srv/netloka/staging/repo rev-parse HEAD~1)
   echo "Current: $CURRENT_COMMIT | Target Rollback: $PREVIOUS_COMMIT"
   ```

2. **Roll back application container to previous commit:**
   ```bash
   cd /srv/netloka/staging/repo
   git checkout "$PREVIOUS_COMMIT"
   STAGING_ENV_FILE=/srv/netloka/staging/.env docker compose \
     --project-name netloka-staging \
     --env-file /srv/netloka/staging/.env \
     -f compose.staging.yml \
     up --no-deps -d --build app
   ```

3. **Validate backward compatibility:**
   ```bash
   curl --fail --silent http://127.0.0.1:3001/api/health
   ```

4. **Return staging repository to latest verified release commit:**
   ```bash
   git checkout "$CURRENT_COMMIT"
   STAGING_ENV_FILE=/srv/netloka/staging/.env docker compose \
     --project-name netloka-staging \
     --env-file /srv/netloka/staging/.env \
     -f compose.staging.yml \
     up --no-deps -d --build app
   ```

**Pass criteria:**
- The previous application version runs successfully against the forward-compatible database without fatal runtime crashes.
- Zero destructive down-migrations are executed.

---

### Phase 5: Post-Drill Smoke Verification

Verify essential user journeys after restoration:

1. **Authentication:**
   - Sign in with existing test credentials.
   - Verify JWT session callback succeeds.
2. **Learning continuity:**
   - Open `/dashboard` and verify existing XP and completed lessons appear.
   - Open an ongoing lesson; verify exact resume position is restored.
3. **Session revocation check:**
   - Verify `UserSecurityState` timestamp enforcement is operational.
4. **Cleanup:**
   - Remove temporary decrypted drill files (`rm -f /srv/netloka/staging/backups/postgres/drill-restore-test.dump*`).

---

## 3. Incident Containment & Secret Rotation Drill

In the event of a simulated SEV-1 credential compromise:

1. **Database Secret Rotation:**
   - Update `POSTGRES_PASSWORD` in `/srv/netloka/staging/.env`.
   - Update `DATABASE_URL` with new password.
   - Restart database container:
     ```bash
     docker compose --project-name netloka-staging -f compose.staging.yml up -d --force-recreate db app
     ```
2. **NextAuth / Session Secret Rotation:**
   - Generate new `AUTH_SECRET` and `NEXTAUTH_SECRET`: `openssl rand -base64 32`.
   - Update `.env` and recreate `app`.
   - All active sessions are immediately invalidated across all instances.
3. **SMTP / Mailbox Password Rotation:**
   - Update mailbox password in Hostinger panel.
   - Update `SMTP_PASSWORD` in `.env`.
   - Test password reset dispatch.

---

## 4. Disaster Recovery Rehearsal Sign-Off Template

```text
Disaster Recovery & Rollback Drill Sign-Off
===========================================
Date & Time (WITA): YYYY-MM-DD HH:mm WITA
Environment: Staging (/srv/netloka/staging)
Operator: Pengelola Perseorangan Platform Netloka (Fikri Haikal)
Evaluated By: Anto (AI Pair) & Abangku (Owner)

Measured Metrics:
- Time to Capture Snapshot: ___ seconds
- Time to Restore Database: ___ minutes
- Measured RTO: ___ minutes (Target: < 15 min) [PASS/FAIL]
- Verified RPO: ___ hours (Target: < 24 h) [PASS/FAIL]

Checklist:
[x] Phase 1: Atomic Snapshot & AES-256 Encryption
[x] Phase 2: Decryption & Restoration Verification
[x] Phase 3: Row Count & Checksum Integrity Match
[x] Phase 4: Application Rollback & Schema Compatibility
[x] Phase 5: Post-Drill Smoke Tests (Auth, Learning, Progress)
[x] Incident Drill: Secret Rotation & Global Session Invalidation Rehearsal

Drill Status: PASSED / READY FOR TASK 41.4
Operator Signature: _______________________
```
