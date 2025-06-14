import { apiServices } from "../axios-instance";

const reportApi = apiServices.report;

// Basic Report interface (for list items)
export interface ReportListItem {
  id: string;
  name: string;
  description: string | null;
  is_scheduled: boolean;
  schedule_frequency: string | null;
  created_at: string;
}

// Detailed Report interface (for individual report details)
export interface Report {
  id: string;
  name: string;
  description: string | null;
  endpoints: string[];
  fields: string[];
  is_scheduled: boolean;
  schedule_frequency: "daily" | "weekly" | "monthly" | null;
  created_at: string;
  updated_at: string;
  results: ReportResultSummary[];
}

// Summary of report results (included in Report detail)
export interface ReportResultSummary {
  id: string;
  created_at: string;
}

// Report Result List Item (for paginated results)
export interface ReportResultListItem {
  id: string;
  report_id: string;
  created_at: string;
  export_count: number;
}

// Detailed Report Result
export interface ReportResult {
  id: string;
  report_id: string;
  data: ReportData;
  created_at: string;
  updated_at: string;
  exports: ReportExportSummary[];
}

// The data structure can vary, but based on your example:
export interface ReportData {
  [key: string]: any; // Flexible structure since it depends on endpoints
  _generation_summary?: {
    successful_endpoints: number;
    failed_endpoints: number;
    total_endpoints: number;
    generated_at: string;
    report_id: string;
  };
}

// Export summary (included in ReportResult)
export interface ReportExportSummary {
  id: string;
  gcs_file_id: string;
  created_at: string;
}

// Detailed Report Export
export interface ReportExport {
  id: string;
  report_result_id: string;
  gcs_file_id: string;
  gcs_info: Record<string, any>; // GCS metadata object
  created_at: string;
  updated_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  message: string;
  status: string;
  data: T[];
  current_page: number;
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// Request DTOs
export interface CreateReportRequest {
  name: string;
  description?: string;
  endpoints: string[];
  fields: string[];
  is_scheduled?: boolean;
  schedule_frequency?: "daily" | "weekly" | "monthly";
}

export interface UpdateReportRequest {
  name?: string;
  description?: string;
  endpoints?: string[];
  fields?: string[];
  is_scheduled?: boolean;
  schedule_frequency?: "daily" | "weekly" | "monthly" | null;
}

export interface ScheduleReportRequest {
  frequency: "daily" | "weekly" | "monthly";
}

export interface ExportReportRequest {
  report_result_id: string;
  format?: "pdf" | "json";
  // Add other export options as needed
}

// Filter types
export interface ReportFilters {
  name?: string;
  is_scheduled?: boolean;
}

export interface ReportResultFilters {
  date_from?: string;
  date_to?: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// Download response
export interface DownloadResponse {
  download_url: string;
  file_info: Record<string, any>;
  expires_at: string;
}

// Report Service Implementation
export const reportService = {
  // Reports CRUD
  getReports: async (params?: ReportFilters & PaginationParams): Promise<PaginatedResponse<ReportListItem>> => {
    const response = await reportApi.get<PaginatedResponse<ReportListItem>>("/reports/all", {
      params: {
        page: params?.page || 1,
        per_page: params?.per_page || 10,
        name: params?.name,
        is_scheduled: params?.is_scheduled,
      },
    });
    return response.data;
  },

  getReport: async (id: string): Promise<ApiResponse<Report>> => {
    const response = await reportApi.get<ApiResponse<Report>>(`/reports/${id}`);
    return response.data;
  },

  createReport: async (data: CreateReportRequest): Promise<ApiResponse<Report>> => {
    const response = await reportApi.post<ApiResponse<Report>>("/reports", data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  },

  updateReport: async (id: string, data: UpdateReportRequest): Promise<ApiResponse<Report>> => {
    try {
      // Clean the data to ensure no undefined values
      const cleanData = {
        name: data.name || "",
        description: data.description || "",
        endpoints: data.endpoints || [],
        fields: data.fields || [],
        is_scheduled: data.is_scheduled || false,
        schedule_frequency: data.schedule_frequency || null,
      };

      const response = await reportApi.patch<ApiResponse<Report>>(`/reports/${id}`, cleanData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Add any additional headers your backend expects
        },
        // Handle different response scenarios
        validateStatus: (status) => {
          // Accept 200, 201, 204 as successful
          return status >= 200 && status < 300;
        },
      });

      // Handle 204 No Content responses
      if (response.status === 204) {
        // Return a mock successful response structure
        return {
          status: "success",
          message: "Report updated successfully",
          data: {
            id,
            ...cleanData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            results: [],
          } as Report,
        };
      }

      return response.data;
    } catch (error: any) {
      // Enhanced error handling for different scenarios
      if (error.response?.status === 204) {
        // Treat 204 as success
        return {
          status: "success",
          message: "Report updated successfully",
          data: {
            id,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            results: [],
          } as Report,
        };
      }

      // Log detailed error information for debugging
      console.error("Update Report Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        config: error.config,
      });

      throw error;
    }
  },

