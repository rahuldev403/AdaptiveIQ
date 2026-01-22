"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />

      {/* Main Content */}
      <main className="lg:pl-72 transition-all duration-300">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
