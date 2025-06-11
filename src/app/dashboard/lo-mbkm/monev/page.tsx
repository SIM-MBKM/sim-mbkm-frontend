"use client";

import { MonevManagementDashboard } from "@/components/dashboard/lo-mbkm/monev/monev-management-dashboard";
import { MonevAPIProvider } from "@/lib/api/providers/monev-provider";
import { Toaster } from "@/components/ui/toaster";

export default function MonevPage() {
  return (
    <div className="mb-6 mt-20">
      <MonevAPIProvider>
        <MonevManagementDashboard />
      </MonevAPIProvider>
      <Toaster />
    </div>
  );
}
