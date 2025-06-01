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
  approval_status: "PENDING" | "APPROVED" | "REJECTED"
  submitted_by: string
  program_type: string
  level: string;
  submitted_user_role: string | null;
  group: string;
  matching: Matching[] | null;
  // total_approval_data: TotalApprovalData[] | null;
}

export interface ActivityAllResponse extends PaginatedResponse<Activity> {
  total_approval_data: TotalApprovalData[] | null
}

export interface TotalApprovalData {
  approval_status: string;
  total: number;
}

export interface Matching {
  id: string;
  subject_id: string;
  mata_kuliah: string;
  kode: string;
  semester: string;
  prodi_penyelenggara: string;
  sks: number;
  kelas: string;
  departemen: string;
  tipe_mata_kuliah: string
  documents: Document[]
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

export interface MetaDataActivity<T> {
  message: string;
  status: string
  data: T
}

export interface ActivityFilter {
  activity_id: string;
  program_type_id: string;
  level_id: string;
  group_id: string;
  name: string;
  approval_status: string;
  academic_year: string;
}

// UpdateActivityRequest struct {
//   ProgramTypeID   string    `json:"program_type_id"`
//   LevelID         string    `json:"level_id"`
//   GroupID         string    `json:"group_id"`
//   Name            string    `json:"name"`
//   Description     string    `json:"description"`
//   StartPeriod     time.Time `json:"start_period"`
//   MonthsDuration  int       `json:"months_duration"`
//   ActivityType    string    `json:"activity_type"`
//   Location        string    `json:"location"`
//   WebPortal       string    `json:"web_portal"`
//   AcademicYear    string    `json:"academic_year"`
//   ProgramProvider string    `json:"program_provider"`
//   ApprovalStatus  string    `json:"approval_status"`
// }

export interface ActivityUpdateInput {
  program_type_id: string;
  level_id: string;
  group_id: string;
  name: string;
  description: string;
  start_period: string;
  months_duration: number;
  activity_type: string;
  location: string;
  web_portal: string;
  academic_year: string;
  program_provider: string;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TotalMatchedStatusActivities  {
  status: 'ALL' | 'MATCHED' | 'UNMATCHED';
  total: number;
}
// Activity management service endpoints
export const activityService = {
  // Get all activities
  getActivities: async (page = 1, limit = 10, filters: ActivityFilter) => {
    const response = await activityApi.post<ActivityAllResponse>(
      `/activity/filter?page=${page}&limit=${limit}`, filters
    );
    return response.data;
  },

  getTotalMatchedStatusActivities: async () => {
    const response = await activityApi.get<MetaDataActivity<TotalMatchedStatusActivities[]>>("/activity/total-matching");
    
    return response.data;
  },

  getUnmatchedActivities: async (page = 1, limit = 10, filters: ActivityFilter) => {
    const response = await activityApi.post<ActivityAllResponse>(
      `/activity/unmatched?page=${page}&limit=${limit}`, filters
    );
    return response.data;
  },

  getMatchedActivities: async (page = 1, limit = 10, filters: ActivityFilter) => {
    const response = await activityApi.post<ActivityAllResponse>(
      `/activity/matched?page=${page}&limit=${limit}`, filters
    );
    return response.data;
  },

  getAcademicYears: async () => {
    const response = await activityApi.get<MetaDataActivity<string[]>>("/activity/academic-year");
    return response.data;
  },

  updateActivityById: async(id: string, activityData: ActivityUpdateInput) => {
    const response = await activityApi.put<Activity>(`/activity/${id}`, activityData);
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
    const response = await activityApi.get<MetaDataActivity<Activity>>(`/activity/${id}`);
    console.log("ACTIVITY DATA BY ID", response)
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
    const response = await activityApi.delete(`/activity/${id}`);
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