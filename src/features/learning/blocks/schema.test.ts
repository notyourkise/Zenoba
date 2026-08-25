import { describe, expect, it } from "vitest";
import { validateLessonContent } from "./schema";

describe("Lesson Block Schema Validation", () => {
  it("validates a complete lesson content document successfully", () => {
    const payload = {
      version: "1.0",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Konsep Dasar Jaringan",
        },
        {
          type: "text",
          content: "Jaringan komputer menghubungkan banyak node.",
          format: "markdown",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Tips Praktis",
          content: "Gunakan kabel Cat6 untuk bandwidth gigabit.",
        },
        {
          type: "summary",
          title: "Poin Kunci",
          keyPoints: ["Point 1", "Point 2"],
        },
        {
          type: "reward",
          xp: 50,
          message: "Hebat!",
        },
      ],
    };

    const result = validateLessonContent(payload);
    expect(result.success).toBe(true);
    expect(result.data?.blocks).toHaveLength(5);
  });

  it("automatically wraps a bare array of blocks into version 1.0", () => {
    const rawBlocks = [
      {
        type: "heading",
        level: 1,
        text: "Judul Utama",
      },
    ];

    const result = validateLessonContent(rawBlocks);
    expect(result.success).toBe(true);
    expect(result.data?.version).toBe("1.0");
    expect(result.data?.blocks[0].type).toBe("heading");
  });

  it("rejects unknown block types safely without crashing", () => {
    const payload = {
      version: "1.0",
      blocks: [
        {
          type: "unsupported_alien_block",
          someField: 123,
        },
      ],
    };

    const result = validateLessonContent(payload);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it("rejects missing required fields within a block", () => {
    const payload = {
      version: "1.0",
      blocks: [
        {
          type: "heading",
          // missing level and text
        },
      ],
    };

    const result = validateLessonContent(payload);
    expect(result.success).toBe(false);
    expect(result.errors?.some((e) => e.includes("text") || e.includes("level"))).toBe(true);
  });

  it("rejects null or non-object payloads", () => {
    expect(validateLessonContent(null).success).toBe(false);
    expect(validateLessonContent("string").success).toBe(false);
    expect(validateLessonContent(123).success).toBe(false);
  });
});
