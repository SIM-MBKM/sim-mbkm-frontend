"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RegistrationCard } from "./registration-card"
import { BulkActionBar } from "./bulk-action-bar"
import { DashboardHeader } from "./dashboard-header"
import { EmptyState } from "./empty-state"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/lib/api/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegistrationStats } from "./registration-stats"
import { ConfettiExplosion } from "./confetti-explosion"
import { useRegistrationLOMBKM, useApproveStudentRegistrations } from "@/lib/api/hooks/use-query-hooks"
import { Loader2, Filter, X, Check } from "lucide-react"
import { BookOpenCheck, FolderSync, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { RegistrationFilter } from "@/lib/api/services/registration-service"

export function RegistrationDashboard() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showConfetti, setShowConfetti] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const limit = 10
  const { toast } = useToast()

  // Filter state
  const [filter, setFilter] = useState<RegistrationFilter>({
    activity_name: "",
    user_name: "",
    user_nrp: "",
    academic_advisor: "",
    academic_advisor_validation: "",
    lo_validation: ""
  })

  // Temporary filter state for the form
  const [tempFilter, setTempFilter] = useState<RegistrationFilter>({
    activity_name: "",
    user_name: "",
    user_nrp: "",
    academic_advisor: "",
    academic_advisor_validation: "",
    lo_validation: ""
  })

  // Function to handle input changes in the filter form
  const handleFilterChange = (field: keyof RegistrationFilter, value: string) => {
    setTempFilter(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Function to apply filters
  const applyFilters = () => {
    setFilter(tempFilter)
    setPage(1) // Reset to first page when applying new filters
  }

  // Function to reset filters
  const resetFilters = () => {
    const resetValues = {
      activity_name: "",
      user_name: "",
      user_nrp: "",
      academic_advisor: "",
      academic_advisor_validation: "",
      lo_validation: activeTab === "all" ? "" : activeTab.toUpperCase()
    }
    setTempFilter({
      ...resetValues,
      academic_advisor_validation: "", // Empty string in state
      lo_validation: resetValues.lo_validation // Keep tab-based value
    })
    setFilter(resetValues)
    setPage(1)
  }

  // Use the hook to fetch registrations for all registrations
  // This will be used to calculate stats
  const { 
    data: allRegistrationsData, 
    isLoading: isLoadingAll, 
    isError: isErrorAll,
    refetch: refetchAll
  } = useRegistrationLOMBKM({
    page: 1,
    limit: 100, // Fetch more to get accurate counts
    filter: {
      ...filter,
      academic_advisor_validation: "",
      lo_validation: "" // Always empty to get all registrations
    }
  })

  // Use the hook to fetch filtered registrations for the current view
  const { 
    data: registrationData, 
    isLoading, 
    isError, 
    refetch
  } = useRegistrationLOMBKM({
    page,
    limit,
    filter
  })

  // Use the hook for approving/rejecting registrations
  const { mutate: approveRegistrations, isPending: isApproving } = useApproveStudentRegistrations()

  // Get the registrations from the response data
  const registrations = registrationData?.data || []
  const allRegistrations = allRegistrationsData?.data || []

  // Calculate stats using the complete dataset
  const stats = {
    total: allRegistrations.length,
    pending: allRegistrations.filter(reg => reg.lo_validation === "PENDING").length,
    approved: allRegistrations.filter(reg => reg.lo_validation === "APPROVED").length,
    rejected: allRegistrations.filter(reg => reg.lo_validation === "REJECTED").length,
  }

  const handleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(registrations.map((reg) => reg.id))
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleApprove = (id: string) => {
    approveRegistrations(
      { status: "APPROVED", id: [id] },
      {
        onSuccess: () => {
          toast({
            title: "Registration Approved",
            description: "The registration has been successfully approved.",
          })
          refetch()
          refetchAll()
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to approve registration. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleReject = (id: string) => {
    approveRegistrations(
      { status: "REJECTED", id: [id] },
      {
        onSuccess: () => {
          toast({
            title: "Registration Rejected",
            description: "The registration has been rejected.",
            variant: "destructive",
          })
          refetch()
          refetchAll()
        },
        onError: () => {
          toast({
            title: "Error", 
            description: "Failed to reject registration. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return

    approveRegistrations(
      { status: "APPROVED", id: selectedIds },
      {
        onSuccess: () => {
          toast({
            title: "Bulk Approval Successful",
            description: `${selectedIds.length} registrations have been approved.`,
          })
          setShowConfetti(true)
          setSelectedIds([])
          refetch()
          refetchAll()
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to approve registrations. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  const handleBulkReject = () => {
    if (selectedIds.length === 0) return

    approveRegistrations(
      { status: "REJECTED", id: selectedIds },
      {
        onSuccess: () => {
          toast({
            title: "Bulk Rejection Completed",
            description: `${selectedIds.length} registrations have been rejected.`,
            variant: "destructive",
          })
          setSelectedIds([])
          refetch()
          refetchAll()
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to reject registrations. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // Reset page when changing filters
  useEffect(() => {
    setPage(1)
  }, [filter, activeTab])

  // Update filter when changing tabs
  useEffect(() => {
    const newAdvisorValidation = 
      activeTab === "all" ? "" : 
      activeTab === "pending" ? "PENDING" :
      activeTab === "approved" ? "APPROVED" : 
      activeTab === "rejected" ? "REJECTED" : "";
      
    setFilter(prev => ({
      ...prev,
      lo_validation: newAdvisorValidation
    }))
    
    // For display in select, empty string is represented as "all"
    setTempFilter(prev => ({
      ...prev,
      lo_validation: newAdvisorValidation
    }))
  }, [activeTab])

  const isLoadingAny = isLoading || isLoadingAll;
  const isErrorAny = isError || isErrorAll;

  // Function to check if any filters are active (excluding lo_validation which is set by tabs)
  const hasActiveFilters = () => {
    return (
      !!filter.activity_name ||
      !!filter.user_name ||
      !!filter.user_nrp ||
      !!filter.academic_advisor ||
      !!filter.lo_validation
    )
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-background to-background/80 p-4 md:p-8 relative">
      {showConfetti && <ConfettiExplosion />}

      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#303030_1px,transparent_1px),linear-gradient(to_bottom,#303030_1px,transparent_1px)] bg-size-[6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(120,119,198,0.1),transparent)]"></div>
      </div>

      <DashboardHeader />

      <div className="max-w-7xl mx-auto space-y-8">
        <RegistrationStats stats={stats} />

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-background/50 backdrop-blur-sm border">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
                Pending ({stats.pending})
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                Approved ({stats.approved})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                Rejected ({stats.rejected})
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className={`h-4 w-4 ${hasActiveFilters() ? "text-primary" : ""}`} />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {hasActiveFilters() && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary ml-1" variant="default">
                  {Object.values(filter).filter(val => val && val !== filter.lo_validation).length}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Advanced Filter Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6 overflow-hidden"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Activity Name</label>
                        <Input
                          placeholder="Filter by activity name"
                          value={tempFilter.activity_name}
                          onChange={(e) => handleFilterChange('activity_name', e.target.value)}
                        />
                      </div>
                      
                      {/* <div className="space-y-2">
                        <label className="text-sm font-medium">Student Name</label>
                        <Input
                          placeholder="Filter by student name"
                          value={tempFilter.user_name}
                          onChange={(e) => handleFilterChange('user_name', e.target.value)}
                        />
                      </div> */}
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Student NRP</label>
                        <Input
                          placeholder="Filter by student NRP"
                          value={tempFilter.user_nrp}
                          onChange={(e) => handleFilterChange('user_nrp', e.target.value)}
                        />
                      </div>
                      
                      {/* <div className="space-y-2">
                        <label className="text-sm font-medium">Academic Advisor</label>
                        <Input
                          placeholder="Filter by academic advisor"
                          value={tempFilter.academic_advisor}
                          onChange={(e) => handleFilterChange('academic_advisor', e.target.value)}
                        />
                      </div> */}
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">LO Validation</label>
                        <Select
                          value={tempFilter.lo_validation || "all"}
                          onValueChange={(value) => handleFilterChange('lo_validation', value === "all" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Advisor Validation</label>
                        <Select
                          value={tempFilter.lo_validation || "all"}
                          onValueChange={(value) => handleFilterChange('lo_validation', value === "all" ? "" : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={resetFilters}
                      >
                        <X className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={applyFilters}
                      >
                        <Check className="h-4 w-4" />
                        Apply Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoadingAny ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading registrations...</span>
            </div>
          ) : isErrorAny ? (
            <div className="flex justify-center items-center h-64 text-destructive">
              <p>Error loading registrations. Please try again.</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="sticky top-20 z-10 mb-4"
                  key="bulk-action-bar"
                >
                  <BulkActionBar
                    selectedCount={selectedIds.length}
                    onApprove={handleBulkApprove}
                    onReject={handleBulkReject}
                    onClear={() => setSelectedIds([])}
                    onSelectAll={handleSelectAll}
                    allSelected={selectedIds.length === registrations.length && registrations.length > 0}
                  />
                </motion.div>
              )}

              <TabsContent value={activeTab} className="space-y-4 mt-0">
                {registrations.length === 0 ? (
                  <EmptyState activeTab={activeTab} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 gap-6"
                    key="registrations-list"
                  >
                    {/* Summary of matching and equivalents */}
                    <div className="mb-4">
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 border p-4 dark:from-violet-950/40 dark:to-blue-950/40"
                      >
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <BookOpenCheck className="h-5 w-5 text-primary" />
                          <span>Course Data Overview</span>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This overview shows the total number of matching and equivalent courses across all student registrations.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                <FolderSync className="h-4 w-4" />
                                Matching Courses
                              </h4>
                              <Badge className="bg-blue-500">{registrations.reduce((acc, reg) => acc + (reg.matching?.length || 0), 0)}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Courses that align with the student&apos;s curriculum based on learning outcomes.
                            </p>
                          </div>
                          <div className="bg-purple-100/50 dark:bg-purple-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Equivalent Courses
                              </h4>
                              <Badge className="bg-purple-500">{registrations.reduce((acc, reg) => acc + (reg.equivalents?.length || 0), 0)}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Courses that are recognized as equivalent to ITS curriculum courses.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {registrations.map((registration) => (
                      <RegistrationCard
                        key={registration.id}
                        registration={registration}
                        isSelected={selectedIds.includes(registration.id)}
                        onToggleSelect={() => handleToggleSelect(registration.id)}
                        onApprove={() => handleApprove(registration.id)}
                        onReject={() => handleReject(registration.id)}
                        isDisabled={isApproving}
                      />
                    ))}
                  </motion.div>
                )}

                {registrationData && registrationData.total_pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-3 py-1 rounded border bg-background hover:bg-muted disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </button>
                      <span className="text-sm">
                        Page {page} of {registrationData.total_pages}
                      </span>
                      <button
                        className="px-3 py-1 rounded border bg-background hover:bg-muted disabled:opacity-50"
                        disabled={page === registrationData.total_pages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </AnimatePresence>
          )}
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
