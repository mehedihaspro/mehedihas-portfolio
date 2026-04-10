"use client";

import { useState, useEffect } from "react";
import { Layers, PenTool, Users, Mic, X, ChevronRight } from "lucide-react";

interface Skill {
  number: string;
  title: string;
  Icon: typeof Layers;
  shortDescription: string;
  tags: string[];
  fullDescription: string[];
  tools: string[];
  years: string;
  projects: string;
}

const SKILLS: Skill[] = [
  {
    number: "01",
    title: "Product Design",
    Icon: Layers,
    shortDescription:
      "End-to-end product design from research to delivery. Crafting user-centered digital experiences for web and mobile.",
    tags: ["UX Research", "Interaction", "Prototyping", "Testing"],
    fullDescription: [
      "I approach product design as a conversation between the user's needs, the business goals, and the technical reality. Every pixel has to earn its place.",
      "My process usually starts with research — understanding who I'm designing for and what problem I'm actually solving. Then I move to sketches, wireframes, prototypes, and testing. I iterate fast, share early, and listen harder than I talk.",
      "I specialize in complex products: SaaS tools, data dashboards, and consumer apps with real-world constraints. Design systems are my default language.",
    ],
    tools: ["Figma", "Protopie", "Notion", "Linear", "Miro"],
    years: "5+ years",
    projects: "30+ shipped",
  },
  {
    number: "02",
    title: "Design Systems",
    Icon: PenTool,
    shortDescription:
      "Building scalable, consistent component libraries and design tokens that serve teams of any size.",
    tags: ["Tokens", "Components", "Documentation", "Governance"],
    fullDescription: [
      "A design system is not a Figma library. It's a shared language between designers, engineers, and product. I build systems that people actually want to use, not ones that create more work.",
      "I start with foundations: tokens, typography, color, spacing. Then components that solve real patterns, not hypothetical ones. Documentation that reads like a conversation, not a manual.",
      "The hardest part isn't the craft — it's adoption. I focus on making the right thing the easy thing.",
    ],
    tools: ["Figma", "Tokens Studio", "Storybook", "GitHub", "Zeroheight"],
    years: "3+ years",
    projects: "5 systems built",
  },
  {
    number: "03",
    title: "Content Creation",
    Icon: Mic,
    shortDescription:
      "Writing about design, psychology, and creativity in Bangla and English. Newsletter, blog, workshops.",
    tags: ["Newsletter", "Blog", "Video", "Podcast"],
    fullDescription: [
      "I write because it sharpens my thinking. The best designers I know are all great communicators — writing forces you to be clear about what you actually mean.",
      "I publish a weekly newsletter on design psychology, run a blog in Bangla and English, and occasionally make videos and podcasts. My audience is working designers who want to think better, not just design prettier.",
      "Writing about design made me a better designer. Teaching it made me a better writer.",
    ],
    tools: ["Notion", "Kit", "Figma", "Descript", "Arc"],
    years: "2+ years",
    projects: "50+ articles",
  },
  {
    number: "04",
    title: "Mentoring",
    Icon: Users,
    shortDescription:
      "Guiding aspiring designers through portfolio reviews, career advice, and 1:1 mentorship sessions.",
    tags: ["Portfolio", "Career", "1:1 Sessions", "Community"],
    fullDescription: [
      "I mentor because someone mentored me. The best career advice I ever got came from people who had no reason to help me, and I try to be that person for others.",
      "I run portfolio reviews, 1:1 mentorship calls, and workshops for early-career designers. I focus on honest feedback, practical next steps, and helping people see what they can't see about themselves.",
      "The goal isn't to make more designers like me. It's to help designers become more like themselves.",
    ],
    tools: ["Calendly", "Zoom", "Notion", "FigJam"],
    years: "3+ years",
    projects: "40+ designers mentored",
  },
];

export function WhatIDoSection() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeSkill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSkill]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSkill(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {SKILLS.map((skill) => {
          const SkillIcon = skill.Icon;
          return (
            <button
              key={skill.number}
              onClick={() => setActiveSkill(skill)}
              className="group relative py-8 border-b border-border last:border-b-0 text-left transition-all duration-500 hover:pl-6 focus:outline-none"
            >
              {/* Amber left accent bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-amber rounded-full h-0 opacity-0 group-hover:h-12 group-hover:opacity-100 transition-all duration-500" />

              <div className="flex items-start gap-8">
                {/* Number */}
                <span className="font-display font-bold text-[48px] leading-none tracking-tight shrink-0 text-text-muted group-hover:text-amber transition-colors duration-300">
                  {skill.number}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <SkillIcon
                      size={20}
                      className="text-text-secondary group-hover:text-amber transition-colors duration-300"
                      strokeWidth={1.8}
                    />
                    <h3 className="text-[24px] font-bold font-inter leading-tight text-text-primary group-hover:text-amber transition-colors duration-300">
                      {skill.title}
                    </h3>
                  </div>

                  <p className="text-[15px] text-text-secondary leading-relaxed font-inter max-w-xl mb-4">
                    {skill.shortDescription}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-[11px] font-medium font-inter border border-border bg-bg-subtle text-text-muted group-hover:border-amber group-hover:bg-highlight-bg group-hover:text-amber transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read more indicator */}
                <div className="shrink-0 self-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex items-center gap-2">
                  <span className="text-[12px] font-medium text-amber font-inter uppercase tracking-wider">
                    Read more
                  </span>
                  <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center">
                    <ChevronRight
                      size={16}
                      className="text-white"
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activeSkill && (
        <>
          <div
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setActiveSkill(null)}
          />

          <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 pointer-events-none overflow-y-auto">
            <div className="pointer-events-auto w-full max-w-[680px] rounded-3xl bg-bg border border-border my-12 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6">
                <button
                  onClick={() => setActiveSkill(null)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-bg-subtle hover:bg-cream flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <div className="flex items-start gap-6">
                  <span className="font-display font-bold text-[64px] leading-none tracking-tight text-amber shrink-0">
                    {activeSkill.number}
                  </span>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <activeSkill.Icon
                        size={18}
                        className="text-amber"
                        strokeWidth={1.8}
                      />
                      <h3 className="text-[28px] font-bold text-text-primary font-inter leading-tight">
                        {activeSkill.title}
                      </h3>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-4 text-[12px] text-text-muted font-inter">
                      <span>
                        <span className="text-text-secondary font-semibold">
                          {activeSkill.years}
                        </span>{" "}
                        experience
                      </span>
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      <span>
                        <span className="text-text-secondary font-semibold">
                          {activeSkill.projects}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-border mx-8" />

              {/* Body */}
              <div className="px-8 py-6 space-y-5">
                {activeSkill.fullDescription.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] text-text-secondary leading-[1.75] font-inter"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="h-px bg-border mx-8" />

              {/* Tools & Tags */}
              <div className="px-8 py-6 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2 font-inter">
                    Tools I use
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSkill.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-bg-subtle text-text-primary border border-border font-inter"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted mb-2 font-inter">
                    Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSkill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-highlight-bg text-amber border border-amber/30 font-inter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
