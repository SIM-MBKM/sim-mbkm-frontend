"use client";

import { useState } from "react";
import { useActivities, useCreateActivity } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFilter } from "@/lib/api/services/activity-service";

export function ActivitiesList() {
  // Define default filters for the activities query
  const defaultFilters: ActivityFilter = {
    activity_id: "",
    program_type_id: "",
    level_id: "",
    group_id: "",
    name: "",
    approval_status: "",
    academic_year: "",
  };

  // Fixed: Provide all 3 required parameters to useActivities
  const { data: activitiesResponse, isLoading, error } = useActivities(1, 10, defaultFilters);
  const createActivityMutation = useCreateActivity();
  const [isCreating, setIsCreating] = useState(false);

  // Extract activities from the response
  const activities = activitiesResponse?.data || [];

  const handleCreateActivity = async () => {
    try {
      setIsCreating(true);
      await createActivityMutation.mutateAsync({
        program_type_id: "1",
        level_id: "1",
        group_id: "1",
        name: "New Activity",
        description: "This is a new activity",
        start_period: new Date().toISOString(),
        months_duration: 6,
        activity_type: "WORKSHOP",
        location: "Online",
        academic_year: "2024/2025",
        program_provider: "System",
      });
    } catch (error) {
      console.error("Failed to create activity:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  if (error) {
    return <div>Error loading activities: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Activities</h2>
        <Button onClick={handleCreateActivity} disabled={isCreating}>
          {isCreating ? "Creating..." : "Add Activity"}
        </Button>
      </div>

      {activities && activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <CardTitle>{activity.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{activity.description}</p>
                <div className="flex justify-between mt-4 text-sm">
                  <span>Start: {new Date(activity.start_period).toLocaleDateString()}</span>
                  <span>Duration: {activity.months_duration} months</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {activity.activity_type}
                  </span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs ml-2">
                    {activity.approval_status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Location: {activity.location}</p>
                  <p>Provider: {activity.program_provider}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No activities found.</p>
        </div>
      )}
    </div>
  );
}
