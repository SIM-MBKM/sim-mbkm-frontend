"use client";

import RealReportDashboard from "@/components/dashboard/admin/reports/report-management-dashboard";
import { Toaster } from "@/components/ui/toaster";
import { ReportAPIProvider } from "@/lib/api/providers/report-provider";

export default function AdminDashboard() {
  return (
    <div className="mb-6 mt-20">
      <ReportAPIProvider>
        <RealReportDashboard />
        <Toaster />
      </ReportAPIProvider>
    </div>
  );
}
