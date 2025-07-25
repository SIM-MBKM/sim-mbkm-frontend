"use client";

import {
  useEvaluations,
  useEvaluationById,
  useSubmitEvaluation,
  useUpdateEvaluation,
  useUpdateEvaluationScore, // Add this import
  useFinalizeEvaluation,
  useDeleteEvaluation,
  useUsers,
  useMahasiswaUsersAlt,
  useDosenPemonevUsersAlt,
  useDosenPembimbingUsersAlt,
  useRegistrations,
} from "@/lib/api/hooks";
import type { PaginatedResponse, UserAlt } from "@/lib/api/services";
import { Registration } from "@/lib/api/services/registration-service";
import {
  EvaluationList,
  Evaluation,
  EvaluationCreateInput,
  EvaluationUpdateInput,
  EvaluationScoreUpdateInput, // Add this import
  EvaluationFilter,
} from "../services/monev-service";
import type React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type EvaluationStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  averageCompletionRate: number;
};

type StudentWithRegistration = {
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
  registration: Registration | null;
};

type MonevAPIContextType = {
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

  // Users and Registrations
  dosenPemonevUsers: UserAlt[] | undefined;
  studentsWithRegistrations: StudentWithRegistration[];
  studentsReadyForEvaluation: StudentWithRegistration[];
  isLoadingUsers: boolean;
  isLoadingRegistrations: boolean;

  // Statistics
  evaluationStats: EvaluationStats;

  // Actions
  createEvaluation: (evaluationData: EvaluationCreateInput) => Promise<void>;
  updateEvaluation: (evaluationData: EvaluationUpdateInput) => Promise<void>;
  updateEvaluationScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>; // Add this line
  finalizeEvaluation: (evaluationId: string) => Promise<void>;
  deleteEvaluation: (evaluationId: string) => Promise<void>;

  // Form state
  isFormSubmitting: boolean;
  setFormSubmitting: (submitting: boolean) => void;

  // Selected evaluation
  selectedEvaluationId: string | null;
  setSelectedEvaluationId: (id: string | null) => void;
  selectedEvaluation: Evaluation | undefined;
  isLoadingSelectedEvaluation: boolean;
};

const MonevAPIContext = createContext<MonevAPIContextType | undefined>(undefined);

export function useMonevAPI() {
  const context = useContext(MonevAPIContext);
  if (context === undefined) {
    throw new Error("useMonevAPI must be used within a MonevAPIProvider");
  }
  return context;
}

