# Auth Live Verification Runbook

Last updated: **2026-09-17 15:30 WITA**.

## 1. Context and Purpose

This runbook defines the operational verification protocol for authentication security controls implemented in **Milestone 15 / Sprint 40 / Task 40.3**:
- Safe OAuth account linking with `allowDangerousEmailAccountLinking: false`.
- Enforcement of verified provider emails (`email_verified !== false`).
- Defense against pre-account takeover of credentials-first accounts.
- Defense against account hijacking via conflicting OAuth provider account IDs.
- Blockade of public Google OAuth for privileged `DEVELOPER` accounts.
- Enforcement of default public `LEARNER` role across credentials registration and OAuth callbacks.
- Live verification of transactional email delivery (Hostinger SMTP) for password resets.

> **Important:** Local unit and integration tests (Vitest) provide deterministic verification of domain logic and security event telemetry, but **local mocks do not constitute live verification**. Live protocol verification must be performed exclusively in an authorized, isolated staging environment (`staging.netloka.biz.id`) prior to production activation.

---

## 2. Security Architecture and Defense In Depth

### 2.1 Prevention of Pre-Account Takeover (`allowDangerousEmailAccountLinking: false`)

In standard NextAuth / Auth.js behavior, enabling `allowDangerousEmailAccountLinking` permits an OAuth login to automatically attach to an existing user record with matching email address. If an attacker creates an account on a third-party provider (or uses an unverified identity), this allows taking over an existing user's Netloka profile and progress.

Netloka explicitly sets:
```typescript
GoogleProvider({
  clientId: environment.GOOGLE_CLIENT_ID!.trim(),
  clientSecret: environment.GOOGLE_CLIENT_SECRET!.trim(),
  allowDangerousEmailAccountLinking: false,
})
```

### 2.2 Provider Email Verification Gate

Google OAuth profiles include an `email_verified` boolean. If a provider profile explicitly reports `email_verified === false`, Netloka rejects the sign-in immediately in the `signIn` callback:
- **Action:** Reject authentication (`return false`).
- **Telemetry:** Logs `AUTH_OAUTH_UNVERIFIED_EMAIL_REJECTED` (severity `WARN`).

### 2.3 Credentials-First Account Conflict Defense

When an account is created using email + password (credentials), it possesses a non-null `passwordHash`. If someone subsequently attempts to sign in via Google OAuth using the same email address without having previously linked that Google account:
- **Action:** NextAuth callback detects existing credentials account without a matching Google `Account` record.
- **Action:** Sign-in is rejected (`return false`).
- **Telemetry:** Logs `AUTH_OAUTH_CONFLICTING_CREDENTIALS_REJECTED` (severity `WARN`).
- **Rationale:** Prevents unauthorized account takeover by forcing the learner to authenticate with their established credentials.

### 2.4 Conflicting Provider Account ID Defense

If a Google account has been previously linked, Netloka cross-checks `account.providerAccountId` against the recorded `providerAccountId` in the database `accounts` table:
- **Action:** If the provider account IDs do not match, sign-in is immediately rejected (`return false`).
- **Telemetry:** Logs `AUTH_OAUTH_CONFLICTING_ACCOUNT_ID_REJECTED` (severity `CRITICAL`).
- **Rationale:** Prevents identity spoofing or provider account swapping attacks.

### 2.5 Privileged Account Isolation (Developer OAuth Block)

Privileged developer accounts (`role === "DEVELOPER"`) hold access to internal administrative, developer elevation, and audit tooling. To enforce strict authentication hygiene:
- Developer accounts are strictly forbidden from authenticating via public Google OAuth.
- If a user with role `DEVELOPER` attempts Google OAuth sign-in, it is rejected and logged as `AUTH_OAUTH_DEVELOPER_REJECTED` (severity `WARN`).
- Developers must use email + password credentials combined with mandatory Time-based One-Time Password (TOTP) two-factor authentication (2FA).

### 2.6 Forced Public `LEARNER` Role

To ensure privilege separation:
- Public credentials registration at `/api/auth/register` ignores any client-supplied role and hardcodes `role: "LEARNER"`.
- NextAuth `jwt` and `session` callbacks strictly default any unset or missing user role to `"LEARNER"`.
- Role elevation to `INTERNAL_LEARNER` or `DEVELOPER` can only occur through authorized server-side developer elevation workflows.

