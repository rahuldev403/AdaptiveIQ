"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  getSubjectById,
  getSubjectProgress,
  updateUserProgress,
} from "@/actions/quiz-actions";
import { Subject, UserProgress, Question } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const subjectId = params.id as string;
        const [subjectData, progressData] = await Promise.all([
          getSubjectById(subjectId),
          getSubjectProgress(subjectId),
        ]);

        if (!subjectData) {
          router.push("/dashboard");
          return;
        }

        setSubject(subjectData);
        setProgress(progressData);

        if (progressData) {
          setCompletedQuestions(progressData.completed_questions);
          setScore(progressData.score);
        }
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isSignedIn) {
      loadData();
    }
  }, [isSignedIn, params.id, router]);

  if (!isLoaded || loading || !subject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = subject.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === subject.questions.length - 1;
  const totalQuestions = subject.questions.length;

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === currentQuestion.correct_answer;

    if (isCorrect && !completedQuestions.includes(currentQuestion.id)) {
      setScore((prev) => prev + 1);
      setCompletedQuestions((prev) => [...prev, currentQuestion.id]);
    }
  };

  const handleNext = async () => {
    // Save progress
    await updateUserProgress(
      params.id as string,
      completedQuestions,
      score,
      totalQuestions,
    );

    if (isLastQuestion) {
      router.push("/dashboard");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correct_answer;
  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / totalQuestions) * 100,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{subject.title}</span>
            <span className="text-muted-foreground">{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Score Card */}
        <Card className="p-4 mb-6 flex justify-between items-center">
          <span className="text-sm font-medium">Current Score:</span>
          <span className="text-2xl font-bold">
            {score} / {totalQuestions}
          </span>
        </Card>

        {/* Question Card */}
        <Card className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-semibold leading-tight">
              {currentQuestion.question}
            </h2>
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correct_answer;

              let optionClasses =
                "w-full text-left p-4 rounded-lg border-2 transition-all ";

              if (!showExplanation) {
                optionClasses += isSelected
                  ? "border-primary bg-secondary"
                  : "border-border hover:border-primary";
              } else {
                if (isCorrectOption) {
                  optionClasses += "border-green-500 bg-green-500/10";
                } else if (isSelected && !isCorrect) {
                  optionClasses += "border-red-500 bg-red-500/10";
                } else {
                  optionClasses += "border-border";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showExplanation}
                  className={optionClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showExplanation && isCorrectOption && (
                      <span className="text-green-500">✓</span>
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-lg border-2 ${isCorrect ? "bg-green-500/10 border-green-500" : "bg-amber-500/10 border-amber-500"}`}
            >
              <h3 className="font-semibold mb-2">
                {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
              </h3>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <Button onClick={handleNext} className="w-full" size="lg">
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
