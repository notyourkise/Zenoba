import React from "react";
import { z } from "zod";
import { CalloutBlockSchema } from "../schema";
import { Info, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";

type CalloutBlockProps = {
  block: z.infer<typeof CalloutBlockSchema>;
};

const variantStyles = {
  info: {
    container: "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200",
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />,
  },
  warning: {
    container: "bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200",
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
  },
  tip: {
    container: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200",
    icon: <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
  },
  success: {
    container: "bg-green-50/80 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200",
    icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />,
  },
};

export function CalloutBlock({ block }: CalloutBlockProps) {
  const style = variantStyles[block.variant] || variantStyles.info;

  return (
    <div className={`p-4 rounded-xl border ${style.container} my-4 flex items-start space-x-3`}>
      <div className="mt-0.5">{style.icon}</div>
      <div className="space-y-1 text-sm leading-relaxed">
        <h4 className="font-bold">{block.title}</h4>
        <p className="opacity-95">{block.content}</p>
      </div>
    </div>
  );
}
