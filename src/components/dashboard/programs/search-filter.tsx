import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActivities, useAllGroups, useAllLevels, useAllProgramTypes } from '@/lib/api/hooks'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const { data: activitiesData } = useActivities(1, 4)
  const { data: groups } = useAllGroups()
  const { data: programTypes } = useAllProgramTypes()
  const { data: levels } = useAllLevels()
  
  const totalActivities = activitiesData?.total || 0

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
    console.log('Applied filters:', filters)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        {/* Name search input */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              className="pl-10 bg-white"
              placeholder="Nama Program"
              value={programName}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
            />
          </div>
        </div>

        {/* Advanced filters */}
        <div className="flex flex-row gap-3">
          {/* Group filter */}
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full md:w-[240px] bg-white">
              <SelectValue placeholder="Kelompok" />
            </SelectTrigger>
            <SelectContent className="bg-white z-100">
              <SelectItem value="all">Semua Kelompok</SelectItem>
              {groups && groups.data && groups.data.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Program Type filter */}
          <Select value={selectedProgramType} onValueChange={setSelectedProgramType}>
            <SelectTrigger className="w-full md:w-[240px] bg-white">
              <SelectValue placeholder="Tipe Kegiatan" />
            </SelectTrigger>
            <SelectContent className="bg-white z-100">
              <SelectItem value="all">Semua Tipe</SelectItem>
              {programTypes && programTypes.data && programTypes.data.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Level filter */}
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-[240px] bg-white">
              <SelectValue placeholder="Level Kegiatan" />
            </SelectTrigger>
            <SelectContent className="bg-white z-100">
              <SelectItem value="all">Semua Level</SelectItem>
              {levels && levels.data && levels.data.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" className="px-4 min-w-[100px]">
          Filter
          <span className="ml-1 bg-gray-200 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {totalActivities}
          </span>
        </Button>

        <Button 
          className="bg-[#003478] text-white hover:bg-[#00275a] min-w-[160px]" 
          onClick={handleSearchClick}
        >
          Cari
        </Button>
      </div>
    </div>
  )
}
