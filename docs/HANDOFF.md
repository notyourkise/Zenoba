# Netloka — Agent Handoff

Last updated: **2026-10-11 15:54 WITA**. Read `AGENTS.md` and verify live Git, CI, and deployment state before continuing. This is a snapshot, not a status feed.

## Current Task and Authority

- Product: practical IT infrastructure learning platform; Networking is the currently available learning domain.
- Current requested work: a full public rebrand from Netloka to Zenoba with a separate public `/about` page, while retaining the homepage structure and learner behavior.
- Approved scope: Zenoba is independently operated by solo founder Fikri Haikal; no legal-entity, founding-year, user-count, or unsupported corporate claim may be published.
- Approved safety boundary: the first cutover preserves PostgreSQL data, Docker volumes/networks, backups, and `/srv/netloka`; the legacy domain will later redirect to `zenoba.tech`.
- Task phase: design specification and two execution plans are written; awaiting Abangku's plan review and execution-method choice.
- No application, domain, DNS, OAuth, VPS, production deployment, or GitHub remote mutation has been performed for this rebrand.

## Verified Repository Checkpoint

| Item | Verified state |
| --- | --- |
| Main checkout | `D:\laragon\www\NetLoka`, clean `main` at `7fdd7afcd72870743ee7702e9b2b322f059acbd9` |
| Planning worktree | `C:\Users\USER\.codex\worktrees\zenoba-rebrand-plan\NetLoka` on `codex/zenoba-rebrand-plan`, based on `7fdd7af` |
| Planning changes | Design spec, two plans, project-plan reference, changelog checkpoint, and this handoff update are included in the current planning checkpoint |
| GitHub repository | `notyourkise/NetLoka`; rename is outside the first-cutover scope |
| Production history | Previous handoff records `/srv/netloka/production` and `netloka.biz.id`; VPS state is not re-verified in this documentation checkpoint |

## Planning Artifacts

- Design: `docs/superpowers/specs/2026-10-11-zenoba-rebrand-design.md`
- Application/local identity: `docs/superpowers/plans/2026-10-11-zenoba-application-identity-rebrand.md`
- Domain cutover: `docs/superpowers/plans/2026-10-11-zenoba-domain-cutover.md`
- The plans split app/local work from external cutover, preventing a branding release from becoming a data migration.

## Evidence and Limits

- Public inspection found no `/about` route, unsupported learner-volume claims, and stale pre-launch legal wording; implementation plans correct these without changing product behavior.
- `zenoba.tech` currently serves a parked Hostinger page; canonical switch has not occurred.
- This checkpoint performed repository/source/configuration boundary review and plan self-review. Application tests, CI, and production checks were not run because only documentation changed.

## Next Action

1. Abangku reviews the two execution plans and chooses an execution method.
2. After approval, create the implementation worktree/branch and begin the app identity plan.
3. Domain/VPS actions remain separately authorized and begin only after the app release is merged.
