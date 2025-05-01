"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Trash2, ExternalLink } from "lucide-react"
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
import { useDeleteTranscript } from "@/lib/api/hooks"
import { toast } from "react-toastify"

// Define TranscriptData interface
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

// Define RegistrationWithTranscript interface
interface RegistrationWithTranscript {
  registration_id: string;
  activity_id: string;
  activity_name: string;
  semester: number;
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
  academic_advisor?: string;
  academic_advisor_email?: string;
  mentor_name?: string;
  mentor_email?: string;
}

interface TranscriptDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  registration: RegistrationWithTranscript
}

export function TranscriptDetailModal({
  isOpen,
  onClose,
  onDelete,
  registration
}: TranscriptDetailModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const deleteTranscriptMutation = useDeleteTranscript();
  
  const transcript = registration.transcript_data?.[0]
  
  if (!transcript) {
    return null
  }

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteTranscriptMutation.mutateAsync(transcript.id);
      toast.success("Transkrip berhasil dihapus!");
      setIsDeleteDialogOpen(false);
      onDelete();
    } catch (error) {
      console.error("Error deleting transcript:", error);
      toast.error("Gagal menghapus transkrip. Silakan coba lagi.");
    }
  }

  const fileUrl = transcript.file_storage_id.startsWith('http') 
    ? transcript.file_storage_id 
    : `${process.env.NEXT_PUBLIC_API_URL}/storage/${transcript.file_storage_id}`

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white z-100">
          <DialogHeader>
            <DialogTitle>Detail Transkrip</DialogTitle>
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
                <div>
                  <h4 className="font-medium">{transcript.title}</h4>
                  <p className="text-sm text-gray-500">Diunggah oleh: {transcript.user_nrp}</p>
                  <p className="text-sm text-gray-500">Pembimbing: {registration.academic_advisor}</p>
                  <p className="text-sm text-gray-500">Email Pembimbing: {transcript.academic_advisor_email}</p>
                  
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => window.open(fileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Buka Dokumen</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-between gap-2">
            <Button 
              variant="destructive" 
              className="flex items-center gap-2 text-white bg-red-500" 
              onClick={handleDeleteClick}
              disabled={deleteTranscriptMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              <span >{deleteTranscriptMutation.isPending ? "Menghapus..." : "Hapus Transkrip"}</span>
            </Button>
            <Button onClick={onClose}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white z-200">
          <AlertDialogHeader >
            <AlertDialogTitle >Hapus Transkrip</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transkrip ini? Tindakan ini tidak dapat dibatalkan.
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