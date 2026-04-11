"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Menu,
  Focus,
  Sun,
  BookOpen,
  Moon,
  Eclipse,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

const STORAGE_KEY_FONT_SIZE = "mehedihas-font-size";
const STORAGE_KEY_LINE_HEIGHT = "mehedihas-line-height";
const STORAGE_KEY_FOCUS = "mehedihas-focus-mode";
const STORAGE_KEY_FONT_FAMILY = "mehedihas-font-family";

type ThemeValue = "light" | "sepia" | "dark" | "night";

interface ThemeDef {
  value: ThemeValue;
  label: string;
  swatch: string;
  Icon: LucideIcon;
}

const THEMES: ThemeDef[] = [
  { value: "light", label: "Light", swatch: "#FAF5EE", Icon: Sun },
  { value: "sepia", label: "Sepia", swatch: "#F4EADB", Icon: BookOpen },
  { value: "dark", label: "Dark", swatch: "#1C1C1E", Icon: Moon },
  { value: "night", label: "Night", swatch: "#000000", Icon: Eclipse },
];

const FONT_FAMILIES = [
  {
    value: "sans" as const,
    label: "Sans",
    cssVar: "var(--font-inter), 'Inter', sans-serif",
    sample: "Aa",
  },
  {
    value: "serif" as const,
    label: "Serif",
    cssVar: "Georgia, 'Times New Roman', serif",
    sample: "Aa",
  },
  {
    value: "bangla" as const,
    label: "Bangla",
    cssVar: "var(--font-bangla), 'Hind Siliguri', sans-serif",
    sample: "অ",
  },
];

type FontFamily = (typeof FONT_FAMILIES)[number]["value"];

// Slider ranges
const FONT_SIZE_MIN = 14;
const FONT_SIZE_MAX = 28;
const LINE_HEIGHT_MIN = 1.4;
const LINE_HEIGHT_MAX = 2.6;

function readStored<T>(
  key: string,
  fallback: T,
  transform: (v: string) => T
): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const value = transform(raw);
    // Reject NaN/invalid values (e.g. legacy enum strings like "default")
    if (typeof value === "number" && !Number.isFinite(value)) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

