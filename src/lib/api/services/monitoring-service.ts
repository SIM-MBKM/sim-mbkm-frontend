import { apiServices } from '../axios-instance';

const monitoringApi = apiServices.monitoring;


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

// Updated to match the response structure
export interface ReportSchedule {
  id: string
  user_id: string
  user_nrp: string
  registration_id: string
  activity_name: string
  academic_advisor_id: string
  academic_advisor_email: string
  report_type: "WEEKLY_REPORT" | "FINAL_REPORT"
  week: number
  start_date: string
  end_date: string
  report: ReportResponse | null | undefined
}

// Updated to match the new response structure
export interface ReportSchedulesByProgram {
  [programName: string]: ReportSchedule[]
}

// Structure that holds all reports grouped by program
export interface ReportSchedulesData {
  reports: ReportSchedulesByProgram
}

// Updated response structure that matches the API response
export interface ReportSchedulesResponse {
  message: string
  status: string
  data: ReportSchedulesData
}

export interface Transcript {
  id: string;
  user_id: string
  user_nrp: string;
  academic_advisor_id: string;
  academic_advisor_email: string;
  registration_id: string;
  title: string;
  file_storage_id: string;
}

export interface TranscriptByProgram {
  [programName: string]: Transcript[]
}


export interface TranscriptData {
  transcripts: TranscriptByProgram
}

export interface TranscriptsResponse {
  message: string;
  status: string;
  data: TranscriptData
}


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

export interface TranscriptInput {
  registration_id: string;
  title: string;
  file?: File;
}

export interface SyllabusInput {
  registration_id: string;
  title: string;
  file?: File;
}

export interface ReportInput {
  report_schedule_id: string;
  title: string;
  content?: string;
  report_type: string;
  file?: File
}

export interface Report {
  id: string;
  report_schedule_id: string;
  file_storage_id: string;
  title: string;
  content: string;
  report_type: string;
  feedback: string;
  academic_advisor_status: string;
}

// Monitoring management service endpoints
export const monitoringService = {

  // submit report
  submitReport: async(reportInput: ReportInput) => {
    const formData = new FormData();

    formData.append('report_schedule_id', reportInput.report_schedule_id);
    formData.append('title', reportInput.title);
    formData.append('report_type', reportInput.report_type);

    if (reportInput.content) {
      formData.append('content', reportInput.content);
    }
    
    if (reportInput.file) {
      formData.append('file', reportInput.file);
    }

    const response = await monitoringApi.post<MetaDataResponse<Report>>('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Submit logbook
  submitLogbook: async (logbookData: LogbookInput) => {
    const response = await monitoringApi.post<Logbook>('/logbooks', logbookData);
    return response.data;
  },

  submitTranscript: async(transcriptInput: TranscriptInput) => {
    const formData = new FormData();

    formData.append('registration_id', transcriptInput.registration_id);
    formData.append('title', transcriptInput.title);

    if (transcriptInput.file) {
      formData.append('file', transcriptInput.file);
    }
    
    const response = await monitoringApi.post<MetaDataResponse<Transcript>>('/transcripts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  submitSyllabus: async(syllabusInput: SyllabusInput) => {
    const formData = new FormData();

    formData.append('registration_id', syllabusInput.registration_id);
    formData.append('title', syllabusInput.title);

    if (syllabusInput.file) {
      formData.append('file', syllabusInput.file);
    }
    
    const response = await monitoringApi.post<MetaDataResponse<Transcript>>('/syllabuses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTranscript: async (id: string) => {
    const response = await monitoringApi.delete<MetaDataResponse<null>>(`/transcripts/${id}`);
    return response.data;
  },

  deleteSyllabus: async (id: string) => {
    const response = await monitoringApi.delete<MetaDataResponse<null>>(`/syllabuses/${id}`);
    return response.data;
  },

  // endpoint: /report-schedules/student
  getReportSchedulesByStudent: async () => {
    // const response = await monitoringApi.get<MetaDataResponse<ReportScheduleByStudentResponse<ReportSchedule>>>('/report-schedules/student');
    const response = await monitoringApi.get<ReportSchedulesResponse>('/report-schedules/student');
    return response.data;
  },

  getTranscriptsByStudent: async() => {
    const response = await monitoringApi.get<TranscriptsResponse>('/transcripts/student')
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