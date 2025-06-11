"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

import { Header } from "./header-alt";
import { Sidebar } from "./sidebar";
import { useDashboard } from "./dashboard-provider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayoutDosen({ children }: DashboardLayoutProps) {
  const { sidebarOpen, isMobile } = useDashboard();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 relative">
        <Sidebar />

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 p-4 md:p-6 bg-gray-50 transition-all duration-200",
            sidebarOpen && !isMobile ? "lg:ml-64" : "w-full"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
