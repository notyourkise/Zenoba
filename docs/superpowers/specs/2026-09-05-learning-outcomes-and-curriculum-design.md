# Learning Outcomes and Curriculum Renewal Design

Date: 2026-09-05 WITA

Status: Owner-approved direction; detailed delivery design for review. Documentation only; application implementation has not started.

## 1. Authority and scope

Abangku approved a structured learning journey with introduction, concepts, examples, visualization, interaction, quiz, practice, summary, and assessment. Every path, module, and lesson must state its intended learning outcomes. Welcome to Networking is the first reference module; subsequent modules follow only after its review. The owner requested multiple milestones containing individually owned sprints, detailed goals, validation, and required context.

Owner subsequently confirmed: short quizzes in every lesson, a combined assessment at the end of each module, passing required before advancing, and retries allowed. Owner also approved inserting learning milestones after Milestone 7 and renumbering premium activation after them.

This design authorizes planning work, not deployment, real database mutation, automatic merge, premium activation, or implementation of every planned path at once. Exact assessment thresholds, legacy-progress treatment, and detailed content below are proposed acceptance rules requiring owner review before behavioral implementation. Unresolved choices are recorded explicitly instead of being treated as consent.

## 2. Evidence and context to retrieve

Baseline inspected: `a95b025860b8c1788f8fbf48f8d98cd34929da4d` on main, merge of PR #25. No database was queried to count learner content.

Read `AGENTS.md`, `ROADMAP.md`, `PLAN.md`, current `CHANGELOG.md`, `docs/HANDOFF.md`, `README.md`, `PRODUCT.md`, and `DESIGN.md` before execution. Then read these boundaries:

| Evidence | Source | Implication |
| --- | --- | --- |
| Seed declares 5 paths, 13 modules, 15 lessons; no quiz/summary/practice blocks | `prisma/seed.ts` | Existing seed is not a complete instructional curriculum; counts do not describe the live database |
| LAN/MAN/WAN lesson has only heading and reward | `prisma/seed.ts` | A valid block document can still be educationally incomplete |
| Block renderer and visualization registry already exist | `src/features/learning/blocks/schema.ts`, `registry.tsx`, `lesson-renderer.tsx` | Extend reusable infrastructure; do not create one route per lesson |
| Quiz evaluator compares correct answers, but API accepts nonempty answers | `src/features/quiz/evaluator.ts`, `src/app/api/learning/quiz/submit/route.ts` | Wire server-owned question definitions into actual submit flow |
| Quiz UI can report success on network failure and supplies a block ID as lesson identity | `src/features/quiz/components/quiz-block-player.tsx` | Carry real lesson identity through runtime; fail safely and permit retry |
| Complete action does not verify assessments or all prerequisites | `src/features/learning/progress.ts`, `components/lesson-action-bar.tsx` | Enforce completion rules on server, including direct API calls |
| Path/module objectives and versioned mastery are absent from current models | `prisma/schema.prisma` | Plan additive storage/contracts and compatibility explicitly |
| Existing lesson-loop E2E checks anonymous barriers | `src/e2e/lesson-loop.spec.ts` | Add real authenticated persistence/assessment journey coverage |
| Initial migration is empty; next migration creates reset tokens referencing users | `prisma/migrations/20260824152000_init/migration.sql`, `prisma/migrations/20260902_add_password_reset_tokens/migration.sql` | Reconcile migration history on disposable DB before claiming fresh-install reproducibility |
| Course has optional unique LearningPath relationship | `prisma/schema.prisma`, `docs/decisions/0004-member-workspace-course-commerce.md` | Curriculum navigation must not silently redefine commercial course relationships |

Historical completion labels for M0–M6 describe previous delivery records. They do not certify the renewed outcomes, content coverage, or assessment contract. Record corrections append-only in the changelog.

## 3. Outcome-writing standard

The visible label is **Capaian Pembelajaran**. Use Indonesian, starting with **Setelah menyelesaikan ... siswa dapat ...**. Prefer an observable verb: menjelaskan, membedakan, mengidentifikasi, memprediksi, menghitung, menyusun, menguji, or mendiagnosis. A broad goal such as "memahami jaringan" is allowed as introductory copy only when accompanied by assessable outcomes.

Every outcome has a stable ID, its text, prerequisite knowledge, a teaching reference, an activity reference, an assessment reference, and a success condition. Do not require all outcome evidence to be a multiple-choice question; a deterministic configuration or diagnosis can demonstrate competence.

