"use client";

import { Brain, Clock, HelpCircle, ArrowRight } from "lucide-react";

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
    <div className="max-w-[680px] mx-auto mt-16 mb-16 pt-12 border-t border-border">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          End of article quiz
        </h4>
      </div>

      {/* Card */}
      <div className="rounded-[14px] border border-border bg-bg-card p-7 md:p-10">
        {/* Top row: brain icon + meta */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-full bg-highlight-bg flex items-center justify-center">
            <Brain size={22} className="text-amber" strokeWidth={1.8} />
          </div>

          <div className="flex items-center gap-3 text-[12px] text-text-muted font-inter">
            <span className="inline-flex items-center gap-1.5">
              <HelpCircle size={12} />
              <span>
                <span className="font-semibold text-text-primary">
                  {questionCount}
                </span>{" "}
                {questionCount === 1 ? "question" : "questions"}
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-text-muted/60" />
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} />~{estimatedMinutes} min
            </span>
          </div>
        </div>

        {/* Tag */}
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-bg-subtle mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
            Optional · Randomized
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[26px] md:text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-text-primary font-inter mb-4">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[15px] text-text-secondary leading-relaxed font-inter mb-7 max-w-[540px]">
            {description}
          </p>
        )}

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber text-white text-[14px] font-semibold font-inter hover:bg-amber-dark transition-colors"
          >
            <span>Start the quiz</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
          <span className="text-[11px] text-text-muted font-inter">
            Opens in a focused window · Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
