"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RegistrationCard } from "./registration-card"
import { TranscriptUploadModal } from "./transcript-upload-modal"
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRegistrationTranscriptsByStudent } from "@/lib/api/hooks"

// Define TranscriptData interface
interface TranscriptData {
  academic_advisor_email: string;
  academic_advisor_id: string;
  file_storage_id: string;
  id: string;
  registration_id: string;
  title: string;
  user_id: string;
  user_nrp: string;
}

// Define RegistrationWithTranscript interface that matches our data structure
interface RegistrationWithTranscript {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: number;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  transcript_data: TranscriptData[] | null;
  // Optionally include other fields that might be present
  id?: string;
  user_id?: string;
  user_nrp?: string;
  user_name?: string;
  advising_confirmation?: boolean;
  academic_advisor?: string;
  academic_advisor_email?: string;
  mentor_name?: string;
  mentor_email?: string;
  documents?: {
    id: string;
    registration_id: string;
    file_storage_id: string;
    name: string;
    document_type: string;
  }[];
  equivalents?: unknown;
}

export function TranscriptPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithTranscript | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Use the hook to fetch registration data
  const { 
    data: registrationsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useRegistrationTranscriptsByStudent()

  // Get registrations from the response
  const registrations = registrationsResponse?.data?.registrations || []

  const filteredRegistrations = registrations.filter((reg) =>
    reg.activity_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUploadClick = (registration: RegistrationWithTranscript) => {
    setSelectedRegistration(registration)
    setIsModalOpen(true)
  }

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter)
  }

  // Calculate statistics
  const totalRegistrations = registrations.length
  const pendingUploads = registrations.filter((reg) => reg.transcript_data === null).length
  const completedUploads = totalRegistrations - pendingUploads

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#003478] mb-4" />
        <p className="text-gray-600">Memuat data transkrip...</p>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-20 border rounded-lg p-6 bg-red-50 border-red-200 text-red-800">
        <h3 className="font-bold mb-2">Error loading transcript data</h3>
        <p>{error instanceof Error ? error.message : "Unknown error occurred"}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-[#003478]">Input Transkrip</h1>
        <p className="text-gray-600">Kelola dan unggah transkrip nilai untuk program MBKM Anda</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-[#003478] to-[#004eaa] text-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium mb-2">Total Program</h3>
          <p className="text-3xl font-bold">{totalRegistrations}</p>
        </div>
        <div className="bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium mb-2">Perlu Diunggah</h3>
          <p className="text-3xl font-bold">{pendingUploads}</p>
        </div>
        <div className="bg-gradient-to-br from-[#22c55e] to-[#4ade80] text-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium mb-2">Sudah Diunggah</h3>
          <p className="text-3xl font-bold">{completedUploads}</p>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-white rounded-lg p-4 shadow-sm border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        {showFilters && (
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === "all" ? "bg-[#003478] text-white" : ""}
              onClick={() => handleFilterClick("all")}
            >
              Semua
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === "pending" ? "bg-[#003478] text-white" : ""}
              onClick={() => handleFilterClick("pending")}
            >
              Perlu Diunggah
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={activeFilter === "completed" ? "bg-[#003478] text-white" : ""}
              onClick={() => handleFilterClick("completed")}
            >
              Sudah Diunggah
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto flex items-center gap-1"
              onClick={() => setActiveFilter(null)}
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Registration Cards */}
      <div className="space-y-4">
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration, index) => (
            <motion.div
              key={registration.registration_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <RegistrationCard registration={registration} onUploadClick={() => handleUploadClick(registration)} />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-12 bg-white rounded-lg border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500">Tidak ada program yang ditemukan</p>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      {selectedRegistration && (
        <TranscriptUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          registration={selectedRegistration}
        />
      )}
    </div>
  )
}
