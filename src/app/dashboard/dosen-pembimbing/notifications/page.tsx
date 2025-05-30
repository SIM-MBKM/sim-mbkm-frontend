"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useGetNotificationByReceiverEmail } from "@/lib/api/hooks/use-query-hooks"
import { useAppSelector } from "@/lib/redux/hooks"
import { RootState } from "@/lib/redux/store"
import { Notification } from "@/lib/api/services/notification-service"
import { 
  Bell, 
  Info, 
  ListCheck, 
  Calendar, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  // Building
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

  // Determine icon based on notification type
  let icon = <Bell className="h-5 w-5" />
  let typeColor = "text-gray-500 bg-gray-50"
  let borderColor = "border-l-gray-500"
  let typeTextColor = "text-gray-700"
  let typeBgColor = "bg-gray-50"
  
  if (notification.type) {
    switch (notification.type.toLowerCase()) {
      case "register":
        icon = <Info className="h-5 w-5" />
        typeColor = "text-blue-500 bg-blue-50"
        borderColor = "border-l-blue-500"
        typeTextColor = "text-blue-700"
        typeBgColor = "bg-blue-50"
        break
      case "new activity":
      case "create activity":
        icon = <ListCheck className="h-5 w-5" />
        typeColor = "text-amber-500 bg-amber-50"
        borderColor = "border-l-amber-500"
        typeTextColor = "text-amber-700"
        typeBgColor = "bg-amber-50"
        break
      case "approval registration":
        icon = <Calendar className="h-5 w-5" />
        typeColor = "text-indigo-500 bg-indigo-50"
        borderColor = "border-l-indigo-500"
        typeTextColor = "text-indigo-700"
        typeBgColor = "bg-indigo-50"
        break
      case "approval report":
        icon = <Award className="h-5 w-5" />
        typeColor = "text-purple-500 bg-purple-50"
        borderColor = "border-l-purple-500"
        typeTextColor = "text-purple-700"
        typeBgColor = "bg-purple-50"
        break
      default:
        icon = <Bell className="h-5 w-5" />
        typeColor = "text-gray-500 bg-gray-50"
        borderColor = "border-l-gray-500"
        typeTextColor = "text-gray-700"
        typeBgColor = "bg-gray-50"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className={`border-l-4 ${borderColor} hover:shadow-md transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${typeColor} flex-shrink-0`}>
              {icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-500">{formattedDate}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeBgColor} ${typeTextColor} capitalize`}>
                    {notification.type}
                  </span>
                </div>
              </div>
              
              <div className="text-sm font-medium text-gray-600 mb-1">
                Dari: {notification.sender_name}
              </div>
              
              <p className="text-gray-700">
                {notification.message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(5)
  
  const user = useAppSelector((state: RootState) => state.userData.user)
  const { data: notificationsData, isLoading } = useGetNotificationByReceiverEmail(
    user?.email || "", 
    currentPage, 
    limit
  )
  
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

  return (
    <DashboardLayout>
      <div className="py-6 mt-15">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Notifikasi</CardTitle>
            <CardDescription>
              Semua notifikasi yang masuk untuk Anda
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ))
          ) : notifications.length > 0 ? (
            // Notification list
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            // Empty state
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
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
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
              </Button>
              
              <div className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
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