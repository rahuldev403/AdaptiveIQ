"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  topic: string;
}

export interface AnswerResult {
  questionId: string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: Difficulty;
  selectedAnswer: number;
}

interface UseQuizEngineProps {
  questions?: QuizQuestion[];
  onQuizComplete?: (results: AnswerResult[]) => void;
}

// Mock Question Bank (5 questions per difficulty)
const MOCK_QUESTION_BANK: QuizQuestion[] = [
  // EASY Questions
  {
    id: "easy-1",
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "Web Fundamentals",
  },
  {
    id: "easy-2",
    question: "Which symbol is used for single-line comments in JavaScript?",
    codeSnippet: `// This is a comment\n/* This is also a comment */\n# This too?`,
    options: ["//", "/* */", "#", "<!-- -->"],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "JavaScript Basics",
  },
  {
    id: "easy-3",
    question:
      "What is the correct way to declare a variable in modern JavaScript?",
    options: ["var x = 5;", "let x = 5;", "const x = 5;", "Both B and C"],
    correctAnswer: 3,
    difficulty: "easy",
    topic: "JavaScript Basics",
  },
  {
    id: "easy-4",
    question: "Which CSS property is used to change text color?",
    options: ["font-color", "text-color", "color", "text-style"],
    correctAnswer: 2,
    difficulty: "easy",
    topic: "CSS Basics",
  },
  {
    id: "easy-5",
    question: "What is the correct HTML tag for the largest heading?",
    options: ["<heading>", "<h6>", "<head>", "<h1>"],
    correctAnswer: 3,
    difficulty: "easy",
    topic: "HTML Basics",
  },

  // MEDIUM Questions
  {
    id: "medium-1",
    question: "What will be the output of this code?",
    codeSnippet: `console.log(typeof null);\nconsole.log(typeof undefined);`,
    options: [
      "null, undefined",
      "object, undefined",
      "null, object",
      "object, object",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Types",
  },
  {
    id: "medium-2",
    question: "What is the purpose of the 'key' prop in React lists?",
    options: [
      "To style list items",
      "To help React identify which items have changed",
      "To sort the list",
      "To make items clickable",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "React Fundamentals",
  },
  {
    id: "medium-3",
    question: "What does the following CSS selector target?",
    codeSnippet: `.container > div:first-child`,
    options: [
      "All divs inside container",
      "First div that is a direct child of container",
      "First element with class container",
      "All direct children of container",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "CSS Selectors",
  },
  {
    id: "medium-4",
    question: "What is closure in JavaScript?",
    options: [
      "A function that closes other functions",
      "A function that has access to variables in its outer scope",
      "A function that always returns undefined",
      "A syntax error in JavaScript",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Advanced",
  },
  {
    id: "medium-5",
    question: "Which hook is used for side effects in React?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "React Hooks",
  },

  // HARD Questions
  {
    id: "hard-1",
    question: "What is the output of this code?",
    codeSnippet: `const arr = [1, 2, 3];\nconst [a, , b] = arr;\nconsole.log(a, b);`,
    options: ["1 2", "1 3", "undefined 3", "Error"],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "ES6+ Features",
  },
  {
    id: "hard-2",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "Algorithms",
  },
  {
    id: "hard-3",
    question: "Which statement about React's reconciliation algorithm is TRUE?",
    options: [
      "It always re-renders the entire component tree",
      "It uses a diffing algorithm to minimize DOM updates",
      "It only works with class components",
      "It requires manual optimization",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "React Internals",
  },
  {
    id: "hard-4",
    question: "What will this Promise chain output?",
    codeSnippet: `Promise.resolve(1)\n  .then(x => x + 1)\n  .then(x => { throw new Error('!') })\n  .catch(() => 3)\n  .then(x => x + 1)\n  .then(x => console.log(x));`,
    options: ["2", "3", "4", "Error"],
    correctAnswer: 2,
    difficulty: "hard",
    topic: "Async JavaScript",
  },
  {
    id: "hard-5",
    question: "What is the purpose of WeakMap in JavaScript?",
    options: [
      "To store weak references that don't prevent garbage collection",
      "To create maps with weak security",
      "To store smaller data sets",
      "To improve map performance",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    topic: "JavaScript Advanced",
  },
];

const difficultyLevels: Difficulty[] = ["easy", "medium", "hard"];

export function useQuizEngine({
  questions = MOCK_QUESTION_BANK,
  onQuizComplete,
}: UseQuizEngineProps = {}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] =
    useState<Difficulty>("easy");
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const keyboardListenerEnabled = useRef(true);

  // Get current question based on difficulty
  const availableQuestions = questions.filter(
    (q) => q.difficulty === currentDifficulty,
  );
  const currentQuestion =
    availableQuestions[currentQuestionIndex % availableQuestions.length];

  // Calculate difficulty index (0: easy, 1: medium, 2: hard)
  const getDifficultyIndex = (difficulty: Difficulty): number => {
    return difficultyLevels.indexOf(difficulty);
  };

  const getNextDifficulty = (
    current: Difficulty,
    correct: boolean,
  ): Difficulty => {
    const currentIndex = getDifficultyIndex(current);

    if (correct) {
      // Increase difficulty up to hard
      const nextIndex = Math.min(difficultyLevels.length - 1, currentIndex + 1);
      return difficultyLevels[nextIndex];
    } else {
      // Downgrade if 2 consecutive wrong answers
      if (consecutiveWrong >= 1) {
        const nextIndex = Math.max(0, currentIndex - 1);
        return difficultyLevels[nextIndex];
      }
      // Otherwise stay at current difficulty
      return current;
    }
  };

  const handleAnswerSubmit = useCallback(
    (answerIndex: number) => {
      if (showResult || !currentQuestion) return;

      const timeTaken = (Date.now() - questionStartTime) / 1000;
      const correct = answerIndex === currentQuestion.correctAnswer;

      setSelectedOption(answerIndex);
      setIsCorrect(correct);
      setShowResult(true);
      keyboardListenerEnabled.current = false;

      // Update streak
      if (correct) {
        setStreak((prev) => prev + 1);
        setConsecutiveWrong(0);
      } else {
        setStreak(0);
        setConsecutiveWrong((prev) => prev + 1);
      }

      // Record answer
      const result: AnswerResult = {
        questionId: currentQuestion.id,
        isCorrect: correct,
        timeTaken,
        difficulty: currentDifficulty,
        selectedAnswer: answerIndex,
      };

      setAnswers((prev) => [...prev, result]);

      // Determine next difficulty using adaptive algorithm
      const nextDiff = getNextDifficulty(currentDifficulty, correct);

      // Auto-advance after 2 seconds
      setTimeout(() => {
        handleNext(nextDiff);
      }, 2000);
    },
    [
      currentQuestion,
      currentDifficulty,
      showResult,
      questionStartTime,
      consecutiveWrong,
    ],
  );

  const handleNext = (nextDifficulty?: Difficulty) => {
    const newIndex = currentQuestionIndex + 1;

    // Check if quiz is complete (10 questions)
    if (newIndex >= 10) {
      if (onQuizComplete) {
        onQuizComplete(answers);
      }
      return;
    }

    // Move to next question
    setCurrentQuestionIndex(newIndex);
    setCurrentDifficulty(nextDifficulty || currentDifficulty);
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(null);
    setQuestionStartTime(Date.now());
    keyboardListenerEnabled.current = true;
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !showResult) {
      handleAnswerSubmit(selectedOption);
    }
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!keyboardListenerEnabled.current) return;

      // Option selection: 1, 2, 3, 4
      if (["1", "2", "3", "4"].includes(e.key)) {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex < currentQuestion.options.length) {
          handleSelectOption(optionIndex);
        }
      }

      // Submit: Enter
      if (e.key === "Enter") {
        handleSubmit();
      }

      // Quick submit with number keys (if already selected)
      if (["1", "2", "3", "4"].includes(e.key) && selectedOption !== null) {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex === selectedOption) {
          // Double-tap to submit
          setTimeout(() => {
            if (selectedOption === optionIndex) {
              handleSubmit();
            }
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestion, selectedOption, showResult, handleSubmit]);

  // Reset start time when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  return {
    // State
    currentQuestion,
    currentQuestionIndex,
    currentDifficulty,
    selectedOption,
    showResult,
    isCorrect,
    answers,
    streak,
    totalQuestions: 10,

    // Actions
    handleSelectOption,
    handleSubmit,
    handleAnswerSubmit,

    // Stats
    correctCount: answers.filter((a) => a.isCorrect).length,
    wrongCount: answers.filter((a) => !a.isCorrect).length,
    averageTime:
      answers.length > 0
        ? answers.reduce((sum, a) => sum + a.timeTaken, 0) / answers.length
        : 0,
  };
}
