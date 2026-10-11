# Netloka — Agent Handoff

Last updated: **2026-10-11 15:42 WITA**. Read \`AGENTS.md\` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## 1. Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba, including a separate public \`/about\` page, while retaining the homepage structure and existing learner behavior.
- Approved scope:
  - Zenoba is an independently developed product operated by solo founder Fikri Haikal; no legal-entity, founding-year, user-count, or unsupported corporate claim may be published.
  - The homepage keeps its current cosmic visual composition; only identity text and a small \`Tentang Zenoba\` link are added.
  - The local checkout will later move from \`D:\\laragon\\www\\NetLoka\` to \`D:\\laragon\\www\\Zenoba\`.
  - The first production cutover must preserve PostgreSQL data, Docker volumes/networks, backups, and \`/srv/netloka\`; legacy \`netloka.biz.id\` will later redirect to \`zenoba.tech\`.
- Task phase: design specification written and locally committed; execution plan has not yet been written or approved.
- No application, domain, DNS, OAuth, VPS, production deployment, or GitHub remote mutation has been performed for this rebrand.

## 2. Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | \`D:\\laragon\\www\\NetLoka\`, clean \`main\` at \`7fdd7afcd72870743ee7702e9b2b322f059acbd9\` |
| Main revision subject | \`Merge pull request #87 from notyourkise/codex/auth-modal-google-icon\` |
| Planning worktree | \`C:\\Users\\USER\\.codex\\worktrees\\zenoba-rebrand-plan\\NetLoka\` |
| Planning branch | \`codex/zenoba-rebrand-plan\`, based on \`7fdd7af\` |
| Planning changes | Zenoba design spec, changelog checkpoint, and this handoff update are included in the current planning checkpoint |
| GitHub repository | \`notyourkise/NetLoka\`; renaming it is outside the approved first-cutover scope |
| Production resource history | Previous handoff records \`/srv/netloka/production\` and \`netloka.biz.id\`; current VPS state is not re-verified in this documentation checkpoint |

## 3. Current Design Evidence

- The live public homepage was reviewed before planning; it is not to be redesigned.
- \`zenoba.tech\` currently resolves to a parked Hostinger page, so no canonical-domain switch has occurred.
- The existing application has no public \`/about\` route; middleware currently does not protect that route, which supports a new public About page.
- Existing public/source copy includes stale Netloka branding and unsupported claims such as “ribuan pelajar”; the implementation must replace them with verified Zenoba language.
- Existing legal copy includes pre-launch language even though prior records say the service is live; implementation must correct that factual mismatch.
- ROADMAP records Milestones 0–15 as complete. Older PLAN/README/PRODUCT and the previous handoff require live verification before being treated as current delivery evidence.

## 4. Planning Artifact

- Design spec: \`docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md\`
- The spec separates application identity, local/repository identity, and domain cutover so a brand change does not become a database or production-storage migration.
- Required later owner decisions: founder bio/photo/links, Zenoba support mailbox, legacy-domain redirect timing, and specific authorization for Cloudflare/DNS/TLS/Google OAuth/VPS/GitHub mutations.

## 5. Validation and Limits

- Completed for this checkpoint: repository/context recovery, current source/configuration boundary inspection, public-domain observation, design consistency review, and \`git diff --check\`.
- Not run: application test suites, E2E, build, CI, or production checks. This checkpoint changes documentation only.
- No claim of deployment, migration, or domain readiness is made.

## 6. Next Action

1. Abangku reviews and confirms the design specification.
2. Anto writes the detailed execution plan, including ordered implementation tasks, test cases, migration/cutover checklist, risks, and approvals.
3. Only after plan approval, create the implementation worktree/branch and begin the app identity change. Domain and VPS actions remain separately authorized.

