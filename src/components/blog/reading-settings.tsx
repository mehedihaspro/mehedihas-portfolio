"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Settings2,
  X,
  Sun,
  BookOpen,
  Moon,
  Eclipse,
  Eye,
  Minus,
  Plus,
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

const STORAGE_KEY_FONT_SIZE = "mehedihas-font-size";
const STORAGE_KEY_LINE_HEIGHT = "mehedihas-line-height";
const STORAGE_KEY_FOCUS = "mehedihas-focus-mode";
const STORAGE_KEY_FONT_FAMILY = "mehedihas-font-family";
const STORAGE_KEY_CONTENT_WIDTH = "mehedihas-content-width";

const THEMES = [
  { value: "light" as const, label: "Light", Icon: Sun, color: "#FAF5EE" },
  { value: "sepia" as const, label: "Sepia", Icon: BookOpen, color: "#F4EADB" },
  { value: "dark" as const, label: "Dark", Icon: Moon, color: "#1C1C1E" },
  { value: "night" as const, label: "Night", Icon: Eclipse, color: "#000000" },
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
  { value: "narrow" as const, label: "Narrow", width: "600px" },
  { value: "default" as const, label: "Default", width: "680px" },
  { value: "wide" as const, label: "Wide", width: "780px" },
];

type FontFamily = (typeof FONT_FAMILIES)[number]["value"];
type ContentWidth = (typeof CONTENT_WIDTHS)[number]["value"];

