/**
 * Deterministic Evaluator for Path 5 Final Capstone:
 * Investigasi & Remediasi Insiden Jaringan Multi-Skala (multi-incident-investigation)
 *
 * Evaluates learner's diagnostic evidence interpretation and corrective actions across 4 core areas:
 * 1. Wireless Client & APIPA Incident: DHCP pool /28 exhaustion -> expand scope to /24.
 * 2. Switching & Inter-VLAN Incident: Access port on uplink -> reconfigure to 802.1Q trunk.
 * 3. Branch Office Offline Incident: Default gateway set to 192.168.1.254 -> restore to 192.168.1.1.
 * 4. Systematic Troubleshooting Methodology: Isolate one variable + verify Layer 7 end-to-end.
 */

export interface MultiIncidentSubmission {
  apipaRootCause: string;
  apipaCorrection: string;
  interVlanRootCause: string;
  interVlanCorrection: string;
  gatewayRootCause: string;
  gatewayCorrection: string;
  troubleshootingPrincipleOption: string;
  serviceVerificationOption: string;
}

export interface MultiIncidentCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface MultiIncidentEvaluation {
  passed: boolean;
  score: number;
  maxScore: number;
  criteriaResults: MultiIncidentCriterionResult[];
  unmetOutcomes: string[];
  feedback: string[];
}

export const TROUBLESHOOTING_PRINCIPLE_OPTIONS = [
  {
    id: "isolate-single-variable-with-rollback",
    text: "Ubah hanya 1 variabel konfigurasi pada satu waktu dan siapkan rencana rollback sebelum melanjutkan, agar dampak perubahan terukur pasti.",
    isCorrect: true,
  },
  {
    id: "change-all-parameters-simultaneously",
    text: "Ubah seluruh konfigurasi IP, subnet, VLAN, dan routing secara serentak agar proses perbaikan selesai lebih cepat.",
    isCorrect: false,
  },
  {
    id: "reboot-hardware-repeatedly",
    text: "Restart router dan switch berulang kali hingga sinyal Wi-Fi otomatis stabil tanpa memeriksa log konfigurasi.",
    isCorrect: false,
  },
  {
    id: "assume-user-opini-is-fact",
    text: "Langsung percaya pada opini pengguna bahwa server terkena virus tanpa memverifikasi data teknis di CLI.",
    isCorrect: false,
  },
];

export const SERVICE_VERIFICATION_OPTIONS = [
  {
    id: "verify-layer7-and-end-user-workflow",
    text: "Lakukan verifikasi fungsional aplikasi nyata di Layer 7 (login web, transaksi sistem, query database) oleh pengguna akhir, bukan hanya mengandalkan respon ping ICMP Layer 3.",
    isCorrect: true,
  },
  {
    id: "icmp-ping-reply-is-enough",
    text: "Cukup pastikan ping 192.168.1.1 berstatus Reply, tiket gangguan langsung sah ditutup tanpa perlu menguji web browser.",
    isCorrect: false,
  },
  {
    id: "wait-24-hours-without-testing",
    text: "Tunggu 24 jam tanpa pengujian untuk melihat apakah pengguna komplain kembali.",
    isCorrect: false,
  },
  {
    id: "format-client-os-as-verification",
    text: "Instal ulang sistem operasi setiap komputer klien sebagai bukti verifikasi tuntas.",
    isCorrect: false,
  },
];

