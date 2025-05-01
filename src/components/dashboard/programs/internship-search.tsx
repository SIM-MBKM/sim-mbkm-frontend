"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "./search-filter";
import { InternshipList } from "./internship-list";
import { InternshipDetail } from "./internship-detail";
import { useActivities } from "@/lib/api/hooks";
import { Activity } from "@/lib/api/services/activity-service";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, FileSearch } from "lucide-react";

export function InternshipSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 4;
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Check viewport width for responsive layout
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useActivities(currentPage, itemsPerPage, filters);

  console.log('Current search term in InternshipSearch:', searchTerm);
  console.log('Current page:', currentPage);
  console.log('Current filters:', filters);
  console.log('Activities data in InternshipSearch:', activitiesData);

  // Use Activity type for selectedInternship
  const [selectedInternship, setSelectedInternship] = useState<Activity | null>(null);

  // Update selectedInternship when activities data changes
  useEffect(() => {
    if (activitiesData && activitiesData.data && activitiesData.data.length > 0) {
      // Set the first activity as the selected one
      setSelectedInternship(activitiesData.data[0]);
    } else if (activitiesData && activitiesData.data && activitiesData.data.length === 0) {
      // Reset selected internship if no results
      setSelectedInternship(null);
    }
  }, [activitiesData]);

  // Handler for changing pages
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-4 md:p-6 mt-10 md:mt-16 pb-10"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#003478] mb-2">Program MBKM</h1>
        <p className="text-gray-600">Temukan dan daftar program MBKM yang sesuai dengan minat dan keahlian Anda</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <SearchFilters 
            setSearchTerm={setSearchTerm}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
          />
        </motion.div>

        {activitiesLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
              <p className="text-blue-600">Mencari program...</p>
            </motion.div>
          </div>
        ) : activitiesError ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800 mt-6 text-center"
          >
            <p className="font-semibold">Error loading activities: {activitiesError.message}</p>
            <p className="mt-2">Silakan coba lagi nanti atau hubungi administrator</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className={`mt-6 gap-6 ${isMobile ? 'flex flex-col' : 'flex'}`}
          >
            {isMobile && (
              <div className="flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDetail(!showDetail)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    showDetail 
                      ? 'bg-gray-200 text-gray-800' 
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {showDetail ? 'Lihat Daftar Program' : 'Lihat Detail Program'}
                </motion.button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {(!isMobile || (isMobile && !showDetail)) && (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={isMobile ? 'w-full' : 'w-[40%]'}
                >
                  <InternshipList
                    activities={activitiesData}
                    isLoading={activitiesLoading}
                    error={activitiesError}
                    onSelect={(internship) => {
                      // Find the full activity data from the available activities
                      const selectedActivity = activitiesData?.data.find(
                        (activity) => activity.id === internship.id
                      );
                      if (selectedActivity) {
                        setSelectedInternship(selectedActivity);
                        if (isMobile) setShowDetail(true);
                      }
                    }} 
                    currentPage={currentPage}
                    totalPages={activitiesData?.total_pages || 1}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}

              {(!isMobile || (isMobile && showDetail)) && (
                <motion.div 
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={isMobile ? 'w-full' : 'w-[60%]'}
                >
                  {selectedInternship ? (
                    <InternshipDetail internship={selectedInternship} />
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-10 h-full min-h-[400px] border border-gray-200"
                    >
                      <FileSearch className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium text-gray-600 mb-2">Tidak Ada Program Dipilih</h3>
                      <p className="text-gray-500 text-center">
                        Silakan pilih program dari daftar untuk melihat detailnya
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}
