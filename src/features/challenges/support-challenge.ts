export interface ChallengeInventoryItem {
  id: string;
  name: string;
  category: "router" | "switch" | "cable" | "ap" | "pc" | "wrong";
}

export interface SupportChallengeSubmission {
  selectedDeviceIds: string[];
  topologyChoice: string;
  troubleshootAnswer: string;
  isPathFinal?: boolean;
}

export interface ChallengeOutcomeResult {
  outcomeId: string;
  title: string;
  passed: boolean;
  feedback: string;
}

export interface ChallengeEvaluationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string[];
  outcomeResults: ChallengeOutcomeResult[];
  unmetOutcomes: string[];
}

export const REQUIRED_DEVICES = ["router-1", "switch-1", "ap-1", "cable-cat6"];

/**
 * Deterministic evaluation for "First Day as IT Support" challenge,
 * aligned with Path 1 (Network Foundations) curriculum outcomes:
 * - DEV-M1 (P1-M5 Network Devices)
 * - PMC-M1 (P1-M6 Physical Media & Cabling)
 * - TOP-M1 (P1-M4 Network Topology)
 * - OSI-M1 (P1-M8 OSI & TCP/IP Foundations)
 */
export function evaluateSupportChallenge(
  submission: SupportChallengeSubmission
): ChallengeEvaluationResult {
  const feedback: string[] = [];
  const outcomeResults: ChallengeOutcomeResult[] = [];
  const unmetOutcomes: string[] = [];
  let score = 0;
  const maxScore = 100;

  const selectedSet = new Set(submission.selectedDeviceIds);

  // 1. Evaluate Network Devices (DEV-M1 - 20 points)
  const hasActiveDevices =
    selectedSet.has("router-1") &&
    selectedSet.has("switch-1") &&
    selectedSet.has("ap-1");
  const hasHub = selectedSet.has("hub-legacy");
  const devPassed = hasActiveDevices && !hasHub;

  if (devPassed) {
    score += 20;
    const msg =
      "Pilihan perangkat aktif tepat: Menggunakan Router Layer 3, Managed Switch Layer 2, dan Wi-Fi 6 AP tanpa hub usang.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "DEV-M1",
      title: "Pemilihan Perangkat Jaringan Sesuai Fungsi",
      passed: true,
      feedback: msg,
    });
  } else {
    const msg =
      "Pemilihan perangkat aktif belum tepat. Pastikan memilih Router, Switch modern, AP Wi-Fi, dan hindari Hub legasi yang rentan tabrakan data (collision).";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "DEV-M1",
      title: "Pemilihan Perangkat Jaringan Sesuai Fungsi",
      passed: false,
      feedback: msg,
    });
    unmetOutcomes.push("DEV-M1");
  }

  // 2. Evaluate Physical Media (PMC-M1 - 20 points)
  const hasCat6 = selectedSet.has("cable-cat6");
  const hasCoaxial = selectedSet.has("coaxial-cable");
  const pmcPassed = hasCat6 && !hasCoaxial;

  if (pmcPassed) {
    score += 20;
    const msg =
      "Pilihan media fisik tepat: Menggunakan Kabel UTP Cat6 (1000BASE-T) yang mendukung gigabit dan menghindari kabel koaksial usang.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "PMC-M1",
      title: "Pemilihan Media Transmisi dan Pengkabelan",
      passed: true,
      feedback: msg,
    });
  } else {
    const msg =
      "Pemilihan media fisik belum tepat. Pastikan memilih Kabel UTP Cat6 dan tidak menggunakan kabel koaksial untuk LAN modern.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "PMC-M1",
      title: "Pemilihan Media Transmisi dan Pengkabelan",
      passed: false,
      feedback: msg,
    });
    unmetOutcomes.push("PMC-M1");
  }

  // 3. Evaluate Topology Selection (TOP-M1 - 30 points)
  if (submission.topologyChoice === "star") {
    score += 30;
    const msg =
      "Topologi Star adalah pilihan standar terbaik: Kerusakan pada satu kabel PC staf tidak akan melumpuhkan seluruh jaringan kantor.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "TOP-M1",
      title: "Analisis Struktur dan Dampak Kegagalan Topologi",
      passed: true,
      feedback: msg,
    });
  } else {
    const msg =
      "Pilihan topologi kurang sesuai. Topologi Bus atau Ring rentan terhadap single point of failure pada kabel transmisi bersama.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "TOP-M1",
      title: "Analisis Struktur dan Dampak Kegagalan Topologi",
      passed: false,
      feedback: msg,
    });
    unmetOutcomes.push("TOP-M1");
  }

  // 4. Evaluate Troubleshooting Resolution (OSI-M1 - 30 points)
  if (submission.troubleshootAnswer === "check_layer1_cable") {
    score += 30;
    const msg =
      "Metode troubleshooting tepat: Memeriksa fisik kabel Layer 1 dan lampu LED NIC sebelum melakukan tindakan disruptif atau memeriksa konfigurasi software.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "OSI-M1",
      title: "Penerapan Model OSI untuk Analisis dan Troubleshooting",
      passed: true,
      feedback: msg,
    });
  } else {
    const msg =
      "Metode troubleshooting belum sesuai kaidah bottom-up Layer OSI. Jangan langsung restart router utama atau install ulang OS sebelum memeriksa konektivitas fisik.";
    feedback.push(msg);
    outcomeResults.push({
      outcomeId: "OSI-M1",
      title: "Penerapan Model OSI untuk Analisis dan Troubleshooting",
      passed: false,
      feedback: msg,
    });
    unmetOutcomes.push("OSI-M1");
  }

  const passed = score >= 70;

  return {
    passed,
    score,
    maxScore,
    feedback,
    outcomeResults,
    unmetOutcomes,
  };
}
