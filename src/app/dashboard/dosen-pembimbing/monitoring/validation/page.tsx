"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ReportDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/validation/report-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <ReportDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

