"use client"

import { motion } from "framer-motion"
import { Search, CheckCircle, XCircle, Clock } from "lucide-react"

interface EmptyStateProps {
  activeTab: string
}

export function EmptyState({ activeTab }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "pending":
        return {
          icon: Clock,
          title: "No Pending Registrations",
          description: "There are no registrations waiting for approval.",
          color: "text-yellow-500",
        }
      case "approved":
        return {
          icon: CheckCircle,
          title: "No Approved Registrations",
          description: "You haven't approved any registrations yet.",
          color: "text-green-500",
        }
      case "rejected":
        return {
          icon: XCircle,
          title: "No Rejected Registrations",
          description: "You haven't rejected any registrations.",
          color: "text-red-500",
        }
      default:
        return {
          icon: Search,
          title: "No Registrations Found",
          description: "There are no registrations matching your criteria.",
          color: "text-primary",
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-background/50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-4 rounded-full bg-background border mb-4 ${content.color}`}
      >
        <content.icon className="h-8 w-8" />
      </motion.div>
      <h3 className="text-lg font-medium mb-1">{content.title}</h3>
      <p className="text-muted-foreground text-center max-w-md">{content.description}</p>
    </motion.div>
  )
}
