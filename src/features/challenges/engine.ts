/**
 * Pure Challenge Diagnostic Engine
 * Evaluates real-world multi-step troubleshooting hypotheses and evidence analysis.
 */

export interface ChallengeEvaluationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  rootCauseFeedback: string;
  explanation: string;
}

export function evaluateChallengeDiagnosis(
  challengeSlug: string,
  submission: {
    selectedRootCause: string;
    diagnosticStepsTaken?: string[];
  }
): ChallengeEvaluationResult {
  const { selectedRootCause } = submission;
  let passed = false;
  let score = 0;
  const maxScore = 150;
  let rootCauseFeedback = "";
  let explanation = "";

  switch (challengeSlug) {
    case "branch-office-down": {
      // Correct root cause: "gateway-misconfig"
      if (selectedRootCause === "gateway-misconfig") {
        passed = true;
        score = 150;
        rootCauseFeedback = "Analisis Tepat! Default Gateway pada router cabang salah dikonfigurasi ke IP yang tidak ada (192.168.1.254 alih-alih 192.168.1.1).";
        explanation = "Ketika gateway salah, paket dari LAN cabang tidak dapat diarahkan ke uplink ISP. Memperbaiki default gateway langsung memulihkan konektivitas seluruh kantor cabang.";
      } else {
        rootCauseFeedback = "Analisis belum tepat. Hasil ping menunjukkan adapter PC aktif namun paket ke gateway lokal timeout.";
        explanation = "Periksa kembali konfigurasi Default Gateway pada tabel routing router cabang.";
      }
      break;
    }

    case "inter-vlan-routing-bug": {
      // Correct root cause: "missing-subinterface-trunk"
      if (selectedRootCause === "missing-subinterface-trunk") {
        passed = true;
        score = 150;
        rootCauseFeedback = "Analisis Tepat! Port uplink switch ke router dikonfigurasi sebagai Access Port (VLAN 1) alih-alih 802.1Q Trunk.";
        explanation = "Agar Router-on-a-Stick dapat melewatkan multi-VLAN (VLAN 10 & VLAN 20), port switch yang terhubung ke router wajib beroperasi dalam mode Trunk.";
      } else {
        rootCauseFeedback = "Analisis belum tepat. Klien dalam VLAN yang sama dapat saling ping, namun gagal mencapai VLAN lain.";
        explanation = "Periksa konfigurasi mode port uplink switch (Trunk vs Access).";
      }
      break;
    }

    case "dhcp-pool-exhausted": {
      // Correct root cause: "pool-exhaustion"
      if (selectedRootCause === "pool-exhaustion") {
        passed = true;
        score = 150;
        rootCauseFeedback = "Analisis Tepat! Alamat IP dalam DHCP Pool (/28 = hanya 14 host) telah habis disewa, menyebabkan klien baru mendapat IP APIPA 169.254.x.x.";
        explanation = "Solusi yang tepat adalah memperluas subnet DHCP Scope menjadi /24 atau memperpendek waktu sewa (Lease Time) untuk perangkat tamu.";
      } else {
        rootCauseFeedback = "Analisis belum tepat. Klien lama masih terhubung normal dan DHCP Server masih aktif merespons.";
        explanation = "Periksa sisa kapasitas alokasi IP pool pada DHCP Server.";
      }
      break;
    }

    default: {
      if (selectedRootCause === "resolved") {
        passed = true;
        score = 150;
        rootCauseFeedback = "Tantangan berhasil diselesaikan!";
        explanation = "Troubleshooting berhasil.";
      } else {
        rootCauseFeedback = "Penyebab masalah belum tepat.";
        explanation = "Ulangi proses investigasi.";
      }
      break;
    }
  }

  return {
    passed,
    score,
    maxScore,
    rootCauseFeedback,
    explanation,
  };
}
