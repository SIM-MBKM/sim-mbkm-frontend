"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { InternshipRegistration } from "@/components/dashboard/programs/registration/internship-registration";


export default function Home() {
  
  return (
    <DashboardLayout>
      <InternshipRegistration />
    </DashboardLayout>
  );
};
