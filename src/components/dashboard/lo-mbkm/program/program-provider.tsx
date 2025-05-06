"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { sampleData } from "@/lib/sample-data"
import { Activity } from "@/lib/api/services";

// Define the Program type
export type Program = {
  id: string
  name: string
  description: string
  start_period: string
  months_duration: number
  activity_type: string
  location: string
  web_portal: string
  academic_year: string
  program_provider: string
  program_type: string
  level: string
  group: string
  approval_status: "PENDING" | "APPROVED" | "REJECTED"
  created_at: string
  updated_at: string
  participants: number
  completion_rate: number
  satisfaction_score: number
}

// Define the context type
type ProgramContextType = {
  programs: Program[]
  loading: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  addProgram: (program: Omit<Program, "id" | "created_at" | "updated_at">) => void
  updateProgram: (id: string, updates: Partial<Program>) => void
  deleteProgram: (id: string) => void
  getProgram: (id: string) => Program | undefined
}

// Create the context
const ProgramContext = createContext<ProgramContextType | undefined>(undefined)

// Create a provider component
export function ProgramProvider({ children }: { children: ReactNode }) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load sample data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Transform sample data to match our Program type
      const transformedPrograms = sampleData.data.map((item: Activity) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || "No description available",
        start_period: item.start_period || new Date().toISOString().split("T")[0],
        months_duration: item.months_duration || Math.floor(Math.random() * 12) + 1,
        activity_type: item.activity_type || "Research",
        location: item.location || "Online",
        web_portal: item.web_portal || "https://example.com",
        academic_year: item.academic_year || "2023-2024",
        program_provider: item.program_provider || "University",
        program_type: item.program_type || "Exchange",
        level: item.level || "Undergraduate",
        group: "Default",
        approval_status: "PENDING", 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participants: Math.floor(Math.random() * 100) + 10,
        completion_rate: Math.floor(Math.random() * 100),
        satisfaction_score: (Math.floor(Math.random() * 50) + 50) / 10,
      })) as Program[]

      setPrograms(transformedPrograms)
      setLoading(false)
      setTotalPages(Math.ceil(transformedPrograms.length / 10))
    }, 1000)
  }, [])

  // Add a new program
  const addProgram = (program: Omit<Program, "id" | "created_at" | "updated_at">) => {
    const now = new Date().toISOString()
    const newProgram: Program = {
      ...program,
      id: `program-${Date.now()}`,
      created_at: now,
      updated_at: now,
    }

    setPrograms((prev) => [newProgram, ...prev])
  }

  // Update an existing program
  const updateProgram = (id: string, updates: Partial<Program>) => {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id
          ? {
              ...program,
              ...updates,
              updated_at: new Date().toISOString(),
            }
          : program,
      ),
    )
  }

  // Delete a program
  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((program) => program.id !== id))
  }

  // Get a program by ID
  const getProgram = (id: string) => {
    return programs.find((program) => program.id === id)
  }

  // Context value
  const value = {
    programs,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    addProgram,
    updateProgram,
    deleteProgram,
    getProgram,
  }

  return <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
}

// Create a hook to use the context
export function usePrograms() {
  const context = useContext(ProgramContext)
  if (context === undefined) {
    throw new Error("usePrograms must be used within a ProgramProvider")
  }
  return context
}
