# Auth Modal, Google OAuth, and Password Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move credentials authentication into an accessible landing-page modal, prepare conditional Google OAuth, and add a secure email-based password-reset flow.

**Architecture:** The landing page owns a URL-driven auth modal through `?auth=sign-in|sign-up`, while legacy auth routes redirect to those modal URLs. Password reset uses a short-lived, single-use, hashed database token and an injected SMTP mailer so request handlers remain deterministic and testable. Google OAuth is registered only when both credentials exist, allowing its button to remain visibly disabled during development without causing provider errors.

**Tech Stack:** Next.js 16 App Router, React 19, NextAuth.js 4, Prisma 7/PostgreSQL, Zod, Nodemailer SMTP, Tailwind CSS 4, Vitest/Testing Library, Playwright.

**Spec:** `ROADMAP.md` Milestone 7 / Sprint 16 and the user-approved auth modal design from 2026-09-02.

## Global Constraints

- Preserve the credentials authentication behavior and default `/dashboard` destination.
- Keep all visible authentication terminology in English.
- Never reveal whether a submitted password-reset email exists.
- Store only a SHA-256 hash of reset tokens; tokens expire after 30 minutes and are single-use.
- Never commit SMTP passwords, Google secrets, reset tokens, or production credentials.
- Use Hostinger SMTP through environment variables; default documentation uses `smtp.hostinger.com`, SSL, port `465`.
- Do not display decorative icons; a close control is allowed only with an accessible name.
- Keep the permanent dark cosmic theme and make the modal responsive and keyboard accessible.

---

### Task 1: Password-reset token domain and persistence

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260902_add_password_reset_tokens/migration.sql`
- Create: `src/features/auth/password-reset.ts`
- Test: `src/features/auth/password-reset.test.ts`

**Interfaces:**
- Produces: `createPasswordResetToken(userId, now?) -> Promise<string>`
- Produces: `consumePasswordResetToken(rawToken, newPassword, now?) -> Promise<"updated" | "invalid">`
- Token lifetime: exactly 30 minutes.

- [x] **Step 1: Write failing domain tests**

  Cover raw-token generation with only a SHA-256 digest persisted, replacement of older tokens for the same user, rejection of expired tokens, and one-time consumption that updates `User.passwordHash` and deletes the token in one transaction.

- [x] **Step 2: Verify RED**

  Run: `npm test -- src/features/auth/password-reset.test.ts`

  Expected: FAIL because `password-reset.ts` and the Prisma model do not exist.

- [x] **Step 3: Add the model and migration**

  Add a `PasswordResetToken` model with `id`, unique `tokenHash`, unique `userId`, `expiresAt`, `createdAt`, a cascade relation to `User`, and an index on `expiresAt`. The SQL migration creates the table, indexes, unique constraint, and foreign key.

- [x] **Step 4: Implement the minimal domain service**

  Generate 32 random bytes, encode them as URL-safe base64, hash with SHA-256 before persistence, set `expiresAt` to `now + 30 minutes`, and consume the token transactionally after validating its expiry.

- [x] **Step 5: Verify GREEN**

  Run: `npm test -- src/features/auth/password-reset.test.ts`

  Expected: all password-reset domain tests PASS.

---

### Task 2: Generic password-reset request and completion APIs

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/lib/env/server.ts`
- Modify: `.env.example`
- Create: `src/features/auth/email/password-reset-email.ts`
- Create: `src/app/api/auth/forgot-password/route.ts`
- Create: `src/app/api/auth/reset-password/route.ts`
- Test: `src/features/auth/password-reset-route.test.ts`

**Interfaces:**
- Consumes: Task 1 token service.
- Produces: `sendPasswordResetEmail({ to, resetUrl }) -> Promise<void>`.
- Produces: `POST /api/auth/forgot-password` accepting `{ email: string }`.
- Produces: `POST /api/auth/reset-password` accepting `{ token: string, password: string }`.

- [x] **Step 1: Write failing route tests**

  Assert invalid email returns 400; both known and unknown valid emails return the identical generic 200 response; a known user receives a reset URL without exposing it in the response; SMTP failure still returns the generic response while invalidating the newly created token; invalid/expired/used reset tokens return 400; a valid token changes the password once.

