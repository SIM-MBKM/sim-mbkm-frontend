import { ReactNode } from "react";
import Link from "next/link";

interface MahasiswaLayoutProps {
  children: ReactNode;
}

export default function MahasiswaLayout({ children }: MahasiswaLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-72 border-r border-border bg-white p-4">
        <div className="font-medium text-lg mb-6 mt-2">Beranda</div>
        <nav className="space-y-2">
          <Link
            href="/dashboard/mahasiswa"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Beranda
          </Link>
          
          <div className="pt-4 pb-2 text-gray-500">Pendaftaran</div>
          <Link
            href="/dashboard/mahasiswa/telusuri-program"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M21 21L16.65 16.65" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Telusuri Program
          </Link>
          <Link
            href="/dashboard/mahasiswa/program-saya"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M10 7H7V16H10V7Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M17 7H14V12H17V7Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Program Saya
          </Link>
          
          <div className="pt-4 pb-2 text-gray-500">Dokumentasi dan Monitoring</div>
          <Link
            href="/dashboard/mahasiswa/monitoring-status"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 8V12L15 15M3 12C3 13.8508 3.37451 15.6731 4.10106 17.3308C4.82762 18.9885 5.88155 20.4359 7.1967 21.5731C8.51184 22.7102 10.0514 23.5057 11.7081 23.8961C13.3649 24.2864 15.0908 24.2607 16.7364 23.8214C18.3821 23.3821 19.9 22.5399 21.1847 21.3662C22.4694 20.1925 23.486 18.7243 24.1729 17.0546C24.8598 15.3849 25.2008 13.5575 25.1681 11.7169C25.1353 9.87621 24.7295 8.06333 23.9826 6.42041C23.2357 4.77749 22.1645 3.34596 20.832 2.20737C19.4996 1.06877 17.9396 0.249255 16.2519 0.0627301C14.5642 -0.123795 12.8514 0.331127 11.3315 1.28292C9.8116 2.23471 8.53388 3.652 7.62933 5.36371C6.72477 7.07543 6.22026 9.01967 6.16 11" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Monitoring Status
          </Link>
          <Link
            href="/dashboard/mahasiswa/input-logbook"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Input Logbook
          </Link>
          <Link
            href="/dashboard/mahasiswa/input-transkrip"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M14 2V8H20" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M16 13H8" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M16 17H8" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M10 9H9H8" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Input Transkrip
          </Link>
          <Link
            href="/dashboard/mahasiswa/input-silabus"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Input Silabus
          </Link>
          <Link
            href="/dashboard/mahasiswa/input-laporan-akhir"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M7 7H17" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M7 12H17" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M7 17H13" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Input Laporan Akhir
          </Link>
          <Link
            href="/dashboard/mahasiswa/file-tambahan"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M2 18C2 16.9391 2.42143 15.9217 3.17157 15.1716C3.92172 14.4214 4.93913 14 6 14H18C19.0609 14 20.0783 14.4214 20.8284 15.1716C21.5786 15.9217 22 16.9391 22 18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M5 14V8C5 6.4087 5.63214 4.88258 6.75736 3.75736C7.88258 2.63214 9.4087 2 11 2H15C15.5304 2 16.0391 2.21071 16.4142 2.58579C16.7893 2.96086 17 3.46957 17 4V14" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            File Tambahan
          </Link>
          
          <div className="pt-4 pb-2 text-gray-500">MBKM</div>
          <Link
            href="/dashboard/mahasiswa/mbkm"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M22 12H2" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M12 2V22" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M17 7H7" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M17 17H7" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            MBKM
          </Link>
          <Link
            href="/dashboard/mahasiswa/ekivalensi-mk"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M19.4 15C19.1277 15.8031 19.2213 16.6846 19.6515 17.4177C20.0816 18.1507 20.8082 18.6686 21.66 18.84L21.4 19.2C20.5682 19.3718 19.8438 19.893 19.4216 20.6279C18.9994 21.3627 18.9119 22.2444 19.18 23.04C18.3473 22.9366 17.5141 23.2206 16.8909 23.8186C16.2677 24.4166 15.9373 25.265 16 26.1C15.1716 25.8808 14.2851 26.0566 13.5967 26.5788C12.9083 27.1011 12.4958 27.9183 12.5 28.78C11.7448 28.3803 10.8354 28.3803 10.08 28.78C10.0764 27.9204 9.6601 27.1069 8.97 26.588C8.2799 26.0691 7.39533 25.8955 6.57 26.115C6.62551 25.2806 6.29348 24.4335 5.67107 23.8359C5.04865 23.2383 4.21733 22.9539 3.385 23.055C3.65314 22.2594 3.56564 21.3777 3.14343 20.6429C2.72122 19.908 1.99682 19.3868 1.165 19.215L0.94 18.855C1.7889 18.6808 2.51254 18.1642 2.94251 17.4337C3.37249 16.7032 3.46839 15.8244 3.2 15.02C4.03261 15.1213 4.86542 14.8356 5.48839 14.2379C6.11136 13.6401 6.44346 12.7937 6.39 11.96C7.22073 12.1835 8.10798 12.0072 8.80246 11.482C9.49694 10.9568 9.91486 10.1351 9.915 9.27C10.6775 9.67708 11.6016 9.67708 12.364 9.27C12.3719 10.1292 12.788 10.9452 13.477 11.4676C14.166 11.99 15.0449 12.1676 15.872 11.95C15.8165 12.7844 16.1485 13.6315 16.7709 14.2291C17.3934 14.8267 18.2247 15.1111 19.057 15.01L19.4 15Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Ekivalensi MK
          </Link>
          <Link
            href="/dashboard/mahasiswa/jadwal"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M16 2V6" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M8 2V6" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M3 10H21" 
                stroke="black" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            Jadwal
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
} 