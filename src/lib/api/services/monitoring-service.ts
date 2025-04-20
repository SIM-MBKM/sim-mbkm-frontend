import { apiServices } from '../axios-instance';

const monitoringApi = apiServices.monitoring;

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