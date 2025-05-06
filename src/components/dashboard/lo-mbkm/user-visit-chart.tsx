"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, BarChart3, ArrowRight, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const data = [15, 29, 20, 25, 18, 38, 25, 30, 20, 15, 12, 20]

export function UserVisitChart() {
  const [expanded, setExpanded] = useState(true)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [animateChart, setAnimateChart] = useState(false)

  // Animate chart on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="h-full border border-neutral-200 bg-white flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b border-neutral-200">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span>Average User Visit</span>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <BarChart3 className="h-4 w-4" />
          </Button>
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="px-4 py-2 flex-grow">
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden h-full"
            >
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Total Visits</p>
                    <p className="text-xl font-bold">267,950</p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="gap-1 text-xs bg-white border-gray-200 hover:bg-gray-50 text-gray-700">
                      View Report
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="relative h-[160px] mt-6">
                  {/* Horizontal grid lines */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute top-2/4 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                  </div>

                  {/* Y-axis labels */}
                  <div className="absolute -top-6 left-0 text-xs text-gray-500">50</div>
                  <div className="absolute top-1/4 -translate-y-3 left-0 text-xs text-gray-500">40</div>
                  <div className="absolute top-2/4 -translate-y-3 left-0 text-xs text-gray-500">30</div>
                  <div className="absolute top-3/4 -translate-y-3 left-0 text-xs text-gray-500">20</div>
                  <div className="absolute bottom-0 -translate-y-3 left-0 text-xs text-gray-500">0</div>

                  {/* Chart bars */}
                  <div className="absolute inset-0 flex items-end justify-between pl-6 pb-6">
                    {data.map((value, index) => {
                      const barHeight = (value / 50) * 100
                      const isJune = index === 5 // June is highlighted in the original image

                      return (
                        <div
                          key={index}
                          className="relative flex-1 flex flex-col items-center justify-end h-full"
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Value tooltip */}
                          {hoveredBar === index && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -top-8 bg-blue-600 text-white rounded px-2 py-1 text-xs font-medium z-10"
                            >
                              {value}K
                            </motion.div>
                          )}

                          <motion.div
                            className={cn(
                              "w-5/6 max-w-[16px] rounded-t-sm",
                              isJune ? "bg-blue-600" : "bg-blue-400/40",
                              hoveredBar === index ? "bg-blue-600" : "",
                            )}
                            initial={{ height: 0 }}
                            animate={{ height: animateChart ? `${barHeight}%` : 0 }}
                            transition={{
                              duration: 0.7,
                              delay: index * 0.05,
                              ease: "easeOut",
                            }}
                          />
                          <div className="absolute bottom-[-24px] text-xs text-gray-500">{months[index]}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t border-neutral-200 bg-gray-50 mt-auto">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            <span>Last 12 months</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            <span>+12.5% growth</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
