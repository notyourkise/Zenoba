/**
 * Bill of Quantities (BoQ) Calculation and Budget Validation Engine
 */

import { DEVICE_CATALOG, DeviceSpec } from "../catalog/devices";

export interface BoQItem {
  deviceId: string;
  quantity: number;
}

export interface BoQItemDetail extends BoQItem {
  device: DeviceSpec;
  subtotal: number;
}

export interface BoQCalculationResult {
  items: BoQItemDetail[];
  totalCost: number;
  totalAccessPorts: number;
  totalPoeWatts: number;
  requiredPoeWatts: number;
  hasSufficientPoe: boolean;
  hasRouter: boolean;
  hasManagedSwitch: boolean;
  hasWifiAp: boolean;
  isWithinBudget: boolean;
  budgetUtilizationPct: number;
}

export function calculateBoQ(
  items: BoQItem[],
  maxBudget: number,
  clientRequirements?: {
    requiredAccessPorts?: number;
    requiredApCount?: number;
    requireVlan?: boolean;
    requireDualWan?: boolean;
  }
): BoQCalculationResult {
  const itemDetails: BoQItemDetail[] = [];
  let totalCost = 0;
  let totalAccessPorts = 0;
  let totalPoeWatts = 0;
  let totalAps = 0;
  let hasRouter = false;
  let hasManagedSwitch = false;
  let hasWifiAp = false;

  for (const item of items) {
    if (item.quantity <= 0) continue;
    const device = DEVICE_CATALOG.find((d) => d.id === item.deviceId);
    if (!device) continue;

    const subtotal = device.price * item.quantity;
    totalCost += subtotal;

    if (device.category === "switch") {
      totalAccessPorts += device.portCount * item.quantity;
      if (device.managed) hasManagedSwitch = true;
      if (device.poeSupport && device.poeBudgetWatts) {
        totalPoeWatts += device.poeBudgetWatts * item.quantity;
      }
    }

    if (device.category === "router") {
      hasRouter = true;
    }

    if (device.category === "access_point") {
      hasWifiAp = true;
      totalAps += item.quantity;
    }

    itemDetails.push({
      ...item,
      device,
      subtotal,
    });
  }

  // Each AP consumes approx 15W - 25W of PoE power
  const requiredPoeWatts = (clientRequirements?.requiredApCount || totalAps) * 20;
  const hasSufficientPoe = totalPoeWatts >= requiredPoeWatts;

  const isWithinBudget = totalCost <= maxBudget;
  const budgetUtilizationPct = maxBudget > 0 ? (totalCost / maxBudget) * 100 : 0;

  return {
    items: itemDetails,
    totalCost,
    totalAccessPorts,
    totalPoeWatts,
    requiredPoeWatts,
    hasSufficientPoe,
    hasRouter,
    hasManagedSwitch,
    hasWifiAp,
    isWithinBudget,
    budgetUtilizationPct: Math.round(budgetUtilizationPct * 10) / 10,
  };
}
