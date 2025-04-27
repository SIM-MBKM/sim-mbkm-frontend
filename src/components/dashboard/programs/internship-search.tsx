"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "./search-filter";
import { InternshipList } from "./internship-list";
import { InternshipDetail } from "./internship-detail";
import { useActivities } from "@/lib/api/hooks";
import { Activity } from "@/lib/api/services/activity-service";


export function InternshipSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 4;

  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useActivities(currentPage, itemsPerPage, filters);

  console.log('Current search term in InternshipSearch:', searchTerm);
  console.log('Current page:', currentPage);
  console.log('Current filters:', filters);
  console.log('Activities data in InternshipSearch:', activitiesData);

  // Use Activity type for selectedInternship
  const [selectedInternship, setSelectedInternship] = useState<Activity | null>(null);

  // Update selectedInternship when activities data changes
  useEffect(() => {
    if (activitiesData && activitiesData.data && activitiesData.data.length > 0) {
      // Set the first activity as the selected one
      setSelectedInternship(activitiesData.data[0]);
    } else if (activitiesData && activitiesData.data && activitiesData.data.length === 0) {
      // Reset selected internship if no results
      setSelectedInternship(null);
    }
  }, [activitiesData]);

  // Handler for changing pages
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (activitiesLoading) {
    return <div>Loading activities...</div>;
  }

  if (activitiesError) {
    return <div>Error loading activities: {activitiesError.message}</div>;
  }

  return (
    <main className="flex-1 p-6 mt-20">
      <SearchFilters 
        setSearchTerm={setSearchTerm}
        setFilters={setFilters}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex mt-6 gap-6">
        <div className="w-[40%]">
          <InternshipList
            activities={activitiesData}
            isLoading={activitiesLoading}
            error={activitiesError}
            onSelect={(internship) => {
              // Find the full activity data from the available activities
              const selectedActivity = activitiesData?.data.find(
                (activity) => activity.id === internship.id
              );
              if (selectedActivity) {
                setSelectedInternship(selectedActivity);
              }
            }} 
            currentPage={currentPage}
            totalPages={activitiesData?.total_pages || 1}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="w-[60%]">
          {selectedInternship && <InternshipDetail internship={selectedInternship} />}
        </div>
      </div>
    </main>
  );
}
