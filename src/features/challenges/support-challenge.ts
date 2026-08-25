export interface ChallengeInventoryItem {
  id: string;
  name: string;
  category: "router" | "switch" | "cable" | "ap" | "pc" | "wrong";
}

export interface SupportChallengeSubmission {
  selectedDeviceIds: string[];
  topologyChoice: string;
  troubleshootAnswer: string;
}

export interface ChallengeEvaluationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string[];
}

export const REQUIRED_DEVICES = ["router-1", "switch-1", "ap-1", "cable-cat6"];

/**
 * Deterministic evaluation for "First Day as IT Support" challenge.
 */
export function evaluateSupportChallenge(
  submission: SupportChallengeSubmission
): ChallengeEvaluationResult {
  const feedback: string[] = [];
  let score = 0;
  const maxScore = 100;

  // 1. Evaluate Device Inventory (40 points)
  const selectedSet = new Set(submission.selectedDeviceIds);
  const hasRequiredDevices = REQUIRED_DEVICES.every((id) => selectedSet.has(id));
  const hasWrongDevices = selectedSet.has("hub-legacy") || selectedSet.has("coaxial-cable");

  if (hasRequiredDevices && !hasWrongDevices) {
    score += 40;
    feedback.push("Inventaris perangkat tepat untuk jaringan kantor cabang (Router, Switch, AP, Kabel Cat6).");
  } else {
    feedback.push("Pemilihan inventaris belum tepat. Pastikan memilih Router, Switch modern, AP Wi-Fi, dan Kabel Cat6.");
  }

  // 2. Evaluate Topology Selection (30 points)
  if (submission.topologyChoice === "star") {
    score += 30;
    feedback.push("Topologi Star adalah pilihan standar terbaik untuk keandalan dan skalabilitas kantor.");
  } else {
    feedback.push("Pilihan topologi kurang sesuai untuk infrastruktur kantor modern.");
  }

  // 3. Evaluate Troubleshooting Resolution (30 points)
  if (submission.troubleshootAnswer === "check_layer1_cable") {
    score += 30;
    feedback.push("Langkah troubleshooting tepat: Memeriksa fisik kabel Layer 1 terlebih dahulu sebelum memeriksa konfigurasi IP.");
  } else {
    feedback.push("Metode troubleshooting belum sesuai kaidah bottom-up OSI Layer.");
  }

  const passed = score >= 70;

  return {
    passed,
    score,
    maxScore,
    feedback,
  };
}
