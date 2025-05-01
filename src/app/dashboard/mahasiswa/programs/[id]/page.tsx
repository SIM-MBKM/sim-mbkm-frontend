"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { InternshipRegistration } from "@/components/dashboard/programs/registration/internship-registration";
import { useCheckEligibility } from "@/lib/api/hooks";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  const [isChecking, setIsChecking] = useState(true);
  
  // Use eligibility check hook (omit the unused data variable)
  const { isLoading, error, refetch: checkEligibility } = useCheckEligibility(activityId);
  
  // Check eligibility on page load
  useEffect(() => {
    const checkUserEligibility = async () => {
      try {
        const result = await checkEligibility();
        
        if (result.data && result.data.data) {
          // If not eligible, show toast and redirect to programs page
          if (result.data.data.eligible === false) {
            toast.error(result.data.data.message);
            // Wait for toast to be visible before redirecting
            setTimeout(() => {
              router.push("/dashboard/mahasiswa/programs");
            }, 3000);
          } else {
            setIsChecking(false);
          }
        } else {
          // Handle error case
          toast.error("Failed to check eligibility");
          setTimeout(() => {
            router.push("/dashboard/mahasiswa/programs");
          }, 3000);
        }
      } catch (error) {
        console.error("Eligibility check error:", error);
        toast.error("Error checking eligibility");
        setTimeout(() => {
          router.push("/dashboard/mahasiswa/programs");
        }, 3000);
      }
    };
    
    checkUserEligibility();
  }, [activityId, checkEligibility, router]);
  
  // Show loading state while checking eligibility
  if (isChecking || isLoading) {
    return (
      <DashboardLayout>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#003478] mb-4" />
          <p className="text-gray-600">Memeriksa kelayakan...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show error state if there's an issue with eligibility check
  if (error) {
    return (
      <DashboardLayout>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="p-6 border rounded-lg bg-red-50 border-red-200 text-red-800">
          <h3 className="font-bold mb-2">Error checking eligibility</h3>
          <p>{error instanceof Error ? error.message : "An unknown error occurred"}</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <InternshipRegistration />
    </DashboardLayout>
  );
};
