"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";
import { RegistrationDashboard } from "@/components/dashboard/dosen-pembimbing/ajuan-mahasiswa/registration-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayoutDosen>
      <RegistrationDashboard />
    </DashboardLayoutDosen>
    // </ProtectedDashboardLayout>
  );
}