- [x] **Step 2: Verify RED**

  Run: `npm test -- src/features/auth/password-reset-route.test.ts`

  Expected: FAIL because both handlers and mail adapter are missing.

- [x] **Step 3: Add Nodemailer and validated optional configuration**

  Install Nodemailer 9.1.1 under the `nodemailer-secure` npm alias and its TypeScript declarations (ADR 0002). Add optional `APP_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` fields. Validate SMTP as an all-or-none configuration when email sending is invoked, not during builds that intentionally omit deployment credentials.

- [x] **Step 4: Implement Hostinger-compatible mail delivery**

  Create the transport from validated environment values and send a concise HTML/plain-text reset message. Build reset URLs from `APP_URL`, falling back to `NEXTAUTH_URL`, and never log the URL or token.

- [x] **Step 5: Implement both APIs**

  Normalize email, use one generic request response, create tokens only for credentials users, invalidate a token if delivery fails, validate new password length at eight characters, and consume tokens through Task 1.

- [x] **Step 6: Verify GREEN**

  Run: `npm test -- src/features/auth/password-reset-route.test.ts`

  Expected: all request/reset API tests PASS.

---

### Task 3: Conditional Google OAuth provider

**Files:**
- Modify: `src/features/auth/auth.ts`
- Modify: `src/lib/env/server.ts`
- Modify: `.env.example`
- Test: `src/features/auth/auth-options.test.ts`

**Interfaces:**
- Produces: `isGoogleAuthConfigured() -> boolean`.
- Produces: an auth provider list containing Google only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` exist.

- [x] **Step 1: Write failing configuration tests**

  Assert Google is absent when neither or only one variable exists, present when both exist, and credentials remains present in every case.

- [x] **Step 2: Verify RED**

  Run: `npm test -- src/features/auth/auth-options.test.ts`

  Expected: FAIL because Google configuration support is missing.

- [x] **Step 3: Implement conditional provider registration**

  Add the Google provider without placeholder credentials. Preserve JWT callbacks so adapter-created OAuth users receive the same session shape as credentials users.

- [x] **Step 4: Verify GREEN**

  Run: `npm test -- src/features/auth/auth-options.test.ts`

  Expected: all provider tests PASS.

---

### Task 4: Landing-page auth modal and legacy-route compatibility

**Files:**
- Create: `src/features/auth/components/auth-modal.tsx`
- Create: `src/features/auth/components/auth-modal.test.tsx`
- Modify: `src/components/navigation/app-header.tsx`
- Modify: `src/components/navigation/app-header.test.tsx`
- Modify: `src/app/page.tsx`
- Replace: `src/app/(auth)/sign-in/page.tsx`
- Replace: `src/app/(auth)/sign-up/page.tsx`
- Modify: `src/middleware.ts`

**Interfaces:**
- Consumes: query values `auth=sign-in|sign-up`, optional `callbackUrl`, and optional `registered=true`.
- Produces: modal open/close/switch navigation that preserves a safe callback destination.

- [x] **Step 1: Write failing component tests**

  Assert Sign In and Create Account variants render the correct fields, switching updates the URL, registration success opens Sign In with confirmation, credentials success respects a safe same-origin callback, Google button is disabled with `Setup pending` when unconfigured, and Forgot Password links to `/forgot-password`.

- [x] **Step 2: Write failing header and route compatibility tests**

  Assert desktop/mobile auth controls target `/?auth=...`, and `/sign-in` plus `/sign-up` server pages redirect to the equivalent landing modal while preserving safe callback parameters.

- [x] **Step 3: Verify RED**

  Run: `npm test -- src/features/auth/components/auth-modal.test.tsx src/components/navigation/app-header.test.tsx`

  Expected: FAIL because the modal and updated links do not exist.

- [x] **Step 4: Implement the modal**

  Use native dialog semantics with a fixed backdrop, dark cosmic card, focus containment, initial focus, Escape/overlay close, focus restoration, body scroll lock, inline status/error regions, loading states, and responsive sizing. Use Next.js client routing so modal state remains URL-driven and browser Back stays compatible.

- [x] **Step 5: Connect navigation and compatibility routes**

  Update desktop/mobile buttons to modal query URLs. Replace legacy pages with server redirects and adjust auth middleware so protected-route redirects resolve to `/?auth=sign-in&callbackUrl=...`.

- [x] **Step 6: Verify GREEN**

  Run: `npm test -- src/features/auth/components/auth-modal.test.tsx src/components/navigation/app-header.test.tsx`

  Expected: all modal/navigation tests PASS.

---

### Task 5: Forgot and Reset Password pages

**Files:**
- Create: `src/app/(auth)/forgot-password/page.tsx`
- Create: `src/app/(auth)/reset-password/page.tsx`
- Create: `src/features/auth/components/forgot-password-form.tsx`
- Create: `src/features/auth/components/reset-password-form.tsx`
- Test: `src/features/auth/components/password-reset-forms.test.tsx`

**Interfaces:**
- Consumes: Task 2 APIs and `token` from reset-page query parameters.
- Produces: accessible standalone recovery pages consistent with the dark Netloka theme.

- [x] **Step 1: Write failing form tests**

  Assert request submission shows the generic confirmation, reset requires matching passwords of at least eight characters, missing token disables submission with a safe error, success links back to `/?auth=sign-in`, and API errors are announced.

- [x] **Step 2: Verify RED**

  Run: `npm test -- src/features/auth/components/password-reset-forms.test.tsx`

  Expected: FAIL because the forms do not exist.

- [x] **Step 3: Implement recovery UI**

  Build focused, responsive forms with English copy, semantic labels, visible focus, status alerts, loading/disabled states, and no account-existence disclosure.

- [x] **Step 4: Verify GREEN**

  Run: `npm test -- src/features/auth/components/password-reset-forms.test.tsx`

  Expected: all recovery UI tests PASS.

---

### Task 6: End-to-end coverage, documentation, and quality gates

**Files:**
- Modify: `src/e2e/foundation.spec.ts`
- Modify: `PLAN.md`
- Modify: `ROADMAP.md` only if status language materially changes
- Modify: `README.md`
- Modify: `CHANGELOG.md`

- [x] **Step 1: Update E2E expectations**

  Cover navbar-to-modal opening, mode switching, close behavior, legacy-route redirect, Forgot Password navigation, reset-page invalid token state, and disabled Google setup state.

- [x] **Step 2: Update documentation**

  Record the implemented Sprint 16 auth refinement, required Google/SMTP environment variables, Hostinger defaults, migration deployment requirement, and a timestamped WITA changelog entry with `Git: pending`.

- [x] **Step 3: Regenerate Prisma and run focused tests**

  Run: `npm run db:generate` with a safe local `DATABASE_URL`, then all focused Vitest files from Tasks 1–5.

- [x] **Step 4: Run complete verification**

  Run: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e -- --project=chromium`, and `npm run build` with safe test environment placeholders.