function MonevAPIProvider({ children }: { children: React.ReactNode }) {
  const [evaluationsPage, setEvaluationsPage] = useState(1);
  const [evaluationsPerPage, setEvaluationsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when search changes
      if (searchTerm !== debouncedSearchTerm) {
        setEvaluationsPage(1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debouncedSearchTerm]);

  // Build filters object for API call
  const evaluationFilters = useMemo<EvaluationFilter>(() => {
    const filters: EvaluationFilter = {};

    if (statusFilter && statusFilter !== "all") {
      filters.status = statusFilter as "pending" | "in_progress" | "completed";
    }

    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      filters.search = debouncedSearchTerm.trim();
    }

    return filters;
  }, [statusFilter, debouncedSearchTerm]);

  // Fetch data with filters
  const {
    data: evaluationsData,
    isLoading: isEvaluationsLoading,
    refetch: refetchEvaluations,
    error: evaluationsError,
  } = useEvaluations(evaluationsPage, evaluationsPerPage, evaluationFilters);

  const { data: dosenPemonevUsersData, isLoading: isLoadingDosenPemonev } = useDosenPemonevUsersAlt();
  const { data: dosenPembimbingUsersData, isLoading: isLoadingDosenPembimbing } = useDosenPembimbingUsersAlt();
  const { data: allStudentsData, isLoading: isLoadingAllStudents } = useUsers(1, 1000, { role_name: "MAHASISWA" });

  const { data: registrationsData, isLoading: isLoadingRegistrations } = useRegistrations({
    page: 1,
    limit: 1000,
    filter: {
      activity_name: "",
      academic_advisor: "",
      user_name: "",
      user_nrp: "",
      lo_validation: "",
      academic_advisor_validation: "",
    },
  });

  const { data: selectedEvaluationData, isLoading: isLoadingSelectedEvaluation } = useEvaluationById(
    selectedEvaluationId || undefined
  );

  // Mutation hooks
  const submitEvaluationMutation = useSubmitEvaluation();
  const updateEvaluationMutation = useUpdateEvaluation();
  const updateEvaluationScoreMutation = useUpdateEvaluationScore(); // Add this line
  const finalizeEvaluationMutation = useFinalizeEvaluation();
  const deleteEvaluationMutation = useDeleteEvaluation();

  // Basic data
  const evaluations = evaluationsData?.data || [];
  const dosenPemonevUsers = dosenPemonevUsersData?.data || [];
  const dosenPembimbingUsers = dosenPembimbingUsersData?.data || [];

  // Combine dosen pemonev and dosen pembimbing as unified evaluators
  const allEvaluatorUsers = useMemo(() => {
    const combined = [...dosenPemonevUsers, ...dosenPembimbingUsers];
    // Remove duplicates based on auth_user_id
    const uniqueUsers = combined.filter(
      (user, index, self) => index === self.findIndex((u) => u.auth_user_id === user.auth_user_id)
    );
    return uniqueUsers;
  }, [dosenPemonevUsers, dosenPembimbingUsers]);

  const allStudents = allStudentsData?.data || [];
  const registrations = registrationsData?.data || [];

  // Students with registration data matched by NRP
  const studentsWithRegistrations = useMemo<StudentWithRegistration[]>(() => {
    if (!allStudents || !registrations || !evaluations) return [];

    const evaluatedStudentIds = new Set(evaluations.map((evaluation) => evaluation.mahasiswa_id));

    return allStudents
      .filter((student) => student.role_name === "MAHASISWA")
      .map((student) => {
        const registration = registrations.find((reg) => reg.user_nrp === student.nrp);
        const hasEvaluation = evaluatedStudentIds.has(student.auth_user_id);

        return {
          id: student.auth_user_id,
          auth_user_id: student.auth_user_id,
          name: student.name || "",
          email: student.email || "",
          nrp: student.nrp || "",
          role_name: student.role_name || "",
          hasEvaluation,
          hasRegistration: !!registration,
          registrationStatus: registration?.lo_validation || null,
          activityName: registration?.activity_name || null,
          registration: registration || null,
        };
      });
  }, [allStudents, registrations, evaluations]);

  // Students ready for evaluation (approved registration, no evaluation)
  const studentsReadyForEvaluation = useMemo(() => {
    return studentsWithRegistrations.filter(
      (student) =>
        !student.hasEvaluation &&
        student.hasRegistration &&
        student.registrationStatus === "APPROVED" &&
        student.registration?.academic_advisor_validation === "APPROVED"
    );
  }, [studentsWithRegistrations]);

  // Statistics
  const evaluationStats = useMemo<EvaluationStats>(() => {
    if (!evaluations) {
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        averageCompletionRate: 0,
      };
    }

    const total = evaluations.length;
    const pending = evaluations.filter((evaluation) => evaluation.status === "pending").length;
    const inProgress = evaluations.filter((evaluation) => evaluation.status === "in_progress").length;
    const completed = evaluations.filter((evaluation) => evaluation.status === "completed").length;
    const averageCompletionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
    };
  }, [evaluations]);

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
    setDebouncedSearchTerm(""); // Clear debounced term immediately
  }, []);

  const refreshEvaluations = useCallback(() => {
    refetchEvaluations();
  }, [refetchEvaluations]);

  const createEvaluation = useCallback(
    async (evaluationData: EvaluationCreateInput) => {
      setFormSubmitting(true);
      try {
        await submitEvaluationMutation.mutateAsync(evaluationData);
        refreshEvaluations();
      } finally {
        setFormSubmitting(false);
      }
    },
    [submitEvaluationMutation, refreshEvaluations]
  );

  const updateEvaluation = useCallback(
    async (evaluationData: EvaluationUpdateInput) => {
      setFormSubmitting(true);
      try {
        await updateEvaluationMutation.mutateAsync(evaluationData);
        refreshEvaluations();
      } finally {
        setFormSubmitting(false);
      }
    },
    [updateEvaluationMutation, refreshEvaluations]
  );

  // Add the updateEvaluationScore function
  const updateEvaluationScore = useCallback(
    async (scoreData: EvaluationScoreUpdateInput) => {
      setFormSubmitting(true);
      try {
        await updateEvaluationScoreMutation.mutateAsync(scoreData);

        // Refresh both the evaluations list and the selected evaluation
        refreshEvaluations();

        // If we're updating a score for the currently selected evaluation,
        // we might want to refetch that specific evaluation to get updated data
        if (selectedEvaluationId && scoreData.evaluation_id === selectedEvaluationId) {
          // The useEvaluationById hook should automatically refetch due to query invalidation
          // from the mutation's onSuccess callback
        }
      } finally {
        setFormSubmitting(false);
      }
    },
    [updateEvaluationScoreMutation, refreshEvaluations, selectedEvaluationId]
  );

  const finalizeEvaluation = useCallback(
    async (evaluationId: string) => {
      setFormSubmitting(true);
      try {
        await finalizeEvaluationMutation.mutateAsync({ id: evaluationId });
        refreshEvaluations();
      } finally {
        setFormSubmitting(false);
      }
    },
    [finalizeEvaluationMutation, refreshEvaluations]
  );

  const deleteEvaluation = useCallback(
    async (evaluationId: string) => {
      setFormSubmitting(true);
      try {
        await deleteEvaluationMutation.mutateAsync({ id: evaluationId });
        refreshEvaluations();
      } finally {
        setFormSubmitting(false);
      }
    },
    [deleteEvaluationMutation, refreshEvaluations]
  );

  // Enhanced setStatusFilter that resets pagination
  const setStatusFilterWithReset = useCallback((status: string) => {
    setStatusFilter(status);
    setEvaluationsPage(1); // Reset to first page when filter changes
  }, []);

  // Enhanced setSearchTerm that resets pagination
  const setSearchTermWithReset = useCallback((term: string) => {
    setSearchTerm(term);
    // Page reset is handled in the debounce effect
  }, []);

  // Auto-refetch when filters change (now properly includes filter dependencies)
  useEffect(() => {
    refetchEvaluations();
  }, [evaluationsPage, evaluationsPerPage, debouncedSearchTerm, statusFilter, refetchEvaluations]);

  const isLoading = isEvaluationsLoading;
  const isLoadingUsers = isLoadingDosenPemonev || isLoadingDosenPembimbing || isLoadingAllStudents;

  const value = {
    // Evaluations
    evaluations,
    isLoading,
    evaluationsPagination,

    // Pagination and filtering
    changePage,
    changePerPage,
    currentPerPage: evaluationsPerPage,
    searchTerm,
    setSearchTerm: setSearchTermWithReset,
    statusFilter,
    setStatusFilter: setStatusFilterWithReset,
    clearFilters,
    refreshEvaluations,

    // Users and Registrations
    dosenPemonevUsers: allEvaluatorUsers,
    studentsWithRegistrations,
    studentsReadyForEvaluation,
    isLoadingUsers,
    isLoadingRegistrations,

    // Statistics
    evaluationStats,

    // Actions
    createEvaluation,
    updateEvaluation,
    updateEvaluationScore, // Add this line
    finalizeEvaluation,
    deleteEvaluation,

    // Form state
    isFormSubmitting,
    setFormSubmitting,

    // Selected evaluation
    selectedEvaluationId,
    setSelectedEvaluationId,
    selectedEvaluation: selectedEvaluationData?.data,
    isLoadingSelectedEvaluation,
  };

  return <MonevAPIContext.Provider value={value}>{children}</MonevAPIContext.Provider>;
}

export { MonevAPIProvider };
