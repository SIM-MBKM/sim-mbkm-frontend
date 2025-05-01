"use client";

import { Bell, Info, ListCheck, Calendar, Award, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

// Sample activity data
const activities = [
  {
    id: 1,
    type: "notification",
    icon: <Bell className="h-5 w-5" />,
    date: "12 Sep 2024",
    message: "Mitra MBKM Magang PT Astra Indonesia telah ditambahkan.",
    link: "#",
    linkText: "disini"
  },
  {
    id: 2,
    type: "info",
    icon: <Info className="h-5 w-5" />,
    date: "10 Sep 2024",
    message: "Laporan mingguan anda telah diperiksa oleh pembimbing.",
    link: "/dashboard/mahasiswa/logbook",
    linkText: "Lihat feedback"
  },
  {
    id: 3,
    type: "task",
    icon: <ListCheck className="h-5 w-5" />,
    date: "8 Sep 2024",
    message: "Anda memiliki 3 tugas yang perlu diselesaikan minggu ini.",
    link: "/dashboard/mahasiswa/tasks",
    linkText: "Lihat tugas"
  },
  {
    id: 4,
    type: "event",
    icon: <Calendar className="h-5 w-5" />,
    date: "5 Sep 2024",
    message: "Monitoring dan evaluasi akan dilaksanakan pada 20 September 2024.",
    link: "/dashboard/mahasiswa/calendar",
    linkText: "Tambah ke kalender"
  },
  {
    id: 5,
    type: "achievement",
    icon: <Award className="h-5 w-5" />,
    date: "1 Sep 2024",
    message: "Anda telah menyelesaikan 75% dari program MBKM.",
    link: "/dashboard/mahasiswa/progress",
    linkText: "Lihat progress"
  }
];

// Activity item type
type ActivityItemProps = {
  activity: {
    id: number;
    type: string;
    icon: React.ReactNode;
    date: string;
    message: string;
    link?: string;
    linkText?: string;
  };
  isNew?: boolean;
}

// Activity item component
const ActivityItem = ({ activity, isNew = false }: ActivityItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get color based on activity type
  const getTypeColor = () => {
    switch (activity.type) {
      case "notification":
        return "text-blue-500 bg-blue-50";
      case "info":
        return "text-indigo-500 bg-indigo-50";
      case "task":
        return "text-amber-500 bg-amber-50";
      case "event":
        return "text-green-500 bg-green-50";
      case "achievement":
        return "text-purple-500 bg-purple-50";
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
        activity.type === "notification" ? "border-l-blue-500" :
        activity.type === "info" ? "border-l-indigo-500" :
        activity.type === "task" ? "border-l-amber-500" :
        activity.type === "event" ? "border-l-green-500" :
        "border-l-purple-500"
      } hover:shadow-md transition-all duration-200`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${getTypeColor()} flex-shrink-0`}>
              {activity.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-medium text-gray-500">{activity.date}</div>
                {isNew && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Baru
                  </span>
                )}
              </div>
              
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

  return (
    <div>
      <motion.div 
        className="flex items-center justify-between mb-4 md:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#003478]">Aktivitas Terbaru</h2>
        
        <motion.div 
          className="flex items-center text-blue-600 text-sm cursor-pointer"
          whileHover={{ x: 3 }}
        >
          Lihat semua
          <motion.span whileHover={{ x: 2 }}>
            <FileText className="ml-1 h-4 w-4" />
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div 
        className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.map((activity, index) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            isNew={index === 0}
          />
        ))}
      </motion.div>
    </div>
  );
}