export function ReadingSettings() {
  const { theme, setTheme } = useTheme();
  const isNearFooter = useFooterVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(() =>
    readStored(STORAGE_KEY_FONT_SIZE, 18, Number)
  );
  const [lineHeight, setLineHeight] = useState<number>(() =>
    readStored(STORAGE_KEY_LINE_HEIGHT, 1.9, Number)
  );
  const [focusMode, setFocusMode] = useState<boolean>(() =>
    readStored(STORAGE_KEY_FOCUS, false, (v) => v === "true")
  );
  const [fontFamily, setFontFamily] = useState<FontFamily>(() =>
    readStored<FontFamily>(
      STORAGE_KEY_FONT_FAMILY,
      "sans",
      (v) => v as FontFamily
    )
  );

  const applySettings = useCallback(() => {
    const article = document.querySelector(
      "[data-article-body]"
    ) as HTMLElement | null;
    if (!article) return;

    article.style.fontSize = `${fontSize}px`;
    article.style.lineHeight = `${lineHeight}`;

    const fontDef = FONT_FAMILIES.find((f) => f.value === fontFamily);
    if (fontDef) article.style.fontFamily = fontDef.cssVar;
  }, [fontSize, lineHeight, fontFamily]);

  // Sync focus mode state to the body class on mount + whenever it changes.
  useEffect(() => {
    document.body.classList.toggle("focus-mode", focusMode);
  }, [focusMode]);

  useEffect(() => {
    applySettings();
    try {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
      localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, String(lineHeight));
      localStorage.setItem(STORAGE_KEY_FONT_FAMILY, fontFamily);
    } catch {
      // ignore
    }
  }, [fontSize, lineHeight, fontFamily, applySettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FOCUS, String(focusMode));
    } catch {
      // ignore
    }
  }, [focusMode]);

  const shouldHide = isNearFooter && !isOpen;
  const currentTheme = THEMES.find((t) => t.value === theme) || THEMES[0];
  const CurrentThemeIcon = currentTheme.Icon;

  return (
    <>
      {/* Floating action button — shows the current theme icon as the affordance */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[997] w-14 h-14 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-primary hover:text-amber transition-all duration-300 hover:scale-105 ${
          shouldHide
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        aria-label={`Reading settings (current theme: ${currentTheme.label})`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {isOpen ? (
          <X size={20} strokeWidth={1.8} />
        ) : (
          <CurrentThemeIcon size={20} strokeWidth={1.8} />
        )}
      </button>

      {/* Settings panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[996]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-label="Reading settings"
            className="fixed bottom-[72px] right-4 left-4 md:left-auto md:bottom-24 md:right-8 z-[997] md:w-[444px] max-w-full rounded-[14px] bg-bg animate-in fade-in slide-in-from-bottom-3 duration-200 overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            <div className="p-6 flex flex-col gap-6">
              {/* ============ THEME ============ */}
              <section className="flex flex-col gap-2">
                <SectionLabel>Theme</SectionLabel>
                <div className="flex gap-2">
                  {THEMES.map((t) => {
                    const active = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTheme(t.value)}
                        aria-pressed={active}
                        className={`flex-1 min-w-0 flex items-center gap-2 pl-2 pr-3 py-2 rounded-full border transition-colors ${
                          active
                            ? "bg-highlight-bg border-amber"
                            : "border-border hover:bg-bg-subtle"
                        }`}
                      >
                        <span
                          className="shrink-0 w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: t.swatch }}
                          aria-hidden="true"
                        />
                        <span
                          className={`flex-1 text-[14px] font-semibold font-inter truncate text-center ${
                            active ? "text-amber" : "text-text-secondary"
                          }`}
                        >
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <Divider />

              {/* ============ FONT + SLIDERS ============ */}
              <section className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <SectionLabel>Font</SectionLabel>
                    <span className="text-[14px] text-text-muted font-inter tabular-nums">
                      {fontSize}px
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {FONT_FAMILIES.map((f) => {
                      const active = fontFamily === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setFontFamily(f.value)}
                          aria-pressed={active}
                          className={`flex-1 min-w-0 flex items-end justify-center gap-2 px-3 py-3 rounded-full border transition-colors ${
                            active
                              ? "bg-highlight-bg border-amber"
                              : "border-border hover:bg-bg-subtle"
                          }`}
                        >
                          <span
                            className={`text-[22px] leading-[22px] font-semibold ${
                              active ? "text-amber" : "text-text-secondary"
                            }`}
                            style={{ fontFamily: f.cssVar }}
                          >
                            {f.sample}
                          </span>
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-[0.05em] font-inter leading-[18px] ${
                              active ? "text-amber" : "text-text-muted"
                            }`}
                          >
                            {f.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text size slider */}
                <div className="flex items-center gap-5">
                  <span className="text-[14px] text-text-primary font-inter shrink-0">
                    − A
                  </span>
                  <Slider
                    min={FONT_SIZE_MIN}
                    max={FONT_SIZE_MAX}
                    step={1}
                    value={fontSize}
                    onChange={setFontSize}
                    ariaLabel="Text size"
                  />
                  <span className="text-[18px] font-semibold text-text-primary font-inter shrink-0">
                    A +
                  </span>
                </div>

                {/* Line spacing slider */}
                <div className="flex items-center gap-5">
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-text-primary">
                    <Menu size={20} strokeWidth={1.8} />
                  </span>
                  <Slider
                    min={LINE_HEIGHT_MIN}
                    max={LINE_HEIGHT_MAX}
                    step={0.1}
                    value={lineHeight}
                    onChange={(v) =>
                      setLineHeight(Math.round(v * 10) / 10)
                    }
                    ariaLabel="Line spacing"
                  />
                  <span className="text-[18px] font-semibold text-text-primary font-inter tabular-nums shrink-0 w-8 text-right">
                    {lineHeight.toFixed(1)}
                  </span>
                </div>
              </section>

              <Divider />

              {/* ============ FOCUS MODE ============ */}
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="shrink-0 w-10 h-10 rounded-full border border-border bg-bg flex items-center justify-center text-text-primary"
                    aria-hidden="true"
                  >
                    <Focus size={18} strokeWidth={1.8} />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] text-text-primary font-inter leading-tight">
                      Focus Mode
                    </p>
                    <p className="text-[12px] text-text-muted font-inter leading-tight mt-0.5">
                      Highlight active paragraph
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={focusMode}
                  onChange={setFocusMode}
                  ariaLabel="Focus mode"
                />
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ============================================
   Sub-components
   ============================================ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] uppercase tracking-[0.04em] text-text-primary font-inter">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-border" />;
}

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}

function Slider({ min, max, step, value, onChange, ariaLabel }: SliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      // Snap to step
      const snapped = Math.round(raw / step) * step;
      const clamped = Math.max(min, Math.min(max, snapped));
      onChange(clamped);
    },
    [min, max, step, onChange]
  );

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => updateFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, updateFromClientX]);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(min, value - step));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(max, value + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange(min);
    } else if (e.key === "End") {
      e.preventDefault();
      onChange(max);
    }
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      onKeyDown={handleKey}
      onPointerDown={(e) => {
        e.preventDefault();
        setDragging(true);
        updateFromClientX(e.clientX);
      }}
      className="flex-1 min-w-0 h-[5px] rounded-full bg-bg-subtle relative cursor-pointer touch-none select-none"
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-amber"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full bg-amber border-2 border-bg-card pointer-events-none"
        style={{
          left: `${percent}%`,
          transform: "translate(-50%, -50%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}

function ToggleSwitch({ checked, onChange, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative w-[52px] h-[30px] rounded-full transition-colors shrink-0 ${
        checked ? "bg-amber" : "bg-border"
      }`}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[24px] h-[24px] rounded-full bg-white transition-transform duration-200"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(0)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        aria-hidden="true"
      />
    </button>
  );
}
