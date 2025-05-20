import { apiServices } from '../axios-instance';
import { BaseResponse } from './registration-service';

const userApi = apiServices.user;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  nrp: string;
}

export interface UserRole {
  role: string;
}

export interface UserRoleResponse {
  message: string;
  status: string;
  data: UserRole;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  department?: string;
  profilePicture?: string;
}

// User management service endpoints
export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await userApi.get<User>('/users/me');
    return response.data;
  },

  // Get user role
  getUserRole: async () => {
    const response = await userApi.get<UserRoleResponse>('/user/role');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await userApi.get<User>(`/users/${id}`);
    return response.data;
  },

  getUserDatas: async () => {
    const response = await userApi.get<BaseResponse<User>>(`/user`);
    return response.data;
  },

  // Update user profile
  updateUser: async (userId: string, userData: UserUpdateInput) => {
    const response = await userApi.put<User>(`/users/${userId}`, userData);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await userApi.get<{users: User[], total: number}>(
      `/users?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string, page = 1, limit = 10) => {
    const response = await userApi.get<{users: User[], total: number}>(
      `/users/role/${role}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Search users
  searchUsers: async (query: string, page = 1, limit = 10) => {
    const response = await userApi.get<{users: User[], total: number}>(
      `/users/search?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
}; 