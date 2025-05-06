"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, MapPin, Globe, Clock, ChevronDown, ChevronUp, Award, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Activity } from "@/lib/api/services"

interface ActivityCardProps {
  activity: Activity
  index: number
  onMatchClick: () => void
}

export function ActivityCard({ activity, index, onMatchClick }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy")
  }

  // Determine card border color based on matching status
  const getBorderColor = () => {
    if (activity.matching && Array.isArray(activity.matching) && activity.matching.length > 0) {
      return "border-green-500 dark:border-green-700"
    }
    return "border-slate-200 dark:border-slate-700"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
    >
      <Card className={`overflow-hidden transition-all duration-300 ${getBorderColor()} hover:shadow-md`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{activity.name}</h3>
              <p className="text-sm text-muted-foreground">{activity.program_provider}</p>
            </div>
            {activity.matching && Array.isArray(activity.matching) && activity.matching.length > 0 ? (
              <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                Matched
              </Badge>
            ) : (
              <Badge variant="outline">Unmatched</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-3">
            <p className="text-sm line-clamp-2">{activity.description}</p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDate(activity.start_period)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {activity.months_duration} month{activity.months_duration > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{activity.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{activity.level}</span>
              </div>
            </div>

            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-2 space-y-3"
              >
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{activity.program_type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{activity.group}</span>
                  </div>
                </div>

                {activity.web_portal && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <a
                      href={activity.web_portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                    >
                      {activity.web_portal}
                    </a>
                  </div>
                )}

                {activity.matching && Array.isArray(activity.matching) && activity.matching.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Matched Subjects:</h4>
                    <div className="space-y-1.5">
                      {activity.matching.map((subject) => (
                        <div
                          key={subject.id}
                          className="text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-md flex flex-col"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{subject.mata_kuliah}</span>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {subject.kode}
                            </Badge>
                          </div>
                          <span className="text-muted-foreground">
                            {subject.departemen} • {subject.sks} SKS
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="gap-1">
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>More</span>
              </>
            )}
          </Button>
          <Button size="sm" onClick={onMatchClick} className="bg-purple-600 hover:bg-purple-700 text-white">
            {activity.matching ? "Edit Matching" : "Add Matching"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
