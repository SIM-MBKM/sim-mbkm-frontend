import { apiServices } from '../axios-instance';

const monitoringApi = apiServices.monitoring;

// ReportScheduleResponse struct {
//   ID                   string          `json:"id"`
//   UserID               string          `json:"user_id"`
//   UserNRP              string          `json:"user_nrp"`
//   RegistrationID       string          `json:"registration_id"`
//   ActivityName         string          `json:"activity_name"`
//   AcademicAdvisorID    string          `json:"academic_advisor_id"`
//   AcademicAdvisorEmail string          `json:"academic_advisor_email"`
//   ReportType           string          `json:"report_type"`
//   Week                 int             `json:"week"`
//   StartDate            string          `json:"start_date"`
//   EndDate              string          `json:"end_date"`
//   Report               *ReportResponse `json:"report"`
// }

// ReportResponse struct {
//   ID                    string `json:"id"`
//   ReportScheduleID      string `json:"report_schedule_id"`
//   FileStorageID         string `json:"file_storage_id"`
//   Title                 string `json:"title"`
//   Content               string `json:"content"`
//   ReportType            string `json:"report_type"`
//   Feedback              string `json:"feedback"`
//   AcademicAdvisorStatus string `json:"academic_advisor_status"`
// }

export interface ReportResponse {
  id: string
  report_schedule_id: string
  file_storage_id: string
  title: string
  content: string
  report_type: string
  feedback: string
  academic_advisor_status: string
}

export interface ReportScheduleResponse {
  id: string,
  user_id: string
  user_nrp: string
  registration_id: string
  activity_name: string
  academic_advisor_id: string
  academic_advisor_email: string
  report_type: string
  start_date: string
  end_date: string
  report: ReportResponse | null | undefined
}

// ReportScheduleByStudentResponse struct {
//   Reports map[string][]ReportScheduleResponse `json:"reports"`
// }

export interface ReportScheduleByStudentResponse<T> {
  reports: Record<string, T[]>
}

export interface MetaDataResponse<T> {
  message: string
  status: string
  data: T
}

export interface Logbook {
  id: string;
  userId: string;
  programId: string;
  date: string;
  activities: string;
  achievements: string;
  challenges: string;
  attachments?: {
    id: string;
    url: string;
    filename: string;
  }[];
}


export interface MonitoringSession {
  id: string;
  title: string;
  programId: string;
  mentorId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  attendees: {
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'ABSENT';
  }[];
}

export interface LogbookInput {
  programId: string;
  date: string;
  activities: string;
  achievements: string;
  challenges: string;
  attachments?: {
    url: string;
    filename: string;
  }[];
}

// Monitoring management service endpoints
export const monitoringService = {
  // Submit logbook
  submitLogbook: async (logbookData: LogbookInput) => {
    const response = await monitoringApi.post<Logbook>('/logbooks', logbookData);
    return response.data;
  },

  // endpoint: /report-schedules/student
  getReportSchedulesByStudent: async () => {
    const response = await monitoringApi.get<MetaDataResponse<ReportScheduleByStudentResponse<ReportScheduleResponse>>>('/report-schedules/student');
    return response.data;
  },

  // Get user logbooks
  getUserLogbooks: async (programId?: string) => {
    let url = '/logbooks/my';
    if (programId) url += `?programId=${programId}`;
    
    const response = await monitoringApi.get<Logbook[]>(url);
    return response.data;
  },

  // Get single logbook
  getLogbookById: async (id: string) => {
    const response = await monitoringApi.get<Logbook>(`/logbooks/${id}`);
    return response.data;
  },

  // Update logbook
  updateLogbook: async (id: string, logbookData: Partial<LogbookInput>) => {
    const response = await monitoringApi.put<Logbook>(`/logbooks/${id}`, logbookData);
    return response.data;
  },

  // Delete logbook
  deleteLogbook: async (id: string) => {
    const response = await monitoringApi.delete(`/logbooks/${id}`);
    return response.data;
  },

  // Get monitoring sessions
  getMonitoringSessions: async (programId?: string) => {
    let url = '/monitoring-sessions';
    if (programId) url += `?programId=${programId}`;
    
    const response = await monitoringApi.get<MonitoringSession[]>(url);
    return response.data;
  },

  // Get single monitoring session
  getMonitoringSessionById: async (id: string) => {
    const response = await monitoringApi.get<MonitoringSession>(`/monitoring-sessions/${id}`);
    return response.data;
  },

  // Confirm attendance to monitoring session
  confirmAttendance: async (sessionId: string) => {
    const response = await monitoringApi.post(`/monitoring-sessions/${sessionId}/confirm`);
    return response.data;
  },

  // Upload final report
  uploadFinalReport: async (programId: string, file: { url: string, filename: string }) => {
    const response = await monitoringApi.post(`/programs/${programId}/final-report`, { file });
    return response.data;
  },

  // Get dashboard monitoring stats
  getMonitoringStats: async (programId: string) => {
    const response = await monitoringApi.get(`/programs/${programId}/stats`);
    return response.data;
  },
}; 