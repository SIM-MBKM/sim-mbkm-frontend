"use client";

import { Bell, Info, ListCheck, Calendar, Award, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useGetNotificationByReceiverEmail } from "@/lib/api/hooks/use-query-hooks";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { Notification } from "@/lib/api/services/notification-service";
import { RootState } from "@/lib/redux/store";

// Activity item type
type ActivityItemProps = {
  activity: {
    id: string;
    type: string;
    icon: React.ReactNode;
    date: string;
    message: string;
    link?: string;
    linkText?: string;
    sender_name?: string;
  };
  isNew?: boolean;
}

// Activity item component
const ActivityItem = ({ activity, isNew = false }: ActivityItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get color based on activity type
  const getTypeColor = () => {
    switch (activity.type) {
      case "register":
        return "text-blue-500 bg-blue-50";
      case "approval report":
        return "text-indigo-500 bg-indigo-50";
      case "approval registration":
        return "text-amber-500 bg-amber-50";
      case "new activity":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`border-l-4 ${
        activity.type === "register" ? "border-l-blue-500" :
        activity.type === "approval report" ? "border-l-indigo-500" :
        activity.type === "approval registration" ? "border-l-amber-500" :
        activity.type === "new activity" ? "border-l-green-500" :
        "border-l-purple-500"
      } hover:shadow-md transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${getTypeColor()} flex-shrink-0`}>
              {activity.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-500">{activity.date}</div>
                  {isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Baru
                    </span>
                  )}
                </div>
                <div className="text-xs capitalize text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {activity.type}
                </div>
              </div>
              
              {activity.sender_name && (
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Dari: {activity.sender_name}
                </div>
              )}
              
              <p className="text-gray-700">
                {activity.message}{" "}
                {activity.link && (
                  <motion.a 
                    href={activity.link}
                    className="text-blue-600 hover:underline inline-flex items-center"
                    whileHover={{ x: 2 }}
                  >
                    {activity.linkText}
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0,
                        x: isHovered ? 0 : -5
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </motion.span>
                  </motion.a>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function ActivityFeed() {
  const user = useAppSelector((state: RootState) => state.userData.user);
  const { data: notificationsData, isLoading } = useGetNotificationByReceiverEmail(
    user?.email || "", 
    1, 
    5
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  // Map notifications to activities format
  const mapNotificationToActivity = (notification: Notification) => {
    // Format date to more readable format
    const date = new Date(notification.created_at);
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // Determine icon based on notification type
    let icon = <Bell className="h-5 w-5" />;
    let type = "REGISTER";
    
    if (notification.type) {
      switch (notification.type.toLowerCase()) {
        case "register":
          icon = <Info className="h-5 w-5" />;
          type = "register";
          break;
        case "approval report":
          icon = <ListCheck className="h-5 w-5" />;
          type = "approval report";
          break;
        case "approval registration":
          icon = <Calendar className="h-5 w-5" />;
          type = "approval registration";
          break;
        case "new activity":
          icon = <Award className="h-5 w-5" />;
          type = "new activity";
          break;
        default:
          icon = <Bell className="h-5 w-5" />;
          type = "register";
      }
    }

    return {
      id: notification.id,
      type: type,
      icon: icon,
      date: formattedDate,
      message: notification.message,
      link: "/dashboard/mahasiswa/notifications",
      linkText: "Lihat detail",
      sender_name: notification.sender_name
    };
  };

  const activities = notificationsData?.data 
    ? notificationsData.data.map(mapNotificationToActivity)
    : [];

  return (
    <div>
      <motion.div 
        className="flex items-center justify-between mb-4 md:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#003478]">Aktivitas Terbaru</h2>
        
        <Link href="/dashboard/mahasiswa/notifications">
          <motion.div 
            className="flex items-center text-blue-600 text-sm cursor-pointer"
            whileHover={{ x: 3 }}
          >
            Lihat semua
            <motion.span whileHover={{ x: 2 }}>
              <FileText className="ml-1 h-4 w-4" />
            </motion.span>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div 
        className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem 
              key={activity.id} 
              activity={activity} 
              isNew={index === 0}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            Tidak ada notifikasi terbaru
          </div>
        )}
      </motion.div>
    </div>
  );
}
