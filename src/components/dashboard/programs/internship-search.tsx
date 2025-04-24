"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "./search-filter";
import { InternshipList } from "./internship-list";
import { InternshipDetail } from "./internship-detail";
import { useActivities } from "@/lib/api/hooks";

interface Internship {
  id: string;
  name: string;
  program_provider: string;
  location: string;
}

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

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Update selectedInternship when activities data changes
  useEffect(() => {
    if (activitiesData && activitiesData.data && activitiesData.data.length > 0) {
      const firstActivity = activitiesData.data[0];
      setSelectedInternship({
        id: firstActivity.id,
        name: firstActivity.name,
        program_provider: firstActivity.program_provider,
        location: firstActivity.location || "",
      });
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
            onSelect={(internship) => setSelectedInternship({
              id: internship.id,
              name: internship.name,
              program_provider: internship.program_provider,
              location: internship.location || "",
            })} 
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
