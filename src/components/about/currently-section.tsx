"use client";

import { useEffect, useState } from "react";
import {
  Palette,
  BookOpen,
  Headphones,
  Sparkles,
  Coffee,
  Tv,
  PenTool,
  Gamepad2,
} from "lucide-react";

interface CurrentlyItem {
  label: string;
  value: string;
  Icon: typeof Palette;
  color: string;
  detail?: string;
}

const ITEMS: CurrentlyItem[] = [
  {
    label: "Designing",
    value: "Design System v2",
    detail: "For a fintech startup — tokens, themes, component library",
    Icon: Palette,
    color: "#E8A832",
  },
  {
    label: "Reading",
    value: "Refactoring UI",
    detail: "Adam Wathan & Steve Schoger — finally, a designer book for devs",
    Icon: BookOpen,
    color: "#8B6B4A",
  },
  {
    label: "Watching",
    value: "Severance S2",
    detail: "The editing and sound design alone deserve an Emmy",
    Icon: Tv,
    color: "#1E2A3A",
  },
  {
    label: "Learning",
    value: "Framer Motion",
    detail: "Going deep on spring physics and orchestration",
    Icon: Sparkles,
    color: "#C48A1A",
  },
  {
    label: "Listening",
    value: "Design Matters",
    detail: "Debbie Millman's interview with Paula Scher",
    Icon: Headphones,
    color: "#4A3F6B",
  },
  {
    label: "Writing",
    value: "Newsletter #13",
    detail: "On why color theory lies to designers",
    Icon: PenTool,
    color: "#6B4A4A",
  },
  {
    label: "Playing",
    value: "Disco Elysium",
    detail: "A game that's really a novel that's really a design lesson",
    Icon: Gamepad2,
    color: "#2D5F2D",
  },
  {
    label: "Drinking",
    value: "Too much coffee",
    detail: "Currently on my third cup. It's 11am.",
    Icon: Coffee,
    color: "#3A3029",
  },
];

export function CurrentlySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ITEMS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const active = ITEMS[activeIndex];
  const ActiveIcon = active.Icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative"
    >
      <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start">
        {/* Left: scrollable label list */}
        <div className="relative">
          <div className="flex flex-col">
            {ITEMS.map((item, idx) => {
              const isActive = idx === activeIndex;
              const Icon = item.Icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveIndex(idx)}
                  className="group relative flex items-center gap-4 py-3 text-left focus:outline-none"
                >
                  {/* Side indicator */}
                  <div className="relative w-6 flex items-center justify-center shrink-0">
                    <div
                      className={`absolute h-0.5 rounded-full bg-amber transition-all duration-500 ${
                        isActive ? "w-6" : "w-0"
                      }`}
                    />
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                      className={`transition-all duration-500 ${
                        isActive
                          ? "opacity-0 scale-0"
                          : "opacity-40 group-hover:opacity-70 text-text-muted"
                      }`}
                    />
                  </div>

                  <span
                    className={`text-[13px] font-medium uppercase tracking-[0.15em] font-inter transition-all duration-500 ${
                      isActive
                        ? "text-text-primary translate-x-1"
                        : "text-text-muted group-hover:text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: large active display */}
        <div className="relative min-h-[280px]">
          <div
            key={activeIndex}
            className="animate-in fade-in slide-in-from-right-4 duration-700"
          >
            {/* Icon with glow */}
            <div className="relative mb-6 inline-block">
              <div
                className="absolute inset-0 blur-2xl opacity-40 rounded-full"
                style={{ backgroundColor: active.color }}
              />
              <div
                className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${active.color}15`,
                  border: `1px solid ${active.color}30`,
                }}
              >
                <ActiveIcon
                  size={36}
                  strokeWidth={1.5}
                  style={{ color: active.color }}
                />
              </div>
            </div>

            {/* Label */}
            <p
              className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 font-inter"
              style={{ color: active.color }}
            >
              Currently {active.label.toLowerCase()}
            </p>

            {/* Value — display font */}
            <h3 className="text-[32px] md:text-[44px] font-bold font-display leading-[0.95] tracking-[-0.02em] text-text-primary mb-4">
              {active.value}
            </h3>

            {/* Detail */}
            {active.detail && (
              <p className="text-[15px] text-text-secondary leading-relaxed font-inter max-w-md">
                {active.detail}
              </p>
            )}
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 right-0 flex gap-1">
            {ITEMS.map((_, idx) => (
              <div
                key={idx}
                className="flex-1 h-0.5 rounded-full overflow-hidden bg-border"
              >
                {idx === activeIndex && !isPaused && (
                  <div
                    key={activeIndex}
                    className="h-full bg-amber"
                    style={{
                      animation: "currentlyProgress 3.5s linear forwards",
                    }}
                  />
                )}
                {idx < activeIndex && (
                  <div className="h-full w-full bg-amber/40" />
                )}
              </div>
            ))}
          </div>
        </div>
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
