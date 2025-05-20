import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 