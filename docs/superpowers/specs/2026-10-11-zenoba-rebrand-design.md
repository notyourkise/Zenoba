# Zenoba Full Rebrand Design

## Goal

Rebrand the live Netloka application to Zenoba while preserving the current public homepage structure, existing learner data, and operating safety. Zenoba becomes the primary public identity and zenoba.tech becomes the primary domain after a staged cutover. Netloka remains only as a compatibility domain that redirects visitors and deep links.

## Approved decisions

- The current homepage layout, cosmic visual treatment, simulator, section order, and primary interaction behavior remain intact.
- The only homepage additions are Zenoba naming and a small text link to a separate public About page.
- The About page is a normal public route at /about in the same browser tab, not a modal.
- Zenoba is an independently operated product of solo founder Fikri Haikal and is not presented as a PT, CV, corporation, or separate legal entity.
- No unverified founding year, user count, certification, or corporate claim is published.
- Local source checkout is renamed from D:\laragon\www\NetLoka to D:\laragon\www\Zenoba after the application change is verified.
- The first cutover does not rename production PostgreSQL data, Docker volumes, Docker networks, backups, or /srv/netloka. Those identifiers are private operational history and preserving them protects continuity and rollback.
- netloka.biz.id remains online after cutover and returns permanent, path-preserving redirects to zenoba.tech.

## Scope

### Public brand and content

Replace user-visible Netloka identity with Zenoba in the homepage, header, marketing footer, authentication copy, email templates, legal pages, document titles, social metadata, application name, and production-facing configuration.

Create a public About Zenoba page with:

1. Zenoba positioning as practical IT infrastructure learning.
2. Statement that Zenoba is independently developed and operated by a solo founder.
3. A date-free history: developed as Netloka, live with early users, then rebranded as Zenoba.
4. Vision, mission, product values, and product areas.
5. Founder section for Fikri Haikal with no invented biography, achievements, credentials, or founding date.
6. Clear links back to the homepage, Terms, and Privacy Policy.

Existing Terms and Privacy Policy must use current factual live-service language. Their operator identity remains the individual operator, never a fictional corporate entity.

### Repository and local development identity

Rename the local project directory to D:\laragon\www\Zenoba and change application-facing identifiers such as the package name, README title, Docker image labels, Compose project names for new local/staging use, tests, documentation, and safe examples.

The Git history remains unchanged. The remote GitHub repository and organization name are separate remote assets; they are not renamed without a separate explicit decision and authorization.

### Domain and live-service identity

Zenoba uses zenoba.tech as the canonical public domain. Before cutover, staging must prove that:

- APP_URL and NEXTAUTH_URL resolve to the intended Zenoba origin.
- Google OAuth redirect URIs include the Zenoba callback before the live switch.
- Password-reset links point to Zenoba and remain valid through their existing 30-minute token lifetime.
- Cookie/session behavior is tested on the new host; users may need to sign in again because browser cookies are domain-bound.
- Nginx, TLS certificate, Cloudflare DNS, security headers, robots.txt, sitemap, canonical metadata, Open Graph metadata, and health checks work on Zenoba.
- All Netloka paths, query strings, callback URLs, and legacy legal routes redirect to their Zenoba equivalents.
- Netloka remains available long enough to catch late password-reset links and bookmarked deep links.

## Explicit non-goals

- No redesign of the homepage layout, cosmic theme, simulator, or learning product flows.
- No database schema migration, user-data migration, table rename, historical migration rename, or data re-seed.
- No change to entitlement, payment, learner progression, Developer workspace, or authorization behavior.
- No removal of the Netloka domain during the first cutover.
- No production Docker-volume, database, network, backup, or VPS-root rename during the first cutover.
- No GitHub repository rename, mailbox creation, DNS purchase, Cloudflare mutation, VPS mutation, or deployment in the documentation-only planning stage.

## Architecture

The change is split into three independently verifiable layers.

1. Application identity layer: static copy, metadata, marketing navigation, /about, email branding, legal content, tests, and documentation. This layer has no database migration.
2. Local and repository layer: local checkout directory and non-production configuration names become Zenoba after the application layer is verified.
3. Domain cutover layer: zenoba.tech becomes the production origin; netloka.biz.id becomes a compatibility redirect. Production private storage names remain stable.

This separation prevents a branding mistake from becoming a data or infrastructure migration.

## Affected application boundaries

