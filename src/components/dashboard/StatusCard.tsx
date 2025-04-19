import React from "react";

interface StatusCardProps {
  title: string;
  statusTitle: string;
  statusValue: string;
  icon: React.ReactNode;
  className?: string;
}

export function StatusCard({
  title,
  statusTitle,
  statusValue,
  icon,
  className = "",
}: StatusCardProps) {
  return (
    <div className={`bg-primary rounded-md p-6 text-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-yellow-400 font-bold text-lg mb-1">{title}</h3>
          <div className="mb-4 text-sm">{statusTitle}</div>
          <div className="text-lg font-semibold">{statusValue}</div>
        </div>
        <div className="bg-white/10 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );
} 