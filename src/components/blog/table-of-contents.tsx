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
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentIdx = items.findIndex((item) => item.id === activeId);
  const currentNumber = currentIdx >= 0 ? currentIdx + 1 : 1;

  if (items.length === 0) return null;

  return (
    <>
      {/* Floating TOC button — bottom left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 z-[999] w-12 h-12 rounded-full bg-bg-card border border-border shadow-lg hover:shadow-xl flex items-center justify-center text-text-primary hover:text-amber transition-all duration-200 hover:scale-105"
        aria-label="Table of contents"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      >
        {isOpen ? <X size={18} /> : <List size={18} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Panel */}
      <div
        className={`fixed top-14 bottom-0 left-0 z-[1000] w-[340px] max-w-[85vw] bg-bg-card border-r border-border flex flex-col transition-transform duration-[350ms]`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <h3 className="text-[16px] font-bold uppercase tracking-[0.5px] text-text-primary font-inter">
            Table of Contents
          </h3>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {items.map((item, idx) => {
            const isActive = activeId === item.id;
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
                className={`w-full flex items-start gap-3.5 px-6 py-3.5 text-left transition-all border-l-[3px] ${
                  isActive
                    ? "border-amber bg-highlight-bg text-amber font-semibold"
                    : "border-transparent text-text-secondary hover:text-amber hover:bg-highlight-bg/50"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors ${
                    isActive
                      ? "bg-amber text-white"
                      : "bg-bg-subtle text-text-muted"
                  }`}
                >
                  {idx + 1}
                </span>
                <span
                  className={`text-[14px] leading-[1.4] font-inter pt-0.5 ${
                    item.level === 3 ? "pl-3 text-[13px]" : ""
                  }`}
                >
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress footer */}
        <div className="px-6 py-5 border-t border-border">
          <div className="h-1 rounded-full bg-border overflow-hidden mb-1.5">
            <div
              className="h-full bg-amber transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted uppercase tracking-[1px] font-medium font-inter">
            Section {currentNumber} of {items.length}
          </p>
          <p className="text-[12px] text-text-muted mt-1.5 font-inter">
            {Math.round(progress)}% through article
          </p>
        </div>
      </div>
    </>
  );
}
