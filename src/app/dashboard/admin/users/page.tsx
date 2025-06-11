"use client";

import { UserManagementDashboard } from "@/components/dashboard/admin/users/user-management-dashboard";
import { Toaster } from "@/components/ui/toaster";
import { UserAPIProvider } from "@/lib/api/providers/user-provider";

export default function AdminDashboard() {
  return (
    <div className="mb-6 mt-20">
      <UserAPIProvider>
        <UserManagementDashboard />
      </UserAPIProvider>
      <Toaster />
    </div>
  );
}
