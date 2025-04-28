"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"
import { Registration } from "@/lib/api/services/registration-service"
import { Matching } from "@/lib/api/services/activity-service"

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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your API
    onClose()
  }

  return (
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
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" className="bg-[#003478] text-white hover:bg-[#00275a]">
          Simpan
        </Button>
      </DialogFooter>
    </form>
  )
}
