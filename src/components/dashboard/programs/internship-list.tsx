"use client"

import Image from "next/image"
import { Activity } from "@/lib/api/services/activity-service"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, Briefcase, CalendarClock, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface Internship {
  id: string;
  name: string;
  program_provider: string;
  location?: string;
  program_type?: string;
}

interface InternshipListProps {
  onSelect: (internship: Internship) => void;
  activities: { data: Activity[]; total: number; total_pages: number } | undefined;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InternshipList({ 
  onSelect, 
  activities, 
  isLoading, 
  error,
  currentPage,
  totalPages,
  onPageChange 
}: InternshipListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 h-24 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>Error loading activities: {error.message}</p>
      </div>
    );
  }

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div>
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <AnimatePresence>
          {activities && activities.data && activities.data.map((activity: Activity) => (
            <motion.div
              key={activity.id}
              layout
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setSelectedId(activity.id);
                onSelect({ ...activity, location: activity.location || "" });
              }}
              className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                selectedId === activity.id ? 'border-blue-400 shadow-md' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 relative">
                  <div className="bg-blue-50 rounded-lg p-1 w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/logo.png?height=60&width=60&text=Icon"
                      alt="Company Logo"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </div>
                  {selectedId === activity.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1"
                    >
                      <Star className="h-3 w-3 text-white" fill="white" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-800">{activity.name}</h3>
                    {activity.program_type && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {activity.program_type}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                      <span className="line-clamp-1">{activity.program_provider}</span>
                    </div>
                    
                    {activity.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                        <span className="line-clamp-1">{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.months_duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarClock className="h-3.5 w-3.5 mr-1 text-gray-500 flex-shrink-0" />
                        <span>{activity.months_duration} bulan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {activities && activities.data && activities.data.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-6"
        >
          <div className="text-sm text-gray-600">
            Showing {activities.data.length} of {activities.total} results
          </div>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={currentPage === 1 ? "opacity-50" : ""}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>
            
            <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-md">
              {currentPage} / {totalPages}
            </span>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "opacity-50" : ""}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {activities && activities.data && activities.data.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200 mt-4"
        >
          <p className="text-gray-500">Tidak ada program ditemukan</p>
          <p className="text-sm text-gray-400 mt-2">Coba ubah filter pencarian Anda</p>
        </motion.div>
      )}
    </div>
  );
}
