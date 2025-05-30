import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bell, Clock } from "lucide-react";

export default function Loading() {
  return (
    <DashboardLayout>
      <div className="py-6 mt-15">
        <Card className="mb-6 border-2 border-neutral-200 shadow-sm transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <div className="text-white bg-white/20 p-1.5 rounded-full">
                <Bell className="h-5 w-5" />
              </div>
              <div className="h-6 w-40 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-8 bg-white/10 rounded-md animate-pulse"></div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="h-4 w-36 bg-blue-100 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {Array(5).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-32 bg-gray-100 animate-pulse rounded-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 