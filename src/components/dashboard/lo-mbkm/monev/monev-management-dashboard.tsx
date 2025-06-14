// Improved dashboard component with fixed filtering

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
  Edit,
  Eye,
  Star,
  Save,
  Trash2,
  UserCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMonevAPI } from "@/lib/api/providers/monev-provider";
import useToast from "@/lib/api/hooks/use-toast";
import type { UserAlt } from "@/lib/api/services";
import type { EvaluationList, Evaluation, EvaluationScoreUpdateInput } from "@/lib/api/services/monev-service";

// Types for components
interface ScoreFormData {
  id: string;
  score: number | "";
  grade_letter: string;
}

interface StudentWithRegistration {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  nrp: string;
  role_name: string;
  hasEvaluation: boolean;
  hasRegistration: boolean;
  registrationStatus: string | null;
  activityName: string | null;
  registration: any;
}

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Evaluation Card Component
function EnhancedEvaluationCard({
  evaluation,
  onView,
  onEdit,
  onFinalize,
  onDelete,
  selectedEvaluation,
  selectedEvaluationId,
  isLoadingSelected,
  onUpdateScore,
}: {
  evaluation: EvaluationList;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onFinalize: (id: string) => void;
  onDelete: (id: string) => void;
  selectedEvaluation?: Evaluation;
  selectedEvaluationId?: string | null;
  isLoadingSelected?: boolean;
  onUpdateScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <BookCheck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const canUpdateScores = selectedEvaluation && selectedEvaluation.id === evaluation.id && selectedEvaluation.scores;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Evaluation #{evaluation.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">Student: {evaluation.mahasiswa_id.slice(-6)}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(evaluation.status)} flex items-center gap-1 border`}>
              {getStatusIcon(evaluation.status)}
              {evaluation.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Show subject information if available */}
          {selectedEvaluation && selectedEvaluation.id === evaluation.id && selectedEvaluation.scores && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Subjects ({selectedEvaluation.scores.length})</h4>
              <div className="space-y-1">
                {selectedEvaluation.scores.slice(0, 2).map((score, index) => (
                  <div key={score.id} className="text-xs text-gray-600">
                    • {score.subject_data?.name || `Subject ${index + 1}`}
                    {score.subject_data?.code && ` (${score.subject_data.code})`}
                  </div>
                ))}
                {selectedEvaluation.scores.length > 2 && (
                  <div className="text-xs text-gray-500">
                    ... and {selectedEvaluation.scores.length - 2} more subjects
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {evaluation.registration_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration:</span>
                <span className="font-medium text-gray-900">#{evaluation.registration_id.slice(-6)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* View Details */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(evaluation.id)}
              className="flex-1 gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              View
            </Button>

            {/* Update Scores */}
            <Button
              variant="default"
              size="sm"
              onClick={() => onEdit(evaluation.id)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoadingSelected && selectedEvaluationId === evaluation.id}
            >
              <Edit className="h-4 w-4" />
              {isLoadingSelected && selectedEvaluationId === evaluation.id ? "Loading..." : "Edit Scores"}
            </Button>

            {/* Finalize */}
            {evaluation.status !== "completed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFinalize(evaluation.id)}
                className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
                Finalize
              </Button>
            )}

            {/* Delete */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(evaluation.id)}
              className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Student Assignment Card Component
function StudentAssignmentCard({
  student,
  dosenPemonevUsers,
  onAssign,
  isLoading,
}: {
  student: StudentWithRegistration;
  dosenPemonevUsers: UserAlt[];
  onAssign: (studentId: string, dosenPemonevId: string, registrationId: string) => void;
  isLoading: boolean;
}) {
  const [selectedDosen, setSelectedDosen] = useState<string>("");

  const handleAssign = () => {
    if (selectedDosen && student.registration?.id) {
      onAssign(student.auth_user_id, selectedDosen, student.registration.id);
      setSelectedDosen("");
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">{student.email}</h4>
              <p className="text-sm text-gray-600">NRP: {student.nrp}</p>
              {student.activityName && (
                <p className="text-xs text-gray-500 truncate max-w-md">{student.activityName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedDosen} onValueChange={setSelectedDosen}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select evaluator" />
              </SelectTrigger>
              <SelectContent>
                {dosenPemonevUsers.map((dosen) => (
                  <SelectItem key={dosen.auth_user_id} value={dosen.auth_user_id}>
                    {dosen.name || dosen.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAssign} disabled={!selectedDosen || isLoading} size="sm" className="gap-2">
              <UserCheck className="h-4 w-4" />
              {isLoading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Local filter state for immediate UI feedback
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);

  // Sync local state with provider state
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalStatusFilter(statusFilter);
  }, [statusFilter]);
  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearchTerm(value);
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setLocalStatusFilter(value);
      setStatusFilter(value);
    },
    [setStatusFilter]
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearchTerm("");
    setLocalStatusFilter("all");
    clearFilters();
  }, [clearFilters]);

  // Evaluation action handlers
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

  const handleUpdateScore = useCallback(
    async (scoreData: EvaluationScoreUpdateInput) => {
      try {
        // This would be the score update mutation - you may need to add this to your provider
        // For now, using the general update method
        await updateEvaluation({
          id: scoreData.evaluation_id,
          // Add other fields as needed
        });
        refreshEvaluations();
        toast({
          title: "Success",
          description: "Score updated successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to update score:", error);
        toast({
          title: "Error",
          description: "Failed to update score",
          variant: "destructive",
        });
      }
    },
    [updateEvaluation, refreshEvaluations, toast]
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear selected evaluation first
      setSelectedEvaluationId(null);

      // Show loading toast
      toast({
        title: "Refreshing",
        description: "Updating evaluation data...",
        variant: "info",
      });

      // Refresh evaluations
      await refreshEvaluations();

      // Success feedback
      toast({
        title: "Success",
        description: "Data refreshed successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshEvaluations, setSelectedEvaluationId, toast]);

  // Calculate additional stats
  const totalStudents = studentsWithRegistrations.length;
  const studentsWithApprovedRegistrations = studentsWithRegistrations.filter(
    (s) => s.hasRegistration && s.registrationStatus === "APPROVED"
  ).length;

  // Filter status options
  const statusOptions = [
    { value: "all", label: "All Statuses", count: evaluationStats.total },
    { value: "pending", label: "Pending", count: evaluationStats.pending },
    { value: "in_progress", label: "In Progress", count: evaluationStats.inProgress },
    { value: "completed", label: "Completed", count: evaluationStats.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Monev Management</h1>
              <p className="text-muted-foreground">Monitor and evaluate student progress across programs</p>
            </div>
          </div>

          {/* Quick refresh button */}
          <Button onClick={handleRefresh} disabled={isRefreshing || isLoading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {evaluations === undefined && !isLoading && (
        <Alert className="border-destructive/50 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load evaluations. Please try refreshing the page or check your connection.
          </AlertDescription>
        </Alert>
      )}

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

      {/* Progress Overview */}
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
          </div>
        </div>

        {/* Enhanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Evaluations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search evaluations..."
                          value={localSearchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select value={localStatusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {option.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Per Page</Label>
                      <Select
                        value={currentPerPage.toString()}
                        onValueChange={(value) => changePerPage(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 per page</SelectItem>
                          <SelectItem value="10">10 per page</SelectItem>
                          <SelectItem value="20">20 per page</SelectItem>
                          <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-2 flex-1">
                          <X className="h-4 w-4" />
                          Clear
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(localSearchTerm || localStatusFilter !== "all") && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <span className="text-sm font-medium text-gray-600">Active filters:</span>
                      {localSearchTerm && (
                        <Badge variant="secondary" className="gap-1">
                          Search: "{localSearchTerm}"
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearchChange("")} />
                        </Badge>
                      )}
                      {localStatusFilter !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                          Status: {statusOptions.find((o) => o.value === localStatusFilter)?.label}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleStatusFilterChange("all")} />
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Contents remain the same ... */}
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
                  {(localSearchTerm || localStatusFilter !== "all") && (
                    <span className="ml-2 text-primary font-medium">(filtered)</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                {evaluations.map((evaluation) => (
                  <EnhancedEvaluationCard
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
                      setSelectedEvaluationId(id);
                    }}
                    onFinalize={handleFinalizeEvaluation}
                    onDelete={handleDeleteEvaluation}
                    selectedEvaluation={selectedEvaluation}
                    selectedEvaluationId={selectedEvaluationId}
                    isLoadingSelected={isLoadingSelectedEvaluation}
                    onUpdateScore={handleUpdateScore}
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
                <p className="text-muted-foreground">
                  {localSearchTerm || localStatusFilter !== "all"
                    ? "No evaluations match your current filters. Try adjusting your search criteria."
                    : "There are no evaluations in the system yet."}
                </p>
                {(localSearchTerm || localStatusFilter !== "all") && (
                  <Button variant="outline" onClick={handleClearFilters} className="mt-4 gap-2">
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
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
