"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Registration } from "@/lib/api/services/registration-service"
import { Matching } from "@/lib/api/services/registration-service"
import { useUpdateRegistrationStudentById } from "@/lib/api/hooks"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

interface RegistrationFormProps {
  registration: Registration & { matching: Matching[] }
  onClose: () => void
}

export function RegistrationForm({ registration, onClose }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    academic_advisor: registration.academic_advisor,
    academic_advisor_email: registration.academic_advisor_email,
    mentor_name: registration.mentor_name,
    mentor_email: registration.mentor_email,
    semester: registration.semester,
    total_sks: registration.total_sks,
    academic_advisor_validation: registration.academic_advisor_validation,
    lo_validation: registration.lo_validation,
    approval_status: registration.approval_status,
    academic_advisor_id: registration.academic_advisor_id,
    advising_confirmation: registration.advising_confirmation || true,
  })

  // Initialize the update registration mutation
  const { mutate: updateRegistration, isLoading } = useUpdateRegistrationStudentById()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format the data for the API
    const updateData = {
      academic_advisor: formData.academic_advisor,
      academic_advisor_email: formData.academic_advisor_email,
      mentor_name: formData.mentor_name,
      mentor_email: formData.mentor_email,
      semester: Number(formData.semester),
      total_sks: Number(formData.total_sks),
      academic_advisor_validation: registration.academic_advisor_validation,
      lo_validation: registration.lo_validation,
      approval_status: registration.approval_status,
      academic_advisor_id: registration.academic_advisor_id,
      advising_confirmation: formData.advising_confirmation,
    }
    
    // Call the update mutation
    updateRegistration(
      { 
        id: registration.id, 
        registrationInput: updateData 
      },
      {
        onSuccess: () => {
          toast.success("Data pendaftaran berhasil diperbarui");
          // Add delay before closing modal to ensure toast is visible
          setTimeout(() => {
            onClose();
          }, 1500);
        },
        onError: (error) => {
          toast.error(`Gagal memperbarui data: ${error instanceof Error ? error.message : "Unknown error"}`);
          console.error("Error updating registration:", error);
        }
      }
    )
  }

  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Dosen Pembimbing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academic_advisor">Nama Dosen Pembimbing</Label>
                <Input
                  id="academic_advisor"
                  name="academic_advisor"
                  value={formData.academic_advisor}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_advisor_email">Email Dosen Pembimbing</Label>
                <Input
                  id="academic_advisor_email"
                  name="academic_advisor_email"
                  type="email"
                  value={formData.academic_advisor_email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Pembimbing Lapangan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mentor_name">Nama Pembimbing Lapangan</Label>
                <Input id="mentor_name" name="mentor_name" value={formData.mentor_name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor_email">Email Pembimbing Lapangan</Label>
                <Input
                  id="mentor_email"
                  name="mentor_email"
                  type="email"
                  value={formData.mentor_email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Informasi Akademik</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" name="semester" type="number" value={formData.semester} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_sks">Total SKS</Label>
                <Input id="total_sks" name="total_sks" type="number" value={formData.total_sks} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" className="bg-[#003478] text-white hover:bg-[#00275a]" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
