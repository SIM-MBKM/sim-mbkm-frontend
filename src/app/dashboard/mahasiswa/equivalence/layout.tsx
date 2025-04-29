import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/dashboard/theme-provider"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  )
}
