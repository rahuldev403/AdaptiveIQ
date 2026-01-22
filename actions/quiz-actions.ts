"use server";

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { Subject, UserProgress } from "@/lib/db/schema";

/**
 * Get all subjects from database
 */
export async function getSubjects(): Promise<Subject[]> {
  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<Subject>("subjects");

  const subjects = await collection.find({}).sort({ created_at: -1 }).toArray();

  // Convert ObjectId to string for client components
  return subjects.map((subject) => ({
    ...subject,
    _id: subject._id?.toString(),
  })) as Subject[];
}

/**
 * Get a specific subject by ID
 */
export async function getSubjectById(
  subjectId: string,
): Promise<Subject | null> {
  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<Subject>("subjects");

  const { ObjectId } = require("mongodb");
  const subject = await collection.findOne({ _id: new ObjectId(subjectId) });

  if (!subject) return null;

  // Convert ObjectId to string for client components
  return {
    ...subject,
    _id: subject._id?.toString(),
  } as Subject;
}

/**
 * Get user progress for all subjects
 */
export async function getUserProgress(): Promise<UserProgress[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<UserProgress>("user_progress");

  const progress = await collection.find({ user_id: userId }).toArray();

  // Convert ObjectId to string for client components
  return progress.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  })) as UserProgress[];
}

/**
 * Get user progress for a specific subject
 */
export async function getSubjectProgress(
  subjectId: string,
): Promise<UserProgress | null> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<UserProgress>("user_progress");

  const progress = await collection.findOne({
    user_id: userId,
    subject_id: subjectId,
  });

  if (!progress) return null;

  // Convert ObjectId to string for client components
  return {
    ...progress,
    _id: progress._id?.toString(),
  } as UserProgress;
}

/**
 * Update user progress
 */
export async function updateUserProgress(
  subjectId: string,
  completedQuestions: string[],
  score: number,
  totalQuestions: number,
): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<UserProgress>("user_progress");

  await collection.updateOne(
    { user_id: userId, subject_id: subjectId },
    {
      $set: {
        completed_questions: completedQuestions,
        score,
        total_questions: totalQuestions,
        last_attempt: new Date(),
      },
      $inc: { attempts: 1 },
    },
    { upsert: true },
  );
}
