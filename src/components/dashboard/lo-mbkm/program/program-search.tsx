"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProgramSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ProgramSearch({ value, onChange }: ProgramSearchProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange("")
  }

  return (
    <motion.div
      className={`relative flex items-center w-full max-w-xs ${
        isFocused ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800" : ""
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        placeholder="Search programs..."
        className="pl-9 pr-9 border-slate-300 dark:border-slate-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={handleClear}>
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
