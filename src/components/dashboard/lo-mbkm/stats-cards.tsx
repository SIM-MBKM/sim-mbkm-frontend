"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Building, ArrowUpRight } from "lucide-react"

const stats = [
  {
    id: 1,
    title: "Jumlah Pengguna",
    value: "2,350",
    increase: "+180.1% dari bulan lalu",
    icon: <Users className="h-5 w-5" />,
    color: "from-blue-600 to-blue-800",
    lightColor: "from-blue-50 to-blue-100",
    darkColor: "from-blue-900 to-blue-950",
    hoverColor: "from-blue-500 to-blue-700",
    darkHoverColor: "from-blue-800 to-blue-900",
    textColor: "text-blue-600",
    darkTextColor: "dark:text-blue-400",
  },
  {
    id: 2,
    title: "Pengguna Aktif",
    value: "531",
    increase: "+200 dari jam lalu",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "from-green-600 to-green-800",
    lightColor: "from-green-50 to-green-100",
    darkColor: "from-green-900 to-green-950",
    hoverColor: "from-green-500 to-green-700",
    darkHoverColor: "from-green-800 to-green-900",
    textColor: "text-green-600",
    darkTextColor: "dark:text-green-400",
  },
  {
    id: 3,
    title: "Jumlah Mitra",
    value: "100",
    increase: "+50 dari bulan lalu",
    icon: <Building className="h-5 w-5" />,
    color: "from-purple-600 to-purple-800",
    lightColor: "from-purple-50 to-purple-100",
    darkColor: "from-purple-900 to-purple-950",
    hoverColor: "from-purple-500 to-purple-700",
    darkHoverColor: "from-purple-800 to-purple-900",
    textColor: "text-purple-600",
    darkTextColor: "dark:text-purple-400",
  },
]

export function StatsCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.id * 0.1 }}
          whileHover={{
            y: -5,
            transition: { duration: 0.2 },
          }}
          onMouseEnter={() => setHoveredCard(stat.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative"
        >
          <Card
            className={`overflow-hidden border-2 transition-all duration-300 ${
              hoveredCard === stat.id
                ? `border-${stat.color.split("-")[1]}-400 dark:border-${stat.color.split("-")[1]}-600`
                : "border-neutral-200"
            }`}
          >
            <CardContent className="p-0">
              <div
                className={`bg-gradient-to-r p-6 transition-all duration-300 ${
                  hoveredCard === stat.id
                    ? `${stat.hoverColor} dark:${stat.darkHoverColor}`
                    : `${stat.lightColor} dark:${stat.darkColor}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        hoveredCard === stat.id ? "text-white" : `${stat.textColor} ${stat.darkTextColor}`
                      }`}
                    >
                      {stat.title}
                    </p>
                    <div className="flex items-baseline mt-1 gap-2">
                      <motion.p
                        className={`text-3xl font-bold transition-colors duration-300 ${
                          hoveredCard === stat.id ? "text-white" : "text-foreground"
                        }`}
                        animate={{
                          scale: hoveredCard === stat.id ? 1.05 : 1,
                          y: hoveredCard === stat.id ? -2 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        {stat.value}
                      </motion.p>
                      {hoveredCard === stat.id && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-white text-xs font-medium bg-white/20 px-2 py-1 rounded-full"
                        >
                          <ArrowUpRight className="h-3 w-3 inline mr-1" />
                          Trending
                        </motion.div>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        hoveredCard === stat.id ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {stat.increase}
                    </p>
                  </div>
                  <motion.div
                    animate={{
                      rotate: hoveredCard === stat.id ? 360 : 0,
                      scale: hoveredCard === stat.id ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`p-3 rounded-full transition-colors duration-300 ${
                      hoveredCard === stat.id
                        ? "bg-white/20 text-white"
                        : `bg-${stat.color.split("-")[1]}-100 dark:bg-${stat.color.split("-")[1]}-900 ${stat.textColor} ${stat.darkTextColor}`
                    }`}
                  >
                    {stat.icon}
                  </motion.div>
                </div>
              </div>

              <div className="p-3 bg-background">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    <span>{stat.increase}</span>
                  </p>

                  {hoveredCard === stat.id && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`text-xs px-2 py-1 rounded-md ${stat.textColor} ${stat.darkTextColor} hover:bg-${stat.color.split("-")[1]}-50 dark:hover:bg-${stat.color.split("-")[1]}-900/50`}
                    >
                      View Details
                    </motion.button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {hoveredCard === stat.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -bottom-2 left-0 right-0 mx-auto w-3/4 h-4 bg-black/5 dark:bg-black/20 blur-xl rounded-full z-0"
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
