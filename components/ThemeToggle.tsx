"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          theme === "light"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          theme === "dark"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          theme === "system"
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        Auto
      </button>
    </div>
  );
}
