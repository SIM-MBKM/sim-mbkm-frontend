'use client';

import { Calendar, FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStudentRegistrations } from '@/lib/api/hooks';
import { useReportSchedulesByStudent } from '@/lib/api/hooks';

export function StatusCards() {
  const { data: studentRegistrations, 
    isLoading: studentRegistrationLoading, 
    error: studentRegistrationError } = useStudentRegistrations(1, 5);

  const { data: reportSchedules, 
    isLoading: reportSchedulesLoading, 
    error: reportSchedulesError } = useReportSchedulesByStudent();

  
  if (studentRegistrationLoading && reportSchedulesLoading) {
    return <div>Loading...</div>;
  }

  if (studentRegistrationError) {
    return <div>Error loading registrations: {studentRegistrationError.message}</div>;
  }

  if (reportSchedulesError) {
    return <div>Error loading registrations: {reportSchedulesError.message}</div>;
  }

  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <User className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Verifikasi Registrasi</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Status Verifikasi</p>
          {
            studentRegistrations && studentRegistrations.data && studentRegistrations.data.length > 0 ? (
              studentRegistrations.data[0].approval_status === true ? (
                <p className="text-xl font-bold">Telah Terverifikasi</p>
              ) : (
                <p className="text-xl font-bold">Belum Terverifikasi</p>
              )
            ) : (
              <p className="text-xl font-bold">Belum Terverifikasi</p>
            )
          }
          
        </CardContent>
      </Card>

      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <FileText className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Final Report</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Status Verifikasi</p>
          {
            reportSchedules && reportSchedules.data ? (
              (() => {
                // Find the first FINAL_REPORT in any activity
                const finalReport = Object.values(reportSchedules.data.reports)
                  .flat()
                  .find(schedule => schedule.report_type === "FINAL_REPORT");
                
                if (!finalReport) {
                  return <p className="text-xl font-bold">Belum Diisi</p>;
                }
                
                if (!finalReport.report) {
                  return <p className="text-xl font-bold">Belum Diisi</p>;
                }
                
                if (finalReport.report.academic_advisor_status === "PENDING") {
                  return <p className="text-xl font-bold">Belum Terverifikasi</p>;
                } else if (finalReport.report.academic_advisor_status === "REJECT") {
                  return <p className="text-xl font-bold">Ditolak</p>;
                } else if (finalReport.report.academic_advisor_status === "APPROVED") {
                  return <p className="text-xl font-bold">Telah Terverifikasi</p>;
                } else {
                  return <p className="text-xl font-bold">Status Tidak Diketahui</p>;
                }
              })()
            ) : (
              <p className="text-xl font-bold">Belum Diisi</p>
            )
          }
        </CardContent>
      </Card>

      <Card className="bg-[#003478] text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="bg-white rounded-full p-3">
            <Calendar className="h-6 w-6 text-yellow-500" />
          </div>
          <h3 className="text-yellow-500 font-bold">Status Monev</h3>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">Monev ke -2</p>
          <p className="text-xl font-bold">Jadwal Terverifikasi</p>
        </CardContent>
      </Card>
    </div>
  )
}
