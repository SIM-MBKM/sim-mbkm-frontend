"use client";

import { FileText, AlertTriangle, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

// Sample data for review items
const reviewItems = [
  {
    id: 1,
    type: "logbook",
    title: "Logbook",
    description: "Harap melengkapi Logbook untuk minggu ini",
    status: "pending",
    dueDate: "30 Sep 2024",
    link: "/dashboard/mahasiswa/logbook"
  },
  {
    id: 2,
    type: "ekivalensi",
    title: "Ekivalensi",
    description: "Harap merevisi Ekivalensi mata kuliah anda",
    status: "rejected",
    dueDate: "28 Sep 2024",
    link: "/dashboard/mahasiswa/equivalence"
  },
  {
    id: 3,
    type: "laporan",
    title: "Laporan Akhir",
    description: "Laporan akhir telah diterima oleh pembimbing",
    status: "approved",
    link: "/dashboard/mahasiswa/reports"
  }
];

export function ReviewSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "pending":
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Diterima
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Ditolak
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Perlu Tindakan
          </span>
        );
    }
  };
  
  return (
    <motion.div 
      className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-[#003478]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Perlu Ditinjau
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="outline" size="sm" className="text-sm">
            Lihat Semua
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {reviewItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
            className="flex"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Card className={`border w-full overflow-hidden transition-all duration-300 ${
              item.status === "rejected" 
                ? "border-red-200 shadow-sm hover:shadow-md hover:border-red-300" 
                : item.status === "approved"
                ? "border-green-200 shadow-sm hover:shadow-md hover:border-green-300"
                : "border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300"
            }`}>
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className={`py-2 px-4 ${
                    item.status === "rejected" 
                      ? "bg-red-50" 
                      : item.status === "approved"
                      ? "bg-green-50"
                      : "bg-amber-50"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-800">{item.title}</div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full shrink-0 ${
                        item.status === "rejected" 
                          ? "bg-red-100" 
                          : item.status === "approved"
                          ? "bg-green-100"
                          : "bg-amber-100"
                      }`}>
                        {item.type === "logbook" ? (
                          <FileText className="h-5 w-5 text-gray-700" />
                        ) : (
                          getStatusIcon(item.status)
                        )}
                      </div>
                      
                      <div className="space-y-1 flex-1">
                        <p className="text-sm text-gray-700">{item.description}</p>
                        {item.dueDate && (
                          <p className="text-xs font-medium text-gray-500">
                            Tenggat: {item.dueDate}
                          </p>
                        )}
                        
                        <div className="pt-2">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                              opacity: hoveredId === item.id ? 1 : 0.9,
                              scale: hoveredId === item.id ? 1 : 0.95
                            }}
                          >
                            <Button 
                              variant="default" 
                              size="sm" 
                              className={`w-full text-white ${
                                item.status === "rejected" 
                                  ? "bg-red-600 hover:bg-red-700" 
                                  : item.status === "approved"
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-amber-600 hover:bg-amber-700"
                              }`}
                            >
                              {item.status === "approved" ? "Lihat Detail" : "Tinjau Sekarang"}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
