import React from "react";
import { z } from "zod";
import { RewardBlockSchema } from "../schema";
import { Award, Sparkles } from "lucide-react";

type RewardBlockProps = {
  block: z.infer<typeof RewardBlockSchema>;
};

export function RewardBlock({ block }: RewardBlockProps) {
  return (
    <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3 shadow-sm">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center border border-amber-300 dark:border-amber-700 shadow-inner">
        <Award className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Reward: +{block.xp} XP</span>
        </div>
        {block.badgeTitle && (
          <h4 className="text-base font-bold text-gray-900 dark:text-white mt-2">
            Badge Terbuka: {block.badgeTitle}
          </h4>
        )}
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 max-w-md mx-auto mt-1">
          {block.message}
        </p>
      </div>
    </div>
  );
}
