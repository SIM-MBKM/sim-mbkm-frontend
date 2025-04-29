"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Matching } from "@/lib/api/services/registration-service";

interface MatchingCardProps {
  matching: Matching
  isSelected: boolean
  onToggle: () => void
}

export function MatchingCard({ matching, isSelected, onToggle }: MatchingCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onToggle} className="cursor-pointer">
      <Card
        className={`overflow-hidden border-2 transition-all duration-300 ${
          isSelected ? "border-green-500 bg-green-50" : "border-red-200 hover:border-red-300"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{matching.mata_kuliah}</h4>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{matching.kode}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{matching.prodi_penyelenggara}</p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">Departemen:</span>{" "}
                  <span className="font-medium">{matching.departemen}</span>
                </div>
                <div>
                  <span className="text-gray-500">SKS:</span> <span className="font-medium">{matching.sks}</span>
                </div>
                <div>
                  <span className="text-gray-500">Semester:</span>{" "}
                  <span className="font-medium">{matching.semester}</span>
                </div>
                <div>
                  <span className="text-gray-500">Kelas:</span> <span className="font-medium">{matching.kelas}</span>
                </div>
              </div>
            </div>
            <motion.div
              initial={false}
              animate={{
                rotate: isSelected ? 0 : 180,
                backgroundColor: isSelected ? "#22c55e" : "#ef4444",
              }}
              className="rounded-full p-2 text-white"
            >
              {isSelected ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
