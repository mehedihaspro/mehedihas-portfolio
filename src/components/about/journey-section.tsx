"use client";

import { useEffect, useRef, useState } from "react";

interface JourneyItem {
  year: string;
  title: string;
  company?: string;
  description: string;
}

const JOURNEY: JourneyItem[] = [
  {
    year: "2026",
    title: "Lead Designer & Content Creator",
    company: "Independent",
    description:
      "Leading design teams, writing about design psychology, mentoring designers, and building my portfolio into a home for design thinking.",
  },
  {
    year: "2024",
    title: "Senior Product Designer",
    company: "Enterprise SaaS",
    description:
      "Designed complex data-driven products. Built and maintained design systems used by 10+ product teams across web and mobile.",
  },
  {
    year: "2022",
    title: "Product Designer",
    company: "Consumer App",
    description:
      "Joined the world of product design. Worked on consumer-facing apps with millions of users, learning how design meets scale.",
  },
  {
    year: "2020",
    title: "Started Design Journey",
    company: "Self-taught",
    description:
      "Fell in love with design. Self-taught through online courses, practice, community, and a lot of trial and error.",
  },
];

export function JourneySection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setVisibleItems((prev) =>
              prev.includes(idx) ? prev : [...prev, idx]
            );
          }
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px" }
    );

    for (const ref of itemRefs.current) {
      if (ref) observer.observe(ref);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-[820px]">
      {/* Vertical line */}
      <div className="absolute left-[100px] md:left-[140px] top-4 bottom-4 w-px bg-border">
        {/* Animated fill based on scroll */}
        <div
          className="absolute top-0 left-0 w-full bg-amber transition-all duration-1000 ease-out"
          style={{
            height:
              visibleItems.length > 0
                ? `${(Math.max(...visibleItems) + 1) * (100 / JOURNEY.length)}%`
                : "0%",
          }}
        />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-12 relative">
        {JOURNEY.map((item, idx) => {
          const isVisible = visibleItems.includes(idx);
          return (
            <div
              key={item.year}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              data-idx={idx}
              className={`relative flex gap-6 md:gap-12 items-start transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Year */}
              <div className="w-[100px] md:w-[120px] shrink-0 text-right pt-1">
                <span className="font-display font-bold text-[32px] md:text-[40px] leading-none tracking-tight text-amber">
                  {item.year}
                </span>
              </div>

              {/* Dot */}
              <div className="relative w-5 shrink-0 flex justify-center pt-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 border-amber bg-bg transition-all duration-500 ${
                    isVisible ? "scale-100" : "scale-0"
                  }`}
                />
                {isVisible && (
                  <div className="absolute w-5 h-5 rounded-full bg-amber/30 animate-ping" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <h3 className="text-[18px] md:text-[20px] font-bold text-text-primary font-inter leading-tight mb-1">
                  {item.title}
                </h3>
                {item.company && (
                  <p className="text-[13px] text-amber font-medium font-inter uppercase tracking-wider mb-3">
                    {item.company}
                  </p>
                )}
                <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-inter max-w-md">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
