import { describe, expect, it } from "vitest";
import { evaluateSupportChallenge } from "./support-challenge";

describe("First Day as IT Support Challenge Evaluator", () => {
  it("passes when all inventory, topology, and troubleshooting steps are correct", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "ap-1", "cable-cat6"],
      topologyChoice: "star",
      troubleshootAnswer: "check_layer1_cable",
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.feedback).toHaveLength(3);
  });

  it("penalizes score when legacy/wrong devices are selected", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["router-1", "switch-1", "hub-legacy"],
      topologyChoice: "star",
      troubleshootAnswer: "check_layer1_cable",
    });

    expect(result.score).toBe(60); // 30 (topology) + 30 (troubleshoot)
    expect(result.passed).toBe(false); // threshold 70
  });

  it("fails when all answers are wrong", () => {
    const result = evaluateSupportChallenge({
      selectedDeviceIds: ["hub-legacy"],
      topologyChoice: "bus",
      troubleshootAnswer: "reinstall_os",
    });

    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
  });
});
