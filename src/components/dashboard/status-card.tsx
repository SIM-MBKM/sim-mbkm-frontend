'use client';

import { Calendar, FileText, User, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStudentRegistrations } from '@/lib/api/hooks';
import { useReportSchedulesByStudent } from '@/lib/api/hooks';
import { motion } from "framer-motion";
import { useState, ReactNode } from "react";

interface StatusCardProps {
  icon: ReactNode;
  title: string;
  status: "verified" | "pending" | "rejected" | "unsubmitted" | "loading" | "error";
  statusText: string;
  color: string;
  isLoading?: boolean;
}

const StatusCard = ({ icon, title, status, statusText, color, isLoading = false }: StatusCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden"
    >
      <Card className={`bg-gradient-to-br from-[#003478] to-[#001f47] text-white overflow-hidden border-none shadow-lg`}>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2 relative z-10">
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-full p-3"
          >
            {icon}
          </motion.div>
          <h3 className="text-yellow-400 font-bold">{title}</h3>
        </CardHeader>
        <CardContent className="pb-4 relative z-10">
          <p className="text-sm text-white/70">Status Verifikasi</p>
          {isLoading ? (
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse mt-1"></div>
          ) : (
            <div className="flex items-center mt-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {status === "verified" && <CheckCircle2 className="h-5 w-5 text-green-400 mr-2" />}
                {status === "pending" && <Clock className="h-5 w-5 text-yellow-400 mr-2" />}
                {status === "rejected" && <XCircle className="h-5 w-5 text-red-400 mr-2" />}
                {status === "unsubmitted" && <XCircle className="h-5 w-5 text-gray-400 mr-2" />}
              </motion.div>
              <p className={`text-xl font-bold ${color}`}>{statusText}</p>
            </div>
          )}
        </CardContent>
        
        {/* Decorative Elements */}
        <motion.div 
          className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/5"
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            x: isHovered ? -5 : 0,
            y: isHovered ? -5 : 0
          }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5"
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            x: isHovered ? 5 : 0,
            y: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

type RegistrationStatus = {
  status: "verified" | "pending" | "unsubmitted" | "loading" | "error";
  text: string;
};

type FinalReportStatus = {
  status: "verified" | "pending" | "rejected" | "unsubmitted" | "loading" | "error";
  text: string;
};

export function StatusCards() {
  const { data: studentRegistrations, 
    isLoading: studentRegistrationLoading, 
    error: studentRegistrationError } = useStudentRegistrations(1, 5);

  const { data: reportSchedules, 
    isLoading: reportSchedulesLoading, 
    error: reportSchedulesError } = useReportSchedulesByStudent();

  const getRegistrationStatus = (): RegistrationStatus => {
    if (studentRegistrationLoading) return { status: "loading", text: "Memuat..." };
    if (studentRegistrationError) return { status: "error", text: "Error" };
    
    if (studentRegistrations && studentRegistrations.data && studentRegistrations.data.length > 0) {
      return studentRegistrations.data[0].approval_status === true 
        ? { status: "verified", text: "Telah Terverifikasi" }
        : { status: "pending", text: "Belum Terverifikasi" };
    }
    
    return { status: "unsubmitted", text: "Belum Terverifikasi" };
  };

  const getFinalReportStatus = (): FinalReportStatus => {
    if (reportSchedulesLoading) return { status: "loading", text: "Memuat..." };
    if (reportSchedulesError) return { status: "error", text: "Error" };

    if (reportSchedules && reportSchedules.data) {
      // Find the first FINAL_REPORT in any activity
      const finalReport = Object.values(reportSchedules.data.reports)
        .flat()
        .find(schedule => schedule.report_type === "FINAL_REPORT");
      
      if (!finalReport) {
        return { status: "unsubmitted", text: "Belum Diisi" };
      }
      
      if (!finalReport.report) {
        return { status: "unsubmitted", text: "Belum Diisi" };
      }
      
      if (finalReport.report.academic_advisor_status === "PENDING") {
        return { status: "pending", text: "Belum Terverifikasi" };
      } else if (finalReport.report.academic_advisor_status === "REJECT") {
        return { status: "rejected", text: "Ditolak" };
      } else if (finalReport.report.academic_advisor_status === "APPROVED") {
        return { status: "verified", text: "Telah Terverifikasi" };
      } else {
        return { status: "unsubmitted", text: "Status Tidak Diketahui" };
      }
    }
    
    return { status: "unsubmitted", text: "Belum Diisi" };
  };

  const registrationStatus = getRegistrationStatus();
  const finalReportStatus = getFinalReportStatus();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <StatusCard 
        icon={<User className="h-6 w-6 text-yellow-500" />}
        title="Verifikasi Registrasi"
        status={registrationStatus.status}
        statusText={registrationStatus.text}
        color={registrationStatus.status === "verified" ? "text-green-400" : "text-yellow-400"}
        isLoading={studentRegistrationLoading}
      />

      <StatusCard 
        icon={<FileText className="h-6 w-6 text-yellow-500" />}
        title="Final Report"
        status={finalReportStatus.status}
        statusText={finalReportStatus.text}
        color={
          finalReportStatus.status === "verified" ? "text-green-400" :
          finalReportStatus.status === "rejected" ? "text-red-400" :
          finalReportStatus.status === "pending" ? "text-yellow-400" : "text-gray-400"
        }
        isLoading={reportSchedulesLoading}
      />

      <StatusCard 
        icon={<Calendar className="h-6 w-6 text-yellow-500" />}
        title="Status Monev"
        status="verified"
        statusText="Jadwal Terverifikasi"
        color="text-green-400"
        isLoading={false}
      />
    </motion.div>
  )
}
