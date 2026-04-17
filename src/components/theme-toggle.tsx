"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "./icons";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const moonSize = 18;
  const sunSize = 22;

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="ghost"
      size="iconLg"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="relative rounded-md bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground"
    >
      <span className="theme-toggle-icon theme-toggle-icon--sun inline-flex">
        <SunIcon size={sunSize} />
      </span>
      <span className="theme-toggle-icon theme-toggle-icon--moon inline-flex">
        <MoonIcon size={moonSize} />
      </span>
    </Button>
  );
}
