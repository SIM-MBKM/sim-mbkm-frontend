"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SyllabusDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/silabus/syllabus-dashboard";

export default function SilabusDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <SyllabusDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
} 