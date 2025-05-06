"use client"

import { motion } from "framer-motion"
import { FileQuestion } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <FileQuestion className="h-8 w-8 text-slate-400" />
      </motion.div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">{description}</p>
    </motion.div>
  )
}
