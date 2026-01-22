"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface ActivitySession {
  id: string;
  title: string;
  date: Date;
  status: "success" | "needs-review";
  score?: {
    earned: number;
    total: number;
  };
  mastered?: boolean;
}

interface RecentActivityListProps {
  sessions?: ActivitySession[];
}

// Mock data generator
const generateMockSessions = (): ActivitySession[] => {
  const now = new Date();
  return [
    {
      id: "1",
      title: "Daily Sprint #42",
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "success",
      score: { earned: 8, total: 10 },
    },
    {
      id: "2",
      title: "AI Remediation: React Hooks",
      date: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      status: "success",
      mastered: true,
    },
    {
      id: "3",
      title: "System Design Challenge",
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: "needs-review",
      score: { earned: 5, total: 10 },
    },
    {
      id: "4",
      title: "Algorithm Practice: Trees",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "success",
      score: { earned: 9, total: 10 },
    },
    {
      id: "5",
      title: "Database Optimization Quiz",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "success",
      mastered: true,
    },
  ];
};

export default function RecentActivityList({
  sessions = generateMockSessions(),
}: RecentActivityListProps) {
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {sessions.slice(0, 5).map((session) => (
            <motion.div
              key={session.id}
              variants={item}
              layout
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={`/history/${session.id}`}>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer group">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {session.status === "success" ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {formatDistanceToNow(session.date, { addSuffix: true })}
                    </p>
                  </div>

                  {/* Score Badge */}
                  <div className="flex-shrink-0">
                    {session.mastered ? (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 font-semibold">
                        Mastered
                      </Badge>
                    ) : session.score ? (
                      <Badge
                        className={`${
                          session.score.earned / session.score.total >= 0.7
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        } font-semibold`}
                      >
                        {session.score.earned}/{session.score.total}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
