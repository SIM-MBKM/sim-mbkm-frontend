"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  FileText,
  Home,
  Search,
  User,
  Upload,
  X,
  Settings,
  Users,
  BarChart,
  CheckSquare,
  FileCheck,
  Database,
  Briefcase,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDashboard } from "./dashboard-provider"
import { useRoleManager } from "@/lib/hooks/use-role-manager"
import Link from "next/link"
import { UserRole } from "@/lib/redux/roleSlice"
import { usePathname } from "next/navigation"

// Define menu items for different roles
const MENU_ITEMS: Record<UserRole, {
  section: string;
  items: Array<{
    label: string;
    icon: React.ReactNode;
    href: string;
    badge?: number;
    children?: Array<{ label: string; icon?: React.ReactNode; href: string }>;
  }>;
}[]> = {
  MAHASISWA: [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/mahasiswa" }],
    },
    {
      section: "Pendaftaran",
      items: [
        { label: "Telusuri Program", icon: <Search className="h-5 w-5" />, href: "/dashboard/mahasiswa/programs" },
        { label: "Ajukan Program", icon: <Upload className="h-5 w-5" />, href: "/dashboard/mahasiswa/telusuri-program" },
        { label: "Program Saya", icon: <User className="h-5 w-5" />, href: "/dashboard/mahasiswa/programs/me" },
      ],
    },
    {
      section: "Dokumentasi dan Monitoring",
      items: [
        {
          label: "Monitoring Status",
          icon: <ClipboardList className="h-5 w-5" />,
          href: "/dashboard/mahasiswa/monitoring",
          children: [
            { label: "Status Dokumen", href: "/dashboard/mahasiswa/monitoring/documents" },
            { label: "Status Validasi", href: "/dashboard/mahasiswa/monitoring/validation" },
          ]
        },
        { label: "Input Logbook", icon: <FileText className="h-5 w-5" />, href: "/dashboard/mahasiswa/logbook" },
        { label: "Input Transkrip", icon: <FileText className="h-5 w-5" />, href: "/dashboard/mahasiswa/transcript" },
        { label: "Input Silabus", icon: <FileText className="h-5 w-5" />, href: "/dashboard/mahasiswa/syllabus" },
      ],
    },
    {
      section: "MBKM",
      items: [
        { label: "MBKM", icon: <BookOpen className="h-5 w-5" />, href: "/dashboard/mahasiswa/mbkm" },
        { label: "Ekivalensi MK", icon: <FileText className="h-5 w-5" />, href: "/dashboard/mahasiswa/equivalence" },
        { label: "Jadwal", icon: <Calendar className="h-5 w-5" />, href: "/dashboard/mahasiswa/schedule" },
      ],
    },
    {
      section: "Pengaturan",
      items: [
        { label: "Pengaturan Akun", icon: <Settings className="h-5 w-5" />, href: "/dashboard/mahasiswa/settings" },
      ],
    },
  ],
  
  "DOSEN PEMBIMBING": [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/dosen-pembimbing" }],
    },
    {
      section: "Pendaftaran",
      items: [
        { label: "Telusuri Program", icon: <Search className="h-5 w-5" />, href: "/dashboard/dosen-pembimbing/telusuri-program" },
        { 
          label: "Ajuan Mahasiswa", 
          icon: <CheckSquare className="h-5 w-5" />, 
          href: "/dashboard/dosen-pembimbing/ajuan-mahasiswa",
        },
      ],
    },
    {
      section: "Dokumentasi dan Monitoring",
      items: [
        { 
          label: "Monitoring Mahasiswa", 
          icon: <ClipboardList className="h-5 w-5" />, 
          href: "/dashboard/dosen-pembimbing/monitoring",
          children: [
            { label: "Transkrip Mahasiswa", href: "/dashboard/dosen-pembimbing/monitoring/transcript" },
            { label: "Silabus Mahasiswa", href: "/dashboard/dosen-pembimbing/monitoring/silabus" },
            { label: "Validasi Dokumen", href: "/dashboard/dosen-pembimbing/monitoring/validation" },
          ]
        },
      ],
    },
    {
      section: "MBKM",
      items: [
        { label: "Jadwal", icon: <Calendar className="h-5 w-5" />, href: "/dashboard/dosen-pembimbing/schedule" },
      ],
    },
    {
      section: "Pengaturan",
      items: [
        { label: "Pengaturan Akun", icon: <Settings className="h-5 w-5" />, href: "/dashboard/dosen-pembimbing/settings" },
      ],
    },
  ],
  
  ADMIN: [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/admin" }],
    },
    {
      section: "Manajemen",
      items: [
        { label: "Pengguna", icon: <Users className="h-5 w-5" />, href: "/dashboard/admin/users" },
        { label: "Program", icon: <Briefcase className="h-5 w-5" />, href: "/dashboard/admin/programs" },
        { label: "Validasi Program", icon: <FileCheck className="h-5 w-5" />, href: "/dashboard/admin/validation" },
      ],
    },
    {
      section: "Sistem",
      items: [
        { label: "Pengaturan", icon: <Settings className="h-5 w-5" />, href: "/dashboard/admin/settings" },
        { label: "Data Master", icon: <Database className="h-5 w-5" />, href: "/dashboard/admin/master-data" },
      ],
    },
  ],
  
  SUPERADMIN: [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/superadmin" }],
    },
    {
      section: "Manajemen",
      items: [
        { label: "Pengguna", icon: <Users className="h-5 w-5" />, href: "/dashboard/superadmin/users" },
        { label: "Program", icon: <Briefcase className="h-5 w-5" />, href: "/dashboard/superadmin/programs" },
        { label: "Validasi Program", icon: <FileCheck className="h-5 w-5" />, href: "/dashboard/superadmin/validation" },
      ],
    },
    {
      section: "Sistem",
      items: [
        { label: "Pengaturan", icon: <Settings className="h-5 w-5" />, href: "/dashboard/superadmin/settings" },
        { label: "Data Master", icon: <Database className="h-5 w-5" />, href: "/dashboard/superadmin/master-data" },
      ],
    },
  ],
  
  PIMPINAN: [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/pimpinan" }],
    },
    {
      section: "Monitoring",
      items: [
        { label: "Program MBKM", icon: <Briefcase className="h-5 w-5" />, href: "/dashboard/pimpinan/programs" },
        { label: "Mahasiswa", icon: <Users className="h-5 w-5" />, href: "/dashboard/pimpinan/students" },
      ],
    },
    {
      section: "Laporan",
      items: [
        { label: "Statistik", icon: <BarChart className="h-5 w-5" />, href: "/dashboard/pimpinan/statistics" },
        { label: "Laporan", icon: <FileText className="h-5 w-5" />, href: "/dashboard/pimpinan/reports" },
      ],
    },
  ],
  
  TENDIK: [
    {
      section: "Beranda",
      items: [{ label: "Beranda", icon: <Home className="h-5 w-5" />, href: "/dashboard/tendik" }],
    },
    {
      section: "Pendaftaran",
      items: [
        { label: "Program MBKM", icon: <Briefcase className="h-5 w-5" />, href: "/dashboard/tendik/programs" },
        { label: "Daftar Mahasiswa", icon: <Users className="h-5 w-5" />, href: "/dashboard/tendik/students" },
      ],
    },
    {
      section: "Administrasi",
      items: [
        { label: "Validasi Dokumen", icon: <FileCheck className="h-5 w-5" />, href: "/dashboard/tendik/documents" },
        { label: "Data Akademik", icon: <Building className="h-5 w-5" />, href: "/dashboard/tendik/academic" },
      ],
    },
  ],
};

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  href?: string
  badge?: number
  nestedItems?: { icon?: React.ReactNode; label: string; href: string }[]
  onClose?: () => void
}

