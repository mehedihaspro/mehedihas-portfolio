"use client";

import { useEffect, useState, useCallback } from "react";
import {
  X,
  Sun,
  BookOpen,
  Moon,
  Eclipse,
  Eye,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

const STORAGE_KEY_FONT_SIZE = "mehedihas-font-size";
const STORAGE_KEY_LINE_HEIGHT = "mehedihas-line-height";
const STORAGE_KEY_FOCUS = "mehedihas-focus-mode";
const STORAGE_KEY_FONT_FAMILY = "mehedihas-font-family";
const STORAGE_KEY_CONTENT_WIDTH = "mehedihas-content-width";

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

const CONTENT_WIDTHS = [
  { value: "narrow" as const, label: "Narrow", width: "600px", bar: 12 },
  { value: "default" as const, label: "Default", width: "680px", bar: 18 },
  { value: "wide" as const, label: "Wide", width: "780px", bar: 24 },
];

type FontFamily = (typeof FONT_FAMILIES)[number]["value"];
type ContentWidth = (typeof CONTENT_WIDTHS)[number]["value"];

function readStored<T>(key: string, fallback: T, transform: (v: string) => T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : transform(raw);
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
    readStored<FontFamily>(STORAGE_KEY_FONT_FAMILY, "sans", (v) => v as FontFamily)
  );
  const [contentWidth, setContentWidth] = useState<ContentWidth>(() =>
    readStored<ContentWidth>(
      STORAGE_KEY_CONTENT_WIDTH,
      "default",
      (v) => v as ContentWidth
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

    const widthDef = CONTENT_WIDTHS.find((w) => w.value === contentWidth);
    if (widthDef) article.style.maxWidth = widthDef.width;
  }, [fontSize, lineHeight, fontFamily, contentWidth]);

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
      localStorage.setItem(STORAGE_KEY_CONTENT_WIDTH, contentWidth);
    } catch {
      // ignore
    }
  }, [fontSize, lineHeight, fontFamily, contentWidth, applySettings]);

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(28, Math.max(14, prev + delta)));
  };

  const adjustLineHeight = (delta: number) => {
    setLineHeight((prev) =>
      Math.min(2.6, Math.max(1.4, Math.round((prev + delta) * 10) / 10))
    );
  };

  const toggleFocusMode = () => {
    const next = !focusMode;
    setFocusMode(next);
    localStorage.setItem(STORAGE_KEY_FOCUS, String(next));
    document.body.classList.toggle("focus-mode", next);
  };

  const currentTheme = THEMES.find((t) => t.value === theme) || THEMES[0];
  const FabIcon = currentTheme.Icon;
  const shouldHide = isNearFooter && !isOpen;

  return (
    <>
      {/* Floating action button — theme icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[997] w-12 h-12 rounded-full bg-bg-card flex items-center justify-center text-text-primary hover:text-amber transition-all duration-300 hover:scale-105 ${
          shouldHide
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        aria-label="Reading settings"
        style={{
          boxShadow:
            "0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {isOpen ? <X size={17} /> : <FabIcon size={17} strokeWidth={1.8} />}
      </button>

      {/* Settings panel — aesthetic, soft shadows, no heavy borders */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[996]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed bottom-[72px] right-4 left-4 md:left-auto md:bottom-24 md:right-8 z-[997] md:w-[320px] max-w-full rounded-[22px] bg-bg-card animate-in fade-in slide-in-from-bottom-3 duration-200 overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            <div className="p-5 space-y-5">
              {/* Theme */}
              <section>
                <Label>Theme</Label>
                <div className="flex flex-col gap-1">
                  {THEMES.map((t) => {
                    const TIcon = t.Icon;
                    const active = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`group flex items-center gap-3 p-2 rounded-[12px] transition-all text-left ${
                          active ? "bg-highlight-bg" : "hover:bg-bg-subtle"
                        }`}
                      >
                        <div
                          className="w-8 h-8 shrink-0 rounded-[9px] flex items-center justify-center"
                          style={{
                            backgroundColor: t.bg,
                            boxShadow:
                              "inset 0 0 0 1px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                          }}
                        >
                          <TIcon
                            size={13}
                            style={{ color: t.fg }}
                            strokeWidth={1.8}
                          />
                        </div>
                        <span
                          className={`flex-1 text-[13px] font-semibold font-inter transition-colors ${
                            active ? "text-amber" : "text-text-primary"
                          }`}
                        >
                          {t.label}
                        </span>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-amber flex items-center justify-center shrink-0">
                            <Check
                              size={10}
                              className="text-white"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Font */}
              <section>
                <Label>Font</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {FONT_FAMILIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFontFamily(f.value)}
                      className={`relative rounded-[12px] py-3 transition-all ${
                        fontFamily === f.value
                          ? "bg-highlight-bg ring-[1.5px] ring-amber"
                          : "bg-bg-subtle hover:bg-cream"
                      }`}
                    >
                      <span
                        className="block text-[22px] leading-none mb-1 text-text-primary"
                        style={{ fontFamily: f.cssVar }}
                      >
                        {f.sample}
                      </span>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                        {f.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Text Size */}
              <section>
                <div className="flex items-center justify-between mb-1.5">
                  <Label inline>Text Size</Label>
                  <span className="text-[11px] font-bold text-amber font-mono tabular-nums">
                    {fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-subtle rounded-[12px] p-1">
                  <button
                    onClick={() => adjustFontSize(-1)}
                    disabled={fontSize <= 14}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[9px] text-text-primary hover:bg-bg-card hover:text-amber transition-colors disabled:opacity-30"
                    aria-label="Decrease"
                  >
                    <Minus size={11} />
                    <span className="text-[12px] font-semibold">A</span>
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-1 py-2.5">
                    <div
                      className="h-0.5 rounded-full bg-amber/30 flex-1 relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-amber rounded-full transition-all"
                        style={{
                          width: `${((fontSize - 14) / (28 - 14)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => adjustFontSize(1)}
                    disabled={fontSize >= 28}
                    className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[9px] text-text-primary hover:bg-bg-card hover:text-amber transition-colors disabled:opacity-30"
                    aria-label="Increase"
                  >
                    <span className="text-[18px] font-bold">A</span>
                    <Plus size={11} />
                  </button>
                </div>
              </section>

              {/* Line Spacing */}
              <section>
                <div className="flex items-center justify-between mb-1.5">
                  <Label inline>Line Spacing</Label>
                  <span className="text-[11px] font-bold text-amber font-mono tabular-nums">
                    {lineHeight.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-subtle rounded-[12px] p-1">
                  <button
                    onClick={() => adjustLineHeight(-0.1)}
                    disabled={lineHeight <= 1.4}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-[9px] text-text-primary hover:bg-bg-card hover:text-amber transition-colors disabled:opacity-30"
                    aria-label="Decrease"
                  >
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                    </div>
                  </button>
                  <div className="flex-1 flex items-center justify-center py-2.5">
                    <div
                      className="h-0.5 rounded-full bg-amber/30 flex-1 relative overflow-hidden"
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-amber rounded-full transition-all"
                        style={{
                          width: `${((lineHeight - 1.4) / (2.6 - 1.4)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => adjustLineHeight(0.1)}
                    disabled={lineHeight >= 2.6}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-[9px] text-text-primary hover:bg-bg-card hover:text-amber transition-colors disabled:opacity-30"
                    aria-label="Increase"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                    </div>
                  </button>
                </div>
              </section>

              {/* Content Width */}
              <section>
                <Label>Width</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {CONTENT_WIDTHS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setContentWidth(w.value)}
                      className={`rounded-[12px] py-2.5 transition-all ${
                        contentWidth === w.value
                          ? "bg-highlight-bg ring-[1.5px] ring-amber"
                          : "bg-bg-subtle hover:bg-cream"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <div
                          className={`h-3 rounded-sm transition-colors ${
                            contentWidth === w.value
                              ? "bg-amber"
                              : "bg-text-muted/30"
                          }`}
                          style={{ width: `${w.bar}px` }}
                        />
                      </div>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                        {w.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Focus Mode */}
              <section className="pt-3 mt-1 border-t border-border/60">
                <button
                  onClick={toggleFocusMode}
                  className="w-full flex items-center gap-3 group"
                  aria-label={`${focusMode ? "Disable" : "Enable"} focus mode`}
                  role="switch"
                  aria-checked={focusMode}
                >
                  <div
                    className={`w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 transition-colors ${
                      focusMode ? "bg-highlight-bg text-amber" : "bg-bg-subtle text-text-secondary"
                    }`}
                  >
                    <Eye size={14} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[13px] font-semibold text-text-primary font-inter">
                      Focus Mode
                    </p>
                    <p className="text-[10px] text-text-muted font-inter leading-tight">
                      Highlight active paragraph
                    </p>
                  </div>
                  <div
                    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                      focusMode ? "bg-amber" : "bg-border"
                    }`}
                  >
                    <div
                      className="absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white transition-transform duration-200"
                      style={{
                        transform: focusMode
                          ? "translateX(16px)"
                          : "translateX(0)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    />
                  </div>
                </button>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Label({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter ${
        inline ? "" : "mb-2"
      }`}
    >
      {children}
    </p>
  );
}
