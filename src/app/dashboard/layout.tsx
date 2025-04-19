import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Image 
              src="/its-logo.png" 
              alt="ITS Logo" 
              width={45} 
              height={45} 
              className="h-auto w-auto" 
            />
          </Link>
        </div>
        <nav className="flex items-center space-x-8">
          <Link 
            href="/dashboard" 
            className="font-medium hover:text-secondary transition-colors"
          >
            Beranda
          </Link>
          <Link 
            href="/dashboard/program" 
            className="font-medium hover:text-secondary transition-colors"
          >
            Program
          </Link>
          <Link 
            href="/dashboard/bantuan" 
            className="font-medium hover:text-secondary transition-colors"
          >
            Bantuan
          </Link>
          <Link 
            href="/dashboard/notifikasi" 
            className="font-medium hover:text-secondary transition-colors"
          >
            Notifikasi
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="flex items-center gap-2">
              <Image 
                src="/profile-placeholder.png" 
                alt="Profile" 
                width={40} 
                height={40} 
                className="rounded-full h-10 w-10 object-cover" 
              />
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path 
                  d="M5 7.5L10 12.5L15 7.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 