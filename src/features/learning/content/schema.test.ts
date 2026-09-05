import { describe, expect, it } from "vitest";
import { CurriculumLesson, CurriculumModule } from "./schema";
import {
  validateCurriculumLesson,
  validateCurriculumModule,
} from "./validate";

const validLessonFixture: CurriculumLesson = {
  id: "lesson-intro-net",
  slug: "intro-to-networking",
  title: "Apa Itu Jaringan Komputer?",
  description:
    "Memahami konsep dasar jaringan, perangkat terhubung vs berdiri sendiri, dan berbagi sumber daya.",
  orderIndex: 0,
  estimatedMinutes: 8,
  xpReward: 50,
  prerequisites: [],
  outcomes: [
    {
      id: "WN-L1-A",
      text: "Siswa dapat membedakan kumpulan perangkat yang terhubung dan perangkat yang berdiri sendiri.",
    },
    {
      id: "WN-L1-B",
      text: "Siswa dapat menjelaskan dua manfaat jaringan dari skenario berbagi file dan printer.",
    },
  ],
  evidence: [
    {
      outcomeId: "WN-L1-A",
      teachingBlockIds: ["block-teach-connected"],
      activityIds: ["block-act-toggle"],
      assessmentItemIds: ["quiz-q1-connected"],
    },
    {
      outcomeId: "WN-L1-B",
      teachingBlockIds: ["block-teach-sharing"],
      activityIds: ["block-act-sharing"],
      assessmentItemIds: ["quiz-q2-file", "quiz-q3-printer"],
    },
  ],
  content: {
    version: "1.0",
    blocks: [
      {
        id: "block-teach-connected",
        type: "text",
        content:
          "Jaringan komputer adalah kumpulan perangkat yang saling terhubung untuk bertukar data.",
        format: "markdown",
      },
      {
        id: "block-teach-sharing",
        type: "text",
        content:
          "Dua manfaat utama adalah berbagi file (dokumen) dan berbagi printer bersama.",
        format: "markdown",
      },
      {
        id: "block-act-toggle",
        type: "interactive",
        interactiveType: "connectivity_toggle",
        config: { scenario: "standalone_vs_connected" },
      },
      {
        id: "block-act-sharing",
        type: "interactive",
        interactiveType: "resource_match",
        config: { scenario: "printer_file" },
      },
      {
        id: "quiz-q1-connected",
        type: "quiz",
        quizId: "quiz-q1-connected",
        question: "Manakah yang merupakan karakteristik jaringan komputer?",
        quizType: "single_choice",
        options: [
          { id: "opt-1", text: "Dua atau lebih perangkat saling terhubung untuk berkomunikasi" },
          { id: "opt-2", text: "Komputer yang menyala tanpa kabel atau Wi-Fi" },
        ],
        xpReward: 10,
      },
      {
        id: "quiz-q2-file",
        type: "quiz",
        quizId: "quiz-q2-file",
        question: "Apa keuntungan berbagi file lewat jaringan?",
        quizType: "single_choice",
        options: [
          { id: "opt-1", text: "Dokumen dapat diakses langsung tanpa copy flashdisk fisik" },
          { id: "opt-2", text: "Flashdisk harus dicolok bergiliran" },
        ],
        xpReward: 10,
      },
      {
        id: "quiz-q3-printer",
        type: "quiz",
        quizId: "quiz-q3-printer",
        question: "Bagaimana printer jaringan membantu efisiensi lab sekolah?",
        quizType: "single_choice",
        options: [
          { id: "opt-1", text: "Beberapa PC bisa mencetak ke satu printer yang sama" },
          { id: "opt-2", text: "Setiap PC wajib membeli printer masing-masing" },
        ],
        xpReward: 10,
      },
    ],
  },
};

