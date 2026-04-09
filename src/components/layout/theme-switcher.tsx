"use client";

import { useTheme } from "./theme-provider";

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light", icon: "☀" },
  { value: "sepia" as const, label: "Sepia", icon: "📜" },
  { value: "dark" as const, label: "Dark", icon: "🌙" },
  { value: "night" as const, label: "Night", icon: "🌑" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-bg-subtle rounded-lg p-0.5 gap-0.5">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`w-7 h-7 flex items-center justify-center rounded-md text-xs transition-all ${
            theme === option.value
              ? "bg-bg-card text-text-primary shadow-xs"
              : "text-text-muted hover:text-text-secondary"
          }`}
          aria-label={`Switch to ${option.label} theme`}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
