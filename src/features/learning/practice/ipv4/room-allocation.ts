/**
 * Deterministic Evaluator for Path 2 Final Capstone:
 * School Multi-Room Subnet Allocation Challenge (school-room-allocation-final)
 */

import {
  calculateSubnetDetails,
  isValidIpv4,
  isValidPrefix,
  ipToLong,
  isIpInSubnet,
} from "@/features/network-logic/ipv4/ipv4";

export interface RoomRequirement {
  id: string;
  name: string;
  minHosts: number;
}

export const SCHOOL_ROOM_REQUIREMENTS: RoomRequirement[] = [
  { id: "lab-tkj", name: "Lab Komputer TKJ", minHosts: 50 },
  { id: "ruang-guru", name: "Ruang Guru & Staff", minHosts: 25 },
  { id: "ruang-tu", name: "Ruang Tata Usaha (TU)", minHosts: 12 },
  { id: "server-mgmt", name: "Server & Manajemen Jaringan", minHosts: 5 },
  { id: "link-p2p", name: "Link Point-to-Point Router-ke-Firewall", minHosts: 2 },
];

export interface RoomAllocationInput {
  roomId: string;
  roomName: string;
  requiredHosts: number;
  prefix: number;
  networkAddress: string;
  gateway: string;
  broadcastAddress: string;
}

export interface SchoolRoomAllocationSubmission {
  baseNetwork: string; // e.g. "192.168.10.0/24"
  allocations: RoomAllocationInput[];
}

export interface AllocationCriterionResult {
  id: string;
  title: string;
  passed: boolean;
  feedback: string;
}

export interface SchoolRoomAllocationEvaluation {
  passed: boolean;
  score: number;
  maxScore: number;
  criteriaResults: AllocationCriterionResult[];
  unmetOutcomes: string[];
  feedback: string[];
  roomDetails: Array<{
    roomId: string;
    roomName: string;
    passed: boolean;
    errors: string[];
    capacity: number;
  }>;
}

/**
 * Evaluates student's multi-room subnet allocation against deterministic rules:
 * 1. CAPACITY: Host capacity >= required for every room.
 * 2. CONSISTENCY: Network ID, Broadcast, and Mask mathematically correct for assigned prefix.
 * 3. GATEWAY: Gateway within first-usable to last-usable range.
 * 4. NO_OVERLAP: No two subnets have overlapping IP ranges.
 * 5. BASE_CONTAINMENT: All subnets fall within 192.168.10.0/24.
 */
