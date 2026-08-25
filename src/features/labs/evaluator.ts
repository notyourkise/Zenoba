/**
 * Pure Deterministic Lab Evaluator Engine
 * Evaluates learner configurations against explicit lab criteria.
 */

import { calculateSubnetDetails, isIpInSubnet, isValidIpv4, isValidPrefix } from "../network-logic/ipv4/ipv4";

export interface LabEvaluationResult {
  passed: boolean;
  score: number;
  maxScore: number;
  feedback: string[];
}

export function evaluateLabSubmission(
  labSlug: string,
  state: Record<string, unknown>
): LabEvaluationResult {
  const feedback: string[] = [];
  let score = 0;
  const maxScore = 100;

  switch (labSlug) {
    case "subnetting-calculator": {
      const { ip, prefix, networkAddress, broadcastAddress, usableHosts } = state as {
        ip: string;
        prefix: number;
        networkAddress: string;
        broadcastAddress: string;
        usableHosts: number;
      };

      if (!isValidIpv4(ip) || !isValidPrefix(prefix)) {
        return { passed: false, score: 0, maxScore, feedback: ["Format IP atau prefix tidak valid."] };
      }

      const expected = calculateSubnetDetails(ip, prefix);
      if (networkAddress === expected.networkAddress) {
        score += 40;
        feedback.push("Network ID tepat.");
      } else {
        feedback.push(`Network ID salah (jawaban: ${expected.networkAddress}).`);
      }

      if (broadcastAddress === expected.broadcastAddress) {
        score += 40;
        feedback.push("Broadcast IP tepat.");
      } else {
        feedback.push(`Broadcast IP salah (jawaban: ${expected.broadcastAddress}).`);
      }

      if (Number(usableHosts) === expected.usableHosts) {
        score += 20;
        feedback.push("Jumlah Host Usable tepat.");
      } else {
        feedback.push(`Jumlah Host Usable salah (jawaban: ${expected.usableHosts}).`);
      }
      break;
    }

    case "ip-configuration": {
      // Goal: Configure PC to reach Web Server 192.168.10.50 on 192.168.10.0/24
      const { pcIp, subnetMask, gateway } = state as {
        pcIp: string;
        subnetMask: string;
        gateway: string;
      };

      if (isIpInSubnet(pcIp, "192.168.10.0", 24) && pcIp !== "192.168.10.0" && pcIp !== "192.168.10.255" && pcIp !== "192.168.10.50") {
        score += 40;
        feedback.push("Alamat IPv4 PC berada dalam subnet yang tepat dan tidak konflik.");
      } else {
        feedback.push("Alamat IPv4 PC tidak berada dalam subnet 192.168.10.0/24 atau konflik dengan server.");
      }

      if (subnetMask === "255.255.255.0") {
        score += 30;
        feedback.push("Subnet Mask tepat (/24).");
      } else {
        feedback.push("Subnet Mask salah (harus 255.255.255.0).");
      }

      if (gateway === "192.168.10.1") {
        score += 30;
        feedback.push("Default Gateway tepat (192.168.10.1).");
      } else {
        feedback.push("Default Gateway salah (harus 192.168.10.1).");
      }
      break;
    }

    case "vlan-segmentation": {
      // Goal: Port 1 & 2 in VLAN 10, Port 3 & 4 in VLAN 20
      const { port1Vlan, port2Vlan, port3Vlan, port4Vlan } = state as {
        port1Vlan: number;
        port2Vlan: number;
        port3Vlan: number;
        port4Vlan: number;
      };

      if (Number(port1Vlan) === 10 && Number(port2Vlan) === 10) {
        score += 50;
        feedback.push("VLAN 10 (Sales) berhasil dikonfigurasi pada Port 1 & 2.");
      } else {
        feedback.push("Konfigurasi VLAN 10 pada Port 1 & 2 belum tepat.");
      }

      if (Number(port3Vlan) === 20 && Number(port4Vlan) === 20) {
        score += 50;
        feedback.push("VLAN 20 (Engineering) berhasil dikonfigurasi pada Port 3 & 4.");
      } else {
        feedback.push("Konfigurasi VLAN 20 pada Port 3 & 4 belum tepat.");
      }
      break;
    }

    case "static-routing": {
      // Goal: Configure static/default route 0.0.0.0/0 via Next Hop 192.168.1.254
      const { destination, prefix, nextHop } = state as {
        destination: string;
        prefix: number;
        nextHop: string;
      };

      if (destination === "0.0.0.0" && Number(prefix) === 0) {
        score += 50;
        feedback.push("Default Route 0.0.0.0/0 tepat.");
      } else {
        feedback.push("Prefix / Destinasi rute default belum tepat.");
      }

      if (nextHop === "192.168.1.254") {
        score += 50;
        feedback.push("Next Hop Gateway tepat (192.168.1.254).");
      } else {
        feedback.push("Next Hop Gateway salah (harus 192.168.1.254).");
      }
      break;
    }

    case "dhcp-dns-setup": {
      // Goal: Pool start 192.168.1.100, end 192.168.1.200, DNS 1.1.1.1
      const { poolStart, poolEnd, dnsServer } = state as {
        poolStart: string;
        poolEnd: string;
        dnsServer: string;
      };

      if (poolStart === "192.168.1.100" && poolEnd === "192.168.1.200") {
        score += 60;
        feedback.push("Rentang DHCP Pool IP tepat.");
      } else {
        feedback.push("Rentang DHCP Pool belum sesuai spesifikasi.");
      }

      if (dnsServer === "1.1.1.1" || dnsServer === "8.8.8.8") {
        score += 40;
        feedback.push("DNS Server IP valid.");
      } else {
        feedback.push("DNS Server IP belum tepat.");
      }
      break;
    }

    case "packet-flow-inspection":
    case "network-troubleshooting":
    default: {
      const { completed } = state as { completed: boolean };
      if (completed) {
        score = 100;
        feedback.push("Seluruh tahap lab berhasil diselesaikan dengan baik!");
      } else {
        feedback.push("Langkah lab belum lengkap.");
      }
      break;
    }
  }

  const passed = score >= 70;

  return {
    passed,
    score,
    maxScore,
    feedback,
  };
}
