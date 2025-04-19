"use client"

import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}
