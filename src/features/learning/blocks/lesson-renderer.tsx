import React from "react";
import { LessonContentDocument, validateLessonContent } from "./schema";
import { renderLessonBlock } from "./registry";
import { FallbackBlock } from "./components/fallback-block";

interface LessonRendererProps {
  content: unknown;
  lessonId?: string;
}

export function LessonRenderer({ content, lessonId }: LessonRendererProps) {
  if (!content) {
    return null;
  }

  const validation = validateLessonContent(content);

  if (!validation.success || !validation.data) {
    return (
      <div className="space-y-4 my-6">
        <FallbackBlock
          blockType="document"
          error={`Validasi dokumen pelajaran gagal: ${validation.errors?.join(", ")}`}
        />
      </div>
    );
  }

  const document: LessonContentDocument = validation.data;

  return (
    <div className="space-y-6 lesson-content-blocks">
      {document.blocks.map((block, idx) => renderLessonBlock(block, idx, lessonId))}
    </div>
  );
}
