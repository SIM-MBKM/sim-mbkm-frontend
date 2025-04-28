"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSubmitSyllabus } from "@/lib/api/hooks"
import { toast } from "react-toastify"

// Define SyllabusData interface
interface SyllabusData {
  academic_advisor_email: string;
  academic_advisor_id: string;
  file_storage_id: string;
  id: string;
  registration_id: string;
  title: string;
  user_id: string;
  user_nrp: string;
}

// Define RegistrationWithSyllabus interface
interface RegistrationWithSyllabus {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: string;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  syllabus_data: SyllabusData[] | null;
}

interface SyllabusUploadModalProps {
  isOpen: boolean
  onClose: () => void
  registration: RegistrationWithSyllabus
}

export function SyllabusUploadModal({ isOpen, onClose, registration }: SyllabusUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Use the submit syllabus mutation
  const { 
    mutate: submitSyllabus, 
    isPending: isUploading,
    error
  } = useSubmitSyllabus()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = () => {
    if (!file || !title) return

    setUploadStatus("uploading")
    
    // Set initial progress (for UI feedback)
    setUploadProgress(20)
    
    // Create a progress interval for visual feedback
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 300)

    // Submit the syllabus using the mutation
    submitSyllabus(
      {
        registration_id: registration.registration_id,
        title: title,
        file: file
      },
      {
        onSuccess: () => {
          clearInterval(progressInterval)
          setUploadProgress(100)
          setUploadStatus("success")
          toast.success("Silabus berhasil diunggah!")
        },
        onError: (error) => {
          clearInterval(progressInterval)
          setUploadProgress(0)
          setUploadStatus("error")
          toast.error(`Gagal mengunggah silabus: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`)
        }
      }
    )
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setUploadStatus("idle")
    setUploadProgress(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white z-100">
        <DialogHeader>
          <DialogTitle>Unggah Silabus</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium">{registration.activity_name}</h3>
            <p className="text-sm text-gray-500">
              Semester {registration.semester} • {registration.total_sks} SKS
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Silabus</Label>
            <Input
              id="title"
              placeholder="Contoh: Silabus Nilai Magang Semester 7"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploadStatus === "uploading" || uploadStatus === "success"}
            />
          </div>

          <div className="space-y-2">
            <Label>File Silabus</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={uploadStatus === "uploading" || uploadStatus === "success"}
            />

            <AnimatePresence mode="wait">
              {!file && uploadStatus === "idle" ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-medium">Klik atau seret file ke sini</p>
                      <p className="text-sm text-gray-500">PDF, DOC, atau DOCX (Maks. 10MB)</p>
                    </div>
                  </div>
                </motion.div>
              ) : uploadStatus === "uploading" ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#003478] h-2.5 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm">Mengunggah... {uploadProgress}%</p>
                  </div>
                </motion.div>
              ) : uploadStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border rounded-lg p-6 bg-green-50 border-green-200"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="font-medium text-green-800">Berhasil diunggah!</p>
                    <p className="text-sm text-green-600">Silabus telah berhasil diunggah</p>
                  </div>
                </motion.div>
              ) : uploadStatus === "error" ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="border rounded-lg p-6 bg-red-50 border-red-200"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-red-100 p-3">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="font-medium text-red-800">Gagal diunggah</p>
                    <p className="text-sm text-red-600">
                      {error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah silabus"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#003478]/10 p-2 rounded">
                      <FileText className="h-6 w-6 text-[#003478]" />
                    </div>
                    <div>
                      <p className="font-medium truncate max-w-[180px]">{file?.name}</p>
                      <p className="text-xs text-gray-500">
                        {file?.size ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {uploadStatus === "success" ? (
            <Button onClick={onClose} className="bg-[#003478] text-white hover:bg-[#00275a]">
              Selesai
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={uploadStatus === "idle" ? onClose : resetForm} disabled={isUploading}>
                {uploadStatus === "idle" ? "Batal" : "Reset"}
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#003478] hover:bg-[#00275a] text-white"
                disabled={!file || !title || isUploading}
              >
                {isUploading ? "Mengunggah..." : "Unggah Silabus"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
