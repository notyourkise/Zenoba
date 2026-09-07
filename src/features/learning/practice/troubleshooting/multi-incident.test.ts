import { describe, it, expect } from "vitest";
import {
  evaluateMultiIncidentInvestigation,
  MultiIncidentSubmission,
} from "./multi-incident";

describe("evaluateMultiIncidentInvestigation", () => {
  const perfectSubmission: MultiIncidentSubmission = {
    apipaRootCause: "dhcp-pool-exhausted",
    apipaCorrection: "expand-dhcp-scope-24",
    interVlanRootCause: "missing-8021q-trunk",
    interVlanCorrection: "reconfigure-port-trunk",
    gatewayRootCause: "wrong-default-gateway",
    gatewayCorrection: "restore-gateway-192-168-1-1",
    troubleshootingPrincipleOption: "isolate-single-variable-with-rollback",
    serviceVerificationOption: "verify-layer7-and-end-user-workflow",
  };

  it("passes with 100/100 for a completely correct submission", () => {
    const result = evaluateMultiIncidentInvestigation(perfectSubmission);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.maxScore).toBe(100);
    expect(result.criteriaResults.length).toBe(4);
    expect(result.criteriaResults.every((c) => c.passed)).toBe(true);
    expect(result.unmetOutcomes.length).toBe(0);
    expect(result.feedback.length).toBe(0);
  });

  it("passes with 75/100 (threshold >= 70) when 3 out of 4 criteria are correct", () => {
    const threePassSubmission: MultiIncidentSubmission = {
      ...perfectSubmission,
      apipaRootCause: "pc-broken", // 1 criteria failed
    };

    const result = evaluateMultiIncidentInvestigation(threePassSubmission);

    expect(result.passed).toBe(true);
    expect(result.score).toBe(75);
    expect(result.criteriaResults.filter((c) => c.passed).length).toBe(3);
    expect(result.unmetOutcomes).toContain("WLS-M1");
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  it("fails with 50/100 when only 2 criteria are correct", () => {
    const twoPassSubmission: MultiIncidentSubmission = {
      ...perfectSubmission,
      apipaRootCause: "pc-broken",
      interVlanRootCause: "wrong-password",
    };

    const result = evaluateMultiIncidentInvestigation(twoPassSubmission);

    expect(result.passed).toBe(false);
    expect(result.score).toBe(50);
    expect(result.criteriaResults.filter((c) => c.passed).length).toBe(2);
    expect(result.unmetOutcomes).toContain("WLS-M1");
    expect(result.unmetOutcomes).toContain("SEC-M2");
  });

  it("fails with 0/100 for all wrong answers", () => {
    const allWrongSubmission: MultiIncidentSubmission = {
      apipaRootCause: "virus",
      apipaCorrection: "reboot",
      interVlanRootCause: "cable-cut",
      interVlanCorrection: "replace-cable",
      gatewayRootCause: "isp-broken",
      gatewayCorrection: "call-isp",
      troubleshootingPrincipleOption: "change-all-parameters-simultaneously",
      serviceVerificationOption: "icmp-ping-reply-is-enough",
    };

    const result = evaluateMultiIncidentInvestigation(allWrongSubmission);

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.criteriaResults.every((c) => !c.passed)).toBe(true);
    expect(result.unmetOutcomes.length).toBe(4);
    expect(result.feedback.length).toBe(4);
  });
});
