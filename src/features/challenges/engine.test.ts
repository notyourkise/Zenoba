import { describe, expect, it } from "vitest";
import { evaluateChallengeDiagnosis } from "./engine";

describe("Challenge Engine Evaluator", () => {
  it("evaluates branch office down challenge correctly", () => {
    const resPass = evaluateChallengeDiagnosis("branch-office-down", {
      selectedRootCause: "gateway-misconfig",
    });
    expect(resPass.passed).toBe(true);
    expect(resPass.score).toBe(150);
    expect(resPass.rootCauseFeedback).toContain("Default Gateway");

    const resFail = evaluateChallengeDiagnosis("branch-office-down", {
      selectedRootCause: "cable-cut",
    });
    expect(resFail.passed).toBe(false);
    expect(resFail.score).toBe(0);
  });

  it("evaluates inter-vlan routing bug challenge correctly", () => {
    const resPass = evaluateChallengeDiagnosis("inter-vlan-routing-bug", {
      selectedRootCause: "missing-subinterface-trunk",
    });
    expect(resPass.passed).toBe(true);
    expect(resPass.score).toBe(150);
  });

  it("evaluates dhcp pool exhaustion challenge correctly", () => {
    const resPass = evaluateChallengeDiagnosis("dhcp-pool-exhausted", {
      selectedRootCause: "pool-exhaustion",
    });
    expect(resPass.passed).toBe(true);
    expect(resPass.score).toBe(150);
  });
});
