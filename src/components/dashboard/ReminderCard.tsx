import React from "react";

interface ReminderCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  actionLink: string;
  className?: string;
}

export function ReminderCard({
  title,
  description,
  icon,
  actionText,
  actionLink,
  className = "",
}: ReminderCardProps) {
  return (
    <div className={`border rounded-md p-4 flex items-start gap-4 ${className}`}>
      <div className="bg-gray-100 p-3 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <a
          href={actionLink}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          {actionText}
        </a>
      </div>
    </div>
  );
} 