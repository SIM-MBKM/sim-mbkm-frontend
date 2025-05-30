"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/lib/api/hooks"
import { UserRole } from "@/lib/redux/roleSlice"

export default function DashboardRedirect() {
  const router = useRouter()
  const { data: roleData, isLoading, error } = useUserRole()
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    if (isLoading) return

    if (error) {
      setIsRedirecting(false)
      return
    }

    if (roleData && roleData.data) {
      const role = roleData.data.role as UserRole
      const roleRoutes: Record<UserRole, string> = {
        MAHASISWA: '/dashboard/mahasiswa',
        "DOSEN PEMBIMBING": '/dashboard/dosen-pembimbing',
        ADMIN: '/dashboard/admin',
        "LO-MBKM": '/dashboard/lo-mbkm',
        "DOSEN PEMONEV": '/dashboad/dosen-pemonev',
        MITRA: '/dashboard/mitra'
      }
      
      router.replace(roleRoutes[role])
    } else {
      setIsRedirecting(false)
    }
  }, [roleData, isLoading, error, router])

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003478] mb-4"></div>
        <p className="text-gray-600">Mengalihkan ke dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-md text-center">
          <h2 className="text-lg font-medium text-red-800 mb-2">Gagal memuat data</h2>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Terjadi kesalahan saat memuat data pengguna"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 max-w-md text-center">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Peran Tidak Ditemukan</h2>
        <p className="text-yellow-600 mb-4">
          Tidak dapat menemukan peran pengguna. Silakan hubungi administrator.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
} 