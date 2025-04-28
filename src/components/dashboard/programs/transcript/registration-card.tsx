"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileCheck, FileX, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TranscriptDetailModal } from "./transcript-detail-modal"
import { toast } from "react-toastify"

// Interface for transcript data
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

// Registration with transcript interface
interface RegistrationWithTranscript {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: string;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  transcript_data: TranscriptData[] | null;
  // Optionally include other fields
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

interface RegistrationCardProps {
  registration: RegistrationWithTranscript;
  onUploadClick: () => void
}

export function RegistrationCard({ registration, onUploadClick }: RegistrationCardProps) {
  const hasTranscript = registration.transcript_data !== null
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "REJECTED":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const handleViewTranscript = () => {
    setIsViewModalOpen(true)
  }

  const handleDeleteTranscript = async () => {
    // Refresh after delete
    setIsViewModalOpen(false)
    // Optionally, you could refetch the data here
    toast.success("Transkrip berhasil dihapus!")
  }

  return (
    <>
      <Card className={`overflow-hidden ${hasTranscript ? "border-green-200" : "border-orange-200"}`}>
        <div className={`h-1 ${hasTranscript ? "bg-green-500" : "bg-orange-500"}`}></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{registration.activity_name}</h3>
                <Badge variant="outline" className={getStatusColor(registration.lo_validation)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(registration.lo_validation)}
                    {registration.lo_validation}
                  </span>
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

              {hasTranscript && registration.transcript_data && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <FileCheck className="h-5 w-5" />
                    <span className="font-medium">Transkrip telah diunggah</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {registration.transcript_data[0].title} - Diunggah oleh {registration.transcript_data[0].user_nrp}
                  </p>
                </div>
              )}

              {!hasTranscript && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <FileX className="h-5 w-5" />
                    <span className="font-medium">Transkrip belum diunggah</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Silakan unggah transkrip nilai untuk program ini</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {!hasTranscript && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onUploadClick}
                    className="bg-[#003478] hover:bg-[#00275a] w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4 text-white" />
                    <span className="text-white">Unggah Transkrip</span>
                  </Button>
                </motion.div>
              )}

              {hasTranscript && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={handleViewTranscript}
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Lihat Transkrip</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Transcript Modal */}
      {isViewModalOpen && hasTranscript && (
        <TranscriptDetailModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onDelete={handleDeleteTranscript}
          registration={registration}
        />
      )}
    </>
  )
}
