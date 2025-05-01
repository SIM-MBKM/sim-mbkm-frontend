"use client"

import { Suspense, useState } from "react"
import { ExternalLink, FileText, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { ProgramSubmissionForm } from "./program-submission-form"
import { ReactQueryProvider } from "@/lib/api/providers/query-provider";
// import { useAllProgramTypes } from '@/lib/api/hooks'
import { motion } from "framer-motion"

export function ProgramSubmission() {
  const [showForm, setShowForm] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-8 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-2xl md:text-2xl font-bold text-gray-800 mb-2"
          >
            Tidak Menemukan Program?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-gray-600 mb-4"
          >
            Anda dapat mengajukan program yang tidak terdaftar secara manual sesuai dengan peraturan yang berlaku.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3 flex-1"
              whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">Guide Mengajukan Program</h3>
                <p className="text-sm text-blue-700 mb-2">
                  Pelajari cara mengajukan program MBKM sesuai ketentuan
                </p>
                <a 
                  href="https://www.example.com/id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 font-medium hover:underline"
                >
                  Lihat Panduan
                  <motion.span
                    animate={{ x: isHovered ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </motion.span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px] gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Ajukan Program Baru
          </Button>
        </motion.div>
      </div>

      <ReactQueryProvider>
        <Suspense fallback={
          <div className="mt-4 flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        }>
          {showForm && <ProgramSubmissionForm onClose={() => setShowForm(false)} />}
        </Suspense>
      </ReactQueryProvider>
    </motion.div>
  )
}
