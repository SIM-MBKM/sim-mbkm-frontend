"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, User, Mail, Calendar, BookOpen, School, ExternalLink } from "lucide-react"
import { Transcript } from "@/lib/api/services";
import { useState } from "react"

interface TranscriptPreviewProps {
  isOpen: boolean
  onClose: () => void
  transcript: Transcript
}

export function TranscriptPreview({ isOpen, onClose, transcript }: TranscriptPreviewProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  if (!transcript) return null

  const handleOpenDocument = () => {
    // In a real implementation, you would open the document viewer here
    // For now, we'll just log a message
    console.log("Opening document:", transcript.file_storage_id)
    setIsViewerOpen(true)
    // You could redirect to a document viewer or open an iframe/embed component
  }
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>{transcript.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex justify-center mb-4">
              <Badge className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200">{transcript.activity_name}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">NRP:</span>
                <span className="text-sm ml-auto">{transcript.user_nrp}</span>
              </div>

              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Academic Advisor:</span>
                <span className="text-sm ml-auto">{transcript.academic_advisor_id}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Advisor Email:</span>
                <span className="text-sm ml-auto">{transcript.academic_advisor_email}</span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">Registration ID:</span>
                <span className="text-sm ml-auto">{transcript.registration_id}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium">File ID:</span>
                <span className="text-sm ml-auto truncate max-w-[200px]" title={transcript.file_storage_id}>
                  {transcript.file_storage_id}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onClose} className="bg-white hover:bg-gray-100 border-gray-300">
              Close
            </Button>
            <Button onClick={handleOpenDocument} className="bg-orange-500 hover:bg-orange-600 text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isViewerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[80vh] rounded-lg flex flex-col overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-semibold">{transcript.title}</h3>
              <Button variant="outline" size="sm" onClick={() => setIsViewerOpen(false)}>
                Close Viewer
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 overflow-auto">
              {/* This would typically be an iframe or document viewer component */}
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-xl font-medium mb-2">Document Viewer</h4>
                  <p className="text-gray-500 mb-4">
                    This is where the document would be displayed in a real implementation.
                  </p>
                  <p className="text-sm text-gray-500">
                    Filename: {transcript.file_storage_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
