"use client";

import { useEffect, useState } from "react";
import { Settings2, Type, AlignJustify, Palette, Focus, X } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

const STORAGE_KEY_FONT_SIZE = "mehedihas-font-size";
const STORAGE_KEY_LINE_HEIGHT = "mehedihas-line-height";
const STORAGE_KEY_FOCUS = "mehedihas-focus-mode";

const THEMES = [
  { value: "light" as const, label: "Light", color: "#FAF5EE" },
  { value: "sepia" as const, label: "Sepia", color: "#F4EADB" },
  { value: "dark" as const, label: "Dark", color: "#1C1C1E" },
  { value: "night" as const, label: "Night", color: "#000000" },
];

interface ReadingSettingsProps {
  onFocusModeChange?: (enabled: boolean) => void;
}

export function ReadingSettings({ onFocusModeChange }: ReadingSettingsProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.9);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    const savedLineHeight = localStorage.getItem(STORAGE_KEY_LINE_HEIGHT);
    const savedFocus = localStorage.getItem(STORAGE_KEY_FOCUS);
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
    if (savedFocus === "true") {
      setFocusMode(true);
      onFocusModeChange?.(true);
    }
  }, [onFocusModeChange]);

  useEffect(() => {
    const article = document.querySelector("[data-article-body]");
    if (article instanceof HTMLElement) {
      article.style.fontSize = `${fontSize}px`;
      article.style.lineHeight = `${lineHeight}`;
    }
    localStorage.setItem(STORAGE_KEY_FONT_SIZE, String(fontSize));
    localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, String(lineHeight));
  }, [fontSize, lineHeight]);

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.min(26, Math.max(14, prev + delta)));
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
    onFocusModeChange?.(next);
    document.body.classList.toggle("focus-mode", next);
  };

  return (
    <>
      {/* Floating action button — bottom right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[999] w-12 h-12 rounded-full bg-bg-card border border-border shadow-lg hover:shadow-xl flex items-center justify-center text-text-primary hover:text-amber transition-all duration-200 hover:scale-105"
        aria-label="Reading settings"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      >
        {isOpen ? <X size={18} /> : <Settings2 size={18} />}
      </button>

      {/* Settings panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed bottom-24 right-8 z-[999] w-[340px] rounded-[18px] bg-bg-card border border-border p-6 animate-in fade-in slide-in-from-bottom-4 duration-200"
            style={{
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-text-primary font-inter">
                Reading Settings
              </h3>
            </div>

            {/* Font Size */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Type size={12} className="text-text-muted" />
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                  Text Size
                </span>
              </div>
              <div className="flex items-stretch rounded-[10px] border-[1.5px] border-border overflow-hidden">
                <button
                  onClick={() => adjustFontSize(-1)}
                  disabled={fontSize <= 14}
                  className="flex-1 py-3 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary border-r-[1.5px] border-border font-inter"
                  aria-label="Decrease font size"
                >
                  <span className="text-[14px] font-semibold">A</span>
                </button>
                <div className="flex-1 flex items-center justify-center border-r-[1.5px] border-border">
                  <span className="text-[14px] font-bold text-amber font-inter">
                    {fontSize}px
                  </span>
                </div>
                <button
                  onClick={() => adjustFontSize(1)}
                  disabled={fontSize >= 26}
                  className="flex-1 py-3 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary font-inter"
                  aria-label="Increase font size"
                >
                  <span className="text-[20px] font-bold">A</span>
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <AlignJustify size={12} className="text-text-muted" />
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                  Line Spacing
                </span>
              </div>
              <div className="flex items-stretch rounded-[10px] border-[1.5px] border-border overflow-hidden">
                <button
                  onClick={() => adjustLineHeight(-0.1)}
                  disabled={lineHeight <= 1.4}
                  className="flex-1 py-3 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary border-r-[1.5px] border-border font-inter text-[16px]"
                  aria-label="Decrease line height"
                >
                  ≡
                </button>
                <div className="flex-1 flex items-center justify-center border-r-[1.5px] border-border">
                  <span className="text-[14px] font-bold text-amber font-inter">
                    {lineHeight.toFixed(1)}
                  </span>
                </div>
                <button
                  onClick={() => adjustLineHeight(0.1)}
                  disabled={lineHeight >= 2.6}
                  className="flex-1 py-3 text-text-primary hover:bg-highlight-bg hover:text-amber transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-primary font-inter text-[18px]"
                  aria-label="Increase line height"
                >
                  ≣
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Palette size={12} className="text-text-muted" />
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                  Theme
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-[10px] border-2 transition-all ${
                      theme === t.value
                        ? "border-amber bg-highlight-bg"
                        : "border-border hover:border-amber/50"
                    }`}
                    aria-label={`${t.label} theme`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border-2"
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
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-text-muted font-inter">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Mode */}
            <div>
              <div className="flex items-center justify-between pt-5 border-t border-border">
                <div className="flex items-center gap-2">
                  <Focus size={14} className="text-text-secondary" />
                  <span className="text-[14px] font-medium text-text-primary font-inter">
                    Focus Mode
                  </span>
                </div>
                <button
                  onClick={toggleFocusMode}
                  className={`relative w-11 h-[26px] rounded-[13px] transition-colors ${
                    focusMode ? "bg-amber" : "bg-border"
                  }`}
                  aria-label={`${focusMode ? "Disable" : "Enable"} focus mode`}
                  role="switch"
                  aria-checked={focusMode}
                >
                  <div
                    className="absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-250"
                    style={{
                      transform: focusMode
                        ? "translateX(18px)"
                        : "translateX(0)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  />
                </button>
              </div>
              {focusMode && (
                <p className="text-[11px] text-text-muted mt-2 font-inter leading-relaxed">
                  Only the paragraph you&apos;re reading stays visible. Others fade.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
