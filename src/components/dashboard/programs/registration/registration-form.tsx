"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Link, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRegisterForProgram } from "@/lib/api/hooks"
import { Activity } from "@/lib/api/services/activity-service"
import { RegisterInput } from "@/lib/api/services/registration-service"
import { useRouter } from "next/navigation"
import { toast, ToastContainer, ToastOptions } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

interface RegistrationFormProps {
  activity: Activity
}

export function RegistrationForm({ activity }: RegistrationFormProps) {
  const router = useRouter()
  const { mutate: registerForProgram, isLoading } = useRegisterForProgram()
  
  // Configure toast
  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  
  const [formData, setFormData] = useState({
    activityId: activity.id,
    academic_advisor_id: "",
    advising_confirmation: true,
    academic_advisor_email: "",
    academic_advisor: "",
    mentor_name: "",
    mentor_email: "",
    semester: "",
    total_sks: "",
    acceptanceLetter: null as File | null,
    geoletter: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target

    if (files && (name === "acceptanceLetter" || name === "geoletter")) {
      setFormData({
        ...formData,
        [name]: files[0],
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!formData.academic_advisor || !formData.academic_advisor_email) {
      toast.error("Mohon lengkapi data dosen pembimbing", toastOptions)
      return
    }
    
    if (!formData.mentor_name || !formData.mentor_email) {
      toast.error("Mohon lengkapi data pembimbing lapangan", toastOptions)
      return
    }
    
    if (!formData.semester || !formData.total_sks) {
      toast.error("Mohon lengkapi data semester dan total SKS", toastOptions)
      return
    }
    
    // Prepare data for submission with proper typing
    const submissionData: RegisterInput = {
      activityId: formData.activityId,
      academic_advisor_id: formData.academic_advisor_id || formData.activityId, // fallback
      advising_confirmation: formData.advising_confirmation,
      academic_advisor_email: formData.academic_advisor_email,
      academic_advisor: formData.academic_advisor,
      mentor_name: formData.mentor_name,
      mentor_email: formData.mentor_email,
      semester: parseInt(formData.semester),
      total_sks: parseInt(formData.total_sks),
    };
    
    // Add files only if they exist
    if (formData.acceptanceLetter) {
      submissionData.acceptanceLetter = formData.acceptanceLetter;
    }
    
    if (formData.geoletter) {
      submissionData.geoletter = formData.geoletter;
    }
    
    registerForProgram(submissionData, {
      onSuccess: () => {
        toast.success("Pendaftaran berhasil dikirim!", toastOptions)
        // Redirect to dashboard after success
        setTimeout(() => {
          router.push("/dashboard/mahasiswa/programs")
        }, 2000)
      },
      onError: (error) => {
        toast.error(`Pendaftaran gagal: ${error.message}`, toastOptions)
      }
    })
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-white mt-15 border rounded-lg p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <Image
              src="/logo.png?height=60&width=60&text=Icon"
              alt="Company Logo"
              width={60}
              height={60}
              className="rounded-full bg-gray-200"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{activity.name}</h2>
            <p className="text-gray-700">{activity.program_provider}</p>
            <p className="text-gray-700">{activity.location} ({activity.activity_type})</p>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Program Type: {activity.program_type || "Unknown"}</p>
              <p className="text-sm text-gray-600">Level: {activity.level || "Unknown"}</p>
              <p className="text-sm text-gray-600">Group: {activity.group || "Unknown"}</p>
              <p className="text-sm text-gray-600">Academic Year: {activity.academic_year || "Unknown"}</p>
              <p className="text-sm text-gray-600">Duration: {activity.months_duration || 0} months</p>
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-gray-50">
          <AlertDescription>
            Anda akan melakukan pendaftaran untuk posisi ini. Harap kembali membaca detail posisi dengan teliti.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4 mb-6">
          {activity.web_portal && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Link Detail</p>
              <div className="flex items-center gap-2">
                <Link className="h-5 w-5 text-gray-700" />
                <a 
                  href={activity.web_portal} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-gray-700 hover:underline"
                >
                  {activity.web_portal}
                </a>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <Alert className="mb-4 bg-gray-50">
            <AlertDescription>
              Mohon untuk mencantumkan nama dosen pembimbing beserta kontak atau email dosen pembimbing.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="academic_advisor">Nama Dosen Pembimbing</Label>
              <Input
                id="academic_advisor"
                name="academic_advisor"
                value={formData.academic_advisor}
                onChange={handleChange}
                placeholder="Nama Dosen Pembimbing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic_advisor_email">Kontak Dosen Pembimbing</Label>
              <Input
                id="academic_advisor_email"
                name="academic_advisor_email"
                value={formData.academic_advisor_email}
                onChange={handleChange}
                placeholder="Email Dosen Pembimbing"
                type="email"
                required
              />
            </div>
          </div>

          <Alert className="mb-4 bg-gray-50">
            <AlertDescription>
              Mohon untuk mencantumkan nama pembimbing lapangan beserta kontak atau email pembimbing lapangan.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="mentor_name">Nama Pembimbing Lapangan</Label>
              <Input
                id="mentor_name"
                name="mentor_name"
                value={formData.mentor_name}
                onChange={handleChange}
                placeholder="Nama Pembimbing Lapangan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor_email">Kontak Pembimbing Lapangan</Label>
              <Input
                id="mentor_email"
                name="mentor_email"
                value={formData.mentor_email}
                onChange={handleChange}
                placeholder="Email Pembimbing Lapangan"
                type="email"
                required
              />
            </div>
          </div>

          {/* Additional fields from the second image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="Semester saat ini"
                type="number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_sks">Total SKS</Label>
              <Input
                id="total_sks"
                name="total_sks"
                value={formData.total_sks}
                onChange={handleChange}
                placeholder="Total SKS yang telah ditempuh"
                type="number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="acceptanceLetter">Dokumen Pendukung</Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <Upload className="h-5 w-5 text-gray-500" />
                <Input
                  id="acceptanceLetter"
                  name="acceptanceLetter"
                  type="file"
                  onChange={handleChange}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <p className="text-xs text-gray-500">Format: PDF, DOCX (Maks. 5MB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="geoletter">Surat Geolokasi</Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <Upload className="h-5 w-5 text-gray-500" />
                <Input
                  id="geoletter"
                  name="geoletter"
                  type="file"
                  onChange={handleChange}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <p className="text-xs text-gray-500">Format: PDF, DOCX (Maks. 5MB)</p>
            </div>
          </div>

          <Alert className="mb-6 bg-gray-50">
            <AlertDescription>
              Apabila ingin membatalkan pendaftaran maka dibutuhkan persetujuan dosen pembimbing.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-[#003478] hover:bg-[#00275a]"
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Daftar Program"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
