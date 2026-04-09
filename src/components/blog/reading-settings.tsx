"use client";

import { useState, useEffect } from "react";

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
        <SettingsIcon />
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
                <span className="text-[12px] text-text-secondary">
                  Font Size
                </span>
                <span className="text-[12px] text-text-muted font-mono">
                  {fontSize}px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustFontSize(-1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-sm font-bold"
                >
                  A
                </button>
                <div className="flex-1 h-1 rounded-full bg-bg-subtle relative">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{
                      width: `${((fontSize - 14) / (26 - 14)) * 100}%`,
                    }}
                  />
                </div>
                <button
                  onClick={() => adjustFontSize(1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary text-base font-bold"
                >
                  A
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-text-secondary">
                  Line Height
                </span>
                <span className="text-[12px] text-text-muted font-mono">
                  {lineHeight.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustLineHeight(-0.1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary"
                >
                  <CompactIcon />
                </button>
                <div className="flex-1 h-1 rounded-full bg-bg-subtle relative">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{
                      width: `${((lineHeight - 1.4) / (2.4 - 1.4)) * 100}%`,
                    }}
                  />
                </div>
                <button
                  onClick={() => adjustLineHeight(0.1)}
                  className="w-8 h-8 rounded-lg bg-bg-subtle border border-border flex items-center justify-center text-text-secondary hover:text-text-primary"
                >
                  <SpacedIcon />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="10" y2="12" />
      <circle cx="5" cy="4" r="1.5" fill="currentColor" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" />
      <circle cx="7" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CompactIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="2" y1="4" x2="12" y2="4" />
      <line x1="2" y1="7" x2="12" y2="7" />
      <line x1="2" y1="10" x2="12" y2="10" />
    </svg>
  );
}

function SpacedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="2" y1="2" x2="12" y2="2" />
      <line x1="2" y1="7" x2="12" y2="7" />
      <line x1="2" y1="12" x2="12" y2="12" />
    </svg>
  );
}
