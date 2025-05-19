"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle } from "lucide-react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ProgramList } from "./program-list"
import { ProgramDetail } from "./program-detail"
import { ProgramFilter } from "./program-filter"
import { ProgramStats } from "./program-stats"
import { ProgramProvider } from "./program-provider"
import { Button } from "@/components/ui/button"
import { AddProgramForm } from "./add-program-form"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { MobileMenu } from "./mobile-menu"
import { useAllProgramTypes, useAllLevels, useAllGroups, useActivities, useCreateActivity } from "@/lib/api/hooks/use-query-hooks"
import { Activity, ProgramTypeResponse, ActivityFilter, ActivityAllResponse, ActivityCreateInput } from "@/lib/api/services/activity-service"
import { toast } from "react-toastify"

// Create a context to hold API data
type ProgramAPIContextType = {
  programTypes: ProgramTypeResponse[] | undefined;
  levels: ProgramTypeResponse[] | undefined;
  groups: ProgramTypeResponse[] | undefined;
  activities: Activity[] | undefined;
  isLoading: boolean;
  activitiesPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  changePage: (newPage: number) => void;
  changeLimit: (newLimit: number) => void;
  currentLimit: number;
  activitiesData: ActivityAllResponse | undefined;
  setFilters: (filters: Partial<ActivityFilter>) => void;
  currentFilters: ActivityFilter;
  createActivity: (activityData: ActivityCreateInput) => Promise<void>;
  isCreating: boolean;
}

const ProgramAPIContext = createContext<ProgramAPIContextType | undefined>(undefined);

export function useProgramAPI() {
  const context = useContext(ProgramAPIContext);
  if (context === undefined) {
    throw new Error("useProgramAPI must be used within a ProgramAPIProvider");
  }
  return context;
}

function ProgramAPIProvider({ children }: { children: React.ReactNode }) {
  // Pagination state for activities
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesLimit, setActivitiesLimit] = useState(4);
  
  // Initialize with default ActivityFilter values
  const [activityFilters, setActivityFilters] = useState<ActivityFilter>({
    activity_id: "",
    academic_year: "",
    program_type_id: "",
    level_id: "",
    group_id: "",
    name: "",
    approval_status: "APPROVED" // Default filter
  });

  // Fetch all program types, levels, and groups
  const { data: programTypesData, isLoading: isProgramTypesLoading } = useAllProgramTypes();
  const { data: levelsData, isLoading: isLevelsLoading } = useAllLevels();
  const { data: groupsData, isLoading: isGroupsLoading } = useAllGroups();
  
  // Fetch activities with pagination
  const { 
    data: activitiesData, 
    isLoading: isActivitiesLoading,
    refetch: refetchActivities
  } = useActivities(activitiesPage, activitiesLimit, activityFilters);

  const { mutate: createActivity, isPending: isCreating } = useCreateActivity()

  // Function to change page
  const changePage = (newPage: number) => {
    setActivitiesPage(newPage);
  };

  // Function to change limit (items per page)
  const changeLimit = (newLimit: number) => {
    setActivitiesLimit(newLimit);
    // Reset to first page when changing the limit
    setActivitiesPage(1);
  };

  // Function to set filters
  const setFilters = (filters: Partial<ActivityFilter>) => {
    setActivityFilters(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
    // Reset to first page when changing filters
    setActivitiesPage(1);
  };

  // Combined loading state
  const isLoading = isProgramTypesLoading || isLevelsLoading || isGroupsLoading || isActivitiesLoading;

  // Extract data from query results
  const programTypes = programTypesData?.data;
  const levels = levelsData?.data;
  const groups = groupsData?.data;
  const activities = activitiesData?.data;

  // Create pagination object for activities
  const activitiesPagination = {
    currentPage: activitiesData?.current_page || 1,
    totalPages: activitiesData?.total_pages || 1,
    totalItems: activitiesData?.total || 0,
    hasNextPage: activitiesData?.next_page_url !== "",
    hasPrevPage: activitiesData?.prev_page_url !== ""
  };

  // Refetch activities when page or limit changes
  useEffect(() => {
    refetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesPage, activitiesLimit]);

  // Add function to handle activity creation
  const handleCreateActivity = async (activityData: ActivityCreateInput) => {
    try {
      await createActivity(activityData, {
        onSuccess: () => {
          toast.success("Program created successfully!", {
            position: "top-right",
            autoClose: 3000,
          })
          refetchActivities()
        },
        onError: (error) => {
          toast.error("Failed to create program. Please try again.", {
            position: "top-right",
            autoClose: 5000,
          })
          console.error("Error creating program:", error)
        }
      })
    } catch (error) {
      console.error("Error in handleCreateActivity:", error)
    }
  }

  const value = {
    programTypes,
    levels,
    groups,
    activities,
    isLoading,
    activitiesPagination,
    changePage,
    changeLimit,
    currentLimit: activitiesLimit,
    activitiesData,
    setFilters,
    currentFilters: activityFilters,
    createActivity: handleCreateActivity,
    isCreating
  };

  return <ProgramAPIContext.Provider value={value}>{children}</ProgramAPIContext.Provider>;
}

export function ProgramDashboard() {
  const [selectedTab, setSelectedTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("APPROVED")
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Reset selected program when tab changes
  useEffect(() => {
    setSelectedProgramId(null)
  }, [selectedTab])

  return (
      <div className="mb-10 mt-20">
      <ProgramAPIProvider>
        <ProgramProvider>
          {/* React Toastify Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />  

          <AnimatePresence>
            {isMobile && isMobileMenuOpen && (
              <MobileMenu
                onClose={() => setIsMobileMenuOpen(false)}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
              />
            )}
          </AnimatePresence>
    
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ProgramStats selectedTab={selectedTab} />
            </motion.div>

            {/* Add New Program Button */}
            <motion.div
              className="flex justify-end mt-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Button onClick={() => setIsAddProgramOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4 text-white" />
                Add New Program
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              {!isMobile && (
                <motion.div
                  className="lg:col-span-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <ProgramFilter selectedTab={selectedTab} onTabChange={setSelectedTab} />
                </motion.div>
              )}

              <motion.div
                className={`${selectedProgramId && !isMobile ? "lg:col-span-5" : "lg:col-span-9"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ProgramList
                  selectedTab={selectedTab}
                  onSelectProgram={setSelectedProgramId}
                  selectedProgramId={selectedProgramId}
                />
              </motion.div>

              {selectedProgramId && (
                <motion.div
                  className="lg:col-span-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProgramDetail programId={selectedProgramId} onClose={() => setSelectedProgramId(null)} />
                </motion.div>
              )}
            </div>

          {/* Add Program Form Dialog */}
          <AddProgramForm isOpen={isAddProgramOpen} onOpenChange={setIsAddProgramOpen} />
        </ProgramProvider>
        </ProgramAPIProvider>
      </div>
  )
}
