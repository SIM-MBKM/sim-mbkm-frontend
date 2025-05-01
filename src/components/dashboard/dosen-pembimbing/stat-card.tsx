"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  colorClass: string
  increase: string
}

export function StatCard({ title, value, subtitle, icon, colorClass, increase }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={cn("bg-gradient-to-r p-4 text-white", colorClass)}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium opacity-90">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              <p className="text-xs opacity-80 mt-1">{subtitle}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-full">{icon}</div>
          </div>
        </div>
        <div className="p-3 bg-background">
          <p className="text-xs text-muted-foreground">
            <span className="inline-block mr-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 19V5M12 5L5 12M12 5L19 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {increase}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
