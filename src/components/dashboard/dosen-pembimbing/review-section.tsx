"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ReviewItem {
  id: string
  title: string
  description: string
  count: number
  icon: "document" | "edit"
  action: string
}

interface ReviewSectionProps {
  items: ReviewItem[]
}

export function ReviewSection({ items }: ReviewSectionProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "document":
        return <FileText className="h-5 w-5 text-primary" />
      case "edit":
        return <Edit className="h-5 w-5 text-amber-500" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Perlu Ditinjau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                  {getIcon(item.icon)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.title}</h4>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary">
                  {item.action}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
