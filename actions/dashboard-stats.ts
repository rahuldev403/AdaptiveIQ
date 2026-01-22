"use server";

import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import { UserProgress, TrainingGround } from "@/lib/db/schema";
import { ActivityData } from "@/components/dashboard/ActivityHeatmap";
import { SkillData } from "@/components/dashboard/SkillRadar";
import { ProgressData } from "@/components/dashboard/ProgressAreaChart";
import { ActivitySession } from "@/components/dashboard/RecentActivityList";

export interface DashboardStats {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  skillDistribution: SkillData[];
  recentActivity: ActivitySession[];
  activityHeatmap: ActivityData[];
  weeklyProgress: ProgressData[];
  isEmpty: boolean;
}

/**
 * Get comprehensive dashboard data for the authenticated user
 */
export async function getDashboardData(): Promise<DashboardStats> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const client = await connectDB();
  const db = client.db();

  // Fetch user progress and training ground sessions
  const progressCollection = db.collection<UserProgress>("user_progress");
  const trainingCollection = db.collection<TrainingGround>("training_grounds");
  const subjectsCollection = db.collection("subjects");

  const [userProgress, trainingGrounds, subjects] = await Promise.all([
    progressCollection.find({ user_id: userId }).toArray(),
    trainingCollection
      .find({ user_id: userId })
      .sort({ generated_at: -1 })
      .toArray(),
    subjectsCollection.find({}).toArray(),
  ]);

  // Check if user has any activity
  const isEmpty = userProgress.length === 0 && trainingGrounds.length === 0;

  // Calculate total XP (sum of all scores)
  const totalXp = userProgress.reduce((sum, p) => sum + p.score, 0);

  // Generate activity heatmap data (last 365 days)
  const activityHeatmap = generateActivityHeatmap(
    userProgress,
    trainingGrounds,
  );

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(activityHeatmap);

  // Calculate skill distribution for radar chart
  const skillDistribution = calculateSkillDistribution(userProgress, subjects);

  // Get recent activity (last 5 sessions)
  const recentActivity = generateRecentActivity(
    userProgress,
    trainingGrounds,
    subjects,
  );

  // Generate weekly progress (last 7 days)
  const weeklyProgress = generateWeeklyProgress(userProgress, trainingGrounds);

  return {
    totalXp,
    currentStreak,
    longestStreak,
    skillDistribution,
    recentActivity,
    activityHeatmap,
    weeklyProgress,
    isEmpty,
  };
}

/**
 * Generate activity heatmap for the last year
 */
