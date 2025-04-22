"use client"

import Image from "next/image"
import { ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useDashboard } from "./dashboard-provider"

export function Header() {
  const { toggleSidebar } = useDashboard()

  return (
    <header className="bg-[#003478] dark:bg-[#003478] text-white p-4 flex items-center justify-between z-50 fixed w-full">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-blue-800 lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <Image
          src="/logo.png?height=50&width=120"
          alt="ITS Logo"
          width={120}
          height={50}
          className="h-10 w-auto"
        />
      </div>
      <div className="flex items-center space-x-12">
        <nav className="hidden md:flex space-x-12">
          <a href="#" className="font-medium">
            Beranda
          </a>
          <a href="#" className="font-medium">
            Program
          </a>
          <a href="#" className="font-medium">
            Bantuan
          </a>
          <div className="flex items-center space-x-1">
            <a href="#" className="font-medium">
              Notifikasi
            </a>
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </div>
        </nav>
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="/logo.png?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 hidden md:block" />
        </div>
      </div>
    </header>
  )
}
