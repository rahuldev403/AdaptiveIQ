"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Code2, Tag } from "lucide-react";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuestionData {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  difficulty: Difficulty;
  topic: string;
}

interface QuestionCardProps {
  question: QuestionData;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  showResult?: boolean;
  correctAnswer?: number;
  disabled?: boolean;
}

const difficultyColors = {
  easy: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  medium: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  hard: "text-rose-400 border-rose-500/20 bg-rose-500/10",
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  showResult = false,
  correctAnswer,
  disabled = false,
}: QuestionCardProps) {
  const getOptionStyles = (index: number) => {
    const isSelected = selectedOption === index;
    const isCorrect = showResult && correctAnswer === index;
    const isWrong = showResult && isSelected && correctAnswer !== index;

    if (isCorrect) {
      return "border-success bg-success/10 ring-2 ring-success/20";
    }
    if (isWrong) {
      return "border-danger bg-danger/10 ring-2 ring-danger/20";
    }
    if (isSelected) {
      return "border-primary bg-primary/10 ring-2 ring-primary/20";
    }
    return "border-slate-700 bg-slate-900";
  };

  const getOptionHoverStyles = (index: number) => {
    if (disabled || showResult) return "";
    return "hover:border-slate-600 hover:bg-slate-800/70 cursor-pointer";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full"
      >
        <div className="glass-panel rounded-xl p-6 lg:p-8 space-y-6">
          {/* Header: Tags */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={`${difficultyColors[question.difficulty]} font-semibold`}
            >
              {difficultyLabels[question.difficulty]}
            </Badge>
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-700 bg-slate-800/50"
            >
              <Tag className="w-3 h-3 mr-1.5" />
              {question.topic}
            </Badge>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-lg lg:text-xl font-medium text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Code Snippet (if provided) */}
          {question.codeSnippet && (
            <div className="relative">
              <div className="absolute -top-3 left-4 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3 h-3" />
                Code
              </div>
              <pre className="font-mono text-sm bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto scrollbar-thin">
                <code className="text-slate-300">{question.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            <p className="text-sm text-slate-400 font-medium">
              Select your answer:
            </p>
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const keyboardHint = index + 1; // 1, 2, 3, 4

              return (
                <motion.button
                  key={index}
                  onClick={() => !disabled && onSelectOption(index)}
                  className={`
                    w-full p-4 text-left rounded-lg border transition-all
                    ${getOptionStyles(index)}
                    ${getOptionHoverStyles(index)}
                    relative group
                  `}
                  whileHover={!disabled && !showResult ? { scale: 1.01 } : {}}
                  whileTap={!disabled && !showResult ? { scale: 0.99 } : {}}
                  disabled={disabled}
                >
                  <div className="flex items-start gap-3">
                    {/* Option Letter */}
                    <span
                      className={`
                      flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-semibold text-sm
                      ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-slate-800 text-slate-400"
                      }
                      ${
                        showResult && correctAnswer === index
                          ? "bg-success text-white"
                          : ""
                      }
                      ${
                        showResult && isSelected && correctAnswer !== index
                          ? "bg-danger text-white"
                          : ""
                      }
                    `}
                    >
                      {optionLetter}
                    </span>

                    {/* Option Text */}
                    <span
                      className={`
                      flex-1 text-slate-200 leading-relaxed
                      ${isSelected ? "font-medium" : ""}
                    `}
                    >
                      {option}
                    </span>

                    {/* Keyboard Hint */}
                    <span
                      className={`
                      flex-shrink-0 px-2 py-1 rounded text-xs font-mono font-semibold
                      ${
                        isSelected
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }
                      transition-all
                      group-hover:bg-slate-700 group-hover:text-slate-400
                    `}
                    >
                      {keyboardHint}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              💡 Tip: Use keyboard shortcuts{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                1
              </kbd>
              {" - "}
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                4
              </kbd>{" "}
              to select options
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