| Boundary | Current location | Rebrand responsibility |
| --- | --- | --- |
| Root metadata | src/app/layout.tsx | Zenoba title, Indonesian description, canonical/social metadata policy |
| Public homepage | src/app/page.tsx | Preserve composition; display Zenoba identity only |
| Marketing navigation | src/components/navigation/app-header.tsx | Zenoba wordmark, accessible About link on desktop and mobile |
| Marketing footer | src/components/marketing/marketing-footer.tsx | Zenoba identity, About link, truthful claims, legal navigation |
| About route | src/app/about/page.tsx | New public route and scoped metadata |
| Auth copy | src/features/auth/components and auth routes | Zenoba-visible labels without changing auth contracts |
| Reset email | src/features/auth/email/password-reset-email.ts | Zenoba sender display name, subject, and copy |
| Legal content | src/app/(legal)/terms/page.tsx and privacy-policy/page.tsx | Zenoba name and factual live-service disclosures |
| Runtime URL configuration | .env.example, src/lib/env/server.ts, auth/email consumers | Zenoba URL values at deployment without secrets |
| Route protection | src/middleware.ts | Keep /about public; verify existing authenticated routes unchanged |
| E2E and unit tests | src/app/page.test.tsx, marketing tests, legal-pages.spec.ts, auth-email/reset tests, new about tests | Lock brand, navigation, public accessibility, and unchanged protected routes |
| Deployment manifests | compose.production.yml, compose.staging.yml, deploy/*, Caddyfile, docker compose files | Rename public-facing/configuration identifiers only; preserve production private storage names |
| Documentation | README.md, PRODUCT.md, DESIGN.md, ROADMAP.md, PLAN.md, CHANGELOG.md, docs/* | Separate current Zenoba truth from historical Netloka evidence |

## Information architecture

Public navigation retains the existing product navigation. A text link named “Tentang Zenoba” is added in the header's desktop/mobile navigation and marketing footer.

Route behavior:

- /: current homepage, visually unchanged except Zenoba identity.
- /about: Zenoba About page, public and unauthenticated.
- /terms and /privacy-policy: current public legal routes with Zenoba wording.
- /learn, /labs, /challenges, /consultant, and learner/account routes: unchanged authorization behavior.
- Legacy netloka.biz.id/<path>?<query>: permanent redirect to https://zenoba.tech/<path>?<query> after production cutover.

The About page reuses the existing dark product visual language without introducing a new design system, decorative icon set, or homepage section. It has semantic article structure, an h1, readable content width, keyboard-visible links, and a Back to home link.

## Content rules

Use only verified statements:

- “Zenoba adalah platform belajar IT infrastructure berbasis praktik.”
- “Zenoba dikembangkan dan dikelola secara independen oleh Fikri Haikal.”
- “Zenoba sebelumnya hadir sebagai Netloka.”
- “Networking adalah domain pembelajaran yang tersedia.”

Do not state a founding year, active-user number, “ribuan pelajar”, “Netloka/Zenoba Corporation”, company registration, certification outcome, or unsupported security guarantee.

A new Zenoba-domain support mailbox is required before placing a Zenoba email address in public copy. Until then, the current verified operational contact stays in legal content and is not framed as a generic support mailbox.

## Migration behavior and failure handling

- DNS/TLS failure: keep netloka.biz.id serving the current application; do not switch the canonical domain or redirects.
- OAuth callback failure: retain both old and new authorized callback URIs until end-to-end authentication succeeds on Zenoba.
- Email-link failure: keep Netloka reset routes operating while in-flight reset tokens expire; do not redirect a reset request in a way that drops its token/query parameters.
- Session loss on new domain: display the normal sign-in experience and never imply account data was lost.
- Redirect failure: preserve full pathname and query string; provide an emergency rollback by routing zenoba.tech back to the prior verified origin and pausing Netloka redirects.
- Local folder rename failure: keep the existing checkout untouched and stop before changing Laragon, editor, or local environment paths.

## Acceptance criteria

1. The homepage visual structure remains recognizably unchanged; only approved brand/link text changes.
2. /about is public, has Zenoba-specific metadata, has exactly one h1, and links back to home and legal pages.
3. Header and footer link to /about on desktop and mobile without breaking the existing product navigation or auth controls.
4. No user-visible “Netloka” text remains in released application screens, email templates, metadata, or active legal copy, except the approved transitional phrase describing the former name.
5. No fictional organization, user-count, founding-year, or product-certification claim is introduced.
6. Existing authentication, learner data, learning paths, labs, challenges, Consultant, Developer workspace, payments-disabled behavior, and health endpoint have no behavior regression.
7. zenoba.tech passes HTTPS, health, anonymous home/About/legal, signup/signin, Google OAuth, reset-password, and authenticated learner smoke tests before it becomes canonical.
8. netloka.biz.id redirects every tested route and query to the exact Zenoba counterpart.
9. Production database data, migration history, volume, and backup continuity are preserved.
10. The local checkout is moved to D:\laragon\www\Zenoba only after no process is using the old directory and local configuration points to the new path.

## Required owner decisions before live cutover

- Approve the final public founder bio/photo/links, if any.
- Approve a monitored Zenoba-domain contact mailbox before it is shown publicly.
- Approve when netloka.biz.id changes from serving the application to redirects.
- Authorize any Cloudflare, DNS, TLS, Google OAuth console, email-hosting, VPS, and GitHub remote changes separately at the time they are ready.
- Decide later whether GitHub repository and private production resource names must be renamed after the safe first cutover.

## Verification strategy

Application work uses focused unit/component tests for metadata, header/footer links, About content, legal brand copy, and reset-email branding; then existing relevant E2E tests for anonymous, auth, legal, learner, developer, and payment-disabled paths. The complete project gates are lint, typecheck, unit/integration tests, Playwright E2E, production build, and git diff --check.

Domain cutover has a separate staging checklist and never relies only on local tests. It requires external HTTPS, redirect, OAuth, reset-email, cookie/session, health, and rollback evidence.

## Rollback

If the application branding release fails before domain cutover, redeploy the prior application image/commit and keep the existing Netloka origin.

If the domain cutover fails, restore the prior DNS/proxy routing, serve the existing application through netloka.biz.id, retain the database unchanged, and investigate in staging. No database rollback is part of a branding rollback.

## Delivery stages

1. Write and approve the execution plan.
2. Build and verify application identity plus /about in an isolated branch.
3. Review and merge the application change without switching production domain.
4. Rename the local checkout after merge and verify local development.
5. Prepare zenoba.tech staging and run the domain cutover checklist.
6. Obtain specific authorization for external mutations and deploy/cut over.
7. Monitor compatibility redirects and decide later whether private infrastructure names can be safely renamed.
