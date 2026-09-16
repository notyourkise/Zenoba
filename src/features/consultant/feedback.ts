/**
 * Pure Domain Feedback Engine for IT Consultant Mode
 * Provides structured, actionable feedback from rubric evidence:
 * - Strengths: Dimensions & requirements met or exceeded
 * - Blocking Issues: Critical connectivity deficits, budget violations, and core blockers
 * - Prioritized Next Actions: Concrete recommendations linked to curriculum learning outcomes
 *
 * Guaranteed zero historical regrading:
 * Historical projects preserve original scores, passed states, and rubric versions (v1.0).
 */

import { calculateBoQ } from "./procurement/boq";
import type {
  ConsultantCaseRequirements,
  ConsultantProjectSubmission,
  CompositeScoringResult,
} from "./scoring/engine";

export interface PrioritizedNextAction {
  action: string;
  outcomeId?: string;
  priority: number; // 1 = Critical Blocker / Budget, 2 = Core Requirements / Hardware, 3 = Optimization / Scalability
  reason: string;
}

export interface ConsultantStructuredFeedback {
  rubricVersion: "1.0" | "1.1";
  passed: boolean;
  summary: string;
  strengths: string[];
  blockingIssues: string[];
  nextActions: PrioritizedNextAction[];
}

export interface HistoricalProjectFeedbackInput {
  feedback?: unknown;
  compositeScore?: unknown;
  score: number;
  passed: boolean;
  boqItems?: unknown;
  vlanPlan?: unknown;
}

/**
 * Pure deterministic feedback generation for new consultant project submissions.
 * Rubric v1.1 exposes structured strengths, blocking issues, and outcome-linked next actions.
 */
