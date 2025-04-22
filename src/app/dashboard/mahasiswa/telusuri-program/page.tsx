"use client"

import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import { ProgramSearchContent } from "@/components/dashboard/program-search-content"

export default function ProgramSearch() {
  return (
    <DashboardProvider>
      <ProgramSearchContent />
    </DashboardProvider>
  )
}
