"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Dashboard } from "@/components/dashboard/lo-mbkm/dashboard"; // Temporarily using LO-MBKM dashboard
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";

export default function MahasiswaDashboard() {
  return (
    <ProtectedDashboardLayout allowedRole="ADMIN">
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedDashboardLayout>
  );
}
