"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import type { QuizQuestion, QuizAnswer } from "./types";

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
  const progress = ((currentIdx + 1) / questions.length) * 100;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard support: 1-6 to select, Enter to advance, Esc to exit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }
      const num = Number.parseInt(e.key, 10);
      if (num >= 1 && num <= currentQuestion.options.length) {
        handleSelect(num - 1);
      }
      if (e.key === "Enter" && currentAnswer !== null) {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, currentAnswer, currentQuestion]);

  const handleSelect = (optionIdx: number) => {
    const next = [...answers];
    next[currentIdx] = optionIdx;
    setAnswers(next);
  };

  const handleNext = () => {
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
    }, 200);
  };

  const handlePrev = () => {
    if (currentIdx === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx((i) => i - 1);
      setTransitioning(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-bg overflow-y-auto">
      {/* Top bar: progress + exit */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-[820px] px-6 py-4 flex items-center gap-4">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted font-inter">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-[11px] font-bold text-amber font-mono tabular-nums font-inter">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-amber transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Exit button */}
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full bg-bg-subtle hover:bg-cream flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="Exit quiz"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Question area */}
      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-20">
        <div
          key={currentIdx}
          className={`transition-all duration-300 ${
            transitioning
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Question number marker */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-display font-bold text-[48px] leading-none text-amber">
              {String(currentIdx + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-border ml-2" />
          </div>

          {/* Question */}
          <h2 className="text-[24px] md:text-[30px] font-bold text-text-primary leading-[1.3] font-inter mb-8 tracking-[-0.01em]">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentAnswer === idx;
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <button
                  key={option._key || idx}
                  onClick={() => handleSelect(idx)}
                  className={`group flex items-start gap-4 p-5 rounded-[14px] border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-amber bg-highlight-bg shadow-[0_4px_12px_rgba(232,168,50,0.15)]"
                      : "border-border bg-bg-card hover:border-amber/50 hover:-translate-y-0.5"
                  }`}
                >
                  {/* Letter badge */}
                  <div
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold font-inter transition-all ${
                      isSelected
                        ? "bg-amber text-white scale-110"
                        : "bg-bg-subtle text-text-muted group-hover:bg-cream"
                    }`}
                  >
                    {letter}
                  </div>

                  {/* Option text */}
                  <span
                    className={`flex-1 text-[15px] md:text-[16px] leading-relaxed font-inter pt-1 transition-colors ${
                      isSelected
                        ? "text-text-primary font-medium"
                        : "text-text-secondary group-hover:text-text-primary"
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Keyboard hint */}
          <p className="text-[11px] text-text-muted mt-6 font-inter hidden md:block">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-bg-subtle border border-border text-[10px] font-mono">
              1-{currentQuestion.options.length}
            </kbd>{" "}
            to select,{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-bg-subtle border border-border text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to continue
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-bg/95 backdrop-blur-md border-t border-border">
        <div className="mx-auto max-w-[680px] px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-secondary font-inter"
          >
            <ArrowLeft size={14} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentAnswer === null}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber hover:bg-amber-dark text-white text-[13px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed font-inter shadow-[0_4px_12px_rgba(232,168,50,0.25)]"
          >
            {isLast ? "See results" : "Next"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
