"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const activeIndex = items.findIndex((item) => item.id === activeId);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[999] hidden md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Collapsed progress lines (Figma node 11:167) */}
      <div
        className={`flex flex-col gap-2 items-end transition-all duration-300 ${
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isPast = activeIndex >= 0 && idx < activeIndex;
          return (
            <div
              key={item.id}
              className={`h-[2px] rounded-full transition-all duration-300 ${
                isActive
                  ? "w-[44px] bg-amber"
                  : isPast
                  ? "w-[44px] bg-amber/50"
                  : "w-[44px] bg-cream"
              }`}
            />
          );
        })}
      </div>

      {/* Expanded TOC card (Figma node 11:169 / 97:1181) — shows on hover */}
      <div
        className={`absolute right-0 top-1/2 -translate-y-1/2 bg-bg-card border border-border rounded-[14px] p-2 flex flex-col gap-1 min-w-[260px] max-w-[340px] transition-all duration-300 ${
          isHovered
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-2 pointer-events-none"
        }`}
        style={{
          boxShadow: isHovered
            ? "0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)"
            : "none",
        }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className={`group flex items-center gap-2 text-left p-2 rounded-md transition-all duration-200 hover:bg-bg-subtle ${
                item.level === 3 ? "pl-6" : ""
              }`}
            >
              {/* Amber left bar — only on active */}
              {isActive && (
                <div className="w-0.5 h-[18px] rounded-full bg-amber shrink-0" />
              )}
              {!isActive && <div className="w-0.5 h-[18px] shrink-0" />}

              {/* Text */}
              <span
                className={`text-[12px] leading-[18px] font-medium font-inter transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
                  isActive
                    ? "text-amber"
                    : "text-text-primary group-hover:text-amber"
                }`}
              >
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
