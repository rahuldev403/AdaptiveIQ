"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ProgressData {
  day: string;
  xp: number;
}

interface ProgressAreaChartProps {
  data?: ProgressData[];
}

// Default mock data for last 7 days
const defaultData: ProgressData[] = [
  { day: "Mon", xp: 45 },
  { day: "Tue", xp: 62 },
  { day: "Wed", xp: 38 },
  { day: "Thu", xp: 85 },
  { day: "Fri", xp: 72 },
  { day: "Sat", xp: 95 },
  { day: "Sun", xp: 68 },
];

export default function ProgressAreaChart({
  data = defaultData,
}: ProgressAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="day"
          stroke="#94a3b8"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#fff",
          }}
          labelStyle={{ color: "#94a3b8" }}
        />
        <Area
          type="monotone"
          dataKey="xp"
          stroke="#10b981"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#xpGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
