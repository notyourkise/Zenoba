# Zenoba Application Identity Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace released application and local-development identity with Zenoba, add public `/about`, and preserve homepage, authentication, learner data, and production storage.

**Architecture:** Static copy, metadata, navigation, and documentation change in the current Next.js monolith. `/about` is a public App Router server page composing existing marketing navigation; it does not touch persistence or authorization. Production database names, volumes, networks, backups, and `/srv/netloka` are out of scope.

**Tech Stack:** Next.js 16.3.5, React 19.2.8, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Playwright, Prisma 7, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`

## Global Constraints

- Preserve the homepage layout, cosmic treatment, simulator, section order, and primary behavior; add only Zenoba identity text and the small `Tentang Zenoba` link.
- Publish only verified claims: practical IT infrastructure learning, independently operated by Fikri Haikal, formerly Netloka.
- Never publish a founding year, user count, “ribuan pelajar”, legal-entity/corporation, certification, or unsupported security claim.
- `/about` is public, same-tab, semantic, and links to `/`, `/terms`, and `/privacy-policy`.
- Do not add dependencies, a database migration, or auth/learner/payment/Developer behavior changes.
- Preserve `/srv/netloka`, production database/volume/network/backup identifiers, and production Compose names.
- Preserve dated changelog/ADR evidence; rebrand current product docs and active public copy.
- Read installed Next.js 16.3.5 docs under `node_modules/next/dist/docs/` before code edits. Use WITA records and never commit secrets.

## Review Focus

- Direct `/about` visits, with or without a session, remain public and no account modal appears — Tasks 1 and 5.
- Desktop and mobile each expose one usable `Tentang Zenoba` link without losing product navigation — Task 2.
- Reset links keep token/query and 30-minute copy as sender branding changes — Task 3.
- Existing stored TOTP secrets stay valid when the displayed issuer changes — Task 3.
- Each remaining Netloka string is historical, legacy-domain/private-infrastructure, or removed — Task 4.

---

### Task 1: Public About route and document metadata

**Files:**
- Create: `src/app/about/page.tsx`, `src/app/about/page.test.tsx`
- Modify: `src/app/layout.tsx`, `src/middleware.test.ts`

**Interfaces:** consumes `AppHeader`, `Link`, root dark styling, and current middleware; produces a static public `/about` page with `metadata: Metadata`, no new API or data contract.

- [ ] **Step 1: Read current framework guidance**

Run: `rg -n "metadata|App Router" node_modules/next/dist/docs -g "*.md" | Select-Object -First 40`

Expected: code follows installed Next.js 16 guidance.

- [ ] **Step 2: Write failing route tests**

Create `about/page.test.tsx`; render the default page and assert exactly one `h1` named `Tentang Zenoba`, approved positioning/founder/date-free history content, and `/`, `/terms`, `/privacy-policy` links. Assert no year, user count, or `Corporation`.

Run: `npm test -- src/app/about/page.test.tsx`

Expected: FAIL because the route is absent.

- [ ] **Step 3: Implement the page and root metadata**

Create the server page with `title: "Tentang Zenoba | Zenoba"`; compose `AppHeader` and a semantic `main`. Use only the spec’s vision, mission, values, product areas, founder, and transitional history copy. Update root title/description to Zenoba. Do not set `metadataBase`, canonical, or Zenoba Open Graph URLs before the domain plan.

- [ ] **Step 4: Pin route accessibility**

Add a no-token `/about` test to `middleware.test.ts` expecting `NextResponse.next()`, and assert `config.matcher` does not protect the route.

Run: `npm test -- src/app/about/page.test.tsx src/middleware.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/about src/app/layout.tsx src/middleware.test.ts
git commit -m "feat: add Zenoba about page"
```

### Task 2: Marketing navigation identity, without a homepage redesign

**Files:**
- Modify: `src/components/navigation/app-header.tsx`, `src/components/navigation/app-header.test.tsx`
- Modify: `src/components/marketing/marketing-footer.tsx`, `src/components/marketing/marketing-footer.test.tsx`
- Modify: `src/app/page.test.tsx`

**Interfaces:** consumes existing navigation catalog/mobile state/footer primitives; produces Zenoba wordmark and About links while retaining product/auth controls.

- [ ] **Step 1: Write failing component tests**

Assert header has `aria-label="Zenoba Home"`, wordmark `ZENOBA`, and `Tentang Zenoba` → `/about` on desktop and after opening mobile drawer. Assert footer has Zenoba wordmark/copyright and an About link.

Run: `npm test -- src/components/navigation/app-header.test.tsx src/components/marketing/marketing-footer.test.tsx`

Expected: FAIL against old branding.

- [ ] **Step 2: Change header only**

Replace the visible/accessibility wordmark. Add one text About link beside desktop product navigation and one mobile link that closes the drawer. Do not change dimensions, scrolling, catalog items, auth labels, or hamburger behavior.

- [ ] **Step 3: Change footer only**

Replace brand/copyright and unsupported learner-volume copy; add About without removing Terms/Privacy. Preserve CTA, artwork, and layout.

- [ ] **Step 4: Prove composition remained stable**

Extend `page.test.tsx` only to assert existing landing headline/sign-in/sign-up plus Zenoba navigation. Do not snapshot animation or rewrite `page.tsx`.

Run: `npm test -- src/components/navigation/app-header.test.tsx src/components/marketing/marketing-footer.test.tsx src/app/page.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/app-header* src/components/marketing/marketing-footer* src/app/page.test.tsx
git commit -m "feat: rebrand marketing navigation to Zenoba"
```

### Task 3: Auth, legal, recovery email, and TOTP brand copy

**Files:**
- Create: `src/features/auth/email/password-reset-email.test.ts`, `src/e2e/about.spec.ts`
- Modify: `src/features/auth/email/password-reset-email.ts`, `src/features/auth/components/auth-modal.tsx`, `src/features/auth/components/auth-modal.test.tsx`, `src/features/auth/password-reset-route.test.ts`, `src/features/auth/totp.ts`, `src/features/auth/totp.test.ts`, `src/features/auth/callback-url.ts`
- Modify: `src/app/(legal)/layout.tsx`, `src/app/(legal)/terms/page.tsx`, `src/app/(legal)/privacy-policy/page.tsx`, `src/e2e/legal-pages.spec.ts`

**Interfaces:** consumes `EMAIL_FROM`, reset-token service, TOTP algorithm, and legal layout; produces Zenoba-visible surfaces without altering URLs, token lifetime, Google scopes, account data, or TOTP verification.

- [ ] **Step 1: Write failing reset-email test**

Mock `nodemailer-secure` and `getEmailEnvironment()`. Assert one mail call uses `Zenoba <${EMAIL_FROM}>`, subject `Reset your Zenoba password`, Zenoba text/HTML, exact supplied reset URL, 30-minute expiry, and escaped HTML URL.

Run: `npm test -- src/features/auth/email/password-reset-email.test.ts`

Expected: FAIL because sender/copy says Netloka.

- [ ] **Step 2: Implement auth/email updates**

Replace only visible Netloka strings in email and `AuthModal`; preserve endpoint paths, callback validation, forms, generic response, and token generation. Update reset-route expectation only after its test explicitly sets the Zenoba `APP_URL`; retain token query assertion.

- [ ] **Step 3: Change the future TOTP label safely**

Set `generateTotpUri(..., issuer = "Zenoba")`, update URI assertions, and retain pre-existing-secret verification tests. Change callback sentinel `netloka.invalid` to `zenoba.invalid` with identical validation semantics.

- [ ] **Step 4: Correct legal factual copy**

Replace identity with Zenoba and pre-launch language with factual live-service language. Retain Fikri Haikal as individual operator, current verified contact until a Zenoba mailbox exists, reset 30-minute disclosure, Google scope limits, payment-disabled statement, and simulation/certification disclaimers. Set “last updated” to the actual WITA publication date, not a founding date.

- [ ] **Step 5: Update browser/component coverage**

Update legal title/Back-link tests to Zenoba. Add `about.spec.ts` at 390px/1440px asserting HTTP 200, one h1, title, legal/home links, no dialog, and no horizontal overflow. Keep auth-modal new-tab legal-link form-state tests unchanged.

Run: `npm test -- src/features/auth/email/password-reset-email.test.ts src/features/auth/components/auth-modal.test.tsx src/features/auth/password-reset-route.test.ts src/features/auth/totp.test.ts && npm run test:e2e -- src/e2e/legal-pages.spec.ts src/e2e/about.spec.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/features/auth src/app/(legal) src/e2e
git commit -m "feat: rebrand auth and legal copy to Zenoba"
```

### Task 4: Current repository identity and classified legacy-reference audit

**Files:**
- Modify: `package.json`, `package-lock.json`, `.env.example`, `Dockerfile`, `playwright.config.ts`, local/staging Compose/examples/scripts, current docs, and current source/tests returned by inventory.
- Create: `docs/operations/zenoba-legacy-reference-allowlist.md`
- Preserve: historical `CHANGELOG.md`/ADRs, `compose.production.yml` private identifiers, `/srv/netloka`, production backup paths, and Netloka domain config until cutover.

**Interfaces:** consumes repository identity and installed lockfile; produces `zenoba` current/local/staging identity and a reviewable allowlist.

- [ ] **Step 1: Capture failing inventory**

Run:

```powershell
git grep -ni -E "Netloka|netloka" -- . ":!CHANGELOG.md" ":!docs/superpowers/**"
```

Classify each result: released copy, current source/test/config/doc, historical evidence, legacy-domain compatibility, or protected production identifier. Record only the last three in the allowlist with path and reason.

- [ ] **Step 2: Rebrand current identity**

Set package name `zenoba`; regenerate root lock metadata without dependency-version changes; update current local/staging examples, test fixture domains, Docker comments/labels, and current docs. Do not auto-rename an existing local DB; document fresh Zenoba DB setup while existing local data remains usable.

- [ ] **Step 3: Protect production continuity**

Do not rename production volume/network/database/backup names, `/srv/netloka`, or legacy Nginx behavior. Add each retained item to allowlist and link the domain-cutover plan.

- [ ] **Step 4: Validate audit and full app**

Re-run inventory; output must match only allowlist/history/legacy-private categories.

Run: `git diff --check && npm run db:generate && npm run lint && npm run typecheck && npm test && npm run build`

Expected: PASS, with no secret introduced.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.example Dockerfile playwright.config.ts docker-compose.yml docker-compose.prod.yml compose.staging.yml deploy README.md PRODUCT.md DESIGN.md docs src scripts
git commit -m "chore: align repository identity with Zenoba"
```

