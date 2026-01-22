"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackOverlayProps {
  isOpen: boolean;
  isCorrect: boolean;
  selectedOption: string;
  selectedIndex: number;
  correctOption: string;
  correctIndex: number;
  explanation?: string;
  onClose: () => void;
}

export default function FeedbackOverlay({
  isOpen,
  isCorrect,
  selectedOption,
  selectedIndex,
  correctOption,
  correctIndex,
  explanation,
  onClose,
}: FeedbackOverlayProps) {
  const selectedLetter = String.fromCharCode(65 + selectedIndex); // A, B, C, D
  const correctLetter = String.fromCharCode(65 + correctIndex);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Overlay Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 lg:p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-danger" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {isCorrect ? "Correct!" : "Not Quite Right"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {isCorrect
                        ? "Great job! Keep up the momentum."
                        : "Let's review what happened."}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Diff View - Only show for wrong answers */}
              {!isCorrect && (
                <div className="space-y-4 mb-6">
                  {/* Your Answer */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-lg border-2 border-danger bg-danger/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-md bg-danger/20 flex items-center justify-center font-bold text-danger flex-shrink-0">
                        {selectedLetter}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-danger uppercase tracking-wide mb-1">
                          Your Answer
                        </p>
                        <p className="text-slate-200">{selectedOption}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Correct Answer */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 rounded-lg border-2 border-success bg-success/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-md bg-success/20 flex items-center justify-center font-bold text-success flex-shrink-0">
                        {correctLetter}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-success uppercase tracking-wide mb-1">
                          Correct Answer
                        </p>
                        <p className="text-slate-200">{correctOption}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Why Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: isCorrect ? 0.2 : 0.4 }}
                className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-900/50 p-5"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h4 className="font-semibold text-white">
                      {isCorrect ? "Explanation" : "Why is this important?"}
                    </h4>
                  </div>

                  {explanation ? (
                    <p className="text-slate-300 leading-relaxed">
                      {explanation}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        <p className="text-slate-400 italic">
                          AI is analyzing your error pattern...
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                        <p className="text-sm text-slate-400">
                          💡{" "}
                          <span className="font-semibold text-indigo-400">
                            Pro Tip:
                          </span>{" "}
                          Visit the{" "}
                          <span className="text-white font-semibold">
                            AI Training Ground
                          </span>{" "}
                          for personalized remediation on topics you're
                          struggling with.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Loading Animation for AI Analysis */}
              {!isCorrect && !explanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 flex items-center justify-center gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-indigo-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isCorrect ? 0.4 : 0.5 }}
                className="mt-6 flex justify-end"
              >
                <Button
                  onClick={onClose}
                  className={`${
                    isCorrect
                      ? "bg-success hover:bg-success/90"
                      : "bg-primary hover:bg-primary-hover"
                  } text-white font-semibold px-6`}
                >
                  {isCorrect ? "Continue" : "Got It"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
