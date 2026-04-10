"use client";

import { Brain, Clock, HelpCircle, ArrowRight, Sparkles } from "lucide-react";

interface QuizStartCardProps {
  title: string;
  description?: string;
  questionCount: number;
  onStart: () => void;
}

export function QuizStartCard({
  title,
  description,
  questionCount,
  onStart,
}: QuizStartCardProps) {
  const estimatedMinutes = Math.max(1, Math.ceil((questionCount * 15) / 60));

  return (
    <div className="max-w-[680px] mx-auto mt-16 pt-12 border-t border-border">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          End of article quiz
        </h4>
      </div>

      {/* Main card with gradient border effect */}
      <div className="relative">
        {/* Gradient border via ::before */}
        <div
          className="absolute -inset-px rounded-[24px] opacity-80"
          style={{
            background:
              "linear-gradient(135deg, rgba(232,168,50,0.5) 0%, rgba(232,168,50,0.15) 35%, rgba(232,168,50,0.05) 70%, rgba(232,168,50,0.2) 100%)",
          }}
        />

        <div className="relative rounded-[23px] bg-bg-card overflow-hidden">
          {/* Decorative blobs */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #E8A832 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-24 -left-20 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{
              background: "radial-gradient(circle, #E8A832 0%, transparent 70%)",
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              color: "var(--text-primary)",
            }}
          />

          <div className="relative p-7 md:p-10">
            {/* Top meta row */}
            <div className="flex items-center justify-between mb-6">
              {/* Brain emblem */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-[18px] blur-lg opacity-40"
                  style={{ backgroundColor: "#E8A832" }}
                />
                <div
                  className="relative w-14 h-14 rounded-[18px] flex items-center justify-center bg-bg-card"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(232,168,50,0.3), 0 8px 20px rgba(232,168,50,0.15)",
                  }}
                >
                  <Brain size={24} className="text-amber" strokeWidth={1.8} />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[12px] text-text-muted font-inter">
                <span className="inline-flex items-center gap-1.5">
                  <HelpCircle size={12} />
                  <span>
                    <span className="font-bold text-text-primary">
                      {questionCount}
                    </span>{" "}
                    Qs
                  </span>
                </span>
                <span className="w-0.5 h-0.5 rounded-full bg-text-muted" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} />~{estimatedMinutes} min
                </span>
              </div>
            </div>

            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-highlight-bg mb-4">
              <Sparkles size={10} className="text-amber" />
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber font-inter">
                Optional · Randomized
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-[32px] md:text-[40px] leading-[1] tracking-[-0.02em] text-text-primary mb-4">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-[15px] text-text-secondary leading-relaxed font-inter mb-7 max-w-[540px]">
                {description}
              </p>
            )}

            {/* CTA row with "what you'll get" */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStart}
                className="group relative inline-flex items-center gap-2 pl-5 pr-4 py-3.5 rounded-full bg-amber text-white font-bold text-[14px] font-inter transition-all hover:shadow-[0_8px_24px_rgba(232,168,50,0.4)] hover:-translate-y-0.5"
                style={{
                  boxShadow: "0 4px 14px rgba(232,168,50,0.3)",
                }}
              >
                <span>Start the quiz</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </div>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-text-muted font-inter">
                <span className="inline-flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-amber" />
                  Scored
                </span>
                <span className="inline-flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-amber" />
                  Shareable
                </span>
                <span className="inline-flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-amber" />
                  Retakeable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
