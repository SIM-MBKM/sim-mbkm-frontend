"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, ExternalLink, Download, Loader2, AlertCircle } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeleteSyllabus, useGetTemporaryLink } from "@/lib/api/hooks"
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
  semester: number;
  total_sks: number;
  approval_status: boolean;
  lo_validation: string;
  academic_advisor_validation: string;
  syllabus_data: SyllabusData[] | null;
  // Optionally include other fields
  id?: string;
  user_id?: string;
  user_nrp?: string;
  user_name?: string;
  academic_advisor?: string;
  academic_advisor_email?: string;
  mentor_name?: string;
  mentor_email?: string;
}

interface SyllabusDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  registration: RegistrationWithSyllabus
}

export function SyllabusDetailModal({
  isOpen,
  onClose,
  onDelete,
  registration
}: SyllabusDetailModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const deleteSyllabusMutation = useDeleteSyllabus();
  
  const syllabus = registration.syllabus_data?.[0]
  
  // Use the hook to get temporary link for the file
  const fileId = syllabus?.file_storage_id || '';
  const { 
    data: fileData, 
    isLoading: isFileLoading, 
    error: fileError,
    refetch: refetchFileLink
  } = useGetTemporaryLink(fileId);
  
  if (!syllabus) {
    return null
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteSyllabusMutation.mutateAsync(syllabus.id);
      toast.success("Silabus berhasil dihapus!");
      setIsDeleteDialogOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      toast.error("Gagal menghapus silabus. Silakan coba lagi.");
    }
  }

  const handleOpenDocument = () => {
    if (fileData?.url) {
      window.open(fileData.url, '_blank');
    } else {
      toast.error("Gagal mendapatkan link dokumen. Silakan coba lagi.");
      refetchFileLink();
    }
  }

  const handleDownloadDocument = async () => {
    try {
      setIsDownloading(true);
      
      // If we don't have the link yet, fetch it
      if (!fileData?.url) {
        await refetchFileLink();
      }
      
      // Now check if we have the URL
      if (fileData?.url) {
        // Create a temporary anchor element to trigger the download
        const link = window.document.createElement('a');
        link.href = fileData.url;
        link.target = '_blank';
        link.download = syllabus.title || 'syllabus.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Unduhan dimulai!");
      } else {
        toast.error("Gagal mendapatkan link unduhan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh dokumen. Silakan coba lagi nanti.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white z-[100]">
          <DialogHeader>
            <DialogTitle>Detail Silabus</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-medium">{registration.activity_name}</h3>
              <p className="text-sm text-gray-500">
                Semester {registration.semester} • {registration.total_sks} SKS
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FileText className="h-10 w-10 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{syllabus.title}</h4>
                  <p className="text-sm text-gray-500">Diunggah oleh: {syllabus.user_nrp}</p>
                  <p className="text-sm text-gray-500">Pembimbing: {registration.academic_advisor}</p>
                  <p className="text-sm text-gray-500">Email Pembimbing: {syllabus.academic_advisor_email}</p>
                  
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {isFileLoading ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        disabled
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memuat dokumen...</span>
                      </Button>
                    ) : fileError ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>Gagal memuat dokumen</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => refetchFileLink()}
                        >
                          <span>Coba lagi</span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={handleOpenDocument}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Buka Dokumen</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={handleDownloadDocument}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Mengunduh...</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span>Unduh</span>
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {fileData?.expired_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Link kedaluwarsa: {new Date(fileData.expired_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between gap-2">
            <Button 
              variant="destructive" 
              className="flex items-center gap-2 text-white bg-red-500" 
              onClick={handleDeleteClick}
              disabled={deleteSyllabusMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span>{deleteSyllabusMutation.isPending ? "Menghapus..." : "Hapus Silabus"}</span>
            </Button>
            <Button onClick={onClose}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white z-[200]">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Silabus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus silabus ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 