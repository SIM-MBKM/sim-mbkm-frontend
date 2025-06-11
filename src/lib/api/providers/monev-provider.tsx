"use client";

import {
  useEvaluations,
  useEvaluationById,
  useSubmitEvaluation,
  useUpdateEvaluation,
  useFinalizeEvaluation,
  useDeleteEvaluation,
  useUsers,
  useMahasiswaUsersAlt,
  useDosenPemonevUsersAlt,
  useDosenPembimbingUsersAlt,
  useRegistrations,
} from "@/lib/api/hooks";
import type { PaginatedResponse, UserAlt, Registration } from "@/lib/api/services";
import { EvaluationList, Evaluation, EvaluationCreateInput, EvaluationUpdateInput } from "../services/monev-service";
import type React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type EvaluationFilter = {
  status?: "pending" | "in_progress" | "completed" | "all";
  search?: string;
};

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
  dosenPemonevUsers: UserAlt[] | undefined; // Now contains unified evaluators (pemonev + pembimbing)
  studentsWithRegistrations: StudentWithRegistration[];
  studentsReadyForEvaluation: StudentWithRegistration[];
  isLoadingUsers: boolean;
  isLoadingRegistrations: boolean;

  // Statistics
  evaluationStats: EvaluationStats;

  // Actions
  createEvaluation: (evaluationData: EvaluationCreateInput) => Promise<void>;
  updateEvaluation: (evaluationData: EvaluationUpdateInput) => Promise<void>;
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

  // Fetch data
  const {
    data: evaluationsData,
    isLoading: isEvaluationsLoading,
    refetch: refetchEvaluations,
  } = useEvaluations(evaluationsPage, evaluationsPerPage);

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

  // Auto-refetch when filters change
  useEffect(() => {
    refetchEvaluations();
  }, [evaluationsPage, evaluationsPerPage, refetchEvaluations]);

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
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    refreshEvaluations,

    // Users and Registrations
    dosenPemonevUsers: allEvaluatorUsers, // Use combined evaluators (pemonev + pembimbing)
    studentsWithRegistrations,
    studentsReadyForEvaluation,
    isLoadingUsers,
    isLoadingRegistrations,

    // Statistics
    evaluationStats,

    // Actions
    createEvaluation,
    updateEvaluation,
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
