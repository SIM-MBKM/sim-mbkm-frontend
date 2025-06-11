"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Dashboard } from "@/components/dashboard/lo-mbkm/dashboard";
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";

export default function LOMBKMDashboard() {
  return (
    <ProtectedDashboardLayout allowedRole="LO-MBKM">
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedDashboardLayout>
  );
}
