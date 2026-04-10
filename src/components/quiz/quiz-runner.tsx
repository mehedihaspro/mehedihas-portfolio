"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, X, CircleDot, Circle } from "lucide-react";
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
    }, 220);
  };

  const handlePrev = () => {
    if (currentIdx === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIdx((i) => i - 1);
      setTransitioning(false);
    }, 220);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-bg overflow-y-auto">
      {/* Ambient background gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,168,50,0.15) 0%, transparent 60%)",
        }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-bg/90 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-[820px] px-4 md:px-6 py-4 flex items-center gap-4">
          {/* Question dots */}
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`transition-all duration-300 ${
                  idx === currentIdx
                    ? "w-6 h-1.5 rounded-full bg-amber"
                    : idx < currentIdx
                    ? "w-1.5 h-1.5 rounded-full bg-amber/50"
                    : "w-1.5 h-1.5 rounded-full bg-border"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 flex items-center justify-end gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted font-inter">
              {currentIdx + 1} / {questions.length}
            </span>
            <button
              onClick={onExit}
              className="w-9 h-9 rounded-full bg-bg-subtle hover:bg-cream flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Exit quiz"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="relative mx-auto max-w-[680px] px-4 md:px-6 py-10 md:py-16">
        <div
          key={currentIdx}
          className={`transition-all duration-300 ${
            transitioning
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* Big question number */}
          <div className="flex items-center gap-3 mb-7">
            <span className="font-display font-bold text-[72px] md:text-[88px] leading-[0.85] text-amber/30 tracking-[-0.04em]">
              {String(currentIdx + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-amber/40 to-transparent" />
          </div>

          {/* Question */}
          <h2 className="text-[24px] md:text-[34px] font-bold text-text-primary leading-[1.25] font-inter mb-9 tracking-[-0.01em]">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentAnswer === idx;
              const letter = String.fromCharCode(65 + idx);
              return (
                <button
                  key={option._key || idx}
                  onClick={() => handleSelect(idx)}
                  className={`group flex items-center gap-4 p-4 md:p-5 rounded-[16px] text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-highlight-bg ring-[1.5px] ring-amber"
                      : "bg-bg-card hover:bg-bg-subtle ring-[1px] ring-border"
                  }`}
                >
                  {/* Radio indicator */}
                  <div className="shrink-0">
                    {isSelected ? (
                      <CircleDot size={22} className="text-amber" strokeWidth={2} />
                    ) : (
                      <Circle size={22} className="text-text-muted/60 group-hover:text-text-secondary transition-colors" strokeWidth={1.8} />
                    )}
                  </div>

                  {/* Letter */}
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono transition-all ${
                      isSelected
                        ? "bg-amber text-white"
                        : "bg-bg-subtle text-text-muted"
                    }`}
                  >
                    {letter}
                  </div>

                  {/* Text */}
                  <span
                    className={`flex-1 text-[15px] md:text-[16px] leading-snug font-inter transition-colors ${
                      isSelected
                        ? "text-text-primary font-semibold"
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
          <p className="text-[11px] text-text-muted mt-7 font-inter hidden md:block">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-bg-subtle text-[10px] font-mono">
              1-{currentQuestion.options.length}
            </kbd>{" "}
            or{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-bg-subtle text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to continue
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 bg-bg/90 backdrop-blur-xl border-t border-border/60">
        <div className="mx-auto max-w-[680px] px-4 md:px-6 py-4 flex items-center justify-between gap-4">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber text-white text-[13px] font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed font-inter hover:shadow-[0_8px_20px_rgba(232,168,50,0.35)]"
            style={{
              boxShadow:
                currentAnswer !== null
                  ? "0 4px 12px rgba(232,168,50,0.3)"
                  : "none",
            }}
          >
            {isLast ? "See results" : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Progress strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-border/60">
          <div
            className="h-full bg-amber rounded-r-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
