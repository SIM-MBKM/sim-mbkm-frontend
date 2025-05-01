"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ReportTimeline } from "./report-timeline"
import { ReportCards } from "./report-cards"
import { ReportStats } from "./report-stats"
import { ReportFilter } from "./report-filter"
import { Pagination } from "./pagination"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/lib/api/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

// Generate sample data with multiple NRPs
const generateSampleData = () => {
  // Create 5 NRPs
  const nrps = ["5025211010", "5025211011", "5025211012", "5025211013", "5025211014"]

  const reports = {}

  // For each NRP, generate up to 20 reports
  nrps.forEach((nrp) => {
    const nrpReports = []

    // Generate weekly reports (up to 16)
    for (let week = 1; week <= 16; week++) {
      const startDate = new Date(2025, 2, week * 7 - 6) // Starting from March 1, 2025
      const endDate = new Date(2025, 2, week * 7)

      // Randomly determine if report is submitted
      const isSubmitted = Math.random() > 0.3

      // Randomly determine status if submitted
      let status = "PENDING"
      if (isSubmitted) {
        const rand = Math.random()
        if (rand < 0.3) status = "APPROVED"
        else if (rand < 0.5) status = "REJECTED"
      }

      nrpReports.push({
        id: `weekly-${nrp}-${week}`,
        user_id: `user-${nrp}`,
        user_nrp: nrp,
        registration_id: `reg-${nrp}-${week}`,
        activity_name: `Activity Week ${week}`,
        academic_advisor_id: "advisor-123",
        academic_advisor_email: "advisor@university.edu",
        report_type: "WEEKLY_REPORT",
        week: week,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        report: isSubmitted
          ? {
              id: `report-${nrp}-${week}`,
              report_schedule_id: `weekly-${nrp}-${week}`,
              file_storage_id: `file-${nrp}-${week}`,
              title: `Week ${week} Progress Report`,
              content: `This is the content for week ${week} report.`,
              report_type: "WEEKLY_REPORT",
              feedback: Math.random() > 0.5 ? `Feedback for week ${week}` : "",
              academic_advisor_status: status,
            }
          : null,
      })
    }

    // Add final report
    const finalStartDate = new Date(2025, 6, 1) // July 1, 2025
    const finalEndDate = new Date(2025, 7, 15) // August 15, 2025

    // Randomly determine if final report is submitted
    const isFinalSubmitted = Math.random() > 0.2

    // Randomly determine status if submitted
    let finalStatus = "PENDING"
    if (isFinalSubmitted) {
      const rand = Math.random()
      if (rand < 0.4) finalStatus = "APPROVED"
      else if (rand < 0.6) finalStatus = "REJECTED"
    }

    nrpReports.push({
      id: `final-${nrp}`,
      user_id: `user-${nrp}`,
      user_nrp: nrp,
      registration_id: `reg-${nrp}-final`,
      activity_name: "Final Project",
      academic_advisor_id: "advisor-123",
      academic_advisor_email: "advisor@university.edu",
      report_type: "FINAL_REPORT",
      week: null,
      start_date: finalStartDate.toISOString(),
      end_date: finalEndDate.toISOString(),
      report: isFinalSubmitted
        ? {
            id: `report-${nrp}-final`,
            report_schedule_id: `final-${nrp}`,
            file_storage_id: `file-${nrp}-final`,
            title: "Final Program Report",
            content: "This is the content for the final report.",
            report_type: "FINAL_REPORT",
            feedback: Math.random() > 0.5 ? "Feedback for final report" : "",
            academic_advisor_status: finalStatus,
          }
        : null,
    })

    reports[nrp] = nrpReports
  })

  return {
    message: "Report schedule found successfully",
    status: "success",
    data: {
      reports: reports,
    },
    total_nrps: nrps.length,
    nrps_per_page: 2,
    current_page: 1,
    total_pages: Math.ceil(nrps.length / 2),
  }
}

// Create the sample data
const fullSampleData = generateSampleData()

