"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Search, X, Check, Loader2, Filter } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/lib/api/hooks/use-toast"
import { useSubjects, useSubmitMatchingRequest } from "@/lib/api/hooks/use-query-hooks"
import { Activity, Matching } from "@/lib/api/services"
import { Subject } from '@/lib/api/services/matching-service';

interface MatchingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: Activity
}

export function MatchingDialog({ open, onOpenChange, activity }: MatchingDialogProps) {
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<IntersectionObserver | null>(null)

  // Filter state
  const [subjectFilter, setSubjectFilter] = useState({
    kode: "",
    semester: "",
    prodi_penyelenggara: "",
    departemen: "",
    kelas: "",
    tipe_mata_kuliah: ""
  })

  // Use React Query hooks for data fetching
  const { 
    data: subjectsData, 
    isLoading, 
    error: subjectsError,
    refetch: refetchSubjects,
    isFetching
  } = useSubjects({
    page, 
    limit: 20, 
    subjectFilter: subjectFilter
  })

  // Get mutation function for submitting matching request
  const submitMatchingMutation = useSubmitMatchingRequest()
  
  // Extract subjects from data
  const subjects = subjectsData?.data || [] as Subject[]

  // Initialize selected subjects once when dialog opens and data is loaded
  useEffect(() => {
    if (!open || isLoading || !activity) return;
    
    console.log("Initializing selected subjects");
    
    // Extract matched IDs from activity.matching
    let matchedIds: string[] = [];
    
    if (activity.matching) {
      if (Array.isArray(activity.matching)) {
        matchedIds = activity.matching
          .map(match => match?.subject_id || "")
          .filter(Boolean);
      } else if (typeof activity.matching === 'object' && activity.matching !== null) {
        const match = activity.matching as Matching;
        const id = match?.subject_id || "";
        if (id) matchedIds = [id];
      }
    }
    
    console.log("Setting selected subjects:", matchedIds);
    setSelectedSubjects(matchedIds);
  }, [open, isLoading, activity]);

  // Update filtered subjects when subjects or search term changes
  useEffect(() => {
    if (!subjects.length) return;
    
    // Append new subjects to filtered list when loading more
    if (page > 1) {
      setFilteredSubjects(prev => {
        // Get unique subjects to avoid duplicates
        const newSubjects = subjects.filter(
          subject => !prev.some(existing => existing.id === subject.id)
        );
        return [...prev, ...newSubjects];
      });
    } else {
      // First page, just set the filtered subjects
      setFilteredSubjects(subjects);
    }
    
    // Check if we've reached the end of the data
    if (subjectsData && subjects.length < 20) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [subjects, subjectsData, page]);

  // Handle search term changes
  useEffect(() => {
    // Reset pagination when search term or filters change
    if (page !== 1) {
      setPage(1);
    } else {
      // If already on page 1, manually refetch
      refetchSubjects();
    }
    
    // Update subject filter with search term
    setSubjectFilter(prev => ({
      ...prev,
      mata_kuliah: searchTerm
    }));
  }, [searchTerm, refetchSubjects]);

  // Intersection observer for infinite scrolling
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetching) return;
    
    // Disconnect previous observer if it exists
    if (observerTarget.current) {
      observerTarget.current.disconnect();
    }
    
    // Create new observer
    observerTarget.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    // Observe new node if it exists
    if (node && observerTarget.current) {
      observerTarget.current.observe(node);
    }
  }, [isLoading, isFetching, hasMore]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Toggle subject selection
  const handleToggleSubject = (subjectId: string) => {
    console.log("Toggling subject:", subjectId);
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        console.log("Removing subject:", subjectId);
        return prev.filter(id => id !== subjectId);
      } else {
        console.log("Adding subject:", subjectId);
        return [...prev, subjectId];
      }
    });
  };

  // Submit matching
  const handleSubmit = async () => {
    console.log("Selected subjects:", selectedSubjects);
    
    if (selectedSubjects.length === 0) {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject to create a matching.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Get existing matched subjects
      const existingMatchedIds = activity.matching 
        ? Array.isArray(activity.matching)
          ? activity.matching.map(match => String(match.subject_id)).filter(Boolean)
          : [String((activity.matching as { subject_id: number }).subject_id)].filter(Boolean)
        : [];

      // Calculate added and removed subjects
      const subjectsToAdd = selectedSubjects.map(String).filter(id => !existingMatchedIds.includes(id));
      const subjectsToRemove = existingMatchedIds.filter(id => !selectedSubjects.map(String).includes(id));
      
      // Prepare the request payload
      const matchingPayload = {
        activity_id: String(activity.id),
        subject_id_add: subjectsToAdd.length > 0 ? subjectsToAdd.map(String) : undefined,
        subject_id_remove: subjectsToRemove.length > 0 ? subjectsToRemove : undefined
      };
      console.log("Preparing to send matching request with payload:", matchingPayload);
      
      // Call the mutation
      const result = await submitMatchingMutation.mutateAsync(matchingPayload);
      console.log("Matching request completed with result:", result);

      if (result) {
        // Show success toast
        toast({
          title: "Success",
          description: "Subject matching has been updated successfully.",
        });
        
        // Close dialog and refresh data
        handleCloseDialog(true);
      } else {
        throw new Error("No response received from server");
      }
    } catch (error) {
      console.error("Failed to create matching:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update matching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close properly
  const handleCloseDialog = (shouldRefresh: boolean = false) => {
    // Reset all state when closing
    setSearchTerm("");
    setPage(1);
    setFilteredSubjects([]);
    setSelectedSubjects([]);
    onOpenChange(shouldRefresh);
  };

  // Get already matched subjects from activity
  const getMatchedSubjects = () => {
    if (!activity.matching) return [];
    
    const matched = Array.isArray(activity.matching) 
      ? activity.matching 
      : [activity.matching];
      
    return matched.filter(Boolean);
  };

  const matchedSubjects = getMatchedSubjects();

  return (
    <Dialog open={open} onOpenChange={value => {
      if (!value) handleCloseDialog();
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle>Match Subjects to Activity</DialogTitle>
        </DialogHeader>

        {/* Activity Info */}
        <div className="bg-slate-50 p-3 rounded-md mb-4 text-sm">
          <h3 className="font-medium">{activity.name}</h3>
          <p className="text-muted-foreground text-xs mt-1">{activity.program_provider} • {activity.program_type}</p>
        </div>

        {/* Search and Filter */}
        <div className="relative mb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search subjects..." className="pl-10" value={searchTerm} onChange={handleSearch} />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Matching (if exists) */}
        {matchedSubjects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            className="mb-4 p-3 border border-blue-200 bg-blue-50 rounded-md"
          >
            <div className="text-sm font-medium mb-2 text-blue-700">Current Matching</div>
            <div className="flex flex-wrap gap-2">
              {matchedSubjects.map((subject) => (
                <Badge
                  key={`matched-${subject.id || subject.subject_id}`}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {subject.mata_kuliah || "Unknown Subject"} ({subject.kode || "No Code"})
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Selected Subjects */}
        {selectedSubjects.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
            <div className="text-sm font-medium mb-2">Selected Subjects ({selectedSubjects.length})</div>
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subjectId) => {
                const subject = filteredSubjects.find(s => s.id === subjectId) || 
                               (matchedSubjects.find(s => s.id === subjectId || s.subject_id === subjectId) as Subject | undefined);
                
                return (
                  subject && (
                    <Badge
                      key={`selected-${subject.id || Math.random()}`}
                      variant="secondary"
                      className="flex items-center gap-1 pl-2 pr-1 py-1"
                    >
                      <span className="truncate max-w-[150px]">{subject.mata_kuliah}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full"
                        onClick={() => handleToggleSubject(subject.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  )
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Subject List */}
        <div className="flex-1 overflow-hidden">
          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : subjectsError ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <p className="text-muted-foreground mb-4">Failed to load subjects. Please try again.</p>
              <Button variant="outline" onClick={() => refetchSubjects()}>
                Retry Loading
              </Button>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {subjects.length === 0 
                  ? "No subjects available. Please add subjects first." 
                  : "No subjects match your search."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2 pb-8">
                {filteredSubjects.map((subject, index) => (
                  <div
                    key={subject.id || `subject-${Math.random()}`}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      selectedSubjects.includes(subject.id)
                        ? "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
                        : "bg-card hover:bg-accent"
                    }`}
                    onClick={() => handleToggleSubject(subject.id)}
                    ref={index === filteredSubjects.length - 3 ? lastElementRef : null}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{subject.mata_kuliah}</span>
                          <Badge variant="outline" className="text-xs">
                            {subject.kode}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {subject.departemen} • {subject.sks} SKS • {subject.semester}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {subject.prodi_penyelenggara} • {subject.kelas}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedSubjects.includes(subject.id)
                            ? "bg-purple-500 text-white"
                            : "border border-muted-foreground"
                        }`}
                      >
                        {selectedSubjects.includes(subject.id) && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator for pagination */}
                {isFetching && page > 1 && (
                  <div className="py-4 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                
                {/* End of list marker */}
                {!hasMore && filteredSubjects.length > 0 && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No more subjects to load
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => handleCloseDialog()}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || selectedSubjects.length === 0}
            type="button"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Matching"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
