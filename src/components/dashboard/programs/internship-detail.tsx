"use client"

import Image from "next/image"
import { Calendar, MapPin, Building2, Tag, School, Clock, BookOpen, ExternalLink, Bookmark, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Activity } from "@/lib/api/services/activity-service"
import { useRouter } from "next/navigation"
import { useCheckEligibility } from "@/lib/api/hooks"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { motion } from "framer-motion"

interface InternshipDetailProps {
  internship: Activity;
}

export function InternshipDetail({ internship }: InternshipDetailProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Use the eligibility check hook without storing unused data
  const { refetch: checkEligibility } = useCheckEligibility(internship.id);
  
  // Check if matching data exists
  const hasMatchings = internship.matching && internship.matching.length > 0;
  
  // Navigate to registration form with eligibility check
  const handleRegisterClick = async () => {
    setIsChecking(true);
    
    try {
      const result = await checkEligibility();
      
      if (result.data && result.data.data) {
        // Check if eligible based on the response (as boolean)
        if (result.data.data.eligible === false) {
          // Show toast with the message if not eligible
          toast.error(result.data.data.message);
        } else {
          // Redirect to registration form if eligible
          router.push(`/dashboard/mahasiswa/programs/${internship.id}`);
        }
      } else {
        // Handle error case
        toast.error("Failed to check eligibility. Please try again.");
      }
    } catch (error) {
      console.error("Eligibility check error:", error);
      toast.error("Error checking eligibility. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Program removed from saved items" : "Program saved successfully");
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border rounded-lg shadow-sm overflow-hidden"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
        <div className="flex items-start gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm"
          >
            <Image
              src="/logo.png?height=70&width=70&text=Icon"
              alt="Company Logo"
              width={70}
              height={70}
              className="rounded-md"
            />
          </motion.div>
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-gray-800"
            >
              {internship.name}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 font-medium"
            >
              {internship.program_provider}
            </motion.p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
              {internship.location && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{internship.location}</span>
                </motion.div>
              )}
              
              {internship.program_type && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <Tag className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{internship.program_type}</span>
                </motion.div>
              )}
              
              {internship.months_duration && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{internship.months_duration} bulan</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 p-6 border-b">
        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          className="flex-1"
        >
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleRegisterClick}
            disabled={isChecking}
          >
            {isChecking ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memeriksa Eligibilitas...
              </span>
            ) : (
              "Daftar Program"
            )}
          </Button>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            onClick={toggleSave}
            className={isSaved ? "text-blue-600 border-blue-200 bg-blue-50" : ""}
          >
            <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
            {isSaved ? "Tersimpan" : "Simpan"}
          </Button>
        </motion.div>
      </div>

      {/* Details Section */}
      <div className="p-6 border-b">
        <motion.h3 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-bold mb-4"
        >
          Detail Program
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm text-gray-500 mb-2 font-medium">Deskripsi Program</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {internship.description || "Tidak ada deskripsi program tersedia."}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-sm text-gray-500 mb-2 font-medium">Informasi Program</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Building2 className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Penyelenggara</p>
                    <p className="text-sm text-gray-700">{internship.program_provider || "Tidak tersedia"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <School className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Level & Group</p>
                    <p className="text-sm text-gray-700">
                      {internship.level || "Unknown"} • {internship.group || "Unknown"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Tahun Akademik</p>
                    <p className="text-sm text-gray-700">{internship.academic_year || "Tidak tersedia"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {internship.web_portal && (
              <div>
                <h4 className="text-sm text-gray-500 mb-2 font-medium">Web Portal</h4>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-gray-700" />
                  <a 
                    href={internship.web_portal} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {internship.web_portal}
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="p-6">
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 mb-4"
        >
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold">Mata Kuliah Relevan</h3>
        </motion.div>
        
        {hasMatchings ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {internship.matching.map((matching, index) => (
              <motion.div 
                key={matching.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-white transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">{matching.kode}</p>
                    <p className="font-medium text-gray-800">{matching.mata_kuliah}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    {matching.sks} SKS
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Semester {matching.semester} • {matching.prodi_penyelenggara}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center p-6 bg-gray-50 rounded-lg border"
          >
            <p className="text-gray-500">Tidak ada data mata kuliah yang relevan untuk program ini.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
