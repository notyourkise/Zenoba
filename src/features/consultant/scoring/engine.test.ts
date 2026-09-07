import { describe, expect, it } from "vitest";
import { evaluateConsultantProject, ConsultantCaseRequirements } from "./engine";

describe("Consultant 5-Dimensional Scoring Engine", () => {
  const smallOfficeRequirements: ConsultantCaseRequirements = {
    clientName: "Kantor Notaris & PPAT",
    clientType: "small-office",
    budget: 15000000, // 15 Juta
    wiredClientCount: 12,
    apCount: 2,
    requireVlan: false,
    requirePoe: true,
  };

  it("evaluates a well-balanced small office project with high score", () => {
    const res = evaluateConsultantProject(smallOfficeRequirements, {
      boqItems: [
        { deviceId: "router-sbr-5g", quantity: 1 }, // 1.25M
        { deviceId: "switch-poe-24g-370w", quantity: 1 }, // 4.8M (24 port, PoE)
        { deviceId: "ap-wifi6-ax3000", quantity: 2 }, // 2.7M
        { deviceId: "cable-cat6-roll-305m", quantity: 1 }, // 1.45M
        { deviceId: "patch-panel-cat6-24p", quantity: 1 }, // 0.45M
      ],
    });

    expect(res.passed).toBe(true);
    expect(res.totalScore).toBeGreaterThanOrEqual(85);
    expect(res.dimensions.technicalCorrectness.score).toBe(20);
    expect(res.dimensions.requirementFulfillment.score).toBe(20);
    expect(res.dimensions.costEfficiency.score).toBe(20);
  });

  it("fails project with 0 cost efficiency when over budget", () => {
    const res = evaluateConsultantProject(smallOfficeRequirements, {
      boqItems: [
        { deviceId: "router-core-sfp-10g", quantity: 1 }, // 8.5M
        { deviceId: "switch-core-48g-4sfp-10g", quantity: 1 }, // 9.8M -> Total 18.3M > 15M
      ],
    });

    expect(res.passed).toBe(false);
    expect(res.dimensions.costEfficiency.score).toBe(0);
  });

  it("deducts security score when unmanaged switch is selected for VLAN requirement", () => {
    const vlanRequirements: ConsultantCaseRequirements = {
      clientName: "Logistik PT Nusantara",
      clientType: "medium-office",
      budget: 50000000,
      wiredClientCount: 30,
      apCount: 3,
      requireVlan: true,
      vlanList: [
        { vlanId: 10, name: "Staff", requiredHosts: 30 },
        { vlanId: 20, name: "Guest", requiredHosts: 20 },
      ],
    };

    const res = evaluateConsultantProject(vlanRequirements, {
      boqItems: [
        { deviceId: "router-sbr-5g", quantity: 1 },
        { deviceId: "switch-unmanaged-8g", quantity: 4 }, // Unmanaged!
        { deviceId: "ap-wifi6-ax3000", quantity: 3 },
      ],
    });

    expect(res.dimensions.security.score).toBe(0);
    expect(res.dimensions.security.feedback).toContain("unmanaged");
  });

  it("fails proposal if router gateway is missing even if cost efficiency and other dimensions score high", () => {
    const res = evaluateConsultantProject(smallOfficeRequirements, {
      boqItems: [
        // No router!
        { deviceId: "switch-poe-24g-370w", quantity: 1 },
        { deviceId: "ap-wifi6-ax3000", quantity: 2 },
      ],
    });

    expect(res.passed).toBe(false);
    expect(res.dimensions.technicalCorrectness.feedback).toContain("Kegagalan Kritis");
    expect(res.dimensions.technicalCorrectness.feedback).toContain("Router gateway");
  });

  it("fails proposal if switch access ports are insufficient for wired clients", () => {
    const res = evaluateConsultantProject(smallOfficeRequirements, {
      boqItems: [
        { deviceId: "router-sbr-5g", quantity: 1 },
        { deviceId: "switch-unmanaged-8g", quantity: 1 }, // Only 8 ports for 12 clients!
        { deviceId: "ap-wifi6-ax3000", quantity: 2 },
      ],
    });

    expect(res.passed).toBe(false);
    expect(res.dimensions.technicalCorrectness.feedback).toContain("Kegagalan Kritis");
    expect(res.dimensions.technicalCorrectness.feedback).toContain("tidak mencukupi");
  });
});
