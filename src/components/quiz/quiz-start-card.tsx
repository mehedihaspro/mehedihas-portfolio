"use client";

import { Brain, Clock, HelpCircle, Sparkles } from "lucide-react";

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
  // Rough estimate: 15 seconds per question
  const estimatedMinutes = Math.max(1, Math.ceil((questionCount * 15) / 60));

  return (
    <div className="max-w-[680px] mx-auto mt-16 pt-12 border-t border-border">
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          Quiz
        </h4>
      </div>

      {/* Card */}
      <div className="relative rounded-[20px] bg-bg-card border border-border p-8 md:p-10 overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--amber) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--amber) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          {/* Icon + tag */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-highlight-bg flex items-center justify-center">
              <Brain size={22} className="text-amber" strokeWidth={1.8} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-subtle text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
                <Sparkles size={9} className="text-amber" />
                Optional
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[26px] md:text-[32px] font-bold text-text-primary font-inter leading-[1.15] tracking-[-0.02em] mb-3">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-[15px] text-text-secondary leading-relaxed font-inter mb-6 max-w-[500px]">
              {description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-5 mb-7">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-text-muted" />
              <span className="text-[13px] text-text-secondary font-inter">
                <span className="font-bold text-text-primary">
                  {questionCount}
                </span>{" "}
                question{questionCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-text-muted" />
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-muted" />
              <span className="text-[13px] text-text-secondary font-inter">
                ~{estimatedMinutes} min
              </span>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber hover:bg-amber-dark text-white font-semibold text-[14px] font-inter transition-all hover:shadow-lg hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(232,168,50,0.3)]"
          >
            <Brain size={15} strokeWidth={2} />
            Take the quiz
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
