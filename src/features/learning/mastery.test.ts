import { describe, it, expect } from "vitest";
import {
  deriveOutcomeMasteries,
  groupMasteryByModule,
  summarizeLearnerMastery,
  type DeclaredOutcome,
  type OutcomeEvidenceRecord,
} from "./mastery";

describe("deriveOutcomeMasteries (Pure Domain Engine)", () => {
  const sampleDeclaredOutcomes: DeclaredOutcome[] = [
    {
      id: "out-ipv4-anatomy",
      text: "Memahami struktur 32-bit IPv4 dan representasi dotted-decimal",
      moduleId: "mod-ip",
      moduleSlug: "ip-addressing",
      moduleTitle: "Pengalamatan IP",
      pathId: "path-net",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      lessonId: "les-ipv4-basics",
      lessonSlug: "ipv4-basics",
      lessonTitle: "Pengenalan IPv4",
      currentVersion: "1.0",
      assessmentItemIds: ["q-ipv4-1", "q-ipv4-2"],
      remediationLessonIds: ["les-ipv4-basics"],
    },
    {
      id: "out-subnet-calc",
      text: "Menghitung subnet mask, network address, dan usable host range",
      moduleId: "mod-ip",
      moduleSlug: "ip-addressing",
      moduleTitle: "Pengalamatan IP",
      pathId: "path-net",
      pathSlug: "network-fundamentals",
      pathTitle: "Network Fundamentals",
      lessonId: "les-subnetting",
      lessonSlug: "subnetting-vlsm",
      lessonTitle: "Subnetting dan VLSM",
      currentVersion: "1.0",
      assessmentItemIds: ["q-subnet-1"],
      remediationLessonIds: ["les-subnetting"],
    },
  ];

  it("returns NOT_STARTED when learner has no progress or assessment evidence", () => {
    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      [], // no evidence
      new Map() // no lesson progress
    );

    expect(results).toHaveLength(2);
    expect(results[0].state).toBe("NOT_STARTED");
    expect(results[0].latestAttemptAt).toBeNull();
    expect(results[0].evidenceVersion).toBeNull();
    expect(results[0].remediationLessonIds).toEqual(["les-ipv4-basics"]);

    expect(results[1].state).toBe("NOT_STARTED");
  });

  it("returns IN_PROGRESS when lesson is in progress or completed but assessment has not been passed", () => {
    const lessonProgressMap = new Map([
      ["les-ipv4-basics", { status: "IN_PROGRESS", completedAt: null }],
    ]);

    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      [],
      lessonProgressMap
    );

    expect(results[0].state).toBe("IN_PROGRESS");
    expect(results[1].state).toBe("NOT_STARTED");
  });

  it("returns MASTERED when current-version assessment passed and lesson is completed", () => {
    const lessonProgressMap = new Map([
      ["les-ipv4-basics", { status: "COMPLETED", completedAt: new Date("2026-09-10T10:00:00Z") }],
    ]);

    const evidence: OutcomeEvidenceRecord[] = [
      {
        assessmentId: "q-ipv4-1",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "1.0",
        submittedAt: new Date("2026-09-10T10:05:00Z"),
      },
      {
        assessmentId: "q-ipv4-2",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "1.0",
        submittedAt: new Date("2026-09-10T10:06:00Z"),
      },
    ];

    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      evidence,
      lessonProgressMap
    );

    expect(results[0].state).toBe("MASTERED");
    expect(results[0].evidenceVersion).toBe("1.0");
    expect(results[0].latestAttemptAt).toEqual(new Date("2026-09-10T10:06:00Z"));
  });

  it("returns NEEDS_REVIEW when latest assessment attempt failed", () => {
    const lessonProgressMap = new Map([
      ["les-ipv4-basics", { status: "COMPLETED", completedAt: new Date("2026-09-10T10:00:00Z") }],
    ]);

    const evidence: OutcomeEvidenceRecord[] = [
      {
        assessmentId: "q-ipv4-1",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "1.0",
        submittedAt: new Date("2026-09-10T09:00:00Z"),
      },
      {
        assessmentId: "q-ipv4-2",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: false,
        score: 0,
        version: "1.0",
        submittedAt: new Date("2026-09-10T11:00:00Z"), // latest failed
      },
    ];

    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      evidence,
      lessonProgressMap
    );

    expect(results[0].state).toBe("NEEDS_REVIEW");
    expect(results[0].remediationLessonIds).toContain("les-ipv4-basics");
  });

  it("returns NEEDS_REVIEW when passed evidence belongs to an older/superseded version", () => {
    const lessonProgressMap = new Map([
      ["les-ipv4-basics", { status: "COMPLETED", completedAt: new Date("2026-09-10T10:00:00Z") }],
    ]);

    // Learner passed version "0.9", but current curriculum version is "1.0"
    const evidence: OutcomeEvidenceRecord[] = [
      {
        assessmentId: "q-ipv4-1",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "0.9", // older superseded version
        submittedAt: new Date("2026-09-01T10:00:00Z"),
      },
    ];

    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      evidence,
      lessonProgressMap
    );

    expect(results[0].state).toBe("NEEDS_REVIEW");
    expect(results[0].evidenceVersion).toBe("0.9");
  });

  it("preserves historical evidence display deterministically without silent regrading", () => {
    const evidence: OutcomeEvidenceRecord[] = [
      {
        assessmentId: "q-subnet-1",
        lessonId: "les-subnetting",
        outcomeId: "out-subnet-calc",
        passed: false,
        score: 40,
        version: "1.0",
        submittedAt: new Date("2026-09-15T08:00:00Z"),
      },
    ];

    const results = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      evidence,
      new Map()
    );

    expect(results[1].state).toBe("NEEDS_REVIEW");
    expect(results[1].latestAttemptAt).toEqual(new Date("2026-09-15T08:00:00Z"));
    expect(results[1].evidenceVersion).toBe("1.0");
  });

  it("groups outcome masteries into module hierarchies and summarizes counts", () => {
    const lessonProgressMap = new Map([
      ["les-ipv4-basics", { status: "COMPLETED", completedAt: new Date("2026-09-10T10:00:00Z") }],
    ]);

    const evidence: OutcomeEvidenceRecord[] = [
      {
        assessmentId: "q-ipv4-1",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "1.0",
        submittedAt: new Date("2026-09-10T10:00:00Z"),
      },
      {
        assessmentId: "q-ipv4-2",
        lessonId: "les-ipv4-basics",
        outcomeId: "out-ipv4-anatomy",
        passed: true,
        score: 100,
        version: "1.0",
        submittedAt: new Date("2026-09-10T10:00:00Z"),
      },
    ];

    const masteries = deriveOutcomeMasteries(
      sampleDeclaredOutcomes,
      evidence,
      lessonProgressMap
    );

    const groups = groupMasteryByModule(masteries);
    expect(groups).toHaveLength(1);
    expect(groups[0].moduleTitle).toBe("Pengalamatan IP");
    expect(groups[0].totalOutcomes).toBe(2);
    expect(groups[0].masteredCount).toBe(1);
    expect(groups[0].notStartedCount).toBe(1);

    const summary = summarizeLearnerMastery(groups);
    expect(summary.totalOutcomes).toBe(2);
    expect(summary.masteredCount).toBe(1);
    expect(summary.masteryPercentage).toBe(50);
  });
});
