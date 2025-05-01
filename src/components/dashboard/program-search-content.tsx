"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ProgramSubmission } from "./program-submission";
import { ProgramCard } from "./program-card";
// import { ReactQueryProvider } from "@/lib/api/providers/query-provider";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Program categories with descriptions and counts
const programCategories = [
  {
    id: "studi-independen",
    name: "Studi Independen",
    description: "Program pembelajaran mandiri di luar kampus dengan arahan profesional dari industri",
    count: 24
  },
  {
    id: "magang",
    name: "Magang",
    description: "Program pemagangan di perusahaan untuk mendapatkan pengalaman kerja nyata",
    count: 38
  },
  {
    id: "iisma",
    name: "IISMA",
    description: "Indonesian International Student Mobility Awards untuk pembelajaran di luar negeri",
    count: 15
  },
  {
    id: "kewirausahaan",
    name: "Kewirausahaan",
    description: "Program pengembangan bisnis dan startup untuk mahasiswa",
    count: 12
  },
  {
    id: "penelitian",
    name: "Penelitian",
    description: "Program penelitian dengan profesor atau lembaga penelitian terkemuka",
    count: 18
  },
  {
    id: "proyek-kemanusiaan",
    name: "Proyek Kemanusiaan",
    description: "Proyek-proyek sosial untuk mengatasi masalah kemanusiaan",
    count: 10
  },
  {
    id: "kampus-mengajar",
    name: "Kampus Mengajar",
    description: "Program mengajar di sekolah dasar dan menengah di berbagai daerah",
    count: 22
  },
  {
    id: "pembangunan-desa",
    name: "Pembangunan Desa",
    description: "Program pengembangan masyarakat dan infrastruktur di pedesaan",
    count: 16
  },
];

export function ProgramSearchContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("asc");
  const [filteredPrograms, setFilteredPrograms] = useState(programCategories);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort programs based on search term and sort option
  useEffect(() => {
    const filtered = programCategories.filter(program => 
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      program.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const getSortedPrograms = (programs: typeof programCategories, sortType: string) => {
      if (sortType === "asc") {
        return [...programs].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === "desc") {
        return [...programs].sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortType === "count") {
        return [...programs].sort((a, b) => b.count - a.count);
      }
      return programs;
    };
    
    setFilteredPrograms(getSortedPrograms(filtered, sortBy));
  }, [searchTerm, sortBy]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <DashboardLayout>
      {/* <SearchBar /> */}
      {/* <ReactQueryProvider> */}
      {isLoading ? (
        <motion.div 
          className="flex flex-col mt-15 items-center justify-center mt-32 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-lg font-medium text-blue-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Memuat Program MBKM...
          </motion.p>
        </motion.div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <motion.div 
            className="bg-gradient-to-r mt-15 from-blue-100 to-indigo-50 rounded-lg p-6 mt-12 mb-6 border border-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-blue-900 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Telusuri Program MBKM
            </motion.h1>
            <motion.p 
              className="text-blue-700 max-w-2xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Temukan berbagai program MBKM yang sesuai dengan minat dan keahlian Anda. 
              Pelajari lebih lanjut dan mulai perjalanan pembelajaran di luar kampus!
            </motion.p>
          </motion.div>

          <Suspense fallback={
            <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg mb-6"></div>
          }>
            <ProgramSubmission />
          </Suspense>

          <motion.div 
            className="flex flex-col md:flex-row items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari program MBKM"
                className="pl-10 bg-white border-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-500 h-4 w-4" />
              <span className="text-sm text-gray-700 whitespace-nowrap">Urutkan:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px] bg-white">
                  <SelectValue placeholder="Pilih urutan" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="asc">A-Z</SelectItem>
                  <SelectItem value="desc">Z-A</SelectItem>
                  <SelectItem value="count">Jumlah Program</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program, index) => (
                <motion.div key={program.id} variants={cardVariants}>
                  <ProgramCard
                    program={program}
                    imageUrl="/logo.png?height=200&width=1200"
                    logoUrl={`/logo.png?height=60&width=120&text=${program.name}`}
                    logoAlt={`${program.name} Logo`}
                    position={index % 2 === 0 ? "left" : "right"}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full p-8 bg-gray-50 rounded-lg border text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-lg text-gray-600 mb-2">Tidak ada program yang sesuai dengan pencarian Anda.</p>
                <p className="text-gray-500">Coba gunakan kata kunci yang berbeda atau reset pencarian Anda.</p>
                <Button 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setSearchTerm("")}
                >
                  Reset Pencarian
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
      {/* </ReactQueryProvider> */}
    </DashboardLayout>
  );
}
