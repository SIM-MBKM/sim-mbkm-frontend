"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrograms } from "./program-provider"

interface MobileMenuProps {
  onClose: () => void
  selectedTab: "PENDING" | "APPROVED" | "REJECTED"
  onTabChange: (tab: "PENDING" | "APPROVED" | "REJECTED") => void
}

export function MobileMenu({ onClose, selectedTab, onTabChange }: MobileMenuProps) {
  const { programs } = usePrograms()

  // Count programs by status
  const pendingCount = programs.filter((p) => p.approval_status === "PENDING").length
  const approvedCount = programs.filter((p) => p.approval_status === "APPROVED").length
  const rejectedCount = programs.filter((p) => p.approval_status === "REJECTED").length

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-slate-800 w-3/4 max-w-xs h-full"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-white">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Status</h3>
          <div className="space-y-2">
            <MenuItem
              label="Pending Programs"
              count={pendingCount}
              isActive={selectedTab === "PENDING"}
              onClick={() => {
                onTabChange("PENDING")
                onClose()
              }}
            />
            <MenuItem
              label="Approved Programs"
              count={approvedCount}
              isActive={selectedTab === "APPROVED"}
              onClick={() => {
                onTabChange("APPROVED")
                onClose()
              }}
            />
            <MenuItem
              label="Rejected Programs"
              count={rejectedCount}
              isActive={selectedTab === "REJECTED"}
              onClick={() => {
                onTabChange("REJECTED")
                onClose()
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface MenuItemProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
}

function MenuItem({ label, count, isActive, onClick }: MenuItemProps) {
  return (
    <motion.button
      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
        isActive
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span>{label}</span>
      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          isActive
            ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
        }`}
      >
        {count}
      </span>
    </motion.button>
  )
}
