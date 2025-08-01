"use client"

import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout"

export default function MahasiswaDashboard() {
  return (
    <ProtectedDashboardLayout allowedRole="MAHASISWA">
      <DashboardContent />
    </ProtectedDashboardLayout>
  )
}
