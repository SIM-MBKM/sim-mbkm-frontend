"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RegistrationCard } from "./registration-equivalence-card"
import { Search, Filter, SlidersHorizontal, BookOpen, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useRegistrationStudentMatching } from "@/lib/api/hooks"
import { Registration } from "@/lib/api/services/registration-service"

// Define a minimal interface for the matching property based on what's used in the component
interface MatchingItem {
  id: string;
  departemen: string;
  kelas: string;
  kode: string;
  mata_kuliah: string;
  prodi_penyelenggara: string;
  semester: number;
  sks: number | string;
  tipe_mata_kuliah?: string;
  documents?: Array<{ id: string; name: string; url?: string; type?: string }>;
  document?: { id: string; name: string; url?: string; type?: string };
}

// Type for Registration with Matching
type RegistrationWithMatching = Registration & { 
  matching: MatchingItem[] 
};

export function EquivalenceManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [expandedRegistration, setExpandedRegistration] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Use the hook to fetch matching data
  const { 
    data: registrationsData,
    isLoading: isLoadingData,
    error: registrationsError
  } = useRegistrationStudentMatching();

  // Early return for loading state
  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#003478] mb-4" />
        <p className="text-gray-600">Memuat data ekivalensi...</p>
      </div>
    );
  }

  // Early return for error state
  if (registrationsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Gagal memuat data</h3>
          <p className="text-sm text-red-600 mb-4">
            {registrationsError instanceof Error ? registrationsError.message : "Terjadi kesalahan saat memuat data ekivalensi"}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const registrations = registrationsData?.data?.registrations || [];

  const filteredRegistrations = registrations.filter((reg) =>
    reg.activity_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter)
  }

  const handleToggleExpand = (registrationId: string) => {
    setExpandedRegistration(expandedRegistration === registrationId ? null : registrationId)
  }

  const handleSaveEquivalents = async (registrationId: string, subjectIds: string[]) => {
    setLoading(true)

    try {
      console.log("Saving equivalents:", {
        registration_id: registrationId,
        subject_id: subjectIds,
      })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success("Ekivalensi mata kuliah berhasil disimpan.");
    } catch (error) {
      console.error("Error saving equivalents:", error)
      toast.error("Terjadi kesalahan saat menyimpan ekivalensi.");
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalRegistrations = registrations.length
  const pendingEquivalents = registrations.filter((reg) => !reg.equivalents || reg.equivalents.length === 0).length
  const completedEquivalents = totalRegistrations - pendingEquivalents

  return (
    <>
      <div className="space-y-6 mt-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-[#003478]">Ekivalensi Mata Kuliah</h1>
          <p className="text-gray-600">Kelola ekivalensi mata kuliah untuk program MBKM Anda</p>
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
            <h3 className="text-lg font-medium mb-2">Belum Diatur</h3>
            <p className="text-3xl font-bold">{pendingEquivalents}</p>
          </div>
          <div className="bg-gradient-to-br from-[#22c55e] to-[#4ade80] text-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-medium mb-2">Sudah Diatur</h3>
            <p className="text-3xl font-bold">{completedEquivalents}</p>
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
                Belum Diatur
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={activeFilter === "completed" ? "bg-[#003478] text-white" : ""}
                onClick={() => handleFilterClick("completed")}
              >
                Sudah Diatur
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
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <RegistrationCard
                  registration={registration as RegistrationWithMatching}
                  isExpanded={expandedRegistration === registration.id}
                  onToggleExpand={() => handleToggleExpand(registration.id)}
                  onSaveEquivalents={handleSaveEquivalents}
                  loading={loading}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-12 bg-white rounded-lg border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Tidak ada program yang ditemukan</p>
            </motion.div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