| Level | Required information | Example |
| --- | --- | --- |
| Path | Final practical ability, entry knowledge, module sequence, final evidence | Siswa dapat menjelaskan hubungan perangkat, media, dan aliran data untuk menganalisis jaringan lokal sederhana |
| Module | 3–5 bounded outcomes, lessons contributing evidence, final assessment | Siswa dapat membedakan komunikasi lokal dan akses Internet pada skenario berbagi printer |
| Lesson | 1–2 primary outcomes, observable task, feedback/remediation target | Siswa dapat mengidentifikasi perangkat dan koneksi yang diperlukan untuk berbagi printer lokal |

Traceability must work in both directions: every outcome is taught and assessed; every scored item assesses a published outcome taught beforehand. Do not grade material introduced only in a future module.

## 4. Standard learning journey

Path overview → module introduction → lesson introduction → concept → worked example → purposeful visual → predict/try/observe → short quiz → summary → verified completion → module practice and assessment → remediation or next module → path challenge/project.

Lesson target: 5–12 minutes as an editorial estimate, not a forced timer or proof of mastery. Welcome module orientation and final test are separate from that estimate. No autoplay, forced waiting, video production, decorative icons, or arbitrary shell execution is required.

| Stage | Required learner experience | Acceptance |
| --- | --- | --- |
| Introduction | Familiar problem, outcomes, prerequisite, estimated time | Learner can state what the lesson enables before starting |
| Concept | One primary concept, defined vocabulary | No unexplained IP/MAC/HTTP terminology in introductory lessons |
| Worked example | Explained reasoning from problem to result | Example uses the same concepts as subsequent practice |
| Visual | Captioned process or relationship with textual equivalent | Visual remains understandable with motion disabled |
| Interaction | Predict a result, change one meaningful condition, observe feedback | Result is deterministic; keyboard and touch can perform the same task |
| Quiz | Short recall/application check with explanation after submit | Wrong answer stays wrong; transport error is not a pass |
| Summary | 3–5 takeaways and links to weak outcomes | Summary does not claim competence before evidence exists |
| Completion | Persisted, user-scoped learning result | Refresh/retry cannot fabricate mastery or duplicate XP |

Use existing blocks when their responsibility matches. Extend PacketFlow with beginner-safe configuration only if it still represents sequential communication; a distinct connectivity exercise belongs in a separate reusable block with deterministic domain logic.

## 5. Assessment and progress design for owner review

Proposed pilot defaults: three formative items per lesson with all three eventually correct; unlimited learning retries, explanatory feedback after each submit, no timed exam. Module final uses ten concept/application items (pass at 8/10) plus a practical task whose three essential criteria must all pass. Knowledge and practical gates are independent. These values are design proposals, not existing application behavior or previously approved numeric thresholds.

The formative quiz teaches; the final assessment checks transfer to a different scenario. Final feedback appears after the complete submission. A retry creates a new attempt with stable item/version identity; do not promise randomized banks in the pilot. Questions reference outcome IDs. Explain unsuccessful outcomes and link to the relevant lesson before retrying.

Progress states must distinguish not-started/in-progress/completed learning from evidence of mastery. A read-page event or "Tandai Selesai" click cannot establish assessment success. Persist final assessment attempts separately from lesson quiz attempts. Store scored evidence, content/assessment version, timestamp, owner, and idempotency key; never trust client score, passed flag, XP, or selected user ID.

Proposed transition contract: current-version required evidence + prerequisites + access permission → completed lesson; all required lesson evidence + final concept pass + practical pass → passed module. UI and API consume the same server decision. A blocked response names missing evidence and provides a safe route to remediate. Network/database failure leaves the attempt unresolved; no local-success fallback.

### Existing learners

Preserve existing IDs, slugs, progress, attempts, and XP. Proposed compatibility: old completions remain visible as historical completion, but do not automatically become verified mastery of new content. An assessment upgrade must never erase XP, silently reset records, or pretend old learners passed a new test. Whether existing learners must take a bridge assessment before advancing is an owner decision before rollout. Pilot first uses disposable/new users until that policy is accepted.

### Commercial access

Access entitlement and instructional prerequisites are separate checks. Networking remains free. A six-path instructional sequence does not require changing Course-to-LearningPath cardinality in the pilot. Audit old links and commerce guards before later path splitting; any schema relationship change needs a separate ADR and explicit approval.

## 6. Welcome to Networking reference module