export function generateConsultantFeedback(
  requirements: ConsultantCaseRequirements,
  submission: ConsultantProjectSubmission,
  evaluation: CompositeScoringResult,
  rubricVersion: "1.0" | "1.1" = "1.1"
): ConsultantStructuredFeedback {
  const boq = calculateBoQ(submission.boqItems || [], requirements.budget, {
    requiredAccessPorts: requirements.wiredClientCount,
    requiredApCount: requirements.apCount,
    requireVlan: requirements.requireVlan,
    requireDualWan: requirements.requireDualWan,
  });

  const strengths: string[] = [];
  const blockingIssues: string[] = [];
  const nextActions: PrioritizedNextAction[] = [];

  // --- 1. Evaluate Strengths ---
  // Technical Strengths
  if (boq.hasRouter) {
    strengths.push("Router gateway tersedia untuk mengelola perutean dan koneksi internet.");
  }
  if (boq.totalAccessPorts >= requirements.wiredClientCount) {
    strengths.push(
      `Kapasitas switch (${boq.totalAccessPorts} port) mencukupi kebutuhan klien (${requirements.wiredClientCount} kabel PC).`
    );
  }
  if (!requirements.requirePoe || boq.hasSufficientPoe) {
    strengths.push("Kapasitas daya PoE switch memadai untuk menyuplai seluruh Access Point.");
  }

  // Requirement Fulfillment Strengths
  const apItemsCount = (submission.boqItems || [])
    .filter((i) => i.deviceId.startsWith("ap-"))
    .reduce((acc, curr) => acc + curr.quantity, 0);

  if (apItemsCount >= requirements.apCount) {
    strengths.push(
      `Penyediaan ${apItemsCount} Access Point Wi-Fi 6 memenuhi target cakupan area klien.`
    );
  }

  const hasDualWanRouter = (submission.boqItems || []).some(
    (i) => i.deviceId === "router-pro-8g-dualwan" || i.deviceId === "router-core-sfp-10g"
  );
  if (requirements.requireDualWan && hasDualWanRouter) {
    strengths.push("Kebutuhan redundansi Dual-WAN terpenuhi oleh tipe router yang dipilih.");
  }

  // Cost Efficiency Strengths
  if (boq.isWithinBudget) {
    if (boq.budgetUtilizationPct >= 40 && boq.budgetUtilizationPct <= 95) {
      strengths.push(
        `Alokasi anggaran sangat efisien (${boq.budgetUtilizationPct}% pagu) tanpa pemborosan.`
      );
    } else if (boq.budgetUtilizationPct < 40) {
      strengths.push("Pengadaan berada di bawah pagu anggaran (hemat biaya).");
    } else {
      strengths.push("Anggaran dimanfaatkan secara maksimal dalam batas pagu yang ditentukan.");
    }
  }

  // Scalability Strengths
  const sparePortRatio =
    requirements.wiredClientCount > 0
      ? (boq.totalAccessPorts - requirements.wiredClientCount) / requirements.wiredClientCount
      : 0.5;

  if (sparePortRatio >= 0.2) {
    strengths.push(
      `Tersedia cadangan port switch yang memadai (${Math.round(sparePortRatio * 100)}% spare) untuk ekspansi di masa depan.`
    );
  }

  // Security Strengths
  if (!requirements.requireVlan) {
    strengths.push("Arsitektur jaringan flat sesuai dengan skala kebutuhan klien.");
  } else if (
    boq.hasManagedSwitch &&
    submission.vlanPlan &&
    submission.vlanPlan.length >= (requirements.vlanList?.length || 2)
  ) {
    strengths.push(
      "Segmentasi VLAN dan Switch Managed terisolasi dengan rapi sesuai standar keamanan."
    );
  }

  // --- 2. Evaluate Blocking Issues ---
  // Critical Connectivity (Takes precedence over budget success)
  if (!boq.hasRouter) {
    blockingIssues.push(
      "Kegagalan Kritis: Proposal tidak menyertakan Router gateway untuk konektivitas dasar jaringan."
    );
  }
  if (boq.totalAccessPorts < requirements.wiredClientCount) {
    blockingIssues.push(
      `Kegagalan Kritis: Kapasitas port switch (${boq.totalAccessPorts}) kurang dari kebutuhan kabel PC (${requirements.wiredClientCount}). Efisiensi biaya tidak dapat mengorbankan konektivitas esensial.`
    );
  }

  // Budget Blocker
  if (!boq.isWithinBudget) {
    blockingIssues.push(
      `Over Budget: Total pengadaan (Rp ${boq.totalCost.toLocaleString("id-ID")}) melebihi pagu anggaran klien (Rp ${requirements.budget.toLocaleString("id-ID")}).`
    );
  }

  // PoE Blocker
  if (requirements.requirePoe && !boq.hasSufficientPoe) {
    blockingIssues.push(
      "Kapasitas daya PoE switch tidak mencukupi untuk menyuplai seluruh Access Point."
    );
  }

  // Dual-WAN Blocker
  if (requirements.requireDualWan && !hasDualWanRouter) {
    blockingIssues.push(
      "Kebutuhan Dual-WAN failover belum terpenuhi oleh tipe router yang dipilih."
    );
  }

  // VLAN Blocker
  if (requirements.requireVlan && !boq.hasManagedSwitch) {
    blockingIssues.push(
      "Klien membutuhkan segmentasi VLAN, namun pengadaan menggunakan switch unmanaged tanpa dukungan 802.1Q."
    );
  } else if (
    requirements.requireVlan &&
    boq.hasManagedSwitch &&
    (!submission.vlanPlan || submission.vlanPlan.length < (requirements.vlanList?.length || 2))
  ) {
    blockingIssues.push(
      "Switch mendukung VLAN, namun rancangan tabel segmentasi VLAN belum lengkap."
    );
  }

  // --- 3. Prioritized Next Actions Linked to Learning Outcomes ---
  // Priority 1: Critical Blockers & Budget
  if (!boq.hasRouter) {
    nextActions.push({
      action:
        "Tambahkan Router gateway pada daftar pengadaan (BoQ) untuk merutekan lalu lintas LAN ke WAN/Internet.",
      outcomeId: "PLAN-L5-A",
      priority: 1,
      reason:
        "Konektivitas esensial: tanpa router, seluruh klien tidak dapat mengakses gateway dan internet.",
    });
  }

  if (boq.totalAccessPorts < requirements.wiredClientCount) {
    nextActions.push({
      action: `Tingkatkan jumlah atau kapasitas port switch (minimal ${requirements.wiredClientCount} port) untuk menghubungkan seluruh PC klien.`,
      outcomeId: "PLAN-L3-A",
      priority: 1,
      reason:
        "Konektivitas fisik esensial: setiap kabel PC klien membutuhkan port switch akses yang aktif.",
    });
  }

  if (!boq.isWithinBudget) {
    nextActions.push({
      action:
        "Optimalkan pemilihan perangkat untuk menekan total biaya agar tidak melampaui pagu anggaran klien.",
      outcomeId: "PLAN-L1-A",
      priority: 1,
      reason:
        "Proposal akan langsung ditolak oleh finance klien jika biaya melebihi pagu anggaran yang disepakati.",
    });
  }

  // Priority 2: Core Requirements, Power & Segmentation
  if (requirements.requirePoe && !boq.hasSufficientPoe) {
    nextActions.push({
      action:
        "Gunakan switch PoE dengan watt budget lebih tinggi untuk menyuplai daya seluruh Access Point.",
      outcomeId: "PLAN-L3-B",
      priority: 2,
      reason:
        "Kebutuhan daya: Access Point membutuhkan PoE agar dapat beroperasi tanpa adaptor daya terpisah.",
    });
  }

  if (requirements.requireDualWan && !hasDualWanRouter) {
    nextActions.push({
      action:
        "Pilih router dengan dukungan Dual-WAN untuk memenuhi kebutuhan link redundancy dan failover.",
      outcomeId: "PLAN-L5-B",
      priority: 2,
      reason:
        "Ketersediaan tinggi: klien memerlukan koneksi cadangan (failover) agar operasional tidak terganggu saat ISP utama padam.",
    });
  }

  if (requirements.requireVlan && !boq.hasManagedSwitch) {
    nextActions.push({
      action:
        "Ganti switch dengan model Managed yang mendukung protokol 802.1Q VLAN.",
      outcomeId: "PLAN-L6-A",
      priority: 2,
      reason:
        "Isolasi broadcast domain dan keamanan data antar divisi/tamu memerlukan switch managed.",
    });
  } else if (
    requirements.requireVlan &&
    boq.hasManagedSwitch &&
    (!submission.vlanPlan || submission.vlanPlan.length < (requirements.vlanList?.length || 2))
  ) {
    nextActions.push({
      action:
        "Lengkapi tabel perencanaan VLAN dan alokasi subnet IP untuk setiap departemen atau segmen klien.",
      outcomeId: "PLAN-L6-B",
      priority: 2,
      reason:
        "Konfigurasi VLAN membutuhkan pemetaan subnet IP yang jelas pada setiap ID VLAN.",
    });
  }

  if (apItemsCount < requirements.apCount) {
    nextActions.push({
      action: `Tambahkan Access Point hingga minimal ${requirements.apCount} unit untuk menjamin jangkauan sinyal nirkabel.`,
      outcomeId: "PLAN-L2-A",
      priority: 2,
      reason:
        "Cakupan Wi-Fi: jumlah unit AP yang kurang akan menimbulkan dead zone bagi pengguna mobile.",
    });
  }

  // Priority 3: Optimization & Scalability
  if (sparePortRatio < 0.2 && sparePortRatio >= 0) {
    nextActions.push({
      action:
        "Pertimbangkan memilih switch dengan port cadangan (spare capacity minimal 20%) untuk memudahkan ekspansi di masa depan.",
      outcomeId: "PLAN-L3-A",
      priority: 3,
      reason:
        "Skalabilitas: penambahan perangkat baru di kemudian hari tidak memerlukan pembelian switch tambahan secara mendadak.",
    });
  }

  if (boq.isWithinBudget && boq.budgetUtilizationPct < 40) {
    nextActions.push({
      action:
        "Evaluasi apakah spesifikasi perangkat dapat ditingkatkan memanfaatkan sisa anggaran yang masih longgar.",
      outcomeId: "PLAN-L1-A",
      priority: 3,
      reason:
        "Optimasi nilai investasi klien: penggunaan anggaran yang terlalu minim berisiko menghasilkan spesifikasi di bawah standar industri.",
    });
  }

  // Default next action for fully compliant proposals
  if (evaluation.passed && blockingIssues.length === 0 && nextActions.length === 0) {
    nextActions.push({
      action:
        "Proposal telah memenuhi seluruh standar teknis dan anggaran. Lanjutkan ke tahap implementasi atau pengujian lapangan.",
      outcomeId: "PLAN-L9-A",
      priority: 3,
      reason:
        "Rancangan jaringan telah optimal dan siap dipresentasikan kepada stakeholder klien.",
    });
  }

  // Sort next actions ascending by priority (Priority 1 first)
  nextActions.sort((a, b) => a.priority - b.priority);

  const summary = evaluation.passed
    ? "Proposal disetujui klien dengan spesifikasi teknis dan anggaran yang sesuai."
    : "Proposal memerlukan revisi pada spesifikasi teknis atau batasan anggaran klien.";

  return {
    rubricVersion,
    passed: evaluation.passed,
    summary,
    strengths,
    blockingIssues,
    nextActions,
  };
}

