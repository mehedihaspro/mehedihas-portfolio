"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check, X } from "lucide-react";

type Language = "ALL" | "BANGLA" | "ENGLISH";

interface LanguageFilterProps {
  categories: string[];
  onLanguageSelect: (language: Language) => void;
  onCategorySelect: (category: string | null) => void;
  postCount: number;
  activeLanguage: Language;
  activeCategory: string | null;
}

export function LanguageFilter({
  categories,
  onLanguageSelect,
  onCategorySelect,
  postCount,
  activeLanguage,
  activeCategory,
}: LanguageFilterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const languages: Language[] = ["ALL", "BANGLA", "ENGLISH"];
  const hasActiveCategory = !!activeCategory;
  const hasAnyFilter = activeLanguage !== "ALL" || hasActiveCategory;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 sm:gap-4">
      {/* Left: Language pills — wrap gracefully on very narrow screens */}
      <div className="flex items-center gap-2 flex-wrap">
        {languages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => onLanguageSelect(lang)}
            aria-pressed={activeLanguage === lang}
            className={`h-11 px-4 md:px-5 rounded-full border text-[13px] md:text-[14px] font-semibold font-inter transition-colors ${
              activeLanguage === lang
                ? "bg-highlight-bg border-amber text-amber"
                : "bg-bg border-border text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Right: Article count + filter button. On mobile this sits on its
          own row, with the count pushed left and the filter button right. */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
        {/* Article count + active filter chip */}
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-[13px] text-text-muted font-inter tabular-nums whitespace-nowrap">
            <span className="font-semibold text-text-primary">{postCount}</span>{" "}
            article{postCount !== 1 ? "s" : ""}
          </p>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={() => {
                onLanguageSelect("ALL");
                onCategorySelect(null);
              }}
              className="flex items-center gap-1 px-2.5 h-6 rounded-full bg-highlight-bg text-[11px] font-semibold text-amber hover:bg-amber/20 transition-colors font-inter"
              aria-label="Clear filters"
            >
              <span>Clear</span>
              <X size={11} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Filter dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-11 h-11 flex items-center justify-center rounded-full border transition-colors relative ${
              hasActiveCategory
                ? "border-amber bg-highlight-bg"
                : showDropdown
                ? "border-amber bg-bg"
                : "border-border bg-bg hover:bg-bg-subtle"
            }`}
            aria-label="Filter by category"
            aria-expanded={showDropdown}
            aria-haspopup="menu"
          >
            <SlidersHorizontal
              size={18}
              className={hasActiveCategory ? "text-amber" : "text-text-primary"}
            />
            {hasActiveCategory && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber"
                aria-hidden="true"
              />
            )}
          </button>

          {/* Dropdown panel — clamped so it doesn't overflow on mobile */}
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-3 z-50 w-[min(320px,calc(100vw-2rem))] rounded-[18px] border border-border bg-bg overflow-hidden"
              role="menu"
              style={{
                boxShadow:
                  "0 20px 50px -12px rgba(0, 0, 0, 0.12), 0 8px 20px -8px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[15px] font-bold text-text-primary font-inter">
                    Filter by category
                  </h4>
                  {hasActiveCategory && (
                    <button
                      onClick={() => {
                        onCategorySelect(null);
                        setShowDropdown(false);
                      }}
                      className="text-[12px] text-amber hover:text-amber-dark font-semibold font-inter"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-text-muted font-inter">
                  Choose a topic to narrow down your search
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-border mx-5" />

              {/* Options list */}
              <div className="p-2 max-h-[400px] overflow-y-auto">
                {/* All Categories */}
                <button
                  onClick={() => {
                    onCategorySelect(null);
                    setShowDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-inter transition-all duration-150 group ${
                    !activeCategory
                      ? "bg-highlight-bg text-amber font-semibold"
                      : "text-text-primary hover:bg-bg-subtle"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full transition-all ${
                        !activeCategory
                          ? "bg-amber"
                          : "bg-text-muted group-hover:bg-text-secondary"
                      }`}
                    />
                    <span>All Categories</span>
                  </div>
                  {!activeCategory && (
                    <Check size={16} className="text-amber" strokeWidth={2.5} />
                  )}
                </button>

                {/* Category items */}
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategorySelect(cat);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-inter transition-all duration-150 group ${
                        activeCategory === cat
                          ? "bg-highlight-bg text-amber font-semibold"
                          : "text-text-primary hover:bg-bg-subtle"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full transition-all ${
                            activeCategory === cat
                              ? "bg-amber"
                              : "bg-text-muted group-hover:bg-text-secondary"
                          }`}
                        />
                        <span>{cat}</span>
                      </div>
                      {activeCategory === cat && (
                        <Check size={16} className="text-amber" strokeWidth={2.5} />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-[13px] text-text-muted font-inter">
                      No categories available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
