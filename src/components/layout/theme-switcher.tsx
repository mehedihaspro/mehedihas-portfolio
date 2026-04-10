"use client";

import { Sun, BookOpen, Moon, Eclipse } from "lucide-react";
import { useTheme } from "./theme-provider";

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light", Icon: Sun },
  { value: "sepia" as const, label: "Sepia", Icon: BookOpen },
  { value: "dark" as const, label: "Dark", Icon: Moon },
  { value: "night" as const, label: "Night", Icon: Eclipse },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-bg-subtle rounded-lg p-0.5 gap-0.5">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
            theme === option.value
              ? "bg-bg-card text-amber shadow-xs"
              : "text-text-muted hover:text-text-secondary"
          }`}
          aria-label={`Switch to ${option.label} theme`}
          title={option.label}
        >
          <option.Icon size={14} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  );
}
