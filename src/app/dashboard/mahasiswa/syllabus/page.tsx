import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SyllabusPage } from "@/components/dashboard/programs/syllabus/syllabus-page";

export default function TranscriptRoute() {
  return (
    <DashboardLayout>
      <SyllabusPage />
    </DashboardLayout>
  )
}
