"use client";

import Image from "next/image";
import { ChevronDown, Menu, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "./dashboard-provider";
import { useChangeSelfRoleToDosenPembimbing, useChangeSelfRoleToDosenPemonev } from "@/lib/api/hooks/use-query-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Header() {
  const { toggleSidebar } = useDashboard();
  const changeToDosenPembimbing = useChangeSelfRoleToDosenPembimbing();
  const changeToDosenPemonev = useChangeSelfRoleToDosenPemonev();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleRoleChange = async (role: "pembimbing" | "pemonev") => {
    try {
      if (role === "pembimbing") {
        await changeToDosenPembimbing.mutateAsync();
        toast.success("Role berhasil diubah ke Dosen Pembimbing");

        // Invalidate all queries to force refresh
        await queryClient.invalidateQueries();

        // Navigate to Dosen Pembimbing dashboard
        router.push("/dashboard/dosen-pembimbing");
      } else {
        await changeToDosenPemonev.mutateAsync();
        toast.success("Role berhasil diubah ke Dosen Pemonev");

        // Invalidate all queries to force refresh
        await queryClient.invalidateQueries();

        // Navigate to Dosen Pemonev dashboard
        router.push("/dashboard/dosen-pemonev");
      }
    } catch (error) {
      toast.error("Gagal mengubah role");
      console.error("Role change error:", error);
    }
  };

  const isLoading = changeToDosenPembimbing.isPending || changeToDosenPemonev.isPending;

  return (
    <header className="bg-[#003478] dark:bg-[#003478] text-white p-4 flex items-center justify-between z-50 fixed w-full">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-blue-800 lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <Image src="/logo.png?height=50&width=120" alt="ITS Logo" width={120} height={50} className="h-10 w-auto" />
      </div>
      <div className="flex items-center space-x-4">
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

        {/* Role Change Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-800 flex items-center space-x-2"
              disabled={isLoading}
            >
              <UserCog className="h-4 w-4" />
              <span className="hidden md:inline">Ubah Role</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuLabel>Pilih Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleRoleChange("pembimbing")}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span>Dosen Pembimbing</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleChange("pemonev")}
              disabled={isLoading}
              className="cursor-pointer"
            >
              <UserCog className="mr-2 h-4 w-4" />
              <span>Dosen Pemonev</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src="/logo.png?height=40&width=40" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
