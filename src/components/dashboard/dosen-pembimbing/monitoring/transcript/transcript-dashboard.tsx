"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { NRPSection } from "./nrp-section"
import { TranscriptPagination } from "./transcript-pagination"
import { TranscriptStats } from "./transcript-stats"
import { TranscriptSearch } from "./transcript-search"
import { TranscriptPreview } from "./transcript-preview"
import { Transcript, TranscriptByAdvisorInput } from "@/lib/api/services"
import { useTranscriptsByAdvisor } from "@/lib/api/hooks/use-query-hooks"

export function TranscriptDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTranscript, setSelectedTranscript] = useState<Transcript | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  // Create filter input for the API
  const transcriptByAdvisorInput: TranscriptByAdvisorInput = useMemo(() => {
    return searchQuery ? { user_nrp: searchQuery } : {}
  }, [searchQuery])
  
  // Use the hook to fetch data from API
  const { data, isLoading, error } = useTranscriptsByAdvisor({
    page: currentPage,
    limit,
    transcriptByAdvisorInput
  })

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return { totalNrps: 0, totalTranscripts: 0 }

    const nrps = Object.keys(data.data.transcripts)
    let totalTranscripts = 0
    
    nrps.forEach((nrp) => {
      totalTranscripts += data.data.transcripts[nrp].length
    })

    return {
      totalNrps: nrps.length,
      totalTranscripts,
    }
  }, [data])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleTranscriptClick = (transcript: Transcript) => {
    setSelectedTranscript(transcript)
    setIsPreviewOpen(true)
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Transcript Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage student transcripts</p>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="lg:col-span-3">
            <TranscriptStats stats={stats} />
          </div>
          <div>
            <TranscriptSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
              <h3 className="text-xl font-medium">Loading transcripts...</h3>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow"
            >
              <div className="text-center">
                <h3 className="text-xl font-medium mb-2 text-red-600">Error loading transcripts</h3>
                <p className="text-slate-500 dark:text-slate-400">Please try again later</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {data && Object.keys(data.data.transcripts).length > 0 ? (
                <>
                  <div className="mb-6">
                    <TranscriptPagination
                      currentPage={Number(data.current_page)}
                      totalPages={Number(data.total_pages)}
                      onPageChange={handlePageChange}
                    />
                  </div>

                  <div className="space-y-8">
                    {Object.entries(data.data.transcripts).map(([nrp, transcripts], index) => (
                      <motion.div
                        key={nrp}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: index * 0.1 },
                        }}
                      >
                        <NRPSection nrp={nrp} transcripts={transcripts} onTranscriptClick={handleTranscriptClick} />
                      </motion.div>
                    ))}
                  </div>

                  {/* <div className="mt-8">
                    <TranscriptPagination
                      currentPage={Number(data.current_page)}
                      totalPages={Number(data.total_pages)}
                      onPageChange={handlePageChange}
                    />
                  </div> */}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">No transcripts found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {selectedTranscript && (
        <TranscriptPreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          transcript={selectedTranscript}
        />
      )}
    </div>
  )
}
