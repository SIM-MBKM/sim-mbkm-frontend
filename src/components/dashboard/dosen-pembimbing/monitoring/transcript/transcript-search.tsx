"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface TranscriptSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TranscriptSearch({ searchQuery, onSearchChange }: TranscriptSearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Update local state when prop changes
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleSearch = () => {
    onSearchChange(localQuery)
  }

  const handleClear = () => {
    setLocalQuery("")
    onSearchChange("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <motion.div  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Search</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search by NRP</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter NRP number..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9 pr-10"
                />
                {localQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex space-x-2 flex-row justify-end w-full ">
              <Button onClick={handleSearch} className=" bg-gradient-to-br from-blue-600/90 to-blue-700 text-white">
                Search
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