---

## 3. Staging Prerequisites and Configuration

Live verification must be executed in an isolated staging environment matching production architecture.

### 3.1 Google Cloud Console Credentials (Staging)

1. Open Google Cloud Console under the Netloka organization.
2. Navigate to **APIs & Services > Credentials**.
3. Create an **OAuth 2.0 Client ID**:
   - **Application type:** Web application
   - **Name:** Netloka Staging OAuth Client
   - **Authorized JavaScript origins:**
     - `https://staging.netloka.biz.id`
   - **Authorized redirect URIs:**
     - `https://staging.netloka.biz.id/api/auth/callback/google`
4. Set staging environment variables:
   ```env
   GOOGLE_CLIENT_ID="<staging-client-id>.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="<staging-client-secret>"
   ```

### 3.2 Hostinger SMTP Configuration (Staging)

1. Provision a dedicated staging email mailbox (e.g. `noreply-staging@netloka.biz.id` or `test-noreply@netloka.biz.id`) to avoid polluting production email reputation.
2. Set staging environment variables:
   ```env
   SMTP_HOST="smtp.hostinger.com"
   SMTP_PORT="465"
   SMTP_SECURE="true"
   SMTP_USER="noreply-staging@netloka.biz.id"
   SMTP_PASSWORD="<staging-mailbox-password>"
   EMAIL_FROM="noreply-staging@netloka.biz.id"
   ```

---

## 4. Step-by-Step Live Verification Matrix

Execute these test scenarios sequentially in staging:

| Step | Test Scenario | Procedure | Expected Result | Verified |
| --- | --- | --- | --- | --- |
| **ST-01** | **Public Registration Role Boundary** | Send `POST /api/auth/register` with body `{ email: "test-reg@example.com", password: "...", role: "DEVELOPER" }`. | Status `201 Created`. User record in database has `role = "LEARNER"`. | [ ] |
| **ST-02** | **New User Google OAuth** | Initiate Google OAuth sign-in using an unlinked personal Google account with verified email. | Successful login. User created in `users` with `role = "LEARNER"`. Account created in `accounts` with `provider = "google"`. | [ ] |
| **ST-03** | **Credentials-First Conflict Defense** | 1. Register account with email `conflict-test@example.com` and password.<br>2. Attempt Google OAuth sign-in with matching email `conflict-test@example.com`. | Sign-in rejected with OAuth error. In `security_events`, record created: `AUTH_OAUTH_CONFLICTING_CREDENTIALS_REJECTED`. | [ ] |
| **ST-04** | **Developer Google OAuth Block** | 1. Use existing developer account (or elevate test account in staging database to `role = "DEVELOPER"`).<br>2. Attempt Google OAuth sign-in with developer email. | Sign-in rejected. In `security_events`, record created: `AUTH_OAUTH_DEVELOPER_REJECTED`. | [ ] |
| **ST-05** | **Live SMTP Password Reset Delivery** | 1. Request password reset for verified staging test account.<br>2. Inspect staging mailbox inbox. | Password reset email delivered with valid token link within 60s. DKIM/SPF passes. | [ ] |
| **ST-06** | **Live Password Reset Rate Limiting** | Rapidly submit 6 password reset requests for the same IP or 4 requests for the same email. | First requests succeed; subsequent requests return HTTP 429 Too Many Requests (`AuthRateLimit` enforced in PostgreSQL). | [ ] |
| **ST-07** | **Password Reset Session Invalidation** | 1. Log in on Browser A (active session).<br>2. Complete password reset via token on Browser B.<br>3. Refresh or perform action on Browser A. | Session on Browser A is invalidated immediately (`UserSecurityState.validAfter` > token `iat`). User redirected to login. | [ ] |

---

## 5. Security Safeguards and Cleanup

1. **No Production Leakage:** Never use production Google OAuth credentials or production SMTP credentials in staging or local environments.
2. **Never Commit Secrets:** Staging credentials must remain solely in server-side environment configurations (`.env` or systemd drop-ins) and must never be committed to Git, pull requests, or issue trackers.
3. **Staging Test User Pruning:** Following staging verification rehearsals, test users created during the drills should be purged or marked inactive using staging database scripts.
4. **Audit Log Inspection:** Verify that `security_events` table contains the expected audit trail with proper metadata (IP, timestamp, severity, and normalized email).
