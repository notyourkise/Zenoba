import React from "react";
import { z } from "zod";
import { LottieBlockSchema } from "../schema";
import { Play } from "lucide-react";

type LottieBlockProps = {
  block: z.infer<typeof LottieBlockSchema>;
};

export function LottieBlock({ block }: LottieBlockProps) {
  return (
    <div className="my-6 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-3">
      {/* Visual Animation Container with Reduced-Motion Fallback */}
      <div className="w-full max-w-sm mx-auto h-48 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 flex flex-col items-center justify-center border border-dashed border-blue-200 dark:border-blue-800">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
          <Play className="w-6 h-6 ml-0.5" />
        </div>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
          Animasi Interaktif
        </span>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {block.animationUrl}
        </span>
      </div>

      {block.caption && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}
