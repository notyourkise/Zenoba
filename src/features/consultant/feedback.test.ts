import { describe, it, expect } from "vitest";
import {
  generateConsultantFeedback,
  resolveConsultantFeedback,
  type ConsultantStructuredFeedback,
} from "./feedback";
import { evaluateConsultantProject, type ConsultantCaseRequirements } from "./scoring/engine";

describe("Consultant Domain Feedback Engine", () => {
  const sampleRequirements: ConsultantCaseRequirements = {
    clientName: "Kantor Notaris & PPAT H. Suryadi, S.H.",
    clientType: "small-office",
    budget: 15000000, // 15 Juta
    wiredClientCount: 12,
    apCount: 2,
    requireVlan: false,
    requirePoe: true,
  };

  const validSubmission = {
    boqItems: [
      { deviceId: "router-sbr-5g", quantity: 1 },
      { deviceId: "switch-poe-24g-370w", quantity: 1 },
      { deviceId: "ap-wifi6-ax3000", quantity: 2 },
      { deviceId: "cable-cat6-roll-305m", quantity: 1 },
      { deviceId: "patch-panel-cat6-24p", quantity: 1 },
    ],
  };

  describe("generateConsultantFeedback", () => {
    it("generates structured strengths, zero blocking issues, and prioritized next actions for a passing proposal", () => {
      const evaluation = evaluateConsultantProject(sampleRequirements, validSubmission);
      expect(evaluation.passed).toBe(true);

      const feedback = generateConsultantFeedback(sampleRequirements, validSubmission, evaluation);

      expect(feedback.rubricVersion).toBe("1.1");
      expect(feedback.passed).toBe(true);
      expect(feedback.summary).toContain("disetujui");
      expect(feedback.strengths.length).toBeGreaterThan(0);
      expect(feedback.blockingIssues).toHaveLength(0);

      // Verify strengths mention router and AP
      const strengthsText = feedback.strengths.join(" ");
      expect(strengthsText).toMatch(/router/i);
      expect(strengthsText).toMatch(/Access Point/i);

      // Verify next actions are prioritized and linked to outcomes
      expect(feedback.nextActions.length).toBeGreaterThan(0);
      for (const action of feedback.nextActions) {
        expect(action.priority).toBeGreaterThanOrEqual(1);
        expect(action.priority).toBeLessThanOrEqual(3);
        expect(action.action.length).toBeGreaterThan(0);
        expect(action.reason.length).toBeGreaterThan(0);
        if (action.outcomeId) {
          expect(action.outcomeId).toMatch(/^PLAN-/);
        }
      }
    });

    it("identifies critical connectivity failure (missing router) as a Priority 1 blocking issue even if under budget", () => {
      const submissionWithoutRouter = {
        boqItems: [
          // No router!
          { deviceId: "switch-poe-24g-370w", quantity: 1 },
          { deviceId: "ap-wifi6-ax3000", quantity: 2 },
        ],
      };

      const evaluation = evaluateConsultantProject(sampleRequirements, submissionWithoutRouter);
      expect(evaluation.passed).toBe(false);

      const feedback = generateConsultantFeedback(sampleRequirements, submissionWithoutRouter, evaluation);

      expect(feedback.passed).toBe(false);
      expect(feedback.blockingIssues.length).toBeGreaterThan(0);
      expect(feedback.blockingIssues.some((issue) => issue.toLowerCase().includes("router"))).toBe(true);

      // Priority 1 next action must address the missing router linked to PLAN-L5-A
      const topAction = feedback.nextActions.find((a) => a.priority === 1 && a.outcomeId === "PLAN-L5-A");
      expect(topAction).toBeDefined();
      expect(topAction?.action.toLowerCase()).toContain("router");
    });

    it("identifies switch port deficit as a Priority 1 blocking issue", () => {
      const submissionWithInsufficientPorts = {
        boqItems: [
          { deviceId: "router-sbr-5g", quantity: 1 },
          // switch has 8 ports, client needs 12 ports
          { deviceId: "switch-g8-unmanaged", quantity: 1 },
          { deviceId: "ap-wifi6-ax3000", quantity: 2 },
        ],
      };

      const evaluation = evaluateConsultantProject(sampleRequirements, submissionWithInsufficientPorts);
      expect(evaluation.passed).toBe(false);

      const feedback = generateConsultantFeedback(sampleRequirements, submissionWithInsufficientPorts, evaluation);

      expect(feedback.passed).toBe(false);
      expect(feedback.blockingIssues.some((issue) => issue.toLowerCase().includes("port switch"))).toBe(true);

      // Must have Priority 1 next action linked to PLAN-L3-A (port calculation)
      const portAction = feedback.nextActions.find((a) => a.priority === 1 && a.outcomeId === "PLAN-L3-A");
      expect(portAction).toBeDefined();
    });

    it("identifies budget violation as a Priority 1 blocking issue", () => {
      const overBudgetSubmission = {
        boqItems: [
          { deviceId: "router-core-sfp-10g", quantity: 1 }, // 25 Juta alone, budget is 15 Juta
          { deviceId: "switch-poe-24g-370w", quantity: 1 },
          { deviceId: "ap-wifi6-ax3000", quantity: 2 },
        ],
      };

      const evaluation = evaluateConsultantProject(sampleRequirements, overBudgetSubmission);
      expect(evaluation.passed).toBe(false);

      const feedback = generateConsultantFeedback(sampleRequirements, overBudgetSubmission, evaluation);

      expect(feedback.passed).toBe(false);
      expect(feedback.blockingIssues.some((issue) => issue.toLowerCase().includes("budget"))).toBe(true);

      const budgetAction = feedback.nextActions.find((a) => a.priority === 1 && a.outcomeId === "PLAN-L1-A");
      expect(budgetAction).toBeDefined();
    });

    it("identifies PoE deficit as a Priority 2 action for PoE required cases", () => {
      const nonPoeSwitchSubmission = {
        boqItems: [
          { deviceId: "router-sbr-5g", quantity: 1 },
          { deviceId: "switch-g24-managed", quantity: 1 }, // Non-PoE switch!
          { deviceId: "ap-wifi6-ax3000", quantity: 2 },
        ],
      };

      const evaluation = evaluateConsultantProject(sampleRequirements, nonPoeSwitchSubmission);
      const feedback = generateConsultantFeedback(sampleRequirements, nonPoeSwitchSubmission, evaluation);

      expect(feedback.blockingIssues.some((issue) => issue.toLowerCase().includes("poe"))).toBe(true);
      const poeAction = feedback.nextActions.find((a) => a.priority === 2 && a.outcomeId === "PLAN-L3-B");
      expect(poeAction).toBeDefined();
    });

    it("identifies Dual-WAN and VLAN requirements when required by complex cases", () => {
      const complexRequirements: ConsultantCaseRequirements = {
        clientName: "PT Nusantara Express Logistics",
        clientType: "medium-office",
        budget: 50000000,
        wiredClientCount: 40,
        apCount: 3,
        requireVlan: true,
        requireDualWan: true,
        requirePoe: true,
        vlanList: [
          { vlanId: 10, name: "Staff", requiredHosts: 40 },
          { vlanId: 20, name: "Server", requiredHosts: 10 },
        ],
      };

      const submissionWithoutDualWanOrManagedSwitch = {
        boqItems: [
          { deviceId: "router-sbr-5g", quantity: 1 }, // Single WAN
          { deviceId: "switch-g48-unmanaged", quantity: 1 }, // Unmanaged switch!
          { deviceId: "ap-wifi6-ax3000", quantity: 3 },
        ],
      };

      const evaluation = evaluateConsultantProject(complexRequirements, submissionWithoutDualWanOrManagedSwitch);
      const feedback = generateConsultantFeedback(complexRequirements, submissionWithoutDualWanOrManagedSwitch, evaluation);

      expect(feedback.passed).toBe(false);
      expect(feedback.blockingIssues.some((i) => i.toLowerCase().includes("dual-wan"))).toBe(true);
      expect(feedback.blockingIssues.some((i) => i.toLowerCase().includes("vlan"))).toBe(true);

      const dualWanAction = feedback.nextActions.find((a) => a.outcomeId === "PLAN-L5-B");
      expect(dualWanAction).toBeDefined();

      const vlanAction = feedback.nextActions.find((a) => a.outcomeId === "PLAN-L6-A");
      expect(vlanAction).toBeDefined();
    });
  });

  describe("resolveConsultantFeedback (Historical Score & Version Preservation)", () => {
    it("returns existing v1.1 structured feedback directly without modification", () => {
      const existingV11Feedback: ConsultantStructuredFeedback = {
        rubricVersion: "1.1",
        passed: true,
        summary: "Proposal disetujui klien dengan nilai sangat memuaskan.",
        strengths: ["Kapasitas switch memadai", "Router gateway andal"],
        blockingIssues: [],
        nextActions: [
          {
            action: "Lanjutkan ke fase instalasi",
            outcomeId: "PLAN-L9-A",
            priority: 3,
            reason: "Proposal sudah disetujui",
          },
        ],
      };

      const resolved = resolveConsultantFeedback({
        score: 92,
        passed: true,
        feedback: existingV11Feedback,
        compositeScore: { rubricVersion: "1.1", totalScore: 92 },
      });

      expect(resolved.rubricVersion).toBe("1.1");
      expect(resolved.passed).toBe(true);
      expect(resolved.summary).toBe(existingV11Feedback.summary);
      expect(resolved.strengths).toEqual(existingV11Feedback.strengths);
      expect(resolved.blockingIssues).toEqual([]);
      expect(resolved.nextActions).toEqual(existingV11Feedback.nextActions);
    });

    it("synthesizes structured feedback for legacy v1.0 projects WITHOUT altering score or passed status", () => {
      const legacyV10Project = {
        score: 65,
        passed: false,
        compositeScore: {
          rubricVersion: "1.0",
          totalScore: 65,
          maxTotalScore: 100,
          dimensions: {
            technicalCorrectness: { score: 10, maxScore: 20, feedback: "Belum ada Router gateway untuk menghubungkan LAN ke Internet." },
            requirementFulfillment: { score: 15, maxScore: 20, feedback: "Kebutuhan terpenuhi sebagian." },
            costEfficiency: { score: 20, maxScore: 20, feedback: "Penggunaan anggaran sangat efisien." },
            scalability: { score: 10, maxScore: 20, feedback: "Cadangan port switch sangat minim." },
            security: { score: 10, maxScore: 20, feedback: "Segmentasi standar." },
          },
        },
        feedback: {
          rubricVersion: "1.0",
          passed: false,
          summary: "Proposal perlu revisi spesifikasi teknis atau anggaran",
          dimensions: {
            technicalCorrectness: { score: 10, maxScore: 20, feedback: "Belum ada Router gateway untuk menghubungkan LAN ke Internet." },
            requirementFulfillment: { score: 15, maxScore: 20, feedback: "Kebutuhan terpenuhi sebagian." },
            costEfficiency: { score: 20, maxScore: 20, feedback: "Penggunaan anggaran sangat efisien." },
            scalability: { score: 10, maxScore: 20, feedback: "Cadangan port switch sangat minim." },
            security: { score: 10, maxScore: 20, feedback: "Segmentasi standar." },
          },
        },
      };

      const resolved = resolveConsultantFeedback(legacyV10Project);

      // MUST preserve historical rubric version and passed status
      expect(resolved.rubricVersion).toBe("1.0");
      expect(resolved.passed).toBe(false);
      expect(resolved.summary).toBe("Proposal perlu revisi spesifikasi teknis atau anggaran");

      // Strengths extracted from high score dimension (cost efficiency: 20/20)
      expect(resolved.strengths.length).toBeGreaterThan(0);
      expect(resolved.strengths.some((s) => s.includes("anggaran"))).toBe(true);

      // Blocking issue detected from router missing feedback
      expect(resolved.blockingIssues.length).toBeGreaterThan(0);
      expect(resolved.blockingIssues.some((b) => b.includes("Router gateway"))).toBe(true);

      // Next actions generated with outcome link
      expect(resolved.nextActions.length).toBeGreaterThan(0);
      expect(resolved.nextActions.some((a) => a.outcomeId === "PLAN-L5-A")).toBe(true);
    });

    it("gracefully handles missing, partial, or malformed feedback objects without errors", () => {
      const corruptProject = {
        score: 85,
        passed: true,
        feedback: null,
        compositeScore: undefined,
      };

      const resolved = resolveConsultantFeedback(corruptProject);

      expect(resolved.rubricVersion).toBe("1.0");
      expect(resolved.passed).toBe(true);
      expect(resolved.summary).toBeDefined();
      expect(Array.isArray(resolved.strengths)).toBe(true);
      expect(Array.isArray(resolved.blockingIssues)).toBe(true);
      expect(Array.isArray(resolved.nextActions)).toBe(true);
    });
  });
});
