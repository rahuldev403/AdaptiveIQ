"use client";

import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  tooltip?: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  title,
  tooltip,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <Card
      className={`bg-slate-800/50 border-slate-700 p-6 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-slate-400 hover:text-slate-300 transition-colors cursor-help" />
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-950 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 border border-slate-700">
              {tooltip}
              <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-slate-700" />
            </div>
          </div>
        )}
      </div>
      <div>{children}</div>
    </Card>
  );
}
