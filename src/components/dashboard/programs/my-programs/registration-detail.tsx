"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Document, Registration } from "@/lib/api/services/registration-service"
import { Matching, Equivalent } from "@/lib/api/services/registration-service"
import { useGetTemporaryLink } from "@/lib/api/hooks/use-query-hooks"
import { toast } from "react-toastify"
import { DocumentPreview } from "./document-preview"

interface RegistrationDetailProps {
  registration: Registration & { matching: Matching[] }
}

export function RegistrationDetail({ registration }: RegistrationDetailProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)

  const handleDocumentPreview = (doc: Document) => {
    // Close any existing dialogs by checking if document is already selected
    if (selectedDocumentId === doc.file_storage_id) {
      setSelectedDocumentId(null);
      setTimeout(() => {
        setSelectedDocumentId(doc.file_storage_id);
      }, 100);
    } else {
      setSelectedDocumentId(doc.file_storage_id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Program</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Nama Program</p>
              <p>{registration.activity_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Posisi</p>
              <p>Intern Position</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {registration.lo_validation}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Nama</p>
              <p>{registration.user_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">NRP</p>
              <p>{registration.user_nrp}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Semester</p>
              <p>{registration.semester}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total SKS</p>
              <p>{registration.total_sks}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Pembimbing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Dosen Pembimbing</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama</p>
                  <p>{registration.academic_advisor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{registration.academic_advisor_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status Validasi</p>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {registration.academic_advisor_validation}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Pembimbing Lapangan</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nama</p>
                  <p>{registration.mentor_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{registration.mentor_email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {registration.documents.map((doc: Document) => (
              <DocumentItem 
                key={doc.id} 
                document={doc} 
                onPreview={() => handleDocumentPreview(doc)} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mata Kuliah Ekivalensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registration.equivalents && registration.equivalents.map((match: Equivalent) => (
              <div key={match.id} className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Mata Kuliah</p>
                    <p>{match.mata_kuliah}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Kode</p>
                    <p>{match.kode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">SKS</p>
                    <p>{match.sks}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Departemen</p>
                    <p>{match.departemen}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prodi Penyelenggara</p>
                    <p>{match.prodi_penyelenggara}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Semester</p>
                    <p>{match.semester}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      {selectedDocumentId && (
        <DocumentPreview 
          documentId={selectedDocumentId} 
          onClose={() => setSelectedDocumentId(null)} 
        />
      )}
    </div>
  )
}

// DocumentItem component for individual documents with preview and download
interface DocumentItemProps {
  document: Document
  onPreview: () => void
}

function DocumentItem({ document: docItem, onPreview }: DocumentItemProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Use the temporary link hook for the file download
  const { data: fileData, isLoading: isLinkLoading, refetch } = useGetTemporaryLink(
    docItem.file_storage_id
  )

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsDownloading(true)
      
      // If we don't have the link yet, fetch it
      if (!fileData?.url) {
        await refetch()
      }
      
      // Now check if we have the URL
      if (fileData?.url) {
        // Create a temporary anchor element to trigger the download
        const link = window.document.createElement('a');
        link.href = fileData.url;
        link.target = '_blank';
        link.download = docItem.name || 'document';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      } else {
        toast.error("Failed to generate download link. Please try again.")
      }
    } catch (error) {
      toast.error("Error downloading file. Please try again later.")
      console.error("Download error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-blue-500 mr-3" />
        <div>
          <p className="font-medium">{docItem.name}</p>
          <p className="text-sm text-gray-500">{docItem.document_type}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={onPreview}
        >
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={handleDownload}
          disabled={isLinkLoading || isDownloading}
        >
          {isLinkLoading || isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-1" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
