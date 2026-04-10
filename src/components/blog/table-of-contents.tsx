"use client";

import { useEffect, useState } from "react";
import { List, X } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

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
    <>
      {/* Floating trigger — compact progress indicator (Figma node 11:167 style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-[999] bg-bg-card border border-border rounded-[14px] p-3 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex flex-col gap-1.5 items-end"
        aria-label="Table of contents"
        style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      >
        {/* Header row */}
        <div className="flex items-center gap-2 w-full mb-1">
          <List size={12} className="text-text-muted" />
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
            Sections
          </span>
        </div>
        {/* Progress lines — matches Figma 11:167 */}
        {items.slice(0, 5).map((_, idx) => (
          <div
            key={idx}
            className={`h-[2px] rounded-full transition-all duration-300 ${
              idx === Math.min(activeIndex, 4)
                ? "w-[44px] bg-amber"
                : idx < Math.min(activeIndex, 4)
                ? "w-[44px] bg-amber/40"
                : "w-[44px] bg-cream"
            }`}
          />
        ))}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Panel — compact card layout matching Figma 11:169 */}
      <div
        className="fixed top-14 bottom-0 left-0 z-[1000] w-[360px] max-w-[85vw] bg-bg-card border-r border-border flex flex-col transition-transform duration-[350ms]"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
              Table of Contents
            </h3>
            <p className="text-[13px] font-semibold text-text-primary font-inter mt-0.5">
              {items.length} section{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Items — card-style compact layout */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex flex-col gap-1">
            {items.map((item, idx) => {
              const isActive = activeId === item.id;
              const isPast = activeIndex >= 0 && idx < activeIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    setIsOpen(false);
                  }}
                  className={`group flex items-start gap-2 text-left p-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-bg-subtle"
                      : isPast
                      ? "hover:bg-bg-subtle/60"
                      : "hover:bg-bg-subtle/60"
                  } ${item.level === 3 ? "ml-5" : ""}`}
                >
                  {/* Amber left bar — only on active */}
                  <div
                    className={`w-0.5 rounded-full shrink-0 self-stretch transition-all duration-300 ${
                      isActive
                        ? "bg-amber min-h-[18px]"
                        : "bg-transparent min-h-[18px]"
                    }`}
                  />

                  {/* Text */}
                  <span
                    className={`text-[12px] leading-[18px] font-medium font-inter transition-colors ${
                      isActive
                        ? "text-amber"
                        : isPast
                        ? "text-text-primary opacity-60 group-hover:opacity-100"
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
      </div>
    </>
  );
}
