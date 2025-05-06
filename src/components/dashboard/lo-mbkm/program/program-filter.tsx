"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useProgramAPI } from "./program-dashboard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProgramFilterProps {
  selectedTab: "PENDING" | "APPROVED" | "REJECTED"
  onTabChange: (tab: "PENDING" | "APPROVED" | "REJECTED") => void
}

export function ProgramFilter({ selectedTab, onTabChange }: ProgramFilterProps) {
  const { setFilters, activitiesData, programTypes, levels, groups, currentFilters, isLoading } = useProgramAPI()
  const prevSelectedTabRef = useRef<string>(selectedTab);
  const [nameFilter, setNameFilter] = useState("");
  
  // Apply filter by approval_status when selectedTab changes
  useEffect(() => {
    // Only call setFilters if selectedTab has actually changed
    if (prevSelectedTabRef.current !== selectedTab) {
      setFilters({ approval_status: selectedTab });
      prevSelectedTabRef.current = selectedTab;
    }
  }, [selectedTab, setFilters]);

  // Handle search by name
  const handleSearch = () => {
    setFilters({ name: nameFilter });
  }

  // Apply search filter on enter press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  // Get counts from total_approval_data
  const getStatusCount = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    const countData = activitiesData?.total_approval_data?.find(
      item => item.approval_status === status
    );
    return countData?.total || 0;
  }

  const pendingCount = getStatusCount("PENDING");
  const approvedCount = getStatusCount("APPROVED");
  const rejectedCount = getStatusCount("REJECTED");

  // Handle select value change with special handling for the "all" option
  const handleSelectChange = (fieldName: string, value: string) => {
    // If value is "_all", we want to clear the filter (empty string)
    const filterValue = value === "_all" ? "" : value;
    setFilters({ [fieldName]: filterValue });
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Filters</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Status</h3>
            <div className="space-y-2">
              <StatusButton
                label="Pending"
                count={isLoading ? 0 : pendingCount}
                isActive={selectedTab === "PENDING"}
                onClick={() => onTabChange("PENDING")}
                color="amber"
              />
              <StatusButton
                label="Approved"
                count={isLoading ? 0 : approvedCount}
                isActive={selectedTab === "APPROVED"}
                onClick={() => onTabChange("APPROVED")}
                color="green"
              />
              <StatusButton
                label="Rejected"
                count={isLoading ? 0 : rejectedCount}
                isActive={selectedTab === "REJECTED"}
                onClick={() => onTabChange("REJECTED")}
                color="red"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Search</h3>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name..."
                className="pl-9"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button size="sm" className="w-full" onClick={handleSearch}>
              Search
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Program Type</h3>
              <Select 
                value={currentFilters.program_type_id || "_all"} 
                onValueChange={(value) => handleSelectChange("program_type_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800">
                  <SelectItem value="_all">All Program Types</SelectItem>
                  {programTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Level</h3>
              <Select 
                value={currentFilters.level_id || "_all"} 
                onValueChange={(value) => handleSelectChange("level_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800">
                  <SelectItem value="_all">All Levels</SelectItem>
                  {levels?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Group</h3>
              <Select 
                value={currentFilters.group_id || "_all"} 
                onValueChange={(value) => handleSelectChange("group_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800">
                  <SelectItem value="_all">All Groups</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setFilters({
                name: "",
                program_type_id: "",
                level_id: "",
                group_id: "",
                activity_id: "",
                approval_status: selectedTab
              })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface StatusButtonProps {
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  color: "amber" | "green" | "red"
}

function StatusButton({ label, count, isActive, onClick, color }: StatusButtonProps) {
  const getColorClasses = () => {
    if (isActive) {
      if (color === "amber")
        return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
      if (color === "green")
        return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
      if (color === "red")
        return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
    }
    return "hover:bg-slate-100 dark:hover:bg-slate-700"
  }

  return (
    <motion.button
      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md border ${
        isActive ? getColorClasses() : "border-transparent text-slate-600 dark:text-slate-300"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span>{label}</span>
      <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-white/20" : ""}>
        {count}
      </Badge>
    </motion.button>
  )
}
