"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, BookOpen, Save, Loader2, CheckCircle, Search, Plus, X, Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MatchingCard } from "@/components/dashboard/equivalence/matching-card"
import { Registration } from "@/lib/api/services/registration-service"
import { useSubmitEquivalenceRequest, useFilterSubject } from "@/lib/api/hooks"
import { toast } from "react-toastify"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SubjectFilterRequest } from "@/lib/api/services"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Simple Checkbox component implementation
interface CheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
}

const Checkbox = ({ id, checked, onCheckedChange, className }: CheckboxProps) => {
  return (
    <div className={cn("flex items-center", className)}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onCheckedChange}
        className="h-4 w-4 rounded border-gray-300 text-[#003478] focus:ring-[#003478]"
      />
    </div>
  );
};

// Sample semesters for filter
const semesters = ["GANJIL", "GENAP"];

interface RegistrationCardProps {
  registration: Registration
  isExpanded: boolean
  onToggleExpand: () => void
  onSaveEquivalents?: (registrationId: string, subjectIds: string[]) => void
  loading?: boolean
}

// Fix typing issue
interface Subject {
  id: string;
  mata_kuliah: string;
  prodi_penyelenggara: string;
  departemen: string;
  semester: string | number;
  kelas: string;
  kode: string;
  sks: string | number;
  tipe_mata_kuliah?: string;
}

