import React from "react";
import { AlertCircle } from "lucide-react";

type FallbackBlockProps = {
  blockType?: string;
  error?: string;
};

export function FallbackBlock({ blockType, error }: FallbackBlockProps) {
  return (
    <div className="my-4 p-4 rounded-xl border border-dashed border-red-300 dark:border-red-800/80 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300 flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="space-y-1 text-xs">
        <p className="font-bold">
          Konten blok tidak dapat dirender ({blockType || "unknown"})
        </p>
        <p className="opacity-90">
          {error || "Format blok materi tidak dikenali atau memiliki atribut yang tidak valid."}
        </p>
      </div>
    </div>
  );
}
