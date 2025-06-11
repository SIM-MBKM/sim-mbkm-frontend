import { DashboardLayoutDosen } from "@/components/dashboard/dashboard-layout-dosen";
import { DosenPemonevLayout, DosenPemonevMainDashboard } from "@/components/dashboard/dosen-pemonev/layout";
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";

export default function DosenPemonevDashboardPage() {
  return (
    <ProtectedDashboardLayout allowedRole="DOSEN PEMONEV">
      <DashboardLayoutDosen>
        <div className="mt-20">
          <DosenPemonevLayout>
            <DosenPemonevMainDashboard />
          </DosenPemonevLayout>
        </div>
      </DashboardLayoutDosen>
    </ProtectedDashboardLayout>
  );
}
