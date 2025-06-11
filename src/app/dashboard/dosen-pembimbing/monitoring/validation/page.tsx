"use client";

import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ReportDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/validation/report-dashboard";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";

export default function MahasiswaDashboard() {
  return (
    <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
      <DashboardLayoutDosen>
        <ReportDashboard />
      </DashboardLayoutDosen>
    </ProtectedDashboardLayout>
  );
}
