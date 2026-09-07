/**
 * Pure Deterministic 5-Dimensional Scoring Engine for IT Consultant Mode
 * Evaluates full client proposals across:
 * 1. Technical Correctness (0-20)
 * 2. Requirement Fulfillment (0-20)
 * 3. Cost Efficiency (0-20)
 * 4. Scalability & Spare Capacity (0-20)
 * 5. Security & Segmentation (0-20)
 */

import { BoQItem, calculateBoQ } from "../procurement/boq";

export interface ConsultantCaseRequirements {
  clientName: string;
  clientType: "small-office" | "warnet" | "medium-office" | "school" | "enterprise";
  budget: number;
  wiredClientCount: number;
  apCount: number;
  requireVlan: boolean;
  requireDualWan?: boolean;
  requirePoe?: boolean;
  vlanList?: { vlanId: number; name: string; requiredHosts: number }[];
}

export interface ConsultantProjectSubmission {
  boqItems: BoQItem[];
  vlanPlan?: { vlanId: number; name: string; subnet: string; prefix: number }[];
  topologyNodesCount?: number;
}

export interface DimensionScore {
  score: number;
  maxScore: number;
  feedback: string;
}

export interface CompositeScoringResult {
  passed: boolean;
  totalScore: number;
  maxTotalScore: number;
  dimensions: {
    technicalCorrectness: DimensionScore;
    requirementFulfillment: DimensionScore;
    costEfficiency: DimensionScore;
    scalability: DimensionScore;
    security: DimensionScore;
  };
}