function generateActivityHeatmap(
  userProgress: UserProgress[],
  trainingGrounds: TrainingGround[],
): ActivityData[] {
  const data: ActivityData[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Create a map of date -> activity count
  const activityMap = new Map<string, number>();

  // Add progress activities
  userProgress.forEach((progress) => {
    const dateKey = new Date(progress.last_attempt).toISOString().split("T")[0];
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + progress.score);
  });

  // Add training ground activities
  trainingGrounds.forEach((training) => {
    const dateKey = new Date(training.generated_at).toISOString().split("T")[0];
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 10); // Count as 10 points per training session
  });

  // Fill in all dates for the past year
  let currentDate = new Date(oneYearAgo);
  while (currentDate <= today) {
    const dateKey = currentDate.toISOString().split("T")[0];
    const count = activityMap.get(dateKey) || 0;

    let level = 0;
    if (count >= 50) level = 3;
    else if (count >= 30) level = 2;
    else if (count >= 10) level = 1;
    else level = 0;

    data.push({
      date: dateKey,
      count,
      level,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(activityData: ActivityData[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (!activityData.length) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Sort by date (newest first)
  const sortedData = [...activityData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Calculate current streak (from today backwards)
  for (let i = 0; i < sortedData.length; i++) {
    if (sortedData[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (let i = sortedData.length - 1; i >= 0; i--) {
    if (sortedData[i].count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Calculate skill distribution based on subject categories
 */
function calculateSkillDistribution(
  userProgress: UserProgress[],
  subjects: any[],
): SkillData[] {
  // Create a map of subject_id -> category
  const subjectCategoryMap = new Map<string, string>();
  subjects.forEach((subject) => {
    subjectCategoryMap.set(subject._id.toString(), subject.category);
  });

  // Map categories to skill names
  const categoryToSkill: Record<string, string> = {
    Programming: "Frontend",
    "Web Development": "Backend",
    "Data Structures": "Algorithms",
    Database: "Database",
  };

  // Initialize skill scores
  const skillScores = new Map<string, { total: number; count: number }>();
  const defaultSkills = [
    "Frontend",
    "Backend",
    "Algorithms",
    "System Design",
    "Database",
  ];
  defaultSkills.forEach((skill) =>
    skillScores.set(skill, { total: 0, count: 0 }),
  );

  // Aggregate scores by skill
  userProgress.forEach((progress) => {
    const category = subjectCategoryMap.get(progress.subject_id);
    const skill = category
      ? categoryToSkill[category] || "System Design"
      : "System Design";

    const current = skillScores.get(skill) || { total: 0, count: 0 };
    const percentage = (progress.score / progress.total_questions) * 100;

    skillScores.set(skill, {
      total: current.total + percentage,
      count: current.count + 1,
    });
  });

  // If no data, return default values
  if (userProgress.length === 0) {
    return [
      { category: "Frontend", value: 0 },
      { category: "Backend", value: 0 },
      { category: "Algorithms", value: 0 },
      { category: "System Design", value: 0 },
      { category: "Database", value: 0 },
    ];
  }

  // Calculate averages
  return defaultSkills.map((skill) => {
    const data = skillScores.get(skill)!;
    const average = data.count > 0 ? Math.round(data.total / data.count) : 0;
    return { category: skill, value: average };
  });
}

/**
 * Generate recent activity list
 */
function generateRecentActivity(
  userProgress: UserProgress[],
  trainingGrounds: TrainingGround[],
  subjects: any[],
): ActivitySession[] {
  const activities: ActivitySession[] = [];

  // Create subject map for titles
  const subjectMap = new Map<string, string>();
  subjects.forEach((subject) => {
    subjectMap.set(subject._id.toString(), subject.title);
  });

  // Add progress activities
  userProgress.forEach((progress) => {
    const subjectTitle =
      subjectMap.get(progress.subject_id) || "Unknown Subject";
    const percentage = (progress.score / progress.total_questions) * 100;

    activities.push({
      id: progress._id?.toString() || Math.random().toString(),
      title: `Quiz: ${subjectTitle}`,
      date: new Date(progress.last_attempt),
      status: percentage >= 70 ? "success" : "needs-review",
      score: {
        earned: progress.score,
        total: progress.total_questions,
      },
      mastered: percentage === 100,
    });
  });

  // Add training ground activities
  trainingGrounds.forEach((training) => {
    activities.push({
      id: training._id?.toString() || Math.random().toString(),
      title: `AI Training: ${training.topic}`,
      date: new Date(training.generated_at),
      status: "success",
      mastered: false,
    });
  });

  // Sort by date (newest first) and return top 5
  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}

/**
 * Generate weekly progress data
 */
function generateWeeklyProgress(
  userProgress: UserProgress[],
  trainingGrounds: TrainingGround[],
): ProgressData[] {
  const today = new Date();
  const weekData: ProgressData[] = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create map for last 7 days
  const xpMap = new Map<string, number>();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    xpMap.set(dateKey, 0);
  }

  // Add XP from progress
  userProgress.forEach((progress) => {
    const dateKey = new Date(progress.last_attempt).toISOString().split("T")[0];
    if (xpMap.has(dateKey)) {
      xpMap.set(dateKey, xpMap.get(dateKey)! + progress.score);
    }
  });

  // Add XP from training grounds
  trainingGrounds.forEach((training) => {
    const dateKey = new Date(training.generated_at).toISOString().split("T")[0];
    if (xpMap.has(dateKey)) {
      xpMap.set(dateKey, xpMap.get(dateKey)! + 10);
    }
  });

  // Build result array
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    const dayName = days[date.getDay()];

    weekData.push({
      day: dayName,
      xp: xpMap.get(dateKey) || 0,
    });
  }

  return weekData;
}
