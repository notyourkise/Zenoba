import React from "react";
import { z } from "zod";
import { DiagramBlockSchema } from "../schema";
import { Network } from "lucide-react";

type DiagramBlockProps = {
  block: z.infer<typeof DiagramBlockSchema>;
};

export function DiagramBlock({ block }: DiagramBlockProps) {
  return (
    <div className="my-6 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        <Network className="w-4 h-4" />
        <span>Diagram Topologi: {block.diagramType}</span>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center min-h-36">
        <div className="text-center space-y-1">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {JSON.stringify(block.data)}
          </p>
        </div>
      </div>

      {block.caption && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}
