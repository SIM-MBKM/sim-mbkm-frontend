"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, FileText, Maximize2, Minimize2, CheckCircle, XCircle, Clock, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format, parseISO } from "date-fns"
import { useToast } from "@/lib/api/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ReportSchedule } from "@/lib/api/services";

interface ReportPreviewProps {
  report: ReportSchedule
  onClose: () => void
  onStatusChange?: (reportId: string, status: string, feedback: string) => void
}

export function ReportPreview({ report, onClose, onStatusChange }: ReportPreviewProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<string>(report.report?.academic_advisor_status || "PENDING")
  const [feedback, setFeedback] = useState<string>(report.report?.feedback || "")
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMMM d, yyyy")
    } catch  {
      return dateString
    }
  }

  const getStatusIcon = (statusValue: string) => {
    if (!report.report) {
      return <Clock className="h-5 w-5 text-amber-500" />
    }

    if (statusValue === "APPROVED") {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (statusValue === "REJECTED") {
      return <XCircle className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  const handleSubmit = async () => {
    if (!report.report) {
      toast({
        title: "Error",
        description: "Cannot update status for a report that hasn't been submitted yet",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call the onStatusChange callback to update the parent component
      if (onStatusChange) {
        onStatusChange(report.id, status, feedback)
      }

      toast({
        title: "Success",
        description: `Report status updated to ${status}`,
      })

      setIsEditing(false)
    } catch {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`bg-background rounded-lg shadow-xl overflow-hidden ${
            fullscreen ? "fixed inset-4" : "w-full max-w-3xl"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b-1 border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">
                  {report.report_type === "WEEKLY_REPORT" ? `Week ${report.week} Report` : "Final Report"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(report.start_date)} - {formatDate(report.end_date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 flex flex-col items-center justify-center min-h-[400px] max-h-[80vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <motion.div
                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                </div>
                <p className="text-muted-foreground">Loading report...</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center mt-30">
                <div className="w-full max-w-lg p-8 rounded-lg border-gray-200 shadow-lg bg-muted/30">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold">{report.report?.title || "Untitled Report"}</h2>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-sm">
                      {getStatusIcon(report.report?.academic_advisor_status || "PENDING")}
                      <span>{report.report?.academic_advisor_status || "PENDING"}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Student NRP:</span>
                      <span className="font-medium">{report.user_nrp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Report Type:</span>
                      <span className="font-medium">{report.report_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Period:</span>
                      <span className="font-medium">
                        {formatDate(report.start_date)} - {formatDate(report.end_date)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Advisor:</span>
                      <span className="font-medium">{report.academic_advisor_email}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Report Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {report.report?.content ||
                        "No content available. Please download the report to view the full content."}
                    </p>
                  </div>

                  {report.report && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Review</h3>
                        {!isEditing && (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            Edit Review
                          </Button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <RadioGroup
                              id="status"
                              value={status}
                              onValueChange={setStatus}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="APPROVED" id="approved" />
                                <Label
                                  htmlFor="approved"
                                  className="flex items-center cursor-pointer text-green-600 dark:text-green-500"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approved
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="REJECTED" id="rejected" />
                                <Label
                                  htmlFor="rejected"
                                  className="flex items-center cursor-pointer text-red-600 dark:text-red-500"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejected
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PENDING" id="pending" />
                                <Label
                                  htmlFor="pending"
                                  className="flex items-center cursor-pointer text-amber-600 dark:text-amber-500"
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Pending
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                              id="feedback"
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Provide feedback on this report..."
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={submitting} className="bg-blue-500 text-white">
                              {submitting ? (
                                <>
                                  <motion.div
                                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Review
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Status:</span>
                            <span
                              className={`text-sm flex items-center gap-1 ${
                                status === "APPROVED"
                                  ? "text-green-600 dark:text-green-500"
                                  : status === "REJECTED"
                                    ? "text-red-600 dark:text-red-500"
                                    : "text-amber-600 dark:text-amber-500"
                              }`}
                            >
                              {getStatusIcon(status)}
                              {status}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Feedback:</span>
                            <p className="text-sm mt-1 p-2 bg-muted rounded-md">
                              {feedback || "No feedback provided yet."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button className="mt-6 bg-blue-500 text-white" onClick={() => console.log("Download report")}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
