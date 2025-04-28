import { Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReportProgressProps {
  totalReports: number
  submittedReports: number
  pendingReports: number
  notSubmittedReports: number
  percentage: number
  pendingPercentage: number
  notSubmittedPercentage: number
}

export function ReportProgress({ 
  totalReports, 
  submittedReports,
  percentage,
  pendingPercentage,
  notSubmittedPercentage
}: ReportProgressProps) {
  const statusColors = {
    low: "bg-red-500",
    medium: "bg-yellow-500",
    high: "bg-green-500",
  }

  const getStatusColor = () => {
    if (percentage < 30) return statusColors.low
    if (percentage < 70) return statusColors.medium
    return statusColors.high
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-medium mb-2">Progress Laporan</h3>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {submittedReports} dari {totalReports} laporan telah disubmit
              </span>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 bg-gray-400" />

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex items-center">
                <Circle fill="#ef4444" stroke="#ef4444" className="h-3 w-3 mr-2" />
                <span className="text-xs text-gray-600">Belum dikerjakan ({notSubmittedPercentage}%)</span>
              </div>
              <div className="flex items-center">
                <Circle fill="#eab308" stroke="#eab308" className="h-3 w-3 mr-2" />
                <span className="text-xs text-gray-600">Sedang dikerjakan ({pendingPercentage}%)</span>
              </div>
              <div className="flex items-center">
                <Circle fill="#22c55e" stroke="#22c55e" className="h-3 w-3 mr-2" />
                <span className="text-xs text-gray-600">Selesai ({percentage}%)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${percentage * 2.51} 251`}
                  strokeDashoffset="-62.75"
                  className={getStatusColor()}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
