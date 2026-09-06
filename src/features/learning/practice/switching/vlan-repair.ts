/**
 * Deterministic Evaluator for Path 3 Final Capstone:
 * Staff & Guest VLAN Segmentation and Trunk Misconfiguration Repair (staff-guest-vlan-repair)
 */

export interface VlanRepairSubmission {
  switch2Port2Vlan: number;
  trunkAllowedVlans: number[];
  interVlanReasonOption: string;
}

export interface VlanRepairCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface VlanRepairEvaluation {
  passed: boolean;
  score: number;
  maxScore: number;
  criteriaResults: VlanRepairCriterionResult[];
  unmetOutcomes: string[];
  feedback: string[];
}

export const INTER_VLAN_OPTIONS = [
  {
    id: "l2-isolation-needs-l3-router",
    text: "VLAN memisahkan broadcast domain secara mutlak di Layer 2; komunikasi antar-subnet membutuhkan perangkat Layer 3 (Router / L3 Switch).",
    isCorrect: true,
  },
  {
    id: "trunk-cable-too-slow",
    text: "Kabel trunk antar-switch mengalami penurunan kecepatan sehingga paket antar-VLAN otomatis dibatalkan.",
    isCorrect: false,
  },
  {
    id: "mac-address-conflict",
    text: "Terjadi bentrok MAC address antara komputer Staff dan komputer Tamu saat melintasi port access.",
    isCorrect: false,
  },
  {
    id: "switch-needs-reboot",
    text: "Switch Layer 2 harus di-restart terlebih dahulu agar tabel MAC bisa menggabungkan kedua VLAN secara otomatis.",
    isCorrect: false,
  },
];

export function evaluateVlanRepair(
  submission: VlanRepairSubmission
): VlanRepairEvaluation {
  const criteriaResults: VlanRepairCriterionResult[] = [];
  const unmetOutcomes: string[] = [];
  const feedback: string[] = [];

  let totalScore = 0;
  const maxScore = 100;

  // Criterion 1: Fix PC Staff 2 Port Assignment on Switch 2 (Must be VLAN 10)
  // Max score: 35
  const isPort2Fixed = submission.switch2Port2Vlan === 10;
  if (isPort2Fixed) {
    totalScore += 35;
    criteriaResults.push({
      id: "staff-port-fixed",
      title: "Penetapan Port Access PC Staff 2 (Switch 2)",
      passed: true,
      score: 35,
      maxScore: 35,
      feedback:
        "Tepat! Port Fa0/2 pada Switch 2 telah dikonfigurasi ke VLAN 10 (Staff), memulihkan konektivitas Layer 2 ke Server Staff.",
    });
  } else {
    unmetOutcomes.push("TRK-M1");
    criteriaResults.push({
      id: "staff-port-fixed",
      title: "Penetapan Port Access PC Staff 2 (Switch 2)",
      passed: false,
      score: 0,
      maxScore: 35,
      feedback: `Port Fa0/2 pada Switch 2 masih berada di VLAN ${submission.switch2Port2Vlan}. PC Staff harus berada di VLAN 10 untuk dapat mengakses Server Staff di Lantai 1.`,
    });
    feedback.push(
      "Pastikan PC Staff 2 pada Switch 2 dipindahkan ke VLAN 10 agar berada dalam satu broadcast domain dengan server."
    );
  }

  // Criterion 2: Fix Trunk Allowed VLAN List (Must permit both VLAN 10 and VLAN 20)
  // Max score: 35
  const allowed = Array.isArray(submission.trunkAllowedVlans)
    ? submission.trunkAllowedVlans
    : [];
  const hasVlan10 = allowed.includes(10);
  const hasVlan20 = allowed.includes(20);
  const isTrunkFixed = hasVlan10 && hasVlan20;

  if (isTrunkFixed) {
    totalScore += 35;
    criteriaResults.push({
      id: "trunk-allowed-fixed",
      title: "Konfigurasi Allowed VLAN pada Trunk Link Antar-Switch",
      passed: true,
      score: 35,
      maxScore: 35,
      feedback:
        "Tepat! Link Trunk Fa0/24 telah mengizinkan VLAN 10 dan VLAN 20, sehingga trafik Tamu di Lantai 1 dapat menyeberang ke Hotspot Gateway di Lantai 2.",
    });
  } else {
    unmetOutcomes.push("TRK-M2");
    const missingVlans: number[] = [];
    if (!hasVlan10) missingVlans.push(10);
    if (!hasVlan20) missingVlans.push(20);

    criteriaResults.push({
      id: "trunk-allowed-fixed",
      title: "Konfigurasi Allowed VLAN pada Trunk Link Antar-Switch",
      passed: false,
      score: 0,
      maxScore: 35,
      feedback: `Link Trunk belum mengizinkan seluruh VLAN yang dibutuhkan (VLAN yang kurang: ${missingVlans.join(
        ", "
      )}). Trafik antar-lantai masih terblokir.`,
    });
    feedback.push(
      "Konfigurasikan daftar Allowed VLAN pada trunk agar membawa kedua VLAN aktif: 10 dan 20."
    );
  }

  // Criterion 3: Inter-VLAN Communication Analysis (L2 isolation vs L3 routing requirement)
  // Max score: 30
  const isInterVlanCorrect =
    submission.interVlanReasonOption === "l2-isolation-needs-l3-router";

  if (isInterVlanCorrect) {
    totalScore += 30;
    criteriaResults.push({
      id: "inter-vlan-logic",
      title: "Analisis Isolasi Layer 2 & Kebutuhan Inter-VLAN Routing",
      passed: true,
      score: 30,
      maxScore: 30,
      feedback:
        "Tepat! Anda memahami bahwa switch Layer 2 murni mengisolasi broadcast domain; komunikasi antar-subnet membutuhkan perutean Layer 3 (Router / L3 Switch).",
    });
  } else {
    unmetOutcomes.push("VLAN-M2");
    criteriaResults.push({
      id: "inter-vlan-logic",
      title: "Analisis Isolasi Layer 2 & Kebutuhan Inter-VLAN Routing",
      passed: false,
      score: 0,
      maxScore: 30,
      feedback:
        "Pemahaman tentang isolasi Layer 2 belum tepat. VLAN memisahkan jaringan di Layer 2; komunikasi antar-VLAN bukan masalah kabel atau reboot, melainkan membutuhkan router Layer 3.",
    });
    feedback.push(
      "Pelajari kembali bahwa dua VLAN berbeda tidak dapat saling berkirim paket secara langsung di switch Layer 2 murni tanpa perutean Layer 3."
    );
  }

  const passed = totalScore >= 70;

  return {
    passed,
    score: totalScore,
    maxScore,
    criteriaResults,
    unmetOutcomes,
    feedback,
  };
}
