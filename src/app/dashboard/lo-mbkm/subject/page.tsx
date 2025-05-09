"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SubjectsDashboard } from "@/components/dashboard/lo-mbkm/subject/subject-dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MahasiswaDashboard() {
  return (
    // <ProtectedDashboardLayout allowedRole="DOSEN PEMBIMBING">
    <DashboardLayout>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />  
      <SubjectsDashboard />
    </DashboardLayout>
    // </ProtectedDashboardLayout>
  )
}

