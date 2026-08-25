import { describe, expect, it } from "vitest";
import {
  isValidIpv4,
  isValidPrefix,
  prefixToSubnetMask,
  subnetMaskToPrefix,
  ipToBinary,
  binaryToIp,
  calculateSubnetDetails,
  isIpInSubnet,
  calculateVlsm,
  isPrivateIp,
  getIpClass,
} from "./ipv4";

describe("IPv4 Pure Domain Engine", () => {
  describe("Validation & Conversions", () => {
    it("validates IPv4 addresses correctly", () => {
      expect(isValidIpv4("192.168.1.1")).toBe(true);
      expect(isValidIpv4("10.0.0.0")).toBe(true);
      expect(isValidIpv4("0.0.0.0")).toBe(true);
      expect(isValidIpv4("255.255.255.255")).toBe(true);

      expect(isValidIpv4("192.168.1.256")).toBe(false);
      expect(isValidIpv4("192.168.1")).toBe(false);
      expect(isValidIpv4("192.168.01.1")).toBe(false); // leading zero disallowed
      expect(isValidIpv4("abc.def.ghi.jkl")).toBe(false);
      expect(isValidIpv4("")).toBe(false);
    });

    it("validates prefix numbers", () => {
      expect(isValidPrefix(0)).toBe(true);
      expect(isValidPrefix(24)).toBe(true);
      expect(isValidPrefix(32)).toBe(true);
      expect(isValidPrefix(-1)).toBe(false);
      expect(isValidPrefix(33)).toBe(false);
      expect(isValidPrefix(24.5)).toBe(false);
    });

    it("converts prefix to subnet mask and vice versa", () => {
      expect(prefixToSubnetMask(8)).toBe("255.0.0.0");
      expect(prefixToSubnetMask(16)).toBe("255.255.0.0");
      expect(prefixToSubnetMask(24)).toBe("255.255.255.0");
      expect(prefixToSubnetMask(26)).toBe("255.255.255.192");
      expect(prefixToSubnetMask(30)).toBe("255.255.255.252");
      expect(prefixToSubnetMask(32)).toBe("255.255.255.255");

      expect(subnetMaskToPrefix("255.255.255.0")).toBe(24);
      expect(subnetMaskToPrefix("255.255.255.192")).toBe(26);
      expect(subnetMaskToPrefix("255.255.255.252")).toBe(30);
    });

    it("converts between IP and 32-bit binary notation", () => {
      expect(ipToBinary("192.168.1.1")).toBe("11000000.10101000.00000001.00000001");
      expect(binaryToIp("11000000.10101000.00000001.00000001")).toBe("192.168.1.1");
    });

    it("detects IP classes and private IP ranges", () => {
      expect(getIpClass("10.0.0.1")).toBe("A");
      expect(getIpClass("172.16.5.1")).toBe("B");
      expect(getIpClass("192.168.1.1")).toBe("C");
      expect(getIpClass("224.0.0.1")).toBe("D");

      expect(isPrivateIp("10.5.10.1")).toBe(true);
      expect(isPrivateIp("172.20.1.1")).toBe(true);
      expect(isPrivateIp("192.168.100.5")).toBe(true);
      expect(isPrivateIp("8.8.8.8")).toBe(false);
      expect(isPrivateIp("1.1.1.1")).toBe(false);
    });
  });

  describe("Subnet Calculation", () => {
    it("calculates standard /24 subnet accurately", () => {
      const result = calculateSubnetDetails("192.168.1.50", 24);

      expect(result.networkAddress).toBe("192.168.1.0");
      expect(result.broadcastAddress).toBe("192.168.1.255");
      expect(result.firstUsableHost).toBe("192.168.1.1");
      expect(result.lastUsableHost).toBe("192.168.1.254");
      expect(result.totalHosts).toBe(256);
      expect(result.usableHosts).toBe(254);
      expect(result.subnetMask).toBe("255.255.255.0");
      expect(result.wildcardMask).toBe("0.0.0.255");
    });

    it("calculates custom /26 subnet accurately", () => {
      const result = calculateSubnetDetails("192.168.1.130", 26);

      expect(result.networkAddress).toBe("192.168.1.128");
      expect(result.broadcastAddress).toBe("192.168.1.191");
      expect(result.firstUsableHost).toBe("192.168.1.129");
      expect(result.lastUsableHost).toBe("192.168.1.190");
      expect(result.totalHosts).toBe(64);
      expect(result.usableHosts).toBe(62);
      expect(result.subnetMask).toBe("255.255.255.192");
    });

    it("calculates point-to-point /30 subnet accurately", () => {
      const result = calculateSubnetDetails("10.0.0.5", 30);

      expect(result.networkAddress).toBe("10.0.0.4");
      expect(result.broadcastAddress).toBe("10.0.0.7");
      expect(result.firstUsableHost).toBe("10.0.0.5");
      expect(result.lastUsableHost).toBe("10.0.0.6");
      expect(result.totalHosts).toBe(4);
      expect(result.usableHosts).toBe(2);
    });

    it("verifies subnet membership with isIpInSubnet", () => {
      expect(isIpInSubnet("192.168.1.55", "192.168.1.0", 24)).toBe(true);
      expect(isIpInSubnet("192.168.2.55", "192.168.1.0", 24)).toBe(false);
      expect(isIpInSubnet("192.168.1.65", "192.168.1.0", 26)).toBe(false); // 65 belongs to 192.168.1.64/26
      expect(isIpInSubnet("192.168.1.65", "192.168.1.64", 26)).toBe(true);
    });
  });

  describe("VLSM Allocation", () => {
    it("allocates multi-department subnets in descending host order", () => {
      const vlsm = calculateVlsm("192.168.10.0", 24, [
        { name: "Sales", requiredHosts: 50 },
        { name: "IT", requiredHosts: 25 },
        { name: "HR", requiredHosts: 10 },
        { name: "Router Link", requiredHosts: 2 },
      ]);

      expect(vlsm.fitsInBase).toBe(true);
      expect(vlsm.subnets).toHaveLength(4);

      // 1. Sales (50 hosts -> /26, 62 usable)
      expect(vlsm.subnets[0].department).toBe("Sales");
      expect(vlsm.subnets[0].prefix).toBe(26);
      expect(vlsm.subnets[0].networkAddress).toBe("192.168.10.0");
      expect(vlsm.subnets[0].broadcastAddress).toBe("192.168.10.63");

      // 2. IT (25 hosts -> /27, 30 usable)
      expect(vlsm.subnets[1].department).toBe("IT");
      expect(vlsm.subnets[1].prefix).toBe(27);
      expect(vlsm.subnets[1].networkAddress).toBe("192.168.10.64");
      expect(vlsm.subnets[1].broadcastAddress).toBe("192.168.10.95");

      // 3. HR (10 hosts -> /28, 14 usable)
      expect(vlsm.subnets[2].department).toBe("HR");
      expect(vlsm.subnets[2].prefix).toBe(28);
      expect(vlsm.subnets[2].networkAddress).toBe("192.168.10.96");
      expect(vlsm.subnets[2].broadcastAddress).toBe("192.168.10.111");

      // 4. Router Link (2 hosts -> /30, 2 usable)
      expect(vlsm.subnets[3].department).toBe("Router Link");
      expect(vlsm.subnets[3].prefix).toBe(30);
      expect(vlsm.subnets[3].networkAddress).toBe("192.168.10.112");
      expect(vlsm.subnets[3].broadcastAddress).toBe("192.168.10.115");
    });
  });
});
