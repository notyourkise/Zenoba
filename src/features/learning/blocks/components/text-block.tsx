import React from "react";
import { z } from "zod";
import { TextBlockSchema } from "../schema";

type TextBlockProps = {
  block: z.infer<typeof TextBlockSchema>;
};

export function TextBlock({ block }: TextBlockProps) {
  // Support basic multiline paragraphs
  const paragraphs = block.content.split("\n\n");

  return (
    <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
      {paragraphs.map((para, idx) => (
        <p key={idx}>{para.trim()}</p>
      ))}
    </div>
  );
}
