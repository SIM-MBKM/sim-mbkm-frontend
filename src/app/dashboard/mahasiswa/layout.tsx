import type React from "react"
import { ThemeProvider } from "@/components/dashboard/theme-provider"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import "@/app/globals.css"

export const metadata = {
  title: "Dashboard Mahasiswa",
  description: "Dashboard Mahasiswa MBKM ITS",
}

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DashboardProvider>{children}</DashboardProvider>
    </ThemeProvider>
  )
} 