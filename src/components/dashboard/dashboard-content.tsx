"use client"


import { DashboardLayout } from "./dashboard-layout"
import { StatusCards } from "./status-card"
import { CalendarSection } from './calendar-section';
import { ActivityFeed } from './activity-feed';
import { ReviewSection } from './review-section';

export function DashboardContent() {
  return (
    <DashboardLayout>
      {/* Status Cards */}
      <StatusCards />

      {/* Calendar and Activities */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Calendar */}
          <CalendarSection />

          {/* Activities */}
          <ActivityFeed />
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection />
    </DashboardLayout>
  )
}
