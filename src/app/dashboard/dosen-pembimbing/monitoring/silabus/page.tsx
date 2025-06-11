"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";
import { SyllabusDashboard } from "@/components/dashboard/dosen-pembimbing/monitoring/silabus/syllabus-dashboard";

export default function SilabusDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayoutDosen>
      <SyllabusDashboard />
    </DashboardLayoutDosen>
    // </ProtectedDashboardLayout>
  );
}
