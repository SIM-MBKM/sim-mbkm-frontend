"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TranscriptDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/transcript/transcript-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <TranscriptDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

