"use client";

import { motion } from "framer-motion";
import { Subject, UserProgress } from "@/lib/db/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubjectIcon } from "@/components/subject-icon";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import SkillRadar from "@/components/dashboard/SkillRadar";
import ProgressAreaChart from "@/components/dashboard/ProgressAreaChart";
import RecentActivityList from "@/components/dashboard/RecentActivityList";
import { DashboardStats } from "@/actions/dashboard-stats";
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  Rocket,
} from "lucide-react";
import Link from "next/link";

interface SerializedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | undefined;
  imageUrl: string;
}

interface DashboardClientProps {
  user: SerializedUser | null;
  subjects: Subject[];
  userProgress: UserProgress[];
  dashboardStats: DashboardStats;
}

export default function DashboardClient({
  user,
  subjects,
  userProgress,
  dashboardStats,
}: DashboardClientProps) {
  const getProgressForSubject = (subjectId: string) => {
    return userProgress.find((p) => p.subject_id === subjectId);
  };

  const totalCompleted = userProgress.reduce(
    (sum, p) => sum + p.completed_questions.length,
    0,
  );
  const averageScore =
    userProgress.length > 0
      ? Math.round(
          userProgress.reduce(
            (sum, p) => sum + (p.score / p.total_questions) * 100,
            0,
          ) / userProgress.length,
        )
      : 0;

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Empty state for new users
  if (dashboardStats.isEmpty) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full"
          >
            <Card className="bg-slate-800/50 border-slate-700 p-12 text-center backdrop-blur-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to AdaptiQ Live! 🎉
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                You haven't started any learning sessions yet. Begin your
                journey to master programming concepts with our adaptive
                learning platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/training-ground">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Try AI Training Ground
                  </button>
                </Link>

                {subjects.length > 0 && (
                  <Link href={`/quiz/${subjects[0]._id}`}>
                    <button className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Start Your First Quiz
                    </button>
                  </Link>
                )}
              </div>

              {subjects.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Available Topics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {subjects.slice(0, 4).map((subject) => (
                      <Link
                        key={subject._id?.toString()}
                        href={`/quiz/${subject._id?.toString()}`}
                        className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-blue-500/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <SubjectIcon
                            iconName={subject.icon}
                            className="w-10 h-10 text-blue-400"
                          />
                          <div className="text-left">
                            <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                              {subject.title}
                            </p>
                            <p className="text-sm text-slate-400">
                              {subject.questions.length} questions
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Welcome back, {user?.firstName || "Developer"}!
          </h1>
          <p className="text-slate-400">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Bento Grid - 12 Column Layout */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Top Row - Welcome/Stats Card - Full Width */}
          <motion.div variants={item} className="col-span-12">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left: Stats Overview */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-slate-100">
                      Your Progress Overview
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">
                        Average Score
                      </p>
                      <p className="text-3xl font-bold text-slate-100">
                        {averageScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Total XP</p>
                      <p className="text-3xl font-bold text-slate-100">
                        {dashboardStats.totalXp}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">
                        Current Streak
                      </p>
                      <p className="text-3xl font-bold text-slate-100">
                        {dashboardStats.currentStreak}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Completed</p>
                      <p className="text-3xl font-bold text-slate-100">
                        {totalCompleted}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action */}
                <div>
                  <Link
                    href="/training-ground"
                    className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary to-purple-600 rounded-lg hover:from-primary-hover hover:to-purple-700 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">
                        AI Training Ground
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Middle Row - Activity Heatmap (Large) + Skill Radar (Small) */}
          <motion.div variants={item} className="col-span-12 lg:col-span-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <ActivityHeatmap
                data={dashboardStats.activityHeatmap}
                currentStreak={dashboardStats.currentStreak}
                longestStreak={dashboardStats.longestStreak}
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="col-span-12 lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">
                  Skill Proficiency
                </h3>
              </div>
              <SkillRadar data={dashboardStats.skillDistribution} />
            </div>
          </motion.div>

          {/* Middle Row 2 - Weekly Progress + Quick Stats */}
          <motion.div variants={item} className="col-span-12 lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">
                  Weekly Progress
                </h3>
              </div>
              <ProgressAreaChart data={dashboardStats.weeklyProgress} />
            </div>
          </motion.div>

          <motion.div variants={item} className="col-span-12 lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col justify-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-primary" />
                    <p className="text-sm text-slate-400">Subjects</p>
                  </div>
                  <p className="text-4xl font-bold text-slate-100">
                    {subjects.length}
                  </p>
                </div>
                <div className="flex flex-col justify-center p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-success" />
                    <p className="text-sm text-slate-400">Longest Streak</p>
                  </div>
                  <p className="text-4xl font-bold text-slate-100">
                    {dashboardStats.longestStreak}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Row - Recent Activity List - Full Width */}
          <motion.div variants={item} className="col-span-12">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-100">
                  Recent Activity
                </h3>
              </div>
              <RecentActivityList sessions={dashboardStats.recentActivity} />
            </div>
          </motion.div>

          {/* Subject Cards - Grid Layout */}
          {subjects.slice(0, 8).map((subject) => {
            const progress = getProgressForSubject(subject._id!.toString());
            const completionRate = progress
              ? Math.round(
                  (progress.completed_questions.length /
                    progress.total_questions) *
                    100,
                )
              : 0;

            return (
              <motion.div
                key={subject._id?.toString()}
                variants={item}
                className="col-span-12 sm:col-span-6 lg:col-span-3"
              >
                <Link href={`/quiz/${subject._id?.toString()}`}>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full hover:border-primary/50 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <SubjectIcon
                        iconName={subject.icon}
                        className="w-10 h-10 text-primary"
                      />
                      {progress && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {completionRate}%
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-primary transition-colors">
                      {subject.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {subject.questions.length} questions
                      </span>
                      {progress && (
                        <span className="text-primary font-medium">
                          {Math.round(
                            (progress.score / progress.total_questions) * 100,
                          )}
                          %
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
