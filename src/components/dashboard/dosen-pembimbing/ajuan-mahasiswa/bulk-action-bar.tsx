"use client"

import { motion } from "framer-motion"
import { Check, X, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkActionBarProps {
  selectedCount: number
  onApprove: () => void
  onReject: () => void
  onClear: () => void
  onSelectAll: () => void
  allSelected: boolean
}

export function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  onClear,
  onSelectAll,
  allSelected,
}: BulkActionBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-sm"
    >
      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onSelectAll}>
        {allSelected ? <CheckSquare className="h-4 w-4 mr-1" /> : <Square className="h-4 w-4 mr-1" />}
        {allSelected ? "Deselect All" : "Select All"}
      </Button>

      <div className="h-4 w-px bg-border mx-1"></div>

      <span className="text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
      </span>

      <div className="flex-1"></div>

      <Button
        variant="outline"
        size="sm"
        className="border-red-200 bg-red-100 hover:bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
        onClick={onReject}
      >
        <X className="h-4 w-4 mr-1" />
        Reject All
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="border-green-200 bg-green-100 hover:bg-green-200 text-green-800 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
        onClick={onApprove}
      >
        <Check className="h-4 w-4 mr-1" />
        Approve All
      </Button>

      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </motion.div>
  )
}
