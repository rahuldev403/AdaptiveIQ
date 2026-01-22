"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Lightbulb, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QuestionCard from "@/components/quiz/QuestionCard";

// Mock training data - replace with real data from You.com API
interface TrainingData {
  question: {
    id: string;
    question: string;
    codeSnippet?: string;
    options: string[];
    difficulty: "easy" | "medium" | "hard";
    topic: string;
  };
  liveContext: {
    citations: string[];
    sourceLinks: {
      domain: string;
      title: string;
      url: string;
      lastUpdated: string;
      snippet: string;
    }[];
  };
}

const mockTrainingData: TrainingData = {
  question: {
    id: "training-1",
    question:
      "How do you implement memoization in React to optimize recursive components?",
    codeSnippet: `function Fibonacci({ n }) {
  // How would you optimize this?
  const calculate = (num) => {
    if (num <= 1) return num;
    return calculate(num - 1) + calculate(num - 2);
  };
  
  return <div>{calculate(n)}</div>;
}`,
    options: [
      "Use React.memo() to wrap the component",
      "Use useMemo() hook to cache calculation results",
      "Use useCallback() for the calculate function",
      "Use useState() to store previous results",
    ],
    difficulty: "medium",
    topic: "React Optimization",
  },
  liveContext: {
    citations: [
      "React's useMemo hook returns a memoized value. It will only recompute when one of the dependencies has changed.",
      "useMemo(() => computeExpensiveValue(a, b), [a, b]) will cache the result and only recalculate if a or b changes.",
      "For recursive calculations, combine useMemo with a Map or object to store previously calculated values.",
    ],
    sourceLinks: [
      {
        domain: "react.dev",
        title: "useMemo – React Official Documentation",
        url: "https://react.dev/reference/react/useMemo",
        lastUpdated: "2024",
        snippet:
          "useMemo is a React Hook that lets you cache the result of a calculation between re-renders.",
      },
      {
        domain: "web.dev",
        title: "Optimize React Performance with Memoization",
        url: "https://web.dev/react-performance-memoization",
        lastUpdated: "2025",
        snippet:
          "Learn how to use React's memoization features to prevent unnecessary re-renders and optimize expensive calculations.",
      },
      {
        domain: "github.com",
        title: "React Performance Optimization Patterns",
        url: "https://github.com/facebook/react/discussions/15312",
        lastUpdated: "2024",
        snippet:
          "Community discussion on best practices for optimizing React components including memoization strategies.",
      },
    ],
  },
};

/**
 * Live Context Panel - Right Side
 * Shows You.com sourced documentation and resources
 */
function LiveContextPanel({
  liveContext,
  onUseHint,
}: {
  liveContext: TrainingData["liveContext"];
  onUseHint: (citation: string) => void;
}) {
  const [expandedCitation, setExpandedCitation] = useState<number | null>(null);

  return (
    <div className="h-full bg-slate-950 border-l border-slate-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-100">Live Context</h2>
        </div>
        <p className="text-sm text-slate-400">
          Sourced via You.com • Latest 2025 documentation
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Hints Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Quick Hints
          </h3>
          <div className="space-y-2">
            {liveContext.citations.map((citation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() =>
                    setExpandedCitation(
                      expandedCitation === index ? null : index,
                    )
                  }
                  className="w-full text-left p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-slate-300 flex-1 line-clamp-2 group-hover:text-slate-100">
                      {expandedCitation === index
                        ? citation
                        : citation.slice(0, 80) + "..."}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUseHint(citation);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 shrink-0"
                    >
                      Use Hint
                    </Button>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Source Links Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3">
            Reference Materials
          </h3>
          <div className="space-y-3">
            {liveContext.sourceLinks.map((source, index) => (
              <motion.a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="block p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-mono">
                        {source.domain}
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {source.lastUpdated}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {source.title}
                    </h4>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {source.snippet}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hint Modal
 * Shows the hint overlay when user requests help
 */
function HintModal({ hint, onClose }: { hint: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">Hint</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close hint modal"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-slate-200 leading-relaxed">{hint}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            Got it, thanks!
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Main AI Training Ground Page
 */
export default function TrainingGroundPage({
  params,
}: {
  params: { trainingId: string };
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleUseHint = (citation: string) => {
    setActiveHint(citation);
    setHintsUsed((prev) => prev + 1);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row">
      {/* Left Panel - Question Interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                Training Mode
              </Badge>
              <span className="text-sm text-slate-500">
                Session: {params.trainingId.slice(0, 8)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">
                {hintsUsed} hint{hintsUsed !== 1 ? "s" : ""} used
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            AI Training Ground
          </h1>
          <p className="text-slate-400 text-sm">
            Practice with live documentation and AI-powered hints
          </p>
        </div>

        {/* Question Area */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <QuestionCard
              question={mockTrainingData.question}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
              showResult={showResult}
              correctAnswer={1} // Mock correct answer
              disabled={showResult}
            />

            {/* Training Mode Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  handleUseHint(mockTrainingData.liveContext.citations[0])
                }
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Request Hint
              </Button>

              {selectedOption !== null && !showResult && (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Submit Answer
                </Button>
              )}

              {showResult && (
                <Button
                  size="lg"
                  onClick={() => {
                    setSelectedOption(null);
                    setShowResult(false);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Live Context */}
      <div className="lg:w-1/2 h-screen lg:sticky lg:top-0">
        <LiveContextPanel
          liveContext={mockTrainingData.liveContext}
          onUseHint={handleUseHint}
        />
      </div>

      {/* Hint Modal */}
      {activeHint && (
        <HintModal hint={activeHint} onClose={() => setActiveHint(null)} />
      )}
    </div>
  );
}
