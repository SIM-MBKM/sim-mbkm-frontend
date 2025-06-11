"use client";

import { ReportDashboard } from "@/components/dashboard/admin/reports/report-management-dashboard";
import { UserManagementDashboard } from "@/components/dashboard/admin/users/user-management-dashboard";
import { Toaster } from "@/components/ui/toaster";
import { UserAPIProvider } from "@/lib/api/providers/user-provider";

export default function AdminDashboard() {
  return (
    <div className="mb-6 mt-20">
      <ReportDashboard />
      <Toaster />
    </div>
  );
}
