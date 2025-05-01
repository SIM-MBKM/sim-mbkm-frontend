"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format, parseISO } from "date-fns"
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReportPreview } from "./report-preview"
// import { useToast } from "@/lib/api/hooks/use-toast"
import { ReportSchedule } from "@/lib/api/services";


interface ReportCardsProps {
  reports: ReportSchedule[]
  updatedReports?: Record<string, { status: string; feedback: string }>
  onStatusChange?: (reportId: string, status: string, feedback: string) => void
}

export function ReportCards({ reports, updatedReports = {}, onStatusChange }: ReportCardsProps) {
  const [selectedReport, setSelectedReport] = useState<ReportSchedule | null>(null)
  // const { toast } = useToast()

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch {
      return "Invalid date"
    }
  }

  const handleStatusChange = (reportId: string, status: string, feedback: string) => {
    if (onStatusChange) {
      onStatusChange(reportId, status, feedback)
    }
  }

  const getStatusBadge = (report: ReportSchedule) => {
    // Check if this report has been updated
    const updatedReport = updatedReports[report.id]
    const status = updatedReport?.status || report.report?.academic_advisor_status || "NOT_SUBMITTED"

    if (!report.report) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <Clock className="h-3 w-3 mr-1" />
          Not Submitted
        </Badge>
      )
    }

    if (status === "APPROVED") {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    } else if (status === "REJECTED") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">No reports found</h3>
        <p className="text-muted-foreground">There are no reports matching your current filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 h-[400px] overflow-y-scroll">
        {reports.map((report, index) => {
          // Check if this report has been updated
          const updatedReport = updatedReports[report.id]
          const status = updatedReport?.status || report.report?.academic_advisor_status || "NOT_SUBMITTED"

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden border hover:shadow-md transition-shadow duration-300">
                <div
                  className={`p-4 ${
                    status === "APPROVED"
                      ? "bg-gradient-to-r from-green-600 to-green-700"
                      : status === "REJECTED"
                        ? "bg-gradient-to-r from-red-600 to-red-700"
                        : "bg-gradient-to-r from-amber-500 to-amber-600"
                  } text-white`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">
                      {report.report_type === "WEEKLY_REPORT" ? `Week ${report.week} Report` : "Final Report"}
                    </h3>
                    {getStatusBadge(report)}
                  </div>
                  <p className="text-sm mt-1 text-white/80">
                    {formatDate(report.start_date?.toString() ?? '')} - {formatDate(report.end_date?.toString() ?? '')}
                  </p>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Student:</span>
                      <span className="font-medium">{report.user_nrp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{report.report_type === "WEEKLY_REPORT" ? "Weekly" : "Final"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Advisor:</span>
                      <span className="font-medium truncate max-w-[150px]">{report.academic_advisor_email}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between  items-center">
                    <div>
                      {report.report ? (
                        <Badge variant="secondary" className="text-xs bg-gray-300">
                          <FileText className="h-3 w-3 mr-1 " />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-gray-300">
                          <Clock className="h-3 w-3 mr-1" />
                          Awaiting
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedReport(report)}
                      disabled={!report.report}
                      variant={report.report ? "default" : "outline"}
                      className="bg-blue-500 text-white"
                    >
                      {report.report ? "Review" : "Not Submitted"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {selectedReport && (
        <ReportPreview
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}
