"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ModeToggle({ className }: { className?: string } = {}) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="inline-flex items-center p-1 rounded-xl bg-gray-200/80 dark:bg-white/10 border border-gray-300/70 dark:border-white/10 gap-1 opacity-60">
        <div className="p-2 rounded-lg text-gray-400">
          <Sun className="h-4 w-4" />
        </div>
        <div className="p-2 rounded-lg text-gray-400">
          <Moon className="h-4 w-4" />
        </div>
        <div className="p-2 rounded-lg text-gray-400">
          <Laptop className="h-4 w-4" />
        </div>
      </div>
    );
  }

  const currentTheme = theme || "system";

  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema tampilan"
      className={`inline-flex items-center p-1 rounded-xl bg-gray-200/80 dark:bg-white/10 border border-gray-300/70 dark:border-white/10 gap-1 ${
        className || ""
      }`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === "light"}
        onClick={() => setTheme("light")}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          currentTheme === "light"
            ? "bg-white text-amber-500 shadow-xs dark:bg-zinc-800"
            : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="Mode Terang"
        aria-label="Mode Terang"
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === "dark"}
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          currentTheme === "dark"
            ? "bg-white text-sky-500 shadow-xs dark:bg-zinc-800"
            : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="Mode Gelap"
        aria-label="Mode Gelap"
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={currentTheme === "system"}
        onClick={() => setTheme("system")}
        className={`p-2 rounded-lg transition-all cursor-pointer ${
          currentTheme === "system"
            ? "bg-white text-blue-600 shadow-xs dark:bg-zinc-800 dark:text-blue-400"
            : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
        }`}
        title="Ikuti Tema Sistem"
        aria-label="Ikuti Tema Sistem"
      >
        <Laptop className="h-4 w-4" />
      </button>
    </div>
  );
}
