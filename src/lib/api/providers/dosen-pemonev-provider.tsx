"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useEvaluationsByPemonevMe, useUpdateEvaluationScore, useEvaluationById } from "@/lib/api/hooks";
import type { EvaluationList, Evaluation, EvaluationScoreUpdateInput } from "@/lib/api/services/monev-service";

type DosenPemonevStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  completionRate: number;
};

type DosenPemonevContextType = {
  // Evaluations
  evaluations: EvaluationList[] | undefined;
  isLoading: boolean;
  evaluationsPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // Pagination and filtering
  changePage: (newPage: number) => void;
  changePerPage: (newPerPage: number) => void;
  currentPerPage: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  refreshEvaluations: () => void;

  // Statistics
  stats: DosenPemonevStats;

  // Actions
  updateEvaluationScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;

  // Form state
  isUpdatingScore: boolean;

  // Selected evaluation for detailed view/editing
  selectedEvaluationId: string | null;
  setSelectedEvaluationId: (id: string | null) => void;
  selectedEvaluation: Evaluation | undefined;
  isLoadingSelectedEvaluation: boolean;

  // Filtered evaluations (client-side filtering)
  filteredEvaluations: EvaluationList[];
};

const DosenPemonevContext = createContext<DosenPemonevContextType | undefined>(undefined);

export function useDosenPemonev() {
  const context = useContext(DosenPemonevContext);
  if (context === undefined) {
    throw new Error("useDosenPemonev must be used within a DosenPemonevProvider");
  }
  return context;
}

function DosenPemonevProvider({ children }: { children: React.ReactNode }) {
  const [evaluationsPage, setEvaluationsPage] = useState(1);
  const [evaluationsPerPage, setEvaluationsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);

  // Fetch data
  const {
    data: evaluationsData,
    isLoading: isEvaluationsLoading,
    refetch: refetchEvaluations,
  } = useEvaluationsByPemonevMe(evaluationsPage, evaluationsPerPage);

  const { data: selectedEvaluationData, isLoading: isLoadingSelectedEvaluation } = useEvaluationById(
    selectedEvaluationId || undefined
  );

  // Mutation hooks
  const updateScoreMutation = useUpdateEvaluationScore();

  // Basic data
  const evaluations = evaluationsData?.data || [];

  // Statistics
  const stats = useMemo<DosenPemonevStats>(() => {
    if (!evaluations) {
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        completionRate: 0,
      };
    }

    const total = evaluations.length;
    const pending = evaluations.filter((evaluation) => evaluation.status === "pending").length;
    const inProgress = evaluations.filter((evaluation) => evaluation.status === "in_progress").length;
    const completed = evaluations.filter((evaluation) => evaluation.status === "completed").length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }, [evaluations]);

  // Client-side filtering for search and status
  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return [];

    let filtered = [...evaluations];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((evaluation) => evaluation.status === statusFilter);
    }

    // Filter by search term (search in IDs for now, can be expanded)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.id.toLowerCase().includes(searchLower) ||
          evaluation.mahasiswa_id.toLowerCase().includes(searchLower) ||
          evaluation.registration_id?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [evaluations, statusFilter, searchTerm]);

  // Pagination
  const evaluationsPagination = {
    currentPage: evaluationsData?.current_page || 1,
    totalPages: evaluationsData?.total_pages || 1,
    totalItems: evaluationsData?.total || 0,
    hasNextPage: !!(evaluationsData?.next_page_url && evaluationsData.next_page_url !== ""),
    hasPrevPage: !!(evaluationsData?.prev_page_url && evaluationsData.prev_page_url !== ""),
  };

  // Actions
  const changePage = useCallback((newPage: number) => {
    setEvaluationsPage(newPage);
  }, []);

  const changePerPage = useCallback((newPerPage: number) => {
    setEvaluationsPerPage(newPerPage);
    setEvaluationsPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setEvaluationsPage(1);
  }, []);

  const refreshEvaluations = useCallback(() => {
    refetchEvaluations();
  }, [refetchEvaluations]);

  const updateEvaluationScore = useCallback(
    async (scoreData: EvaluationScoreUpdateInput) => {
      await updateScoreMutation.mutateAsync(scoreData);
      // Refresh evaluations to get updated data
      refreshEvaluations();
      // Also refresh selected evaluation if it's the one being updated
      if (selectedEvaluationId === scoreData.evaluation_id) {
        // The useEvaluationById hook will automatically refetch due to query invalidation
      }
    },
    [updateScoreMutation, refreshEvaluations, selectedEvaluationId]
  );

  const value = {
    // Evaluations
    evaluations,
    isLoading: isEvaluationsLoading,
    evaluationsPagination,

    // Pagination and filtering
    changePage,
    changePerPage,
    currentPerPage: evaluationsPerPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    refreshEvaluations,

    // Statistics
    stats,

    // Actions
    updateEvaluationScore,

    // Form state
    isUpdatingScore: updateScoreMutation.isPending,

    // Selected evaluation
    selectedEvaluationId,
    setSelectedEvaluationId,
    selectedEvaluation: selectedEvaluationData?.data,
    isLoadingSelectedEvaluation,

    // Filtered evaluations
    filteredEvaluations,
  };

  return <DosenPemonevContext.Provider value={value}>{children}</DosenPemonevContext.Provider>;
}

export { DosenPemonevProvider };
