"use client";

import { useUsers } from "@/lib/api/hooks";
import type { PaginatedResponse, UserAlt, UserFilter } from "@/lib/api/services";
import type React from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type UserAPIContextType = {
  users: UserAlt[] | undefined;
  isLoading: boolean;
  usersPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  changePage: (newPage: number) => void;
  changePerPage: (newPerPage: number) => void;
  currentPerPage: number;
  usersData: PaginatedResponse<UserAlt> | undefined;
  setFilters: (filters: Partial<UserFilter>) => void;
  currentFilters: UserFilter;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  clearFilters: () => void;
  refreshUsers: () => void;
  // Form state management
  isFormSubmitting: boolean;
  setFormSubmitting: (submitting: boolean) => void;
  // User statistics
  userStats: {
    total: number;
    admins: number;
    students: number;
    lecturers: number;
    partners: number;
    loMbkm: number;
  };
};

const UserAPIContext = createContext<UserAPIContextType | undefined>(undefined);

export function useUserAPI() {
  const context = useContext(UserAPIContext);
  if (context === undefined) {
    throw new Error("useUserAPI must be used within a UserAPIProvider");
  }
  return context;
}

function UserAPIProvider({ children }: { children: React.ReactNode }) {
  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFormSubmitting, setFormSubmitting] = useState(false);

  // Build filters from search term and role filter
  const userFilters = useMemo<UserFilter>(() => {
    const filters: UserFilter = {};

    if (searchTerm.trim()) {
      filters.email = searchTerm.trim();
      filters.user_email = searchTerm.trim();
    }

    if (roleFilter !== "all") {
      filters.role_name = roleFilter;
    }

    return filters;
  }, [searchTerm, roleFilter]);

  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useUsers(usersPage, usersPerPage, userFilters);

  const changePage = useCallback((newPage: number) => {
    setUsersPage(newPage);
  }, []);

  const changePerPage = useCallback((newPerPage: number) => {
    setUsersPerPage(newPerPage);
    setUsersPage(1); // Reset to first page when changing per page
  }, []);

  const setFilters = useCallback((filters: Partial<UserFilter>) => {
    // Update search term if email filter is provided
    if (filters.email !== undefined || filters.user_email !== undefined) {
      setSearchTerm(filters.email || filters.user_email || "");
    }

    // Update role filter if role_name is provided
    if (filters.role_name !== undefined) {
      setRoleFilter(filters.role_name || "all");
    }

    // Reset to first page when changing filters
    setUsersPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter("all");
    setUsersPage(1);
  }, []);

  const refreshUsers = useCallback(() => {
    refetchUsers();
  }, [refetchUsers]);

  const users = usersData?.data || [];

  const usersPagination = {
    currentPage: usersData?.current_page || 1,
    totalPages: usersData?.total_pages || 1,
    totalItems: usersData?.total || 0,
    hasNextPage: (usersData?.next_page_url && usersData.next_page_url !== "") || false,
    hasPrevPage: (usersData?.prev_page_url && usersData.prev_page_url !== "") || false,
  };

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!users) {
      return {
        total: 0,
        admins: 0,
        students: 0,
        lecturers: 0,
        partners: 0,
        loMbkm: 0,
      };
    }

    const lecturerRoles = ["DOSEN PEMBIMBING", "DOSEN PEMONEV"];

    return {
      total: usersPagination.totalItems,
      admins: users.filter((user) => user.role_name === "ADMIN").length,
      students: users.filter((user) => user.role_name === "MAHASISWA").length,
      lecturers: users.filter((user) => user.role_name && lecturerRoles.includes(user.role_name)).length,
      partners: users.filter((user) => user.role_name === "MITRA").length,
      loMbkm: users.filter((user) => user.role_name === "LO-MBKM").length,
    };
  }, [users, usersPagination.totalItems]);

  // Auto-refetch when filters change (with debounce handled by the component)
  useEffect(() => {
    refetchUsers();
  }, [usersPage, usersPerPage, userFilters, refetchUsers]);

  const value = {
    users,
    isLoading: isUsersLoading,
    usersPagination,
    changePage,
    changePerPage,
    currentPerPage: usersPerPage,
    usersData,
    setFilters,
    currentFilters: userFilters,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    clearFilters,
    refreshUsers,
    isFormSubmitting,
    setFormSubmitting,
    userStats,
  };

  return <UserAPIContext.Provider value={value}>{children}</UserAPIContext.Provider>;
}

export { UserAPIProvider };
