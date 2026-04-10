"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Share2,
  Trophy,
  ChevronRight,
} from "lucide-react";
import type { QuizQuestion, QuizAnswer } from "./types";

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  onRetake: () => void;
  onShare: (score: number, total: number) => void;
  onClose: () => void;
}

interface ScoreTier {
  min: number;
  emoji: string;
  title: string;
  message: string;
  color: string;
}

const TIERS: ScoreTier[] = [
  {
    min: 100,
    emoji: "🎯",
    title: "Perfect",
    message: "Did you write this article? Every answer nailed.",
    color: "#2E7D32",
  },
  {
    min: 80,
    emoji: "⭐",
    title: "Impressive",
    message: "You were paying attention. Great read-through.",
    color: "#E8A832",
  },
  {
    min: 60,
    emoji: "📖",
    title: "Solid",
    message: "You got the gist. A second read might reveal more.",
    color: "#8B6B4A",
  },
  {
    min: 40,
    emoji: "🤔",
    title: "Getting there",
    message: "Some ideas landed. Worth another look at the details.",
    color: "#C48A1A",
  },
  {
    min: 0,
    emoji: "💭",
    title: "Honest start",
    message: "Let's try that again. Re-read and come back stronger.",
    color: "#6B5D4F",
  },
];

function getTier(percent: number): ScoreTier {
  return TIERS.find((t) => percent >= t.min) || TIERS[TIERS.length - 1];
}

export function QuizResults({
  questions,
  answers,
  onRetake,
  onShare,
  onClose,
}: QuizResultsProps) {
  const [showReview, setShowReview] = useState(false);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const total = questions.length;
  const percent = Math.round((correctCount / total) * 100);
  const tier = getTier(percent);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleJumpToSection = (slug: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-bg overflow-y-auto">
      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-10 w-10 h-10 rounded-full bg-bg-card border border-border hover:bg-bg-subtle flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Score hero */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Trophy icon */}
          <div className="relative inline-flex mb-6">
            <div
              className="absolute inset-0 blur-2xl opacity-30 rounded-full"
              style={{ backgroundColor: tier.color }}
            />
            <div
              className="relative w-20 h-20 rounded-[24px] flex items-center justify-center border-2"
              style={{
                backgroundColor: `${tier.color}15`,
                borderColor: `${tier.color}40`,
              }}
            >
              <Trophy size={36} style={{ color: tier.color }} strokeWidth={1.5} />
            </div>
          </div>

          {/* Tier label */}
          <p
            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 font-inter"
            style={{ color: tier.color }}
          >
            {tier.emoji} {tier.title}
          </p>

          {/* Score */}
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="font-display font-bold text-[100px] md:text-[140px] leading-none text-text-primary tracking-[-0.04em]">
              {correctCount}
            </span>
            <span className="font-display font-bold text-[40px] md:text-[56px] leading-none text-text-muted">
              /{total}
            </span>
          </div>

          {/* Message */}
          <p className="text-[17px] md:text-[19px] text-text-secondary leading-relaxed font-inter max-w-[440px] mx-auto">
            {tier.message}
          </p>
        </div>

        {/* Breakdown stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="rounded-[14px] bg-bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#2E7D32]/15 flex items-center justify-center">
                <Check size={12} className="text-[#2E7D32]" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                Correct
              </span>
            </div>
            <p className="text-[28px] font-bold text-text-primary font-inter">
              {correctCount}
            </p>
          </div>
          <div className="rounded-[14px] bg-bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 flex items-center justify-center">
                <X size={12} className="text-[#C0392B]" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
                Wrong
              </span>
            </div>
            <p className="text-[28px] font-bold text-text-primary font-inter">
              {total - correctCount}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={() => onShare(correctCount, total)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-amber hover:bg-amber-dark text-white font-semibold text-[14px] font-inter transition-all hover:shadow-lg shadow-[0_4px_14px_rgba(232,168,50,0.3)]"
          >
            <Share2 size={15} />
            Share your score
          </button>
          <button
            onClick={onRetake}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-bg-card border border-border hover:bg-bg-subtle text-text-primary font-semibold text-[14px] font-inter transition-colors"
          >
            <RotateCcw size={15} />
            Try again
          </button>
        </div>

        {/* Toggle review */}
        <div className="border-t border-border pt-8">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between mb-6 group"
          >
            <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter group-hover:text-text-primary transition-colors">
              {showReview ? "Hide" : "Review"} your answers
            </span>
            <div
              className={`w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted group-hover:text-text-primary transition-all ${
                showReview ? "rotate-90" : ""
              }`}
            >
              <ChevronRight size={14} />
            </div>
          </button>

          {showReview && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {questions.map((q, qIdx) => {
                const answer = answers[qIdx];
                const selectedOption = q.options[answer.selectedOptionIndex];
                const correctOption = q.options.find((o) => o.correct);
                const isCorrect = answer.isCorrect;

                return (
                  <div
                    key={q._key || qIdx}
                    className={`rounded-[14px] border-2 p-5 ${
                      isCorrect
                        ? "border-[#2E7D32]/20 bg-[#2E7D32]/5"
                        : "border-[#C0392B]/20 bg-[#C0392B]/5"
                    }`}
                  >
                    {/* Question header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          isCorrect ? "bg-[#2E7D32]" : "bg-[#C0392B]"
                        }`}
                      >
                        {isCorrect ? (
                          <Check size={13} className="text-white" strokeWidth={3} />
                        ) : (
                          <X size={13} className="text-white" strokeWidth={3} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter mb-1">
                          Question {qIdx + 1}
                        </p>
                        <p className="text-[15px] font-bold text-text-primary leading-snug font-inter">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {/* Your answer */}
                    <div className="mb-3 pl-10">
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted mb-1 font-inter">
                        Your answer
                      </p>
                      <p
                        className={`text-[14px] leading-relaxed font-inter ${
                          isCorrect ? "text-[#2E7D32]" : "text-[#C0392B]"
                        }`}
                      >
                        {selectedOption?.text || "—"}
                      </p>
                    </div>

                    {/* Correct answer (if wrong) */}
                    {!isCorrect && correctOption && (
                      <div className="mb-3 pl-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted mb-1 font-inter">
                          Correct answer
                        </p>
                        <p className="text-[14px] text-[#2E7D32] leading-relaxed font-inter">
                          {correctOption.text}
                        </p>
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="pl-10 pt-3 border-t border-border/60">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted mb-1.5 font-inter">
                          Explanation
                        </p>
                        <p className="text-[13px] text-text-secondary leading-relaxed font-inter">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* Jump to section link */}
                    {q.relatedSection && !isCorrect && (
                      <div className="pl-10 mt-3">
                        <button
                          onClick={() =>
                            handleJumpToSection(q.relatedSection || "")
                          }
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber hover:text-amber-dark transition-colors font-inter"
                        >
                          Read this section
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
