import type React from "react";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import "@/app/globals.css";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}
