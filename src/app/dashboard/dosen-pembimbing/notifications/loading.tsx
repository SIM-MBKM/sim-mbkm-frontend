import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="py-6 mt-15">
        <Card className="mb-6">
          <CardHeader>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
          </CardHeader>
        </Card>
        
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 