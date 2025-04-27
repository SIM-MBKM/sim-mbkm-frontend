"use client"

import { useParams } from "next/navigation"
import { RegistrationForm } from "./registration-form"
import { useActivityById } from "@/lib/api/hooks"

export function InternshipRegistration() {
  const params = useParams()
  const activityId = params.id as string
  
  const { data: activity, isLoading, error } = useActivityById(activityId)
  
  if (isLoading) {
    return <div className="p-6">Loading program details...</div>
  }
  
  if (error || !activity) {
    return <div className="p-6">Error loading program details: {error?.message || "Program not found"}</div>
  }
  
  return (
    <main className="flex-1 p-6">
      {
        activity && activity.data && (
          <RegistrationForm activity={activity.data} />
        )
      }
    </main>
  )
}
