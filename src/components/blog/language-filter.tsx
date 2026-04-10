"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";

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

  // Close dropdown when clicking outside
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between w-full">
        {/* Language pills */}
        <div className="flex items-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageSelect(lang)}
              className={`px-6 py-4 rounded-full border text-[16px] font-normal leading-[24px] transition-all duration-200 font-inter ${
                activeLanguage === lang
                  ? "bg-amber border-border text-text-primary"
                  : "bg-bg border-border text-text-secondary hover:bg-bg-subtle"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Filter icon button + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`w-[72px] h-[56px] flex items-center justify-center rounded-full border transition-colors relative ${
              hasActiveCategory
                ? "border-amber bg-highlight-bg"
                : "border-border bg-bg hover:bg-bg-subtle"
            }`}
            aria-label="Filter by category"
            aria-expanded={showDropdown}
          >
            <SlidersHorizontal size={24} className="text-text-primary" />
            {hasActiveCategory && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber border-2 border-bg" />
            )}
          </button>

          {/* Dropdown panel */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 z-50 w-[280px] rounded-[14px] border border-border bg-bg shadow-lg p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-3 py-2 flex items-center justify-between border-b border-border mb-1">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider font-inter">
                  Category
                </span>
                {hasActiveCategory && (
                  <button
                    onClick={() => {
                      onCategorySelect(null);
                      setShowDropdown(false);
                    }}
                    className="text-[11px] text-amber hover:text-amber-dark font-medium font-inter"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* All Categories option */}
              <button
                onClick={() => {
                  onCategorySelect(null);
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-inter transition-colors ${
                  !activeCategory
                    ? "bg-highlight-bg text-amber font-medium"
                    : "text-text-primary hover:bg-bg-subtle"
                }`}
              >
                <span>All Categories</span>
                {!activeCategory && <Check size={14} className="text-amber" />}
              </button>

              {/* Category list */}
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onCategorySelect(cat);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-inter transition-colors ${
                      activeCategory === cat
                        ? "bg-highlight-bg text-amber font-medium"
                        : "text-text-primary hover:bg-bg-subtle"
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCategory === cat && <Check size={14} className="text-amber" />}
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-[13px] text-text-muted font-inter text-center">
                  No categories available
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[12px] text-text-muted font-inter">
        {postCount} article{postCount !== 1 ? "s" : ""}
        {activeLanguage !== "ALL" && (
          <span>
            {" "}in <span className="text-amber font-medium">{activeLanguage}</span>
          </span>
        )}
        {activeCategory && (
          <span>
            {" "}· <span className="text-amber font-medium">{activeCategory}</span>
          </span>
        )}
        {(activeLanguage !== "ALL" || activeCategory) && (
          <button
            onClick={() => {
              onLanguageSelect("ALL");
              onCategorySelect(null);
            }}
            className="ml-2 text-amber hover:text-amber-dark font-medium"
          >
            Clear all
          </button>
        )}
      </p>
    </div>
  );
}
