# Learning Curriculum Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for task-by-task work after the relevant design is approved. Steps use checkbox (`- [ ]`) syntax for tracking. This is a multi-milestone program plan; the pilot has a separate detailed implementation plan. Do not execute later scopes from the existence of this file.

**Goal:** Deliver outcome-driven Networking education from introductory lessons to independently assessed Consultant projects, starting with one owner-reviewed reference module.

**Architecture:** Retain the modular monolith, typed lesson blocks, deterministic domain evaluators, user-scoped evidence and server-authoritative progression. Curriculum path/module/lesson identities remain distinct from commercial Course/Package identities. Extend existing components rather than duplicating a runtime for each lesson.

**Tech Stack:** Existing Next.js/React/TypeScript/Tailwind, Prisma/PostgreSQL, Zod, Vitest and Playwright; no new framework, remote shell, or runtime dependency selected.

**Spec:** [Learning Outcomes and Curriculum Renewal](../specs/2026-09-05-learning-outcomes-and-curriculum-design.md)

## Global constraints

- Current task is documentation planning only; all new implementation tasks remain unchecked.
- Owner approved learning outcomes per path/module/lesson, Welcome-first delivery, lesson quizzes + module final tests, pass-before-advance with retry, and premium milestone renumbering.
- Exact numeric thresholds and legacy learner transition are proposed in the design and need owner review before behavioral implementation.
- One sprint belongs to exactly one milestone. A dependency or regression check never assigns a second owner.
- Preserve existing main/application/learner data; use isolated branches/worktrees and disposable DBs.
- Networking remains free; seven future premium domains remain Coming soon.
- No deployment, live provider activation, arbitrary commands, certificates, admin CMS, or public landing redesign in learning milestones.
- Milestone 7 operational readiness stays active; new local learning development uses its reviewed code baseline without waiting for production deployment. The dependency is not circular.
- M0–M6 historical completion is retained as history; renewed content/mastery acceptance must be proved independently.
- Every sprint ends in local review, applicable tests, documentation, PR/CI when authorized, owner merge and verified synchronization; milestone completion includes a dependency review.

## Context and baseline

