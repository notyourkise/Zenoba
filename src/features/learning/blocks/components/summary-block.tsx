import React from "react";
import { z } from "zod";
import { SummaryBlockSchema } from "../schema";
import { CheckCircle } from "lucide-react";

type SummaryBlockProps = {
  block: z.infer<typeof SummaryBlockSchema>;
};

export function SummaryBlock({ block }: SummaryBlockProps) {
  return (
    <div className="my-6 p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4">
      <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        {block.title}
      </h3>
      <ul className="space-y-2.5">
        {block.keyPoints.map((point, idx) => (
          <li key={idx} className="flex items-start text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2.5 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