/**
 * Resolves structured feedback for a consultant project record.
 * Handles both v1.1 (native structured) and v1.0 (historical legacy).
 *
 * CRITICAL GUARANTEE:
 * Historical score and passed status are NEVER mutated or recalculated.
 */
export function resolveConsultantFeedback(
  project: HistoricalProjectFeedbackInput
): ConsultantStructuredFeedback {
  const rawFeedback = project.feedback as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const rawComposite = project.compositeScore as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  // 1. If project already has v1.1 feedback with valid arrays, return it directly
  if (
    rawFeedback &&
    rawFeedback.rubricVersion === "1.1" &&
    Array.isArray(rawFeedback.strengths) &&
    Array.isArray(rawFeedback.blockingIssues) &&
    Array.isArray(rawFeedback.nextActions)
  ) {
    return {
      rubricVersion: "1.1",
      passed: project.passed, // Preserved exactly
      summary:
        rawFeedback.summary ||
        (project.passed
          ? "Rancangan proposal memenuhi spesifikasi teknis dan pagu anggaran."
          : "Rancangan proposal memerlukan revisi spesifikasi teknis atau anggaran."),
      strengths: rawFeedback.strengths,
      blockingIssues: rawFeedback.blockingIssues,
      nextActions: rawFeedback.nextActions,
    };
  }

  // 2. Synthesize structured feedback for legacy v1.0 or missing feedback without changing score/passed
  const rubricVersion =
    rawFeedback?.rubricVersion === "1.1" || rawComposite?.rubricVersion === "1.1"
      ? "1.1"
      : "1.0";

  const passed = project.passed; // Inviolable historical state

  const summary =
    typeof rawFeedback?.summary === "string" && rawFeedback.summary.length > 0
      ? rawFeedback.summary
      : passed
      ? "Rancangan proposal memenuhi spesifikasi teknis dan pagu anggaran."
      : "Rancangan proposal memerlukan revisi spesifikasi teknis atau anggaran";

  const dimensions =
    rawFeedback?.dimensions || rawComposite?.dimensions || {};

  const strengths: string[] = [];
  const blockingIssues: string[] = [];
  const nextActions: PrioritizedNextAction[] = [];

  // Extract strengths and blockers from dimension feedback
  for (const [, dim] of Object.entries(dimensions) as [string, any][]) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const dimScore = typeof dim?.score === "number" ? dim.score : 0;
    const dimFeedback = typeof dim?.feedback === "string" ? dim.feedback : "";

    // High score dimensions become strengths
    if (dimScore >= 14 && dimFeedback) {
      strengths.push(dimFeedback);
    }

    // Identify blockers from critical messages or low scores
    const isCritical =
      dimFeedback.includes("Kegagalan Kritis") ||
      dimFeedback.includes("Over Budget") ||
      dimFeedback.includes("kurang dari kebutuhan") ||
      dimFeedback.includes("Belum ada Router") ||
      dimFeedback.includes("tidak mencukupi");

    if (isCritical || dimScore < 10) {
      if (dimFeedback) {
        blockingIssues.push(dimFeedback);
      }
    }
  }

  // Fallback strengths if dimensions were empty
  if (strengths.length === 0) {
    if (passed) {
      strengths.push("Seluruh kriteria kelulusan terpenuhi sesuai standar rubrik v1.0.");
    } else {
      strengths.push("Rancangan proposal tercatat dalam riwayat portofolio rubrik v1.0.");
    }
  }

  // Fallback blockers if not passed
  if (!passed && blockingIssues.length === 0) {
    blockingIssues.push("Proposal belum memenuhi skor ambang batas minimal kelulusan (70/100).");
  }

  // Synthesize next actions from detected blockers
  const allBlockersText = blockingIssues.join(" ").toLowerCase();

  if (allBlockersText.includes("router")) {
    nextActions.push({
      action: "Tambahkan Router gateway pada daftar pengadaan (BoQ).",
      outcomeId: "PLAN-L5-A",
      priority: 1,
      reason: "Konektivitas esensial: tanpa router, jaringan lokal tidak dapat mengakses internet.",
    });
  }

  if (allBlockersText.includes("port") || allBlockersText.includes("kabel pc")) {
    nextActions.push({
      action: "Tingkatkan kapasitas port switch untuk menghubungkan seluruh komputer klien.",
      outcomeId: "PLAN-L3-A",
      priority: 1,
      reason: "Konektivitas fisik: port switch tidak mencukupi untuk jumlah PC klien.",
    });
  }

  if (allBlockersText.includes("budget") || allBlockersText.includes("anggaran")) {
    nextActions.push({
      action: "Sesuaikan pilihan perangkat agar total pengadaan berada dalam pagu anggaran.",
      outcomeId: "PLAN-L1-A",
      priority: 1,
      reason: "Batas kelayakan anggaran klien.",
    });
  }

  if (allBlockersText.includes("vlan") || allBlockersText.includes("unmanaged")) {
    nextActions.push({
      action: "Gunakan switch Managed dan lengkapi tabel perencanaan VLAN.",
      outcomeId: "PLAN-L6-A",
      priority: 2,
      reason: "Kebutuhan segmentasi keamanan jaringan klien.",
    });
  }

  if (allBlockersText.includes("poe")) {
    nextActions.push({
      action: "Pilih switch PoE dengan kapasitas watt yang memadai untuk Access Point.",
      outcomeId: "PLAN-L3-B",
      priority: 2,
      reason: "Daya operasional perangkat nirkabel.",
    });
  }

  if (allBlockersText.includes("dual-wan")) {
    nextActions.push({
      action: "Pilih router dengan dukungan Dual-WAN untuk failover.",
      outcomeId: "PLAN-L5-B",
      priority: 2,
      reason: "Kebutuhan redundansi internet.",
    });
  }

  // Fallback next actions if none generated
  if (nextActions.length === 0) {
    if (passed) {
      nextActions.push({
        action: "Rancangan jaringan telah memenuhi standar evaluasi saat diajukan.",
        outcomeId: "PLAN-L9-A",
        priority: 3,
        reason: "Proposal telah memenuhi seluruh kriteria evaluasi.",
      });
    } else {
      nextActions.push({
        action: "Tinjau kembali rincian spesifikasi teknis dan batasan anggaran pada studi kasus.",
        outcomeId: "PLAN-L1-A",
        priority: 1,
        reason: "Revisi proposal diperlukan sebelum pengajuan ulang.",
      });
    }
  }

  nextActions.sort((a, b) => a.priority - b.priority);

  return {
    rubricVersion,
    passed,
    summary,
    strengths,
    blockingIssues,
    nextActions,
  };
}
