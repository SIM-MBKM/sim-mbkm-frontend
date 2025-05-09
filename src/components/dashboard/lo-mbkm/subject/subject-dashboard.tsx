"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Plus, FileText, Book, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubjectCard } from "./subject-card"
import { SubjectForm } from "./subject-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "./pagination"
import { SubjectFilters } from "./subject-filters"
import type { Subject } from "@/lib/api/services/matching-service"
import { EditSubjectForm } from "./edit-subject-form"
import { 
  useSubjects, 
  useSubjectsGeofisika, 
  useSubjectsNonGeofisika, 
  useTotalSubjects,
  useDeleteSubject 
} from "@/lib/api/hooks/use-query-hooks"
import { toast } from "react-toastify"

export function SubjectsDashboard() {
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(2)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    kode: "",
    mata_kuliah: "",
    semester: "",
    prodi_penyelenggara: "",
    kelas: "",
    departemen: "",
    tipe_mata_kuliah: "",
  })
  const [activeTab, setActiveTab] = useState("all-departments")

  // Use the hooks from use-query-hooks
  const { data: subjectsData, isLoading: isLoadingAll } = useSubjects({
    page: currentPage,
    limit: itemsPerPage,
    subjectFilter: {
      ...filters,
      mata_kuliah: searchTerm || filters.mata_kuliah
    }
  })

  const { data: geofisikaData, isLoading: isLoadingGeofisika } = useSubjectsGeofisika({
    page: currentPage,
    limit: itemsPerPage,
    subjectFilter: {
      ...filters,
      mata_kuliah: searchTerm || filters.mata_kuliah,
      departemen: "Teknik Geofisika" // Ensure we only get Geofisika subjects
    }
  })

  const { data: nonGeofisikaData, isLoading: isLoadingNonGeofisika } = useSubjectsNonGeofisika({
    page: currentPage,
    limit: itemsPerPage,
    subjectFilter: {
      ...filters,
      mata_kuliah: searchTerm || filters.mata_kuliah,
      departemen: filters.departemen || "" // Allow filtering by department
    }
  })

  const { data: totalSubjectsData } = useTotalSubjects()

  const deleteSubjectMutation = useDeleteSubject()

  // Get the appropriate data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "teknik-geofisika":
        return geofisikaData
      case "other-departments":
        return nonGeofisikaData
      default:
        return subjectsData
    }
  }

  // Get the loading state based on active tab
  const isLoading = () => {
    switch (activeTab) {
      case "teknik-geofisika":
        return isLoadingGeofisika
      case "other-departments":
        return isLoadingNonGeofisika
      default:
        return isLoadingAll
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilters({
      kode: "",
      mata_kuliah: "",
      semester: "",
      prodi_penyelenggara: "",
      kelas: "",
      departemen: "",
      tipe_mata_kuliah: "",
    })
    setCurrentPage(1) // Reset to first page when clearing filters
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
    // Reset filters when changing tabs
    setFilters({
      kode: "",
      mata_kuliah: "",
      semester: "",
      prodi_penyelenggara: "",
      kelas: "",
      departemen: "",
      tipe_mata_kuliah: "",
    })
    setSearchTerm("")
  }

  const handleAddSubject = () => {
    setShowSubjectForm(true)
  }

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setShowEditForm(true)
  }

  const handleDeleteSubject = async (subject: Subject) => {
    try {
      await deleteSubjectMutation.mutateAsync(subject.id)
      toast.success(`Subject "${subject.mata_kuliah}" has been deleted.`)
    } catch (error) {
      console.error("Failed to delete subject:", error)
      toast.error("Failed to delete subject. Please try again.")
    }
  }

  // Get department totals from totalSubjectsData
  const getDepartmentTotal = (department: string) => {
    if (!totalSubjectsData?.data) return "0"
    const deptData = totalSubjectsData.data.find(d => d.departemen.toLowerCase() === department.toLowerCase())
    return deptData?.total || "0"
  }

  const statsData = [
    {
      title: "Total Subjects",
      value: totalSubjectsData?.data?.reduce((acc, curr) => acc + curr.total, 0) || 0,
      icon: <Book className="h-4 w-4 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Teknik Geofisika",
      value: getDepartmentTotal("Teknik Geofisika"),
      icon: <FileText className="h-4 w-4 text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Other Departments",
      value: totalSubjectsData?.data?.reduce((acc, curr) => 
        curr.departemen.toLowerCase() !== "teknik geofisika" ? acc + curr.total : acc, 0) || 0,
      icon: <Layers className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  const currentData = getCurrentData()

  return (
    <div className="container mx-auto py-8 px-4 mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Subject Management</h1>
        <p className="text-muted-foreground">Manage your subjects and their associated documents</p>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {typeof stat.value === "string" ? (
                        <span className="text-muted-foreground text-lg">{stat.value}</span>
                      ) : (
                        stat.value
                      )}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search subjects..." className="pl-10" value={searchTerm} onChange={handleSearch} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById("filters-section")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button onClick={handleAddSubject} className="flex text-white items-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Subject</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all-departments" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all-departments">All Departments</TabsTrigger>
          <TabsTrigger value="teknik-geofisika">Teknik Geofisika</TabsTrigger>
          <TabsTrigger value="other-departments">Other Departments</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters Section */}
      <div id="filters-section" className="mb-8">
        <SubjectFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
      </div>

      {/* Subjects Grid */}
      {isLoading() ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex gap-2 mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : !currentData || !Array.isArray(currentData.data) || currentData.data.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {activeTab === "teknik-geofisika" 
              ? "No subjects found in Teknik Geofisika department"
              : activeTab === "other-departments"
                ? "No subjects found in other departments"
                : "No subjects found"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === "teknik-geofisika"
              ? "There are currently no subjects registered for the Teknik Geofisika department."
              : activeTab === "other-departments"
                ? "There are currently no subjects registered for other departments."
                : "Try adjusting your search or filters to find what you are looking for."}
          </p>
          <Button onClick={clearFilters}>Clear filters</Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {currentData.data.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading() && currentData?.total && currentData?.total > itemsPerPage && (
        <div className="mt-8">
          <Pagination 
            currentPage={currentPage} 
            totalPages={Math.ceil(currentData.total / itemsPerPage)} 
            onPageChange={handlePageChange} 
          />
        </div>
      )}

      {/* Subject Form Dialog */}
      {showSubjectForm && (
        <SubjectForm
          open={showSubjectForm}
          onOpenChange={setShowSubjectForm}
          onSuccess={() => {
            toast.success("Subject has been added successfully")
          }}
        />
      )}

      {/* Edit Subject Form Dialog */}
      {showEditForm && selectedSubject && (
        <EditSubjectForm
          open={showEditForm}
          onOpenChange={setShowEditForm}
          subject={selectedSubject}
          onSuccess={() => {
            toast.success("Subject has been updated successfully")
          }}
        />
      )}
    </div>
  )
}
