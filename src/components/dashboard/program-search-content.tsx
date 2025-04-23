"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SearchBar } from "./search-bar";
import { ProgramSubmission } from "./program-submission";
import { ProgramCard } from "./program-card";
// import { ReactQueryProvider } from "@/lib/api/providers/query-provider";
import { Suspense } from "react";

const programs = [
  "Studi Independen",
  "Magang",
  "IISMA",
  "Kewirausahaan",
  "Penelitian",
  "Proyek Kemanusiaan",
  "Kampus Mengajar",
  "Pembangunan Desa",
];

export function ProgramSearchContent() {
  return (
    <DashboardLayout>
      <SearchBar />
      {/* <ReactQueryProvider> */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProgramSubmission />
      </Suspense>
      {/* </ReactQueryProvider> */}

      <div className="w-auto h-100 overflow-y-scroll">
        {programs.map((program, index) => {
          return (
            <ProgramCard
              key={index}
              imageUrl="/logo.png?height=200&width=1200"
              logoUrl={`/logo.png?height=60&width=120&text=${program}`}
              logoAlt={`${program} Logo`}
              position="left"
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
}