- [x] **Step 5: Run UI quality checks**

  Run the Impeccable detector once against all changed UI files, inspect desktop and mobile modal layouts, verify keyboard focus/Escape behavior, and review reduced-motion behavior.

- [ ] **Step 6: Review the final diff**

  Run `git diff --check`, inspect `git status`, verify no credentials or raw reset tokens appear, and classify/fix all Critical or High findings before claiming completion.

## Final local verification — 2026-09-03

Tasks 1–5 and Task 6 Steps 1–5 are implemented and locally verified. Final gates: 160 Vitest tests, 72 cross-browser Playwright tests, lint, type-check, build, and Prisma schema validation passed. The final browser run used a built local app on port 3001 with one worker; the temporary config was removed afterward.

Step 6 review was performed and callback/token-race findings were fixed, but its release-blocker criterion is intentionally not marked complete: live migration/SMTP/OAuth verification, reset abuse/timing protection, session revocation policy, and dependency remediation remain tracked in PLAN, ADR 0002, and the technical debt register. No deployment, commit, push, PR, or merge has occurred.

## PR handoff — 2026-09-03

The project owner subsequently requested a PR for human review. Implementation is committed as `9d681b211af9dfa9a37e8e49efbc7e70b38cbac9` on `codex/auth-modal-password-reset`, based on `main` at `73c1ea1`. Lint, type-check, and 160 unit tests were re-run before commit. Publishing a review PR does not close the release blockers above; no merge or deployment is authorized.
