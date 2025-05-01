"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RegistrationForm } from "./registration-form"
import { useActivityById, useCheckEligibility } from "@/lib/api/hooks"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { Loader2 } from "lucide-react"

export function InternshipRegistration() {
  const params = useParams()
  const router = useRouter()
  const activityId = params.id as string
  const [isEligibilityChecked, setIsEligibilityChecked] = useState(false)
  
  // Fetch activity data and eligibility
  const { data: activity, isLoading: isActivityLoading, error: activityError } = useActivityById(activityId)
  const { refetch: checkEligibility, isLoading: isEligibilityLoading } = useCheckEligibility(activityId)
  
  // Check eligibility on component mount
  useEffect(() => {
    const verifyEligibility = async () => {
      try {
        const result = await checkEligibility()
        
        if (result.data && result.data.data) {
          // If not eligible, show toast and redirect back to programs
          if (result.data.data.eligible === false) {
            toast.error(result.data.data.message)
            setTimeout(() => {
              router.push("/dashboard/mahasiswa/programs")
            }, 2000) // Add a small delay so the user can see the toast
          } else {
            // Mark as checked if eligible
            setIsEligibilityChecked(true)
          }
        } else {
          // Handle unexpected response format
          toast.error("Failed to verify eligibility")
          setTimeout(() => {
            router.push("/dashboard/mahasiswa/programs")
          }, 2000)
        }
      } catch (error) {
        console.error("Eligibility check error:", error)
        toast.error("Error checking eligibility")
        setTimeout(() => {
          router.push("/dashboard/mahasiswa/programs")
        }, 2000)
      }
    }
    
    verifyEligibility()
  }, [activityId, checkEligibility, router])
  
  // Loading state
  if (isActivityLoading || isEligibilityLoading || !isEligibilityChecked) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ToastContainer position="top-right" autoClose={3000} />
        <Loader2 className="h-8 w-8 animate-spin text-[#003478] mb-4" />
        <p className="text-gray-600">
          {isEligibilityChecked ? "Loading program details..." : "Verifying eligibility..."}
        </p>
      </div>
    )
  }
  
  // Error state
  if (activityError || !activity) {
    return (
      <div className="p-6 border rounded-lg bg-red-50 border-red-200 text-red-800">
        <ToastContainer position="top-right" autoClose={3000} />
        <h3 className="font-bold mb-2">Error loading program</h3>
        <p>{activityError?.message || "Program not found"}</p>
      </div>
    )
  }
  
  return (
    <main className="flex-1 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      {
        activity && activity.data && (
          <RegistrationForm activity={activity.data} />
        )
      }
    </main>
  )
}
