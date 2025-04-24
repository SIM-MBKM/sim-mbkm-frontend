"use client"

// import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useAllProgramTypes, useAllLevels, useAllGroups } from "@/lib/api/hooks"

export function SearchBar() {
  const {
    data: programTypes,
    isLoading: programTypesLoading,
    error: programTypesError
  } = useAllProgramTypes();

  const {
    data: levels,
    isLoading: levelsLoading,
    error: levelsError
  } = useAllLevels();

  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError
  } = useAllGroups()

  if (programTypesLoading && levelsLoading && groupsLoading) {
    return <div>Loading...</div>;
  }
  
  if (programTypesError || levelsError || groupsError) {
    return (
      <div>
        <div>Error loading program type: {programTypesError?.message}
        </div>
        <div>Error loading program type: {levelsError?.message}
        </div>
        <div>Error loading program type: {groupsError?.message}
        </div>
      </div>
      )
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">

      <div className="flex-1 flex flex-col md:flex-row gap-3">
      <Select>
          <SelectTrigger className="w-full md:w-[240px] bg-white">
            <SelectValue placeholder="Kelompok" />
          </SelectTrigger>
          <SelectContent className="bg-white z-100">
            {
              groups && groups.data && groups.data.length > 0 ? (
                groups.data.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))
              ) : null
            }
          </SelectContent>
        </Select>    

        <Select>
          <SelectTrigger className="w-full md:w-[240px] bg-white">
            <SelectValue placeholder="Tipe Kegiatan" />
          </SelectTrigger>
          <SelectContent className="bg-white z-100">
            {
              programTypes && programTypes.data && programTypes.data.length > 0 ? (
                programTypes.data.map((programType) => (
                  <SelectItem key={programType.id} value={programType.id}>
                    {programType.name}
                  </SelectItem>
                ))
              ) : null
            }
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full md:w-[240px] bg-white">
            <SelectValue placeholder="Level Kegiatan" />
          </SelectTrigger>
          <SelectContent className="bg-white z-100">
            {
              levels && levels.data && levels.data.length > 0 ? (
                levels.data.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))
              ) : null
            }
          </SelectContent>
        </Select>

        {/* <Button className="bg-[#003478] hover:bg-[#00275a] text-white">Cari</Button> */}
      </div>
    </div>
  )
}
