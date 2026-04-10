"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

type Language = "ALL" | "BANGLA" | "ENGLISH";

interface LanguageFilterProps {
  onSelect: (language: Language) => void;
}

export function LanguageFilter({ onSelect }: LanguageFilterProps) {
  const [active, setActive] = useState<Language>("ALL");

  const handleSelect = (lang: Language) => {
    setActive(lang);
    onSelect(lang);
  };

  const options: Language[] = ["ALL", "BANGLA", "ENGLISH"];

  return (
    <div className="flex items-center justify-between w-full">
      {/* Language pills */}
      <div className="flex items-center gap-2">
        {options.map((lang) => (
          <button
            key={lang}
            onClick={() => handleSelect(lang)}
            className={`px-6 py-4 rounded-full border text-[16px] font-normal leading-[24px] transition-all duration-200 font-inter ${
              active === lang
                ? "bg-amber border-border text-text-primary"
                : "bg-bg border-border text-text-secondary hover:bg-bg-subtle"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Filter icon button */}
      <button className="w-[72px] h-[56px] flex items-center justify-center rounded-full border border-border bg-bg hover:bg-bg-subtle transition-colors">
        <SlidersHorizontal size={24} className="text-text-primary" />
      </button>
    </div>
  );
}
