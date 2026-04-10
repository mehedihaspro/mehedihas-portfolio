"use client";

import { useState } from "react";

interface Memory {
  title: string;
  caption: string;
  color: string;
  rotation: number;
}

const MEMORIES: Memory[] = [
  {
    title: "First design talk",
    caption: "Nervously excited, 2022",
    color: "#8B6B4A",
    rotation: -4,
  },
  {
    title: "Workshop day",
    caption: "30 designers, one whiteboard",
    color: "#2D5F2D",
    rotation: 3,
  },
  {
    title: "Team offsite",
    caption: "Design system sprint",
    color: "#4A3F6B",
    rotation: -2,
  },
  {
    title: "Late night session",
    caption: "Coffee & prototypes",
    color: "#6B4A4A",
    rotation: 5,
  },
  {
    title: "Conference badge",
    caption: "Speaker — Design Week",
    color: "#C48A1A",
    rotation: -3,
  },
  {
    title: "Mentorship call",
    caption: "Portfolio reviews",
    color: "#1E2A3A",
    rotation: 2,
  },
];

export function MemoriesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 py-8">
      {MEMORIES.map((memory, idx) => (
        <div
          key={idx}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          className="group relative cursor-pointer transition-transform duration-500 ease-out"
          style={{
            transform:
              hoveredIdx === idx
                ? "rotate(0deg) scale(1.05) translateY(-8px)"
                : `rotate(${memory.rotation}deg)`,
            zIndex: hoveredIdx === idx ? 10 : 1,
          }}
        >
          {/* Polaroid frame */}
          <div className="bg-white rounded-sm p-3 pb-12 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
            {/* Photo area with gradient */}
            <div
              className="aspect-[4/5] rounded-sm relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${memory.color} 0%, ${memory.color}dd 100%)`,
              }}
            >
              {/* Subtle texture overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />
              {/* Corner tape */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber/40 rotate-0" />
            </div>

            {/* Handwritten caption */}
            <div className="pt-3 text-center">
              <p className="font-handwriting text-[18px] text-[#36322d] leading-tight">
                {memory.title}
              </p>
              <p className="font-handwriting text-[14px] text-text-muted leading-tight mt-0.5">
                {memory.caption}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
