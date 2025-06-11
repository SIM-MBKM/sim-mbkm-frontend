"use client";

import {
  useReports,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
  useGenerateReport,
  useReportResults,
  useExportReportResult,
  useDownloadReportResult,
} from "@/lib/api/hooks/use-query-hooks";

import useToast from "../hooks/use-toast";

import type {
  ReportListItem,
  Report,
  ReportResult,
  ReportResultListItem,
  CreateReportRequest,
  UpdateReportRequest,
  ReportFilters,
  ReportResultFilters,
  ApiResponse,
} from "@/lib/api/services/report-service";

import { PaginatedResponse } from "../services";

import type React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type ReportStats = {
  total: number;
  generatedToday: number;
  totalResults: number;
  totalExports: number;
  averageResultsPerReport: number;
};

type ReportWithResults = ReportListItem & {
  resultsCount: number;
  lastGenerated?: string;
  hasResults: boolean;
};

type ReportAPIContextType = {
  // Reports
  reports: ReportListItem[] | undefined;
  reportsWithResults: ReportWithResults[];
  isLoading: boolean;
  reportsPagination: {
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
  clearFilters: () => void;
  refreshReports: () => void;

  // Selected report for results
  selectedReportId: string | undefined;
  setSelectedReportId: (id: string | undefined) => void;
  selectedReportResults: ReportResultListItem[] | undefined;
  isLoadingSelectedResults: boolean;
  selectedReportResultsPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };

  // Statistics
  reportStats: ReportStats;

  // Actions
  createReport: (reportData: CreateReportRequest) => Promise<void>;
  updateReport: (id: string, reportData: UpdateReportRequest) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  exportReportResult: (resultId: string) => Promise<void>;
  downloadReportResult: (resultId: string) => Promise<string>; // Returns download URL

  // Form state
  isFormSubmitting: boolean;
  setFormSubmitting: (submitting: boolean) => void;

  // Dialog states
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  resultsDialogOpen: boolean;
  setResultsDialogOpen: (open: boolean) => void;
  selectedReportForEdit: ReportListItem | null;
  setSelectedReportForEdit: (report: ReportListItem | null) => void;
  selectedReportForResults: ReportListItem | null;
  setSelectedReportForResults: (report: ReportListItem | null) => void;

  // Error handling
  lastError: string | null;
  clearError: () => void;
};

const ReportAPIContext = createContext<ReportAPIContextType | undefined>(undefined);

export function useReportAPI() {
  const context = useContext(ReportAPIContext);
  if (context === undefined) {
    throw new Error("useReportAPI must be used within a ReportAPIProvider");
  }
  return context;
}

