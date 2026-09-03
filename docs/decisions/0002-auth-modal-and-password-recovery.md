# 0002 — Auth modal and SMTP password recovery

Status: Accepted for development; live integration verification pending
Date: 2026-09-03
Scope: Milestone 7 / Sprint 16

## Context

Sign In and Create Account must open on the landing page. Password recovery uses a separate page and Hostinger Email; Google login remains visible but unavailable until credentials are supplied.

## Decision

- Keep the existing NextAuth.js **4.24.x** credentials provider, JWT sessions, and `@auth/prisma-adapter`. This records the actual implementation and supersedes the v5 selection language in ADR 0001; no auth-framework migration is included.
- Use URL-driven modal state and Next.js client routing, with server redirects for the legacy auth pages. All callback destinations share a local-path validator that rejects browser-normalized external destinations.
- Register Google only when both client ID and secret are present. Adapter-backed account creation is configured; live OAuth login is not yet verified. Do not enable automatic linking of existing credentials accounts solely by matching email.
- Use a custom reset-token model, separate from NextAuth verification tokens: 32 random bytes, SHA-256 digest persistence, 30-minute validity, a unique user key, and atomic upsert. Transactional consumption matches both row ID and digest so a replaced token cannot consume a newer token.
- Use Nodemailer 9.1.1 under the npm alias `nodemailer-secure`. NextAuth 4 declares an older optional Nodemailer peer; this app does not use its email provider. The alias allows the custom SMTP adapter to use the audited version without overriding that peer contract. The SMTP API is typed via `@types/nodemailer` and a local alias declaration.
- Keep SMTP and Google credentials out of source control; validate email configuration only when delivery is requested.

## Verification boundaries and launch requirements

- Unit tests isolate Prisma and SMTP boundaries; browser tests cover modal navigation, recovery UI, and access guards, not live mailbox delivery or authenticated database journeys.
- Apply and verify the additive migration on a disposable/staging database before enabling password recovery. Docker was unavailable during final local verification; no existing database was changed.
- Configure rotated SMTP credentials locally and verify a complete email → reset → sign-in journey. Google requires its own configured OAuth client and live verification.
- Generic reset response bodies hide account existence, but synchronous SMTP creates a timing difference. Rate limiting, delivery-abuse protection, and timing-resistant request handling must be verified before public exposure; generic body text alone is not complete enumeration protection.
- Password changes do not currently revoke already-issued JWT sessions. Session revocation policy remains a pre-launch authentication-hardening item.
- Existing middleware deprecation and dependency audit findings outside the new mail adapter remain tracked separately. This feature does not mark Milestone 7 or deployment complete.
