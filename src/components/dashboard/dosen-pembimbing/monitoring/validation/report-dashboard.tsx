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
import { Loader2, Briefcase, Calendar, FileText, CheckCircle } from "lucide-react"
import { ReportSchedule, ReportScheduleAdvisorResponse } from "@/lib/api/services"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useReportSchedulesByAdvisor } from "@/lib/api/hooks/use-query-hooks"

// Interface for grouped activities
interface ActivityGroup {
  registrationId: string;
  activityName: string;
  reports: ReportSchedule[];
}

export function ReportDashboard() {
  const [reportType, setReportType] = useState<"WEEKLY_REPORT" | "FINAL_REPORT">("WEEKLY_REPORT")
  const [selectedNRP, setSelectedNRP] = useState<string | null>(null)
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(1)
  const { toast } = useToast()
  const [updatedReports, setUpdatedReports] = useState<Record<string, { status: string; feedback: string }>>({})
  
  // Use the React Query hook to fetch report schedules
  const { data, isLoading, refetch } = useReportSchedulesByAdvisor({
    page: currentPage,
    limit: pageSize
  })
  
  // Filter NRPs based on search query
  const filteredNRPs = useMemo(() => {
    if (!data || !data.data || !data.data.reports) return []

    const allNRPs = Object.keys(data.data.reports)
    if (!searchQuery) return allNRPs

    return allNRPs.filter((nrp) => nrp.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [data, searchQuery])

  // Calculate pagination for filtered NRPs
  const paginatedNRPs = useMemo(() => {
    if (!data) return []
    return filteredNRPs
  }, [filteredNRPs, data])

  // Calculate total pages based on filtered NRPs
  const totalPages = useMemo(() => {
    if (!data) return 0
    return parseInt(data.total_pages)
  }, [data])

  // Group reports by registration_id for the selected NRP
  const activityGroups = useMemo(() => {
    if (!data || !selectedNRP || !data.data.reports[selectedNRP]) return [];

    const reports = data.data.reports[selectedNRP];
    const groups: Record<string, ActivityGroup> = {};

    reports.forEach(report => {
      if (!groups[report.registration_id]) {
        groups[report.registration_id] = {
          registrationId: report.registration_id,
          activityName: report.activity_name,
          reports: []
        };
      }
      groups[report.registration_id].reports.push(report);
    });

    return Object.values(groups);
  }, [data, selectedNRP]);

  // Get the current activity name
  const currentActivity = useMemo(() => {
    if (!selectedRegistrationId) return null;
    return activityGroups.find(a => a.registrationId === selectedRegistrationId)?.activityName || null;
  }, [selectedRegistrationId, activityGroups]);

  // Set the first NRP as selected when data loads or when paginated NRPs change
  useEffect(() => {
    if (paginatedNRPs.length > 0 && (!selectedNRP || !paginatedNRPs.includes(selectedNRP))) {
      setSelectedNRP(paginatedNRPs[0]);
      setSelectedRegistrationId(null);
    }
  }, [paginatedNRPs, selectedNRP]);

  // Set the first activity as selected when NRP changes or activities load
  useEffect(() => {
    if (activityGroups.length > 0 && !selectedRegistrationId) {
      setSelectedRegistrationId(activityGroups[0].registrationId);
    }
  }, [activityGroups, selectedRegistrationId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Reset selected NRP when changing page
    setSelectedNRP(null)
    setSelectedRegistrationId(null)

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
    setSelectedRegistrationId(null) // Reset selected activity when changing NRP
  }

  const handleActivityChange = (registrationId: string) => {
    setSelectedRegistrationId(registrationId)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    // Reset to first page when searching
    setCurrentPage(1)
    // Reset selected NRP when searching
    setSelectedNRP(null)
    setSelectedRegistrationId(null)
  }

  // Filter reports by type and registration_id
  const getFilteredReports = () => {
    if (!data || !selectedNRP || !selectedRegistrationId) return []

    const studentReports = data.data.reports[selectedNRP] || []
    return studentReports.filter((report: ReportSchedule) => 
      report.report_type === reportType && 
      report.registration_id === selectedRegistrationId
    )
  }

  // Calculate stats
  const calculateStats = (data: ReportScheduleAdvisorResponse | null, updatedReports: Record<string, { status: string; feedback: string }>) => {
    if (!data) return { total: 0, submitted: 0, pending: 0, approved: 0, rejected: 0, completion: 0 }

    let total = 0
    let submitted = 0
    let approved = 0
    let rejected = 0
    let pending = 0

    Object.values(data.data.reports).forEach((reports: ReportSchedule[]) => {
      reports.forEach((report: ReportSchedule) => {
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
      
      // After successful update, refetch the data
      refetch();
    },
    [toast, refetch],
  )

  const stats = calculateStats(data || null, updatedReports)

  return (
    <>
      <AnimatePresence mode="wait">
          {isLoading ? (
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
                    currentActivity={currentActivity}
                  />
                </div>
              </div>

              <div className="mb-6">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>

              {/* Activity selector */}
              {selectedNRP && activityGroups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <Card className="overflow-hidden border shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                            Student Activities
                          </h3>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 border border-blue-200">
                          {activityGroups.length} {activityGroups.length === 1 ? 'Activity' : 'Activities'}
                        </Badge>
                      </div>
                      {selectedRegistrationId && (
                        <div className="mt-2 text-sm bg-white/50 dark:bg-slate-900/40 p-2 rounded-md border border-blue-100 dark:border-blue-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">
                            Current: {activityGroups.find(a => a.registrationId === selectedRegistrationId)?.activityName}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-2">
                          Select an activity to view its reports:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {activityGroups.map((activity) => {
                            // Count reports of each type for this activity
                            const weeklyReports = activity.reports.filter(r => r.report_type === "WEEKLY_REPORT").length;
                            const finalReports = activity.reports.filter(r => r.report_type === "FINAL_REPORT").length;
                            const submittedReports = activity.reports.filter(r => r.report !== null).length;
                            const totalReports = activity.reports.length;
                            const completionPercentage = Math.round((submittedReports / totalReports) * 100);
                            
                            return (
                              <Card
                                key={activity.registrationId}
                                className={`border ${
                                  selectedRegistrationId === activity.registrationId 
                                    ? "border-blue-500 shadow-sm" 
                                    : "border-border hover:border-blue-300"
                                } cursor-pointer transition-all duration-200`}
                                onClick={() => handleActivityChange(activity.registrationId)}
                              >
                                <CardContent className="p-3 flex gap-3 items-center">
                                  <div className={`p-2 rounded-md ${
                                    selectedRegistrationId === activity.registrationId 
                                      ? "bg-blue-500 text-white" 
                                      : "bg-blue-100 text-blue-600"
                                  }`}>
                                    <Briefcase className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                    <div className="font-medium truncate">{activity.activityName}</div>
                                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                      <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {weeklyReports} weekly
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {finalReports} final
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        {completionPercentage}% complete
                                      </span>
                                    </div>
                                  </div>
                                  {selectedRegistrationId === activity.registrationId && (
                                    <Badge className="bg-blue-500 text-white border-blue-600 ml-auto">
                                      Current
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Tabs
                defaultValue="WEEKLY_REPORT"
                value={reportType}
                onValueChange={(v) => handleReportTypeChange(v as "WEEKLY_REPORT" | "FINAL_REPORT")}
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
                  {selectedNRP && selectedRegistrationId ? (
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
                      <p className="text-muted-foreground">
                        {selectedNRP 
                          ? "Please select an activity to view reports" 
                          : "Please select an NRP to view reports"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="FINAL_REPORT" className="mt-0">
                  {selectedNRP && selectedRegistrationId ? (
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
                      <p className="text-muted-foreground">
                        {selectedNRP 
                          ? "Please select an activity to view reports" 
                          : "Please select an NRP to view reports"}
                      </p>
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
