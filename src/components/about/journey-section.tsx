"use client";

import { useState } from "react";
import { ChevronRight, Quote } from "lucide-react";

interface JourneyItem {
  year: string;
  chapter: string;
  title: string;
  company: string;
  story: string;
  lessons: string[];
  quote: string;
  color: string;
}

const JOURNEY: JourneyItem[] = [
  {
    year: "2026",
    chapter: "The Present",
    title: "Lead Designer & Content Creator",
    company: "Independent",
    story:
      "I decided to stop waiting for the perfect role and build one for myself. I lead design, write about design psychology, mentor designers, and treat my portfolio like a living product. Every week is research, writing, and shipping.",
    lessons: [
      "Teaching is the fastest way to learn",
      "Writing sharpens thinking",
      "Community > credentials",
    ],
    quote:
      "The best career move I made was treating my curiosity as a job.",
    color: "#E8A832",
  },
  {
    year: "2024",
    chapter: "The Scale",
    title: "Senior Product Designer",
    company: "Enterprise SaaS",
    story:
      "I joined a team building complex data-driven products. I learned that great design at scale is less about pixels and more about systems, decisions, and alignment. I shipped a design system that 10+ teams used daily.",
    lessons: [
      "Systems thinking over pixel pushing",
      "Influence without authority",
      "Documentation is design",
    ],
    quote:
      "I used to think senior meant better at Figma. It actually means better at decisions.",
    color: "#8B6B4A",
  },
  {
    year: "2022",
    chapter: "The Ship",
    title: "Product Designer",
    company: "Consumer App",
    story:
      "My first real product design job. I worked on consumer apps with millions of users and felt the weight of every design decision. I learned how fast the real world moves and how messy real product work is compared to case studies.",
    lessons: [
      "Ship beats polish",
      "Users are not your users",
      "Data tells stories dribbble can't",
    ],
    quote:
      "The gap between a portfolio piece and a shipped feature is where real learning lives.",
    color: "#4A3F6B",
  },
  {
    year: "2020",
    chapter: "The Beginning",
    title: "Started Design Journey",
    company: "Self-taught",
    story:
      "I fell in love with design during lockdown. I had no formal education in it, just hunger, YouTube tutorials, and a stack of books I bought with my first freelance earnings. I made a lot of bad work. It was everything.",
    lessons: [
      "Start before you're ready",
      "Consistency > talent",
      "Community changes everything",
    ],
    quote:
      "I didn't know what I was doing. That was the best part.",
    color: "#2D5F2D",
  },
];

export function JourneySection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = JOURNEY[activeIdx];

  return (
    <div className="w-full max-w-[1080px] mx-auto">
      {/* Chapter tabs — horizontal timeline */}
      <div className="relative mb-12">
        {/* Connecting line */}
        <div className="absolute top-[22px] left-0 right-0 h-px bg-border" />
        <div
          className="absolute top-[22px] left-0 h-px bg-amber transition-all duration-700 ease-out"
          style={{
            width: `${((activeIdx + 1) / JOURNEY.length) * 100}%`,
          }}
        />

        {/* Year markers */}
        <div className="relative grid grid-cols-4 gap-2">
          {JOURNEY.map((item, idx) => {
            const isActive = idx === activeIdx;
            const isPast = idx < activeIdx;
            return (
              <button
                key={item.year}
                onClick={() => setActiveIdx(idx)}
                className="group flex flex-col items-center gap-3 focus:outline-none"
              >
                {/* Year dot */}
                <div
                  className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? "border-amber bg-amber scale-110"
                      : isPast
                      ? "border-amber bg-bg"
                      : "border-border bg-bg group-hover:border-text-muted"
                  }`}
                >
                  {isActive && (
                    <span className="absolute w-11 h-11 rounded-full bg-amber/20 animate-ping" />
                  )}
                  {isPast && (
                    <div className="w-2 h-2 rounded-full bg-amber" />
                  )}
                </div>

                {/* Year label */}
                <div className="text-center">
                  <p
                    className={`font-display font-bold text-[24px] leading-none tracking-tight transition-colors duration-300 ${
                      isActive
                        ? "text-amber"
                        : isPast
                        ? "text-text-primary"
                        : "text-text-muted group-hover:text-text-secondary"
                    }`}
                  >
                    {item.year}
                  </p>
                  <p
                    className={`text-[10px] uppercase tracking-[0.15em] font-medium mt-1 transition-colors duration-300 font-inter ${
                      isActive
                        ? "text-amber"
                        : "text-text-muted"
                    }`}
                  >
                    {item.chapter}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active chapter content */}
      <div
        key={activeIdx}
        className="grid md:grid-cols-[1.2fr_1fr] gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Left: Story */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2 font-inter"
              style={{ color: active.color }}
            >
              {active.company}
            </p>
            <h3 className="text-[28px] md:text-[36px] font-bold text-text-primary font-inter leading-tight tracking-tight">
              {active.title}
            </h3>
          </div>

          {/* Story */}
          <p className="text-[16px] leading-[1.75] text-text-secondary font-inter">
            {active.story}
          </p>

          {/* Quote */}
          <div className="relative pl-6 border-l-2 border-amber">
            <Quote
              size={16}
              className="absolute -left-[8.5px] top-0 text-amber bg-bg"
              fill="currentColor"
            />
            <p className="font-handwriting text-[22px] text-text-primary leading-[1.4] italic">
              &ldquo;{active.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: What I learned */}
        <div className="flex flex-col gap-5">
          <div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: `${active.color}10`,
              borderColor: `${active.color}30`,
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 font-inter"
              style={{ color: active.color }}
            >
              What I learned
            </p>
            <ul className="flex flex-col gap-3">
              {active.lessons.map((lesson, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[14px] text-text-primary font-inter leading-relaxed"
                >
                  <ChevronRight
                    size={14}
                    className="mt-1 shrink-0"
                    style={{ color: active.color }}
                  />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation hint */}
          <div className="flex items-center justify-between text-[12px] text-text-muted font-inter">
            <button
              onClick={() =>
                setActiveIdx(Math.min(JOURNEY.length - 1, activeIdx + 1))
              }
              disabled={activeIdx === JOURNEY.length - 1}
              className="flex items-center gap-1 hover:text-amber transition-colors disabled:opacity-30 disabled:hover:text-text-muted"
            >
              ← {JOURNEY[Math.min(JOURNEY.length - 1, activeIdx + 1)]?.year}{" "}
              earlier
            </button>
            <button
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="flex items-center gap-1 hover:text-amber transition-colors disabled:opacity-30 disabled:hover:text-text-muted"
            >
              later {JOURNEY[Math.max(0, activeIdx - 1)]?.year} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
