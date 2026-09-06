import { describe, it, expect } from "vitest";
import {
  createInitialLibraryState,
  isDirectLinkConnected,
  isStarReachable,
  setLinkStatus,
  toggleLinkStatus,
  toggleIspUplink,
  executePrintTest,
  evaluatePracticalCriteria,
} from "./domain";

describe("Connectivity Domain Logic", () => {
  it("initializes library state with disconnected PC-Sirkulasi and offline ISP", () => {
    const state = createInitialLibraryState();

    expect(isDirectLinkConnected(state.links, "pc-katalog", "switch-perpus")).toBe(true);
    expect(isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus")).toBe(false);
    expect(isDirectLinkConnected(state.links, "printer-barcode", "switch-perpus")).toBe(true);
    expect(state.ispUplinkConnected).toBe(false);
    expect(state.verifiedPrints).toHaveLength(0);
  });

  it("calculates reachability correctly when a single client branch is disconnected", () => {
    const state = createInitialLibraryState();

    // PC-Katalog can reach printer
    expect(isStarReachable(state.links, "pc-katalog", "printer-barcode")).toBe(true);

    // PC-Sirkulasi cannot reach printer due to broken cable
    expect(isStarReachable(state.links, "pc-sirkulasi", "printer-barcode")).toBe(false);
  });

  it("executes print test deterministically: PC-Katalog succeeds, PC-Sirkulasi fails initially", () => {
    const state = createInitialLibraryState();

    const katalogResult = executePrintTest(state, "pc-katalog");
    expect(katalogResult.success).toBe(true);
    expect(katalogResult.reason).toContain("berhasil");

    const sirkulasiResult = executePrintTest(katalogResult.newState, "pc-sirkulasi");
    expect(sirkulasiResult.success).toBe(false);
    expect(sirkulasiResult.reason).toContain("belum tersambung");

    // Evaluation at this stage must fail P01, P02, and P03
    const evalResult = evaluatePracticalCriteria(sirkulasiResult.newState);
    expect(evalResult.allPassed).toBe(false);
    expect(evalResult.criteriaResults.find((c) => c.id === "P01")?.passed).toBe(false);
    expect(evalResult.criteriaResults.find((c) => c.id === "P02")?.passed).toBe(false);
    expect(evalResult.criteriaResults.find((c) => c.id === "P03")?.passed).toBe(false);
  });

  it("proves working local network without Internet when PC-Sirkulasi cable is restored", () => {
    let state = createInitialLibraryState();

    // Reconnect PC-Sirkulasi cable
    state = setLinkStatus(state, "pc-sirkulasi", "switch-perpus", "connected");
    expect(isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus")).toBe(true);

    // ISP is still disconnected
    expect(state.ispUplinkConnected).toBe(false);

    // Run print test from both PCs
    const print1 = executePrintTest(state, "pc-katalog");
    expect(print1.success).toBe(true);

    const print2 = executePrintTest(print1.newState, "pc-sirkulasi");
    expect(print2.success).toBe(true);

    // All practical criteria P01, P02, P03 must now PASS
    const evaluation = evaluatePracticalCriteria(print2.newState);
    expect(evaluation.allPassed).toBe(true);
    expect(evaluation.criteriaResults.every((c) => c.passed)).toBe(true);
  });

  it("fails P03 if ISP uplink is mistakenly turned on (criteria requires offline verification)", () => {
    let state = createInitialLibraryState();
    state = setLinkStatus(state, "pc-sirkulasi", "switch-perpus", "connected");

    // Print tests succeed
    const res1 = executePrintTest(state, "pc-katalog");
    const res2 = executePrintTest(res1.newState, "pc-sirkulasi");
    state = res2.newState;

    // Toggle ISP uplink to true (online)
    state = toggleIspUplink(state);
    expect(state.ispUplinkConnected).toBe(true);

    const evaluation = evaluatePracticalCriteria(state);
    expect(evaluation.allPassed).toBe(false);
    expect(evaluation.criteriaResults.find((c) => c.id === "P03")?.passed).toBe(false);
  });

  it("supports toggleLinkStatus seamlessly", () => {
    let state = createInitialLibraryState();
    expect(isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus")).toBe(false);

    state = toggleLinkStatus(state, "pc-sirkulasi", "switch-perpus");
    expect(isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus")).toBe(true);

    state = toggleLinkStatus(state, "pc-sirkulasi", "switch-perpus");
    expect(isDirectLinkConnected(state.links, "pc-sirkulasi", "switch-perpus")).toBe(false);
  });
});
