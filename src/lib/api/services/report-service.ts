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
  schedule_frequency: string | null;
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
    const response = await reportApi.post<ApiResponse<Report>>("/reports", data);
    return response.data;
  },

  updateReport: async (id: string, data: UpdateReportRequest): Promise<ApiResponse<Report>> => {
    const response = await reportApi.patch<ApiResponse<Report>>(`/reports/${id}`, data);
    return response.data;
  },

  deleteReport: async (id: string): Promise<ApiResponse<null>> => {
    const response = await reportApi.delete<ApiResponse<null>>(`/reports/${id}`);
    return response.data;
  },

  // Report Generation
  generateReport: async (id: string): Promise<ApiResponse<ReportResult>> => {
    const response = await reportApi.post<ApiResponse<ReportResult>>(`/reports/${id}/generate`);
    return response.data;
  },

  // Report Results
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
    const response = await reportApi.delete<ApiResponse<null>>(`/results/${resultId}`);
    return response.data;
  },

  // Report Exports
  exportReportResult: async (resultId: string, data?: ExportReportRequest): Promise<ApiResponse<ReportExport>> => {
    const response = await reportApi.post<ApiResponse<ReportExport>>(`/results/${resultId}/export`, data || {});
    return response.data;
  },

  downloadReportResult: async (resultId: string): Promise<ApiResponse<DownloadResponse>> => {
    const response = await reportApi.get<ApiResponse<DownloadResponse>>(`/results/${resultId}/download`);
    return response.data;
  },

  // Scheduling
  scheduleReport: async (reportId: string, data: ScheduleReportRequest): Promise<ApiResponse<Report>> => {
    const response = await reportApi.post<ApiResponse<Report>>(`/schedules/${reportId}/schedule`, data);
    return response.data;
  },

  removeSchedule: async (reportId: string): Promise<ApiResponse<null>> => {
    const response = await reportApi.delete<ApiResponse<null>>(`/schedules/${reportId}/schedule`);
    return response.data;
  },

  getScheduledReports: async (): Promise<ApiResponse<Report[]>> => {
    const response = await reportApi.get<ApiResponse<Report[]>>("/schedules/scheduled");
    return response.data;
  },
};
