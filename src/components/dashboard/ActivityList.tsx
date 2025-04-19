import React from "react";

interface Activity {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ActivityListProps {
  activities: Activity[];
  className?: string;
}

export function ActivityList({ activities, className = "" }: ActivityListProps) {
  return (
    <div className={`${className}`}>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 mb-4">
          <div className="bg-gray-100 rounded-full p-3">
            {activity.icon}
          </div>
          <div>
            <div className="text-gray-500 text-sm">{activity.date}</div>
            <h4 className="font-semibold mb-1">{activity.title}</h4>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 