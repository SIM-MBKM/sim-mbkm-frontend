"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Eye, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Syllabus } from "@/lib/api/services";

interface SyllabusCardProps {
  syllabus: Syllabus
  onClick: () => void
}

export function SyllabusCard({ syllabus, onClick }: SyllabusCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-md overflow-hidden">
        <CardContent className="p-4 pt-6 pb-1 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 rounded-full p-2 shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-medium text-sm line-clamp-1" title={syllabus.title}>
              {syllabus.title}
            </h3>
            <Badge className="mt-2 px-2 py-1 font-normal text-xs bg-green-100 text-green-700 hover:bg-green-200" title={syllabus.activity_name}>
              {syllabus.activity_name}
            </Badge>
          </div>

          <motion.div
            className="mt-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-md"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="text-slate-500 dark:text-slate-400">NRP:</div>
              <div className="font-medium text-right line-clamp-1">{syllabus.user_nrp}</div>

              <div className="text-slate-500 dark:text-slate-400">Advisor:</div>
              <div className="font-medium text-right line-clamp-1" title={syllabus.academic_advisor_email}>
                {syllabus.academic_advisor_email.split("@")[0]}
              </div>

              <div className="text-slate-500 dark:text-slate-400">Reg ID:</div>
              <div className="font-medium text-right line-clamp-1" title={syllabus.registration_id}>
                {syllabus.registration_id.substring(0, 8)}...
              </div>
            </div>
          </motion.div>
        </CardContent>

        <div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
          <button 
            onClick={onClick}
            className="py-2.5 flex items-center justify-center text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
            Preview
          </button>
          <button 
            className="py-2.5 flex items-center justify-center text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-green-500" />
            Download
          </button>
        </div>
      </Card>
    </motion.div>
  )
} 