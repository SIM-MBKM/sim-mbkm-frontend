"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, BookOpen, Save, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MatchingCard } from "@/components/dashboard/equivalence/matching-card"
import { Registration } from "@/lib/api/services/registration-service"
import { useSubmitEquivalenceRequest } from "@/lib/api/hooks"
import { toast } from "@/lib/api/hooks/use-toast"

interface RegistrationCardProps {
  registration: Registration
  isExpanded: boolean
  onToggleExpand: () => void
  onSaveEquivalents?: (registrationId: string, subjectIds: string[]) => void
  loading?: boolean
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
  const submitEquivalenceMutation = useSubmitEquivalenceRequest()

  // Initialize selected subjects from existing equivalents
  useEffect(() => {
    if (registration.equivalents) {
      const existingSubjectIds = registration.equivalents
        .map((eq) => {
          // const doc = eq.documents?.[0]
          // return doc?.id || null
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
      
      toast({
        title: "Berhasil!",
        description: "Ekivalensi mata kuliah berhasil disimpan.",
        variant: "default",
      })
      
      // If external handler is provided, call it too
      if (onSaveEquivalents) {
        onSaveEquivalents(registration.id, selectedSubjects)
      }
    } catch (error) {
      console.error("Error saving equivalents:", error)
      toast({
        title: "Gagal!",
        description: "Terjadi kesalahan saat menyimpan ekivalensi.",
        variant: "destructive",
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
          // Access the id property from the document array's first item
          // const docId = match.documents?.[0]?.id
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
                {/* Current Equivalents Section */}
                {registration.equivalents && registration.equivalents.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-medium text-lg mb-4">Mata Kuliah Ekivalen Saat Ini</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {registration.equivalents.map((equivalent, index) => {
                        // Find matching subject from the matching array using document id
                        // const docId = equivalent.documents?.[0]?.id
                        const subjectId = equivalent.subject_id;
                        const matchingSubject = registration.matching?.find(
                          // match => match.documents?.[0]?.id === docId
                          match => match.subject_id === subjectId
                        )
                        
                        return matchingSubject ? (
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
                                      <h4 className="font-medium">{matchingSubject.mata_kuliah}</h4>
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{matchingSubject.kode}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{matchingSubject.prodi_penyelenggara}</p>
                                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                      <div>
                                        <span className="text-gray-500">Departemen:</span>{" "}
                                        <span className="font-medium">{matchingSubject.departemen}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">SKS:</span> <span className="font-medium">{matchingSubject.sks}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Semester:</span>{" "}
                                        <span className="font-medium">{matchingSubject.semester}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Kelas:</span> <span className="font-medium">{matchingSubject.kelas}</span>
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
                        ) : null
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
                      // Access the id property from the document array's first item
                      // const docId = match.documents?.[0]?.id
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
