"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ActivityDashboard } from "@/components/dashboard/lo-mbkm/matching/activity-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <ActivityDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

