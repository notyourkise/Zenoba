import { describe, it, expect } from "vitest";
import { evaluateNamedServiceOutage } from "./named-service-outage";

describe("Path 4 Final Capstone: Enterprise Named-Service Outage Evaluator", () => {
  it("evaluates a perfect submission with full 100 score and passed = true", () => {
    const result = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "192.168.1.10",
      natOverloadEnabled: true,
      transportOutageReasonOption: "port-blocked-or-service-down",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.maxScore).toBe(100);
    expect(result.unmetOutcomes).toHaveLength(0);
    expect(result.criteriaResults).toHaveLength(4);
    expect(result.criteriaResults.every((c) => c.passed)).toBe(true);
  });

  it("accepts public DNS servers (8.8.8.8, 1.1.1.1) as valid DNS resolver options", () => {
    const resultGoogle = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "8.8.8.8",
      natOverloadEnabled: true,
      transportOutageReasonOption: "port-blocked-or-service-down",
    });
    expect(resultGoogle.passed).toBe(true);
    expect(resultGoogle.score).toBe(100);

    const resultCloudflare = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "1.1.1.1",
      natOverloadEnabled: true,
      transportOutageReasonOption: "port-blocked-or-service-down",
    });
    expect(resultCloudflare.passed).toBe(true);
    expect(resultCloudflare.score).toBe(100);
  });

  it("passes when achieving 75 points (3 out of 4 criteria met, threshold >= 70)", () => {
    const result = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "192.168.1.10",
      natOverloadEnabled: true,
      transportOutageReasonOption: "cable-transmits-icmp-only", // wrong conceptual answer
    });

    expect(result.score).toBe(75);
    expect(result.passed).toBe(true);
    expect(result.unmetOutcomes).toContain("TRN-M2");
  });

  it("fails when achieving only 50 points (2 out of 4 criteria met, threshold >= 70)", () => {
    const result = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.1",
      dhcpDnsServer: "192.168.1.10",
      natOverloadEnabled: false, // NAT not enabled
      transportOutageReasonOption: "mac-address-table-full", // wrong answer
    });

    expect(result.score).toBe(50);
    expect(result.passed).toBe(false);
    expect(result.unmetOutcomes).toContain("NAT-M2");
    expect(result.unmetOutcomes).toContain("TRN-M2");
  });

  it("returns 0 score and records all unmet outcomes when all answers are wrong", () => {
    const result = evaluateNamedServiceOutage({
      dhcpDefaultGateway: "192.168.1.254",
      dhcpDnsServer: "192.168.1.99",
      natOverloadEnabled: false,
      transportOutageReasonOption: "dns-changes-http-port",
    });

    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.unmetOutcomes).toEqual(["RTG-M1", "SRV-M2", "NAT-M2", "TRN-M2"]);
    expect(result.feedback.length).toBeGreaterThanOrEqual(4);
  });
});
