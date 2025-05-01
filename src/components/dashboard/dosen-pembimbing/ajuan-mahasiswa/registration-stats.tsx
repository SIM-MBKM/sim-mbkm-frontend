"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, Users, Sparkles } from "lucide-react"

interface RegistrationStatsProps {
  stats: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
}

export function RegistrationStats({ stats }: RegistrationStatsProps) {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  // Calculate percentage distributions
  const totalRequests = stats.total > 0 ? stats.total : 1
  const pendingPercentage = Math.round((stats.pending / totalRequests) * 100)
  const approvedPercentage = Math.round((stats.approved / totalRequests) * 100)
  const rejectedPercentage = Math.round((stats.rejected / totalRequests) * 100)

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl border bg-background/70 backdrop-blur shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 opacity-50 dark:from-indigo-950/30 dark:to-indigo-900/20"></div>
        <div className="relative flex flex-col p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
              <Users className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
            </div>
            <span className="font-medium text-indigo-700 dark:text-indigo-400">Total</span>
          </div>
          <div className="flex items-end gap-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-3xl font-bold"
            >
              {stats.total}
            </motion.span>
            <span className="text-sm text-muted-foreground pb-1">registrations</span>
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="text-xs text-muted-foreground">
              <span className="inline-block">
                <Sparkles className="inline-block h-3 w-3 mr-1" />
                All time requests
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl border bg-background/70 backdrop-blur shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-yellow-100/30 opacity-50 dark:from-yellow-950/30 dark:to-yellow-900/20"></div>
        <div className="relative flex flex-col p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/40">
              <Clock className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
            </div>
            <span className="font-medium text-yellow-700 dark:text-yellow-400">Pending</span>
          </div>
          <div className="flex items-end gap-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-3xl font-bold"
            >
              {stats.pending}
            </motion.span>
            <span className="text-sm text-muted-foreground pb-1">requests</span>
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="w-full bg-yellow-100 dark:bg-yellow-900/20 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pendingPercentage}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-yellow-500 h-1.5 rounded-full"
              ></motion.div>
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 flex justify-between">
              <span>{pendingPercentage}% of total</span>
              <span>{stats.pending} pending</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl border bg-background/70 backdrop-blur shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-green-100/30 opacity-50 dark:from-green-950/30 dark:to-green-900/20"></div>
        <div className="relative flex flex-col p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
              <CheckCircle className="h-5 w-5 text-green-700 dark:text-green-400" />
            </div>
            <span className="font-medium text-green-700 dark:text-green-400">Approved</span>
          </div>
          <div className="flex items-end gap-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-3xl font-bold"
            >
              {stats.approved}
            </motion.span>
            <span className="text-sm text-muted-foreground pb-1">approvals</span>
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${approvedPercentage}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-green-500 h-1.5 rounded-full"
              ></motion.div>
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 flex justify-between">
              <span>{approvedPercentage}% of total</span>
              <span>{stats.approved} approved</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl border bg-background/70 backdrop-blur shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-red-100/30 opacity-50 dark:from-red-950/30 dark:to-red-900/20"></div>
        <div className="relative flex flex-col p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
              <XCircle className="h-5 w-5 text-red-700 dark:text-red-400" />
            </div>
            <span className="font-medium text-red-700 dark:text-red-400">Rejected</span>
          </div>
          <div className="flex items-end gap-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-3xl font-bold"
            >
              {stats.rejected}
            </motion.span>
            <span className="text-sm text-muted-foreground pb-1">rejections</span>
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="w-full bg-red-100 dark:bg-red-900/20 rounded-full h-1.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${rejectedPercentage}%` }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="bg-red-500 h-1.5 rounded-full"
              ></motion.div>
            </div>
            <div className="text-xs text-muted-foreground mt-1.5 flex justify-between">
              <span>{rejectedPercentage}% of total</span>
              <span>{stats.rejected} rejected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
