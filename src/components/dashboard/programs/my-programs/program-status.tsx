"use client"

import { useState } from "react"
import { Eye, Pencil, Loader2, RefreshCw, Search, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RegistrationDetail } from "./registration-detail"
import { RegistrationForm } from "./registration-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Registration } from "@/lib/api/services/registration-service"
import { Matching } from "@/lib/api/services/registration-service"
import { useStudentRegistrations } from "@/lib/api/hooks"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Define a type alias for the Registration with Matching that matches what the components expect
type RegistrationWithMatching = Registration & { matching: Matching[] };

export function ProgramStatus() {
  // State for dialog controls
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithMatching | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  
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
        subject_id: equiv.subject_id,
        mata_kuliah: equiv.mata_kuliah,
        kode: equiv.kode,
        semester: equiv.semester,
        prodi_penyelenggara: equiv.prodi_penyelenggara,
        sks: equiv.sks, // Convert string to number
        kelas: equiv.kelas,
        departemen: equiv.departemen,
        tipe_mata_kuliah: equiv.tipe_mata_kuliah,
        documents: equiv.documents.map(doc => ({
          id: doc.id,
          registration_id: doc.registration_id,
          subject_id: doc.registration_id, // Using registration_id as subject_id
          file_storage_id: doc.file_storage_id,
          name: doc.name,
          document_type: doc.document_type
        }))
      })) : [];
    
    // Create the combined object
    return {
      ...registration, // Keep all properties from registration
      matching // Add the matching array, no type assertion needed since types match
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
  
  // const handleDeleteClick = (registration: Registration) => {
  //   setSelectedRegistration(convertToRegistrationWithMatching(registration));
  //   setDeleteDialogOpen(true);
  // }

  const handleDelete = () => {
    if (!selectedRegistration) return;
    
    console.log("Deleting registration:", selectedRegistration.id);
    setDeleteDialogOpen(false);
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  }

  // Filter registrations based on search term
  const filteredRegistrations = registrationsData?.data?.filter(registration => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      registration.activity_name.toLowerCase().includes(term) ||
      registration.user_name.toLowerCase().includes(term) ||
      registration.user_nrp.toLowerCase().includes(term) ||
      registration.lo_validation.toLowerCase().includes(term)
    );
  });

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

  const getStatusIconApprovalStatus = (status: boolean) => {
    if (status) {
      return <CheckCircle2 className="h-4 w-4 mr-1 bg-green-200 text-green-700 rounded-full" />;
    } else {
      return <XCircle className="h-4 w-4 mr-1 bg-red-200 text-red-700  rounded-full" />;
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-4 w-4 mr-1" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 mr-1" />;
      case "PENDING":
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="h-12 w-12 animate-spin text-[#003478] mb-4" />
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Memuat data pendaftaran...
        </motion.p>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="border rounded-lg p-6 bg-red-50 border-red-200 text-red-800"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex items-center mb-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-bold">Error loading registrations</h3>
        </motion.div>
        <motion.p 
          className="mb-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            className="mt-2 bg-white hover:bg-red-50 transition-all duration-200"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <motion.h2 
              className="text-2xl font-bold text-[#003478] mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Status Program
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Semua program anda, dalam satu laman.
            </motion.p>
          </div>
          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari program..."
                className="pl-9 w-[250px] rounded-full bg-white border-gray-300 focus:border-[#003478]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10 border-gray-300 hover:bg-blue-50 hover:text-[#003478] transition-all duration-200"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="border rounded-xl overflow-hidden shadow-sm bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Program</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Posisi</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status LO</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status Advisor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Nama Mahasiswa</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">NRP Mahasiswa</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <AnimatePresence>
                  {filteredRegistrations && filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((registration, index) => (
                      <motion.tr 
                        key={registration.id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        exit={{ opacity: 0, height: 0 }}
                        whileHover={{ backgroundColor: "rgba(0, 52, 120, 0.03)" }}
                      >
                        <td className="px-6 py-4 text-sm font-medium">{registration.activity_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">Intern Position</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center ${getStatusBadgeClass(registration.lo_validation)} px-2.5 py-1 rounded-full text-xs font-medium`}
                          >
                            {getStatusIcon(registration.lo_validation)}
                            {registration.lo_validation}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge 
                            variant="outline" 
                            className={`flex items-center ${getStatusBadgeClass(registration.academic_advisor_validation)} px-2.5 py-1 rounded-full text-xs font-medium`}
                          >
                            {getStatusIcon(registration.academic_advisor_validation)}
                            {registration.academic_advisor_validation}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 mx-auto text-sm">
                          {getStatusIconApprovalStatus(registration.approval_status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{registration.user_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{registration.user_nrp}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-[#003478] transition-colors" 
                                onClick={() => handleViewRegistration(registration)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-blue-50 hover:text-[#003478] transition-colors" 
                                onClick={() => handleEditRegistration(registration)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? (
                          <div className="flex flex-col items-center">
                            <Search className="h-8 w-8 mb-2 text-gray-400" />
                            <p className="text-lg">Tidak ada hasil untuk &quot;{searchTerm}&quot;</p>
                            <p className="text-sm text-gray-400 mt-1">Coba kata kunci lain</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                            <p className="text-lg">Belum ada data pendaftaran</p>
                            <p className="text-sm text-gray-400 mt-1">Pendaftaran program anda akan muncul di sini</p>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* View Registration Dialog */}
      <AnimatePresence>
        {viewDialogOpen && (
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto z-[100]">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#003478]">Detail Pendaftaran</DialogTitle>
              </DialogHeader>
              {selectedRegistration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegistrationDetail registration={selectedRegistration} />
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Edit Registration Dialog */}
      <AnimatePresence>
        {editDialogOpen && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto z-[100]">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#003478]">Edit Pendaftaran</DialogTitle>
              </DialogHeader>
              {selectedRegistration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegistrationForm 
                    registration={selectedRegistration} 
                    onClose={() => {
                      setEditDialogOpen(false);
                      refetch(); // Refetch data after editing
                    }} 
                  />
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-white max-w-md z-[100]">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#003478]">Konfirmasi Hapus</DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Alert className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Apakah Anda yakin ingin menghapus pendaftaran ini? Tindakan ini tidak dapat dibatalkan.</span>
                  </AlertDescription>
                </Alert>
                <DialogFooter className="mt-6 gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(false)}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Batal
                  </Button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="destructive" 
                      className="bg-red-500 hover:bg-red-600 transition-colors" 
                      onClick={handleDelete}
                    >
                      Hapus
                    </Button>
                  </motion.div>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Add ToastContainer at the bottom */}
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  )
}