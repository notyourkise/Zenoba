import { describe, it, expect } from "vitest";
import {
  evaluateVlanRepair,
  VlanRepairSubmission,
} from "./vlan-repair";

describe("Staff & Guest VLAN Repair Evaluator", () => {
  const perfectSubmission: VlanRepairSubmission = {
    switch2Port2Vlan: 10,
    trunkAllowedVlans: [10, 20],
    interVlanReasonOption: "l2-isolation-needs-l3-router",
  };

  it("passes with 100/100 score on a perfect submission", () => {
    const result = evaluateVlanRepair(perfectSubmission);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.maxScore).toBe(100);
    expect(result.unmetOutcomes.length).toBe(0);
    expect(result.criteriaResults.every((c) => c.passed)).toBe(true);
  });

  it("penalizes score and records unmet TRK-M1 outcome when port is misconfigured", () => {
    const wrongPortSubmission: VlanRepairSubmission = {
      ...perfectSubmission,
      switch2Port2Vlan: 20, // Still wrong (VLAN 20 instead of 10)
    };

    const result = evaluateVlanRepair(wrongPortSubmission);
    expect(result.score).toBe(65); // 100 - 35
    expect(result.passed).toBe(false); // below threshold 70
    expect(result.unmetOutcomes).toContain("TRK-M1");

    const portCriterion = result.criteriaResults.find(
      (c) => c.id === "staff-port-fixed"
    );
    expect(portCriterion?.passed).toBe(false);
  });

  it("penalizes score and records unmet TRK-M2 outcome when trunk only permits VLAN 10", () => {
    const wrongTrunkSubmission: VlanRepairSubmission = {
      ...perfectSubmission,
      trunkAllowedVlans: [10], // Missing VLAN 20
    };

    const result = evaluateVlanRepair(wrongTrunkSubmission);
    expect(result.score).toBe(65);
    expect(result.passed).toBe(false);
    expect(result.unmetOutcomes).toContain("TRK-M2");

    const trunkCriterion = result.criteriaResults.find(
      (c) => c.id === "trunk-allowed-fixed"
    );
    expect(trunkCriterion?.passed).toBe(false);
  });

  it("penalizes score and records unmet VLAN-M2 outcome when inter-VLAN logic is incorrect", () => {
    const wrongLogicSubmission: VlanRepairSubmission = {
      ...perfectSubmission,
      interVlanReasonOption: "trunk-cable-too-slow",
    };

    const result = evaluateVlanRepair(wrongLogicSubmission);
    expect(result.score).toBe(70); // 100 - 30
    expect(result.passed).toBe(true); // 70 is exactly pass threshold
    expect(result.unmetOutcomes).toContain("VLAN-M2");

    const logicCriterion = result.criteriaResults.find(
      (c) => c.id === "inter-vlan-logic"
    );
    expect(logicCriterion?.passed).toBe(false);
  });

  it("fails completely when all criteria are wrong", () => {
    const zeroSubmission: VlanRepairSubmission = {
      switch2Port2Vlan: 99,
      trunkAllowedVlans: [99],
      interVlanReasonOption: "switch-needs-reboot",
    };

    const result = evaluateVlanRepair(zeroSubmission);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.unmetOutcomes.length).toBe(3);
    expect(result.criteriaResults.every((c) => !c.passed)).toBe(true);
  });
});
