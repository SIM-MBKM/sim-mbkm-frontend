"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FormEvent, useEffect, useState } from "react"

interface ReportFilterProps {
  nrps: string[]
  allNrps: string[]
  selectedNRP: string | null
  onNRPChange: (nrp: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchSubmit: () => void
  currentActivity?: string | null
  isSearching?: boolean
}

export function ReportFilter({
  nrps,
  allNrps,
  selectedNRP,
  onNRPChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  currentActivity,
  isSearching = false
}: ReportFilterProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
  
  // Keep local state in sync with props if parent component changes searchQuery
  useEffect(() => {
    setLocalSearchValue(searchQuery);
  }, [searchQuery]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // First update parent's state with our local value, then trigger search
    onSearchChange(localSearchValue);
    // Use setTimeout to ensure the state update completes before submitting
    setTimeout(() => {
      onSearchSubmit();
    }, 0);
  };
  
  // Handle local input changes without affecting parent state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(e.target.value);
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Filters</h3>
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2">
              <Label htmlFor="search">Search NRP</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by NRP..."
                    value={localSearchValue}
                    onChange={handleInputChange}
                    className="pl-9"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search
                    </>
                  )}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isSearching 
                  ? "Searching..." 
                  : `Showing ${nrps.length} of ${allNrps.length} NRPs`
                }
              </div>
            </form>

            <div className="space-y-2">
              <Label htmlFor="nrp">Student NRP</Label>
              <Select value={selectedNRP || ""} onValueChange={onNRPChange} disabled={isSearching}>
                <SelectTrigger id="nrp">
                  <SelectValue placeholder="Select student NRP" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {nrps.map((nrp) => (
                    <SelectItem key={nrp} value={nrp}>
                      {nrp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedNRP && (
              <div className="pt-2">
                <Badge variant="outline" className="bg-primary/10">
                  Selected: {selectedNRP}
                </Badge>
              </div>
            )}

            {currentActivity && (
              <div className="pt-2 flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Current activity:</span>
                <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-800">
                  {currentActivity}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