Path: `network-foundations`. Module: `welcome-to-networking`. Preserve both existing lesson slugs (`intro-to-networking`, `everyday-networks`) and their persisted identities. Proposed additions are `sharing-network-resources` and `simple-network-communication`. They are planned paths, not existing source records.

Prerequisite: basic use of a computer or phone; no networking, binary, IP addressing, or command-line knowledge. Module introduction explains how to use the activities, revisit content, submit quizzes, and recover from an unsuccessful attempt.

### Module outcomes

- WN-M1: Siswa dapat menjelaskan jaringan sebagai perangkat yang saling terhubung untuk berkomunikasi dan berbagi sumber daya.
- WN-M2: Siswa dapat mengidentifikasi perangkat, koneksi, dan sumber daya bersama pada jaringan rumah atau sekolah.
- WN-M3: Siswa dapat membedakan jaringan lokal dari akses Internet pada contoh sederhana.
- WN-M4: Siswa dapat memprediksi dampak putusnya satu koneksi terhadap komunikasi lokal dalam simulasi yang dinyatakan.

### Lesson 1 — Apa Itu Jaringan Komputer?

Slug: `intro-to-networking`; estimate 7–10 minutes.

- WN-L1-A: Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri.
- WN-L1-B: Siswa dapat menjelaskan dua manfaat jaringan dari skenario berbagi file dan printer.
- Introduction: dua komputer sekolah harus menggunakan satu printer; jelaskan kebutuhan sebelum menyebut istilah teknis.
- Concept: perangkat, koneksi, komunikasi, sumber daya; a connection does not guarantee every service is configured correctly.
- Example: file transferred between two configured, connected computers versus carrying it on removable storage.
- Visual/activity: select which illustrated arrangement permits communication under explicitly stated working-device/configuration assumptions; toggle one link and compare the result.
- Quiz blueprint: Q1 identify connected arrangement (A); Q2 choose benefit of file sharing (B); Q3 choose benefit of shared printing (B).
- Misconception/remediation: "berdekatan berarti berjaringan" → return to connected-versus-standalone diagram.
- Summary: perangkat saling terhubung; komunikasi memiliki tujuan; sumber daya dapat digunakan bersama.

### Lesson 2 — Jaringan di Sekitar Kita

Slug: `everyday-networks`; estimate 7–10 minutes; prerequisite L1.

- WN-L2-A: Siswa dapat mengidentifikasi perangkat akhir dan media koneksi pada jaringan rumah/sekolah.
- WN-L2-B: Siswa dapat membedakan layanan lokal yang masih dapat digunakan ketika akses Internet terputus.
- Introduction: Internet sekolah terputus, tetapi printer lokal tetap dapat digunakan pada LAN yang masih berfungsi.
- Concept: jaringan lokal berbeda dari Internet; wired/wireless are connection media, not proof of Internet access.
- Example: laptop and printer remain connected through a working local device while its Internet uplink is disconnected.
- Visual/activity: toggle local printer connection separately from Internet uplink; predict which service remains reachable.
- Quiz blueprint: Q1 identify endpoint/media (A); Q2 local printer after uplink loss (B); Q3 distinguish Wi-Fi connection from Internet availability (B).
- Misconception/remediation: "Wi-Fi sama dengan Internet" → revisit two independent links.
- Summary: rumah/sekolah memakai jaringan; koneksi bisa berkabel/nirkabel; fungsi lokal dapat tetap berjalan tanpa Internet.

### Lesson 3 — Berbagi Sumber Daya melalui Jaringan

Slug: `sharing-network-resources`; estimate 7–10 minutes; prerequisite L2.

- WN-L3-A: Siswa dapat memilih sumber daya yang tepat untuk kebutuhan berbagi file atau mencetak bersama.
- WN-L3-B: Siswa dapat mengidentifikasi peminta dan penyedia layanan pada satu transaksi sederhana.
- Introduction: beberapa siswa membutuhkan bahan belajar yang sama tanpa menggandakan USB.
- Concept: layanan, peminta, penyedia; introduce client/server as roles in an example, leaving protocol detail for later modules.
- Example: computer requests a document from a configured school file service.
- Visual/activity: match request to available resource and identify sender/receiver roles with a text-labelled exchange.
- Quiz blueprint: Q1 choose shared resource (A); Q2 identify requester (B); Q3 identify provider (B).
- Misconception/remediation: "server harus selalu berbentuk perangkat khusus" → revisit roles, not physical appearance.
- Summary: kebutuhan menentukan layanan; peminta menggunakan layanan; penyedia merespons permintaan.

