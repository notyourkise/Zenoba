import { describe, expect, it } from "vitest";
import { evaluateL2Reachability, evaluateL3Routing, SimInterface, SimRoute } from "./topology";

describe("Layer 2 & Layer 3 Simulation Primitives", () => {
  describe("VLAN & Layer 2 Reachability", () => {
    it("allows frame transfer when both interfaces share the same VLAN", () => {
      const port1: SimInterface = {
        id: "p1",
        name: "FastEthernet 0/1",
        macAddress: "00:AA:BB:CC:DD:01",
        mode: "access",
        vlanId: 10,
      };

      const port2: SimInterface = {
        id: "p2",
        name: "FastEthernet 0/2",
        macAddress: "00:AA:BB:CC:DD:02",
        mode: "access",
        vlanId: 10,
      };

      const result = evaluateL2Reachability(port1, port2);
      expect(result.reachable).toBe(true);
    });

    it("blocks frame transfer when interfaces are in different VLANs", () => {
      const port1: SimInterface = {
        id: "p1",
        name: "FastEthernet 0/1",
        macAddress: "00:AA:BB:CC:DD:01",
        mode: "access",
        vlanId: 10, // Sales
      };

      const port2: SimInterface = {
        id: "p2",
        name: "FastEthernet 0/2",
        macAddress: "00:AA:BB:CC:DD:02",
        mode: "access",
        vlanId: 20, // Engineering
      };

      const result = evaluateL2Reachability(port1, port2);
      expect(result.reachable).toBe(false);
      expect(result.reason).toContain("Isolasi VLAN");
    });

    it("evaluates trunk link allowed VLAN restrictions", () => {
      const port1: SimInterface = {
        id: "p1",
        name: "Fa0/1",
        macAddress: "00:11:22:33:44:01",
        mode: "access",
        vlanId: 30,
      };

      const port2: SimInterface = {
        id: "p2",
        name: "Fa0/2",
        macAddress: "00:11:22:33:44:02",
        mode: "access",
        vlanId: 30,
      };

      // Trunk only allows VLAN 10 and 20
      const trunk = { allowedVlans: [10, 20] };
      const result = evaluateL2Reachability(port1, port2, trunk);

      expect(result.reachable).toBe(false);
      expect(result.reason).toContain("Trunk link memblokir VLAN 30");
    });
  });

  describe("Layer 3 Routing Table & Longest Prefix Match", () => {
    const routingTable: SimRoute[] = [
      {
        id: "r1",
        destinationSubnet: "192.168.1.0",
        prefix: 24,
        nextHopIp: "DIRECT",
        interfaceName: "GigabitEthernet 0/0",
        metric: 0,
      },
      {
        id: "r2",
        destinationSubnet: "10.0.0.0",
        prefix: 8,
        nextHopIp: "192.168.1.254",
        interfaceName: "GigabitEthernet 0/0",
        metric: 1,
      },
      {
        id: "r3",
        destinationSubnet: "10.50.0.0",
        prefix: 16, // More specific than /8
        nextHopIp: "192.168.1.250",
        interfaceName: "GigabitEthernet 0/0",
        metric: 1,
      },
      {
        id: "r4",
        destinationSubnet: "0.0.0.0",
        prefix: 0,
        nextHopIp: "203.0.113.1",
        interfaceName: "Serial 0/0/0",
        metric: 10,
        isDefault: true,
      },
    ];

    it("chooses direct delivery for connected network", () => {
      const result = evaluateL3Routing("192.168.1.55", routingTable);
      expect(result.action).toBe("DIRECT_DELIVERY");
      expect(result.matchedRoute?.id).toBe("r1");
    });

    it("prefers longest prefix match (/16 over /8)", () => {
      const result = evaluateL3Routing("10.50.10.5", routingTable);
      expect(result.action).toBe("FORWARD");
      expect(result.matchedRoute?.id).toBe("r3"); // /16 wins over /8
      expect(result.nextHop).toBe("192.168.1.250");
    });

    it("falls back to default route when no specific route matches", () => {
      const result = evaluateL3Routing("8.8.8.8", routingTable);
      expect(result.action).toBe("FORWARD");
      expect(result.matchedRoute?.id).toBe("r4");
      expect(result.nextHop).toBe("203.0.113.1");
    });

    it("drops packet if destination IP is invalid", () => {
      const result = evaluateL3Routing("999.999.999.999", routingTable);
      expect(result.action).toBe("DROP");
    });
  });
});
