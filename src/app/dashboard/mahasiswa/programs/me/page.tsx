"use client"

import { MyPrograms } from "@/components/dashboard/programs/my-programs/my-program"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Home() {
  return (
    <DashboardLayout>
      <MyPrograms />
    </DashboardLayout>
  )
}