### Task 5: Release gate, PR, and safe local-folder transition

**Files:**
- Modify: `CHANGELOG.md`, `PLAN.md`, `ROADMAP.md` only for real delivery state, `docs/HANDOFF.md`
- Move after merge: `D:\laragon\www\NetLoka` → `D:\laragon\www\Zenoba`

**Interfaces:** consumes a complete rebrand branch and clean merged main; produces verified app release and local relocation, never a domain/VPS cutover.

- [ ] **Step 1: Run full isolated release gate**

Run: `npm ci; npm run db:generate; npm run lint; npm run typecheck; npm test; npm run test:e2e; npm run build; git diff --check`

Expected: PASS; document unavailable external integrations.

- [ ] **Step 2: Review and deliver for user review**

Review complete diff for homepage redesign, migrations, secrets, private-resource rename, and unsupported claims. Update WITA docs, commit, push focused branch, create one PR to `main`, and verify CI on current PR head.

- [ ] **Step 3: Wait for Abangku's merge**

Do not merge for Abangku. Once merged, verify the exact PR and fast-forward clean main.

- [ ] **Step 4: Move local checkout safely**

From outside project root, confirm source path is clean/synchronized, destination does not exist, and Laragon/Node/editor processes no longer use it. Then run:

```powershell
Move-Item -LiteralPath 'D:\laragon\www\NetLoka' -Destination 'D:\laragon\www\Zenoba'
```

Do not recursively delete, copy-and-delete, or target an unresolved path.

- [ ] **Step 5: Verify relocation**

From `D:\laragon\www\Zenoba`: run `git status --short`, `git remote -v`, `npm ci`, and `npm run typecheck`; then update editor/Laragon references. Record final revision/path and domain-cutover next action; do not dirty merged main merely for a handoff.
