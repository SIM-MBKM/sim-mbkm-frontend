"use client";

import { DashboardLayout } from "./dashboard-layout";
import { StatusCards } from "./status-card";
import { CalendarSection } from "./calendar-section";
import { ActivityFeed } from "./activity-feed";
import { ReviewSection } from "./review-section";
// import { ReactQueryProvider } from "@/lib/api/providers/query-provider";
import { Suspense, ReactNode } from "react";
import { motion } from "framer-motion";
// import { FileCheck, TrendingUp, Award } from "lucide-react";

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
}

const MotionWrapper = ({ children, delay = 0 }: MotionWrapperProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

// interface QuickStatProps {
//   icon: ReactNode;
//   label: string;
//   value: string;
//   bgColor: string;
//   delay?: number;
// }

export function DashboardContent() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }
  return (
    <DashboardLayout>
      {/* <ReactQueryProvider> */}
      {/* Quick Stats */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden mt-20"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
        </motion.div>
        
      </motion.div>
      {/* <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <QuickStat 
          icon={<FileCheck className="h-5 w-5 text-yellow-500" />}
          label="Tugas Selesai"
          value="18/24"
          bgColor="bg-gradient-to-br from-blue-600 to-blue-800"
          delay={0.1}
        />
        <QuickStat 
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Progress Semester"
          value="75%"
          bgColor="bg-gradient-to-br from-green-600 to-green-800"
          delay={0.2}
        />
        <QuickStat 
          icon={<Award className="h-5 w-5 text-purple-500" />}
          label="Prestasi"
          value="3 Penghargaan"
          bgColor="bg-gradient-to-br from-purple-600 to-purple-800"
          delay={0.3}
        />
      </motion.div> */}

      {/* Status Cards */}
      <Suspense fallback={
        <div className="w-full h-32 bg-gray-100 rounded-lg animate-pulse"></div>
      }>
        <MotionWrapper delay={0.1}>
          <StatusCards />
        </MotionWrapper>
      </Suspense>

      {/* Calendar and Activities */}
      <MotionWrapper delay={0.2}>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8 border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Calendar */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarSection />
            </motion.div>

            {/* Activities */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <ActivityFeed />
            </motion.div>
          </div>
        </div>
      </MotionWrapper>

      {/* Review Section */}
      <MotionWrapper delay={0.3}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <ReviewSection />
        </motion.div>
      </MotionWrapper>
      {/* </ReactQueryProvider> */}
    </DashboardLayout>
  );
}

// function QuickStat({ icon, label, value, bgColor, delay = 0 }: QuickStatProps) {
//   return (
//     <motion.div 
//       className={`${bgColor} text-white rounded-xl p-4 shadow-lg flex items-center justify-between`}
//       whileHover={{ scale: 1.03, y: -5 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.2, delay }}
//     >
//       <div>
//         <p className="text-xs font-medium text-white/80">{label}</p>
//         <p className="text-xl font-bold">{value}</p>
//       </div>
//       <div className="bg-white/20 p-3 rounded-full">
//         {icon}
//       </div>
//     </motion.div>
//   );
// }
