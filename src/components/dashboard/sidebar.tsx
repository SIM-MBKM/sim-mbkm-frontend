"use client"

import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  Search,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDashboard } from "./dashboard-provider"

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, isMobile } = useDashboard()

  return (
    <div className={cn(
      "bg-white",
      !isMobile && "mr-10"
    )}>
      {/* Sidebar - Mobile Overlay */}
      {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white z-30 h-[calc(100vh-64px)]",
          isMobile
            ? "fixed top-16 left-0 w-full transform transition-transform duration-200 ease-in-out shadow-lg"
            : "fixed top-16 left-0 w-64 transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-[#003478] font-bold">Menu</h2>
          {isMobile && (
            <Button variant="default" size="icon"  onClick={toggleSidebar} className="hover:bg-gray-100 border-none">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <div className="mb-6">
            <h2 className="text-[#003478] font-bold mb-4">Beranda</h2>
            <a href="#" className="flex items-center space-x-2 text-[#003478] mb-2">
              <Home className="h-5 w-5" />
              <span>Beranda</span>
            </a>
          </div>

          <div className="mb-6">
            <h2 className="text-[#003478] font-bold mb-4">Pendaftaran</h2>
            <a href="/dashboard/mahasiswa/telusuri-program" className="flex items-center space-x-2 text-gray-700 mb-2">
              <Search className="h-5 w-5" />
              <span className="">Telusuri Program</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <User className="h-5 w-5" />
              <span>Program Saya</span>
            </a>
          </div>

          <div className="mb-6">
            <h2 className="text-[#003478] font-bold mb-4">Dokumentasi dan Monitoring</h2>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <ClipboardList className="h-5 w-5" />
              <span>Monitoring Status</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Input Logbook</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Input Transkrip</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Input Silabus</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Input Laporan Akhir</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Input File Tambahan</span>
            </a>
          </div>

          <div className="mb-6">
            <h2 className="text-[#003478] font-bold mb-4">MBKM</h2>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <BookOpen className="h-5 w-5" />
              <span>MBKM</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <FileText className="h-5 w-5" />
              <span>Ekivalensi MK</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-700 mb-2">
              <Calendar className="h-5 w-5" />
              <span>Jadwal</span>
            </a>
          </div>

          {/* Add extra space at the bottom for better scrolling experience */}
          <div className="h-8"></div>
        </div>
      </aside>

      {/* Toggle Button for Desktop */}
      {!isMobile && (
        <div
          className="fixed top-20 left-64 z-40 transform transition-all duration-200"
          style={{ left: sidebarOpen ? "16rem" : "0" }}
        >
          <Button variant="default" size="icon" onClick={toggleSidebar} className="hover:bg-gray-100 border-none">
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
      )}
    </div>
  )
}
