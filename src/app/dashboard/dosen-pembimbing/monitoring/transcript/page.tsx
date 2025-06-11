"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";
import { TranscriptDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/transcript/transcript-dashboard";

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayoutDosen>
      <TranscriptDashboard />
    </DashboardLayoutDosen>
    // </ProtectedDashboardLayout>
  );
}
