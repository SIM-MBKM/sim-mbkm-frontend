import { apiServices } from "../axios-instance";
import { buildUserParams } from "@/lib/utils/param-builder";

const userApi = apiServices.user;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // department?: string; ----> currently not needed
  nrp: string;
}

export interface UserAlt {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role_name: string;
  // department?: string; ----> currently not needed
  nrp: string;
}

export interface UserRole {
  // role: "MAHASISWA" | "DOSEN PEMBIMBING" | "DOSEN PEMONEV" | "LO-MBKM" | "MITRA" | "ADMIN";
  role: string;
}

export interface Role {
  id: string;
  name: UserRole;
  description: string;
  permissions?: PermissionGroup[];
}

export interface PermissionGroup {
  service: string;
  permissions: string[];
}

export interface UserRoleResponse {
  message: string;
  status: string;
  data: UserRole;
}

export interface UserUpdateInput {
  nrp?: string;
  // name?: string;
  // email?: string;
  // department?: string;
  // profilePicture?: string;
}

export interface PaginatedResponse<T> {
  message: string;
  status: string;
  data: T[];
  current_page: number;
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
  total_pages: number;
}

export interface BaseResponse<T> {
  message: string;
  status: string;
  data: T;
}

export interface BaseResponseNoData {
  message: string;
  status: string;
}

// User filter interface
export interface UserFilter {
  role_name?: string;
  nrp?: string;
  email?: string;
  user_nrp?: string;
  user_email?: string;
}

// User management service endpoints
export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await userApi.get<User>("/users/me");
    return response.data;
  },

  // Get user role
  getUserRole: async () => {
    const response = await userApi.get<UserRoleResponse>("/users/me/role");
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await userApi.get<User>(`/by-user-id/${id}`);
    return response.data;
  },

  getUserDatas: async () => {
    const response = await userApi.get<BaseResponse<User>>(`/users/me`);
    return response.data;
  },

  // Update user profile
  updateUser: async (userId: string, userData: UserUpdateInput) => {
    const response = await userApi.patch<User>(`/users/update/${userId}`, userData);
    return response.data;
  },

  // Get all users with filters (admin only) - using params builder
  getAllUsers: async (page = 1, perPage = 10, filters: UserFilter = {}) => {
    const queryParams = buildUserParams(page, perPage, filters);
    const response = await userApi.get<PaginatedResponse<UserAlt>>(`/users?${queryParams}`);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string, page = 1, perPage = 10) => {
    const queryParams = buildUserParams(page, perPage, { role_name: role });
    const response = await userApi.get<{ users: User[]; total: number }>(`/users/?${queryParams}`);
    return response.data;
  },

  // Alternative, with auth user id included
  getUsersByRoleAlt: async (role: string, page = 1, perPage = 1000) => {
    const queryParams = buildUserParams(page, perPage, { role_name: role });
    const response = await userApi.get<PaginatedResponse<UserAlt>>(`/users/?${queryParams}`);
    return response.data;
  },

  // Get all roles available (admin)
  getAllRoles: async () => {
    const response = await userApi.get<BaseResponse<Role[]>>(`/roles`);
    return response.data;
  },

  // Update user role (admin)
  updateUserRoleByUserId: async (id: string, role: string) => {
    const response = await userApi.put<BaseResponseNoData>(`users/${id}/role`, {
      role_name: role,
    });
    return response.data;
  },

  // Update self user role (dosen pembimbing / dosen pemonev )
  updateUserRoleSelfToDosenPembimbing: async () => {
    const response = await userApi.put<BaseResponseNoData>(`users/me/role/dosen-pembimbing`);
    return response.data;
  },

  updateUserRoleSelfToDosenPemonev: async () => {
    const response = await userApi.put<BaseResponseNoData>(`users/me/role/dosen-pemonev`);
    return response.data;
  },

  // DISABLED -- no implementation currently on backend

  // // Search users
  // searchUsers: async (query: string, page = 1, perPage = 10) => {
  //   const queryParams = buildUserParams(page, perPage, { q: query });
  //   const response = await userApi.get<{ users: User[]; total: number }>(
  //     `/users/search?${queryParams}`
  //   );
  //   return response.data;
  // },
};
