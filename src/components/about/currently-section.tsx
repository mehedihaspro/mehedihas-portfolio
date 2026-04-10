"use client";

import { useEffect, useState } from "react";
import { Palette, BookOpen, Headphones, Sparkles, Coffee } from "lucide-react";

interface CurrentlyItem {
  label: string;
  value: string;
  Icon: typeof Palette;
  color: string;
}

const ITEMS: CurrentlyItem[] = [
  {
    label: "Designing",
    value: "Design System v2 for a fintech startup",
    Icon: Palette,
    color: "#E8A832",
  },
  {
    label: "Reading",
    value: "Refactoring UI by Adam Wathan & Steve Schoger",
    Icon: BookOpen,
    color: "#8B6B4A",
  },
  {
    label: "Learning",
    value: "Motion design & advanced Framer Motion",
    Icon: Sparkles,
    color: "#C48A1A",
  },
  {
    label: "Listening",
    value: "Design Matters podcast with Debbie Millman",
    Icon: Headphones,
    color: "#6B5D4F",
  },
  {
    label: "Drinking",
    value: "Way too much coffee, probably",
    Icon: Coffee,
    color: "#4A3F35",
  },
];

export function CurrentlySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ITEMS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const active = ITEMS[activeIndex];
  const ActiveIcon = active.Icon;

  return (
    <div
      className="grid md:grid-cols-[280px_1fr] gap-8 items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left: vertical label list */}
      <div className="flex flex-col gap-1">
        {ITEMS.map((item, idx) => (
          <button
            key={item.label}
            onClick={() => setActiveIndex(idx)}
            className={`text-left group flex items-center gap-3 py-2 transition-all duration-300 ${
              idx === activeIndex
                ? "text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {/* Animated dot indicator */}
            <span className="relative flex items-center justify-center w-4 h-4 shrink-0">
              <span
                className={`absolute w-2 h-2 rounded-full transition-all duration-500 ${
                  idx === activeIndex
                    ? "bg-amber scale-100"
                    : "bg-text-muted scale-75 opacity-40 group-hover:opacity-70"
                }`}
              />
              {idx === activeIndex && (
                <span className="absolute w-4 h-4 rounded-full bg-amber/30 animate-ping" />
              )}
            </span>
            <span
              className={`text-[14px] font-medium uppercase tracking-wider transition-all duration-300 font-inter ${
                idx === activeIndex ? "translate-x-0" : "translate-x-0"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Right: active content with fade transition */}
      <div className="relative min-h-[180px] flex items-center">
        <div
          key={activeIndex}
          className="flex items-start gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500"
        >
          {/* Large icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500"
            style={{ backgroundColor: `${active.color}20` }}
          >
            <ActiveIcon
              size={28}
              style={{ color: active.color }}
              strokeWidth={1.5}
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.2em] font-inter mb-2">
              {active.label}
            </p>
            <p className="text-[24px] md:text-[28px] font-display font-bold leading-[1.15] tracking-[-0.02em] text-text-primary">
              {active.value}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {!isHovered && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border rounded-full overflow-hidden">
            <div
              key={activeIndex}
              className="h-full bg-amber"
              style={{
                animation: "currentlyProgress 3s linear forwards",
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes currentlyProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
