"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { TranscriptCard } from "./transcript-card"
import { Transcript } from "@/lib/api/services";

interface NRPSectionProps {
  nrp: string
  transcripts: Transcript[]
  onTranscriptClick: (transcript: Transcript) => void
}

export function NRPSection({ nrp, transcripts, onTranscriptClick }: NRPSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl font-bold">NRP: {nrp}</CardTitle>
            <Badge variant="outline" className="ml-2">
              {transcripts.length} transcript{transcripts.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transcripts.map((transcript, index) => (
              <motion.div
                key={transcript.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: index * 0.05 },
                }}
                className="h-full"
              >
                <TranscriptCard transcript={transcript} onClick={() => onTranscriptClick(transcript)} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
