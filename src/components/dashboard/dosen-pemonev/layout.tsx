"use client";

import { DosenPemonevProvider } from "@/lib/api/providers/dosen-pemonev-provider";

interface DosenPemonevLayoutProps {
  children: React.ReactNode;
}

export function DosenPemonevLayout({ children }: DosenPemonevLayoutProps) {
  return (
    <DosenPemonevProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">{children}</div>
      </div>
    </DosenPemonevProvider>
  );
}

// Export all components for easy import
export { DosenPemonevMainDashboard } from "@/components/dashboard/dosen-pemonev/main-dashboard";
export { DosenPemonevMonevPage } from "@/components/dashboard/dosen-pemonev/management-dashboard";
export { DosenPemonevEvaluationCard } from "@/components/dashboard/dosen-pemonev/evaluation-card";
export { useDosenPemonev } from "@/lib/api/providers/dosen-pemonev-provider";
