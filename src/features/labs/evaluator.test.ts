import { describe, expect, it } from "vitest";
import { evaluateLabSubmission } from "./evaluator";

describe("Lab Engine Pure Evaluator", () => {
  it("evaluates subnetting calculator lab correctly", () => {
    const result = evaluateLabSubmission("subnetting-calculator", {
      ip: "192.168.1.130",
      prefix: 26,
      networkAddress: "192.168.1.128",
      broadcastAddress: "192.168.1.191",
      usableHosts: 62,
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback).toHaveLength(3);
  });

  it("evaluates ip configuration lab correctly", () => {
    const result = evaluateLabSubmission("ip-configuration", {
      pcIp: "192.168.10.15",
      subnetMask: "255.255.255.0",
      gateway: "192.168.10.1",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("evaluates vlan segmentation lab correctly", () => {
    const result = evaluateLabSubmission("vlan-segmentation", {
      port1Vlan: 10,
      port2Vlan: 10,
      port3Vlan: 20,
      port4Vlan: 20,
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("evaluates static routing lab correctly", () => {
    const result = evaluateLabSubmission("static-routing", {
      destination: "0.0.0.0",
      prefix: 0,
      nextHop: "192.168.1.254",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("fails when configuration is invalid", () => {
    const result = evaluateLabSubmission("static-routing", {
      destination: "10.0.0.0",
      prefix: 8,
      nextHop: "1.1.1.1",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
  });
});
