"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RegistrationDashboard } from "@/components/dashboard/lo-mbkm/ajuan-mahasiswa/registration-dashboard";


export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
      <RegistrationDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

