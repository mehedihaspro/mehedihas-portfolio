"use client";

import { useState } from "react";
import {
  Check,
  X,
  RotateCcw,
  Share2,
  ChevronRight,
} from "lucide-react";
import type { QuizQuestion, QuizAnswer } from "./types";
import { QuizModalShell } from "./quiz-modal-shell";
import { Button } from "@/components/ui/button";

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  onRetake: () => void;
  onShare: (score: number, total: number) => void;
  onClose: () => void;
}

interface ScoreTier {
  min: number;
  title: string;
  message: string;
}

const TIERS: ScoreTier[] = [
  {
    min: 100,
    title: "Perfect score",
    message: "Every answer nailed. Did you write this article?",
  },
  {
    min: 80,
    title: "Impressive",
    message: "You were paying close attention. Great read-through.",
  },
  {
    min: 60,
    title: "Solid",
    message: "You got the gist. A second read might surface more.",
  },
  {
    min: 40,
    title: "Getting there",
    message: "Some ideas landed. Worth another look at the details.",
  },
  {
    min: 0,
    title: "Honest start",
    message: "Re-read the article and come back stronger.",
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
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const tier = getTier(percent);

  const handleJumpToSection = (slug: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(slug);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Circular progress geometry
  const RING_SIZE = 144;
  const STROKE = 10;
  const RADIUS = (RING_SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - percent / 100);

  return (
    <QuizModalShell isOpen onDismiss={onClose} ariaLabel="Quiz results">
      {/* Top: close */}
      <div className="px-6 md:px-8 pt-6 pb-2 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          aria-label="Close results"
        >
          <X size={16} />
        </button>
      </div>

      {/* ============ SCORE HERO ============ */}
      <div className="px-6 md:px-8 pb-6 text-center">
        <div className="inline-flex relative mb-5">
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth={STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--amber)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              style={{ transition: "stroke-dashoffset 700ms ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[36px] font-bold tabular-nums text-text-primary leading-none font-inter">
              {correctCount}
              <span className="text-[18px] text-text-muted">/{total}</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-text-muted mt-1">
              Your score
            </span>
          </div>
        </div>

        <h2 className="text-[24px] md:text-[28px] font-bold text-text-primary tracking-[-0.01em] font-inter mb-2">
          {tier.title}
        </h2>
        <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-inter max-w-[420px] mx-auto">
          {tier.message}
        </p>
      </div>

      {/* ============ STATS ============ */}
      <div className="px-6 md:px-8 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] border border-border bg-bg p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-success-soft flex items-center justify-center">
              <Check size={11} className="text-success" strokeWidth={3} />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted">
              Correct
            </span>
          </div>
          <p className="text-[24px] font-bold text-text-primary font-inter tabular-nums">
            {correctCount}
          </p>
        </div>
        <div className="rounded-[14px] border border-border bg-bg p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-error-soft flex items-center justify-center">
              <X size={11} className="text-error" strokeWidth={3} />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted">
              Wrong
            </span>
          </div>
          <p className="text-[24px] font-bold text-text-primary font-inter tabular-nums">
            {total - correctCount}
          </p>
        </div>
      </div>

      {/* ============ ACTIONS ============ */}
      <div className="px-6 md:px-8 mt-5 flex flex-col sm:flex-row gap-2.5">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onShare(correctCount, total)}
          leadingIcon={<Share2 size={14} />}
        >
          Share your score
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onRetake}
          leadingIcon={<RotateCcw size={14} />}
        >
          Try again
        </Button>
      </div>

      {/* ============ REVIEW ============ */}
      <div className="px-6 md:px-8 mt-6 mb-6 pt-5 border-t border-border">
        <button
          type="button"
          onClick={() => setShowReview((v) => !v)}
          className="w-full flex items-center justify-between mb-4 group"
          aria-expanded={showReview}
        >
          <span className="text-[12px] font-mono uppercase tracking-[0.12em] text-text-muted group-hover:text-text-primary transition-colors">
            {showReview ? "Hide" : "Review"} your answers
          </span>
          <span
            className={`w-7 h-7 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted group-hover:text-text-primary transition-transform ${
              showReview ? "rotate-90" : ""
            }`}
            aria-hidden="true"
          >
            <ChevronRight size={13} />
          </span>
        </button>

        {showReview && (
          <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1">
            {questions.map((q, qIdx) => {
              const answer = answers[qIdx];
              const selectedOption = q.options[answer.selectedOptionIndex];
              const correctOption = q.options.find((o) => o.correct);
              const isCorrect = answer.isCorrect;

              return (
                <div
                  key={q._key || qIdx}
                  className={`rounded-[12px] border p-4 ${
                    isCorrect
                      ? "border-success/30 bg-success-soft"
                      : "border-error/30 bg-error-soft"
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-3">
                    <span
                      className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? "bg-success" : "bg-error"
                      }`}
                      aria-hidden="true"
                    >
                      {isCorrect ? (
                        <Check size={11} className="text-white" strokeWidth={3} />
                      ) : (
                        <X size={11} className="text-white" strokeWidth={3} />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-1">
                        Q.{String(qIdx + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[13px] font-bold text-text-primary leading-snug font-inter">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="pl-[34px]">
                    <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-0.5">
                      Your answer
                    </p>
                    <p
                      className={`text-[13px] leading-relaxed font-inter mb-2 ${
                        isCorrect ? "text-success" : "text-error"
                      }`}
                    >
                      {selectedOption?.text || "—"}
                    </p>

                    {!isCorrect && correctOption && (
                      <>
                        <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-0.5">
                          Correct answer
                        </p>
                        <p className="text-[13px] text-success leading-relaxed font-inter mb-2">
                          {correctOption.text}
                        </p>
                      </>
                    )}

                    {q.explanation && (
                      <div className="pt-2 border-t border-border/60">
                        <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-0.5">
                          Why
                        </p>
                        <p className="text-[12px] text-text-secondary leading-relaxed font-inter">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {q.relatedSection && !isCorrect && (
                      <button
                        type="button"
                        onClick={() =>
                          handleJumpToSection(q.relatedSection || "")
                        }
                        className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-amber hover:text-amber-dark transition-colors font-inter"
                      >
                        Read this section
                        <ChevronRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </QuizModalShell>
  );
}
