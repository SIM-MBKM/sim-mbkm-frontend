"use client"

import { motion } from "framer-motion"
import { StatsCards } from "./stats-cards"
import { RecentActivities } from "./recent-activities"
import { UserVisitChart } from "./user-visit-chart"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Badge } from "@/components/ui/badge"

export function Dashboard() {

  return (
          <div className="mb-6 mt-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold">Beranda</h1>
              <p className="text-muted-foreground">Ringkasan data sistem informasi MBKM</p>
            </motion.div>

            {/* Stats */}
            <StatsCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5"
              >
                <RecentActivities />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <UserVisitChart />
              </motion.div>
            </div>
          </div>
  )
}
