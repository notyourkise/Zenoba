"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [open, setOpen] = React.useState(false);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent flex items-center justify-center text-gray-400">
        <Sun className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle theme"
        title="Ganti Tema (Light/Dark/System)"
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-blue-400 transition-all" />
        ) : theme === "light" ? (
          <Sun className="h-4 w-4 text-amber-500 transition-all" />
        ) : (
          <Monitor className="h-4 w-4 text-gray-500 transition-all" />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-1 z-50 text-xs">
            <button
              type="button"
              onClick={() => {
                setTheme("light");
                setOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === "light" ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Sun className="h-3.5 w-3.5 mr-2 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme("dark");
                setOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === "dark" ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Moon className="h-3.5 w-3.5 mr-2 text-blue-400" />
              <span>Dark Mode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme("system");
                setOpen(false);
              }}
              className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === "system" ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <Monitor className="h-3.5 w-3.5 mr-2 text-gray-400" />
              <span>System</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
