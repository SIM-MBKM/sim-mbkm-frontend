"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProgramDashboard } from "@/components/dashboard/lo-mbkm/program/program-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <ProgramDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

