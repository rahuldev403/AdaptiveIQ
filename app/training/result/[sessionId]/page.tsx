"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Microscope, ArrowRight, TrendingDown, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Mock session data - replace with real data fetching
interface SessionResult {
  score: number;
  weakTopic: string;
  timeTaken: string;
  totalQuestions: number;
  correctAnswers: number;
  avgTimePerQuestion: number;
}

const mockSessionData: SessionResult = {
  score: 70,
  weakTopic: "Recursion",
  timeTaken: "12m",
  totalQuestions: 10,
  correctAnswers: 7,
  avgTimePerQuestion: 45,
};

/**
 * Circular Score Hero Component
 * Large animated circular progress indicator
 */
interface ScoreHeroProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

function ScoreHero({ score, correctAnswers, totalQuestions }: ScoreHeroProps) {
  const data = [
    { name: "Correct", value: score },
    { name: "Incorrect", value: 100 - score },
  ];

  const COLORS = ["#4f46e5", "#1e293b"]; // Indigo-600, Slate-800

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="relative w-64 h-64 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <p className="text-6xl font-bold text-slate-100">{score}%</p>
          </motion.div>
          <p className="text-sm text-slate-400 mt-2">
            {correctAnswers}/{totalQuestions} correct
          </p>
        </div>
      </div>

      {/* Score Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <p className="text-lg text-slate-300">
          Good effort, but you struggled with{" "}
          <span className="font-bold text-rose-400">{mockSessionData.weakTopic}</span>.
        </p>
      </motion.div>
    </motion.div>
  );
}

/**
 * Terminal Loading Animation
 * Simulates AI processing steps
 */
function TerminalLoader() {
  const [logs, setLogs] = useState<string[]>([]);

  const loadingSteps = [
    "Analyzing error pattern...",
    "Connecting to You.com API...",
    "Fetching latest 2025 documentation...",
    "Generating remediation plan...",
  ];

  useEffect(() => {
    loadingSteps.forEach((step, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
      }, index * 800);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-950 border border-slate-800 rounded-lg p-6 font-mono text-sm"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        <span className="text-slate-500 text-xs">ai-training-terminal</span>
      </div>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2"
          >
            <span className="text-primary">›</span>
            <span className="text-slate-300">{log}</span>
            {index === logs.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-primary"
              >
                _
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Main Session Result Page
 */
export default function SessionResultPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEnterTrainingGround = async () => {
    setIsGenerating(true);

    // Simulate API call - replace with real server action
    // await generateLiveQuiz(mockSessionData.weakTopic);

    // Redirect after 3.5 seconds (time for all logs to show)
    setTimeout(() => {
      router.push(`/training/${params.sessionId}`);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-400">
              Session {params.sessionId.slice(0, 8)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Session Complete
          </h1>
          <p className="text-slate-400">
            Here's your performance analysis and next steps
          </p>
        </motion.div>

        {/* Score Hero */}
        <div className="mb-8">
          <ScoreHero
            score={mockSessionData.score}
            correctAnswers={mockSessionData.correctAnswers}
            totalQuestions={mockSessionData.totalQuestions}
          />
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Time Taken</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {mockSessionData.timeTaken}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">Avg. Time/Q</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {mockSessionData.avgTimePerQuestion}s
            </p>
          </div>
        </motion.div>

        {/* Weakness Detection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-rose-950/10 border-2 border-rose-900/50 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20">
              <Microscope className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-100 mb-2">
                Detected Gap: {mockSessionData.weakTopic}
              </h3>
              <p className="text-slate-400 mb-6">
                We noticed you took {mockSessionData.avgTimePerQuestion}s+ on simple{" "}
                {mockSessionData.weakTopic.toLowerCase()} logic. Let's patch this gap
                with live data from the latest 2025 documentation and real-world
                examples.
              </p>

              {/* Action Button or Loading Terminal */}
              <AnimatePresence mode="wait">
                {!isGenerating ? (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Button
                      size="lg"
                      onClick={handleEnterTrainingGround}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold group relative overflow-hidden"
                    >
                      {/* Pulsing background effect */}
                      <motion.div
                        className="absolute inset-0 bg-indigo-400/30"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        Enter AI Training Ground
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TerminalLoader />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-4"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push(`/history/${params.sessionId}`)}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          >
            View Detailed Report
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