function ReportAPIProvider({ children }: { children: React.ReactNode }) {
  // State
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsPerPage, setReportsPerPage] = useState(12); // 3x4 grid
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [selectedReportForEdit, setSelectedReportForEdit] = useState<ReportListItem | null>(null);
  const [selectedReportForResults, setSelectedReportForResults] = useState<ReportListItem | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  // Toast
  const { toast } = useToast();

  // Build filters
  const filters = useMemo(
    () => ({
      name: searchTerm || undefined,
    }),
    [searchTerm]
  );

  // Fetch data
  const {
    data: reportsData,
    isLoading: isReportsLoading,
    refetch: refetchReports,
  } = useReports({
    page: reportsPage,
    per_page: reportsPerPage,
    ...filters,
  });

  const { data: selectedReportResultsData, isLoading: isLoadingSelectedResults } = useReportResults(
    selectedReportId,
    { page: 1, per_page: 50 } // Load more results for the dialog
  );

  // Mutation hooks
  const createReportMutation = useCreateReport();
  const updateReportMutation = useUpdateReport();
  const deleteReportMutation = useDeleteReport();
  const generateReportMutation = useGenerateReport();
  const exportResultMutation = useExportReportResult();
  const downloadResultMutation = useDownloadReportResult();

  // Basic data
  const reports = reportsData?.data || [];
  const selectedReportResults = selectedReportResultsData?.data || [];

  // Enhanced reports with results info
  const reportsWithResults = useMemo<ReportWithResults[]>(() => {
    return reports.map((report) => ({
      ...report,
      resultsCount: 0, // TODO: Get this from API or separate query
      hasResults: false, // TODO: Determine if report has results
      lastGenerated: undefined, // TODO: Get last generation time
    }));
  }, [reports]);

  // Statistics
  const reportStats = useMemo<ReportStats>(() => {
    if (!reports) {
      return {
        total: 0,
        generatedToday: 0,
        totalResults: 0,
        totalExports: 0,
        averageResultsPerReport: 0,
      };
    }

    const total = reports.length;
    // TODO: Calculate these from actual data
    const generatedToday = 0;
    const totalResults = 0;
    const totalExports = 0;
    const averageResultsPerReport = total > 0 ? totalResults / total : 0;

    return {
      total,
      generatedToday,
      totalResults,
      totalExports,
      averageResultsPerReport: Math.round(averageResultsPerReport * 100) / 100,
    };
  }, [reports]);

  // Pagination
  const reportsPagination = {
    currentPage: reportsData?.current_page || 1,
    totalPages: reportsData?.last_page || 1,
    totalItems: reportsData?.total || 0,
    hasNextPage: !!reportsData?.next_page_url,
    hasPrevPage: !!reportsData?.prev_page_url,
  };

  const selectedReportResultsPagination = {
    currentPage: selectedReportResultsData?.current_page || 1,
    totalPages: selectedReportResultsData?.last_page || 1,
    totalItems: selectedReportResultsData?.total || 0,
  };

  // Actions
  const changePage = useCallback((newPage: number) => {
    setReportsPage(newPage);
  }, []);

  const changePerPage = useCallback((newPerPage: number) => {
    setReportsPerPage(newPerPage);
    setReportsPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setReportsPage(1);
  }, []);

  const refreshReports = useCallback(() => {
    refetchReports();
  }, [refetchReports]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const createReport = useCallback(
    async (reportData: CreateReportRequest) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        await createReportMutation.mutateAsync(reportData);
        toast({
          title: "Success",
          description: `Report "${reportData.name}" has been created successfully.`,
          variant: "success",
        });
        setCreateDialogOpen(false);
        refreshReports();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to create report. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setFormSubmitting(false);
      }
    },
    [createReportMutation, refreshReports, toast]
  );

  const updateReport = useCallback(
    async (id: string, reportData: UpdateReportRequest) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const response = await updateReportMutation.mutateAsync({ id, data: reportData });
        const reportName = reports.find((r) => r.id === id)?.name || "Unknown";
        toast({
          title: "Success",
          description: `Report "${reportName}" has been updated successfully.`,
          variant: "success",
        });
        setEditDialogOpen(false);
        setSelectedReportForEdit(null);
        refreshReports();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to update report. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setFormSubmitting(false);
      }
    },
    [updateReportMutation, reports, refreshReports, toast]
  );

  const deleteReport = useCallback(
    async (id: string) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const reportToDelete = reports.find((r) => r.id === id);
        const response = await deleteReportMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: `Report "${reportToDelete?.name || "Unknown"}" has been deleted successfully.`,
          variant: "success",
        });
        refreshReports();
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to delete report. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setFormSubmitting(false);
      }
    },
    [deleteReportMutation, reports, refreshReports, toast]
  );

  const generateReport = useCallback(
    async (id: string) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const report = reports.find((r) => r.id === id);
        const response = await generateReportMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: `Report "${report?.name || "Unknown"}" has been generated successfully.`,
          variant: "success",
        });
        // Refresh the selected report results if it's the same report
        if (selectedReportId === id) {
          // This will trigger a refetch of results
          setSelectedReportId(undefined);
          setTimeout(() => setSelectedReportId(id), 100);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to generate report. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setFormSubmitting(false);
      }
    },
    [generateReportMutation, reports, selectedReportId, toast]
  );

  const exportReportResult = useCallback(
    async (resultId: string) => {
      setLastError(null);
      try {
        const response = await exportResultMutation.mutateAsync({ resultId });
        toast({
          title: "Success",
          description: "Report result has been exported successfully.",
          variant: "success",
        });
        // Refresh the selected report results to show new export
        if (selectedReportId) {
          setSelectedReportId(undefined);
          setTimeout(() => setSelectedReportId(selectedReportId), 100);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to export report result. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    },
    [exportResultMutation, selectedReportId, toast]
  );

  const downloadReportResult = useCallback(
    async (resultId: string): Promise<string> => {
      setLastError(null);
      try {
        const response = await downloadResultMutation.mutateAsync(resultId);
        const downloadUrl = response.data.download_url;

        // Open in new tab
        window.open(downloadUrl, "_blank");

        toast({
          title: "Success",
          description: "Report is now opening in a new tab for viewing.",
          variant: "success",
        });

        return downloadUrl;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to get download URL. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    },
    [downloadResultMutation, toast]
  );

  // Helper functions for dialog management
  const openCreateDialog = useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((report: ReportListItem) => {
    setSelectedReportForEdit(report);
    setEditDialogOpen(true);
  }, []);

  const openResultsDialog = useCallback((report: ReportListItem) => {
    setSelectedReportForResults(report);
    setSelectedReportId(report.id);
    setResultsDialogOpen(true);
  }, []);

  const closeResultsDialog = useCallback(() => {
    setResultsDialogOpen(false);
    setSelectedReportForResults(null);
    setSelectedReportId(undefined);
  }, []);

  // Auto-refetch when filters change
  useEffect(() => {
    refetchReports();
  }, [reportsPage, reportsPerPage, searchTerm, refetchReports]);

  // Auto-clear errors after some time
  useEffect(() => {
    if (lastError) {
      const timer = setTimeout(() => {
        setLastError(null);
      }, 10000); // Clear error after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [lastError]);

  const isLoading = isReportsLoading;

  const value: ReportAPIContextType = {
    // Reports
    reports,
    reportsWithResults,
    isLoading,
    reportsPagination,

    // Pagination and filtering
    changePage,
    changePerPage,
    currentPerPage: reportsPerPage,
    searchTerm,
    setSearchTerm,
    clearFilters,
    refreshReports,

    // Selected report for results
    selectedReportId,
    setSelectedReportId,
    selectedReportResults,
    isLoadingSelectedResults,
    selectedReportResultsPagination,

    // Statistics
    reportStats,

    // Actions
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    exportReportResult,
    downloadReportResult,

    // Form state
    isFormSubmitting,
    setFormSubmitting,

    // Dialog states
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    resultsDialogOpen,
    setResultsDialogOpen,
    selectedReportForEdit,
    setSelectedReportForEdit,
    selectedReportForResults,
    setSelectedReportForResults,

    // Error handling
    lastError,
    clearError,
  };

  return <ReportAPIContext.Provider value={value}>{children}</ReportAPIContext.Provider>;
}

export { ReportAPIProvider };
