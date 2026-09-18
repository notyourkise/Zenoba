# 0003 — Legal reading pages and policy boundaries

Status: Superseded by Sprint 41 / Task 41.1 (Factual operator readiness & contact established)
Date: 2026-09-03 (Updated 2026-09-18)
Scope: Milestone 7 / Sprint 16

## Decision

The owner requested Terms and Privacy Policy links in both auth modal modes, with separate white-background, black-text, text-only pages, and explicitly authorized drafting and implementation without a separate content-review gate. Existing English product terms remain; body copy is Indonesian.

- `/terms` and `/privacy-policy` are public Server Component pages under `(legal)`, outside the protected application layout. They work without a session or JavaScript.
- A shared CSS Module provides readable typography and a full white canvas. Root overrides only match while the legal wrapper exists, so retained stylesheets cannot recolor the landing page after client navigation. Legal pages restore visible native scrolling and provide underlined text links, keyboard focus, and print rules. No icons, emoji, illustrations, animation, cards, or marketing navigation are introduced on these pages.
- Modal links use a new tab with `noopener noreferrer` and an explicit new-tab notice. The original form values, mode, and callback stay untouched. Landing-footer links provide discovery without opening authentication.
- Links are informational notices. This task does not create acceptance records, checkbox gates, or inferred blanket consent, and does not change registration, authentication, or database schemas.

## Content evidence

- Account/profile/OAuth fields: `prisma/schema.prisma`, `src/features/auth/auth.ts`, `src/app/api/user/profile/route.ts`.
- Learning/quiz/XP/practice/project persistence: feature services, submission handlers, and their Prisma models.
- Credentials/reset processing: `src/features/auth/password.ts`, `password-reset.ts`, auth handlers, and the SMTP adapter under `src/features/auth/email/`.
- Browser/session behavior: NextAuth JWT configuration, `src/app/providers.tsx`, and next-themes browser storage. Log statements and current integrations support the limited description of technical data, not an assertion about deployed infrastructure.
- Development status: ROADMAP/PLAN and ADR 0002. Google and live SMTP/migration journeys remain unverified.

No company identity, dedicated support mailbox, retention deadline, automatic account-deletion feature, certification, guaranteed security, or production location was invented. An SMTP sender is not assumed to be a monitored privacy contact. The current policies state the development limitations explicitly.

## References consulted

- [UU 27/2022 — official JDIH Kemkomdigi text](https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/crc32/): information/access/correction/deletion and consent-related rights, with special handling for children's data. Operational details and applicable obligations require qualified legal review before public launch.
- [Google OAuth 2.0 Policies](https://developers.google.com/identity/protocols/oauth2/policies): accurate disclosures, minimal scopes, safe credential/token handling, and discoverable homepage terms/privacy links. These requirements are not satisfied solely by publishing two pages.
- [NextAuth v4 Google provider](https://next-auth.js.org/providers/google): callback path `/api/auth/callback/google`; the provided `/auth/google/callback` registration does not match this implementation.

## Gates before public use

Confirm the operator's identity and working contact channel; define lawful processing bases and consent evidence where required, data-rights operations, retention and backup deletion, child/guardian consent, processors/locations/transfers, and Google token-storage/revocation policy. Update the public copy to the deployed facts. Track this under TD-10; the pages are not a legal-compliance or OAuth-verification certificate.

In **Milestone 15 / Sprint 41 / Task 41.1**, the operator identity (Pengelola Perseorangan Platform Netloka / Fikri Haikal), active Hostinger mailbox (`noreply@haikalariadma.my.id`), incident response runbook, and data rights procedures were established in `docs/operations/operator-readiness.md`, `docs/operations/incident-response.md`, and updated on the public `/terms` and `/privacy-policy` pages.

The supplied OAuth client secret was exposed in chat and has not been copied into this worktree. Use rotated credentials in private environment configuration, register the correct callback for the actual development/production origin, and verify OAuth against an authorized test database before activation. No external Google configuration, account login, deployment, or real email was performed by this task.
