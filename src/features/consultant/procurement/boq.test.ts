import { describe, expect, it } from "vitest";
import { calculateBoQ } from "./boq";

describe("Consultant BoQ Engine", () => {
  it("calculates total cost and items subtotal correctly", () => {
    const res = calculateBoQ(
      [
        { deviceId: "router-sbr-5g", quantity: 1 }, // 1.25M
        { deviceId: "switch-managed-24g", quantity: 1 }, // 2.4M
        { deviceId: "ap-wifi6-ax3000", quantity: 2 }, // 2 * 1.35M = 2.7M
      ],
      15000000
    );

    expect(res.totalCost).toBe(6350000);
    expect(res.isWithinBudget).toBe(true);
    expect(res.hasRouter).toBe(true);
    expect(res.hasManagedSwitch).toBe(true);
    expect(res.hasWifiAp).toBe(true);
    expect(res.totalAccessPorts).toBe(24);
  });

  it("detects budget overrun", () => {
    const res = calculateBoQ(
      [
        { deviceId: "router-core-sfp-10g", quantity: 2 }, // 17M
        { deviceId: "switch-core-48g-4sfp-10g", quantity: 2 }, // 19.6M
      ],
      20000000 // 20M budget
    );

    expect(res.totalCost).toBe(36600000);
    expect(res.isWithinBudget).toBe(false);
    expect(res.budgetUtilizationPct).toBeGreaterThan(100);
  });

  it("calculates PoE budget and sufficiency correctly", () => {
    const resSufficient = calculateBoQ(
      [
        { deviceId: "switch-poe-24g-370w", quantity: 1 }, // 370W PoE
        { deviceId: "ap-wifi6-ax3000", quantity: 4 }, // 4 * 20W = 80W
      ],
      10000000
    );

    expect(resSufficient.hasSufficientPoe).toBe(true);
    expect(resSufficient.totalPoeWatts).toBe(370);

    const resInsufficient = calculateBoQ(
      [
        { deviceId: "switch-managed-24g", quantity: 1 }, // 0W PoE
        { deviceId: "ap-wifi6-ax3000", quantity: 4 },
      ],
      10000000
    );

    expect(resInsufficient.hasSufficientPoe).toBe(false);
    expect(resInsufficient.totalPoeWatts).toBe(0);
  });
});
