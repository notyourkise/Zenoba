import * as React from "react";
import { cn } from "@/lib/utils";

export interface SlidingButtonLabelProps {
  text: string;
  className?: string;
  containerClassName?: string;
}

export function SlidingButtonLabel({
  text,
  className,
  containerClassName,
}: SlidingButtonLabelProps) {
  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden select-none",
        containerClassName || "h-4",
      )}
    >
      <span className="flex flex-col transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1/2 will-change-transform">
        <span
          className={cn(
            "flex items-center justify-center leading-none",
            containerClassName || "h-4",
            className,
          )}
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center leading-none",
            containerClassName || "h-4",
            className,
          )}
        >
          {text}
        </span>
      </span>
    </span>
  );
}
