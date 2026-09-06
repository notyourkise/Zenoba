/**
 * Deterministic Evaluator for Path 4 Final Capstone:
 * Enterprise Named-Service Outage Diagnosis & Repair (named-service-outage)
 *
 * Evaluates learner's ability to diagnose and fix 4 interconnected service layers:
 * 1. Default Gateway IP correction on local DHCP scope (192.168.1.254 -> 192.168.1.1)
 * 2. DNS Server IP correction on local DHCP scope (192.168.1.99 -> 192.168.1.10 or 8.8.8.8)
 * 3. NAT/PAT Overload activation on router WAN interface
 * 4. Conceptual distinction: Ping (ICMP Layer 3) succeeds vs Web (TCP Layer 4/7) fails
 */

export interface NamedServiceOutageSubmission {
  dhcpDefaultGateway: string;
  dhcpDnsServer: string;
  natOverloadEnabled: boolean;
  transportOutageReasonOption: string;
}

export interface NamedServiceCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface NamedServiceEvaluation {
  passed: boolean;
  score: number;
  maxScore: number;
  criteriaResults: NamedServiceCriterionResult[];
  unmetOutcomes: string[];
  feedback: string[];
}

export const TRANSPORT_OUTAGE_OPTIONS = [
  {
    id: "port-blocked-or-service-down",
    text: "Ping menggunakan ICMP di Layer 3 yang terkirim normal, sedangkan akses web membutuhkan sesi TCP port 80/443 di Layer 4 yang diblokir firewall atau layanannya tidak aktif.",
    isCorrect: true,
  },
  {
    id: "cable-transmits-icmp-only",
    text: "Kabel UTP kategori 5e hanya mampu menghantarkan sinyal ICMP dan menolak sinyal HTTP.",
    isCorrect: false,
  },
  {
    id: "mac-address-table-full",
    text: "Tabel MAC address switch penuh sehingga port 80 dibuang secara acak oleh switch Layer 2.",
    isCorrect: false,
  },
  {
    id: "dns-changes-http-port",
    text: "DNS resolver otomatis mengubah paket HTTP menjadi paket ICMP saat melintasi router.",
    isCorrect: false,
  },
];

export function evaluateNamedServiceOutage(
  submission: NamedServiceOutageSubmission
): NamedServiceEvaluation {
  const criteriaResults: NamedServiceCriterionResult[] = [];
  const unmetOutcomes: string[] = [];
  const feedback: string[] = [];

  let totalScore = 0;
  const maxScore = 100;

  // Criterion 1: Fix Default Gateway on DHCP Scope (Must be 192.168.1.1)
  // Max score: 25
  const isGatewayFixed =
    typeof submission.dhcpDefaultGateway === "string" &&
    submission.dhcpDefaultGateway.trim() === "192.168.1.1";

  if (isGatewayFixed) {
    totalScore += 25;
    criteriaResults.push({
      id: "default-gateway-fixed",
      title: "Koreksi Default Gateway pada DHCP Scope",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Default Gateway telah diarahkan ke IP antarmuka LAN router yang valid (192.168.1.1), memulihkan jalur keluar antar-subnet.",
    });
  } else {
    unmetOutcomes.push("RTG-M1");
    criteriaResults.push({
      id: "default-gateway-fixed",
      title: "Koreksi Default Gateway pada DHCP Scope",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: `Default Gateway masih bernilai '${submission.dhcpDefaultGateway || "kosong"}'. Host tidak dapat keluar LAN karena IP gateway router LAN adalah 192.168.1.1.`,
    });
    feedback.push(
      "Perbaiki opsi default-router pada DHCP scope menjadi 192.168.1.1 agar host lokal memiliki jalur keluar menuju router."
    );
  }

  // Criterion 2: Fix DNS Server on DHCP Scope (Must be 192.168.1.10, 8.8.8.8, 1.1.1.1, or 8.8.4.4)
  // Max score: 25
  const validDnsServers = ["192.168.1.10", "8.8.8.8", "1.1.1.1", "8.8.4.4"];
  const isDnsFixed =
    typeof submission.dhcpDnsServer === "string" &&
    validDnsServers.includes(submission.dhcpDnsServer.trim());

  if (isDnsFixed) {
    totalScore += 25;
    criteriaResults.push({
      id: "dns-server-fixed",
      title: "Koreksi DNS Server pada DHCP Scope",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Resolver DNS telah diarahkan ke DNS Server operasional, memulihkan resolusi nama domain FQDN klien.",
    });
  } else {
    unmetOutcomes.push("SRV-M2");
    criteriaResults.push({
      id: "dns-server-fixed",
      title: "Koreksi DNS Server pada DHCP Scope",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback: `DNS Server masih bernilai '${submission.dhcpDnsServer || "kosong"}'. Host gagal menerjemahkan nama domain karena IP tersebut tidak merespons query DNS.`,
    });
    feedback.push(
      "Arahkan dns-server pada DHCP scope ke DNS internal sekolah (192.168.1.10) atau DNS publik terpercaya (8.8.8.8 / 1.1.1.1)."
    );
  }

  // Criterion 3: Activate NAT/PAT Overload on Router WAN Interface
  // Max score: 25
  const isNatFixed = submission.natOverloadEnabled === true;

  if (isNatFixed) {
    totalScore += 25;
    criteriaResults.push({
      id: "nat-overload-activated",
      title: "Aktivasi Port Address Translation (PAT / NAT Overload)",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! NAT Overload telah diaktifkan pada interface WAN router. Paket dari IP privat internal kini ditranslasikan ke IP publik legal.",
    });
  } else {
    unmetOutcomes.push("NAT-M2");
    criteriaResults.push({
      id: "nat-overload-activated",
      title: "Aktivasi Port Address Translation (PAT / NAT Overload)",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback:
        "NAT Overload belum diaktifkan pada router. Paket dengan IP privat RFC 1918 langsung dibuang oleh router ISP hulu.",
    });
    feedback.push(
      "Aktifkan fitur NAT/PAT Overload pada router perbatasan agar seluruh komputer klien dapat berbagi satu IP publik legal."
    );
  }

  // Criterion 4: Conceptual Distinction (Ping ICMP vs Web TCP Layer 4/7)
  // Max score: 25
  const isTransportCorrect =
    submission.transportOutageReasonOption === "port-blocked-or-service-down";

  if (isTransportCorrect) {
    totalScore += 25;
    criteriaResults.push({
      id: "transport-diagnostic-logic",
      title: "Analisis Diagnostik Keterjangkauan Layer 3 vs Port Layer 4",
      passed: true,
      score: 25,
      maxScore: 25,
      feedback:
        "Tepat! Anda memahami perbedaan mendasar antara reachability Layer 3 (ICMP Echo) dengan ketersediaan soket layanan aplikasi Layer 4/7 (TCP port 80/443).",
    });
  } else {
    unmetOutcomes.push("TRN-M2");
    criteriaResults.push({
      id: "transport-diagnostic-logic",
      title: "Analisis Diagnostik Keterjangkauan Layer 3 vs Port Layer 4",
      passed: false,
      score: 0,
      maxScore: 25,
      feedback:
        "Analisis perbedaan ICMP dan HTTP belum tepat. Keberhasilan ping membuktikan Layer 3 sehat, sedangkan kegagalan browsing disebabkan oleh port tertutup atau service web padam.",
    });
    feedback.push(
      "Pahami bahwa ping (ICMP Layer 3) tidak menguji apakah layanan web (TCP port 80/443 Layer 4) sedang aktif dan terbuka."
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
