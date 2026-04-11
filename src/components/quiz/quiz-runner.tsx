"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { QuizQuestion, QuizAnswer } from "./types";
import { QuizModalShell } from "./quiz-modal-shell";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete: (answers: QuizAnswer[]) => void;
  onExit: () => void;
}

export function QuizRunner({ questions, onComplete, onExit }: QuizRunnerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions.map(() => null)
  );
  const [transitioning, setTransitioning] = useState(false);

  const currentQuestion = questions[currentIdx];
  const currentAnswer = answers[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const hasAnyAnswer = answers.some((a) => a !== null);

  const handleSelect = useCallback(
    (optionIdx: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIdx] = optionIdx;
        return next;
      });
    },
    [currentIdx]
  );

  const handleNext = useCallback(() => {
    if (currentAnswer === null) return;

    if (isLast) {
      const finalAnswers: QuizAnswer[] = questions.map((q, i) => {
        const selected = answers[i] ?? 0;
        return {
          questionIndex: i,
          selectedOptionIndex: selected,
          isCorrect: q.options[selected]?.correct || false,
        };
      });
      onComplete(finalAnswers);
      return;
    }

    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx((i) => i + 1);
      setTransitioning(false);
    }, 180);
  }, [answers, currentAnswer, isLast, onComplete, questions]);

  const handlePrev = useCallback(() => {
    if (currentIdx === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx((i) => i - 1);
      setTransitioning(false);
    }, 180);
  }, [currentIdx]);

  // Confirm before discarding in-progress quiz
  const handleDismiss = useCallback(() => {
    if (hasAnyAnswer) {
      const ok = window.confirm("Exit the quiz? Your answers will be lost.");
      if (!ok) return;
    }
    onExit();
  }, [hasAnyAnswer, onExit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // ESC handled inside the shell — but we override here so it routes
      // through the confirm dialog when an answer is in progress.
      if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
        return;
      }
      const num = Number.parseInt(e.key, 10);
      if (
        Number.isFinite(num) &&
        num >= 1 &&
        num <= currentQuestion.options.length
      ) {
        handleSelect(num - 1);
        return;
      }
      if (e.key === "Enter" && currentAnswer !== null) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [currentQuestion, currentAnswer, handleNext, handleSelect, handleDismiss]);

  return (
    <QuizModalShell
      isOpen
      onDismiss={handleDismiss}
      ariaLabel="Quiz"
      preventBackdropDismiss={hasAnyAnswer}
    >
      {/* ============ TOP: segmented progress + close ============ */}
      <div className="px-6 md:px-8 pt-6 pb-4 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-1.5">
          {questions.map((_, idx) => {
            const filled = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <span
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  active || filled ? "bg-amber" : "bg-bg-subtle"
                }`}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
          aria-label="Close quiz"
        >
          <X size={16} />
        </button>
      </div>

      {/* ============ QUESTION BODY ============ */}
      <div
        key={currentIdx}
        className={`px-6 md:px-8 pb-2 transition-all duration-200 ease-out ${
          transitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="text-[13px] font-mono uppercase tracking-[0.1em] text-text-muted mb-3">
          Q.{String(currentIdx + 1).padStart(2, "0")}
        </p>

        <h2 className="text-[22px] md:text-[26px] font-bold text-text-primary leading-[1.25] tracking-[-0.01em] font-inter mb-6">
          {currentQuestion.question}
        </h2>

        <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-text-muted mb-3">
          Select only 1
        </p>

        {/* Options */}
        <ul className="flex flex-col gap-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = currentAnswer === idx;
            return (
              <li key={option._key || idx}>
                <button
                  type="button"
                  onClick={() => handleSelect(idx)}
                  aria-pressed={isSelected}
                  className={`group w-full flex items-center gap-3 p-3.5 md:p-4 rounded-[14px] border text-left transition-colors ${
                    isSelected
                      ? "border-amber bg-highlight-bg"
                      : "border-border bg-bg-card hover:bg-bg-subtle"
                  }`}
                >
                  {/* Round radio */}
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-amber bg-amber"
                        : "border-border bg-bg group-hover:border-text-muted"
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>

                  <span
                    className={`flex-1 text-[14px] md:text-[15px] leading-snug font-inter ${
                      isSelected
                        ? "text-text-primary font-semibold"
                        : "text-text-secondary group-hover:text-text-primary"
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ============ FOOTER ============ */}
      <div className="px-6 md:px-8 py-5 mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary font-inter"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentAnswer === null}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg text-[13px] font-semibold font-inter hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isLast ? "See results" : "Next"}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="px-6 md:px-8 pb-5 hidden md:block">
        <p className="text-[11px] text-text-muted font-inter">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-bg-subtle text-[10px] font-mono">
            1–{currentQuestion.options.length}
          </kbd>{" "}
          to select ·{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-bg-subtle text-[10px] font-mono">
            Enter
          </kbd>{" "}
          to continue ·{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-bg-subtle text-[10px] font-mono">
            Esc
          </kbd>{" "}
          to close
        </p>
      </div>
    </QuizModalShell>
  );
}
