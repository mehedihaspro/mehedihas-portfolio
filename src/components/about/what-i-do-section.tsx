"use client";

import { useState } from "react";
import { Layers, PenTool, Users, Mic } from "lucide-react";

interface Skill {
  number: string;
  title: string;
  Icon: typeof Layers;
  description: string;
  tags: string[];
}

const SKILLS: Skill[] = [
  {
    number: "01",
    title: "Product Design",
    Icon: Layers,
    description:
      "End-to-end product design from research to delivery. Crafting user-centered digital experiences for web and mobile.",
    tags: ["UX Research", "Interaction", "Prototyping", "Testing"],
  },
  {
    number: "02",
    title: "Design Systems",
    Icon: PenTool,
    description:
      "Building scalable, consistent component libraries and design tokens that serve teams of any size.",
    tags: ["Tokens", "Components", "Documentation", "Governance"],
  },
  {
    number: "03",
    title: "Content Creation",
    Icon: Mic,
    description:
      "Writing about design, psychology, and creativity in Bangla and English. Newsletter, blog, workshops.",
    tags: ["Newsletter", "Blog", "Video", "Podcast"],
  },
  {
    number: "04",
    title: "Mentoring",
    Icon: Users,
    description:
      "Guiding aspiring designers through portfolio reviews, career advice, and 1:1 mentorship sessions.",
    tags: ["Portfolio", "Career", "1:1 Sessions", "Community"],
  },
];

export function WhatIDoSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {SKILLS.map((skill, idx) => {
        const isHovered = hoveredIdx === idx;
        const SkillIcon = skill.Icon;

        return (
          <div
            key={skill.number}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`group relative py-8 border-b border-border last:border-b-0 cursor-pointer transition-all duration-500 ${
              isHovered ? "pl-6" : "pl-0"
            }`}
          >
            {/* Amber left accent that slides in on hover */}
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-amber rounded-full transition-all duration-500 ${
                isHovered ? "h-12 opacity-100" : "h-0 opacity-0"
              }`}
            />

            <div className="flex items-start gap-8">
              {/* Number */}
              <span
                className={`font-display font-bold text-[48px] leading-none tracking-tight shrink-0 transition-colors duration-300 ${
                  isHovered ? "text-amber" : "text-text-muted"
                }`}
              >
                {skill.number}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <SkillIcon
                    size={20}
                    className={`transition-colors duration-300 ${
                      isHovered ? "text-amber" : "text-text-secondary"
                    }`}
                    strokeWidth={1.8}
                  />
                  <h3
                    className={`text-[24px] font-bold font-inter leading-tight transition-colors duration-300 ${
                      isHovered ? "text-amber" : "text-text-primary"
                    }`}
                  >
                    {skill.title}
                  </h3>
                </div>

                <p className="text-[15px] text-text-secondary leading-relaxed font-inter max-w-xl mb-4">
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium font-inter border transition-all duration-300 ${
                        isHovered
                          ? "border-amber bg-highlight-bg text-amber"
                          : "border-border bg-bg-subtle text-text-muted"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow indicator */}
              <div
                className={`shrink-0 self-center transition-all duration-500 ${
                  isHovered
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-white"
                  >
                    <line x1="3" y1="8" x2="13" y2="8" />
                    <polyline points="9,4 13,8 9,12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
