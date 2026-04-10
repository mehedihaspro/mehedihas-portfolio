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
      <div className="grid md:grid-cols-[240px_1fr] gap-8 lg:gap-12 items-stretch">
        {/* Left: compact list */}
        <div className="flex flex-col justify-center">
          {ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            const Icon = item.Icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveIndex(idx)}
                className="group relative flex items-center gap-3 py-2.5 text-left focus:outline-none"
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 w-0.5 rounded-full transition-all duration-500 ${
                    isActive ? "h-6 bg-amber" : "h-0 bg-transparent"
                  }`}
                />

                <div className="flex items-center gap-3 pl-4">
                  <Icon
                    size={14}
                    strokeWidth={1.8}
                    className={`transition-all duration-500 ${
                      isActive
                        ? "text-amber scale-110"
                        : "text-text-muted opacity-50 group-hover:opacity-100"
                    }`}
                  />
                  <span
                    className={`text-[13px] font-medium uppercase tracking-[0.15em] font-inter transition-all duration-500 ${
                      isActive
                        ? "text-text-primary translate-x-0.5"
                        : "text-text-muted group-hover:text-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: featured card */}
        <div
          className="relative rounded-3xl border border-border overflow-hidden min-h-[340px] transition-colors duration-700"
          style={{
            backgroundColor: `${active.color}08`,
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-25 transition-colors duration-700"
            style={{ backgroundColor: active.color }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-15 transition-colors duration-700"
            style={{ backgroundColor: active.color }}
          />

          {/* Content */}
          <div
            key={activeIndex}
            className="relative h-full p-8 md:p-10 flex flex-col justify-between animate-in fade-in duration-700"
          >
            {/* Top row: icon + label */}
            <div className="flex items-center justify-between mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors duration-700"
                style={{
                  backgroundColor: `${active.color}15`,
                  borderColor: `${active.color}30`,
                }}
              >
                <ActiveIcon
                  size={26}
                  strokeWidth={1.6}
                  style={{ color: active.color }}
                />
              </div>

              <p
                className="text-[10px] font-bold uppercase tracking-[0.3em] font-inter transition-colors duration-700"
                style={{ color: active.color }}
              >
                Currently {active.label.toLowerCase()}
              </p>
            </div>

            {/* Main value */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-[36px] md:text-[48px] font-bold font-display leading-[0.95] tracking-[-0.03em] text-text-primary mb-4">
                {active.value}
              </h3>

              {active.detail && (
                <p className="text-[15px] text-text-secondary leading-relaxed font-inter max-w-md">
                  {active.detail}
                </p>
              )}
            </div>

            {/* Progress indicator at bottom */}
            <div className="flex gap-1 mt-6">
              {ITEMS.map((_, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-0.5 rounded-full overflow-hidden bg-border/60"
                >
                  {idx === activeIndex && !isPaused && (
                    <div
                      key={activeIndex}
                      className="h-full"
                      style={{
                        backgroundColor: active.color,
                        animation: "currentlyProgress 3.5s linear forwards",
                      }}
                    />
                  )}
                  {idx < activeIndex && (
                    <div
                      className="h-full w-full opacity-40"
                      style={{ backgroundColor: active.color }}
                    />
                  )}
                </div>
              ))}
            </div>
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
