"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { generateLiveQuiz } from "@/actions/ai-generation";
import { TrainingGround } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bot, BookOpen, Link2 } from "lucide-react";
import Link from "next/link";

export default function TrainingGroundPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [trainingGround, setTrainingGround] = useState<TrainingGround | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTrainingGround(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);

    try {
      const result = await generateLiveQuiz(topic);
      setTrainingGround(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (
      trainingGround &&
      answerIndex ===
        trainingGround.raw_ai_response.questions[currentQuestionIndex]
          .correct_answer
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (
      trainingGround &&
      currentQuestionIndex < trainingGround.raw_ai_response.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setTrainingGround(null);
    setTopic("");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
  };

  const currentQuestion =
    trainingGround?.raw_ai_response.questions[currentQuestionIndex];
  const isLastQuestion =
    trainingGround &&
    currentQuestionIndex ===
      trainingGround.raw_ai_response.questions.length - 1;
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold">AdaptiQ Live</h1>
              <nav className="hidden md:flex gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/training-ground">
                  <Button variant="ghost">Training Ground</Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground mb-4">
            <Bot className="w-6 h-6" />
            <span className="font-semibold">AI Training Ground</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Generate Custom Quizzes</h1>
          <p className="text-muted-foreground">
            Research any topic in real-time and generate fresh questions with
            citations
          </p>
        </div>

        {!trainingGround ? (
          /* Topic Input */
          <Card className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">What topic do you want to practice?</Label>
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateQuiz()}
                placeholder="e.g., React Server Actions, Next.js 15 App Router, TypeScript Generics"
                disabled={isGenerating}
                className="text-lg"
              />
            </div>

            {/* Quick Topics */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick topics:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "React Server Actions",
                  "Next.js 15",
                  "TypeScript 5.5",
                  "MongoDB Aggregation",
                ].map((quickTopic) => (
                  <Button
                    key={quickTopic}
                    onClick={() => setTopic(quickTopic)}
                    variant="outline"
                    size="sm"
                  >
                    {quickTopic}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !topic.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-foreground"></div>
                  Researching & Generating...
                </span>
              ) : (
                "Generate Quiz"
              )}
            </Button>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500 text-red-500">
                {error}
              </div>
            )}

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <Card className="p-4 space-y-2">
                <BookOpen className="w-8 h-8" />
                <h3 className="font-semibold">Real-Time Research</h3>
                <p className="text-sm text-muted-foreground">
                  Questions based on 2025 best practices and official
                  documentation
                </p>
              </Card>
              <Card className="p-4 space-y-2">
                <Link2 className="w-8 h-8" />
                <h3 className="font-semibold">Source Citations</h3>
                <p className="text-sm text-muted-foreground">
                  Every question includes links to official sources
                </p>
              </Card>
            </div>
          </Card>
        ) : (
          /* Quiz Display */
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of{" "}
                {trainingGround.raw_ai_response.questions.length}
              </Badge>
              <Badge>
                Score: {score} /{" "}
                {trainingGround.raw_ai_response.questions.length}
              </Badge>
            </div>

            {/* Source Badge */}
            {trainingGround.source_links.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <span className="text-xs font-medium">
                    Generated from{" "}
                    <span className="font-semibold">
                      {new URL(trainingGround.source_links[0]).hostname.replace(
                        "www.",
                        "",
                      )}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Question Card */}
            {currentQuestion && (
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
                    const isCorrectOption =
                      index === currentQuestion.correct_answer;

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
                    className={`p-4 rounded-lg border-2 space-y-3 ${
                      isCorrect
                        ? "bg-green-500/10 border-green-500"
                        : "bg-amber-500/10 border-amber-500"
                    }`}
                  >
                    <h3 className="font-semibold">
                      {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
                    </h3>
                    <p className="text-sm">{currentQuestion.explanation}</p>

                    {/* Read Source Button */}
                    {!isCorrect && trainingGround.source_links.length > 0 && (
                      <Button
                        onClick={() =>
                          window.open(trainingGround.source_links[0], "_blank")
                        }
                        variant="outline"
                        className="w-full"
                      >
                        📖 Read Source Documentation
                      </Button>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {showExplanation && (
                  <div className="flex gap-3">
                    {!isLastQuestion ? (
                      <Button onClick={handleNext} className="flex-1" size="lg">
                        Next Question
                      </Button>
                    ) : (
                      <Button
                        onClick={handleReset}
                        className="flex-1"
                        size="lg"
                      >
                        Generate New Quiz
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Sources */}
            {trainingGround.source_links.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">
                  Sources Used ({trainingGround.source_links.length})
                </h3>
                <ul className="space-y-2">
                  {trainingGround.source_links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline flex items-center gap-2"
                      >
                        <span>•</span>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
