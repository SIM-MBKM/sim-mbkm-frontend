"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleManager } from "@/lib/hooks/use-role-manager";
import { UserRole } from "@/lib/redux/roleSlice";
import { Loader2 } from "lucide-react";

interface ProtectedDashboardLayoutProps {
  children: ReactNode;
  allowedRole: UserRole;
}

export function ProtectedDashboardLayout({
  children,
  allowedRole,
}: ProtectedDashboardLayoutProps) {
  const router = useRouter();
  const { role, loading } = useRoleManager();

  useEffect(() => {
    // If role is loaded and doesn't match the allowed role, redirect
    if (!loading && role && role !== allowedRole) {
      // Map role to correct dashboard route
      const roleRoutes: Record<UserRole, string> = {
        MAHASISWA: "/dashboard/mahasiswa",
        "DOSEN PEMBIMBING": "/dashboard/dosen-pembimbing",
        ADMIN: "/dashboard/admin",
        "LO-MBKM": "/dashboard/lo-mbkm",
        "DOSEN PEMONEV": "/dashboard/dosen-pemonev",
        MITRA: "/dashboard/mitra",
      };

      // Redirect to the appropriate dashboard
      router.replace(roleRoutes[role]);
    }
  }, [role, loading, allowedRole, router]);

  // Show loading state while checking roles
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#003478]" />
      </div>
    );
  }

  // If role matches or not loaded yet, render children
  // return <DashboardLayout>{children}</DashboardLayout>;
  return <>{children}</>;
}
