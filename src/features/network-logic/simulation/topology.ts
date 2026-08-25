/**
 * Pure Deterministic Logical Simulation Model (Layer 2 & Layer 3)
 * Provides foundational simulation evaluation for switching, VLANs, and routing.
 */

import { isIpInSubnet, isValidIpv4, isValidPrefix } from "../ipv4/ipv4";

export interface SimInterface {
  id: string;
  name: string;
  macAddress: string;
  ipAddress?: string;
  prefix?: number;
  mode: "access" | "trunk";
  vlanId: number; // For access port or native VLAN on trunk
  allowedVlans?: number[]; // For trunk port
}

export interface SimDevice {
  id: string;
  name: string;
  type: "pc" | "server" | "switch" | "router";
  interfaces: SimInterface[];
}

export interface SimLink {
  id: string;
  deviceAId: string;
  interfaceAId: string;
  deviceBId: string;
  interfaceBId: string;
}

export interface SimRoute {
  id: string;
  destinationSubnet: string;
  prefix: number;
  nextHopIp: string; // "DIRECT" for connected interfaces or IP string
  interfaceName: string;
  metric: number;
  isDefault?: boolean;
}

/**
 * Deterministic Layer 2 VLAN Reachability Evaluation
 */
export function evaluateL2Reachability(
  srcIface: SimInterface,
  dstIface: SimInterface,
  trunkLink?: { allowedVlans: number[] }
): { reachable: boolean; reason: string } {
  // If source and dest are on different VLANs
  if (srcIface.vlanId !== dstIface.vlanId) {
    return {
      reachable: false,
      reason: `Isolasi VLAN aktif: Port sumber berada di VLAN ${srcIface.vlanId}, sedangkan port tujuan berada di VLAN ${dstIface.vlanId}. Dibutuhkan Router/L3 Switch untuk Inter-VLAN routing.`,
    };
  }

  // If passing through a trunk link, check if the VLAN is permitted
  if (trunkLink) {
    if (!trunkLink.allowedVlans.includes(srcIface.vlanId)) {
      return {
        reachable: false,
        reason: `Trunk link memblokir VLAN ${srcIface.vlanId}. VLAN tidak terdaftar dalam Allowed VLANs list.`,
      };
    }
  }

  return {
    reachable: true,
    reason: `Frame L2 berhasil dikirim dalam broadcast domain yang sama (VLAN ${srcIface.vlanId}).`,
  };
}

/**
 * Deterministic Layer 3 Longest Prefix Match (LPM) Routing Evaluation
 */
export function evaluateL3Routing(
  destIp: string,
  routes: SimRoute[]
): {
  matchedRoute: SimRoute | null;
  nextHop: string | null;
  action: "DIRECT_DELIVERY" | "FORWARD" | "DROP";
  reason: string;
} {
  if (!isValidIpv4(destIp)) {
    return {
      matchedRoute: null,
      nextHop: null,
      action: "DROP",
      reason: `Alamat tujuan IP (${destIp}) tidak valid.`,
    };
  }

  // Find all matching routes
  const matchingRoutes = routes.filter((r) => {
    if (r.isDefault || (r.destinationSubnet === "0.0.0.0" && r.prefix === 0)) {
      return true;
    }
    if (isValidIpv4(r.destinationSubnet) && isValidPrefix(r.prefix)) {
      return isIpInSubnet(destIp, r.destinationSubnet, r.prefix);
    }
    return false;
  });

  if (matchingRoutes.length === 0) {
    return {
      matchedRoute: null,
      nextHop: null,
      action: "DROP",
      reason: `Destination Host Unreachable: Tidak ditemukan rute yang cocok untuk ${destIp} dalam routing table.`,
    };
  }

  // Sort by Longest Prefix Match (prefix descending), then lowest metric
  matchingRoutes.sort((a, b) => {
    if (b.prefix !== a.prefix) return b.prefix - a.prefix;
    return a.metric - b.metric;
  });

  const bestRoute = matchingRoutes[0];

  if (bestRoute.nextHopIp === "DIRECT") {
    return {
      matchedRoute: bestRoute,
      nextHop: destIp,
      action: "DIRECT_DELIVERY",
      reason: `Directly Connected Network: Paket dikirim langsung ke host tujuan via interface ${bestRoute.interfaceName} (Prefix /${bestRoute.prefix}).`,
    };
  }

  return {
    matchedRoute: bestRoute,
    nextHop: bestRoute.nextHopIp,
    action: "FORWARD",
    reason: `Paket diteruskan ke Next Hop Gateway ${bestRoute.nextHopIp} via interface ${bestRoute.interfaceName} berdasarkan kecocokan prefix /${bestRoute.prefix}.`,
  };
}
