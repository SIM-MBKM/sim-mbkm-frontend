"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  acceptedFileTypes?: string
}

export function FileUpload({ onFileSelect, selectedFile, acceptedFileTypes = "*" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      {!selectedFile ? (
        <motion.div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            isDragging
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              : "border-slate-300 dark:border-slate-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{ borderColor: isDragging ? "#a855f7" : "#cbd5e1" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
              <Upload className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="text-sm">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-muted-foreground">
              {acceptedFileTypes === "*" ? "Any file format" : acceptedFileTypes.replace(/\./g, "").toUpperCase()}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
          <Button variant="ghost" className="mt-4 w-full" onClick={() => fileInputRef.current?.click()} type="button">
            Select File
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border rounded-md p-4 bg-slate-50 dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm">
                <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