export function ReadingSettings() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [focusMode, setFocusMode] = useState(false);
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("default");

  // Apply all settings to the article
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

  // Load from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    const savedLineHeight = localStorage.getItem(STORAGE_KEY_LINE_HEIGHT);
    const savedFocus = localStorage.getItem(STORAGE_KEY_FOCUS);
    const savedFontFamily = localStorage.getItem(STORAGE_KEY_FONT_FAMILY);
    const savedContentWidth = localStorage.getItem(STORAGE_KEY_CONTENT_WIDTH);

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedFocus === "true") {
      setFocusMode(true);
      document.body.classList.add("focus-mode");
    }
    if (savedFontFamily) setFontFamily(savedFontFamily as FontFamily);
    if (savedContentWidth) setContentWidth(savedContentWidth as ContentWidth);
  }, []);

  // Apply settings whenever they change
  useEffect(() => {
    applySettings();
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
    localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, String(lineHeight));
    localStorage.setItem(STORAGE_KEY_FONT_FAMILY, fontFamily);
    localStorage.setItem(STORAGE_KEY_CONTENT_WIDTH, contentWidth);
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

  return (
    <>
      {/* Floating action button — bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[999] w-12 h-12 md:w-14 md:h-14 rounded-full bg-bg-card border border-border shadow-xl hover:shadow-2xl flex items-center justify-center text-text-primary hover:text-amber transition-all duration-200 hover:scale-105"
        aria-label="Reading settings"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      >
        {isOpen ? <X size={18} /> : <Settings2 size={18} />}
      </button>

      {/* Settings panel — bigger, more organized */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:bottom-28 z-[999] md:w-[400px] max-w-full rounded-[20px] bg-bg-card border border-border p-0 animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden"
            style={{
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)",
              maxHeight: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-text-primary font-inter">
                Reading Settings
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Font Family */}
              <div>
                <SectionLabel label="Font" />
                <div className="grid grid-cols-3 gap-2">
                  {FONT_FAMILIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFontFamily(f.value)}
                      className={`relative rounded-[12px] border-2 py-4 transition-all ${
                        fontFamily === f.value
                          ? "border-amber bg-highlight-bg"
                          : "border-border hover:border-amber/50"
                      }`}
                    >
                      <span
                        className="block text-[26px] leading-none mb-1 text-text-primary"
                        style={{ fontFamily: f.cssVar }}
                      >
                        {f.sample}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted font-inter">
                        {f.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div>
                <SectionLabel label="Text Size" value={`${fontSize}px`} />
                <div className="flex items-stretch rounded-[12px] border-[1.5px] border-border overflow-hidden">
                  <button
                    onClick={() => adjustFontSize(-1)}
                    disabled={fontSize <= 14}
                    className="flex-1 py-3.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-r-[1.5px] border-border flex items-center justify-center gap-1.5"
                    aria-label="Decrease"
                  >
                    <Minus size={12} />
                    <span className="text-[13px] font-semibold">A</span>
                  </button>
                  <div className="flex-[2] flex items-center justify-center relative">
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 rounded-full bg-bg-subtle overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber transition-all"
                        style={{
                          width: `${((fontSize - 14) / (28 - 14)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => adjustFontSize(1)}
                    disabled={fontSize >= 28}
                    className="flex-1 py-3.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-l-[1.5px] border-border flex items-center justify-center gap-1.5"
                    aria-label="Increase"
                  >
                    <span className="text-[20px] font-bold">A</span>
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <SectionLabel
                  label="Line Spacing"
                  value={lineHeight.toFixed(1)}
                />
                <div className="flex items-stretch rounded-[12px] border-[1.5px] border-border overflow-hidden">
                  <button
                    onClick={() => adjustLineHeight(-0.1)}
                    disabled={lineHeight <= 1.4}
                    className="flex-1 py-3.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-r-[1.5px] border-border"
                    aria-label="Decrease"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                    </div>
                  </button>
                  <div className="flex-[2] flex items-center justify-center relative">
                    <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 rounded-full bg-bg-subtle overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber transition-all"
                        style={{
                          width: `${((lineHeight - 1.4) / (2.6 - 1.4)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => adjustLineHeight(0.1)}
                    disabled={lineHeight >= 2.6}
                    className="flex-1 py-3.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-l-[1.5px] border-border"
                    aria-label="Increase"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                      <div className="w-4 h-0.5 bg-current rounded-full" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Content Width */}
              <div>
                <SectionLabel label="Content Width" />
                <div className="grid grid-cols-3 gap-2">
                  {CONTENT_WIDTHS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setContentWidth(w.value)}
                      className={`rounded-[12px] border-2 py-3 transition-all ${
                        contentWidth === w.value
                          ? "border-amber bg-highlight-bg"
                          : "border-border hover:border-amber/50"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1.5">
                        <div
                          className={`h-4 rounded-sm ${
                            contentWidth === w.value
                              ? "bg-amber"
                              : "bg-text-muted/30"
                          }`}
                          style={{
                            width:
                              w.value === "narrow"
                                ? "14px"
                                : w.value === "default"
                                ? "22px"
                                : "30px",
                          }}
                        />
                      </div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted font-inter">
                        {w.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <SectionLabel label="Theme" />
                <div className="grid grid-cols-4 gap-2">
                  {THEMES.map((t) => {
                    const TIcon = t.Icon;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`relative flex flex-col items-center gap-2 py-3 px-1 rounded-[12px] border-2 transition-all ${
                          theme === t.value
                            ? "border-amber bg-highlight-bg"
                            : "border-border hover:border-amber/50"
                        }`}
                        aria-label={`${t.label} theme`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border flex items-center justify-center"
                          style={{
                            backgroundColor: t.color,
                            borderColor:
                              t.value === "light"
                                ? "rgba(0,0,0,0.08)"
                                : t.value === "sepia"
                                ? "#D4C5AE"
                                : t.value === "dark"
                                ? "#38383A"
                                : "#2C2C2E",
                          }}
                        >
                          <TIcon
                            size={14}
                            className={
                              t.value === "light" || t.value === "sepia"
                                ? "text-[#6B5D4F]"
                                : "text-white/80"
                            }
                            strokeWidth={1.8}
                          />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Mode */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0">
                      <Eye size={15} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-text-primary font-inter">
                        Focus Mode
                      </p>
                      <p className="text-[11px] text-text-muted font-inter leading-tight">
                        Highlight the paragraph you&apos;re reading
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleFocusMode}
                    className={`relative w-11 h-[26px] rounded-[13px] transition-colors shrink-0 ${
                      focusMode ? "bg-amber" : "bg-border"
                    }`}
                    aria-label={`${focusMode ? "Disable" : "Enable"} focus mode`}
                    role="switch"
                    aria-checked={focusMode}
                  >
                    <div
                      className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white transition-transform duration-250"
                      style={{
                        transform: focusMode
                          ? "translateX(18px)"
                          : "translateX(0)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function SectionLabel({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
        {label}
      </span>
      {value && (
        <span className="text-[13px] font-bold text-amber font-mono tabular-nums font-inter">
          {value}
        </span>
      )}
    </div>
  );
}
