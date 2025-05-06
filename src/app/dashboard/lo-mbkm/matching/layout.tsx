import type React from "react"
import { ThemeProvider } from "@/components/dashboard/theme-provider"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import "@/app/globals.css"

export const metadata = {
  title: "Dashboard LO MBKM",
  description: "Dashboard Kelola Matching",
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