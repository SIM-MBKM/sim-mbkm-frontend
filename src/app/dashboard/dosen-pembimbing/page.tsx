"use client";

import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";
import { Dashboard } from "@/components/dashboard/dosen-pembimbing/dashboard";
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";

export default function DosenPembimbingDashboard() {
  return (
    <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
      <DashboardLayoutDosen>
        <Dashboard />
      </DashboardLayoutDosen>
    </ProtectedDashboardLayout>
  );
}