export function evaluateSchoolRoomAllocation(
  submission: SchoolRoomAllocationSubmission
): SchoolRoomAllocationEvaluation {
  const feedback: string[] = [];
  const unmetOutcomes: string[] = [];
  const criteriaResults: AllocationCriterionResult[] = [];

  const baseNetwork = submission.baseNetwork || "192.168.10.0/24";
  const [baseIp, basePrefixStr] = baseNetwork.split("/");
  const basePrefix = Number(basePrefixStr) || 24;

  const allocations = submission.allocations || [];

  // Check 1: Completeness of all 5 rooms
  const requiredIds = SCHOOL_ROOM_REQUIREMENTS.map((r) => r.id);
  const submittedIds = new Set(allocations.map((a) => a.roomId));
  const missingRooms = requiredIds.filter((id) => !submittedIds.has(id));

  let capacityPassed = missingRooms.length === 0;
  let consistencyPassed = true;
  let gatewayPassed = true;
  let baseContainmentPassed = true;

  const roomDetails = [];
  const parsedIntervals: Array<{
    roomId: string;
    name: string;
    startLong: number;
    endLong: number;
  }> = [];

  for (const req of SCHOOL_ROOM_REQUIREMENTS) {
    const alloc = allocations.find((a) => a.roomId === req.id);
    const roomErrors: string[] = [];
    let capacity = 0;

    if (!alloc) {
      roomErrors.push(`Ruangan '${req.name}' belum dikonfigurasi.`);
      roomDetails.push({
        roomId: req.id,
        roomName: req.name,
        passed: false,
        errors: roomErrors,
        capacity: 0,
      });
      continue;
    }

    // Validate IP syntax
    if (!isValidIpv4(alloc.networkAddress)) {
      roomErrors.push(`Network ID '${alloc.networkAddress}' bukan alamat IPv4 yang valid.`);
      consistencyPassed = false;
    }
    if (!isValidPrefix(alloc.prefix)) {
      roomErrors.push(`Prefix /${alloc.prefix} tidak valid.`);
      consistencyPassed = false;
    }
    if (!isValidIpv4(alloc.gateway)) {
      roomErrors.push(`Gateway IP '${alloc.gateway}' bukan alamat IPv4 yang valid.`);
      gatewayPassed = false;
    }
    if (!isValidIpv4(alloc.broadcastAddress)) {
      roomErrors.push(`Broadcast '${alloc.broadcastAddress}' bukan alamat IPv4 yang valid.`);
      consistencyPassed = false;
    }

    if (
      isValidIpv4(alloc.networkAddress) &&
      isValidPrefix(alloc.prefix) &&
      isValidIpv4(alloc.broadcastAddress)
    ) {
      const details = calculateSubnetDetails(alloc.networkAddress, alloc.prefix);
      capacity = details.usableHosts;

      // 1. Capacity check
      if (details.usableHosts < req.minHosts) {
        roomErrors.push(
          `Kapasitas host /${alloc.prefix} (${details.usableHosts} host) tidak mencukupi kebutuhan minimum (${req.minHosts} host).`
        );
        capacityPassed = false;
      }

      // 2. Network ID check
      if (alloc.networkAddress !== details.networkAddress) {
        roomErrors.push(
          `Network ID '${alloc.networkAddress}' tidak valid untuk /${alloc.prefix}. Seharusnya '${details.networkAddress}'.`
        );
        consistencyPassed = false;
      }

      // 3. Broadcast check
      if (alloc.broadcastAddress !== details.broadcastAddress) {
        roomErrors.push(
          `Broadcast '${alloc.broadcastAddress}' tidak valid untuk /${alloc.prefix}. Seharusnya '${details.broadcastAddress}'.`
        );
        consistencyPassed = false;
      }

      // 4. Gateway check
      if (isValidIpv4(alloc.gateway)) {
        const isGwInSubnet = isIpInSubnet(alloc.gateway, details.networkAddress, alloc.prefix);
        const isGwNet = alloc.gateway === details.networkAddress;
        const isGwBcast = alloc.gateway === details.broadcastAddress;

        if (!isGwInSubnet || isGwNet || isGwBcast) {
          roomErrors.push(
            `Gateway '${alloc.gateway}' tidak berada dalam rentang usable host (${details.firstUsableHost} s/d ${details.lastUsableHost}).`
          );
          gatewayPassed = false;
        }
      }

      // 5. Base network containment check
      const isNetInBase = isIpInSubnet(alloc.networkAddress, baseIp, basePrefix);
      const isBcastInBase = isIpInSubnet(alloc.broadcastAddress, baseIp, basePrefix);
      if (!isNetInBase || !isBcastInBase) {
        roomErrors.push(
          `Subnet '${alloc.networkAddress}/${alloc.prefix}' berada di luar alokasi jaringan induk ${baseNetwork}.`
        );
        baseContainmentPassed = false;
      }

      // Record interval for overlap check
      try {
        parsedIntervals.push({
          roomId: req.id,
          name: req.name,
          startLong: ipToLong(details.networkAddress),
          endLong: ipToLong(details.broadcastAddress),
        });
      } catch {
        // syntax error already caught
      }
    }

    roomDetails.push({
      roomId: req.id,
      roomName: req.name,
      passed: roomErrors.length === 0,
      errors: roomErrors,
      capacity,
    });
  }

  // Check Overlap
  let noOverlapPassed = true;
  const overlapErrors: string[] = [];

  for (let i = 0; i < parsedIntervals.length; i++) {
    for (let j = i + 1; j < parsedIntervals.length; j++) {
      const a = parsedIntervals[i];
      const b = parsedIntervals[j];

      // Overlap condition: startA <= endB && startB <= endA
      if (a.startLong <= b.endLong && b.startLong <= a.endLong) {
        noOverlapPassed = false;
        overlapErrors.push(
          `Subnet ruangan '${a.name}' tumpang tindih (overlap) dengan ruangan '${b.name}'.`
        );
      }
    }
  }

  // Compile Criteria Results
  criteriaResults.push({
    id: "CAPACITY",
    title: "Kapasitas Host Usable Memenuhi Kebutuhan",
    passed: capacityPassed,
    feedback: capacityPassed
      ? "Seluruh ruangan mendapatkan alokasi prefix dengan jumlah usable host yang mencukupi."
      : "Sebagian ruangan memiliki kapasitas usable host di bawah batas kebutuhan minimum.",
  });

  criteriaResults.push({
    id: "CONSISTENCY",
    title: "Konsistensi Matematis Network ID & Broadcast",
    passed: consistencyPassed,
    feedback: consistencyPassed
      ? "Network ID dan Broadcast Address untuk seluruh prefix dihitung secara tepat."
      : "Terdapat kesalahan perhitungan Network ID atau Broadcast Address pada satu atau lebih ruangan.",
  });

  criteriaResults.push({
    id: "GATEWAY",
    title: "Gateway Valid dalam Rentang Usable Host",
    passed: gatewayPassed,
    feedback: gatewayPassed
      ? "Seluruh Default Gateway berada di dalam rentang usable host (bukan Network ID atau Broadcast)."
      : "Terdapat gateway yang berada di luar rentang host atau menggunakan alamat terlarang.",
  });

  criteriaResults.push({
    id: "NO_OVERLAP",
    title: "Bebas Tumpang Tindih (Zero Overlap)",
    passed: noOverlapPassed,
    feedback: noOverlapPassed
      ? "Tidak ditemukan tumpang tindih rentang IP antar-ruangan (alokasi VLSM terisolasi rapi)."
      : overlapErrors.join(" "),
  });

  criteriaResults.push({
    id: "BASE_CONTAINMENT",
    title: "Berada dalam Batas Alokasi Induk",
    passed: baseContainmentPassed,
    feedback: baseContainmentPassed
      ? `Seluruh subnet berada di dalam batas blok jaringan sekolah (${baseNetwork}).`
      : `Terdapat subnet yang melampaui batas ruang alamat jaringan induk ${baseNetwork}.`,
  });

  for (const crit of criteriaResults) {
    if (!crit.passed) {
      unmetOutcomes.push(`P2-OUT-${crit.id}`);
      feedback.push(`[${crit.id}] ${crit.feedback}`);
    }
  }

  const allPassed =
    capacityPassed &&
    consistencyPassed &&
    gatewayPassed &&
    noOverlapPassed &&
    baseContainmentPassed;

  let passedCount = 0;
  if (capacityPassed) passedCount += 25;
  if (consistencyPassed) passedCount += 25;
  if (gatewayPassed) passedCount += 20;
  if (noOverlapPassed) passedCount += 20;
  if (baseContainmentPassed) passedCount += 10;

  return {
    passed: allPassed,
    score: passedCount,
    maxScore: 100,
    criteriaResults,
    unmetOutcomes,
    feedback: allPassed
      ? [
          "Selamat! Desain alokasi subnetting VLSM sekolah Anda sempurna tanpa tumpang tindih dan memenuhi seluruh kapasitas host.",
        ]
      : feedback,
    roomDetails,
  };
}
