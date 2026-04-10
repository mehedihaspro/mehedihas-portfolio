"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, ALargeSmall, WrapText } from "lucide-react";

const STORAGE_KEY_FONT_SIZE = "mehedihas-font-size";
const STORAGE_KEY_LINE_HEIGHT = "mehedihas-line-height";

export function ReadingSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);

  useEffect(() => {
    const savedFontSize = localStorage.getItem(STORAGE_KEY_FONT_SIZE);
    const savedLineHeight = localStorage.getItem(STORAGE_KEY_LINE_HEIGHT);
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineHeight) setLineHeight(Number(savedLineHeight));
  }, []);

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
      Math.min(2.4, Math.max(1.4, Math.round((prev + delta) * 10) / 10))
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-cream transition-all"
        aria-label="Reading settings"
      >
        <SlidersHorizontal size={15} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-[1000] w-64 rounded-xl bg-bg-card border border-border shadow-modal p-4">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-4">
              Reading Settings
            </p>

            {/* Font Size */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ALargeSmall size={13} className="text-text-muted" />
                  <span className="text-[12px] text-text-secondary">Font Size</span>
                </div>
                <span className="text-[12px] text-text-muted font-mono">
                  {fontSize}px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustFontSize(-1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-xs font-bold"
                >
                  A
                </button>
                <div className="flex-1 h-1 rounded-full bg-bg-subtle relative">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${((fontSize - 14) / (26 - 14)) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => adjustFontSize(1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-sm font-bold"
                >
                  A
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <WrapText size={13} className="text-text-muted" />
                  <span className="text-[12px] text-text-secondary">Line Height</span>
                </div>
                <span className="text-[12px] text-text-muted font-mono">
                  {lineHeight.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustLineHeight(-0.1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-xs"
                >
                  -
                </button>
                <div className="flex-1 h-1 rounded-full bg-bg-subtle relative">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${((lineHeight - 1.4) / (2.4 - 1.4)) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => adjustLineHeight(0.1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
