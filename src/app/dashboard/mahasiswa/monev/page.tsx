import { MahasiswaMonevLayout, MahasiswaMonevPage } from "@/components/dashboard/mahasiswa/monev-mahasiswa";
import { ProtectedDashboardLayout } from "@/components/dashboard/protected-dashboard-layout";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function MahasiswaMonevHistoryPage() {
  return (
    <ProtectedDashboardLayout allowedRole="MAHASISWA">
      <DashboardLayout>
        <div className="mt-20">
          <MahasiswaMonevLayout>
            <MahasiswaMonevPage />
          </MahasiswaMonevLayout>
        </div>
      </DashboardLayout>
    </ProtectedDashboardLayout>
  );
}