### Lesson 4 — Komunikasi pada Jaringan Sederhana

Slug: `simple-network-communication`; estimate 8–12 minutes; prerequisite L3.

- WN-L4-A: Siswa dapat mengurutkan permintaan, pengiriman melalui koneksi, penerimaan, dan respons pada komunikasi sederhana.
- WN-L4-B: Siswa dapat memilih koneksi yang menyebabkan kegagalan komunikasi berdasarkan diagram dan hasil simulasi.
- Introduction: komputer A berhasil mencetak, komputer B gagal; inspect their separate links before guessing an Internet fault.
- Concept/example: labelled request/response on a known-good single LAN; do not teach packet headers, routing, IP or MAC tables here.
- Visual/activity: compare two clients sharing a printer; disconnect B's link, predict outcomes, restore it, and run again.
- Quiz blueprint: Q1 order exchange (A); Q2 identify broken B connection (B); Q3 choose correct local repair (B).
- Misconception/remediation: "satu koneksi terputus mematikan semua perangkat" → compare separate branches in the diagram.
- Summary: komunikasi memiliki urutan; koneksi memengaruhi jalur; kesimpulan mengikuti bukti.

### Module final blueprint

New scenario: perpustakaan sekolah, dua komputer, satu perangkat penghubung, satu printer lokal. Devices and local service configuration are explicitly stated to be correct except for the selected fault. No unspecified real-world failure is silently excluded.

| Outcome | Final question coverage | Practical evidence |
| --- | --- | --- |
| WN-M1 | F01–F02: identify network and purpose | Select the local resource required by the task |
| WN-M2 | F03–F05: identify endpoints, media, requester/provider | Build/select the required local connection arrangement |
| WN-M3 | F06–F07: distinguish local service and Internet access | Preserve local printing with Internet uplink unavailable |
| WN-M4 | F08–F10: predict affected client and diagnose a broken link | Identify and restore only the faulty client link |

Three essential practical criteria: required clients have a path to the local printer; the faulty branch is correctly identified/repaired; learner correctly predicts local-service availability without Internet. Select resource and roles are supporting formative checks. Server evaluates the submitted topology/choices against the declared scenario, not animation clicks. Proposed pass: at least 8/10 final items AND all three essential criteria. Failure must list outcome IDs and lesson links. Module completion enables the next planned module according to the approved access policy; it does not complete Network Foundations.

## 7. Content quality, accessibility, and validation

- Content validation must reject missing objectives, duplicate outcome/activity IDs, dangling evidence links, assessment items unrelated to taught outcomes, empty stages, invalid prerequisites, and cyclic dependency graphs.
- Every lesson has authored concept text and feedback; a heading plus reward fails editorial acceptance even if its schema is valid.
- Store answer keys/rubrics only on the server. Check server-rendered HTML and client payloads for answer leakage before submission.
- Controls have visible text and accessible names; tab order, keyboard activation, focus after feedback, zoom, narrow viewport, reduced motion, and text alternatives are required.
- Do not use animation completion, dwell time, or color alone as evidence of understanding.
- Run authenticated E2E with an isolated migrated PostgreSQL database and a dedicated server/port; user A cannot submit for user B, direct complete cannot bypass checks, and retries/restarts preserve results.
- Compare existing course access, historical progress, public landing/auth, and unrelated labs after each changed dependency.
- Owner reviews the reference module before bulk content authoring. Learner usability validation remains unverified until an actual observed session is recorded; do not invent participants or completion rates.

## 8. Risks and explicit exclusions

Migration history repair is a prerequisite to persistence claims and must use a disposable database. Existing lesson identities and prior completion policy need reviewed compatibility. Existing visualizers may contain unexplained technical detail, so reuse requires inspection rather than simply embedding them. Later curriculum splitting must preserve routes and commercial boundaries. Concurrent submissions require database-backed idempotency and atomic evidence/progress/XP behavior.

Excluded: premium curriculum activation, live payments, deployment, admin CMS, video pipeline, AI grading, certificate claims, device/VM emulation, arbitrary terminal execution, public landing redesign, and automatic deletion of legacy learner data.

## 9. Design basis

The existing Sprint 4 loop is the primary project requirement. Supporting educational guidance: [IES Organizing Instruction and Study to Improve Student Learning](https://eric.ed.gov/?id=ED498555) recommends connecting verbal/graphical representations, worked examples/problem solving, and quizzing. It does not prescribe Netloka's proposed durations, question counts, pass thresholds, or lock policy.