describe("Curriculum Lesson Validation", () => {
  it("validates a compliant lesson fixture successfully", () => {
    const result = validateCurriculumLesson(validLessonFixture);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("lesson-intro-net");
      expect(result.data.outcomes).toHaveLength(2);
    }
  });

  it("rejects an outcome without assessment evidence", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].assessmentItemIds = [];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("assessment item"))).toBe(true);
    }
  });

  it("rejects an outcome without teaching evidence", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].teachingBlockIds = [];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("teaching block"))).toBe(true);
    }
  });

  it("rejects an outcome without activity evidence", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].activityIds = [];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("activity ID"))).toBe(true);
    }
  });

  it("rejects duplicate outcome IDs", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.outcomes.push({
      id: "WN-L1-A", // duplicate
      text: "Outcome duplikat",
    });
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("Duplicate outcome ID"))).toBe(true);
    }
  });

  it("rejects duplicate block IDs in content", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.content.blocks.push({
      id: "block-teach-connected", // duplicate block ID
      type: "text",
      content: "Teks duplikat",
      format: "markdown",
    });
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("Duplicate block ID"))).toBe(true);
    }
  });

  it("rejects dangling teaching block reference in evidence", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].teachingBlockIds = ["non-existent-block-id"];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("not found in lesson content blocks"))).toBe(true);
    }
  });

  it("rejects dangling activity block reference in evidence", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].activityIds = ["non-existent-activity-id"];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("not found in lesson content blocks"))).toBe(true);
    }
  });

  it("rejects unmapped assessment item ID", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].assessmentItemIds = ["unknown-assessment-id"];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("not found in lesson quizzes or server assessments"))).toBe(true);
    }
  });

  it("accepts server-only assessment item IDs via options", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.evidence[0].assessmentItemIds = ["server-quiz-item-1"];
    const result = validateCurriculumLesson(lesson, {
      serverAssessmentItemIds: ["server-quiz-item-1"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a lesson that lists itself in prerequisites", () => {
    const lesson = structuredClone(validLessonFixture);
    lesson.prerequisites = ["intro-to-networking"];
    const result = validateCurriculumLesson(lesson);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("cannot list itself"))).toBe(true);
    }
  });
});

describe("Curriculum Module Validation", () => {
  const validModuleFixture: CurriculumModule = {
    id: "module-welcome",
    slug: "welcome-to-networking",
    title: "Welcome to Networking",
    description: "Modul percontohan jaringan dasar untuk SMK TKJ.",
    orderIndex: 0,
    prerequisites: [],
    outcomes: [
      {
        id: "WN-M1",
        text: "Siswa dapat menjelaskan jaringan sebagai perangkat yang saling terhubung untuk berkomunikasi dan berbagi sumber daya.",
      },
    ],
    lessons: [validLessonFixture],
    finalAssessment: {
      assessmentId: "assessment-welcome-final",
      title: "Ujian Akhir Modul: Welcome to Networking",
      description: "Evaluasi pemahaman konsep dan kemampuan praktik konektivitas.",
      conceptQuestionCount: 10,
      conceptPassThreshold: 8,
      practicalCriteriaCount: 3,
      practicalPassThreshold: 3,
    },
  };

  it("validates a compliant module successfully", () => {
    const result = validateCurriculumModule(validModuleFixture);
    expect(result.success).toBe(true);
  });

  it("detects prerequisite cycles among lessons in the module", () => {
    const lesson1 = structuredClone(validLessonFixture);
    lesson1.id = "L1";
    lesson1.slug = "lesson-1";
    lesson1.prerequisites = ["lesson-2"];

    const lesson2 = structuredClone(validLessonFixture);
    lesson2.id = "L2";
    lesson2.slug = "lesson-2";
    lesson2.prerequisites = ["lesson-1"];

    const moduleWithCycle: CurriculumModule = {
      ...validModuleFixture,
      lessons: [lesson1, lesson2],
    };

    const result = validateCurriculumModule(moduleWithCycle);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.some((e) => e.includes("cycle detected"))).toBe(true);
    }
  });

  it("rejects final assessment threshold greater than total questions", () => {
    const invalidModule: CurriculumModule = {
      ...validModuleFixture,
      finalAssessment: {
        assessmentId: "assessment-welcome-final",
        title: "Test",
        description: "Test",
        conceptQuestionCount: 10,
        conceptPassThreshold: 11, // Invalid!
        practicalCriteriaCount: 3,
        practicalPassThreshold: 3,
      },
    };

    const result = validateCurriculumModule(invalidModule);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.errors.some((e) =>
          e.includes("concept pass threshold (11) cannot exceed question count (10)")
        )
      ).toBe(true);
    }
  });
});
