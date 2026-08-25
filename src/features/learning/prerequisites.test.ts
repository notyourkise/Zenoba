import { describe, expect, it } from "vitest";
import {
  resolveLessonStatus,
  calculateProgressPercentage,
  type LessonPrerequisiteItem,
} from "./prerequisites";

describe("Prerequisite Resolver", () => {
  it("resolves to AVAILABLE when there are no prerequisites", () => {
    const result = resolveLessonStatus([], new Set());
    expect(result.status).toBe("AVAILABLE");
    expect(result.unmetPrerequisites).toHaveLength(0);
  });

  it("resolves to LOCKED when single prerequisite is not completed", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-2",
        prerequisiteId: "lesson-1",
        prerequisite: {
          id: "lesson-1",
          title: "Intro to Networking",
          slug: "intro-to-networking",
          module: { slug: "welcome" },
        },
      },
    ];

    const completed = new Set<string>();
    const result = resolveLessonStatus(prereqs, completed);

    expect(result.status).toBe("LOCKED");
    expect(result.unmetPrerequisites).toHaveLength(1);
    expect(result.unmetPrerequisites[0].id).toBe("lesson-1");
    expect(result.unmetPrerequisites[0].title).toBe("Intro to Networking");
  });

  it("resolves to AVAILABLE when single prerequisite is completed", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-2",
        prerequisiteId: "lesson-1",
        prerequisite: {
          id: "lesson-1",
          title: "Intro to Networking",
          slug: "intro-to-networking",
          module: { slug: "welcome" },
        },
      },
    ];

    const completed = new Set<string>(["lesson-1"]);
    const result = resolveLessonStatus(prereqs, completed);

    expect(result.status).toBe("AVAILABLE");
    expect(result.unmetPrerequisites).toHaveLength(0);
  });

  it("resolves to LOCKED if ANY of multiple prerequisites is missing", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-3",
        prerequisiteId: "lesson-1",
        prerequisite: {
          id: "lesson-1",
          title: "Lesson 1",
          slug: "lesson-1",
          module: { slug: "welcome" },
        },
      },
      {
        id: "rel-2",
        lessonId: "lesson-3",
        prerequisiteId: "lesson-2",
        prerequisite: {
          id: "lesson-2",
          title: "Lesson 2",
          slug: "lesson-2",
          module: { slug: "welcome" },
        },
      },
    ];

    // Only lesson-1 completed, lesson-2 missing
    const completed = new Set<string>(["lesson-1"]);
    const result = resolveLessonStatus(prereqs, completed);

    expect(result.status).toBe("LOCKED");
    expect(result.unmetPrerequisites).toHaveLength(1);
    expect(result.unmetPrerequisites[0].id).toBe("lesson-2");
  });

  it("resolves to AVAILABLE when ALL multiple prerequisites are completed", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-3",
        prerequisiteId: "lesson-1",
      },
      {
        id: "rel-2",
        lessonId: "lesson-3",
        prerequisiteId: "lesson-2",
      },
    ];

    const completed = new Set<string>(["lesson-1", "lesson-2"]);
    const result = resolveLessonStatus(prereqs, completed);

    expect(result.status).toBe("AVAILABLE");
    expect(result.unmetPrerequisites).toHaveLength(0);
  });

  it("preserves COMPLETED status even if prerequisites change", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-2",
        prerequisiteId: "lesson-1",
      },
    ];

    const result = resolveLessonStatus(prereqs, new Set(), "COMPLETED");
    expect(result.status).toBe("COMPLETED");
    expect(result.unmetPrerequisites).toHaveLength(0);
  });

  it("preserves IN_PROGRESS status when prerequisites are satisfied", () => {
    const result = resolveLessonStatus([], new Set(), "IN_PROGRESS");
    expect(result.status).toBe("IN_PROGRESS");
    expect(result.unmetPrerequisites).toHaveLength(0);
  });

  it("overrides IN_PROGRESS to LOCKED if prerequisites become unsatisfied", () => {
    const prereqs: LessonPrerequisiteItem[] = [
      {
        id: "rel-1",
        lessonId: "lesson-2",
        prerequisiteId: "lesson-1",
      },
    ];

    // Empty completed set means prerequisite not met
    const result = resolveLessonStatus(prereqs, new Set(), "IN_PROGRESS");
    expect(result.status).toBe("LOCKED");
  });
});

describe("Progress Percentage Calculator", () => {
  it("calculates progress percentages correctly", () => {
    expect(calculateProgressPercentage(0, 10)).toBe(0);
    expect(calculateProgressPercentage(5, 10)).toBe(50);
    expect(calculateProgressPercentage(10, 10)).toBe(100);
    expect(calculateProgressPercentage(1, 3)).toBe(33);
    expect(calculateProgressPercentage(2, 3)).toBe(67);
  });

  it("handles boundary edge cases safely", () => {
    expect(calculateProgressPercentage(0, 0)).toBe(0);
    expect(calculateProgressPercentage(-1, 10)).toBe(0);
    expect(calculateProgressPercentage(15, 10)).toBe(100);
  });
});
