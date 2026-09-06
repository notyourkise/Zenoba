import { describe, expect, it } from "vitest";
import { evaluateSupportChallenge } from "./support-challenge";

describe("First Day as IT Support Challenge Evaluator (P1 Outcomes)", () => {
  it("passes when all inventory, topology, and troubleshooting steps are correct", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
      topologyChoice: "star",
      troubleshootAnswer: "check_layer1_cable",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback).toHaveLength(4);
    expect(result.unmetOutcomes).toEqual([]);
    expect(result.outcomeResults).toHaveLength(4);

    expect(result.outcomeResults.map((o) => o.outcomeId)).toEqual([
      "DEV-M1",
      "PMC-M1",
      "TOP-M1",
      "OSI-M1",
    ]);
    expect(result.outcomeResults.every((o) => o.passed)).toBe(true);
  });

  it("penalizes DEV-M1 when legacy hub is selected and separates PMC-M1", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "hub-legacy", "cable-cat6"],
      topologyChoice: "star",
      troubleshootAnswer: "check_layer1_cable",
    });

    expect(result.score).toBe(80); // PMC-M1(20) + TOP-M1(30) + OSI-M1(30)
    expect(result.passed).toBe(true); // threshold 70
    expect(result.unmetOutcomes).toEqual(["DEV-M1"]);

    const devOutcome = result.outcomeResults.find((o) => o.outcomeId === "DEV-M1");
    expect(devOutcome?.passed).toBe(false);

    const pmcOutcome = result.outcomeResults.find((o) => o.outcomeId === "PMC-M1");
    expect(pmcOutcome?.passed).toBe(true);
  });

  it("penalizes PMC-M1 when coaxial cable is selected instead of Cat6 UTP", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "ap-1", "coaxial-cable"],
      topologyChoice: "star",
      troubleshootAnswer: "check_layer1_cable",
    });

    expect(result.score).toBe(80); // DEV-M1(20) + TOP-M1(30) + OSI-M1(30)
    expect(result.passed).toBe(true);
    expect(result.unmetOutcomes).toEqual(["PMC-M1"]);

    const pmcOutcome = result.outcomeResults.find((o) => o.outcomeId === "PMC-M1");
    expect(pmcOutcome?.passed).toBe(false);
  });

  it("penalizes TOP-M1 and fails when multiple outcomes fail below 70 threshold", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
      topologyChoice: "bus",
      troubleshootAnswer: "reinstall_os",
    });

    expect(result.score).toBe(40); // DEV-M1(20) + PMC-M1(20)
    expect(result.passed).toBe(false);
    expect(result.unmetOutcomes).toEqual(["TOP-M1", "OSI-M1"]);
  });

  it("fails all outcomes when completely wrong options are selected", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["hub-legacy", "coaxial-cable"],
      topologyChoice: "ring",
      troubleshootAnswer: "restart_router",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.unmetOutcomes).toEqual(["DEV-M1", "PMC-M1", "TOP-M1", "OSI-M1"]);
    expect(result.outcomeResults.every((o) => !o.passed)).toBe(true);
  });
});
