"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme, setTheme } from "@/components/useTheme";

export default function ThemeToggle({ className = "" }) {
  const theme = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Dark mode" : "Light mode"}
      className={`relative flex h-9 w-[68px] shrink-0 items-center rounded-full border border-fg/15 bg-fg/5 p-1 backdrop-blur-md transition hover:border-fg/30 ${className}`}
    >
      <Sun
        size={14}
        className={`absolute left-[11px] transition ${isLight ? "text-white" : "text-fg/45"} z-10`}
      />
      <Moon
        size={14}
        className={`absolute right-[11px] transition ${isLight ? "text-fg/45" : "text-white"} z-10`}
      />
      <span
        className={`h-7 w-7 rounded-full bg-gradient-to-br from-brand-violet via-brand-pink to-brand-orange shadow-lg transition-transform duration-300 ease-out ${
          isLight ? "translate-x-0" : "translate-x-[32px]"
        }`}
      />
    </button>
  );
}
