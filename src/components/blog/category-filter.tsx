"use client";

import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, onSelect }: CategoryFilterProps) {
  const [active, setActive] = useState<string | null>(null);

  const handleSelect = (category: string | null) => {
    setActive(category);
    onSelect(category);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => handleSelect(null)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
          active === null
            ? "bg-text-primary text-bg shadow-xs"
            : "bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-cream"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 ${
            active === cat
              ? "bg-text-primary text-bg shadow-xs"
              : "bg-bg-subtle text-text-secondary hover:text-text-primary hover:bg-cream"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
