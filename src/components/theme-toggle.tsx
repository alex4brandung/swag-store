"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = mounted
    ? isDark
      ? "Switch to light mode"
      : "Switch to dark mode"
    : "Toggle theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
    >
      <span className="theme-toggle-icon theme-toggle-icon--sun inline-flex">
        <SunIcon />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--moon inline-flex">
        <MoonIcon />
      </span>
    </button>
  );
}