function SidebarItem({ icon, label, active, href = "#", badge, nestedItems, onClose }: SidebarItemProps) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = nestedItems && nestedItems.length > 0

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-[#003478]/10 text-[#003478] font-medium"
            : "text-gray-700 hover:bg-gray-100 hover:text-[#003478]",
        )}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {hasChildren ? (
          <div 
            className="flex flex-1 items-center gap-3 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#003478] text-[10px] font-medium text-white">
                {badge}
              </span>
            )}
            <span className="flex h-4 w-4 items-center justify-center">
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          </div>
        ) : (
          <Link 
            href={href} 
            className="flex flex-1 items-center gap-3"
            onClick={onClose}
          >
            <span className="flex h-6 w-6 items-center justify-center">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#003478] text-[10px] font-medium text-white">
                {badge}
              </span>
            )}
          </Link>
        )}
      </motion.div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-6 mt-1 border-l pl-3 pt-1">
                {nestedItems.map((child, index) => (
                  <motion.div
                    key={child.label}
                    className="w-full"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={child.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#003478]"
                      onClick={onClose}
                    >
                      {child.icon && <span className="flex h-5 w-5 items-center justify-center">{child.icon}</span>}
                      <span>{child.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, isMobile } = useDashboard()
  const { role, loading } = useRoleManager()
  const pathname = usePathname()

  // Default menu items if role is not loaded yet
  const menuItems = role && MENU_ITEMS[role as UserRole] 
    ? MENU_ITEMS[role as UserRole] 
    : MENU_ITEMS.MAHASISWA // Fallback to MAHASISWA if role not loaded

  const isActiveLink = (href: string) => {
    // return pathname === href || pathname.startsWith(`${href}/`)
    return pathname === href
  }

  return (
    <div className={cn(
      "bg-white",
      !isMobile && "mr-10"
    )}>
      {/* Sidebar - Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
            animate={isMobile ? { x: 0 } : { width: 256, opacity: 1 }}
            exit={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 40 }}
            className={cn(
              "fixed top-16 left-0 bottom-0 z-30 bg-white",
              isMobile ? "w-full md:w-80" : "w-64"
            )}
          >
            <div className="flex justify-between items-center p-4">
              <h2 className="text-[#003478] font-bold">Menu</h2>
              {isMobile && (
                <Button variant="default" size="icon" onClick={toggleSidebar} className="hover:bg-gray-100 border-none">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#003478]"></div>
                </div>
              ) : (
                <>
                  {menuItems.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-xs font-medium text-gray-500 mb-3 px-3 uppercase">{section.section}</h3>
                      <div className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                          <SidebarItem
                            key={itemIndex}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            badge={item.badge}
                            nestedItems={item.children}
                            active={isActiveLink(item.href)}
                            onClose={isMobile ? toggleSidebar : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Help Box */}
                  <div className="mt-auto pt-4">
                    <div className="rounded-md bg-[#003478]/10 p-4">
                      <h3 className="font-medium text-[#003478] mb-1">Butuh bantuan?</h3>
                      <p className="text-xs text-gray-500 mb-3">Hubungi tim support kami untuk bantuan</p>
                      <a href="#" className="text-xs font-medium text-[#003478] hover:underline">
                        Kontak Support →
                      </a>
                    </div>
                  </div>
                </>
              )}

              {/* Add extra space at the bottom for better scrolling experience */}
              <div className="h-8"></div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle Button for Desktop */}
      {!isMobile && (
        <motion.div
          initial={{ x: sidebarOpen ? 256 : 0 }}
          animate={{ x: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-0 z-40"
        >
          <Button 
            variant="default" 
            size="icon" 
            onClick={toggleSidebar} 
            className=" hover:bg-gray-100 bg-gray-200  shadow-xl"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