export function evaluateConsultantProject(
  requirements: ConsultantCaseRequirements,
  submission: ConsultantProjectSubmission
): CompositeScoringResult {
  const boq = calculateBoQ(submission.boqItems, requirements.budget, {
    requiredAccessPorts: requirements.wiredClientCount,
    requiredApCount: requirements.apCount,
    requireVlan: requirements.requireVlan,
    requireDualWan: requirements.requireDualWan,
  });

  // 1. Technical Correctness (0-20)
  let techScore = 0;
  const techFeedback: string[] = [];

  if (boq.hasRouter) {
    techScore += 8;
  } else {
    techFeedback.push("Belum ada Router gateway untuk menghubungkan LAN ke Internet.");
  }

  if (boq.totalAccessPorts >= requirements.wiredClientCount) {
    techScore += 7;
  } else {
    techFeedback.push(`Jumlah port switch (${boq.totalAccessPorts}) kurang dari kebutuhan kabel PC (${requirements.wiredClientCount}).`);
  }

  if (!requirements.requirePoe || boq.hasSufficientPoe) {
    techScore += 5;
  } else {
    techFeedback.push("Kapasitas daya PoE switch tidak mencukupi untuk menyuplai seluruh Access Point.");
  }

  // 2. Requirement Fulfillment (0-20)
  let reqScore = 0;
  const reqFeedback: string[] = [];

  // AP requirement
  const apItemsCount = submission.boqItems
    .filter((i) => i.deviceId.startsWith("ap-"))
    .reduce((acc, curr) => acc + curr.quantity, 0);

  if (apItemsCount >= requirements.apCount) {
    reqScore += 10;
  } else {
    reqFeedback.push(`Jumlah Access Point (${apItemsCount}) kurang dari target jangkauan klien (${requirements.apCount}).`);
  }

  // Dual WAN requirement if applicable
  const hasDualWanRouter = submission.boqItems.some(
    (i) => i.deviceId === "router-pro-8g-dualwan" || i.deviceId === "router-core-sfp-10g"
  );

  if (!requirements.requireDualWan || hasDualWanRouter) {
    reqScore += 10;
  } else {
    reqFeedback.push("Kebutuhan Dual-WAN failover belum terpenuhi oleh tipe router yang dipilih.");
  }

  // 3. Cost Efficiency (0-20)
  let costScore = 0;
  let costFeedback = "";

  if (!boq.isWithinBudget) {
    costScore = 0;
    costFeedback = `Over Budget! Total pengadaan (Rp ${boq.totalCost.toLocaleString("id-ID")}) melebihi anggaran klien (Rp ${requirements.budget.toLocaleString("id-ID")}).`;
  } else if (boq.budgetUtilizationPct >= 40 && boq.budgetUtilizationPct <= 95) {
    costScore = 20;
    costFeedback = `Penggunaan anggaran sangat efisien (${boq.budgetUtilizationPct}% dari pagu anggaran).`;
  } else if (boq.budgetUtilizationPct < 40) {
    costScore = 14;
    costFeedback = "Penggunaan anggaran terlalu minim (ada potensi under-specification perangkat).";
  } else {
    costScore = 16;
    costFeedback = `Penggunaan anggaran mendekati batas maksimal (${boq.budgetUtilizationPct}%).`;
  }

  // 4. Scalability & Spare Capacity (0-20)
  let scaleScore = 0;
  let scaleFeedback = "";

  const sparePortRatio =
    requirements.wiredClientCount > 0
      ? (boq.totalAccessPorts - requirements.wiredClientCount) / requirements.wiredClientCount
      : 0.5;

  if (sparePortRatio >= 0.2) {
    scaleScore = 20;
    scaleFeedback = `Tersedia cadangan kapasitas port switch yang memadai (${Math.round(sparePortRatio * 100)}% spare) untuk ekspansi perangkat di masa depan.`;
  } else if (sparePortRatio >= 0) {
    scaleScore = 12;
    scaleFeedback = "Cadangan port switch sangat minim (< 20%), ekspansi akan membutuhkan switch baru.";
  } else {
    scaleScore = 0;
    scaleFeedback = "Tidak ada kapasitas sisa, port switch kurang.";
  }

  // 5. Security & Segmentation (0-20)
  let secScore = 0;
  let secFeedback = "";

  if (!requirements.requireVlan) {
    secScore = 20;
    secFeedback = "Topologi flat sesuai dengan skala kebutuhan klien.";
  } else {
    if (boq.hasManagedSwitch) {
      secScore += 10;
      if (submission.vlanPlan && submission.vlanPlan.length >= (requirements.vlanList?.length || 2)) {
        secScore += 10;
        secFeedback = "Segmentasi VLAN dan Switch Managed terkonfigurasi dengan baik untuk isolasi keamanan.";
      } else {
        secScore += 5;
        secFeedback = "Switch mendukung VLAN, namun rancangan tabel VLAN belum lengkap.";
      }
    } else {
      secScore = 0;
      secFeedback = "Klien membutuhkan segmentasi VLAN, namun pengadaan menggunakan switch unmanaged tanpa dukungan 802.1Q.";
    }
  }

  // Essential Connectivity Constraints:
  // Budget success or high scores in other dimensions cannot conceal missing critical connectivity.
  const hasRouter = boq.hasRouter;
  const hasSufficientPorts = boq.totalAccessPorts >= requirements.wiredClientCount;
  const hasCriticalConnectivity = hasRouter && hasSufficientPorts;

  if (!hasCriticalConnectivity) {
    if (!hasRouter) {
      techFeedback.unshift("Kegagalan Kritis: Proposal tidak menyertakan Router gateway untuk konektivitas dasar jaringan.");
    }
    if (!hasSufficientPorts) {
      techFeedback.unshift(
        `Kegagalan Kritis: Kapasitas port switch (${boq.totalAccessPorts}) tidak mencukupi untuk kebutuhan klien (${requirements.wiredClientCount}). Efisiensi biaya tidak dapat mengorbankan konektivitas esensial.`
      );
    }
  }

  const totalScore = techScore + reqScore + costScore + scaleScore + secScore;
  const passed = totalScore >= 70 && boq.isWithinBudget && hasCriticalConnectivity;

  return {
    passed,
    totalScore,
    maxTotalScore: 100,
    dimensions: {
      technicalCorrectness: {
        score: techScore,
        maxScore: 20,
        feedback: techFeedback.length > 0 ? techFeedback.join(" ") : "Kapasitas hardware dan spesifikasi teknis tepat.",
      },
      requirementFulfillment: {
        score: reqScore,
        maxScore: 20,
        feedback: reqFeedback.length > 0 ? reqFeedback.join(" ") : "Seluruh kebutuhan operasional klien terpenuhi 100%.",
      },
      costEfficiency: {
        score: costScore,
        maxScore: 20,
        feedback: costFeedback,
      },
      scalability: {
        score: scaleScore,
        maxScore: 20,
        feedback: scaleFeedback,
      },
      security: {
        score: secScore,
        maxScore: 20,
        feedback: secFeedback,
      },
    },
  };
}
