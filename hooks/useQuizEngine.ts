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
  topic?: string; // Add topic for performance analysis
}

interface UseQuizEngineProps {
  questions?: QuizQuestion[];
  onQuizComplete?: (results: AnswerResult[]) => void;
}

// Mock Question Bank (10+ questions per difficulty)
const MOCK_QUESTION_BANK: QuizQuestion[] = [
  // EASY Questions (15 questions)
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
  {
    id: "easy-6",
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "CSS Basics",
  },
  {
    id: "easy-7",
    question: "Which JavaScript method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "JavaScript Arrays",
  },
  {
    id: "easy-8",
    question: "What is the correct way to create a function in JavaScript?",
    options: [
      "function myFunc() {}",
      "function:myFunc() {}",
      "create myFunc() {}",
      "func myFunc() {}",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "JavaScript Functions",
  },
  {
    id: "easy-9",
    question: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    difficulty: "easy",
    topic: "HTML Basics",
  },
  {
    id: "easy-10",
    question: "What is the result of 5 + '5' in JavaScript?",
    options: ["10", "55", "'55'", "Error"],
    correctAnswer: 2,
    difficulty: "easy",
    topic: "JavaScript Types",
  },
  {
    id: "easy-11",
    question: "Which CSS property controls the spacing between elements?",
    options: ["padding", "margin", "spacing", "gap"],
    correctAnswer: 1,
    difficulty: "easy",
    topic: "CSS Layout",
  },
  {
    id: "easy-12",
    question: "What is the correct way to write a JavaScript array?",
    options: [
      "var colors = 'red', 'green', 'blue'",
      "var colors = ['red', 'green', 'blue']",
      "var colors = (1:'red', 2:'green', 3:'blue')",
      "var colors = {'red', 'green', 'blue'}",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    topic: "JavaScript Arrays",
  },
  {
    id: "easy-13",
    question: "Which property is used in CSS to change the font size?",
    options: ["text-size", "font-style", "font-size", "text-style"],
    correctAnswer: 2,
    difficulty: "easy",
    topic: "CSS Typography",
  },
  {
    id: "easy-14",
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Display Object Management",
      "Digital Ordinance Model",
      "Document Orientation Mode",
    ],
    correctAnswer: 0,
    difficulty: "easy",
    topic: "Web Fundamentals",
  },
  {
    id: "easy-15",
    question:
      "Which JavaScript operator is used to compare both value and type?",
    options: ["==", "===", "=", "!="],
    correctAnswer: 1,
    difficulty: "easy",
    topic: "JavaScript Operators",
  },

  // MEDIUM Questions (15 questions)
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
  {
    id: "medium-6",
    question: "What is the difference between 'let' and 'const'?",
    options: [
      "let can be reassigned, const cannot",
      "const is faster than let",
      "let is block-scoped, const is function-scoped",
      "No difference",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    topic: "JavaScript ES6",
  },
  {
    id: "medium-7",
    question: "What does the spread operator (...) do?",
    codeSnippet: `const arr1 = [1, 2];\nconst arr2 = [...arr1, 3, 4];`,
    options: [
      "Concatenates arrays",
      "Expands an iterable into individual elements",
      "Creates a reference copy",
      "Reverses the array",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript ES6",
  },
  {
    id: "medium-8",
    question: "What is the virtual DOM in React?",
    options: [
      "A copy of the real DOM kept in memory",
      "A faster version of the DOM API",
      "A virtual machine for React",
      "A debugging tool",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    topic: "React Concepts",
  },
  {
    id: "medium-9",
    question: "What is the purpose of async/await?",
    options: [
      "To make code run faster",
      "To handle asynchronous operations more readably",
      "To create parallel threads",
      "To prevent errors",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Async",
  },
  {
    id: "medium-10",
    question: "What is event bubbling in JavaScript?",
    options: [
      "When events float to the top",
      "When events propagate from child to parent elements",
      "When events are cancelled",
      "When multiple events fire at once",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Events",
  },
  {
    id: "medium-11",
    question: "What does 'this' refer to in JavaScript?",
    options: [
      "Always the global object",
      "The object that is executing the current function",
      "The parent function",
      "Always undefined",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Context",
  },
  {
    id: "medium-12",
    question: "What is the purpose of useContext in React?",
    options: [
      "To create context",
      "To access context values",
      "To update context",
      "To delete context",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "React Hooks",
  },
  {
    id: "medium-13",
    question: "What is the difference between map() and forEach()?",
    options: [
      "No difference",
      "map() returns a new array, forEach() doesn't",
      "forEach() is faster",
      "map() can only be used with numbers",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "JavaScript Arrays",
  },
  {
    id: "medium-14",
    question: "What is CSS Flexbox used for?",
    options: [
      "Creating flexible layouts",
      "Making text flexible",
      "Creating animations",
      "Styling forms",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    topic: "CSS Layout",
  },
  {
    id: "medium-15",
    question: "What is the purpose of the useState hook?",
    options: [
      "To fetch data from APIs",
      "To manage component state",
      "To handle side effects",
      "To create context",
    ],
    correctAnswer: 1,
    difficulty: "medium",
    topic: "React Hooks",
  },

  // HARD Questions (15 questions)
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
  {
    id: "hard-6",
    question: "What is the output of this code?",
    codeSnippet: `console.log(0.1 + 0.2 === 0.3);`,
    options: ["true", "false", "undefined", "Error"],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript Numbers",
  },
  {
    id: "hard-7",
    question: "What is memoization in React?",
    options: [
      "Storing memory addresses",
      "Caching function results to avoid recalculation",
      "Creating memory leaks",
      "A debugging technique",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "React Performance",
  },
  {
    id: "hard-8",
    question: "What is the event loop in JavaScript?",
    options: [
      "A loop that creates events",
      "A mechanism that handles asynchronous callbacks",
      "A debugging tool",
      "A performance optimizer",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript Internals",
  },
  {
    id: "hard-9",
    question: "What does Object.create() do?",
    options: [
      "Creates a new object with specified prototype",
      "Copies an existing object",
      "Creates an empty object",
      "Converts arrays to objects",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    topic: "JavaScript Objects",
  },
  {
    id: "hard-10",
    question: "What is the difference between call() and apply()?",
    options: [
      "No difference",
      "call() takes arguments separately, apply() takes array",
      "apply() is faster",
      "call() is deprecated",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript Functions",
  },
  {
    id: "hard-11",
    question: "What is debouncing in JavaScript?",
    options: [
      "Removing bugs from code",
      "Delaying function execution until after a pause in events",
      "A testing technique",
      "A type of error handling",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript Patterns",
  },
  {
    id: "hard-12",
    question: "What is the purpose of Symbol in JavaScript?",
    options: [
      "To create unique identifiers",
      "To create mathematical symbols",
      "To represent special characters",
      "To improve performance",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    topic: "JavaScript ES6",
  },
  {
    id: "hard-13",
    question: "What is the difference between shallow and deep copy?",
    options: [
      "No difference",
      "Shallow copies only the first level, deep copies all nested levels",
      "Deep copy is faster",
      "Shallow copy is more memory efficient",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript Objects",
  },
  {
    id: "hard-14",
    question: "What is React Fiber?",
    options: [
      "A new type of component",
      "A reimplementation of React's reconciliation algorithm",
      "A state management library",
      "A testing framework",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "React Internals",
  },
  {
    id: "hard-15",
    question: "What is the prototype chain in JavaScript?",
    options: [
      "A linked list of objects",
      "A mechanism for inheritance where objects inherit properties from other objects",
      "A debugging tool",
      "A performance optimization",
    ],
    correctAnswer: 1,
    difficulty: "hard",
    topic: "JavaScript OOP",
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

  // Track performance per difficulty level for adaptive logic
  const [easyCorrect, setEasyCorrect] = useState(0);
  const [mediumCorrect, setMediumCorrect] = useState(0);
  const [hardWrong, setHardWrong] = useState(0);
  const [mediumWrong, setMediumWrong] = useState(0);

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
    if (correct) {
      // Advance logic: 5 easy correct → medium, 4 medium correct → hard
      if (current === "easy" && easyCorrect >= 4) {
        return "medium";
      } else if (current === "medium" && mediumCorrect >= 3) {
        return "hard";
      }
      return current;
    } else {
      // Downgrade logic: 1 hard wrong → medium, 2 medium wrong → easy
      if (current === "hard" && hardWrong >= 0) {
        return "medium";
      } else if (current === "medium" && mediumWrong >= 1) {
        return "easy";
      }
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

      // Update difficulty-specific counters
      if (correct) {
        setStreak((prev) => prev + 1);
        setConsecutiveWrong(0);

        // Track correct answers per difficulty
        if (currentDifficulty === "easy") {
          setEasyCorrect((prev) => prev + 1);
        } else if (currentDifficulty === "medium") {
          setMediumCorrect((prev) => prev + 1);
          setMediumWrong(0); // Reset medium wrong counter
        }
        // Reset hard wrong counter on correct
        if (currentDifficulty === "hard") {
          setHardWrong(0);
        }
      } else {
        setStreak(0);
        setConsecutiveWrong((prev) => prev + 1);

        // Track wrong answers per difficulty
        if (currentDifficulty === "hard") {
          setHardWrong((prev) => prev + 1);
        } else if (currentDifficulty === "medium") {
          setMediumWrong((prev) => prev + 1);
        }
      }

      // Record answer with topic information
      const result: AnswerResult = {
        questionId: currentQuestion.id,
        isCorrect: correct,
        timeTaken,
        difficulty: currentDifficulty,
        selectedAnswer: answerIndex,
        topic: currentQuestion.topic, // Add topic for analysis
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
      easyCorrect,
      mediumCorrect,
      hardWrong,
      mediumWrong,
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
