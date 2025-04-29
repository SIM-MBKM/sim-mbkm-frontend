'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserRole } from '@/lib/api/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setRole, setLoading, setError, UserRole } from '@/lib/redux/roleSlice';

// Define role-based route prefixes
const ROLE_ROUTES: Record<UserRole, string> = {
  MAHASISWA: '/dashboard/mahasiswa',
  "DOSEN PEMBIMBING": '/dashboard/dosen-pembimbing',
  ADMIN: '/dashboard/admin',
  SUPERADMIN: '/dashboard/superadmin',
  PIMPINAN: '/dashboard/pimpinan',
  TENDIK: '/dashboard/tendik'
};

export const useRoleManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { role, loading, error } = useAppSelector(state => state.role);
  
  const { data: roleData, isLoading, error: roleError } = useUserRole();
  
  // Effect to fetch and set role from API
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
    
    if (roleError) {
      dispatch(setError((roleError as Error).message));
    }
    
    if (roleData && roleData.data) {
      const userRole = roleData.data.role as UserRole;
      dispatch(setRole(userRole));
    }
  }, [roleData, isLoading, roleError, dispatch]);
  
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