import { describe, it, expect } from "vitest";
import {
  calculateInitialSchedule,
  calculateNextSchedule,
  isScheduleDue,
  calculateDaysRemaining,
  addDays,
} from "./review-scheduler";

describe("Review Scheduler Domain Engine (Sprint 39 / Task 39.1)", () => {
  const fixedNow = new Date("2026-09-16T10:00:00.000Z");

  describe("calculateInitialSchedule", () => {
    it("creates an initial 1-day schedule with zero consecutive successes", () => {
      const schedule = calculateInitialSchedule("PLAN-L1-A", { now: fixedNow });

      expect(schedule.outcomeId).toBe("PLAN-L1-A");
      expect(schedule.intervalDays).toBe(1);
      expect(schedule.consecutiveSuccesses).toBe(0);
      expect(schedule.lastReviewedAt).toBeNull();
      expect(schedule.dueAt.toISOString()).toBe("2026-09-17T10:00:00.000Z");
    });

    it("respects historical masteredAt date when provided", () => {
      const masteredAt = new Date("2026-09-10T08:00:00.000Z");
      const schedule = calculateInitialSchedule("PLAN-L1-A", {
        masteredAt,
        now: fixedNow,
      });

      expect(schedule.dueAt.toISOString()).toBe("2026-09-11T08:00:00.000Z");
      expect(isScheduleDue(schedule.dueAt, fixedNow)).toBe(true);
    });
  });

  describe("calculateNextSchedule - AGAIN rating", () => {
    it("resets consecutive successes to 0 and schedules review for tomorrow", () => {
      const current = {
        outcomeId: "PLAN-L1-A",
        dueAt: fixedNow,
        intervalDays: 14,
        consecutiveSuccesses: 3,
        lastReviewedAt: new Date("2026-09-02T10:00:00.000Z"),
      };

      const next = calculateNextSchedule(current, "AGAIN", fixedNow);

      expect(next.outcomeId).toBe("PLAN-L1-A");
      expect(next.consecutiveSuccesses).toBe(0);
      expect(next.intervalDays).toBe(1);
      expect(next.dueAt.toISOString()).toBe("2026-09-17T10:00:00.000Z");
      expect(next.lastReviewedAt).toEqual(fixedNow);
    });
  });

  describe("calculateNextSchedule - GOOD rating", () => {
    it("progresses sequentially along GOOD_STEPS: [1, 3, 7, 14, 30, 60]", () => {
      let state = calculateInitialSchedule("PLAN-L1-A", { now: fixedNow });
      const expectedSteps = [1, 3, 7, 14, 30, 60];

      let simulatedTime = new Date(fixedNow);

      for (let i = 0; i < expectedSteps.length; i++) {
        const expectedInterval = expectedSteps[i];
        state = calculateNextSchedule(state, "GOOD", simulatedTime);

        expect(state.consecutiveSuccesses).toBe(i + 1);
        expect(state.intervalDays).toBe(expectedInterval);
        expect(state.lastReviewedAt).toEqual(simulatedTime);

        const expectedDue = addDays(simulatedTime, expectedInterval);
        expect(state.dueAt.toISOString()).toBe(expectedDue.toISOString());

        // Fast forward clock to next due date
        simulatedTime = expectedDue;
      }

      // Beyond max steps, should cap at 60 days
      state = calculateNextSchedule(state, "GOOD", simulatedTime);
      expect(state.consecutiveSuccesses).toBe(7);
      expect(state.intervalDays).toBe(60);
    });
  });

  describe("calculateNextSchedule - HARD rating", () => {
    it("progresses conservatively along HARD_STEPS: [1, 2, 4, 7, 14, 21]", () => {
      let state = calculateInitialSchedule("PLAN-L1-A", { now: fixedNow });
      const expectedSteps = [1, 2, 4, 7, 14, 21];

      let simulatedTime = new Date(fixedNow);

      for (let i = 0; i < expectedSteps.length; i++) {
        const expectedInterval = expectedSteps[i];
        state = calculateNextSchedule(state, "HARD", simulatedTime);

        expect(state.consecutiveSuccesses).toBe(i + 1);
        expect(state.intervalDays).toBe(expectedInterval);
        expect(state.lastReviewedAt).toEqual(simulatedTime);

        const expectedDue = addDays(simulatedTime, expectedInterval);
        expect(state.dueAt.toISOString()).toBe(expectedDue.toISOString());

        simulatedTime = expectedDue;
      }

      // Beyond max steps, should cap at 21 days
      state = calculateNextSchedule(state, "HARD", simulatedTime);
      expect(state.consecutiveSuccesses).toBe(7);
      expect(state.intervalDays).toBe(21);
    });
  });

  describe("isScheduleDue and calculateDaysRemaining", () => {
    it("identifies past and exact time as due", () => {
      const past = new Date("2026-09-15T10:00:00.000Z");
      expect(isScheduleDue(past, fixedNow)).toBe(true);
      expect(calculateDaysRemaining(past, fixedNow)).toBe(0);

      expect(isScheduleDue(fixedNow, fixedNow)).toBe(true);
      expect(calculateDaysRemaining(fixedNow, fixedNow)).toBe(0);
    });

    it("identifies future dates as not due and calculates remaining days correctly", () => {
      const inTwoDays = new Date("2026-09-18T10:00:00.000Z");
      expect(isScheduleDue(inTwoDays, fixedNow)).toBe(false);
      expect(calculateDaysRemaining(inTwoDays, fixedNow)).toBe(2);

      const inHours = new Date("2026-09-16T18:00:00.000Z");
      expect(isScheduleDue(inHours, fixedNow)).toBe(false);
      expect(calculateDaysRemaining(inHours, fixedNow)).toBe(1);
    });
  });
});
