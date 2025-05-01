"use client"

import { Search, Filter, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActivities, useAllGroups, useAllLevels, useAllProgramTypes } from '@/lib/api/hooks'
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface SearchFiltersProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export function SearchFilters({ setSearchTerm, setFilters, setCurrentPage }: SearchFiltersProps) {
  const [programName, setProgramName] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedProgramType, setSelectedProgramType] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  const { data: activitiesData } = useActivities(1, 4)
  const { data: groups, isLoading: groupsLoading } = useAllGroups()
  const { data: programTypes, isLoading: typesLoading } = useAllProgramTypes()
  const { data: levels, isLoading: levelsLoading } = useAllLevels()
  
  const totalActivities = activitiesData?.total || 0

  // Calculate active filter count
  useEffect(() => {
    let count = 0
    if (selectedGroup !== 'all') count++
    if (selectedProgramType !== 'all') count++
    if (selectedLevel !== 'all') count++
    setActiveFilterCount(count)
  }, [selectedGroup, selectedProgramType, selectedLevel])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgramName(event.target.value)
  }

  const handleSearchClick = () => {
    // Apply all filters simultaneously
    const filters: Record<string, string> = {}
    
    if (programName) {
      filters.name = programName
    }
    if (selectedGroup && selectedGroup !== 'all') {
      filters.group_id = selectedGroup
    }
    if (selectedProgramType && selectedProgramType !== 'all') {
      filters.program_type_id = selectedProgramType
    }
    if (selectedLevel && selectedLevel !== 'all') {
      filters.level_id = selectedLevel
    }
    
    // Set all filters at once
    setFilters(filters)
    setSearchTerm(programName)
    
    // Reset to page 1 when searching
    if (setCurrentPage) {
      setCurrentPage(1)
    }
  }

  const resetFilters = () => {
    setProgramName('')
    setSelectedGroup('all')
    setSelectedProgramType('all')
    setSelectedLevel('all')
    setFilters({})
    if (setCurrentPage) {
      setCurrentPage(1)
    }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginTop: 12,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0, 
      marginTop: 0,
      transition: { duration: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  }

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg border shadow-sm p-5"
    >
      <div className="flex flex-col gap-4">
        {/* Name search input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              className="pl-10 bg-white border-gray-200"
              placeholder="Cari program MBKM..."
              value={programName}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
            />
          </div>
          
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button 
              type="button"
              variant="outline" 
              className="gap-2 h-10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <Badge className="ml-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 h-10" 
              onClick={handleSearchClick}
            >
              Cari
            </Button>
          </motion.div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="border-t pt-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-700">Filter Program</h3>
                {activeFilterCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                    onClick={resetFilters}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset Filter
                  </motion.button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Group filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Kelompok Program
                  </label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Kelompok" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-100">
                      <SelectItem value="all">Semua Kelompok</SelectItem>
                      {groupsLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        groups?.data?.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Program Type filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tipe Kegiatan
                  </label>
                  <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Tipe Kegiatan" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-100">
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      {typesLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        programTypes?.data?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Level filter */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Level Kegiatan
                  </label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Level Kegiatan" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-100">
                      <SelectItem value="all">Semua Level</SelectItem>
                      {levelsLoading ? (
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : (
                        levels?.data?.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500">
                  Menampilkan total {totalActivities} program
                </div>
                
                <div className="flex gap-2">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap" 
                    variants={buttonVariants}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Tutup
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleSearchClick}
                    >
                      Terapkan Filter
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
