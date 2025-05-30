'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useGetUserDatas, useUserRole } from '@/lib/api/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setRole, setLoading, setError, UserRole } from '@/lib/redux/roleSlice';
import { User } from '../api/services';
import { setUser } from '../redux/userDataSlice';

// Define role-based route prefixes
const ROLE_ROUTES: Record<UserRole, string> = {
  MAHASISWA: '/dashboard/mahasiswa',
  "DOSEN PEMBIMBING": '/dashboard/dosen-pembimbing',
  ADMIN: '/dashboard/admin',
  "LO-MBKM": '/dashboard/lo-mbkm',
  "DOSEN PEMONEV": '/dashboard/dosen-pemonev',
  MITRA: '/dashboard/mitra'
};

export const useRoleManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { role, loading, error } = useAppSelector(state => state.role);
  
  const { data: roleData, isLoading, error: roleError } = useUserRole();
  const { data: userDatas, isLoading: userDatasLoading, error: userDatasError } = useGetUserDatas();
  
  // Effect to fetch and set role from API
  useEffect(() => {
    if (isLoading || userDatasLoading) {
      dispatch(setLoading(true));
    }
    
    if (roleError || userDatasError) {
      dispatch(setError((roleError as Error).message));
    }
    
    if (roleData && roleData.data && userDatas && userDatas.data) {
      const userRole = roleData.data.role as UserRole;
      const userData = userDatas.data as User;
      dispatch(setUser(userData));
      dispatch(setRole(userRole));
    }
  }, [roleData, isLoading, roleError, dispatch, userDatas, userDatasLoading]);
  
  // Effect to handle route protection
  useEffect(() => {
    if (!loading && role) {
      const allowedPrefix = ROLE_ROUTES[role];
      
      // Check if user is trying to access a dashboard route that doesn't match their role
      const isDashboardRoute = pathname.startsWith('/dashboard/');
      const isAccessingWrongRole = isDashboardRoute && !pathname.startsWith(allowedPrefix);
      
      if (isAccessingWrongRole) {
        // Redirect to the appropriate dashboard
        router.replace(allowedPrefix);
      }
    }
  }, [role, loading, pathname, router]);
  
  return { role, loading, error };
}; 