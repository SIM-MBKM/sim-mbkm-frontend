"use client";

import { InternshipSearch } from "@/components/dashboard/programs/internship-search";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayoutDosen>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-16 h-16 border-4 rounded-full border-blue-600 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="mt-4 text-blue-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Memuat Program MBKM...
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <InternshipSearch />
        </motion.div>
      )}
    </DashboardLayoutDosen>
  );
}
