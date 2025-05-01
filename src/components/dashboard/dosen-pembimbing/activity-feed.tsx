"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Info, Calendar, Building, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  date: string
  title: string
  description: string
  link?: string
  icon: "info" | "calendar" | "company"
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState(true)
  const [visibleActivities, setVisibleActivities] = useState(3)

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "calendar":
        return <Calendar className="h-5 w-5 text-amber-500" />
      case "company":
        return <Building className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-bold">Aktivitas Terbaru</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 w-8 p-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {activities.slice(0, visibleActivities).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                        {getIcon(activity.icon)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                      <h4 className="font-medium text-sm mt-1">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      {activity.link && (
                        <a href={activity.link} className="text-sm text-primary hover:underline mt-2 inline-block">
                          Lihat detail →
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}

                {activities.length > visibleActivities && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <Button variant="ghost" size="sm" onClick={() => setVisibleActivities(activities.length)}>
                      Lihat semua aktivitas
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
