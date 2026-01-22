/**
 * Custom React Hooks for AdaptiQ Live
 * These hooks encapsulate common patterns and state management
 */

import { useState, useCallback } from "react";
import { generateLiveQuiz } from "@/actions/ai-generation";
import { TrainingGround } from "@/lib/db/schema";

/**
 * Hook for managing quiz generation state
 * Simplifies the quiz generation flow in components
 */
export function useQuizGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [trainingGround, setTrainingGround] = useState<TrainingGround | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = useCallback(async (topic: string) => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return null;
    }

    setIsGenerating(true);
    setError(null);
    setTrainingGround(null);

    try {
      const result = await generateLiveQuiz(topic);
      setTrainingGround(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate quiz";
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTrainingGround(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  return {
    isGenerating,
    trainingGround,
    error,
    generateQuiz,
    reset,
  };
}

/**
 * Hook for managing quiz answers and scoring
 * Tracks user answers and calculates score
 */
export function useQuizAnswers() {
  const [userAnswers, setUserAnswers] = useState<
    Record<string, { answer: number; correct: boolean; timestamp: Date }>
  >({});

  const recordAnswer = useCallback(
    (questionId: string, answer: number, isCorrect: boolean) => {
      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: {
          answer,
          correct: isCorrect,
          timestamp: new Date(),
        },
      }));
    },
    [],
  );

  const getScore = useCallback(() => {
    const correct = Object.values(userAnswers).filter((a) => a.correct).length;
    const total = Object.keys(userAnswers).length;
    return {
      correct,
      total,
      percentage: total > 0 ? (correct / total) * 100 : 0,
    };
  }, [userAnswers]);

  const reset = useCallback(() => {
    setUserAnswers({});
  }, []);

  return {
    userAnswers,
    recordAnswer,
    getScore,
    reset,
  };
}

/**
 * Hook for managing topic history
 * Keeps track of recently used topics
 */
export function useTopicHistory(maxItems: number = 5) {
  const [topics, setTopics] = useState<string[]>([]);

  const addTopic = useCallback(
    (topic: string) => {
      setTopics((prev) => {
        // Remove duplicates and add new topic at the start
        const filtered = prev.filter((t) => t !== topic);
        return [topic, ...filtered].slice(0, maxItems);
      });
    },
    [maxItems],
  );

  const clearHistory = useCallback(() => {
    setTopics([]);
  }, []);

  return {
    topics,
    addTopic,
    clearHistory,
  };
}

/**
 * Hook for managing loading states with timeout
 * Useful for showing fallback messages if generation takes too long
 */
export function useTimedLoading(timeoutMs: number = 30000) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setIsTimedOut(false);

    const timeout = setTimeout(() => {
      setIsTimedOut(true);
    }, timeoutMs);

    return () => clearTimeout(timeout);
  }, [timeoutMs]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setIsTimedOut(false);
  }, []);

  return {
    isLoading,
    isTimedOut,
    startLoading,
    stopLoading,
  };
}
