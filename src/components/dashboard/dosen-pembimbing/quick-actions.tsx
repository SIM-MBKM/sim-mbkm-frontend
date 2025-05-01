"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileUp, Users, Calendar } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
      label: "Tambah Program",
      color:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
    },
    {
      icon: <FileUp className="h-4 w-4 mr-2" />,
      label: "Unggah Dokumen",
      color:
        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
    },
    {
      icon: <Users className="h-4 w-4 mr-2" />,
      label: "Kelola Mahasiswa",
      color:
        "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50",
    },
    {
      icon: <Calendar className="h-4 w-4 mr-2" />,
      label: "Jadwalkan Monev",
      color:
        "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50",
    },
  ]

  return (
    <Card className="lg:w-[140%] w-[100%]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent className="w-auto">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className={`w-full justify-start ${action.color}`}>
                {action.icon}
                {action.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
