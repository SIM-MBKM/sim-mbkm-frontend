"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react"

interface ReportStatsProps {
  stats: {
    total: number
    submitted: number
    pending: number
    approved: number
    rejected: number
    completion: number
  }
}

export function ReportStats({ stats }: ReportStatsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Report Completion</h3>
              <div className="flex items-center gap-2 mb-2">
                <Progress value={stats.completion} className="h-2" />
                <span className="text-sm font-medium">{stats.completion}%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.submitted} of {stats.total} reports submitted
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total</span>
                </div>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>

              <div className="flex flex-col p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="text-2xl font-bold">{stats.pending}</span>
              </div>

              <div className="flex flex-col p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <span className="text-2xl font-bold">{stats.approved}</span>
              </div>

              <div className="flex flex-col p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <span className="text-2xl font-bold">{stats.rejected}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
