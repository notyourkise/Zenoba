/**
 * Pure Deterministic IPv4 and Subnetting Engine
 * Completely framework-independent calculation library.
 */

export interface SubnetDetails {
  ip: string;
  prefix: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: "A" | "B" | "C" | "D" | "E";
  isPrivate: boolean;
  binaryIp: string;
  binaryMask: string;
  calculationSteps: string[];
}

export interface VlsmDepartmentReq {
  name: string;
  requiredHosts: number;
}

export interface VlsmAllocatedSubnet {
  department: string;
  requiredHosts: number;
  allocatedHosts: number;
  networkAddress: string;
  prefix: number;
  subnetMask: string;
  firstUsableHost: string;
  lastUsableHost: string;
  broadcastAddress: string;
}

export interface VlsmResult {
  baseNetwork: string;
  basePrefix: number;
  subnets: VlsmAllocatedSubnet[];
  totalAllocatedIps: number;
  fitsInBase: boolean;
}

export function isValidIpv4(ip: string): boolean {
  if (typeof ip !== "string") return false;
  const octets = ip.trim().split(".");
  if (octets.length !== 4) return false;

  for (const oct of octets) {
    if (!/^\d+$/.test(oct)) return false;
    const num = Number(oct);
    if (num < 0 || num > 255) return false;
    // Disallow leading zeros except for '0' itself
    if (oct.length > 1 && oct.startsWith("0")) return false;
  }
  return true;
}

export function isValidPrefix(prefix: number): boolean {
  return Number.isInteger(prefix) && prefix >= 0 && prefix <= 32;
}

export function ipToLong(ip: string): number {
  if (!isValidIpv4(ip)) throw new Error(`Invalid IPv4 address: ${ip}`);
  return (
    ip
      .split(".")
      .reduce((acc, oct) => ((acc << 8) + Number(oct)) >>> 0, 0) >>> 0
  );
}

export function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join(".");
}

export function prefixToSubnetMask(prefix: number): string {
  if (!isValidPrefix(prefix)) throw new Error(`Invalid prefix: /${prefix}`);
  if (prefix === 0) return "0.0.0.0";
  const maskLong = ((0xffffffff << (32 - prefix)) >>> 0) >>> 0;
  return longToIp(maskLong);
}

export function subnetMaskToPrefix(mask: string): number {
  if (!isValidIpv4(mask)) throw new Error(`Invalid subnet mask: ${mask}`);
  const maskLong = ipToLong(mask);
  const binary = (maskLong >>> 0).toString(2).padStart(32, "0");
  if (binary.includes("01")) {
    throw new Error(`Non-contiguous subnet mask: ${mask}`);
  }
  return binary.split("1").length - 1;
}

export function ipToBinary(ip: string): string {
  if (!isValidIpv4(ip)) throw new Error(`Invalid IPv4 address: ${ip}`);
  return ip
    .split(".")
    .map((oct) => Number(oct).toString(2).padStart(8, "0"))
    .join(".");
}

export function binaryToIp(binary: string): string {
  const clean = binary.replace(/\s+/g, "").split(".");
  if (clean.length !== 4) throw new Error(`Invalid binary IPv4: ${binary}`);
  return clean.map((b) => parseInt(b, 2)).join(".");
}

export function getIpClass(ip: string): "A" | "B" | "C" | "D" | "E" {
  const firstOctet = Number(ip.split(".")[0]);
  if (firstOctet >= 1 && firstOctet <= 126) return "A";
  if (firstOctet >= 128 && firstOctet <= 191) return "B";
  if (firstOctet >= 192 && firstOctet <= 223) return "C";
  if (firstOctet >= 224 && firstOctet <= 239) return "D";
  return "E";
}

export function isPrivateIp(ip: string): boolean {
  const octets = ip.split(".").map(Number);
  // 10.0.0.0 - 10.255.255.255
  if (octets[0] === 10) return true;
  // 172.16.0.0 - 172.31.255.255
  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
  // 192.168.0.0 - 192.168.255.255
  if (octets[0] === 192 && octets[1] === 168) return true;
  return false;
}

