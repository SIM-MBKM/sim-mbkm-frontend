"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, MapPin, Clock, ChevronRight, Laptop, Building, Loader2 } from "lucide-react"
import { type Program, usePrograms } from "./program-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/lib/api/hooks/use-toast"
import { Activity, ActivityUpdateInput } from "@/lib/api/services/activity-service"
import { activityService } from "@/lib/api/services"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteActivity } from "@/lib/api/hooks/use-query-hooks"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Define a union type to handle both Program and Activity
type ProgramOrActivity = Program | Activity;

interface ProgramCardProps {
  program: ProgramOrActivity
  isSelected: boolean
  onSelect: () => void
}

export function ProgramCard({ program, isSelected, onSelect }: ProgramCardProps) {
  const { updateProgram } = usePrograms()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  // Initialize delete mutation hook
  const deleteActivityMutation = useDeleteActivity();

  // Check if the program is a local Program type (has participants property)
  const isLocalProgram = (prog: ProgramOrActivity): prog is Program => {
    return 'participants' in prog;
  }

  const handleStatusChange = async (newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    // Only allow status change for local programs
    if (isLocalProgram(program)) {
      updateProgram(program.id, { approval_status: newStatus })
      toast({
        title: "Status updated",
        description: `Program status changed to ${newStatus.toLowerCase()}.`,
        variant: "default",
      })
    } else {
      // For API programs, use activityService.updateActivityById
      try {
        setIsUpdating(true);
        
        // Prepare update data
        const updateData: ActivityUpdateInput = {
          program_type_id: program.program_type_id,
          level_id: program.level_id,
          group_id: program.group_id,
          name: program.name,
          description: program.description,
          // Keep the original date to prevent timezone issues
          start_period: program.start_period,
          months_duration: program.months_duration,
          activity_type: program.activity_type,
          location: program.location,
          web_portal: program.web_portal,
          academic_year: program.academic_year,
          program_provider: program.program_provider,
          approval_status: newStatus
        };
        
        console.log("Updating program status:", { id: program.id, newStatus, updateData });
        
        // Call the API directly
        await activityService.updateActivityById(program.id, updateData);
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['activities'] });
        
        toast({
          title: "Status updated",
          description: `Program status changed to ${newStatus.toLowerCase()}.`,
          variant: "default",
        });
      } catch (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Update failed",
          description: "Failed to update program status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  }

  const handleDelete = () => {
    // Only allow deletion for local programs
    if (isLocalProgram(program)) {
      // Use the local delete function for local programs if needed,
      // although typically API programs are the ones being managed.
      // If there's no local program management needed, this branch can be removed.
      // For now, assuming we only delete API activities via the API.
      console.warn("Local program deletion attempted, but not fully implemented via context.");
      toast({
        title: "Local Delete",
        description: "Local program deletion is not fully implemented in this component.",
        variant: "default",
      });
    } else {
      // Use the API mutation for API programs
      deleteActivityMutation.mutate(program.id, {
        onSuccess: () => {
          toast({
            title: "Program deleted",
            description: "The program has been successfully deleted.",
            variant: "destructive",
          });
          setShowDeleteDialog(false); // Close dialog on success
          // Invalidate activities query to remove the deleted program from the list
          queryClient.invalidateQueries({ queryKey: ['activities'] });
        },
        onError: (error) => {
          console.error("Delete error:", error);
          toast({
            title: "Delete failed",
            description: error instanceof Error ? error.message : "Failed to delete program. Please try again.",
            variant: "destructive",
          });
          setShowDeleteDialog(false); // Close dialog even on error
        },
      });
    }
  }

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      // Parse the date without timezone offset to prevent timezone issues
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return format(new Date(year, month, day), "MMM d, yyyy");
    } catch {
      return "Invalid date"
    }
  }

  return (
    <>
      <motion.div
        className={`p-4 rounded-xl border transition-all duration-200 ${
          isSelected
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
        }`}
        whileHover={{ scale: isSelected ? 1 : 1.01 }}
        onClick={onSelect}
      >
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 line-clamp-1">{program.name}</h3>
              <Badge
                variant={
                  program.approval_status === "APPROVED"
                    ? "success"
                    : program.approval_status === "PENDING"
                      ? "warning"
                      : "destructive"
                }
                className="ml-2 animate-fade-in"
              >
                {program.approval_status}
              </Badge>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">{program.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                <span>{formatDate(program.start_period)}</span>
              </div>

              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                <span>
                  {program.months_duration} month{program.months_duration > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                <span className="truncate">{program.location}</span>
              </div>

              <div className="flex items-center">
                {program.activity_type === "WFH" ? (
                  <Laptop className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                ) : (
                  <Building className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                )}
                <span>{program.activity_type}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-4 sm:mt-0 sm:ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2" 
                  onClick={(e) => e.stopPropagation()}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Updating...
                    </>
                  ) : (
                    "Actions"
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {program.approval_status !== "APPROVED" && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={isUpdating}
                  >
                    Approve
                  </DropdownMenuItem>
                )}
                {program.approval_status !== "PENDING" && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("PENDING")}
                    disabled={isUpdating}
                  >
                    Mark as Pending
                  </DropdownMenuItem>
                )}
                {program.approval_status !== "REJECTED" && (
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange("REJECTED")}
                    disabled={isUpdating}
                  >
                    Reject
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 bg-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteDialog(true)
                  }}
                  disabled={isUpdating}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-blue-500" onClick={onSelect}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the program &quot;{program.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {deleteActivityMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
