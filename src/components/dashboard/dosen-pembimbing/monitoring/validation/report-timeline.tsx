"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimerIcon as Timeline, CheckCircle, XCircle, Clock, Calendar, FileText } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ReportSchedule } from "@/lib/api/services";

interface ReportTimelineProps {
  reports: ReportSchedule[]
}

export function ReportTimeline({ reports }: ReportTimelineProps) {
  if (reports.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Timeline className="h-5 w-5" />
            <span>Report Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <FileText className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
          <p className="text-muted-foreground">No reports found for this activity</p>
        </CardContent>
      </Card>
    )
  }

  // Sort reports by week number or date
  const sortedReports = [...reports].sort((a, b) => {
    if (a.report_type === "WEEKLY_REPORT" && b.report_type === "WEEKLY_REPORT") {
      return a.week - b.week
    }
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  })

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const getStatusIcon = (report: ReportSchedule) => {
    if (!report.report) {
      return <Clock className="h-5 w-5 text-amber-500" />
    }

    const status = report.report.academic_advisor_status
    if (status === "APPROVED") {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (status === "REJECTED") {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusColor = (report: ReportSchedule) => {
    if (!report.report) {
      return "bg-amber-100 dark:bg-amber-900/20 border-amber-200"
    }
    
    const status = report.report.academic_advisor_status
    if (status === "APPROVED") {
      return "bg-green-100 dark:bg-green-900/20 border-green-200"
    } else if (status === "REJECTED") {
      return "bg-red-100 dark:bg-red-900/20 border-red-200"
    } else {
      return "bg-amber-100 dark:bg-amber-900/20 border-amber-200"
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
      className="mb-6"
    >
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Timeline className="h-5 w-5" />
            <span>Report Timeline</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {sortedReports.length} report{sortedReports.length !== 1 ? 's' : ''}
          </div>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto pr-2 pb-4 pt-1">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border/80 bg-gray-500 rounded-full" />

            <div className="space-y-6">
              {sortedReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-0 top-1.5 h-7 w-7 rounded-full border-2 flex items-center justify-center ${getStatusColor(report)}`}
                  >
                    {getStatusIcon(report)}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium">
                        {report.report_type === "WEEKLY_REPORT" ? `Week ${report.week} Report` : "Final Report"}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          !report.report
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                            : report.report.academic_advisor_status === "APPROVED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : report.report.academic_advisor_status === "REJECTED"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                        }`}
                      >
                        {!report.report ? "Not Submitted" : report.report.academic_advisor_status || "PENDING"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(report.start_date)} - {formatDate(report.end_date)}
                      </span>
                    </div>
                    {report.report && report.report.feedback && (
                      <div className="mt-2 text-sm">
                        <div className="bg-muted p-2 rounded-md border border-border/50">
                          <span className="font-medium">Feedback:</span> {report.report.feedback}
                        </div>
                      </div>
                    )}
                    {report.report && report.report.title && (
                      <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="truncate max-w-[250px]">{report.report.title}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
