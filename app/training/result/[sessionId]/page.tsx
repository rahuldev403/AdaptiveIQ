"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microscope,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { generateLiveQuiz } from "@/actions/ai-generation";
import { AnswerResult } from "@/hooks/useQuizEngine";

// Session data interface
interface SessionResult {
  score: number;
  weakTopics: string[];
  strongTopics: string[];
  timeTaken: string;
  totalQuestions: number;
  correctAnswers: number;
  avgTimePerQuestion: number;
  topicBreakdown: {
    topic: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

/**
 * Analyze quiz session performance
 */
function analyzeSessionPerformance(answers: AnswerResult[]): SessionResult {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Calculate average time
  const totalTime = answers.reduce((sum, a) => sum + a.timeTaken, 0);
  const avgTimePerQuestion = Math.round(totalTime / totalQuestions);
  const timeTaken = `${Math.floor(totalTime / 60)}m ${Math.round(totalTime % 60)}s`;
  
  // Analyze performance by topic
  const topicPerformance: Record<string, { correct: number; total: number }> = {};
  
  answers.forEach((answer) => {
    const topic = answer.topic || "General";
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0 };
    }
    topicPerformance[topic].total++;
    if (answer.isCorrect) {
      topicPerformance[topic].correct++;
    }
  });
  
  // Create topic breakdown
  const topicBreakdown = Object.entries(topicPerformance).map(
    ([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100),
    })
  );
  
  // Sort by percentage to find weak and strong topics
  const sortedByPerformance = [...topicBreakdown].sort(
    (a, b) => a.percentage - b.percentage
  );
  
  // Weak topics: bottom 2 topics with < 70% accuracy
  const weakTopics = sortedByPerformance
    .filter((t) => t.percentage < 70)
    .slice(0, 2)
    .map((t) => t.topic);
  
  // Strong topics: top 2 topics with > 80% accuracy
  const strongTopics = sortedByPerformance
    .filter((t) => t.percentage > 80)
    .slice(-2)
    .map((t) => t.topic)
    .reverse();
  
  return {
    score,
    weakTopics,
    strongTopics,
    timeTaken,
    totalQuestions,
    correctAnswers,
    avgTimePerQuestion,
    topicBreakdown,
  };
}

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

  const COLORS = ["rgb(79 70 229)", "rgb(30 41 59)"]; // Indigo-600, Slate-800

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
          <span className="font-bold text-rose-400">
            {mockSessionData.weakTopic}
          </span>
          .
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
  const { userId } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(`quiz-session-${params.sessionId}`);
      
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          const analyzed = analyzeSessionPerformance(parsed.answers || []);
          setSessionData(analyzed);
        } catch (e) {
          console.error("Failed to parse session data:", e);
          // Use fallback data
          setSessionData({
            score: 70,
            weakTopics: ["Algorithms"],
            strongTopics: ["React Hooks"],
            timeTaken: "5m",
            totalQuestions: 10,
            correctAnswers: 7,
            avgTimePerQuestion: 30,
            topicBreakdown: [],
          });
        }
      } else {
        // Use fallback data if no session found
        setSessionData({
          score: 70,
          weakTopics: ["Algorithms"],
          strongTopics: ["React Hooks"],
          timeTaken: "5m",
          totalQuestions: 10,
          correctAnswers: 7,
          avgTimePerQuestion: 30,
          topicBreakdown: [],
        });
      }
      
      setIsLoading(false);
    }
  }, [params.sessionId]);

  const handleEnterTrainingGround = async () => {
    if (!userId) {
      setError("You must be logged in to access the training ground");
      return;
    }
    
    if (!sessionData) {
      setError("Session data not available");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call the real server action with weak topic
      const weakTopic = sessionData.weakTopics[0] || "JavaScript";
      const result = await generateLiveQuiz(weakTopic, userId);

      // Wait for terminal animation to complete (3.5 seconds)
      setTimeout(() => {
        router.push(`/training/${result.trainingId}?sessionId=${params.sessionId}`);
      }, 3500);
    } catch (err) {
      console.error("Failed to generate training ground:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate training ground",
      );
      setIsGenerating(false);
    }
  };

  // Show loading state
  if (isLoading || !sessionData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading session results...</p>
        </div>
      </div>
    );
  }

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
            score={sessionData.score}
            correctAnswers={sessionData.correctAnswers}
            totalQuestions={sessionData.totalQuestions}
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
              {sessionData.timeTaken}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">Avg. Time/Q</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">
              {sessionData.avgTimePerQuestion}s
            </p>
          </div>
        </motion.div>

        {/* Performance Breakdown - Strong & Weak Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {/* Strong Areas */}
          {sessionData.strongTopics.length > 0 && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Strong Areas</span>
              </div>
              <div className="space-y-2">
                {sessionData.strongTopics.map((topic, idx) => (
                  <div key={idx} className="text-sm text-slate-300">
                    • {topic}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Weak Areas */}
          {sessionData.weakTopics.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-rose-400 mb-3">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Needs Improvement</span>
              </div>
              <div className="space-y-2">
                {sessionData.weakTopics.map((topic, idx) => (
                  <div key={idx} className="text-sm text-slate-300">
                    • {topic}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Weakness Detection Card */}
        {sessionData.weakTopics.length > 0 && (
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
                  Detected Gap: {sessionData.weakTopics[0]}
                </h3>
                <p className="text-slate-400 mb-6">
                  Your performance in {sessionData.weakTopics[0]} shows room for improvement.
                  Let's strengthen this area with live data from the latest 2025 documentation
                  and real-world examples.
                </p>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg"
                >
                  <p className="text-rose-400 text-sm">{error}</p>
                </motion.div>
              )}

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
