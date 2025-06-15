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
  useDeleteReportResult,
} from "@/lib/api/hooks/use-query-hooks";

import useToast from "../hooks/use-toast";
import { reportService } from "@/lib/api/services/report-service";

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
  totalExports: number;
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
  isLoadingStats: boolean;
  refreshStats: () => void;

  // Actions
  createReport: (reportData: CreateReportRequest) => Promise<void>;
  updateReport: (id: string, reportData: UpdateReportRequest) => Promise<void>;
  deleteReport: (id: string, deleteResults?: boolean) => Promise<void>;
  generateReport: (id: string) => Promise<void>;
  exportReportResult: (resultId: string) => Promise<void>;
  downloadReportResult: (resultId: string) => Promise<string>; // Returns download URL
  deleteReportResult: (resultId: string) => Promise<void>;

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

// Utility function to batch async operations
async function batchProcess<T, R>(items: T[], processor: (item: T) => Promise<R>, batchSize: number = 5): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(processor));

    results.push(
      ...batchResults
        .filter((result): result is PromiseFulfilledResult<Awaited<R>> => result.status === "fulfilled")
        .map((result) => result.value)
    );

    // Small delay between batches to be nice to the API
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
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

  // Statistics tracking - optimized to avoid unnecessary re-fetches
  const [allReportResults, setAllReportResults] = useState<Map<string, ReportResultListItem[]>>(new Map());
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [lastStatsFetch, setLastStatsFetch] = useState<number>(0);

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
  const deleteResultMutation = useDeleteReportResult();
  const generateReportMutation = useGenerateReport();
  const exportResultMutation = useExportReportResult();
  const downloadResultMutation = useDownloadReportResult();

  // Basic data
  const reports = reportsData?.data || [];
  const selectedReportResults = selectedReportResultsData?.data || [];

  // Optimized fetch for statistics - uses batching and caching
  const fetchAllReportResults = useCallback(async () => {
    if (!reports.length) return;

    // Don't refetch if we just fetched within the last 2 minutes
    const now = Date.now();
    if (now - lastStatsFetch < 120000) {
      // 2 minutes
      return;
    }

    setIsLoadingStats(true);
    const resultsMap = new Map<string, ReportResultListItem[]>();

    try {
      console.log(`Fetching results for ${reports.length} reports in batches...`);

      // Process reports in batches to avoid overwhelming the API
      const reportProcessor = async (report: ReportListItem) => {
        try {
          const response = await reportService.getReportResults(report.id, {
            page: 1,
            per_page: 50, // Limit results per report for performance
          });
          return { reportId: report.id, results: response.data || [] };
        } catch (error) {
          console.warn(`Failed to fetch results for report ${report.id}:`, error);
          return { reportId: report.id, results: [] };
        }
      };

      // Batch process with limit of 3 concurrent requests
      const allResults = await batchProcess(reports, reportProcessor, 3);

      // Update the results map
      allResults.forEach((result) => {
        if (result) {
          resultsMap.set(result.reportId, result.results);
        }
      });

      setAllReportResults(resultsMap);
      setLastStatsFetch(now);

      console.log(`Statistics updated for ${resultsMap.size} reports`);
    } catch (error) {
      console.error("Error fetching report results for statistics:", error);
      toast({
        title: "Warning",
        description: "Failed to load some statistics. Please refresh to try again.",
        variant: "warning",
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [reports, lastStatsFetch, toast]);

  // Manual refresh for statistics
  const refreshStats = useCallback(() => {
    setLastStatsFetch(0); // Force refresh
    fetchAllReportResults();
  }, [fetchAllReportResults]);

  // Enhanced reports with results info
  const reportsWithResults = useMemo<ReportWithResults[]>(() => {
    return reports.map((report) => {
      const results = allReportResults.get(report.id) || [];
      const totalExports = results.reduce((sum, result) => sum + (result.export_count || 0), 0);
      const lastResult = results.length > 0 ? results[0] : null; // Assuming sorted by latest first

      return {
        ...report,
        resultsCount: results.length,
        hasResults: results.length > 0,
        lastGenerated: lastResult?.created_at,
        totalExports,
      };
    });
  }, [reports, allReportResults]);

  // Enhanced statistics calculation
  const reportStats = useMemo<ReportStats>(() => {
    if (!reports.length) {
      return {
        total: 0,
        generatedToday: 0,
        totalResults: 0,
        totalExports: 0,
        averageResultsPerReport: 0,
      };
    }

    const total = reports.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalResults = 0;
    let totalExports = 0;
    let generatedToday = 0;

    // Calculate from all report results
    allReportResults.forEach((results) => {
      totalResults += results.length;

      results.forEach((result) => {
        // Count exports
        totalExports += result.export_count || 0;

        // Count results generated today
        const resultDate = new Date(result.created_at);
        resultDate.setHours(0, 0, 0, 0);
        if (resultDate.getTime() === today.getTime()) {
          generatedToday += 1;
        }
      });
    });

    const averageResultsPerReport = total > 0 ? totalResults / total : 0;

    return {
      total,
      generatedToday,
      totalResults,
      totalExports,
      averageResultsPerReport: Math.round(averageResultsPerReport * 100) / 100,
    };
  }, [reports, allReportResults]);

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
    // Also refresh stats when reports are refreshed
    refreshStats();
  }, [refetchReports, refreshStats]);

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

  const deleteReportResult = useCallback(
    async (resultId: string): Promise<void> => {
      setLastError(null);
      try {
        // Use the existing deleteResultMutation
        await deleteResultMutation.mutateAsync(resultId);

        toast({
          title: "Success",
          description: "Report result has been deleted successfully.",
          variant: "success",
        });

        // Update local state - remove the result from all report results
        setAllReportResults((prev) => {
          const newMap = new Map(prev);
          // Find and remove the result from all reports
          newMap.forEach((results, reportId) => {
            const filteredResults = results.filter((result) => result.id !== resultId);
            newMap.set(reportId, filteredResults);
          });
          return newMap;
        });

        // Refresh statistics
        refreshStats();

        // If this result was from the currently selected report, refresh that too
        if (selectedReportId) {
          setSelectedReportId(undefined);
          setTimeout(() => setSelectedReportId(selectedReportId), 100);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to delete report result. Please try again.";
        setLastError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
    },
    [deleteResultMutation, selectedReportId, refreshStats, toast]
  );

  const updateReport = useCallback(
    async (id: string, reportData: UpdateReportRequest) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const response = await updateReportMutation.mutateAsync({
          id,
          data: {
            ...reportData,
            name: reportData.name || "",
            description: reportData.description || "",
            endpoints: reportData.endpoints || [],
            fields: reportData.fields || [],
            is_scheduled: reportData.is_scheduled || false,
          },
        });

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
        console.error("Update error details:", error);

        // Handle 204 No Content - this is actually success
        if (error?.response?.status === 204) {
          const reportName = reports.find((r) => r.id === id)?.name || "Unknown";
          toast({
            title: "Success",
            description: `Report "${reportName}" has been updated successfully.`,
            variant: "success",
          });
          setEditDialogOpen(false);
          setSelectedReportForEdit(null);
          refreshReports();
          return;
        }

        const errorMessage =
          error?.response?.data?.message || error?.message || "Failed to update report. Please try again.";
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
    async (id: string, deleteResults: boolean = true) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const reportToDelete = reports.find((r) => r.id === id);
        const reportResults = allReportResults.get(id) || [];

        // Delete all report results first if requested
        if (deleteResults && reportResults.length > 0) {
          console.log(`Deleting ${reportResults.length} results for report ${id}`);

          // Batch delete results
          const deleteProcessor = async (result: ReportResultListItem) => {
            try {
              await deleteResultMutation.mutateAsync(result.id);
              return result.id;
            } catch (error) {
              console.warn(`Failed to delete result ${result.id}:`, error);
              throw error;
            }
          };

          // Process deletions in smaller batches
          await batchProcess(reportResults, deleteProcessor, 2);

          toast({
            title: "Info",
            description: `Deleted ${reportResults.length} report result(s) for "${reportToDelete?.name}".`,
            variant: "default",
          });
        }

        // Delete the report itself
        await deleteReportMutation.mutateAsync(id);

        toast({
          title: "Success",
          description: `Report "${reportToDelete?.name || "Unknown"}" has been deleted successfully.`,
          variant: "success",
        });

        // Update local state
        setAllReportResults((prev) => {
          const newMap = new Map(prev);
          newMap.delete(id);
          return newMap;
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
    [deleteReportMutation, deleteResultMutation, reports, allReportResults, refreshReports, toast]
  );

  const generateReport = useCallback(
    async (id: string) => {
      setFormSubmitting(true);
      setLastError(null);
      try {
        const report = reports.find((r) => r.id === id);
        await generateReportMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: `Report "${report?.name || "Unknown"}" has been generated successfully.`,
          variant: "success",
        });

        // Refresh statistics after generation
        refreshStats();

        // Refresh the selected report results if it's the same report
        if (selectedReportId === id) {
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
    [generateReportMutation, reports, selectedReportId, refreshStats, toast]
  );

  const exportReportResult = useCallback(
    async (resultId: string) => {
      setLastError(null);
      try {
        await exportResultMutation.mutateAsync({
          resultId,
          data: {
            report_result_id: resultId,
            format: "pdf",
          },
        });
        toast({
          title: "Success",
          description: "Report result has been exported successfully.",
          variant: "success",
        });

        // Refresh statistics and selected results
        refreshStats();
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
    [exportResultMutation, selectedReportId, refreshStats, toast]
  );

  const downloadReportResult = useCallback(
    async (resultId: string): Promise<string> => {
      setLastError(null);
      try {
        const response = await downloadResultMutation.mutateAsync(resultId);
        const downloadUrl = response.data.download_url;

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

  // Auto-refetch when filters change
  useEffect(() => {
    refetchReports();
  }, [reportsPage, reportsPerPage, searchTerm, refetchReports]);

  // Fetch statistics when reports change, but with throttling
  useEffect(() => {
    if (reports.length > 0) {
      // Debounce statistics fetching
      const timer = setTimeout(() => {
        fetchAllReportResults();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [reports.length, fetchAllReportResults]);

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
    isLoadingStats,
    refreshStats,

    // Actions
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    exportReportResult,
    downloadReportResult,
    deleteReportResult,

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
