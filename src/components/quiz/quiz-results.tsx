"use client";

import { useState } from "react";
import { Check, X, RotateCcw, Share2, ArrowLeft, ArrowRight } from "lucide-react";
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

type View = "score" | "review";

export function QuizResults({
  questions,
  answers,
  onRetake,
  onShare,
  onClose,
}: QuizResultsProps) {
  const [view, setView] = useState<View>("score");

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
      {view === "score" ? (
        <ScoreView
          tier={tier}
          correctCount={correctCount}
          total={total}
          ringSize={RING_SIZE}
          stroke={STROKE}
          radius={RADIUS}
          circumference={CIRC}
          dashOffset={dashOffset}
          onClose={onClose}
          onRetake={onRetake}
          onShare={() => onShare(correctCount, total)}
          onReview={() => setView("review")}
        />
      ) : (
        <ReviewView
          questions={questions}
          answers={answers}
          onBack={() => setView("score")}
          onClose={onClose}
          onJumpToSection={handleJumpToSection}
        />
      )}
    </QuizModalShell>
  );
}

/* ============================================
   Score view
   ============================================ */

interface ScoreViewProps {
  tier: ScoreTier;
  correctCount: number;
  total: number;
  ringSize: number;
  stroke: number;
  radius: number;
  circumference: number;
  dashOffset: number;
  onClose: () => void;
  onRetake: () => void;
  onShare: () => void;
  onReview: () => void;
}

function ScoreView({
  tier,
  correctCount,
  total,
  ringSize,
  stroke,
  radius,
  circumference,
  dashOffset,
  onClose,
  onRetake,
  onShare,
  onReview,
}: ScoreViewProps) {
  const wrongCount = total - correctCount;

  return (
    <>
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

      {/* Score hero */}
      <div className="px-6 md:px-8 pb-6 text-center">
        <div className="inline-flex relative mb-5">
          <svg
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            aria-hidden="true"
          >
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth={stroke}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              stroke="var(--amber)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
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

        <h2 className="text-[26px] md:text-[30px] font-bold text-text-primary tracking-[-0.01em] font-inter mb-2">
          {tier.title}
        </h2>
        <p className="text-[14px] md:text-[15px] text-text-secondary leading-relaxed font-inter max-w-[420px] mx-auto">
          {tier.message}
        </p>

        {/* Inline stat chips — replaces the two heavy stat cards */}
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-success-soft text-success text-[12px] font-semibold font-inter">
            <Check size={12} strokeWidth={3} aria-hidden="true" />
            {correctCount} correct
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-error-soft text-error text-[12px] font-semibold font-inter">
            <X size={12} strokeWidth={3} aria-hidden="true" />
            {wrongCount} wrong
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 md:px-8 pb-2 flex flex-col sm:flex-row gap-2.5">
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={onShare}
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

      {/* Review link */}
      <div className="px-6 md:px-8 py-5">
        <button
          type="button"
          onClick={onReview}
          className="w-full flex items-center justify-center gap-2 py-2 text-[13px] font-semibold text-text-secondary hover:text-amber font-inter transition-colors"
        >
          Review your answers
          <ArrowRight size={13} />
        </button>
      </div>
    </>
  );
}

/* ============================================
   Review view — second "page" inside the modal
   ============================================ */

interface ReviewViewProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  onBack: () => void;
  onClose: () => void;
  onJumpToSection: (slug: string) => void;
}

function ReviewView({
  questions,
  answers,
  onBack,
  onClose,
  onJumpToSection,
}: ReviewViewProps) {
  return (
    <>
      {/* Top: back + title + close */}
      <div className="px-6 md:px-8 pt-6 pb-4 flex items-center gap-3 border-b border-border">
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          aria-label="Back to score"
        >
          <ArrowLeft size={16} />
        </button>
        <h2 className="flex-1 text-[14px] font-semibold text-text-primary font-inter truncate">
          Review your answers
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable review list */}
      <div className="px-6 md:px-8 py-5 flex flex-col gap-3 max-h-[min(60vh,520px)] overflow-y-auto">
        {questions.map((q, qIdx) => {
          const answer = answers[qIdx];
          const selectedOption = q.options[answer.selectedOptionIndex];
          const correctOption = q.options.find((o) => o.correct);
          const isCorrect = answer.isCorrect;

          return (
            <article
              key={q._key || qIdx}
              className={`rounded-[14px] border p-4 ${
                isCorrect
                  ? "border-success/30 bg-success-soft"
                  : "border-error/30 bg-error-soft"
              }`}
            >
              <header className="flex items-start gap-2.5 mb-3">
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
                  <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-text-muted mb-1 tabular-nums">
                    Question {qIdx + 1}
                  </p>
                  <p className="text-[13px] font-bold text-text-primary leading-snug font-inter">
                    {q.question}
                  </p>
                </div>
              </header>

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
                    onClick={() => onJumpToSection(q.relatedSection || "")}
                    className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-amber hover:text-amber-dark transition-colors font-inter"
                  >
                    Read this section
                    <ArrowRight size={11} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer: back button */}
      <div className="px-6 md:px-8 py-4 border-t border-border">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onBack}
          leadingIcon={<ArrowLeft size={14} />}
        >
          Back to score
        </Button>
      </div>
    </>
  );
}
