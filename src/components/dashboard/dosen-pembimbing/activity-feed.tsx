"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Info, Calendar, Building, ChevronDown, ChevronUp, ListCheck, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetNotificationByReceiverEmail } from "@/lib/api/hooks/use-query-hooks"
import { useAppSelector } from "@/lib/redux/hooks"
import { RootState } from "@/lib/redux/store"
import Link from "next/link"
import { Notification } from "@/lib/api/services/notification-service"

interface Activity {
  id: string
  date: string
  title: string
  description: string
  link?: string
  icon: "info" | "calendar" | "company" | "notification" | "task" | "achievement"
  sender_name?: string
  type?: string
}

interface ActivityFeedProps {
  activities?: Activity[]
}

export function ActivityFeed({ activities: propActivities }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState(true)
  const [visibleActivities, setVisibleActivities] = useState(5)
  
  const user = useAppSelector((state: RootState) => state.userData.user)
  const { data: notificationsData, isLoading } = useGetNotificationByReceiverEmail(
    user?.email || "", 
    1, 
    3
  )

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "calendar":
        return <Calendar className="h-5 w-5 text-amber-500" />
      case "company":
        return <Building className="h-5 w-5 text-green-500" />
      case "task":
        return <ListCheck className="h-5 w-5 text-amber-500" />
      case "achievement":
        return <Award className="h-5 w-5 text-purple-500" />
      case "notification":
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Map notifications to activities format
  const mapNotificationToActivity = (notification: Notification): Activity => {
    // Format date to more readable format
    const date = new Date(notification.created_at)
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    // Determine icon based on notification type
    let iconType: "info" | "calendar" | "company" | "notification" | "task" | "achievement" = "notification"
    
    if (notification.type) {
      switch (notification.type.toLowerCase()) {
        case "registration":
          iconType = "info"
          break
        case "activity":
        case "create activity":
          iconType = "task"
          break
        case "approval":
          iconType = "calendar"
          break
        case "achievement":
          iconType = "achievement"
          break
        case "company":
          iconType = "company"
          break
        default:
          iconType = "notification"
      }
    }

    return {
      id: notification.id,
      date: formattedDate,
      title: notification.message,
      description: `Dari: ${notification.sender_name}`,
      link: "/dashboard/dosen-pembimbing/notifications",
      icon: iconType,
      sender_name: notification.sender_name,
      type: notification.type
    }
  }

  // Use notifications data if available, otherwise use prop activities
  const activities = notificationsData?.data 
    ? notificationsData.data.map(mapNotificationToActivity)
    : propActivities || []

  // Determine how many activities to show
  const displayActivities = activities.slice(0, visibleActivities)
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-bold">Aktivitas Terbaru</CardTitle>
        <div className="flex gap-2">
          <Link href="/dashboard/dosen-pembimbing/notifications">
            <Button variant="outline" size="sm" className="h-8">
              Lihat Semua
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 w-8 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
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
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayActivities.length > 0 ? (
                    displayActivities.map((activity, index) => (
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
                          <div className="flex justify-between">
                            <p className="text-sm text-muted-foreground">{activity.date}</p>
                            {activity.type && (
                              <span className="text-xs capitalize px-2 py-0.5 bg-gray-100 rounded-full">
                                {activity.type}
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-sm mt-1">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          {activity.link && (
                            <a href={activity.link} className="text-sm text-primary hover:underline mt-2 inline-block">
                              Lihat detail →
                            </a>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      Tidak ada notifikasi terbaru
                    </div>
                  )}

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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
