"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeBannerProps {
  onClose: () => void
}

export function WelcomeBanner({ onClose }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="relative mb-6 rounded-lg border bg-card p-6 pr-12"
    >
      <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              <path
                d="M16 13H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              <path
                d="M16 17H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              <path
                d="M10 9H9H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
            </svg>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">Selamat datang di Dashboard SIM MBKM</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau dan kelola semua ajuan mahasiswa dengan mudah. Ada 5 ajuan baru yang memerlukan persetujuan Anda.
          </p>
        </div>

        <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-auto">
          <Button>Lihat Ajuan Baru</Button>
        </div>
      </div>
    </motion.div>
  )
}
