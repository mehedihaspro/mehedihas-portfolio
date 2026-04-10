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
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { useFooterVisibility } from "@/hooks/use-footer-visibility";

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
  const isNearFooter = useFooterVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [focusMode, setFocusMode] = useState(false);
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [contentWidth, setContentWidth] = useState<ContentWidth>("default");

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

  // Icon reflects current theme
  const currentThemeMeta =
    THEMES.find((t) => t.value === theme) || THEMES[0];
  const FabIcon = currentThemeMeta.Icon;

  // Hide when near footer (unless open)
  const shouldHide = isNearFooter && !isOpen;

  return (
    <>
      {/* Floating action button — theme icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[997] w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-primary hover:text-amber transition-all duration-300 hover:scale-105 ${
          shouldHide
            ? "opacity-0 translate-y-6 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        aria-label="Reading settings"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      >
        {isOpen ? <X size={17} /> : <FabIcon size={17} strokeWidth={1.8} />}
      </button>

      {/* Settings panel — compact, no blur backdrop */}
      {isOpen && (
        <>
          {/* Invisible click target (no blur, no dim) */}
          <div
            className="fixed inset-0 z-[996]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed bottom-[72px] right-4 left-4 md:left-auto md:bottom-24 md:right-8 z-[997] md:w-[320px] max-w-full rounded-[18px] bg-bg-card border border-border animate-in fade-in slide-in-from-bottom-3 duration-200 overflow-hidden"
            style={{
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.15), 0 6px 20px rgba(0,0,0,0.08)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
            }}
          >
            <div className="p-4 space-y-4">
              {/* Theme — moved to top since it's the primary function */}
              <div>
                <Label>Theme</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {THEMES.map((t) => {
                    const TIcon = t.Icon;
                    const active = theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`relative flex flex-col items-center gap-1 py-2.5 rounded-[10px] border transition-all ${
                          active
                            ? "border-amber bg-highlight-bg"
                            : "border-border hover:border-amber/50"
                        }`}
                        aria-label={`${t.label} theme`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border flex items-center justify-center"
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
                            size={11}
                            className={
                              t.value === "light" || t.value === "sepia"
                                ? "text-[#6B5D4F]"
                                : "text-white/80"
                            }
                            strokeWidth={1.8}
                          />
                        </div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font */}
              <div>
                <Label>Font</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {FONT_FAMILIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFontFamily(f.value)}
                      className={`relative rounded-[10px] border py-2.5 transition-all ${
                        fontFamily === f.value
                          ? "border-amber bg-highlight-bg"
                          : "border-border hover:border-amber/50"
                      }`}
                    >
                      <span
                        className="block text-[22px] leading-none mb-0.5 text-text-primary"
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
              </div>

              {/* Text Size */}
              <div>
                <Label>Text Size</Label>
                <div className="flex items-stretch rounded-[10px] border border-border overflow-hidden">
                  <button
                    onClick={() => adjustFontSize(-1)}
                    disabled={fontSize <= 14}
                    className="flex-1 py-2.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-r border-border flex items-center justify-center gap-1"
                    aria-label="Decrease"
                  >
                    <Minus size={11} />
                    <span className="text-[12px] font-semibold">A</span>
                  </button>
                  <div className="flex-1 flex items-center justify-center border-r border-border">
                    <span className="text-[12px] font-bold text-amber font-mono tabular-nums">
                      {fontSize}px
                    </span>
                  </div>
                  <button
                    onClick={() => adjustFontSize(1)}
                    disabled={fontSize >= 28}
                    className="flex-1 py-2.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                    aria-label="Increase"
                  >
                    <span className="text-[17px] font-bold">A</span>
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              {/* Line Spacing */}
              <div>
                <Label>Line Spacing</Label>
                <div className="flex items-stretch rounded-[10px] border border-border overflow-hidden">
                  <button
                    onClick={() => adjustLineHeight(-0.1)}
                    disabled={lineHeight <= 1.4}
                    className="flex-1 py-2.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 border-r border-border"
                    aria-label="Decrease"
                  >
                    <div className="flex flex-col items-center gap-[2px]">
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                    </div>
                  </button>
                  <div className="flex-1 flex items-center justify-center border-r border-border">
                    <span className="text-[12px] font-bold text-amber font-mono tabular-nums">
                      {lineHeight.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => adjustLineHeight(0.1)}
                    disabled={lineHeight >= 2.6}
                    className="flex-1 py-2.5 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40"
                    aria-label="Increase"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                      <div className="w-3.5 h-[1.5px] bg-current rounded-full" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Content Width */}
              <div>
                <Label>Width</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {CONTENT_WIDTHS.map((w) => (
                    <button
                      key={w.value}
                      onClick={() => setContentWidth(w.value)}
                      className={`rounded-[10px] border py-2 transition-all ${
                        contentWidth === w.value
                          ? "border-amber bg-highlight-bg"
                          : "border-border hover:border-amber/50"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <div
                          className={`h-3 rounded-sm ${
                            contentWidth === w.value
                              ? "bg-amber"
                              : "bg-text-muted/30"
                          }`}
                          style={{
                            width:
                              w.value === "narrow"
                                ? "12px"
                                : w.value === "default"
                                ? "18px"
                                : "24px",
                          }}
                        />
                      </div>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                        {w.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Mode */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Eye size={13} className="text-text-secondary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary font-inter">
                        Focus Mode
                      </p>
                      <p className="text-[10px] text-text-muted font-inter leading-tight">
                        Highlight active paragraph
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleFocusMode}
                    className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                      focusMode ? "bg-amber" : "bg-border"
                    }`}
                    aria-label={`${focusMode ? "Disable" : "Enable"} focus mode`}
                    role="switch"
                    aria-checked={focusMode}
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter mb-1.5">
      {children}
    </p>
  );
}
