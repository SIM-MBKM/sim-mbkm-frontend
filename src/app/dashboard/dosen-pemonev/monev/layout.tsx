import type React from "react";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import "@/app/globals.css";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";

export default function DosenPemonevLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DashboardLayoutDosen>
        <div className="mt-20">{children} </div>
      </DashboardLayoutDosen>
    </ThemeProvider>
  );
}
