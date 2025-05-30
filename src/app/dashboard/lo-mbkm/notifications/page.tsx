"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useGetAllNotifications } from "@/lib/api/hooks/use-query-hooks"
// import { useAppSelector } from "@/lib/redux/hooks"
// import { RootState } from "@/lib/redux/store"
import { Notification } from "@/lib/api/services/notification-service"
import { 
  Bell, 
  // Info, 
  ListCheck, 
  Calendar, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Building,
  Clock,
  RefreshCw,
  User,
  Mail,
  Star
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

const NotificationItem = ({ notification }: { notification: Notification }) => {
  // Format date to more readable format
  const date = new Date(notification.created_at)
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Format relative time
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.round(diffMs / 60000)
  const diffHours = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)
  
  let timeAgo = ""
  if (diffMins < 60) {
    timeAgo = `${diffMins} menit yang lalu`
  } else if (diffHours < 24) {
    timeAgo = `${diffHours} jam yang lalu`
  } else {
    timeAgo = `${diffDays} hari yang lalu`
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

  // Determine badge type and color
  let badgeColor = "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  let icon = <Bell className="h-3.5 w-3.5" />
  
  if (notification.type) {
    switch (notification.type.toLowerCase()) {
      case "register":
        icon = <Star className="h-3.5 w-3.5" />
        badgeColor = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white"
        break
      case "new activity":
        icon = <ListCheck className="h-3.5 w-3.5" />
        badgeColor = "bg-gradient-to-r from-blue-400 to-cyan-500 text-white"
        break
      case "approval registration":
        icon = <Calendar className="h-3.5 w-3.5" />
        badgeColor = "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
        break
      case "approval report":
        icon = <Award className="h-3.5 w-3.5" />
        badgeColor = "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
        break
      default:
        icon = <Building className="h-3.5 w-3.5" />
        badgeColor = "bg-gradient-to-r from-rose-400 to-red-500 text-white"
        break
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="rounded-lg transition-all duration-300 overflow-hidden border border-neutral-200 hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start p-4">
        <Avatar className="h-12 w-12 border-2 border-gray-200 flex-shrink-0 shadow-sm mr-4">
          <AvatarImage src="/placeholder.svg" alt={notification.sender_name} />
          <AvatarFallback className={colors[colorIndex]}>
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-gray-400" />
              {notification.sender_name}
            </p>
            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3 text-gray-400" />
              {timeAgo}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 truncate flex items-center gap-1 mb-2">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            {notification.sender_email}
          </p>
          
          <p className="text-sm text-gray-700 mb-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge
              className={`text-xs h-6 max-w-[140px] whitespace-normal transition-colors px-3 py-0.5 flex items-center gap-1 ${badgeColor}`}
            >
              {icon}
              <span className="truncate capitalize">{notification.type || "notification"}</span>
            </Badge>
            
            <span className="text-xs text-gray-500">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const { data: notificationsData, isLoading, refetch } = useGetAllNotifications(currentPage, limit)
  
  const totalPages = notificationsData?.total_pages || 1
  const notifications = notificationsData?.data || []
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleRefresh = () => {
    setIsRefreshing(true)
    refetch().finally(() => {
      setTimeout(() => setIsRefreshing(false), 1000)
    })
  }

  return (
    <DashboardLayout>
      <div className="py-6 mt-15">
        <Card className="mb-6 border-2 border-neutral-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-white bg-white/20 p-1.5 rounded-full"
              >
                <Bell className="h-5 w-5" />
              </motion.div>
              Semua Notifikasi
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/20 text-white transition-colors"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-blue-600 font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Daftar semua notifikasi
              </p>
              <p className="text-sm text-gray-500">
                Total: {notificationsData?.data.length || 0} notifikasi
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoading || isRefreshing ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
            ))
          ) : notifications.length > 0 ? (
            // Notification list
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            // Empty state
            <Card className="border-2 border-neutral-200">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700">Tidak ada notifikasi</h3>
                <p className="text-gray-500">Anda belum memiliki notifikasi saat ini</p>
              </CardContent>
            </Card>
          )}
          
          {/* Pagination */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
              </Button>
              
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Halaman {currentPage} dari {totalPages}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 