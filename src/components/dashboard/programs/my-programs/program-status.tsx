"use client"

import { useState } from "react"
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RegistrationDetail } from "./registration-detail"
import { RegistrationForm } from "./registration-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Registration } from "@/lib/api/services/registration-service"
import { Matching } from "@/lib/api/services/activity-service"
import { useStudentRegistrations } from "@/lib/api/hooks"

// Define a type alias for the Registration with Matching that matches what the components expect
type RegistrationWithMatching = Registration & { matching: Matching[] };

export function ProgramStatus() {
  // State for dialog controls
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithMatching | null>(null)
  
  // Fetch student registrations using the hook
  const {
    data: registrationsData,
    isLoading,
    error,
    refetch
  } = useStudentRegistrations(1, 10)
  
  // This function converts a regular Registration to RegistrationWithMatching
  // In a real application, you'd fetch the matching data or it would be included in the API response
  const convertToRegistrationWithMatching = (registration: Registration): RegistrationWithMatching => {
    // Create a matching array from the equivalents data if available
    const matching: Matching[] = registration.equivalents ? 
      registration.equivalents.map(equiv => ({
        id: equiv.id,
        mata_kuliah: equiv.mata_kuliah,
        kode: equiv.kode,
        semester: equiv.semester,
        prodi_penyelenggara: equiv.prodi_penyelenggara,
        sks: parseInt(equiv.sks), // Convert string to number
        kelas: equiv.kelas,
        departemen: equiv.departemen,
        tipe_mata_kuliah: equiv.tipe_mata_kuliah,
        document: equiv.documents.map(doc => ({
          id: doc.id,
          subject_id: doc.registration_id, // Using registration_id as subject_id
          file_storage_id: doc.file_storage_id,
          name: doc.name,
          document_type: doc.document_type
        }))
      })) : [];
    
    // Create the combined object
    return {
      ...registration, // Keep all properties from registration
      matching        // Add the matching array
    };
  };
  
  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(convertToRegistrationWithMatching(registration));
    setViewDialogOpen(true);
  }
  
  const handleEditRegistration = (registration: Registration) => {
    setSelectedRegistration(convertToRegistrationWithMatching(registration));
    setEditDialogOpen(true);
  }
  
  const handleDeleteClick = (registration: Registration) => {
    setSelectedRegistration(convertToRegistrationWithMatching(registration));
    setDeleteDialogOpen(true);
  }

  const handleDelete = () => {
    if (!selectedRegistration) return;
    
    console.log("Deleting registration:", selectedRegistration.id);
    setDeleteDialogOpen(false);
    // Here you would typically call an API to delete the registration
    // After successful deletion, refetch the data
    // Example: await deleteRegistration(selectedRegistration.id)
    // Then refetch:
    // refetch()
  }

  // Helper function to get appropriate color for validation status badge
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-50 text-green-700 border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      case "PENDING":
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#003478] mb-4" />
        <p className="text-gray-600">Memuat data pendaftaran...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="border rounded-lg p-6 bg-red-50 border-red-200 text-red-800">
        <h3 className="font-bold mb-2">Error loading registrations</h3>
        <p>{error instanceof Error ? error.message : "Unknown error occurred"}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#003478] mb-2">Status Program</h2>
        <p className="text-gray-600 mb-4">Semua program anda, dalam satu laman.</p>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Program</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Posisi</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nama Mahasiswa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">NRP Mahasiswa</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrationsData && registrationsData.data && registrationsData.data.length > 0 ? (
                  registrationsData.data.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-4 py-3 text-sm">{registration.activity_name}</td>
                      <td className="px-4 py-3 text-sm">Intern Position</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className={getStatusBadgeClass(registration.lo_validation)}>
                          {registration.lo_validation}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{registration.user_name}</td>
                      <td className="px-4 py-3 text-sm">{registration.user_nrp}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleViewRegistration(registration)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleEditRegistration(registration)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteClick(registration)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No registration data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Registration Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl bg-white z-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedRegistration && <RegistrationDetail registration={selectedRegistration} />}
        </DialogContent>
      </Dialog>

      {/* Edit Registration Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-white z-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Pendaftaran</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <RegistrationForm 
              registration={selectedRegistration} 
              onClose={() => {
                setEditDialogOpen(false);
                refetch(); // Refetch data after editing
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white z-100">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <AlertDescription>
              Apakah Anda yakin ingin menghapus pendaftaran ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDescription>
          </Alert>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
