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
  const toggleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toggleRef.current && !toggleRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 flex items-center justify-center text-gray-400">
        <Sun className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div ref={toggleRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
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
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl py-1 z-50 text-xs">
          <button
            type="button"
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              theme === "light" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
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
            className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              theme === "dark" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
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
            className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              theme === "system" ? "font-semibold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <Monitor className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}
