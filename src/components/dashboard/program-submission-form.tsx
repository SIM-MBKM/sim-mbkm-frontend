"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useAllProgramTypes } from "@/lib/api/hooks";

interface ProgramSubmissionFormProps {
  onClose: () => void
}

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nama program harus minimal 3 karakter" }),
  description: z.string().min(10, { message: "Deskripsi harus minimal 10 karakter" }),
  start_period: z.date({ required_error: "Tanggal mulai wajib diisi" }),
  months_duration: z.coerce.number().min(1).max(12),
  activity_type: z.string(),
  location: z.string().min(3, { message: "Lokasi harus minimal 3 karakter" }),
  web_portal: z.string().url({ message: "URL tidak valid" }).optional().or(z.literal("")),
  program_type_id: z.string(),
  group_id: z.string(),
  level_id: z.string(),
  academic_year: z.string(),
  program_provider: z.string().min(2, { message: "Penyedia program wajib diisi" }),
})

export function ProgramSubmissionForm({ onClose }: ProgramSubmissionFormProps) {
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      months_duration: 1,
      activity_type: "WFO",
      location: "",
      web_portal: "",
      program_type_id: "cc27f02c-058b-4c44-85f5-053a0418406f",
      group_id: "aea7e24d-892f-4a2c-a6c9-d875d31f53d0",
      level_id: "f9618b56-3892-4288-85e4-38b60574ff93",
      academic_year: "2024/2025",
      program_provider: "",
    },
  })

  const {
    data: programTypes,
    isLoading: programTypesLoading,
    error: programTypesError
  } = useAllProgramTypes(1, 10);

  console.log('Token available:', !!localStorage.getItem('auth_token'));

  if (programTypesLoading) {
    return <div>Loading...</div>;
  }
  
  if (programTypesError) {
    return <div>Error loading program type: { programTypesError.message }</div>
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values)
    // Here you would typically send the data to your API
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Ajukan Program Baru</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Program</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama program" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Program</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Deskripsi lengkap program" className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormDescription>Jelaskan detail program, persyaratan, dan manfaat yang akan didapat</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="start_period"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white z-100" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date > new Date(2030, 0, 1)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="months_duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durasi (Bulan)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="activity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Aktivitas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe aktivitas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-100">
                        <SelectItem value="WFO">Work From Office (WFO)</SelectItem>
                        <SelectItem value="WFH">Work From Home (WFH)</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Kota/Kabupaten" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="web_portal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Web Portal (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>Situs web resmi program atau portal pendaftaran</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
              <FormField
                control={form.control}
                name="program_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-100">
                        {
                          programTypes && programTypes.data && programTypes.data.length > 0 ? (
                            programTypes.data.map((programType) => (
                              <SelectItem key={programType.id} value={programType.id}>
                                {programType.name}
                              </SelectItem>
                            ))
                          ) : null
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelompok Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelompok" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-100">
                        <SelectItem value="aea7e24d-892f-4a2c-a6c9-d875d31f53d0">MSIB</SelectItem>
                        <SelectItem value="other-group-1">IISMA</SelectItem>
                        <SelectItem value="other-group-2">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="level_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level Program</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-100">
                        <SelectItem value="f9618b56-3892-4288-85e4-38b60574ff93">Nasional</SelectItem>
                        <SelectItem value="other-level-1">Internasional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun Akademik</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tahun akademik" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white z-100">
                        <SelectItem value="2024/2025">2024/2025</SelectItem>
                        <SelectItem value="2023/2024">2023/2024</SelectItem>
                        <SelectItem value="2022/2023">2022/2023</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="program_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penyedia Program</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama perusahaan/institusi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" className="bg-[#003478] text-white hover:bg-[#00275a]">
                Ajukan Program
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
