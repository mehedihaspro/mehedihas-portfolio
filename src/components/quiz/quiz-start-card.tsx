"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      {/* Section label with meta inline — replaces the brain-icon top row */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div className="w-3.5 h-0.5 bg-amber rounded-full" />
        <h4 className="text-[14px] font-bold uppercase tracking-[1.5px] text-text-muted font-inter">
          End of article quiz
        </h4>
        <span className="text-text-muted/50 font-inter text-[14px]">·</span>
        <span className="text-[12px] text-text-muted font-inter tabular-nums">
          {questionCount} {questionCount === 1 ? "question" : "questions"}
        </span>
        <span className="text-text-muted/50 font-inter text-[14px]">·</span>
        <span className="text-[12px] text-text-muted font-inter">
          ~{estimatedMinutes} min
        </span>
      </div>

      {/* Card */}
      <div className="rounded-[14px] border border-border bg-bg-card p-7 md:p-10">
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
          <Button
            variant="primary"
            size="md"
            onClick={onStart}
            trailingIcon={<ArrowRight size={14} strokeWidth={2.5} />}
          >
            Start the quiz
          </Button>
          <span className="text-[11px] text-text-muted font-inter">
            Opens in a focused window · Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
