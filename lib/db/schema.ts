import { ObjectId } from "mongodb";

// Subject with 15 pre-defined questions
export type Subject = {
  _id?: ObjectId;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: Question[];
  created_at: Date;
  updated_at: Date;
};

// Question type
export type Question = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

// User progress tracking
export type UserProgress = {
  _id?: ObjectId;
  user_id: string;
  subject_id: string;
  completed_questions: string[];
  score: number;
  total_questions: number;
  last_attempt: Date;
  attempts: number;
};

// Training Ground (AI-generated quiz)
export type TrainingGround = {
  _id?: ObjectId;
  user_id: string;
  topic: string;
  generated_at: Date;
  raw_ai_response: {
    questions: Question[];
    citations?: Citation[];
  };
  source_links: string[];
};

export type Citation = {
  title: string;
  url: string;
  snippet?: string;
};
