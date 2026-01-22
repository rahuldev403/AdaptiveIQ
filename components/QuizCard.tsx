"use client";

import React, { useState } from "react";
import { Question, Citation } from "@/lib/db/schema";
import { LiveSourceBadge } from "./LiveSourceBadge";
import { ReadSourceButton } from "./ReadSourceButton";

interface QuizCardProps {
  question: Question;
  citations: Citation[];
  sourceLinks: string[];
  onAnswer: (
    questionId: string,
    selectedAnswer: number,
    isCorrect: boolean,
  ) => void;
}

/**
 * Main Quiz Card Component
 * Displays a question with multiple choice options, source badge, and read source button
 */
export function QuizCard({
  question,
  citations,
  sourceLinks,
  onAnswer,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionClick = (optionIndex: number) => {
    if (hasAnswered) return;

    setSelectedAnswer(optionIndex);
    setHasAnswered(true);
    setShowExplanation(true);

    const isCorrect = optionIndex === question.correct_answer;
    onAnswer(question.id, optionIndex, isCorrect);
  };

  const isCorrect = selectedAnswer === question.correct_answer;
  const isWrong = selectedAnswer !== null && !isCorrect;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 border border-gray-200 dark:border-gray-700">
      {/* Header with Live Source Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {question.difficulty?.toUpperCase() || "MEDIUM"}
            </span>
            {sourceLinks.length > 0 && (
              <LiveSourceBadge sourceUrl={sourceLinks[0]} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correct_answer;

          let optionStyle =
            "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600";

          if (hasAnswered) {
            if (isCorrectOption) {
              optionStyle =
                "bg-green-50 dark:bg-green-900/20 border-green-500 ring-2 ring-green-500";
            } else if (isSelected && !isCorrect) {
              optionStyle =
                "bg-red-50 dark:bg-red-900/20 border-red-500 ring-2 ring-red-500";
            }
          } else if (isSelected) {
            optionStyle = "bg-blue-50 dark:bg-blue-900/20 border-blue-500";
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionStyle} ${
                hasAnswered ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center font-semibold text-sm border-2">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-gray-900 dark:text-white">
                  {option}
                </span>
                {hasAnswered && isCorrectOption && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation and Read Source (shown when wrong) */}
      {showExplanation && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
            }`}
          >
            <h4
              className={`font-semibold mb-2 ${
                isCorrect
                  ? "text-green-800 dark:text-green-300"
                  : "text-amber-800 dark:text-amber-300"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>

          {/* Show Read Source button when answer is wrong */}
          {isWrong && (
            <ReadSourceButton
              citations={citations}
              onOpenSource={(url) => window.open(url, "_blank")}
            />
          )}
        </div>
      )}
    </div>
  );
}
