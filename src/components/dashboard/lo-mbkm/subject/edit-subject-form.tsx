"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUpdateSubject } from "@/lib/api/hooks/use-query-hooks"
import { toast } from "react-toastify"
import type { Subject } from "@/lib/api/services/matching-service"

interface EditSubjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subject: Subject
  onSuccess?: () => void
}

export function EditSubjectForm({ open, onOpenChange, subject, onSuccess }: EditSubjectFormProps) {
  const [step, setStep] = useState(1)
  const updateSubjectMutation = useUpdateSubject()

  // Form state
  const [formData, setFormData] = useState({
    kode: subject.kode,
    mata_kuliah: subject.mata_kuliah,
    semester: subject.semester,
    prodi_penyelenggara: subject.prodi_penyelenggara,
    sks: Number(subject.sks.toString()),
    kelas: subject.kelas,
    departemen: subject.departemen,
    tipe_mata_kuliah: subject.tipe_mata_kuliah,
  })

  const updateFormData = (field: string, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.kode || !formData.mata_kuliah || !formData.prodi_penyelenggara) {
        toast.error("Please fill in all required fields.")
        return false
      }
    } else if (step === 2) {
      if (!formData.departemen || !formData.sks) {
        toast.error("Please fill in all required fields.")
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    try {
      await updateSubjectMutation.mutateAsync({
        id: subject.id,
        subjectInput: {
          ...formData,
          sks: Number(formData.sks),
        }
      })

      toast.success("Subject has been updated successfully.")

      if (onSuccess) {
        onSuccess()
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update subject:", error)
      toast.error("Failed to update subject. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === stepNumber
                      ? "bg-purple-600 text-white"
                      : step > stepNumber
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span className="text-xs mt-1">
                  {stepNumber === 1 ? "Basic Info" : stepNumber === 2 ? "Details" : "Document"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-purple-600"
              initial={{ width: `${((step - 1) / 2) * 100}%` }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Code</Label>
              <Input
                id="kode"
                value={formData.kode}
                onChange={(e) => updateFormData("kode", e.target.value)}
                placeholder="EF234722"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mata_kuliah">Course Name</Label>
              <Input
                id="mata_kuliah"
                value={formData.mata_kuliah}
                onChange={(e) => updateFormData("mata_kuliah", e.target.value)}
                placeholder="Magang"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <RadioGroup
                value={formData.semester}
                onValueChange={(value) => updateFormData("semester", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GANJIL" id="ganjil" />
                  <Label htmlFor="ganjil">Ganjil</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GENAP" id="genap" />
                  <Label htmlFor="genap">Genap</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prodi_penyelenggara">Study Program</Label>
              <Input
                id="prodi_penyelenggara"
                value={formData.prodi_penyelenggara}
                onChange={(e) => updateFormData("prodi_penyelenggara", e.target.value)}
                placeholder="S-1 Teknik Informatika"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sks">Credits (SKS)</Label>
              <Input
                id="sks"
                type="number"
                value={formData.sks}
                onChange={(e) => updateFormData("sks", e.target.value)}
                placeholder="6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelas">Class</Label>
              <RadioGroup
                value={formData.kelas}
                onValueChange={(value) => updateFormData("kelas", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mbkm" id="mbkm" />
                  <Label htmlFor="mbkm">MBKM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular">Regular</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departemen">Department</Label>
              <Input
                id="departemen"
                value={formData.departemen}
                onChange={(e) => updateFormData("departemen", e.target.value)}
                placeholder="Teknik Informatika"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipe_mata_kuliah">Course Type</Label>
              <RadioGroup
                value={formData.tipe_mata_kuliah}
                onValueChange={(value) => updateFormData("tipe_mata_kuliah", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wajib" id="wajib" />
                  <Label htmlFor="wajib">Wajib</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pilihan prodi" id="pilihan_prodi" />
                  <Label htmlFor="pilihan_prodi">Pilihan Prodi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pilihan" id="pilihan" />
                  <Label htmlFor="pilihan">Pilihan</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-md">
              <h4 className="font-medium mb-3">Subject Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Code:</div>
                  <div>{formData.kode}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Course Name:</div>
                  <div>{formData.mata_kuliah}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Semester:</div>
                  <div>{formData.semester}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Study Program:</div>
                  <div>{formData.prodi_penyelenggara}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Credits:</div>
                  <div>{formData.sks} SKS</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Class:</div>
                  <div>{formData.kelas}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Department:</div>
                  <div>{formData.departemen}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Course Type:</div>
                  <div>{formData.tipe_mata_kuliah}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {step < 3 ? (
            <Button onClick={nextStep} className="flex items-center gap-1">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={updateSubjectMutation.isLoading} className="flex items-center gap-1">
              {updateSubjectMutation.isLoading ? "Saving..." : "Submit"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
