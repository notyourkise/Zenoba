"use client";

import React, { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import { cn } from "@/lib/utils";

interface LottiePlayerProps {
  src: string | object;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  className,
  ariaLabel = "Animasi 404",
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let anim: AnimationItem | null = null;

    async function loadLottie() {
      if (!containerRef.current) return;

      try {
        const lottieModule = await import("lottie-web");
        const lottie = lottieModule.default || lottieModule;

        if (!isMounted || !containerRef.current) return;

        const prefersReducedMotion =
          typeof window !== "undefined" && window.matchMedia
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;

        const resolvedPath =
          typeof src === "string" ? encodeURI(decodeURI(src)) : undefined;

        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: prefersReducedMotion ? false : loop,
          autoplay: prefersReducedMotion ? false : autoplay,
          ...(resolvedPath ? { path: resolvedPath } : { animationData: src }),
        });

        anim.addEventListener("DOMLoaded", () => {
          if (isMounted) setIsLoaded(true);
        });

        anim.addEventListener("data_failed", () => {
          if (isMounted) setHasError(true);
        });

        if (prefersReducedMotion && anim) {
          anim.goToAndStop(0, true);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      }
    }

    loadLottie();

    return () => {
      isMounted = false;
      try {
        anim?.destroy();
      } catch {
        // Silently ignore cleanup errors if unmounted during destruction
      }
    };
  }, [src, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center select-none", className)}
      role="img"
      aria-label={ariaLabel}
    >
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/60 animate-pulse font-mono"
          aria-hidden="true"
        >
          404 · Memuat visual...
        </div>
      )}
      {hasError && (
        <div
          className="flex flex-col items-center justify-center p-6 text-center select-none"
          aria-hidden="true"
        >
          <span className="text-8xl font-black tracking-tight text-blue-500/80 drop-shadow-sm font-mono">
            404
          </span>
          <span className="text-xs font-mono text-muted-foreground mt-2">
            Asset Signal Lost
          </span>
        </div>
      )}
    </div>
  );
}
