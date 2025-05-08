"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Clock, Award, Users, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityCard } from "./activity-card"
import { SubjectForm } from "./subject-form"
import { MatchingDialog } from "./matching-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "./pagination"
import { toast } from "react-toastify"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Activity } from "@/lib/api/services"
import { 
  useActivities, 
  useUnmatchedActivities, 
  useMatchedActivities,
  useAllProgramTypes,
  useAllLevels,
  useGetAcademicYears,
  useAllGroups,
  useGetTotalMatchedStatusActivities,
  useSubmitMatchingRequest
} from "@/lib/api/hooks/use-query-hooks"

export function ActivityDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [showMatchingDialog, setShowMatchingDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [programTypeFilter, setProgramTypeFilter] = useState<string>("all")
  const [academicYearFilter, setAcademicYearFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [groupFilter, setGroupFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Create filter object for API calls
  const filters = {
    activity_id: "",
    program_type_id: programTypeFilter !== "all" ? programTypeFilter : "",
    level_id: levelFilter !== "all" ? levelFilter : "",
    group_id: groupFilter !== "all" ? groupFilter : "",
    name: searchTerm,
    approval_status: "", // Type assertion to fix the error
    academic_year: academicYearFilter !== "all" ? academicYearFilter : "",
  }

  // Fetch data based on active tab
  const allActivitiesQuery = useActivities(currentPage, itemsPerPage, filters)
  const matchedActivitiesQuery = useMatchedActivities(currentPage, itemsPerPage, filters)
  const unmatchedActivitiesQuery = useUnmatchedActivities(currentPage, itemsPerPage, filters)
  const totalMatchedStatusQuery = useGetTotalMatchedStatusActivities()
  const submitMatchingMutation = useSubmitMatchingRequest()

  // Get program types, levels, and groups for filters
  const programTypesQuery = useAllProgramTypes()
  const levelsQuery = useAllLevels()
  const groupsQuery = useAllGroups()
  const academicYearsQuery = useGetAcademicYears()

  // Determine which data to display based on active tab
  const activeQuery = activeTab === "all" 
    ? allActivitiesQuery 
    : activeTab === "matched" 
      ? matchedActivitiesQuery 
      : unmatchedActivitiesQuery

  const isLoading = activeQuery.isLoading || programTypesQuery.isLoading || levelsQuery.isLoading || groupsQuery.isLoading || academicYearsQuery.isLoading || totalMatchedStatusQuery.isLoading || submitMatchingMutation.isPending
  const activities = activeQuery.data?.data || []
  const totalPages = activeQuery.data?.total_pages || 1

  // Refetch function for updating data after matching
  const refetchData = useCallback(() => {
    console.log("Refetching activities data...")
    allActivitiesQuery.refetch()
    matchedActivitiesQuery.refetch()
    unmatchedActivitiesQuery.refetch()
    totalMatchedStatusQuery.refetch()
  }, [allActivitiesQuery, matchedActivitiesQuery, unmatchedActivitiesQuery, totalMatchedStatusQuery])

  // Handle error states
  useEffect(() => {
    if (activeQuery.error) {
      toast.error("There was a problem loading the activities. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }, [activeQuery.error])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleOpenMatchingDialog = (activity: Activity) => {
    console.log("Original activity:", activity)
    setSelectedActivity(activity)
    setShowMatchingDialog(true)
  }

  const handleCloseMatchingDialog = (shouldRefresh: boolean = false) => {
    setShowMatchingDialog(false)
    // Using setTimeout to ensure the dialog is fully closed before resetting the selected activity
    setTimeout(() => {
      setSelectedActivity(null)
      if (shouldRefresh) {
        refetchData()
        toast.success("Matching has been successfully updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    }, 300)
  }

  const handleAddSubject = () => {
    setShowSubjectForm(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Generate program types, levels, and groups for filters
  const getProgramTypes = () => {
    if (programTypesQuery.isLoading || !programTypesQuery.data) {
      return ["all"]
    }
    
    return ["all", ...programTypesQuery.data.data.map(pt => pt.id)]
  }

  const getLevels = () => {
    if (levelsQuery.isLoading || !levelsQuery.data) {
      return ["all"]
    }
    
    return ["all", ...levelsQuery.data.data.map(l => l.id)]
  }

  const getGroups = () => {
    if (groupsQuery.isLoading || !groupsQuery.data) {
      return ["all"]
    }
    
    return ["all", ...groupsQuery.data.data.map(g => g.id)]
  }

  const getAcademicYears = () => {
    if (academicYearsQuery.isLoading || !academicYearsQuery.data) {
      return ["all"]
    }
    
    return ["all", ...academicYearsQuery.data.data]
  }
  // Get names for display instead of IDs
  const getProgramTypeName = (id: string) => {
    if (id === "all") return "All Program Types"
    
    const programType = programTypesQuery.data?.data.find(pt => pt.id === id)
    return programType ? programType.name : id
  }

  const getLevelName = (id: string) => {
    if (id === "all") return "All Levels"
    
    const level = levelsQuery.data?.data.find(l => l.id === id)
    return level ? level.name : id
  }

  const getGroupName = (id: string) => {
    if (id === "all") return "All Groups"
    
    const group = groupsQuery.data?.data.find(g => g.id === id)
    return group ? group.name : id
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setActiveTab("all")
    setProgramTypeFilter("all")
    setLevelFilter("all")
    setGroupFilter("all")
    setAcademicYearFilter("all")
    setCurrentPage(1)
  }

  const programTypes = getProgramTypes()
  const levels = getLevels()
  const groups = getGroups()
  const academicYears = getAcademicYears()
  const statsData = [
    {
      title: "Total Activities",
      value: totalMatchedStatusQuery.data?.data.find(item => item.status === 'ALL')?.total || 0,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Matched Activities",
      value: totalMatchedStatusQuery.data?.data.find(item => item.status === 'MATCHED')?.total || 0,
      icon: <Award className="h-4 w-4 text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Unmatched Activities",
      value: totalMatchedStatusQuery.data?.data.find(item => item.status === 'UNMATCHED')?.total || 0,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">Activity Management</h1>
        <p className="text-muted-foreground">Manage your activities and create subject matchings</p>
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
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
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
          <Input placeholder="Search activities..." className="pl-10" value={searchTerm} onChange={handleSearch} />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Program Type</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuRadioGroup value={programTypeFilter} onValueChange={setProgramTypeFilter}>
                {programTypes.map((type) => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    {getProgramTypeName(type)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Level</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuRadioGroup value={levelFilter} onValueChange={setLevelFilter}>
                {levels.map((level) => (
                  <DropdownMenuRadioItem key={level} value={level}>
                    {getLevelName(level)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Group</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuRadioGroup value={groupFilter} onValueChange={setGroupFilter}>
                {groups.map((group) => (
                  <DropdownMenuRadioItem key={group} value={group}>
                    {getGroupName(group)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Academic Year</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuRadioGroup value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                {academicYears.map((academicYear) => (
                  <DropdownMenuRadioItem key={academicYear} value={academicYear}>
                    {academicYear}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddSubject} className="flex text-white items-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Subject</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="matched">Matched</TabsTrigger>
          <TabsTrigger value="unmatched">Unmatched</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="py-4">
                <Skeleton className="h-20 w-full mb-4" />
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
      ) : activities.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No activities found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <Button onClick={clearAllFilters}>Clear filters</Button>
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
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onMatchClick={() => handleOpenMatchingDialog(activity)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Subject Form Dialog */}
      {showSubjectForm && <SubjectForm open={showSubjectForm} onOpenChange={setShowSubjectForm} />}

      {/* Matching Dialog */}
      {showMatchingDialog && selectedActivity && (
        <MatchingDialog 
          open={showMatchingDialog} 
          onOpenChange={handleCloseMatchingDialog}
          activity={selectedActivity} 
        />
      )}

      {/* Pagination */}
      {!isLoading && activities.length > 0 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
