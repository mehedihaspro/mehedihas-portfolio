"use client";

import { useState, useEffect } from "react";
import { X, Sun, BookOpen, Moon, Eclipse, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "./theme-provider";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

const THEMES = [
  {
    value: "light" as const,
    label: "Light",
    Icon: Sun,
    bg: "#FAF5EE",
    fg: "#6B5D4F",
  },
  {
    value: "sepia" as const,
    label: "Sepia",
    Icon: BookOpen,
    bg: "#F4EADB",
    fg: "#5C4B38",
  },
  {
    value: "dark" as const,
    label: "Dark",
    Icon: Moon,
    bg: "#1C1C1E",
    fg: "#E5E5E7",
  },
  {
    value: "night" as const,
    label: "Night",
    Icon: Eclipse,
    bg: "#000000",
    fg: "#D1D1D6",
  },
];

export function ThemeFab() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isNearFooter = useFooterVisibility();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on blog detail pages — they have the full ReadingSettings FAB instead
  const isBlogDetail = pathname?.startsWith("/blog/") && pathname !== "/blog";

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [isOpen]);

  if (isBlogDetail) return null;

  const current = THEMES.find((t) => t.value === theme) || THEMES[0];
  const FabIcon = current.Icon;
  const shouldHide = isNearFooter && !isOpen;

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[997] w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-primary hover:text-amber transition-all duration-300 hover:scale-105 ${
          shouldHide
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        aria-label={`Change theme, current: ${current.label}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      >
        {isOpen ? <X size={17} /> : <FabIcon size={17} strokeWidth={1.8} />}
      </button>

      {/* Theme popover */}
      {isOpen && (
        <>
          {/* Click-outside target — fully transparent */}
          <div
            className="fixed inset-0 z-[996]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="menu"
            aria-label="Theme options"
            className="fixed bottom-[72px] right-4 md:bottom-24 md:right-8 z-[997] w-[272px] rounded-[20px] bg-bg-card animate-in fade-in slide-in-from-bottom-3 duration-200 overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted font-inter">
                Choose Theme
              </p>
            </div>

            {/* Theme list — vertical cards with full previews */}
            <div className="px-3 pb-3 flex flex-col gap-1">
              {THEMES.map((t) => {
                const TIcon = t.Icon;
                const active = theme === t.value;
                return (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    key={t.value}
                    onClick={() => {
                      setTheme(t.value);
                    }}
                    className={`group relative flex items-center gap-3 p-2.5 rounded-[14px] transition-all text-left ${
                      active ? "bg-highlight-bg" : "hover:bg-bg-subtle"
                    }`}
                  >
                    {/* Color swatch with icon */}
                    <div
                      className="w-11 h-11 shrink-0 rounded-[11px] flex items-center justify-center relative overflow-hidden"
                      style={{
                        backgroundColor: t.bg,
                        boxShadow:
                          "inset 0 0 0 1px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)",
                      }}
                    >
                      <TIcon
                        size={16}
                        style={{ color: t.fg }}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Label + current state */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[14px] font-semibold font-inter transition-colors ${
                          active ? "text-amber" : "text-text-primary"
                        }`}
                      >
                        {t.label}
                      </p>
                      <p className="text-[11px] text-text-muted font-inter">
                        {t.value === "light" && "Bright and clean"}
                        {t.value === "sepia" && "Warm, easy on the eyes"}
                        {t.value === "dark" && "Classic dark mode"}
                        {t.value === "night" && "True black, OLED-friendly"}
                      </p>
                    </div>

                    {/* Active check */}
                    {active && (
                      <div className="w-6 h-6 rounded-full bg-amber flex items-center justify-center shrink-0">
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={2.8}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
