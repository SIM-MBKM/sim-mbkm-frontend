"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface SubjectFiltersProps {
  filters: {
    kode: string
    mata_kuliah: string
    semester: string
    prodi_penyelenggara: string
    kelas: string
    departemen: string
    tipe_mata_kuliah: string
  }
  onFilterChange: (filterName: string, value: string) => void
  onClearFilters: () => void
}

export function SubjectFilters({ filters, onFilterChange, onClearFilters }: SubjectFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFilterChange(name, value)
  }

  const handleSelectChange = (name: string, value: string) => {
    onFilterChange(name, value)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="overflow-hidden">
      <CardContent className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-2 h-8 px-2 text-xs">
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Filters
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="kode">Code</Label>
              <Input id="kode" name="kode" placeholder="EF234722" value={filters.kode} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mata_kuliah">Course Name</Label>
              <Input
                id="mata_kuliah"
                name="mata_kuliah"
                placeholder="Sistem Basis Data"
                value={filters.mata_kuliah}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={filters.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="GANJIL">Ganjil</SelectItem>
                  <SelectItem value="GENAP">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prodi_penyelenggara">Study Program</Label>
              <Input
                id="prodi_penyelenggara"
                name="prodi_penyelenggara"
                placeholder="S-1 Teknik Informatika"
                value={filters.prodi_penyelenggara}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kelas">Class</Label>
              <Select value={filters.kelas} onValueChange={(value) => handleSelectChange("kelas", value)}>
                <SelectTrigger id="kelas">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="mbkm">MBKM</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departemen">Department</Label>
              <Input
                id="departemen"
                name="departemen"
                placeholder="Teknik Informatika"
                value={filters.departemen}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipe_mata_kuliah">Course Type</Label>
              <Select
                value={filters.tipe_mata_kuliah}
                onValueChange={(value) => handleSelectChange("tipe_mata_kuliah", value)}
              >
                <SelectTrigger id="tipe_mata_kuliah">
                  <SelectValue placeholder="Select course type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pilihan prodi">Pilihan Prodi</SelectItem>
                  <SelectItem value="wajib">Wajib</SelectItem>
                  <SelectItem value="pilihan">Pilihan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
