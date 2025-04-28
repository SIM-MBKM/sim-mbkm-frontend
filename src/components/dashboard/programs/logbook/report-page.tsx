"use client"

import { useState } from "react"
import { ReportProgress } from "./report-progress"
import { ProgramReports } from "./program-report"
import { useReportSchedulesByStudent } from "@/lib/api/hooks"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReportSchedule } from "@/lib/api/services/monitoring-service"

// Helper function to convert ReportSchedule to Report format
const convertToReportFormat = (reports: ReportSchedule[]) => {
  return reports.map(report => ({
    id: report.id,
    report_schedule_id: report.id,
    report_type: report.report_type,
    week: report.week,
    start_date: report.start_date,
    end_date: report.end_date,
    report: report.report ? report.report.content : null,
    status: report.report ? report.report.academic_advisor_status : "NOT_SUBMITTED",
    feedback: report.report ? report.report.feedback : null
  }));
}

export function ReportsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  
  // Fetch report schedules data using the hook
  const { 
    data: reportSchedulesResponse,
    isLoading, 
    isError,
    error,
    refetch
  } = useReportSchedulesByStudent()
  
  // Get reports data from the API response
  const reportsData = reportSchedulesResponse?.data
  
  // Get program names if data is available
  const programNames = reportsData ? Object.keys(reportsData.reports) : []
  
  // Calculate total reports and submitted reports
  const calculateProgress = () => {
    if (!reportsData) {
      return { 
        totalReports: 0, 
        submittedReports: 0, 
        pendingReports: 0,
        notSubmittedReports: 0,
        percentage: 0,
        pendingPercentage: 0,
        notSubmittedPercentage: 0
      }
    }
    
    const allReports = Object.values(reportsData.reports).flat()
    const totalReports = allReports.length
    
    // Count reports that are not null (submitted)
    const submittedReports = allReports.filter(report => 
      report.report !== null &&
      report.report !== undefined &&
      report.report.id !== "00000000-0000-0000-0000-000000000000" &&
      report.report.academic_advisor_status === "APPROVED"
    ).length

    // Count pending reports
    const pendingReports = allReports.filter(report => 
      report.report !== null &&
      report.report !== undefined &&
      report.report.id !== "00000000-0000-0000-0000-000000000000" &&
      report.report.academic_advisor_status === "PENDING"
    ).length

    // Count not submitted reports
    const notSubmittedReports = allReports.filter(report => 
      report.report === null ||
      report.report === undefined ||
      report.report.id === "00000000-0000-0000-0000-000000000000"
    ).length
    
    return {
      totalReports,
      submittedReports,
      pendingReports,
      notSubmittedReports,
      percentage: totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0,
      pendingPercentage: totalReports > 0 ? Math.round((pendingReports / totalReports) * 100) : 0,
      notSubmittedPercentage: totalReports > 0 ? Math.round((notSubmittedReports / totalReports) * 100) : 0
    }
  }

  const progress = calculateProgress()
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#003478] mb-4" />
        <p className="text-gray-600">Memuat data laporan...</p>
      </div>
    )
  }
  
  // Error state
  if (isError) {
    return (
      <div className="mt-20 border rounded-lg p-6 bg-red-50 border-red-200 text-red-800">
        <h3 className="font-bold mb-2">Error loading reports</h3>
        <p>{error instanceof Error ? error.message : "Unknown error occurred"}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    )
  }
  
  // If no data available
  if (!reportsData || Object.keys(reportsData.reports).length === 0) {
    return (
      <div className="mt-20 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#003478]">Logbook & Laporan</h1>
          <p className="text-gray-600">Kelola laporan mingguan dan laporan akhir program Anda</p>
        </div>
        
        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-500">Tidak ada jadwal laporan yang ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-20">
      <div>
        <h1 className="text-2xl font-bold text-[#003478]">Logbook & Laporan</h1>
        <p className="text-gray-600">Kelola laporan mingguan dan laporan akhir program Anda</p>
      </div>

      <ReportProgress
        totalReports={progress.totalReports}
        submittedReports={progress.submittedReports}
        pendingReports={progress.pendingReports}
        notSubmittedReports={progress.notSubmittedReports}
        percentage={progress.percentage}
        pendingPercentage={progress.pendingPercentage}
        notSubmittedPercentage={progress.notSubmittedPercentage}
      />

      {programNames.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-shrink-0 md:w-64 space-y-2">
            <h2 className="font-medium text-[#003478]">Program</h2>
            <div className="bg-white border-gray-500 border-1 rounded-lg p-2 space-y-1">
              {programNames.map((program) => (
                <button
                  key={program}
                  className={`w-full border-gray-300 border-1 shadow-lg text-left px-3 py-2 rounded-md transition-colors ${
                    selectedProgram === program ? "bg-[#003478] text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedProgram(program)}
                >
                  {program}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {selectedProgram ? (
              <ProgramReports 
                programName={selectedProgram} 
                reports={selectedProgram && reportsData.reports && reportsData.reports[selectedProgram] 
                  ? convertToReportFormat(reportsData.reports[selectedProgram]) 
                  : []}
                refetch={refetch}
              />
            ) : (
              <div className="bg-white border rounded-lg p-8 text-center">
                <p className="text-gray-500">Silakan pilih program untuk melihat laporan</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
