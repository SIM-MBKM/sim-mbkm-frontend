"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Users,
  BookCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserX,
  Filter,
  X,
  TrendingUp,
  GraduationCap,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMonevAPI } from "@/lib/api/providers/monev-provider";
import useToast from "@/lib/api/hooks/use-toast";
import { EvaluationCard, StudentAssignmentCard, StatsCard } from "./monev-card";
import { UserAlt } from "@/lib/api/services";

export function MonevManagementDashboard() {
  const {
    evaluations,
    isLoading,
    evaluationsPagination,
    changePage,
    changePerPage,
    currentPerPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    refreshEvaluations,
    evaluationStats,
    studentsReadyForEvaluation,
    studentsWithRegistrations,
    dosenPemonevUsers,
    createEvaluation,
    updateEvaluation,
    finalizeEvaluation,
    deleteEvaluation,
    isFormSubmitting,
    isLoadingUsers,
    isLoadingRegistrations,
    selectedEvaluationId,
    setSelectedEvaluationId,
    selectedEvaluation,
    isLoadingSelectedEvaluation,
  } = useMonevAPI();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [showFilters, setShowFilters] = useState(false);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The provider will handle the filter update automatically
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
    },
    [setStatusFilter]
  );

  const handleAssignEvaluation = useCallback(
    async (studentId: string, dosenPemonevId: string, registrationId: string) => {
      try {
        await createEvaluation({
          mahasiswa_id: studentId,
          dosen_pemonev_id: dosenPemonevId,
          registration_id: registrationId,
          status: "pending",
        });

        toast({
          title: "Success",
          description: "Evaluation assigned successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to assign evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to assign evaluation",
          variant: "destructive",
        });
      }
    },
    [createEvaluation, toast]
  );

  const handleFinalizeEvaluation = useCallback(
    async (id: string) => {
      try {
        await finalizeEvaluation(id);
        toast({
          title: "Success",
          description: "Evaluation finalized successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to finalize evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to finalize evaluation",
          variant: "destructive",
        });
      }
    },
    [finalizeEvaluation, toast]
  );

  const handleUpdateEvaluation = useCallback(
    async (updateData: any) => {
      try {
        await updateEvaluation(updateData);
        toast({
          title: "Success",
          description: "Evaluation updated successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to update evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to update evaluation",
          variant: "destructive",
        });
      }
    },
    [updateEvaluation, toast]
  );

  const handleDeleteEvaluation = useCallback(
    async (id: string) => {
      try {
        await deleteEvaluation(id);
        toast({
          title: "Success",
          description: "Evaluation deleted successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to delete evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to delete evaluation",
          variant: "destructive",
        });
      }
    },
    [deleteEvaluation, toast]
  );

  // Get mahasiswa users for the update dialog - convert StudentWithRegistration to UserAlt
  const mahasiswaUsers: UserAlt[] = studentsWithRegistrations.map((student) => ({
    id: student.id,
    auth_user_id: student.auth_user_id,
    name: student.name,
    email: student.email,
    nrp: student.nrp,
    role_name: student.role_name,
  }));

  // Calculate additional stats
  const totalStudents = studentsWithRegistrations.length;
  const studentsWithApprovedRegistrations = studentsWithRegistrations.filter(
    (s) => s.hasRegistration && s.registrationStatus === "APPROVED"
  ).length;
  const studentsWithoutRegistrations = studentsWithRegistrations.filter((s) => !s.hasRegistration).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Monev Management</h1>
            <p className="text-muted-foreground">Monitor and evaluate student progress across programs</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          description="All MAHASISWA users"
          icon={GraduationCap}
          color="bg-purple-500"
        />
        <StatsCard
          title="With Registrations"
          value={studentsWithApprovedRegistrations}
          description="Students with approved registrations"
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Ready for Evaluation"
          value={studentsReadyForEvaluation.length}
          description="Approved but not evaluated"
          icon={Users}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Evaluations"
          value={evaluationStats.total}
          description="All evaluations in system"
          icon={ClipboardList}
          color="bg-blue-600"
        />
        <StatsCard
          title="Completed"
          value={evaluationStats.completed}
          description="Finished evaluations"
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatsCard
          title="In Progress"
          value={evaluationStats.inProgress + evaluationStats.pending}
          description="Active evaluations"
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Completion Rate Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Evaluation Completion Rate</span>
                <span className="font-medium">{evaluationStats.averageCompletionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${evaluationStats.averageCompletionRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {evaluationStats.completed} of {evaluationStats.total} evaluations completed
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Registration Coverage</span>
                <span className="font-medium">
                  {totalStudents > 0 ? Math.round((studentsWithApprovedRegistrations / totalStudents) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalStudents > 0 ? (studentsWithApprovedRegistrations / totalStudents) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {studentsWithApprovedRegistrations} of {totalStudents} students registered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-background/50 backdrop-blur-sm border">
            <TabsTrigger
              value="evaluations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Evaluations ({evaluationStats.total})
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Ready for Assignment ({studentsReadyForEvaluation.length})
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              All Students ({totalStudents})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <Button onClick={refreshEvaluations} size="sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
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
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search evaluations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Per Page</label>
                      <Select
                        value={currentPerPage.toString()}
                        onValueChange={(value) => changePerPage(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Contents */}
        <TabsContent value="evaluations" className="space-y-4 mt-0">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : evaluations && evaluations.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {evaluations.length} of {evaluationsPagination.totalItems} evaluations
                </div>
              </div>

              <div className="grid gap-4">
                {evaluations.map((evaluation) => (
                  <EvaluationCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    onView={(id: string) => {
                      toast({
                        title: "View Evaluation",
                        description: `Opening evaluation ${id}`,
                        variant: "info",
                      });
                    }}
                    onEdit={(id: string) => {
                      setSelectedEvaluationId(id); // This will trigger loading the full evaluation details
                    }}
                    onFinalize={handleFinalizeEvaluation}
                    onDelete={handleDeleteEvaluation}
                    mahasiswaUsers={mahasiswaUsers}
                    dosenPemonevUsers={dosenPemonevUsers}
                    selectedEvaluation={selectedEvaluation}
                    selectedEvaluationId={selectedEvaluationId} // Add this line
                    isLoadingSelected={isLoadingSelectedEvaluation}
                    onUpdate={handleUpdateEvaluation}
                  />
                ))}
              </div>

              {/* Pagination */}
              {evaluationsPagination.totalPages > 1 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground">
                        Page {evaluationsPagination.currentPage} of {evaluationsPagination.totalPages}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePage(evaluationsPagination.currentPage - 1)}
                          disabled={!evaluationsPagination.hasPrevPage}
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(5, evaluationsPagination.totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === evaluationsPagination.currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => changePage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePage(evaluationsPagination.currentPage + 1)}
                          disabled={!evaluationsPagination.hasNextPage}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Evaluations Found</h3>
                <p className="text-muted-foreground">There are no evaluations matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-0">
          {studentsReadyForEvaluation.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Students Ready for Evaluation Assignment</h3>
                  <p className="text-sm text-muted-foreground">
                    {studentsReadyForEvaluation.length} students with approved registrations need evaluation assignment
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {studentsReadyForEvaluation.map((student) => (
                  <StudentAssignmentCard
                    key={student.id}
                    student={student}
                    dosenPemonevUsers={dosenPemonevUsers || []}
                    onAssign={handleAssignEvaluation}
                    isLoading={isFormSubmitting}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Ready Students Assigned</h3>
                <p className="text-muted-foreground">
                  Great! All students with approved registrations have been assigned evaluations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-0">
          {isLoadingUsers ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                      <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : studentsWithRegistrations.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">All Students Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete overview of all students and their registration/evaluation status
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {studentsWithRegistrations.map((student) => (
                  <Card key={student.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{student.email}</h4>
                            {student.nrp && <p className="text-sm text-muted-foreground">NRP: {student.nrp}</p>}
                            {student.hasRegistration && student.activityName && (
                              <p className="text-sm text-muted-foreground truncate max-w-md">{student.activityName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {student.hasRegistration ? (
                            <Badge variant={student.registrationStatus === "APPROVED" ? "default" : "secondary"}>
                              {student.registrationStatus}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              No Registration
                            </Badge>
                          )}

                          {student.hasEvaluation ? (
                            <Badge variant="default" className="bg-green-500">
                              Has Evaluation
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              No Evaluation
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                <p className="text-muted-foreground">No student data available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
