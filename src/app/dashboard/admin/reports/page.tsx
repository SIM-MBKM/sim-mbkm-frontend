"use client";

import { ReportDashboard } from "@/components/dashboard/admin/reports/report-management-dashboard";
import { Toaster } from "@/components/ui/toaster";

export default function AdminDashboard() {
  return (
    <div className="mb-6 mt-20">
      <ReportDashboard />
      <Toaster />
    </div>
  );
}
