"use client"

import { motion } from "framer-motion"
import { LayoutDashboard } from "lucide-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  // const { theme, setTheme } = useTheme()

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark")
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 mb-8"
    >
      <div className="flex justify-between items-center">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 dark:bg-primary/25">
              <LayoutDashboard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Registration Approval</h1>
              <p className="text-muted-foreground">Manage and approve student MBKM registration requests</p>
            </div>
          </div>
        </motion.div>

        {/* <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            <Badge variant="default" className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              3
            </Badge>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </motion.div> */}
      </div>
      
      {/* <div className="flex items-center gap-4 relative z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 bg-background/70 backdrop-blur border-muted" placeholder="Search registrations..." />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select className="bg-background/70 backdrop-blur border rounded px-2 py-1 text-sm">
            <option>Latest</option>
            <option>Oldest</option>
            <option>Student Name</option>
          </select>
        </div>
      </div> */}
    </motion.div>
  )
}
