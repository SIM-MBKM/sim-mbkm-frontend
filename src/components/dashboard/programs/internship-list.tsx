"use client"

import Image from "next/image"
import { Activity } from "@/lib/api/services/activity-service"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Internship {
  id: string;
  name: string;
  program_provider: string;
  location?: string;
}

interface InternshipListProps {
  onSelect: (internship: Internship) => void;
  activities: { data: Activity[]; total: number; total_pages: number } | undefined;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function InternshipList({ 
  onSelect, 
  activities, 
  isLoading, 
  error,
  currentPage,
  totalPages,
  onPageChange 
}: InternshipListProps) {
  console.log('Activities data in InternshipList:', activities);

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div>Error loading activities: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {activities && activities.data && activities.data.map((activity: Activity) => (
        <div
          key={activity.id}
          className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect({ ...activity, location: activity.location || "" })}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=60&width=60&text=Icon"
                alt="Company Logo"
                width={60}
                height={60}
                className="rounded-full bg-gray-200"
              />
            </div>
            <div>
              <h3 className="font-bold">{activity.name}</h3>
              <p className="text-sm text-gray-600">{activity.program_provider}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      {activities && activities.data && activities.data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {activities.data.length} of {activities.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {activities && activities.data && activities.data.length === 0 && (
        <div className="text-center p-4">
          <p className="text-gray-500">No activities found</p>
        </div>
      )}
    </div>
  );
}