At planning, main is `a95b025860b8c1788f8fbf48f8d98cd34929da4d` (PR #25 merged). Read mandatory project documents in AGENTS order, live Git/PR evidence, the design, [outcome matrix](../../curriculum/networking-outcomes.md), and the completed dependency sprint's review. Prior test counts and handoffs are dated evidence only.

Relevant historical ownership: M0/S0 environment; M1/S1–2 auth/catalog/progress; M2/S3–4 blocks/quiz/XP; M3/S5–6 Foundations; M4/S7–9 network logic/content; M5/S10–11 Labs/Challenges; M6/S12–14 Consultant; M7/S15–20 readiness/workspace/UI plus subsequent profile/security follow-ups. Those features are reused, not reimplemented because a new learning milestone exists.

## Milestone ownership and sequencing

| Milestone | Sprints owned exclusively | Intended deliverable |
| --- | --- | --- |
| M8 — Learning Outcomes, Assessment Foundation & Welcome Pilot | S21, S22, S23, S24 | Deliver Welcome to Networking as an owner-reviewed reference with explicit outcomes, accurate assessment, mandatory passing, retry, persistent evidence, and safe progression. |
| M9 — Network Foundations Curriculum Completion | S25, S26 | Complete the remaining Network Foundations modules using the accepted reference and assess transfer through First Day as IT Support. |
| M10 — Core Networking Curriculum & Applied Practice | S27, S28, S29, S30 | Deliver Paths 2–5 with measurable objectives, complete lessons, module gates, linked practice, and path-level troubleshooting evidence. |
| M11 — Consultant Learning Path & Curriculum Validation | S31, S32 | Teach requirement analysis through proposal creation before independent Consultant work, then verify the full Networking journey. |
| M12 — Premium Course & Payment Activation | S33, S34 | Preserve the former M8 premium/provider activation scope, strictly after content/product/operator/provider and deployment gates. |

Execution: reviewed existing foundation → M8 reference → M9 Foundations → M10 Paths 2–5 → M11 Consultant/full curriculum. M12 separately requires M7 operational closure, all learning gates, and real premium/operator/provider readiness. Number order alone never establishes production readiness.

Welcome content/engine/data/UX tasks are specified in [pilot implementation plan](2026-09-05-welcome-to-networking.md). Later content sprints use the accepted pilot contracts and outcome matrix, then refresh exact code contracts and fixtures against the current source before implementation. Do not invent callable APIs based on planned filenames.

## Common verification and evidence record

For each sprint record command, revision/uncommitted state, worktree, isolated DB/server, result, test scope, failed baseline, and limitations. Content review checks actual prose, misconception feedback, and outcome mappings; syntactically valid JSON alone is insufficient.

Application sprint gate: `npm ci`, `npm run db:generate`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `git diff --check`. Run relevant migration/seed tests on disposable DB and explicitly configured authenticated E2E. CI Chromium does not prove Firefox/WebKit unless those projects run. Documentation-only planning gate: local link/path/ownership/coverage review and `git diff --check`; application suites are omitted because no executable files change.

Content-sprint test cycle: write failing coverage/scoring fixtures for the named outcomes → run focused test and confirm expected failure → author minimum correct content/evaluator integration → focused pass → dependent regression → internal review → delivery gate. Each subtask below is reviewable; split commits by contract/content/evaluator/verification where they can be accepted independently.

## Milestone 8 — Learning Outcomes, Assessment Foundation & Welcome Pilot

**Entry:** Review existing M1/M2 learning/auth/progress and M7 merged baseline; local development does not wait for production deployment.

**Goal:** Deliver Welcome to Networking as an owner-reviewed reference with explicit outcomes, accurate assessment, mandatory passing, retry, persistent evidence, and safe progression.

**Exit:** Four complete lessons, full outcome-to-evidence coverage, authentic database/E2E proof, preserved legacy identities, no Critical/High findings, and owner acceptance of the reusable reference.

### Sprint 21 — Curriculum Contracts & Reproducible Data Foundation

**Owner:** M8 only. **Status:** PLANNED; implementation not started.

**Goal:** A reviewed, versioned content/evidence contract and reproducible storage underpin the pilot.

**Required context:** Spec §§2–6; current seed, block schema, Prisma schema/migrations, commerce ADR; M2 Sprint 3–4 history.

**Affected files/modules:** See pilot Tasks 21.1–21.3; `src/features/learning/content/`, `assessment/`, `prisma/`.

- [ ] **Task 21.1:** Confirm exact assessment/legacy policy and author mapped pilot content.
- [ ] **Task 21.2:** Reconcile migration history on disposable data; design additive versioned evidence storage.
- [ ] **Task 21.3:** Extract pilot definitions; enforce public/private projection and evidence completeness.
- [ ] **Task 21.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Schema rejects incomplete outcomes; fresh and legacy DB fixtures preserve IDs; seed twice does not duplicate content.

**Risk / boundary:** Migration history may be incomplete; never run repair against the user DB.

### Sprint 22 — Authoritative Assessment, Progression & XP

**Owner:** M8 only. **Status:** PLANNED; implementation not started.

**Goal:** Only verified current-user answers/evidence can complete lessons or modules.

**Required context:** Sprint 21 contracts; quiz API/evaluator/player; progress/prerequisites; XP ledger and commerce access.

**Affected files/modules:** See pilot Tasks 22.1–22.3; existing quiz/progress APIs and planned assessment services.

- [ ] **Task 22.1:** Wire server-owned questions to real lesson identity and persist validated attempts.
- [ ] **Task 22.2:** Enforce lesson and final-module gates, including direct API access and current-version evidence.
- [ ] **Task 22.3:** Make evidence/progress/reward consistent under concurrency, retry, and storage failure.
- [ ] **Task 22.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Wrong nonempty answers fail; no direct completion bypass; duplicate events grant once; failed practical blocks module pass.

**Risk / boundary:** Shared XP changes can regress Labs/Challenges/Consultant; broaden relevant tests.

### Sprint 23 — Welcome Lessons & Module Assessment Experience

**Owner:** M8 only. **Status:** PLANNED; implementation not started.

**Goal:** Deliver four complete beginner lessons plus final test/remediation in the existing workspace.

**Required context:** Sprint 21 content and S22 services; outcome matrix P1-M1; current lesson/path UI, visualizers, PRODUCT/DESIGN.

**Affected files/modules:** See pilot Tasks 23.1–23.3; lesson/path pages, renderer, simple-connectivity domain, final assessment routes.

- [ ] **Task 23.1:** Render scoped objectives and ordered instructional stages without generic success fallback.
- [ ] **Task 23.2:** Implement beginner-safe connectivity practice and server-evaluated scenario evidence.
- [ ] **Task 23.3:** Deliver final module test, outcome feedback, retry, and correct next-stage navigation.
- [ ] **Task 23.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** All 8 lesson outcomes visibly taught/tested; keyboard/reduced-motion controls work; unresolved network request never shows success.

**Risk / boundary:** Existing visualizers expose unexplained technical terms; reduce vocabulary without breaking later consumers.

### Sprint 24 — Pilot Integration, Teaching Review & Reference Approval

**Owner:** M8 only. **Status:** PLANNED; implementation not started.

**Goal:** Prove the complete pilot with real isolated persistence and owner teaching review.

**Required context:** S21–23 merged work; actual CI/Playwright config; `src/e2e/lesson-loop.spec.ts`; AGENTS sprint/milestone gates.

**Affected files/modules:** See pilot Tasks 24.1–24.3; `src/e2e/welcome-to-networking.spec.ts`, CI/config, curriculum review record.

- [ ] **Task 24.1:** Add two-user authenticated E2E and isolated PostgreSQL/server setup.
- [ ] **Task 24.2:** Review outcome coverage, responsive/accessibility behavior, legacy records, and dependent feature regressions.
- [ ] **Task 24.3:** Run full gates, deliver PR/CI, obtain owner reference acceptance and verify merge synchronization.
- [ ] **Task 24.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Fail→remediate→retry→pass→reload→unlock is verified; spoofed evidence denied; owner accepts before bulk authoring.

**Risk / boundary:** Anonymous redirect tests are insufficient; no invented live-mail/provider/usability evidence.

## Milestone 9 — Network Foundations Curriculum Completion

**Entry:** M8 complete and owner-approved as the reference.

**Goal:** Complete the remaining Network Foundations modules using the accepted reference and assess transfer through First Day as IT Support.

**Exit:** All P1 module outcomes taught and assessed, path final passed in authenticated E2E, old URLs/progress preserved, owner-reviewed curriculum mapping for later paths.

### Sprint 25 — Network Foundations Content Expansion

**Owner:** M9 only. **Status:** PLANNED; implementation not started.

**Goal:** Author remaining P1 modules as complete learning experiences with individual outcomes.

**Required context:** M8 reference review; matrix P1-M2–M8; original Sprint 5–6 coverage; device/topology/cable/OSI/encapsulation blocks.

**Affected files/modules:** Existing `prisma/seed.ts`, block components, accepted new `content/`; planned `src/features/learning/content/network-foundations/modules.ts`, `modules.test.ts`.

- [ ] **Task 25.1:** Author lessons P1-L05–L19 with concepts, worked examples, meaningful interaction, quiz explanations, and summaries.
- [ ] **Task 25.2:** Map every module outcome to final concept/practical evidence and extend existing interactions only where required.
- [ ] **Task 25.3:** Validate content graph and verify representative beginning/middle/end module journeys before full path release.
- [ ] **Task 25.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Every listed P1 lesson is authored; no heading-plus-reward lesson; no IP arithmetic assessed before Path 2.

**Risk / boundary:** Module numbering gaps in old seed must be mapped without deleting or reassigning history.

### Sprint 26 — Foundations Final Challenge & Path Migration Contract

**Owner:** M9 only. **Status:** PLANNED; implementation not started.

**Goal:** Verify P1 mastery and define safe mappings before reorganizing Paths 3–4 or adding Path 6.

**Required context:** S25 curriculum; `support-challenge.ts`, `/api/challenges/submit`, `queries.ts`, prerequisite graph, schema Course relationship.

**Affected files/modules:** Existing challenge engine/API/tests; planned `docs/curriculum/path-migration-map.md`, `src/e2e/network-foundations-mastery.spec.ts`.

- [ ] **Task 26.1:** Align First Day as IT Support to P1 outcomes; grade inventory/topology/diagnosis evidence through a shared activity identity.
- [ ] **Task 26.2:** Implement/test P1 final eligibility and persistence; keep standalone challenge replay from duplicating rewards.
- [ ] **Task 26.3:** Inventory all old lesson IDs/URLs/progress and document explicit source→destination mapping for later paths; obtain review before writes.
- [ ] **Task 26.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** P1 final rejects ineligible/spoofed attempts; all old links resolve; mappings retain progress and preserve FREE access.

**Risk / boundary:** Course has optional unique path relation; do not turn a curricular sequence into a commercial schema change silently.

## Milestone 10 — Core Networking Curriculum & Applied Practice

**Entry:** M9 complete; S26 approves exact lesson/URL migration before path restructuring.

**Goal:** Deliver Paths 2–5 with measurable objectives, complete lessons, module gates, linked practice, and path-level troubleshooting evidence.

**Exit:** Each of Paths 2–5 passes its own content/domain/security/E2E gates; cross-path prerequisite graph has no missing evidence or cycles.

### Sprint 27 — IPv4 & Subnetting Curriculum

**Owner:** M10 only. **Status:** PLANNED; implementation not started.

**Goal:** Students independently calculate and allocate valid IPv4 networks for stated host requirements.

**Required context:** M9 closeout; matrix P2-M1–M5; Sprint 7 domain/tests; IPv4/SubnetPractice and accepted content contracts.

**Affected files/modules:** Existing `src/features/network-logic/ipv4/ipv4.ts`, labs evaluator; planned `content/ipv4-subnetting/path.ts`, `path.test.ts`, `src/e2e/ipv4-mastery.spec.ts`.

- [ ] **Task 27.1:** Author P2-L01–L10 and module assessments covering biner, address types, masks, host bounds, subnetting and VLSM.
- [ ] **Task 27.2:** Link existing subnet/IP labs with shared identity and add path-final room-allocation evidence.
- [ ] **Task 27.3:** Validate calculations, capacity/overlap, bad inputs and boundary prefixes with deterministic domain tests and authenticated path E2E.
- [ ] **Task 27.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** All P2 outcomes taught/assessed; worked example followed by independent values; invalid/overlapping plan fails.

**Risk / boundary:** Do not use generic host formula for special prefixes or use calculator display as proof of learner mastery.

### Sprint 28 — Switching & LAN Curriculum

**Owner:** M10 only. **Status:** PLANNED; implementation not started.

**Goal:** Students reason about MAC/ARP forwarding and correctly segment an access/trunk LAN.

**Required context:** S27 address outcomes; S26 approved mappings; matrix P3; Sprint 8 primitives and VLAN/ARP components.

**Affected files/modules:** Existing `simulation/topology.ts`, VLAN/ARP blocks; planned `content/switching-lan/path.ts`, `path.test.ts`, `src/e2e/switching-mastery.spec.ts`.

- [ ] **Task 28.1:** Author P3-L01–L08 with MAC learning, ARP, broadcast scope, VLAN and access/trunk concepts.
- [ ] **Task 28.2:** Apply only reviewed legacy switching/routing mappings, preserve URLs/IDs, and link VLAN lab evidence.
- [ ] **Task 28.3:** Build/test a staff/guest final scenario with incorrect port/trunk and verify preserved isolation after repair.
- [ ] **Task 28.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Expected L2 recipient/forwarding/isolation results are deterministic; required module evidence blocks premature final.

**Risk / boundary:** Do not imply L2 switch automatically routes between VLANs; mapping can affect old prerequisites.

### Sprint 29 — Routing & Services Curriculum

**Owner:** M10 only. **Status:** PLANNED; implementation not started.

**Goal:** Students trace inter-subnet and named-service access with routing/DHCP/DNS/NAT evidence.

**Required context:** S28 closeout; matrix P4; S26 mapping; routing table, DHCP/DNS/NAT/ICMP/terminal domain and API consumers.

**Affected files/modules:** Existing network logic/blocks/labs; planned `content/routing-services/path.ts`, `path.test.ts`, `src/e2e/services-mastery.spec.ts`.

- [ ] **Task 29.1:** Author P4-L01–L10, separating gateway/routes, DHCP/DNS, NAT/PAT and transport/service outcomes.
- [ ] **Task 29.2:** Map current routing/service lessons to the approved path structure and link reusable labs without duplication.
- [ ] **Task 29.3:** Assess a failing named-service scenario; require diagnosis, corrected settings, and verified expected connectivity.
- [ ] **Task 29.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Correct next hop/return route, leases, name resolution and translation tested separately; no false pass on ping alone.

**Risk / boundary:** Simulator outputs must follow scenario state; hardcoded evidence disconnected from submitted configuration is invalid.

### Sprint 30 — Wireless, Troubleshooting & Core Path Validation

**Owner:** M10 only. **Status:** PLANNED; implementation not started.

**Goal:** Students collect evidence and verify repairs across Paths 2–5.

**Required context:** S27–29 evidence; matrix P5; current three challenge scenarios, terminal parser and evaluators.

**Affected files/modules:** Existing challenge/terminal services; planned `content/wireless-troubleshooting/path.ts`, `path.test.ts`, `src/e2e/core-networking-mastery.spec.ts`.

- [ ] **Task 30.1:** Author P5-L01–L08 with wireless tradeoffs, guest security, tool choice and diagnostic method.
- [ ] **Task 30.2:** Tie observable command/evidence state to diagnosis and repair; map current challenges to taught outcomes.
- [ ] **Task 30.3:** Run cross-path new-user/returning-user regression, content coverage, migration consistency and milestone review.
- [ ] **Task 30.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Diagnosis plus expected restored behavior required; outcome graph remains acyclic; all P2–P5 path finals verified.

**Risk / boundary:** No universal wireless range claim or arbitrary real terminal execution; no retrospective score alteration.

## Milestone 11 — Consultant Learning Path & Curriculum Validation

**Entry:** M10 complete; review existing M6 procurement/topology/scoring limitations before dependency work.

**Goal:** Teach requirement analysis through proposal creation before independent Consultant work, then verify the full Networking journey.

**Exit:** Path 6 and retained proposal evidence verified; all six paths have outcome coverage and a reviewed curriculum-level regression report.

### Sprint 31 — Consultant Preparation Learning Path

**Owner:** M11 only. **Status:** PLANNED; implementation not started.

**Goal:** Students turn a client brief into a justified, testable network proposal.

**Required context:** M10 closeout; matrix P6-M1–M4; M6 procurement/BoQ/topology/IP/VLAN/scoring, existing saved projects.

**Affected files/modules:** Existing `src/features/consultant/`; planned `content/network-planning/path.ts`, `path.test.ts`, `src/e2e/consultant-learning.spec.ts`.

- [ ] **Task 31.1:** Author P6-L01–L08 with requirement analysis, capacity/procurement, topology/IP/VLAN, documentation and review.
- [ ] **Task 31.2:** Add the reviewed instructional Path 6 and lesson/module assessments; retain FREE Networking behavior.
- [ ] **Task 31.3:** Connect guided exercises to the existing Consultant workspace and review essential connectivity/security constraints in scoring.
- [ ] **Task 31.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Each requirement has design evidence and acceptance test; budget success cannot conceal missing critical connectivity.

**Risk / boundary:** Current scoring may ignore saved topology/IP; use real evaluators and explicit scenarios before claiming full design validation.

### Sprint 32 — Consultant Capstone, Portfolio & Full Curriculum Review

**Owner:** M11 only. **Status:** PLANNED; implementation not started.

**Goal:** Verify independent proposal work and the entire six-path curriculum.

**Required context:** S31 reviewed learning content; matrix P6-M5; five existing cases; portfolio persistence; all prior path reviews.

**Affected files/modules:** Existing portfolio/schema/scoring; planned `docs/curriculum/networking-validation.md`, `src/e2e/networking-curriculum.spec.ts`.

- [ ] **Task 32.1:** Author P6-L09–L10 and final Small Office transfer scenario; introduce advanced cases only after prerequisite proof.
- [ ] **Task 32.2:** Preserve proposal, case/rubric/content version, scoring evidence and feedback in portfolio; never silently regrade old work.
- [ ] **Task 32.3:** Run full outcome/evidence coverage, authenticated end-to-end sample chain and domain regressions; record milestone review and owner acceptance.
- [ ] **Task 32.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** All six paths have complete taught/assessed outcomes; portfolio reproduces historical results; no Critical/High finding open.

**Risk / boundary:** Full curriculum completion is not premium product readiness or deployment evidence.

## Milestone 12 — Premium Course & Payment Activation

**Entry:** M7 operational gates and M8–M11 curriculum gates complete, real premium content and pricing separately approved, merchant/legal/provider prerequisites verified.

**Goal:** Preserve the former M8 premium/provider activation scope, strictly after content/product/operator/provider and deployment gates.

**Exit:** Only owner-authorized real premium products and provider integration can satisfy commercial activation; no readiness inferred from free curriculum completion.

### Sprint 33 — Premium Activation Entry-Gate Review

**Owner:** M12 only. **Status:** PLANNED; implementation not started.

**Goal:** Determine whether commercial activation prerequisites are independently satisfied.

**Required context:** Former M8 scope in ADR 0004 and archived commerce spec; M7 operational evidence; M8–M11 curriculum reviews.

**Affected files/modules:** Existing `docs/decisions/0004-member-workspace-course-commerce.md`, commerce spec; planned `docs/decisions/premium-activation-readiness.md`.

- [ ] **Task 33.1:** Verify actual published premium content, access guards, owner-approved price and valid premium Combo Package.
- [ ] **Task 33.2:** Verify operator/privacy/merchant/tax readiness and private provider/staging configuration through approved channels.
- [ ] **Task 33.3:** Record evidence and unresolved gates before authorizing provider implementation; no credentials in documentation.
- [ ] **Task 33.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Every entry gate has current evidence; absent premium products keep milestone blocked from activation.

**Risk / boundary:** Free Networking completion does not meet premium course availability; no automatic live credential request.

### Sprint 34 — Provider Verification & Controlled Release

**Owner:** M12 only. **Status:** PLANNED; implementation not started.

**Goal:** Execute only the separately approved provider activation/release design after all entry gates pass.

**Required context:** S33 evidence; existing sandbox contract/order/entitlement tests; latest official provider documentation and M7 deployment runbook.

**Affected files/modules:** Existing `src/features/commerce/`, deployment docs; exact provider code paths belong to the separately approved activation design.

- [ ] **Task 34.1:** Prepare and obtain owner review of exact provider adapter/webhook/reconciliation implementation plan with live-vs-sandbox boundaries.
- [ ] **Task 34.2:** Verify provider sandbox and staging amount/signature/idempotency/reconciliation cases with isolated data, then review operational refund/dispute handling.
- [ ] **Task 34.3:** Enable production only with explicit owner authorization; run post-deploy smoke/monitoring and record release/recovery evidence.
- [ ] **Task 34.4 — Review and delivery:** Apply the common verification gate, record actual outcome coverage and evidence, resolve Critical/High findings, update documentation, and complete owner PR review/merge before claiming sprint completion.

**Validation / acceptance:** Provider event—not client redirect—controls entitlement; all release gates and operator actions recorded.

**Risk / boundary:** No automatic deployment, purchase, live QRIS, secret storage, or scope activation from this planning document.

## Completion audit and next entry point

- [ ] All lesson outcomes in the matrix map to actual teaching and assessment; all six path finals cover intended skills.
- [ ] No duplicate sprint owner, misleading completed label, or unresolved prerequisite cycle.
- [ ] Existing user history, FREE access, public UI, and standalone activity reuse are preserved.
- [ ] Actual end-to-end authenticated assessment/persistence evidence exists; mocked or anonymous checks are explicitly distinguished.
- [ ] Numeric thresholds and legacy bridge policy are accepted before pilot behavior is coded.
- [ ] Owner accepts the Welcome reference before remaining modules start.
- [ ] M12 renumbering does not weaken the former M8 activation gates.

**Next action:** Owner reviews the detailed design and pilot acceptance defaults. Then begin Sprint 21 on a fresh verified task branch; do not continue old Sprint 20 UI polish or already-merged security PR #25 from stale handoff text.
