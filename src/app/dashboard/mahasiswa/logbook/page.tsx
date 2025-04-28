"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ReportsPage } from "@/components/dashboard/programs/logbook/report-page";

export default function ReportsRoute() {
  return (
    <DashboardLayout>
      <ReportsPage />
    </DashboardLayout>    
  )
}