export function calculateSubnetDetails(ip: string, prefix: number): SubnetDetails {
  if (!isValidIpv4(ip)) throw new Error(`Invalid IPv4 address: ${ip}`);
  if (!isValidPrefix(prefix)) throw new Error(`Invalid prefix: /${prefix}`);

  const ipLong = ipToLong(ip);
  const maskLong = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;

  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const networkAddress = longToIp(networkLong);
  const broadcastAddress = longToIp(broadcastLong);
  const subnetMask = longToIp(maskLong);
  const wildcardMask = longToIp(wildcardLong);

  const totalHosts = prefix === 32 ? 1 : Math.pow(2, 32 - prefix);
  let usableHosts = 0;
  let firstUsableHost = "";
  let lastUsableHost = "";

  if (prefix === 32) {
    usableHosts = 1;
    firstUsableHost = networkAddress;
    lastUsableHost = networkAddress;
  } else if (prefix === 31) {
    // RFC 3021 point-to-point
    usableHosts = 2;
    firstUsableHost = networkAddress;
    lastUsableHost = broadcastAddress;
  } else {
    usableHosts = Math.max(0, totalHosts - 2);
    firstUsableHost = longToIp(networkLong + 1);
    lastUsableHost = longToIp(broadcastLong - 1);
  }

  const hostBits = 32 - prefix;
  const calculationSteps = [
    `1. Prefix /${prefix} memberikan ${prefix} bit Network dan ${hostBits} bit Host.`,
    `2. Subnet Mask adalah ${subnetMask} (Biner: ${ipToBinary(subnetMask)}).`,
    `3. Network ID diperoleh dari operasi bitwise AND antara IP (${ip}) dan Mask: ${networkAddress}.`,
    `4. Total alamat IP per subnet = 2^${hostBits} = ${totalHosts}.`,
    `5. Alamat Broadcast (alamat tertinggi) = ${broadcastAddress}.`,
    `6. Rentang Host yang dapat digunakan = ${firstUsableHost} s/d ${lastUsableHost} (${usableHosts} host usable).`,
  ];

  return {
    ip,
    prefix,
    subnetMask,
    wildcardMask,
    networkAddress,
    broadcastAddress,
    firstUsableHost,
    lastUsableHost,
    totalHosts,
    usableHosts,
    ipClass: getIpClass(ip),
    isPrivate: isPrivateIp(ip),
    binaryIp: ipToBinary(ip),
    binaryMask: ipToBinary(subnetMask),
    calculationSteps,
  };
}

export function isIpInSubnet(ip: string, networkIp: string, prefix: number): boolean {
  if (!isValidIpv4(ip) || !isValidIpv4(networkIp) || !isValidPrefix(prefix)) return false;
  const ipLong = ipToLong(ip);
  const netLong = ipToLong(networkIp);
  const maskLong = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0) >>> 0;
  return (ipLong & maskLong) === (netLong & maskLong);
}

/**
 * Variable Length Subnet Masking (VLSM) Calculator
 * Sorts host requirements descending, allocates optimal prefixes, and advances network base.
 */
export function calculateVlsm(
  baseNetwork: string,
  basePrefix: number,
  requirements: VlsmDepartmentReq[]
): VlsmResult {
  if (!isValidIpv4(baseNetwork)) throw new Error(`Invalid base network: ${baseNetwork}`);
  if (!isValidPrefix(basePrefix)) throw new Error(`Invalid base prefix: /${basePrefix}`);

  const sortedReqs = [...requirements].sort((a, b) => b.requiredHosts - a.requiredHosts);
  const baseCapacity = Math.pow(2, 32 - basePrefix);

  let currentIpLong = ipToLong(baseNetwork);
  let totalAllocated = 0;
  const subnets: VlsmAllocatedSubnet[] = [];

  for (const req of sortedReqs) {
    // Need requiredHosts + 2 (Network + Broadcast)
    let neededBits = 1;
    while (Math.pow(2, neededBits) - 2 < req.requiredHosts) {
      neededBits++;
    }
    // ensure at least 2 bits (4 IPs /30)
    neededBits = Math.max(2, neededBits);
    const prefix = 32 - neededBits;
    const allocatedHosts = Math.pow(2, neededBits) - 2;
    const subnetSize = Math.pow(2, neededBits);

    const netAddress = longToIp(currentIpLong);
    const details = calculateSubnetDetails(netAddress, prefix);

    subnets.push({
      department: req.name,
      requiredHosts: req.requiredHosts,
      allocatedHosts,
      networkAddress: details.networkAddress,
      prefix,
      subnetMask: details.subnetMask,
      firstUsableHost: details.firstUsableHost,
      lastUsableHost: details.lastUsableHost,
      broadcastAddress: details.broadcastAddress,
    });

    currentIpLong = (currentIpLong + subnetSize) >>> 0;
    totalAllocated += subnetSize;
  }

  const fitsInBase = totalAllocated <= baseCapacity;

  return {
    baseNetwork,
    basePrefix,
    subnets,
    totalAllocatedIps: totalAllocated,
    fitsInBase,
  };
}
