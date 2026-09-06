import React from "react";
import type { LearningOutcome } from "../content/schema";

interface LearningOutcomesProps {
  outcomes?: LearningOutcome[] | null;
  scope?: "module" | "lesson";
  title?: string;
}

export function LearningOutcomes({
  outcomes,
  scope = "lesson",
  title,
}: LearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) {
    return null;
  }

  const defaultTitle =
    scope === "module"
      ? "Target Kompetensi Modul"
      : "Target Capaian Pembelajaran";

  const headingText = title || defaultTitle;
  const regionLabel = `Capaian Pembelajaran ${scope === "module" ? "Modul" : "Pelajaran"}`;

  return (
    <section
      role="region"
      aria-label={regionLabel}
      className="p-5 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3"
    >
      <div className="flex items-center justify-between gap-2 border-b border-blue-100/80 dark:border-blue-900/40 pb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          {headingText}
        </h2>
        <span className="text-[11px] font-semibold text-blue-600/80 dark:text-blue-400/80">
          {outcomes.length} Sasaran Kompetensi
        </span>
      </div>

      <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
        {outcomes.map((outcome) => (
          <li
            key={outcome.id}
            className="flex items-start gap-2.5 leading-relaxed"
          >
            <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-blue-100/70 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 flex-shrink-0 mt-0.5">
              {outcome.id}
            </span>
            <span className="flex-1">{outcome.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