export function ReportDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [reportType, setReportType] = useState<"WEEKLY_REPORT" | "FINAL_REPORT">("WEEKLY_REPORT")
  const [selectedNRP, setSelectedNRP] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [updatedReports, setUpdatedReports] = useState<Record<string, { status: string; feedback: string }>>({})

  // Filter NRPs based on search query
  const filteredNRPs = useMemo(() => {
    if (!data || !data.data || !data.data.reports) return []

    const allNRPs = Object.keys(data.data.reports)
    if (!searchQuery) return allNRPs

    return allNRPs.filter((nrp) => nrp.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [data, searchQuery])

  // Calculate pagination for filtered NRPs
  const paginatedNRPs = useMemo(() => {
    const nrpsPerPage = 2
    const startIndex = (currentPage - 1) * nrpsPerPage
    const endIndex = startIndex + nrpsPerPage

    return filteredNRPs.slice(startIndex, endIndex)
  }, [filteredNRPs, currentPage])

  // Calculate total pages based on filtered NRPs
  const totalPages = useMemo(() => {
    return Math.ceil(filteredNRPs.length / 2)
  }, [filteredNRPs])

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Set the data
      setData(fullSampleData)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Set the first NRP as selected when data loads or when paginated NRPs change
  useEffect(() => {
    if (paginatedNRPs.length > 0 && (!selectedNRP || !paginatedNRPs.includes(selectedNRP))) {
      setSelectedNRP(paginatedNRPs[0])
    }
  }, [paginatedNRPs, selectedNRP])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Reset selected NRP when changing page
    setSelectedNRP(null)

    toast({
      title: "Changing page",
      description: `Loading page ${page}`,
    })
  }

  const handleReportTypeChange = (type: "WEEKLY_REPORT" | "FINAL_REPORT") => {
    setReportType(type)
  }

  const handleNRPChange = (nrp: string) => {
    setSelectedNRP(nrp)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    // Reset to first page when searching
    setCurrentPage(1)
    // Reset selected NRP when searching
    setSelectedNRP(null)
  }

  // Filter reports by type
  const getFilteredReports = () => {
    if (!data || !selectedNRP) return []

    const studentReports = data.data.reports[selectedNRP] || []
    return studentReports.filter((report: any) => report.report_type === reportType)
  }

  // Calculate stats
  const calculateStats = (data: any, updatedReports: Record<string, { status: string; feedback: string }>) => {
    if (!data) return { total: 0, submitted: 0, pending: 0, approved: 0, rejected: 0, completion: 0 }

    let total = 0
    let submitted = 0
    let approved = 0
    let rejected = 0
    let pending = 0

    Object.values(data.data.reports).forEach((reports: any) => {
      reports.forEach((report: any) => {
        total++

        // Check if this report has been updated
        const updatedReport = updatedReports[report.id]
        const status = updatedReport?.status || report.report?.academic_advisor_status

        if (report.report) {
          submitted++

          if (status === "APPROVED") {
            approved++
          } else if (status === "REJECTED") {
            rejected++
          } else {
            pending++
          }
        }
      })
    })

    return {
      total,
      submitted,
      pending,
      approved,
      rejected,
      completion: total > 0 ? Math.round((submitted / total) * 100) : 0,
    }
  }

  const handleStatusChange = useCallback(
    (reportId: string, status: string, feedback: string) => {
      setUpdatedReports((prev) => ({
        ...prev,
        [reportId]: { status, feedback },
      }))

      // In a real app, you would make an API call here
      toast({
        title: "Status updated",
        description: `Report status changed to ${status}`,
      })
    },
    [toast],
  )

  const stats = calculateStats(data, updatedReports)

  return (
    <>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-medium">Loading report schedules...</h3>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <ReportStats stats={stats} />
                </div>
                <div>
                  <ReportFilter
                    nrps={paginatedNRPs}
                    allNrps={filteredNRPs}
                    selectedNRP={selectedNRP}
                    onNRPChange={handleNRPChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>

              <Tabs
                defaultValue="WEEKLY_REPORT"
                value={reportType}
                onValueChange={(v) => handleReportTypeChange(v as any)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="bg-background/50 backdrop-blur-sm border">
                    <TabsTrigger
                      value="WEEKLY_REPORT"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Weekly Reports
                    </TabsTrigger>
                    <TabsTrigger
                      value="FINAL_REPORT"
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                    >
                      Final Reports
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="WEEKLY_REPORT" className="mt-0">
                  {selectedNRP ? (
                    <>
                      <ReportTimeline reports={getFilteredReports()} />
                      <ReportCards
                        reports={getFilteredReports()}
                        updatedReports={updatedReports}
                        onStatusChange={handleStatusChange}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Please select an NRP to view reports</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="FINAL_REPORT" className="mt-0">
                  {selectedNRP ? (
                    <>
                      <ReportTimeline reports={getFilteredReports()} />
                      <ReportCards
                        reports={getFilteredReports()}
                        updatedReports={updatedReports}
                        onStatusChange={handleStatusChange}
                      />
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Please select an NRP to view reports</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
      <Toaster />
    </>
    
  )
}