  deleteReport: async (id: string): Promise<ApiResponse<null>> => {
    const response = await reportApi.delete<ApiResponse<null>>(`/reports/${id}`, {
      headers: {
        Accept: "application/json",
      },
      validateStatus: (status) => {
        // Accept 200, 201, 204 as successful for delete
        return status >= 200 && status < 300;
      },
    });

    // Handle 204 No Content for delete
    if (response.status === 204) {
      return {
        status: "success",
        message: "Report deleted successfully",
        data: null,
      };
    }

    return response.data;
  },

  // Report Generation with enhanced error handling
  generateReport: async (id: string): Promise<ApiResponse<ReportResult>> => {
    try {
      const response = await reportApi.post<ApiResponse<ReportResult>>(
        `/reports/${id}/generate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Increase timeout for report generation as it might take longer
          timeout: 60000, // 60 seconds
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Generate Report Error:", error);
      throw error;
    }
  },

  // Report Results with pagination
  getReportResults: async (
    reportId: string,
    params?: ReportResultFilters & PaginationParams
  ): Promise<PaginatedResponse<ReportResultListItem>> => {
    const response = await reportApi.get<PaginatedResponse<ReportResultListItem>>(`/reports/${reportId}/results`, {
      params: {
        page: params?.page || 1,
        per_page: params?.per_page || 10,
        date_from: params?.date_from,
        date_to: params?.date_to,
      },
    });
    return response.data;
  },

  getReportResult: async (resultId: string): Promise<ApiResponse<ReportResult>> => {
    const response = await reportApi.get<ApiResponse<ReportResult>>(`/results/${resultId}`);
    return response.data;
  },

  deleteReportResult: async (resultId: string): Promise<ApiResponse<null>> => {
    const response = await reportApi.delete<ApiResponse<null>>(`/results/${resultId}`, {
      headers: {
        Accept: "application/json",
      },
      validateStatus: (status) => {
        return status >= 200 && status < 300;
      },
    });

    if (response.status === 204) {
      return {
        status: "success",
        message: "Report result deleted successfully",
        data: null,
      };
    }

    return response.data;
  },

  // Batch delete report results
  batchDeleteReportResults: async (resultIds: string[]): Promise<ApiResponse<{ deleted: number; failed: number }>> => {
    try {
      // If your backend supports batch delete
      const response = await reportApi.post<ApiResponse<{ deleted: number; failed: number }>>(
        "/results/batch-delete",
        {
          result_ids: resultIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback to individual deletes if batch delete is not supported
      let deleted = 0;
      let failed = 0;

      for (const resultId of resultIds) {
        try {
          await reportService.deleteReportResult(resultId);
          deleted++;
        } catch (error) {
          console.warn(`Failed to delete result ${resultId}:`, error);
          failed++;
        }
      }

      return {
        status: "success",
        message: `Batch delete completed: ${deleted} deleted, ${failed} failed`,
        data: { deleted, failed },
      };
    }
  },

  // Report Exports with enhanced handling
  exportReportResult: async (resultId: string, data?: ExportReportRequest): Promise<ApiResponse<ReportExport>> => {
    const exportData = {
      report_result_id: resultId,
      format: "pdf",
      ...data,
    };

    const response = await reportApi.post<ApiResponse<ReportExport>>(`/results/${resultId}/export`, exportData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000, // 30 seconds for export
    });
    return response.data;
  },

  downloadReportResult: async (resultId: string): Promise<ApiResponse<DownloadResponse>> => {
    const response = await reportApi.get<ApiResponse<DownloadResponse>>(`/results/${resultId}/download`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  },

  // Scheduling with improved error handling
  scheduleReport: async (reportId: string, data: ScheduleReportRequest): Promise<ApiResponse<Report>> => {
    const response = await reportApi.post<ApiResponse<Report>>(`/schedules/${reportId}/schedule`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data;
  },

  removeSchedule: async (reportId: string): Promise<ApiResponse<null>> => {
    const response = await reportApi.delete<ApiResponse<null>>(`/schedules/${reportId}/schedule`, {
      headers: {
        Accept: "application/json",
      },
      validateStatus: (status) => {
        return status >= 200 && status < 300;
      },
    });

    if (response.status === 204) {
      return {
        status: "success",
        message: "Schedule removed successfully",
        data: null,
      };
    }

    return response.data;
  },

  getScheduledReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await reportApi.get<ApiResponse<Report[]>>("/schedules/scheduled");
    return response.data;
  },

  // Utility methods for statistics
  getReportStatistics: async (): Promise<
    ApiResponse<{
      total_reports: number;
      total_results: number;
      total_exports: number;
      generated_today: number;
      scheduled_reports: number;
    }>
  > => {
    try {
      // If your backend has a dedicated statistics endpoint
      const response = await reportApi.get<ApiResponse<any>>("/reports/statistics");
      return response.data;
    } catch (error) {
      // Fallback: calculate from existing endpoints
      console.warn("Statistics endpoint not available, calculating from data...");

      // This would be handled by the provider instead
      throw new Error("Statistics endpoint not available");
    }
  },

  // Health check method
  healthCheck: async (): Promise<boolean> => {
    try {
      await reportApi.get("/health", { timeout: 5000 });
      return true;
    } catch (error) {
      console.warn("Report API health check failed:", error);
      return false;
    }
  },
};
