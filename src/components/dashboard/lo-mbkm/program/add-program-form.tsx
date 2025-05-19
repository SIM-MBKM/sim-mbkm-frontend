"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { usePrograms } from "./program-provider"
// import { useToast } from "@/lib/api/hooks/use-toast"
import { useProgramAPI } from "./program-dashboard"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Activity } from "@/lib/api/services";

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  start_period: z.date(),
  months_duration: z.coerce.number().min(1, { message: "Duration must be at least 1 month" }),
  activity_type: z.string().min(1, { message: "Activity type is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  web_portal: z.string().url({ message: "Must be a valid URL" }).or(z.literal("")),
  academic_year: z.string().min(1, { message: "Academic year is required" }),
  program_provider: z.string().min(1, { message: "Program provider is required" }),
  program_type_id: z.string().min(1, { message: "Program type is required" }),
  level_id: z.string().min(1, { message: "Level is required" }),
  group_id: z.string().min(1, { message: "Group is required" }),
  approval_status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
})

type FormValues = z.infer<typeof formSchema>

interface AddProgramFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProgramForm({ isOpen, onOpenChange }: AddProgramFormProps) {
  const { addProgram } = usePrograms()
  // const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { programTypes, levels, groups, isLoading, createActivity, isCreating } = useProgramAPI()

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      start_period: new Date(),
      months_duration: 1,
      activity_type: "",
      location: "",
      web_portal: "",
      academic_year: "",
      program_provider: "",
      program_type_id: "",
      level_id: "",
      group_id: "",
      approval_status: "PENDING",
    },
  })

  // Define an interface that extends Activity to include UI-specific fields
  interface ActivityFormValues extends Omit<Activity, 'total_approval_data'> {
    participants: number;
    completion_rate: number;
    satisfaction_score: number;
  }

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      // Format the date to ISO string for API (ISO 8601 format)
      const formattedStartPeriod = values.start_period.toISOString();
      
      // Create the activity data for API
      const activityData = {
        program_type_id: values.program_type_id,
        level_id: values.level_id,
        group_id: values.group_id,
        name: values.name,
        description: values.description,
        start_period: formattedStartPeriod,
        months_duration: values.months_duration,
        activity_type: values.activity_type,
        location: values.location,
        academic_year: values.academic_year,
        program_provider: values.program_provider,
      };
      
      // Call API to create activity using context function
      await createActivity(activityData);

      // For UI mockup compatibility
      // Convert date to string format for UI display
      const formattedValues: ActivityFormValues = {
        id: "",
        program_type_id: values.program_type_id,
        level_id: values.level_id,
        group_id: values.group_id,
        name: values.name,
        description: values.description,
        start_period: format(values.start_period, "yyyy-MM-dd"),
        months_duration: values.months_duration,
        activity_type: values.activity_type,
        location: values.location,
        web_portal: values.web_portal || "",
        academic_year: values.academic_year,
        program_provider: values.program_provider,
        approval_status: values.approval_status,
        submitted_by: "",
        program_type: programTypes?.find(pt => pt.id === values.program_type_id)?.name || "",
        level: levels?.find(l => l.id === values.level_id)?.name || "",
        group: groups?.find(g => g.id === values.group_id)?.name || "Default Group",
        submitted_user_role: null,
        matching: null,
        // Add random values for stats (for UI display only)
        participants: Math.floor(Math.random() * 100) + 10,
        completion_rate: Math.floor(Math.random() * 100),
        satisfaction_score: (Math.floor(Math.random() * 50) + 50) / 10
      }

      // Add program to context (for UI display purposes)
      addProgram(formattedValues)

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating program:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogDescription>Fill in the details to create a new program.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Program Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Program Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter program name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter program description" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Period */}
              <FormField
                control={form.control}
                name="start_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full pl-3 text-left font-normal">
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="months_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (months) *</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activity Type */}
              <FormField
                control={form.control}
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="WFO">Work From Office</SelectItem>
                        <SelectItem value="WFH">Work From Home</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Exchange">Exchange</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Web Portal */}
              <FormField
                control={form.control}
                name="web_portal"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Web Portal</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>Optional website URL for the program</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Academic Year */}
              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="2022/2023">2022/2023</SelectItem>
                        <SelectItem value="2023/2024">2023/2024</SelectItem>
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2025/2026">2025/2026</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Program Provider */}
              <FormField
                control={form.control}
                name="program_provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Provider *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter provider name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Program Type */}
              <FormField
                control={form.control}
                name="program_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select program type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <SelectItem value="" disabled>Loading...</SelectItem>
                        ) : programTypes && programTypes.length > 0 ? (
                          programTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No program types available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Level */}
              <FormField
                control={form.control}
                name="level_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <SelectItem value="" disabled>Loading...</SelectItem>
                        ) : levels && levels.length > 0 ? (
                          levels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No levels available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group */}
              <FormField
                control={form.control}
                name="group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <SelectItem value="" disabled>Loading...</SelectItem>
                        ) : groups && groups.length > 0 ? (
                          groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No groups available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Approval Status */}
              <FormField
                control={form.control}
                name="approval_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isCreating} className="bg-blue-500 text-white">
                {(isSubmitting || isCreating) && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
                Create Program
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
