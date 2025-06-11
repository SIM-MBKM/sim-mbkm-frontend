"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle,
  BookCheck,
  Filter,
  X,
  TrendingUp,
  Star,
  GraduationCap,
  Edit,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDosenPemonev } from "@/lib/api/providers/dosen-pemonev-provider";
import useToast from "@/lib/api/hooks/use-toast";
import { DosenPemonevEvaluationCard } from "./evaluation-card";

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <h3 className="text-xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DosenPemonevMonevPage() {
  const {
    evaluations,
    filteredEvaluations,
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
    stats,
    selectedEvaluationId,
    setSelectedEvaluationId,
    selectedEvaluation,
    isLoadingSelectedEvaluation,
    updateEvaluationScore,
    isUpdatingScore,
  } = useDosenPemonev();

  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // The provider will handle the filter update automatically
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleUpdateScore = async (scoreData: any) => {
    try {
      await updateEvaluationScore(scoreData);
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Evaluation Management</h1>
            <p className="text-muted-foreground">Review and update scores for your assigned evaluations</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assigned"
          value={stats.total}
          description="All evaluations"
          icon={ClipboardList}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          description="Awaiting review"
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          description="Being evaluated"
          icon={BookCheck}
          color="bg-orange-500"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          description="Finished"
          icon={CheckCircle}
          color="bg-green-500"
        />
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Completion Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-sm text-muted-foreground">
                {stats.completed} of {stats.total} evaluations completed
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

        <div className="text-sm text-muted-foreground">
          Showing {filteredEvaluations.length} of {stats.total} evaluations
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
            className="overflow-hidden"
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* Evaluations List */}
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
      ) : filteredEvaluations && filteredEvaluations.length > 0 ? (
        <>
          <div className="grid gap-4">
            {filteredEvaluations.map((evaluation) => (
              <DosenPemonevEvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                onUpdateScore={handleUpdateScore}
                selectedEvaluation={selectedEvaluation}
                selectedEvaluationId={selectedEvaluationId}
                isLoadingSelected={isLoadingSelectedEvaluation}
                isUpdatingScore={isUpdatingScore}
                onEditClick={(id: string) => setSelectedEvaluationId(id)}
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
              {searchTerm || statusFilter !== "all"
                ? "No evaluations match your current filters."
                : "You don't have any evaluations assigned yet."}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
