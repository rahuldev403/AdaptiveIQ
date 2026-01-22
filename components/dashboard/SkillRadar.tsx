"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export interface SkillData {
  category: string;
  value: number;
}

interface SkillRadarProps {
  data?: SkillData[];
}

// Default mock data
const defaultData: SkillData[] = [
  { category: "Frontend", value: 85 },
  { category: "Backend", value: 72 },
  { category: "Algorithms", value: 68 },
  { category: "System Design", value: 55 },
  { category: "Database", value: 78 },
];

export default function SkillRadar({ data = defaultData }: SkillRadarProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#334155" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <Radar
          name="Proficiency"
          dataKey="value"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
