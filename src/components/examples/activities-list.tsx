'use client';

import { useState } from 'react';
import { useActivities, useCreateActivity } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ActivitiesList() {
  const { data: activities, isLoading, error } = useActivities();
  const createActivityMutation = useCreateActivity();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateActivity = async () => {
    try {
      setIsCreating(true);
      await createActivityMutation.mutateAsync({
        title: 'New Activity',
        description: 'This is a new activity',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'WORKSHOP',
      });
    } catch (error) {
      console.error('Failed to create activity:', error);
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
        <Button 
          onClick={handleCreateActivity} 
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Add Activity'}
        </Button>
      </div>

      {activities && activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{activity.description}</p>
                <div className="flex justify-between mt-4 text-sm">
                  <span>Start: {new Date(activity.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(activity.endDate).toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {activity.type}
                  </span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs ml-2">
                    {activity.status}
                  </span>
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