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
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

export interface ActivityCreateInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
}

// Activity management service endpoints
export const activityService = {
  // Get all activities
  getActivities: async () => {
    const response = await activityApi.get<Activity[]>('/activities');
    return response.data;
  },

  getAllProgramTypes: async() => {
    const response = await activityApi.get<PaginatedResponse<ProgramTypeResponse>>(`/level`);
    return response.data;
  },  

  // Get single activity by ID
  getActivityById: async (id: string) => {
    const response = await activityApi.get<Activity>(`/activities/${id}`);
    return response.data;
  },

  // Create new activity
  createActivity: async (activityData: ActivityCreateInput) => {
    const response = await activityApi.post<Activity>('/activities', activityData);
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