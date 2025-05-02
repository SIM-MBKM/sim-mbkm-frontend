"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"
import { CheckCircle, Clock, FileText, XCircle, Check, X, CheckSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ReportPreview } from "./report-preview"
// import { toast } from "react-toastify"
import { ReportSchedule } from "@/lib/api/services";

interface BulkActionBarProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onClear: () => void
  onSelectAll: () => void
  allSelected: boolean
  isProcessing: boolean
}

function BulkActionBar({ 
  selectedCount, 
  onApprove, 
  onReject, 
  onClear, 
  onSelectAll, 
  allSelected,
  isProcessing
}: BulkActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-primary-50 border border-primary-200 dark:bg-primary-950/30 dark:border-primary-800/60">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          className="h-5 w-5 data-[state=checked]:bg-primary"
        />
        <div className="flex flex-col">
          <span className="font-medium">{selectedCount} report{selectedCount !== 1 ? 's' : ''} selected</span>
          <span className="text-xs text-muted-foreground">Select reports to approve or reject in bulk</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-muted-foreground"
          onClick={onClear}
          disabled={isProcessing}
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-red-200 bg-red-100 hover:bg-red-200 text-red-800"
          onClick={onReject}
          disabled={isProcessing}
        >
          <X className="h-4 w-4 mr-1" />
          Reject All
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-green-200 bg-green-100 hover:bg-green-200 text-green-800"
          onClick={onApprove}
          disabled={isProcessing}
        >
          <Check className="h-4 w-4 mr-1" />
          Approve All
        </Button>
      </div>
    </div>
  )
}

interface ReportCardsProps {
  reports: ReportSchedule[]
  updatedReports?: Record<string, { status: string; feedback: string }>
  onStatusChange?: (reportId: string, status: string, feedback: string) => void
  onBulkStatusChange?: (reportIds: string[], status: string, feedback: string) => void
  isProcessing?: boolean
}

export function ReportCards({ 
  reports, 
  updatedReports = {}, 
  onStatusChange,
  onBulkStatusChange,
  isProcessing = false
}: ReportCardsProps) {
  const [selectedReport, setSelectedReport] = useState<ReportSchedule | null>(null)
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([])

  // Only include reports that have been submitted for selection
  const submittedReports = reports.filter(report => report.report !== null)
  // Extract all valid report IDs (report.report.id) from submitted reports
  const allReportIds = submittedReports
    .filter(report => report.report?.id) // Ensure the report ID exists
    .map(report => report.report!.id)

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

  const handleSelectAll = () => {
    if (selectedReportIds.length === allReportIds.length) {
      setSelectedReportIds([])
    } else {
      setSelectedReportIds([...allReportIds])
    }
  }

  const handleToggleSelect = (reportId: string) => {
    setSelectedReportIds(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId) 
        : [...prev, reportId]
    )
  }

  const handleBulkApprove = () => {
    if (selectedReportIds.length === 0) return
    if (onBulkStatusChange) {
      onBulkStatusChange(selectedReportIds, "APPROVED", "Bulk approved")
      // toast.success(`${selectedReportIds.length} reports are being approved`, {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
    }
  }

  const handleBulkReject = () => {
    if (selectedReportIds.length === 0) return
    if (onBulkStatusChange) {
      onBulkStatusChange(selectedReportIds, "REJECTED", "Bulk rejected")
      // toast.error(`${selectedReportIds.length} reports are being rejected`, {
      //   position: "top-right",
      //   autoClose: 3000,
      // });
    }
  }

  const getStatusBadge = (report: ReportSchedule) => {
    // Check if this report has been updated
    const reportId = report.report?.id || '';
    const updatedReport = updatedReports[reportId]
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

  // Count submitted reports
  const submittedCount = submittedReports.length;

  return (
    <>
      {/* Select all button and submitted report count */}
      {submittedCount > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            <CheckSquare className="h-4 w-4" />
            {selectedReportIds.length === allReportIds.length && allReportIds.length > 0 
              ? "Deselect All" 
              : "Select All Submitted"}
            <Badge variant="secondary" className="ml-1">
              {submittedCount}
            </Badge>
          </Button>
          <span className="text-sm text-muted-foreground">
            {submittedCount} {submittedCount === 1 ? 'report' : 'reports'} available for approval
          </span>
        </div>
      )}

      <AnimatePresence>
        {selectedReportIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <BulkActionBar
              selectedCount={selectedReportIds.length}
              onApprove={handleBulkApprove}
              onReject={handleBulkReject}
              onClear={() => setSelectedReportIds([])}
              onSelectAll={handleSelectAll}
              allSelected={selectedReportIds.length === allReportIds.length && allReportIds.length > 0}
              isProcessing={isProcessing}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 h-[400px] overflow-y-scroll">
        {reports.map((report, index) => {
          // Get report ID from the report.report object (not the report schedule)
          const reportId = report.report?.id;
          console.log("REPORT ID", reportId)
          // Check if this report has been updated
          const updatedReport = reportId ? updatedReports[reportId] : undefined;
          const status = updatedReport?.status || report.report?.academic_advisor_status || "NOT_SUBMITTED"
          const canSelect = report.report !== null && reportId !== undefined;
          const isSelected = reportId ? selectedReportIds.includes(reportId) : false;

          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <Card className={`h-full overflow-hidden border hover:shadow-md transition-shadow duration-300 ${
                isSelected ? "border-primary" : ""
              }`}>
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
                    <div className="flex items-center gap-2">
                      {canSelect && reportId && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(reportId)}
                          className="h-4 w-4 border-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <h3 className="font-bold">
                        {report.report_type === "WEEKLY_REPORT" ? `Week ${report.week} Report` : "Final Report"}
                      </h3>
                    </div>
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
