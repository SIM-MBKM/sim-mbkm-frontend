"use client"

import { motion } from "framer-motion"
import { Users, FileText } from "lucide-react"

interface SyllabusStatsProps {
  stats: {
    totalNrps: number
    totalSyllabuses: number
  }
}

export function SyllabusStats({ stats }: SyllabusStatsProps) {
  const { totalNrps, totalSyllabuses } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-green-600/90 to-green-700 rounded-lg p-6 text-white shadow-lg"
      >
        <div className="flex items-center">
          <div className="bg-white/20 p-3 rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium opacity-90">Total Students</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{totalNrps}</span>
              <span className="ml-2 text-sm opacity-75">NRPs</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-teal-500/90 to-teal-600 rounded-lg p-6 text-white shadow-lg"
      >
        <div className="flex items-center">
          <div className="bg-white/20 p-3 rounded-full">
            <FileText className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium opacity-90">Total Syllabuses</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{totalSyllabuses}</span>
              <span className="ml-2 text-sm opacity-75">documents</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 