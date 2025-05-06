"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePrograms } from "./program-provider"
import { ProgramCard } from "./program-card"
import { Pagination } from "./pagination"
import { ProgramSearch } from "./program-search"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { useProgramAPI } from "./program-dashboard"
import { Activity } from "@/lib/api/services/activity-service"

interface ProgramListProps {
  selectedTab: "PENDING" | "APPROVED" | "REJECTED"
  onSelectProgram: (id: string) => void
  selectedProgramId: string | null
}

export function ProgramList({ selectedTab, onSelectProgram, selectedProgramId }: ProgramListProps) {
  const { searchTerm, setSearchTerm } = usePrograms()
  const { 
    activities, 
    isLoading, 
    activitiesPagination, 
    changePage, 
    activitiesData 
  } = useProgramAPI()
  
  const [filteredPrograms, setFilteredPrograms] = useState<Activity[]>([])

  // Filter activities by status and search term
  useEffect(() => {
    if (!activities) return;
    
    const filtered = activities.filter(
      (program) =>
        program.approval_status === selectedTab &&
        (searchTerm === "" ||
          program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.program_provider.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredPrograms(filtered)
  }, [activities, selectedTab, searchTerm])

  // Handler for page change
  const handlePageChange = (newPage: number) => {
    changePage(newPage);
  }

  // Get pagination data from the API context
  const { currentPage, totalPages } = activitiesPagination;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-0">
            {selectedTab === "PENDING"
              ? "Pending Programs"
              : selectedTab === "APPROVED"
                ? "Approved Programs"
                : "Rejected Programs"}
          </h2>
          <ProgramSearch value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : filteredPrograms.length === 0 ? (
            <EmptyState
              title="No programs found"
              description={`There are no ${selectedTab.toLowerCase()} programs matching your criteria.`}
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProgramCard
                    program={program}
                    isSelected={program.id === selectedProgramId}
                    onSelect={() => onSelectProgram(program.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!isLoading && activitiesData && activitiesData.total > 0 && (
          <div className="mt-6">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
