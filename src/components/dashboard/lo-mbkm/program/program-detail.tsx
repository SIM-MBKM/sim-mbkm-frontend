"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  Calendar,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  X,
  Edit,
  Save,
  Trash2,
  Building,
  Laptop,
  FileText,
  User,
  GraduationCap,
  LinkIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/lib/api/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProgramAPI } from "./program-dashboard"
import { Activity, Matching, ActivityUpdateInput } from "@/lib/api/services/activity-service"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Document } from "@/lib/api/services/activity-service";
import { useDeleteActivity } from "@/lib/api/hooks/use-query-hooks"
import { activityService } from "@/lib/api/services"
import { useQueryClient } from "@tanstack/react-query"

// Activity type
type ProgramActivity = Activity;

interface ProgramDetailProps {
  programId: string
  onClose: () => void
}

export function ProgramDetail({ programId, onClose }: ProgramDetailProps) {
  const { activities } = useProgramAPI()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("details")
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()

  // Get the program from API data
  const program = activities?.find(activity => activity.id === programId);
  
  const [formData, setFormData] = useState<Partial<ProgramActivity>>({})
  
  // Get the delete mutation
  const deleteActivityMutation = useDeleteActivity();
  
  // Update formData when program changes
  useEffect(() => {
    if (program) {
      setFormData(program);
    }
  }, [program]);

  if (!program) {
    return null
  }

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      // Parse the date without timezone offset to prevent timezone issues
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      return format(new Date(year, month, day), "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  }

  const formatDateForAPI = (dateString: string) => {
    try {
      // Parse the date without timezone offset
      const date = new Date(dateString);
      // Get components without timezone shifts
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      // Create a new date with time at noon to avoid timezone issues
      const utcDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
      return utcDate.toISOString();
    } catch {
      return "Invalid date";
    }
  }

  // Get the YYYY-MM-DD format for input[type="date"]
  const getDateInputValue = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    // Prepare API update data
    const updateData: ActivityUpdateInput = {
      program_type_id: program.program_type_id,
      level_id: program.level_id,
      group_id: program.group_id,
      name: formData.name || program.name,
      description: formData.description || program.description,
      // For date, use the original value if not changed to prevent timezone issues
      start_period: formData.start_period !== program.start_period 
        ? formatDateForAPI(formData.start_period || program.start_period)
        : program.start_period,
      months_duration: Number(formData.months_duration) || program.months_duration,
      activity_type: formData.activity_type || program.activity_type,
      location: formData.location || program.location,
      web_portal: formData.web_portal || program.web_portal,
      academic_year: formData.academic_year || program.academic_year,
      program_provider: formData.program_provider || program.program_provider,
      approval_status: program.approval_status
    };
    
    console.log("Attempting to update activity with data:", { id: programId, activityData: updateData });
    
    try {
      setIsSaving(true);
      // Direct call to activityService instead of using hook
      await activityService.updateActivityById(programId, updateData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Changes saved",
        description: "Program details have been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Update failed",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleDelete = () => {
    deleteActivityMutation.mutate(programId, {
      onSuccess: () => {
        toast({
          title: "Program deleted",
          description: "The program has been successfully deleted.",
          variant: "destructive",
        });
        onClose();
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: "Failed to delete program. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  const handleStatusChange = async (newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    // Prepare API update data for status change
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
    
    console.log("Attempting to update status with data:", { id: programId, activityData: updateData });
    
    try {
      setIsSaving(true);
      // Direct call to activityService instead of using hook
      await activityService.updateActivityById(programId, updateData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      
      toast({
        title: "Status updated",
        description: `Program status changed to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Status update failed",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  // Check if program has matching data
  const hasMatching = program.matching && program.matching.length > 0;
  
  // Check if mutation is in progress
  const isDeleting = deleteActivityMutation.isPending;

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="font-bold text-xl"
                  />
                ) : (
                  program.name
                )}
              </h2>
              <Badge
                variant={
                  program.approval_status === "APPROVED"
                    ? "success"
                    : program.approval_status === "PENDING"
                      ? "warning"
                      : "destructive"
                }
                className="ml-2"
              >
                {program.approval_status}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {program.id.substring(0, 8)}...</p>
          </div>

          <div className="flex">
            {!isEditing ? (
              <>
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} className="mr-2">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="mr-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving}
                className="mr-2"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="matching">
              Matching
              {hasMatching && (
                <Badge variant="secondary" className="ml-1.5">
                  {(program as Activity).matching?.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_period">Start Period</Label>
                    <Input
                      id="start_period"
                      name="start_period"
                      type="date"
                      value={getDateInputValue(formData.start_period || program.start_period)}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="months_duration">Duration (months)</Label>
                    <Input
                      id="months_duration"
                      name="months_duration"
                      type="number"
                      value={formData.months_duration || 0}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="activity_type">Activity Type</Label>
                    <Select
                      value={formData.activity_type || ""}
                      onValueChange={(value) => handleSelectChange("activity_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WFO">WFO</SelectItem>
                        <SelectItem value="WFH">WFH</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                  </div>

                  <div>
                    <Label htmlFor="web_portal">Web Portal</Label>
                    <Input
                      id="web_portal"
                      name="web_portal"
                      value={formData.web_portal || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="academic_year">Academic Year</Label>
                    <Input
                      id="academic_year"
                      name="academic_year"
                      value={formData.academic_year || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="program_provider">Program Provider</Label>
                    <Input
                      id="program_provider"
                      name="program_provider"
                      value={formData.program_provider || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</h3>
                  <p className="text-slate-700 dark:text-slate-300">{program.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Start Period</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {formatDate(program.start_period)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {program.months_duration} month{program.months_duration > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {program.activity_type === "WFH" ? (
                      <Laptop className="h-4 w-4 mr-2 text-blue-500" />
                    ) : (
                      <Building className="h-4 w-4 mr-2 text-blue-500" />
                    )}
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Activity Type</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{program.activity_type}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{program.location}</p>
                    </div>
                  </div>

                  {program.web_portal && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Web Portal</p>
                        <a
                          href={program.web_portal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {program.web_portal}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Academic Year</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{program.academic_year}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Program Provider</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{program.program_provider}</p>
                    </div>
                  </div>

                  {'submitted_by' in program && program.submitted_by && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Submitted By</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{program.submitted_by}</p>
                      </div>
                    </div>
                  )}

                  {'submitted_user_role' in program && program.submitted_user_role && (
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">User Role</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{program.submitted_user_role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matching">
            {hasMatching ? (
              <div className="space-y-4">
                {(program as Activity)?.matching?.map((match: Matching, index: number) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-800 dark:text-white">{match.mata_kuliah}</h3>
                      <Badge variant="outline">{match.kode}</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Department</p>
                        <p className="text-slate-700 dark:text-slate-300">{match.departemen}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Program</p>
                        <p className="text-slate-700 dark:text-slate-300">{match.prodi_penyelenggara}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Semester</p>
                        <p className="text-slate-700 dark:text-slate-300">{match.semester}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Credits</p>
                        <p className="text-slate-700 dark:text-slate-300">{match.sks} SKS</p>
                      </div>
                    </div>

                    {match.documents && match.documents.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Documents</p>
                        <div className="space-y-1">
                          {match.documents.map((doc: Document) => (
                            <div
                              key={doc.id}
                              className="flex items-center text-sm p-1.5 rounded-md bg-slate-50 dark:bg-slate-700"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                              <span className="text-slate-700 dark:text-slate-300 truncate">{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                  <LinkIcon className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">No matching data</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  This program doesn&apos;t have any matching courses yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Change Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={program.approval_status === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("PENDING")}
                    disabled={program.approval_status === "PENDING"}
                  >
                    Mark as Pending
                  </Button>
                  <Button
                    variant={program.approval_status === "APPROVED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={program.approval_status === "APPROVED"}
                    className={program.approval_status === "APPROVED" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Approve
                  </Button>
                  <Button
                    variant={program.approval_status === "REJECTED" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("REJECTED")}
                    disabled={program.approval_status === "REJECTED"}
                    className={program.approval_status === "REJECTED" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    Reject
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Danger Zone</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete Program
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 text-white hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
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
    </motion.div>
  )
}
