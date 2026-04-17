"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./icons";
import { Button } from "./ui/button";

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
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="relative rounded-md bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
    >
      <span className="theme-toggle-icon theme-toggle-icon--sun inline-flex">
        <SunIcon />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--moon inline-flex">
        <MoonIcon />
      </span>
    </Button>
  );
}
