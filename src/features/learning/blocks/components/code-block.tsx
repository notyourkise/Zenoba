import React from "react";
import { z } from "zod";
import { CodeBlockSchema } from "../schema";

type CodeBlockProps = {
  block: z.infer<typeof CodeBlockSchema>;
};

export function CodeBlock({ block }: CodeBlockProps) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900 text-gray-100 font-mono text-xs sm:text-sm">
      {block.filename && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs flex items-center justify-between">
          <span>{block.filename}</span>
          <span className="uppercase text-[10px] tracking-wider text-gray-500">{block.language}</span>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre>
          <code>{block.code}</code>
        </pre>
      </div>
    </div>
  );
}
