"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import QuestionCard from "@/components/quiz/QuestionCard";

/**
 * ProgressHeader Component
 * Displays segmented progress bar, streak indicator, and quit button
 */
interface ProgressHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  streak: number;
  correctCount: number;
  wrongCount: number;
  sessionId: string;
  onQuit: () => void;
}

function ProgressHeader({
  currentIndex,
  totalQuestions,
  streak,
  correctCount,
  wrongCount,
  sessionId,
  onQuit,
}: ProgressHeaderProps) {
  const progressPercentage = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Quit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onQuit}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4 mr-2" />
            Quit
          </Button>

          {/* Center: Segmented Progress Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, index) => {
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={index}
                    className="flex-1 h-2 rounded-full relative overflow-hidden bg-slate-800/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <motion.div
                      className={`absolute inset-0 ${
                        isPast || isCurrent ? "bg-primary" : "bg-slate-800"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: isPast || isCurrent ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.03,
                      }}
                      style={{ transformOrigin: "left" }}
                    />
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-400">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-400">
                {progressPercentage}% Complete
              </span>
            </div>
          </div>

          {/* Right: Streak Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="relative">
              <Flame
                className={`w-5 h-5 ${streak > 0 ? "text-orange-400" : "text-slate-600"}`}
              />
              {streak > 0 && (
                <motion.div
                  className="absolute -inset-1 bg-orange-400/20 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-100 leading-none">
                {streak}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">
                streak
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Main Quiz Page Component
 * Full focus mode interface with no sidebar
 */
export default function QuizSessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  // Initialize quiz engine with adaptive difficulty algorithm
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedOption,
    showResult,
    streak,
    totalQuestions,
    correctCount,
    wrongCount,
    handleSelectOption,
    handleSubmit,
    answers,
  } = useQuizEngine({});

  // Check if quiz is complete
  const isSessionFinished = answers.length >= totalQuestions;

  // Handle quit action
  const handleQuit = () => {
    if (
      confirm(
        "Are you sure you want to quit? Your progress will be saved but the session will end.",
      )
    ) {
      router.push("/dashboard");
    }
  };

  // Completion logic: Show loading state then redirect to results
  useEffect(() => {
    if (isSessionFinished && !isFinishing) {
      setIsFinishing(true);

      // Save session data to localStorage for result page
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `quiz-session-${params.sessionId}`,
          JSON.stringify({
            answers,
            correctCount,
            wrongCount,
            totalQuestions,
            averageTime,
          }),
        );
      }

      // Show "Generating Report..." for 2 seconds
      const timer = setTimeout(() => {
        router.push(`/training/result/${params.sessionId}`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [
    isSessionFinished,
    isFinishing,
    params.sessionId,
    router,
    answers,
    correctCount,
    wrongCount,
    totalQuestions,
    averageTime,
  ]);

  // Show loading state when quiz is complete
  if (isFinishing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Generating Your Report...
          </h2>
          <p className="text-slate-400">
            Analyzing your performance and preparing insights
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Progress Header */}
      <ProgressHeader
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        streak={streak}
        correctCount={correctCount}
        wrongCount={wrongCount}
        sessionId={params.sessionId}
        onQuit={handleQuit}
      />

      {/* Main Quiz Stage - Centered */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <QuestionCard
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectOption}
                  showResult={showResult}
                  correctAnswer={currentQuestion.correctAnswer}
                  disabled={showResult}
                />

                {/* Submit Button */}
                {!showResult && selectedOption !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-center"
                  >
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      className="bg-primary hover:bg-primary-hover text-white px-8 py-6 text-lg font-semibold"
                    >
                      Submit Answer
                      <span className="ml-2 text-sm opacity-60">
                        (or press Enter)
                      </span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer - Session Info */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span>Session: {params.sessionId.slice(0, 8)}...</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-success">{correctCount} Correct</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-danger">{wrongCount} Wrong</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-500">
              Keyboard: [1] [2] [3] [4] • [Enter] to submit
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
