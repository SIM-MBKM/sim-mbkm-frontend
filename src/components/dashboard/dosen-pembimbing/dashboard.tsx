"use client"

import { useState, useEffect } from "react"
import { motion} from "framer-motion"
import { StatCard } from "./stat-card"
import { ActivityFeed } from "./activity-feed"
import { ReviewSection } from "./review-section"
// import { QuickActions } from "./quick-actions"
import { Bell, Users, CheckCircle, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useGetStatisticDashboardDosenPembimbing } from "@/lib/api/hooks/use-query-hooks"

export function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showWelcome, setShowWelcome] = useState(true)

  // Get dashboard statistics
  const { data: statsData, isLoading: statsLoading } = useGetStatisticDashboardDosenPembimbing()

  // Fix hydration issues with theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide welcome banner after 5 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome])

  if (!mounted) {
    return null
  }

  const stats = [
    {
      title: "Ajuan Mahasiswa",
      value: statsLoading ? "..." : statsData?.data?.total?.toString() || "0",
      subtitle: "Jumlah Ajuan",
      icon: <Users className="h-5 w-5" />,
      color: "from-blue-600 to-blue-800",
      increase: statsLoading 
        ? "Loading..." 
        : `${(statsData?.data?.total_percentage_from_last_month || 0) > 0 ? "+" : ""}${statsData?.data?.total_percentage_from_last_month || 0}% dari bulan lalu`,
    },
    {
      title: "Ajuan Disetujui",
      value: statsLoading ? "..." : statsData?.data?.total_approved?.toString() || "0",
      subtitle: "Jumlah Ajuan",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "from-green-600 to-green-800",
      increase: statsLoading 
        ? "Loading..." 
        : `${(statsData?.data?.total_approved_percentage_from_last_month || 0) > 0 ? "+" : ""}${statsData?.data?.total_approved_percentage_from_last_month || 0}% dari bulan lalu`,
    },
    {
      title: "Jadwal Mendatang",
      value: "8",
      subtitle: "Kegiatan",
      icon: <Calendar className="h-5 w-5" />,
      color: "from-purple-600 to-purple-800",
      increase: "2 kegiatan minggu ini",
    },
    {
      title: "Notifikasi",
      value: statsLoading ? "..." : statsData?.data?.total_notification?.toString() || "0",
      subtitle: "Belum dibaca",
      icon: <Bell className="h-5 w-5" />,
      color: "from-amber-600 to-amber-800",
      increase: statsLoading 
        ? "Loading..." 
        : `${(statsData?.data?.notification_percentage_from_last_month || 0) > 0 ? "+" : ""}${statsData?.data?.notification_percentage_from_last_month || 0}% dari bulan lalu`,
    },
  ]

  const activities = [
    {
      id: "1",
      date: "12 September 2024",
      title: "Mitra MBKM Magang PT Astra Indonesia telah ditambahkan",
      description: "Cek disini segera.",
      link: "#",
      icon: "company" as const,
    },
    {
      id: "2",
      date: "1 Oktober 2024",
      title: "Persyaratan umum mengenai Magang dan Studi Independen telah berubah",
      description: "Perubahan berlaku mulai semester depan.",
      icon: "info" as const,
    },
    {
      id: "3",
      date: "10 Juni 2024",
      title: "Batas persetujuan mahasiswa berakhir pada tanggal 10 Februari 2025",
      description: "Pastikan semua ajuan telah diproses sebelum tenggat waktu.",
      icon: "calendar" as const,
    },
  ]

  const reviewItems = [
    {
      id: "1",
      title: "Ajuan Baru",
      description: "Ada ajuan mahasiswa baru yang perlu ditinjau",
      count: 5,
      icon: "document" as const,
      action: "Tinjau Sekarang",
      link: "/dashboard/dosen-pembimbing/ajuan-mahasiswa"
    },
    {
      id: "2",
      title: "Revisi Dokumen",
      description: "Beberapa dokumen memerlukan revisi",
      count: 3,
      icon: "edit" as const,
      action: "Lihat Dokumen",
      link: "/dashboard/dosen-pembimbing/monitoring/validation"
    },
  ]

  return (
    <>
      {/* <AnimatePresence>{showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}</AnimatePresence> */}
      <div className="mb-6 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">Selamat Datang, Admin</h1>
            <p className="text-muted-foreground">Kelola dan pantau semua ajuan mahasiswa</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari ajuan..."
              className="pl-9 w-full sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              colorClass={stat.color}
              increase={stat.increase}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ActivityFeed activities={activities} />
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ReviewSection items={reviewItems} />
        </motion.div>
          {/* <QuickActions /> */}
      </div>
    </>
  )
}
