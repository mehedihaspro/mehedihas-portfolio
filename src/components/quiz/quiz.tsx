"use client";

import { useMemo, useState } from "react";
import { QuizStartCard } from "./quiz-start-card";
import { QuizRunner } from "./quiz-runner";
import { QuizResults } from "./quiz-results";
import { QuizShareModal } from "./quiz-share-modal";
import type { Quiz as QuizType, QuizAnswer, QuizQuestion } from "./types";

interface QuizProps {
  quiz: QuizType;
  articleTitle: string;
  articleUrl: string;
}

type QuizState = "idle" | "running" | "results";

// Fisher–Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Quiz({ quiz, articleTitle, articleUrl }: QuizProps) {
  const [state, setState] = useState<QuizState>("idle");
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [seed, setSeed] = useState(0);

  // Randomize question order + options on each attempt
  const shuffledQuestions = useMemo<QuizQuestion[]>(() => {
    if (!quiz.questions) return [];
    return shuffle(
      quiz.questions.map((q) => ({
        ...q,
        options: shuffle(q.options),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.questions, seed]);

  if (!quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const handleStart = () => {
    setSeed((s) => s + 1);
    setAnswers([]);
    setState("running");
  };

  const handleComplete = (answers: QuizAnswer[]) => {
    setAnswers(answers);
    setState("results");
  };

  const handleRetake = () => {
    setSeed((s) => s + 1);
    setAnswers([]);
    setState("running");
  };

  const handleClose = () => {
    setState("idle");
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;

  return (
    <>
      {/* Start card — always visible when state is idle */}
      {state === "idle" && (
        <QuizStartCard
          title={quiz.title || "Test your understanding"}
          description={quiz.description}
          questionCount={quiz.questions.length}
          onStart={handleStart}
        />
      )}

      {/* Quiz runner */}
      {state === "running" && (
        <QuizRunner
          questions={shuffledQuestions}
          onComplete={handleComplete}
          onExit={handleClose}
        />
      )}

      {/* Results */}
      {state === "results" && (
        <QuizResults
          questions={shuffledQuestions}
          answers={answers}
          onRetake={handleRetake}
          onShare={() => setShareOpen(true)}
          onClose={handleClose}
        />
      )}

      {/* Share modal */}
      <QuizShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        score={correctCount}
        total={quiz.questions.length}
        articleTitle={articleTitle}
        articleUrl={articleUrl}
      />
    </>
  );
}
