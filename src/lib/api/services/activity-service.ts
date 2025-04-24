import { apiServices } from '../axios-instance';
import { PaginatedResponse } from './registration-service';

const activityApi = apiServices.activity;

export interface ProgramTypeResponse {
  id: string
  name: string
  rules: string
}



export interface Activity {
  id: string;
  program_type_id: string
  level_id: string
  group_id: string
  name: string
  description: string
  start_period: string
  months_duration: number
  activity_type: string
  location: string
  web_portal: string
  academic_year: string
  program_provider: string
  approval_status: string
  submitted_by: string
  program_type_name: string
  level_name: string;
  group_name: string;
  matching: Matching[];
}

export interface Matching {
  id: string;
  mata_kuliah: string;
  kode: string;
  semester: string;
  prodi_penyelenggara: string;
  sks: number;
  kelas: string;
  departemen: string;
  tipe_mata_kuliah: string
  document: Document[]
}

export interface Document {
  id: string;
  subject_id: string;
  file_storage_id: string;
  name: string;
  document_type: string;
}


export interface ActivityCreateInput {
  program_type_id: string;
  level_id: string
  group_id: string
  name: string
  description: string
  start_period: string
  months_duration: number
  activity_type: string
  location: string
  academic_year: string
  program_provider: string
}

// Activity management service endpoints
export const activityService = {
  // Get all activities
  getActivities: async (page = 1, limit = 10, filters = {}) => {
    const response = await activityApi.post<PaginatedResponse<Activity>>(
      `/activity/filter?page=${page}&limit=${limit}`,
      {
        ...filters,
      }
    );
    return response.data;
  },

  getAllProgramTypes: async() => {
    const response = await activityApi.get<PaginatedResponse<ProgramTypeResponse>>("/program_type");
    return response.data;
  },  

  getAllLevels: async() => {
    const response = await activityApi.get<PaginatedResponse<ProgramTypeResponse>>("/level");
    console.log("RESPONSE LEVEL", response.data)
    return response.data;
  },


  getAllGroups: async() => {
    const response = await activityApi.get<PaginatedResponse<ProgramTypeResponse>>("/group");
    console.log("RESPONSE GROUP", response.data);
    return response.data;
  },

  // Get single activity by ID
  getActivityById: async (id: string) => {
    const response = await activityApi.get<Activity>(`/activities/${id}`);
    return response.data;
  },

  // Create new activity
  createActivity: async (activityData: ActivityCreateInput) => {
    console.log("ACTIVITY DATA", activityData);
    const response = await activityApi.post<Activity>('/activity', activityData);
    return response.data;
  },

  // Update existing activity
  updateActivity: async (id: string, activityData: Partial<ActivityCreateInput>) => {
    const response = await activityApi.put<Activity>(`/activities/${id}`, activityData);
    return response.data;
  },

  // Delete activity
  deleteActivity: async (id: string) => {
    const response = await activityApi.delete(`/activities/${id}`);
    return response.data;
  },

  // Get activities by user ID
  getUserActivities: async (userId: string) => {
    const response = await activityApi.get<Activity[]>(`/users/${userId}/activities`);
    return response.data;
  },

  // Get upcoming activities
  getUpcomingActivities: async () => {
    const response = await activityApi.get<Activity[]>('/activities/upcoming');
    return response.data;
  },
}; 