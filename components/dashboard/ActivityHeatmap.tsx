"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, TrendingUp } from "lucide-react";

export interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-3
}

interface ActivityHeatmapProps {
  data?: ActivityData[];
  currentStreak?: number;
  longestStreak?: number;
}

// Generate mock data for the past year
export function generateMockYearData(): ActivityData[] {
  const data: ActivityData[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  let currentDate = new Date(oneYearAgo);

  while (currentDate <= today) {
    // Random activity with some patterns (more activity on weekdays)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 30% chance of no activity, higher on weekends
    const noActivity = Math.random() < (isWeekend ? 0.5 : 0.3);

    let count = 0;
    let level = 0;

    if (!noActivity) {
      // Generate realistic activity counts
      count = Math.floor(Math.random() * 20) + 1;

      // Map count to level (0-3)
      if (count >= 15) level = 3;
      else if (count >= 10) level = 2;
      else if (count >= 5) level = 1;
      else level = 0;
    }

    data.push({
      date: currentDate.toISOString().split("T")[0],
      count,
      level,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

// Calculate streaks from activity data
function calculateStreaks(data: ActivityData[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (!data.length) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Sort by date (newest first)
  const sortedData = [...data].sort(
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

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [spring]);

  return <span>{displayValue}</span>;
}

export default function ActivityHeatmap({
  data: providedData,
  currentStreak: providedCurrentStreak,
  longestStreak: providedLongestStreak,
}: ActivityHeatmapProps) {
  const [mounted, setMounted] = useState(false);

  // Generate mock data if none provided
  const data = providedData || generateMockYearData();

  // Calculate streaks
  const { currentStreak, longestStreak } =
    providedCurrentStreak !== undefined && providedLongestStreak !== undefined
      ? {
          currentStreak: providedCurrentStreak,
          longestStreak: providedLongestStreak,
        }
      : calculateStreaks(data);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Group data by weeks
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];

  // Pad the beginning to start on Sunday
  const firstDate = new Date(data[0]?.date || new Date());
  const firstDayOfWeek = firstDate.getDay();

  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: "", count: 0, level: -1 });
  }

  data.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Pad the last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: -1 });
    }
    weeks.push(currentWeek);
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-800";
      case 1:
        return "bg-emerald-900";
      case 2:
        return "bg-emerald-600";
      case 3:
        return "bg-emerald-400";
      default:
        return "bg-slate-800/30"; // Empty/padding cells
    }
  };

  const getTooltipText = (day: ActivityData) => {
    if (!day.date) return "";
    const date = new Date(day.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${day.count} ${day.count === 1 ? "question" : "questions"} on ${formattedDate}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Streaks */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-white">Activity Overview</h3>

        <div className="flex items-center gap-6">
          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mounted ? <AnimatedCounter value={currentStreak} /> : 0}
              </p>
              <p className="text-xs text-slate-400">Current Streak</p>
            </div>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {mounted ? <AnimatedCounter value={longestStreak} /> : 0}
              </p>
              <p className="text-xs text-slate-400">Longest Streak</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-[2px] mb-2 ml-6">
            {weeks.map((week, weekIndex) => {
              if (weekIndex % 4 === 0 && week[0]?.date) {
                const date = new Date(week[0].date);
                const month = date.toLocaleDateString("en-US", {
                  month: "short",
                });
                return (
                  <div
                    key={weekIndex}
                    className="text-xs text-slate-500"
                    style={{ width: `${4 * 14}px` }}
                  >
                    {month}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Day labels + Grid */}
          <div className="flex gap-[2px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] pr-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => {
                  // Only show Mon, Wed, Fri to avoid clutter
                  if (index % 2 === 1) {
                    return (
                      <div
                        key={day}
                        className="text-xs text-slate-500 h-3 flex items-center"
                      >
                        {day}
                      </div>
                    );
                  }
                  return <div key={day} className="h-3" />;
                },
              )}
            </div>

            {/* Activity Grid */}
            <motion.div
              className="flex gap-[2px]"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.002,
                  },
                },
              }}
            >
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      variants={{
                        hidden: { opacity: 0, scale: 0 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      whileHover={{ scale: 1.3, zIndex: 10 }}
                      className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} transition-colors cursor-pointer relative group`}
                      title={getTooltipText(day)}
                    >
                      {/* Tooltip */}
                      {day.date && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-950 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 border border-slate-700">
                          {getTooltipText(day)}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-700" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 ml-6">
            <span className="text-xs text-slate-500">Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