export function evaluateMultiIncidentInvestigation(
  submission: MultiIncidentSubmission
): MultiIncidentEvaluation {
  const criteriaResults: MultiIncidentCriterionResult[] = [];
  const unmetOutcomes: string[] = [];
  const feedback: string[] = [];

  let totalScore = 0;
  const maxScore = 100;

  // ---------------------------------------------------------------------------
  // Criterion 1: Wireless & APIPA DHCP Scope Incident (Max 25 pts)
  // ---------------------------------------------------------------------------
  const isApipaCauseCorrect =
    submission.apipaRootCause === "dhcp-pool-exhausted";
  const isApipaFixCorrect =
    submission.apipaCorrection === "expand-dhcp-scope-24";

  if (isApipaCauseCorrect && isApipaFixCorrect) {
    totalScore += 25;
    criteriaResults.push({
      id: "apipa-dhcp-resolution",
      title: "Remediasi Insiden APIPA & DHCP Pool Ruang Rapat",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Anda mendiagnosis bahwa IP 169.254.x.x dipicu oleh kehabisan pool DHCP /28 (14 host) dan memperluas scope menjadi /24 sehingga seluruh peserta rapat mendapat sewa IP valid.",
    });
  } else {
    unmetOutcomes.push("WLS-M1");
    let detail = "Analisis insiden APIPA belum tepat: ";
    if (!isApipaCauseCorrect) {
      detail += "Akar masalah IP 169.254.x.x adalah DHCP Pool Exhaustion. ";
    }
    if (!isApipaFixCorrect) {
      detail += "Tindakan perbaikan yang benar adalah memperluas subnet DHCP Scope menjadi /24.";
    }
    criteriaResults.push({
      id: "apipa-dhcp-resolution",
      title: "Remediasi Insiden APIPA & DHCP Pool Ruang Rapat",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: detail.trim(),
    });
    feedback.push(
      "Ingat: Alamat 169.254.x.x (APIPA) terjadi ketika klien meminta DHCP namun tidak ada respons akibat pool sewa penuh."
    );
  }

  // ---------------------------------------------------------------------------
  // Criterion 2: Switching & Inter-VLAN Trunking Incident (Max 25 pts)
  // ---------------------------------------------------------------------------
  const isInterVlanCauseCorrect =
    submission.interVlanRootCause === "missing-8021q-trunk";
  const isInterVlanFixCorrect =
    submission.interVlanCorrection === "reconfigure-port-trunk";

  if (isInterVlanCauseCorrect && isInterVlanFixCorrect) {
    totalScore += 25;
    criteriaResults.push({
      id: "intervlan-trunk-resolution",
      title: "Remediasi Trunking & Isolasi Inter-VLAN Sales-Database",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Anda mendeteksi bahwa uplink Fa0/24 masih beroperasi dalam mode Access VLAN 1 alih-alih 802.1Q Trunk, dan mengonfigurasinya menjadi mode Trunk untuk melewatkan lalu lintas multi-VLAN.",
    });
  } else {
    unmetOutcomes.push("SEC-M2");
    let detail = "Analisis inter-VLAN belum tepat: ";
    if (!isInterVlanCauseCorrect) {
      detail += "Akar masalah adalah port uplink switch ke router masih Access VLAN 1 bukan Trunk. ";
    }
    if (!isInterVlanFixCorrect) {
      detail += "Tindakan korektif yang benar adalah mengubah mode port Fa0/24 menjadi 802.1Q Trunk.";
    }
    criteriaResults.push({
      id: "intervlan-trunk-resolution",
      title: "Remediasi Trunking & Isolasi Inter-VLAN Sales-Database",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: detail.trim(),
    });
    feedback.push(
      "Ingat: Router-on-a-Stick memerlukan port switch uplink dalam mode 802.1Q Trunk agar tag VLAN 10 dan 20 dapat diteruskan ke router."
    );
  }

  // ---------------------------------------------------------------------------
  // Criterion 3: Branch Office Gateway Incident (Max 25 pts)
  // ---------------------------------------------------------------------------
  const isGatewayCauseCorrect =
    submission.gatewayRootCause === "wrong-default-gateway";
  const isGatewayFixCorrect =
    submission.gatewayCorrection === "restore-gateway-192-168-1-1";

  if (isGatewayCauseCorrect && isGatewayFixCorrect) {
    totalScore += 25;
    criteriaResults.push({
      id: "branch-gateway-resolution",
      title: "Pemulihan Default Gateway Kantor Cabang Bandung",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Anda menemukan bahwa Default Gateway router disetel ke IP non-existent 192.168.1.254 dan berhasil mengembalikannya ke IP interface router yang valid (192.168.1.1).",
    });
  } else {
    unmetOutcomes.push("DIAG-M1");
    let detail = "Analisis kantor cabang belum tepat: ";
    if (!isGatewayCauseCorrect) {
      detail += "Akar masalah adalah Default Gateway salah disetel ke 192.168.1.254. ";
    }
    if (!isGatewayFixCorrect) {
      detail += "Tindakan korektif adalah mengembalikan Default Gateway ke 192.168.1.1.";
    }
    criteriaResults.push({
      id: "branch-gateway-resolution",
      title: "Pemulihan Default Gateway Kantor Cabang Bandung",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: detail.trim(),
    });
    feedback.push(
      "Ingat: Jika Default Gateway salah diarahkan, paket tidak dapat keluar dari subnet lokal menuju Internet atau intranet pusat."
    );
  }

  // ---------------------------------------------------------------------------
  // Criterion 4: Systematic Troubleshooting Methodology (Max 25 pts)
  // ---------------------------------------------------------------------------
  const isPrincipleCorrect =
    submission.troubleshootingPrincipleOption ===
    "isolate-single-variable-with-rollback";
  const isVerificationCorrect =
    submission.serviceVerificationOption ===
    "verify-layer7-and-end-user-workflow";

  if (isPrincipleCorrect && isVerificationCorrect) {
    totalScore += 25;
    criteriaResults.push({
      id: "troubleshooting-methodology-standards",
      title: "Penerapan Metodologi Ilmiah & Verifikasi Menyeluruh",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Anda menerapkan prinsip isolasi satu variabel dengan rencana rollback dan memastikan verifikasi fungsional Layer 7 sebelum menutup tiket.",
    });
  } else {
    unmetOutcomes.push("MTH-M2");
    let detail = "Prinsip metodologi belum tepat: ";
    if (!isPrincipleCorrect) {
      detail += "Wajib mengubah hanya 1 variabel pada satu waktu dan menyiapkan rencana rollback. ";
    }
    if (!isVerificationCorrect) {
      detail += "Verifikasi pemulihan harus menguji fungsi aplikasi Layer 7, bukan hanya ping ICMP.";
    }
    criteriaResults.push({
      id: "troubleshooting-methodology-standards",
      title: "Penerapan Metodologi Ilmiah & Verifikasi Menyeluruh",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: detail.trim(),
    });
    feedback.push(
      "SOP Troubleshooting: Jangan mengubah banyak hal sekaligus, dan pastikan aplikasi nyata dapat dibuka oleh pengguna sebelum menutup tiket."
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
