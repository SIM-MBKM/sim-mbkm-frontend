"use client"

import { useState } from "react"
import { CalendarDays, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportCard } from "./report-card"

interface Report {
  id: string
  report_type: string
  week: number
  start_date: string
  end_date: string
  report: string | null
  status: string
  feedback: string | null
  report_schedule_id: string
  file_storage_id: string | null
}

interface ProgramReportsProps {
  programName: string
  reports: Report[]
  refetch?: () => void
}

export function ProgramReports({ programName, reports, refetch }: ProgramReportsProps) {
  const [activeTab, setActiveTab] = useState("weekly")

  const weeklyReports = reports.filter((report) => report.report_type === "WEEKLY_REPORT")
  const finalReports = reports.filter((report) => report.report_type === "FINAL_REPORT")

  // Sort weekly reports by week number
  const sortedWeeklyReports = [...weeklyReports].sort((a, b) => a.week - b.week)

  return (
    <Card>
      <CardHeader className="bg-[#f8fafc] border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#003478]"></span>
          {programName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 h-150 overflow-scroll">
        <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-100 p-1">
            <TabsTrigger value="weekly" className="flex items-center gap-2 data-[state=active]:bg-white">
              <CalendarDays className="h-4 w-4" />
              <span>Laporan Mingguan</span>
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{weeklyReports.length}</span>
            </TabsTrigger>
            <TabsTrigger value="final" className="flex items-center gap-2 data-[state=active]:bg-white">
              <FileText className="h-4 w-4" />
              <span>Laporan Akhir</span>
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">{finalReports.length}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="space-y-4">
              {sortedWeeklyReports.length > 0 ? (
                sortedWeeklyReports.map((report) => <ReportCard key={report.id} report={report} refetch={refetch} />)
              ) : (
                <div className="text-center p-8 text-gray-500">Tidak ada laporan mingguan untuk program ini</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="final">
            <div className="space-y-4">
              {finalReports.length > 0 ? (
                finalReports.map((report) => <ReportCard key={report.id} report={report} refetch={refetch} />)
              ) : (
                <div className="text-center p-8 text-gray-500">Tidak ada laporan akhir untuk program ini</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
