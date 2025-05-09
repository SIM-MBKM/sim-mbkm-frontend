"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  acceptedFileTypes?: string
  onFileUpload?: (file: File, documentType: string) => void
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  acceptedFileTypes = ".pdf,.doc,.docx",
  onFileUpload,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [documentType, setDocumentType] = useState("")

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      onFileSelect(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      onFileSelect(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    onFileSelect(null as unknown as File)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setDocumentType("")
  }

  const handleUpload = () => {
    if (selectedFile && documentType && onFileUpload) {
      onFileUpload(selectedFile, documentType)
      onFileSelect(null as unknown as File)
      setDocumentType("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" />

      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-300 dark:border-slate-700 hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {onFileUpload && (
            <div className="space-y-3 mt-4">
              <div>
                <Label htmlFor="document-type" className="text-sm">
                  Document Type
                </Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acceptence Letter">Acceptance Letter</SelectItem>
                    <SelectItem value="Syllabus">Syllabus</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Report">Report</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={handleUpload} disabled={!documentType} size="sm" className="w-full">
                  Upload Document
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
