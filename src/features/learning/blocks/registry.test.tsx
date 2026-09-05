import { describe, expect, it } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { LessonRenderer } from "./lesson-renderer";
import { renderLessonBlock } from "./registry";

describe("Lesson Block Renderer & Registry", () => {
  it("renders supported blocks cleanly", () => {
    const document = {
      version: "1.0",
      blocks: [
        {
          type: "heading",
          level: 2,
          text: "Konsep Dasar",
        },
        {
          type: "text",
          content: "Ini adalah teks penjelasan.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Tips Jaringan",
          content: "Pastikan kabel terpasang dengan kuat.",
        },
      ],
    };

    const { getByText } = render(<LessonRenderer content={document} />);
    expect(getByText("Konsep Dasar")).toBeDefined();
    expect(getByText("Ini adalah teks penjelasan.")).toBeDefined();
    expect(getByText("Tips Jaringan")).toBeDefined();
  });

  it("renders FallbackBlock when unknown block type is encountered", () => {
    // Force unknown block rendering directly via renderLessonBlock
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unknownBlock: any = {
      type: "alien_unsupported_block",
    };

    const { getAllByText } = render(<>{renderLessonBlock(unknownBlock)}</>);
    expect(getAllByText(/alien_unsupported_block/).length).toBeGreaterThan(0);
  });

  it("renders FallbackBlock when entire document payload is invalid", () => {
    const invalidDoc = {
      version: "999.0", // unsupported version
      blocks: [],
    };

    const { getByText } = render(<LessonRenderer content={invalidDoc} />);
    expect(getByText(/Validasi dokumen pelajaran gagal/)).toBeDefined();
  });

  it("renders welcome interactive blocks without fallback", () => {
    const interactiveDoc = {
      version: "1.0",
      blocks: [
        {
          id: "act-1",
          type: "interactive",
          interactiveType: "connectivity_toggle",
          config: { scenario: "standalone_vs_connected" },
        },
        {
          id: "act-2",
          type: "interactive",
          interactiveType: "uplink_toggle",
          config: { scenario: "home_office_uplink" },
        },
        {
          id: "act-3",
          type: "interactive",
          interactiveType: "classification",
          config: { scenario: "endpoints_and_media" },
        },
      ],
    };

    const { getByText, queryByText } = render(<LessonRenderer content={interactiveDoc} />);
    expect(getByText("Aktivitas Interaktif: Mandiri vs Berjaringan")).toBeDefined();
    expect(getByText("Aktivitas Interaktif: Uplink ISP vs Jaringan Lokal")).toBeDefined();
    expect(getByText("Latihan Interaktif: Klasifikasi Perangkat vs Media")).toBeDefined();
    expect(queryByText(/belum didukung dalam renderer ini/)).toBeNull();
  });
});
