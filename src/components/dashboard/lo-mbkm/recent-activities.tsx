"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, RefreshCw, Clock, User, Mail, Star, Bell, Calendar, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useGetAllNotifications } from "@/lib/api/hooks/use-query-hooks"
// import { useAppSelector } from "@/lib/redux/hooks"
// import { RootState } from "@/lib/redux/store"
import { Notification } from "@/lib/api/services/notification-service"
import Link from "next/link"

// Enhanced random activity types with custom colors
const activityTypes = [
  { name: "register", icon: <Star className="h-3.5 w-3.5" />, color: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" },
  { name: "new activity", icon: <MessageCircle className="h-3.5 w-3.5" />, color: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white" },
  { name: "approval registration", icon: <User className="h-3.5 w-3.5" />, color: "bg-gradient-to-r from-purple-400 to-pink-500 text-white" },
  { name: "approval report", icon: <Calendar className="h-3.5 w-3.5" />, color: "bg-gradient-to-r from-green-400 to-emerald-500 text-white" },
]

export function RecentActivities() {
  const [expanded, setExpanded] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  
  // const user = useAppSelector((state: RootState) => state.userData.user)
  const { data: notificationsData, isLoading, refetch } = useGetAllNotifications(1, 5)

  const refresh = () => {
    setRefreshing(true)
    refetch().then(() => {
      setTimeout(() => setRefreshing(false), 1000)
    })
  }

  // Map notification to activity format
  const mapNotificationToActivity = (notification: Notification) => {
    // Format date to relative time
    const date = new Date(notification.created_at)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    
    let timeAgo = ""
    if (diffMins < 60) {
      timeAgo = `${diffMins} menit yang lalu`
    } else {
      timeAgo = `${diffHours} jam yang lalu`
    }

    // Determine activity type and color
    const activityType = notification.type?.toLowerCase() || "notification"
    const typeInfo = activityTypes.find(t => t.name === activityType) || {
      name: "notification",
      icon: <Bell className="h-3.5 w-3.5" />,
      color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }

    // Get initials from sender name
    const nameParts = notification.sender_name.split(' ')
    const initials = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : notification.sender_name.substring(0, 2).toUpperCase()

    // Generate a consistent color based on the sender name
    const colors = [
      "bg-gradient-to-r from-pink-500 to-rose-500",
      "bg-gradient-to-r from-blue-500 to-indigo-500",
      "bg-gradient-to-r from-purple-500 to-violet-500",
      "bg-gradient-to-r from-green-500 to-teal-500",
      "bg-gradient-to-r from-amber-500 to-orange-500"
    ]
    const colorIndex = notification.sender_name.charCodeAt(0) % colors.length
    
    return {
      id: notification.id,
      name: notification.sender_name,
      email: notification.sender_email,
      activity: notification.type || "notification",
      message: notification.message,
      icon: typeInfo.icon,
      badgeColor: typeInfo.color,
      time: timeAgo,
      avatar: "/placeholder.svg?height=32&width=32",
      initials: initials,
      color: colors[colorIndex]
    }
  }

  // Map notifications to activities
  const activities = notificationsData?.data 
    ? notificationsData.data.map(mapNotificationToActivity)
    : []

  // Filter activities based on selected tab
  const filteredActivities = activeTab === "all" 
    ? activities 
    : activities.filter(activity => activity.activity.toLowerCase() === activeTab.toLowerCase())

  return (
    <Card className="h-full overflow-hidden border-2 border-neutral-200 transition-all duration-300 hover:border-blue-400 shadow-sm hover:shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: refreshing ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-white bg-white/20 p-1.5 rounded-full"
          >
            <Bell className="h-5 w-5" />
          </motion.div>
          Aktivitas Terbaru
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/20 text-white transition-colors"
            onClick={refresh}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/20 text-white transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Activity type tabs */}
        <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-neutral-200 overflow-x-auto no-scrollbar">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setActiveTab("all")}
            className={`text-xs rounded-full px-2 py-0.5 h-7 min-w-fit ${activeTab === "all" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
          >
            Semua
          </Button>
          {activityTypes.map((type, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(type.name)}
              className={`text-xs rounded-full px-2 py-0.5 h-7 min-w-fit flex items-center gap-1 
                ${activeTab === type.name ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}
              title={type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            >
              {type.icon}
              <span className="truncate max-w-[70px] md:max-w-[100px]" title={type.name.charAt(0).toUpperCase() + type.name.slice(1)}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-sm text-blue-600 font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Kegiatan terakhir pada website
          </p>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white"
            >
              {isLoading ? (
                <div className="p-3 space-y-3">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : filteredActivities.length > 0 ? (
                <div className="p-3 space-y-3">
                  {filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="relative rounded-lg transition-all duration-300 overflow-hidden"
                      style={{
                        background: hoveredItem === activity.id 
                          ? "linear-gradient(to right, rgba(239, 246, 255, 0.6), rgba(219, 234, 254, 0.4))" 
                          : "white",
                        boxShadow: hoveredItem === activity.id ? "0 4px 12px rgba(59, 130, 246, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                      }}
                      onMouseEnter={() => setHoveredItem(activity.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Animated sidebar accent */}
                      {hoveredItem === activity.id && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "100%" }}
                          className="absolute left-0 top-0 w-1 rounded-l-lg"
                          style={{ background: activity.color }}
                        />
                      )}
                      
                      <div className="flex items-center gap-4 p-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="relative"
                        >
                          <Avatar className={`h-12 w-12 border-2 flex-shrink-0 shadow-sm ${hoveredItem === activity.id ? "border-blue-300" : "border-gray-200"}`}>
                            <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
                            <AvatarFallback className={activity.color}>
                              {activity.initials}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Status indicator */}
                          <motion.div 
                            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" 
                            initial={{ scale: 0 }}
                            animate={{ scale: hoveredItem === activity.id ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium flex items-center gap-1">
                              <User
                                className={`h-3.5 w-3.5 ${hoveredItem === activity.id ? "text-blue-600" : "text-gray-400"}`}
                              />
                              {activity.name}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                            <Mail
                              className={`h-3.5 w-3.5 ${hoveredItem === activity.id ? "text-blue-600" : "text-gray-400"}`}
                            />
                            {activity.email}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            <Badge
                              className={`text-xs h-6 max-w-[140px] whitespace-normal transition-colors px-3 py-0.5 flex items-center gap-1 ${activity.badgeColor}`}
                            >
                              {activity.icon}
                              <span className="truncate">{activity.activity}</span>
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full ml-auto">
                              <Clock
                                className={`h-3 w-3 ${hoveredItem === activity.id ? "text-blue-600" : "text-gray-400"}`}
                              />
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* View details action that appears on hover */}
                      {hoveredItem === activity.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-t border-neutral-100 bg-white bg-opacity-80 backdrop-blur-sm p-2 flex justify-end"
                        >
                          <p className="text-sm text-gray-600 flex-1 px-2 line-clamp-1">{activity.message}</p>
                          <Link href="/dashboard/lo-mbkm/notifications">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-3"
                            >
                              Lihat Detail
                            </Button>
                          </Link>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <Bell className="h-10 w-10 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">Tidak ada notifikasi</h3>
                  <p className="text-sm text-gray-500">Belum ada aktivitas terbaru saat ini</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer with stats */}
        <div className="border-t border-neutral-200 p-3 bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {filteredActivities.length} aktivitas terlihat
          </div>
          <Link href="/dashboard/lo-mbkm/notifications">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-3"
            >
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
