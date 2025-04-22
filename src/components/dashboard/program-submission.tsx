"use client"

import { useState } from "react"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { ProgramSubmissionForm } from "./program-submission-form"
// import { useAllProgramTypes } from '@/lib/api/hooks'

export function ProgramSubmission() {
  const [showForm, setShowForm] = useState(false)

  

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-2xl font-bold mb-2">Ajukan Program.</h2>
      <p className="text-gray-700 mb-6">
        Tidak menemukan program yang anda cari? Ajukan secara manual dengan peraturan yang berlaku.
      </p>

      <div className="flex flex-row items-center w-72 border-gray-200 border-[3px] rounded-lg shadow-sm p-2 relative">
        <Link className="h-5 w-5" />
        <div className="flex flex-col items-start justify-center">
            <div className="inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 -top-6">
              <span className="text-xs text-gray-500">Guide Mengajukan Program</span>
            </div>
            <a className="bg-white pl-3" href="https://www.example.com/id" type="url" >
              https://www.example.com/id
            </a>
          </div>
      </div>

      {/* <div className="mb-6 bg-amber-600">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            
          </div>
          
        </div>
      </div> */}

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          onClick={() => setShowForm(true)}
        >
          Ajukan Program Lain
        </Button>
      </div>

      {showForm && <ProgramSubmissionForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
