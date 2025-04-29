import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { EquivalenceManager } from "@/components/dashboard/equivalence/equivalence-manager";

export default function EquivalenceRoute() {
  return (
    <DashboardLayout>
      <EquivalenceManager />
    </DashboardLayout>
  );
}
