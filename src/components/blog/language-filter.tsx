"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

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
  const [showCategories, setShowCategories] = useState(false);

  const languages: Language[] = ["ALL", "BANGLA", "ENGLISH"];

  return (
    <div className="flex flex-col gap-4">
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

        {/* Filter icon button — toggles category dropdown */}
        <button
          onClick={() => setShowCategories(!showCategories)}
          className={`w-[72px] h-[56px] flex items-center justify-center rounded-full border transition-colors ${
            showCategories || activeCategory
              ? "border-amber bg-highlight-bg"
              : "border-border bg-bg hover:bg-bg-subtle"
          }`}
        >
          {showCategories ? (
            <X size={24} className="text-text-primary" />
          ) : (
            <SlidersHorizontal size={24} className="text-text-primary" />
          )}
        </button>
      </div>

      {/* Category filter dropdown */}
      {showCategories && categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2.5 rounded-full border text-[13px] font-medium leading-[18px] transition-all duration-200 font-inter ${
              !activeCategory
                ? "bg-amber border-amber text-text-primary"
                : "bg-bg border-border text-text-secondary hover:bg-bg-subtle"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(activeCategory === cat ? null : cat)}
              className={`px-4 py-2.5 rounded-full border text-[13px] font-medium leading-[18px] transition-all duration-200 font-inter ${
                activeCategory === cat
                  ? "bg-amber border-amber text-text-primary"
                  : "bg-bg border-border text-text-secondary hover:bg-bg-subtle"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <p className="text-[12px] text-text-muted font-inter">
        {postCount} article{postCount !== 1 ? "s" : ""}
        {activeLanguage !== "ALL" && (
          <span> in <span className="text-amber font-medium">{activeLanguage}</span></span>
        )}
        {activeCategory && (
          <span> · <span className="text-amber font-medium">{activeCategory}</span></span>
        )}
        {(activeLanguage !== "ALL" || activeCategory) && (
          <button
            onClick={() => {
              onLanguageSelect("ALL");
              onCategorySelect(null);
            }}
            className="ml-2 text-amber hover:text-amber-dark font-medium"
          >
            Clear
          </button>
        )}
      </p>
    </div>
  );
}
