import { describe, it, expect } from "vitest";
import {
  ORDINARY_LEARNER_FILTER,
  isAnalyticsLearner,
} from "./cohort";

describe("analytics cohort", () => {
  describe("ORDINARY_LEARNER_FILTER", () => {
    it("restricts cohort to standard LEARNER role", () => {
      expect(ORDINARY_LEARNER_FILTER).toEqual({ role: "LEARNER" });
    });
  });

  describe("isAnalyticsLearner", () => {
    it("returns true for standard LEARNER role", () => {
      expect(isAnalyticsLearner("LEARNER")).toBe(true);
    });

    it("returns false for INTERNAL_LEARNER role to prevent metrics pollution", () => {
      expect(isAnalyticsLearner("INTERNAL_LEARNER")).toBe(false);
    });

    it("returns false for DEVELOPER role", () => {
      expect(isAnalyticsLearner("DEVELOPER")).toBe(false);
    });

    it("returns false for null, undefined, or unknown values", () => {
      expect(isAnalyticsLearner(null)).toBe(false);
      expect(isAnalyticsLearner(undefined)).toBe(false);
      expect(isAnalyticsLearner("ADMIN")).toBe(false);
      expect(isAnalyticsLearner(123)).toBe(false);
    });
  });
});