export function RegistrationCard({
  registration,
  isExpanded,
  onToggleExpand,
  onSaveEquivalents,
  loading: externalLoading,
}: RegistrationCardProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [initialSubjects, setInitialSubjects] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCustomSubjectOpen, setIsCustomSubjectOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreData, setHasMoreData] = useState(true)
  // const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingElementRef = useRef<HTMLDivElement | null>(null)
  const submitEquivalenceMutation = useSubmitEquivalenceRequest()
  
  // Subject filter state with debouncing
  const [filter, setFilter] = useState<SubjectFilterRequest>({
    kode: "",
    semester: "",
    prodi_penyelenggara: "",
    kelas: "",
    departement: "",
    tipe_mata_kuliah: ""
  })

  // Debounced filter for API calls
  const [debouncedFilter, setDebouncedFilter] = useState(filter)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Handle filter change
  const handleFilterChange = (key: keyof SubjectFilterRequest, value: string) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setFilter({
      kode: "",
      semester: "",
      prodi_penyelenggara: "",
      kelas: "",
      departement: "",
      tipe_mata_kuliah: ""
    })
    setSearchTerm("")
    setPage(1)
  }

  // Apply debounce to filter and search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter)
      setDebouncedSearchTerm(searchTerm)
      setPage(1) // Reset to first page when filter changes
    }, 500)
    
    return () => clearTimeout(timer)
  }, [filter, searchTerm])

  // Fetch data whenever debounced values change
  const {
    data: filteredSubjectsData,
    isLoading: isLoadingSubjects,
    isFetching
  } = useFilterSubject({
    page,
    limit: 10,
    filter: {
      ...debouncedFilter,
      kode: debouncedSearchTerm || debouncedFilter.kode
    }
  });

  // Keep track of all fetched subjects
  const [allFetchedSubjects, setAllFetchedSubjects] = useState<Subject[]>([])
  
  // Clear subjects when filter changes
  useEffect(() => {
    setAllFetchedSubjects([])
  }, [debouncedFilter, debouncedSearchTerm])
  
  // Update subjects when new data arrives
  useEffect(() => {
    if (filteredSubjectsData && filteredSubjectsData.data) {
      if (page === 1) {
        // Replace all subjects for first page
        setAllFetchedSubjects(filteredSubjectsData.data)
      } else {
        // Append new subjects for subsequent pages
        setAllFetchedSubjects(prev => [...prev, ...filteredSubjectsData.data])
      }
      
      // Update pagination state
      if (filteredSubjectsData.data.length === 0 || 
          filteredSubjectsData.current_page >= filteredSubjectsData.last_page) {
        setHasMoreData(false)
      } else {
        setHasMoreData(true)
      }
    }
  }, [filteredSubjectsData, page])

  // Use allFetchedSubjects for display instead of just the current page
  const allSubjects = allFetchedSubjects

  // Initialize selected subjects from existing equivalents
  useEffect(() => {
    if (registration.equivalents) {
      const existingSubjectIds = registration.equivalents
        .map((eq) => {
          const subjectId = eq.subject_id
          return subjectId
        })
        .filter(Boolean) as string[]
      setSelectedSubjects(existingSubjectIds)
      setInitialSubjects(existingSubjectIds)
    } else {
      setSelectedSubjects([])
      setInitialSubjects([])
    }
    setHasChanges(false)
  }, [registration])

  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      const isSelected = prev.includes(subjectId)
      const newSelection = isSelected ? prev.filter((subject_id) => subject_id !== subjectId) : [...prev, subjectId]
      setHasChanges(true)
      return newSelection
    })
  }

  const handleSave = async () => {
    // Calculate added and removed subjects by comparing with initial state
    const subjectsToAdd = selectedSubjects.filter(subject_id => !initialSubjects.includes(subject_id))
    const subjectsToRemove = initialSubjects.filter(subject_id => !selectedSubjects.includes(subject_id))
    
    try {
      await submitEquivalenceMutation.mutateAsync({
        registration_id: registration.id,
        subject_id_add: subjectsToAdd.length > 0 ? subjectsToAdd : undefined,
        subject_id_remove: subjectsToRemove.length > 0 ? subjectsToRemove : undefined
      })
      
      // Update initial subjects to match the current selection
      setInitialSubjects([...selectedSubjects])
      setHasChanges(false)
      
      toast.success("Ekivalensi mata kuliah berhasil disimpan.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      // If external handler is provided, call it too
      if (onSaveEquivalents) {
        onSaveEquivalents(registration.id, selectedSubjects)
      }
    } catch (error) {
      console.error("Error saving equivalents:", error)
      toast.error("Terjadi kesalahan saat menyimpan ekivalensi.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Check if a subject is already in equivalents
  const isSubjectInEquivalents = (subjectId: string) => {
    return selectedSubjects.includes(subjectId)
  }

  // Count total SKS of selected subjects
  const totalSelectedSKS = registration.matching
    ? registration.matching
        .filter((match) => {
          const subjectId = match.subject_id
          return subjectId && selectedSubjects.includes(subjectId)
        })
        .reduce((sum: number, match) => sum + (match.sks || 0), 0)
    : 0

  // Determine if we're in a loading state (either external or from the mutation)
  const isLoading = externalLoading || submitEquivalenceMutation.isPending

  return (
    <Card className="overflow-hidden border-[#003478]/20">
      <CardContent className="p-0">
        <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onToggleExpand}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{registration.activity_name}</h3>
                <Badge variant="outline" className={getStatusColor(registration.lo_validation)}>
                  {registration.lo_validation}
                </Badge>
              </div>

              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Semester:</span>
                  <span className="font-medium">{registration.semester}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Total SKS:</span>
                  <span className="font-medium">{registration.total_sks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium">{registration.approval_status ? "Disetujui" : "Belum Disetujui"}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#003478]" />
                <span className="font-medium">
                  {registration.equivalents && registration.equivalents.length > 0
                    ? `${registration.equivalents.length} mata kuliah ekivalen`
                    : "Belum ada mata kuliah ekivalen"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t p-6">
                {/* Custom Subject Selection Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-lg">Tambah Mata Kuliah Lainnya</h4>
                    <div className="flex gap-2">
                      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Filter Mata Kuliah</h4>
                              <p className="text-sm text-muted-foreground">
                                Sesuaikan pencarian mata kuliah
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-3">
                                  <Label htmlFor="filter-kode">Kode</Label>
                                  <Input
                                    id="filter-kode"
                                    value={filter.kode}
                                    onChange={(e) => handleFilterChange('kode', e.target.value)}
                                    placeholder="Kode mata kuliah"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="col-span-3 bg-white z-[200]">
                                  <Label htmlFor="filter-semester">Semester</Label>
                                  <Select
                                    value={filter.semester}
                                    onValueChange={(value) => handleFilterChange('semester', value)}
                                  >
                                    <SelectTrigger id="filter-semester" className="mt-1">
                                      <SelectValue placeholder="Pilih semester" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white z-[100]">
                                      <SelectItem value="all">Semua</SelectItem>
                                      {semesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                          Semester {sem}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  <Label htmlFor="filter-prodi">Program Studi</Label>
                                  <Input
                                    id="filter-prodi"
                                    value={filter.prodi_penyelenggara}
                                    onChange={(e) => handleFilterChange('prodi_penyelenggara', e.target.value)}
                                    placeholder="Program studi"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Label htmlFor="filter-kelas">Kelas</Label>
                                  <Input
                                    id="filter-kelas"
                                    value={filter.kelas}
                                    onChange={(e) => handleFilterChange('kelas', e.target.value)}
                                    placeholder="Kelas"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Label htmlFor="filter-departemen">Departemen</Label>
                                  <Input
                                    id="filter-departemen"
                                    value={filter.departement}
                                    onChange={(e) => handleFilterChange('departement', e.target.value)}
                                    placeholder="Departemen"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Label htmlFor="filter-tipe">Tipe Mata Kuliah</Label>
                                  <Input
                                    id="filter-tipe"
                                    value={filter.tipe_mata_kuliah}
                                    onChange={(e) => handleFilterChange('tipe_mata_kuliah', e.target.value)}
                                    placeholder="Tipe mata kuliah"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="mt-2 flex items-center gap-2"
                                onClick={resetFilters}
                              >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Button
                        variant="outline"
                        onClick={() => setIsCustomSubjectOpen(!isCustomSubjectOpen)}
                        className="flex items-center gap-2"
                      >
                        {isCustomSubjectOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        <span>{isCustomSubjectOpen ? "Tutup" : "Tambah"}</span>
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCustomSubjectOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <Card className="border border-gray-200 mb-4">
                          <CardContent className="p-4">
                            <div className="relative mb-4">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Cari mata kuliah..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>

                            <div className="max-h-[300px] overflow-y-auto pr-2">
                              {isLoadingSubjects && page === 1 ? (
                                <div className="flex justify-center p-4">
                                  <Loader2 className="h-6 w-6 animate-spin text-[#003478]" />
                                </div>
                              ) : allSubjects.length > 0 ? (
                                <div className="space-y-3">
                                  {allSubjects.map((subject) => (
                                    <div
                                      key={subject.id}
                                      className={cn(
                                        "p-3 border rounded-md transition-colors",
                                        isSubjectInEquivalents(subject.id)
                                          ? "border-green-500 bg-green-50"
                                          : "border-gray-200 hover:bg-gray-50"
                                      )}
                                    >
                                      <div className="flex items-start gap-3">
                                        <Checkbox
                                          id={`subject-${subject.id}`}
                                          checked={isSubjectInEquivalents(subject.id)}
                                          onCheckedChange={() => handleToggleSubject(subject.id)}
                                          className="mt-1"
                                        />
                                        <div className="flex-1">
                                          <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <label
                                              htmlFor={`subject-${subject.id}`}
                                              className="font-medium cursor-pointer"
                                            >
                                              {subject.mata_kuliah}
                                            </label>
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                              {subject.kode}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-600">{subject.prodi_penyelenggara}</p>
                                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs">
                                            <div>
                                              <span className="text-gray-500">Departemen:</span>{" "}
                                              <span className="font-medium">{subject.departemen}</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">SKS:</span>{" "}
                                              <span className="font-medium">{subject.sks}</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Semester:</span>{" "}
                                              <span className="font-medium">{subject.semester}</span>
                                            </div>
                                            <div>
                                              <span className="text-gray-500">Kelas:</span>{" "}
                                              <span className="font-medium">{subject.kelas}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Loading indicator for infinite scroll */}
                                  {hasMoreData && (
                                    <div 
                                      ref={loadingElementRef} 
                                      className="flex justify-center p-2"
                                    >
                                      {isFetching && page > 1 && (
                                        <Loader2 className="h-6 w-6 animate-spin text-[#003478]" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                  <p className="text-gray-500">Tidak ada mata kuliah yang ditemukan</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Current Equivalents Section */}
                {registration.equivalents && registration.equivalents.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-medium text-lg mb-4">Mata Kuliah Ekivalen Saat Ini</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registration.equivalents.map((equivalent, index) => {
                        // Find matching subject from the matching array using subject_id
                        const subjectId = equivalent.subject_id;
                        const matchingSubject = registration.matching?.find(
                          match => match.subject_id === subjectId
                        );
                        
                        // Use the equivalent data directly if no matching subject is found
                        const subjectToDisplay = matchingSubject || equivalent;
                        
                        return (
                          <motion.div
                            key={`eq-${subjectId}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="overflow-hidden border-2 border-green-500 bg-green-50">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{subjectToDisplay.mata_kuliah}</h4>
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{subjectToDisplay.kode}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{subjectToDisplay.prodi_penyelenggara}</p>
                                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                      <div>
                                        <span className="text-gray-500">Departemen:</span>{" "}
                                        <span className="font-medium">{subjectToDisplay.departemen}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">SKS:</span> <span className="font-medium">{subjectToDisplay.sks}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Semester:</span>{" "}
                                        <span className="font-medium">{subjectToDisplay.semester}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Kelas:</span> <span className="font-medium">{subjectToDisplay.kelas}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="rounded-full p-2 text-white bg-green-500">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Select Equivalents Section */}
                <div className="mb-4 flex justify-between items-center">
                  <h4 className="font-medium text-lg">Pilih Mata Kuliah Ekivalen</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Total SKS Terpilih: <span className="font-medium">{totalSelectedSKS}</span>
                    </span>
                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || isLoading}
                      className="bg-[#003478] hover:bg-[#00275a] flex text-white items-center gap-2"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      <span className="text-white">Simpan</span>
                    </Button>
                  </div>
                </div>

                {registration.matching && registration.matching.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registration.matching.map((match, index: number) => {
                      const subjectId = match.subject_id
                      const isSelected = isSubjectInEquivalents(subjectId)

                      return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <MatchingCard
                            matching={match}
                            isSelected={isSelected}
                            onToggle={() => handleToggleSubject(subjectId)}
                          />
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">Tidak ada mata kuliah yang tersedia untuk ekivalensi</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
