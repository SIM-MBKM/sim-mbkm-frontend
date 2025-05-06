"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useProgramAPI } from "./program-dashboard"

interface ProgramStatsProps {
  selectedTab: "PENDING" | "APPROVED" | "REJECTED"
}

export function ProgramStats({ selectedTab }: ProgramStatsProps) {
  const { activitiesData, isLoading } = useProgramAPI()

  // Get counts from total_approval_data
  const getStatusCount = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    const countData = activitiesData?.total_approval_data?.find(
      item => item.approval_status === status
    );
    return countData?.total || 0;
  }

  // Count programs by status using total_approval_data
  const pendingCount = getStatusCount("PENDING");
  const approvedCount = getStatusCount("APPROVED");
  const rejectedCount = getStatusCount("REJECTED");

  // Total count
  const totalCount = pendingCount + approvedCount + rejectedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Pending Programs"
        value={isLoading ? "..." : pendingCount}
        icon={<Clock className="h-5 w-5" />}
        color="amber"
        isActive={selectedTab === "PENDING"}
        delay={0}
      />
      <StatCard
        title="Approved Programs"
        value={isLoading ? "..." : approvedCount}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
        isActive={selectedTab === "APPROVED"}
        delay={0.1}
      />
      <StatCard
        title="Rejected Programs"
        value={isLoading ? "..." : rejectedCount}
        icon={<XCircle className="h-5 w-5" />}
        color="red"
        isActive={selectedTab === "REJECTED"}
        delay={0.2}
      />
      <StatCard
        title="Total Programs"
        value={isLoading ? "..." : totalCount}
        icon={<AlertCircle className="h-5 w-5" />}
        color="blue"
        delay={0.3}
      />
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: "amber" | "green" | "red" | "blue"
  isActive?: boolean
  delay: number
}

function StatCard({ title, value, icon, color, isActive = false, delay }: StatCardProps) {
  const getColorClasses = () => {
    const baseClasses = "rounded-xl shadow-lg p-6 "

    if (isActive) {
      if (color === "amber") return baseClasses + "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
      if (color === "green") return baseClasses + "bg-gradient-to-br from-green-400 to-green-600 text-white"
      if (color === "red") return baseClasses + "bg-gradient-to-br from-red-400 to-red-600 text-white"
      if (color === "blue") return baseClasses + "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
    }

    if (color === "amber") return baseClasses + "bg-white dark:bg-slate-800 border-l-4 border-amber-500"
    if (color === "green") return baseClasses + "bg-white dark:bg-slate-800 border-l-4 border-green-500"
    if (color === "red") return baseClasses + "bg-white dark:bg-slate-800 border-l-4 border-red-500"
    if (color === "blue") return baseClasses + "bg-white dark:bg-slate-800 border-l-4 border-blue-500"

    return baseClasses + "bg-white dark:bg-slate-800"
  }

  const getIconClasses = () => {
    if (isActive) return "text-white/80"

    if (color === "amber") return "text-amber-500"
    if (color === "green") return "text-green-500"
    if (color === "red") return "text-red-500"
    if (color === "blue") return "text-blue-500"

    return ""
  }

  return (
    <motion.div
      className={getColorClasses()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>{title}</p>
          <h3 className={`text-3xl font-bold mt-1 ${isActive ? "text-white" : "text-slate-800 dark:text-white"}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-slate-700"}`}>
          <span className={getIconClasses()}>{icon}</span>
        </div>
      </div>
    </motion.div>
  )
}
