"use client"

import { InternshipSearch } from "@/components/dashboard/programs/internship-search";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Home() {
  return (
    <DashboardLayout>
      <InternshipSearch />
    </DashboardLayout>
    );
}
