"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, FileText, ExternalLink, Edit, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Subject } from "@/lib/api/services/matching-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Document } from "@/lib/api/services/registration-service";

interface SubjectCardProps {
  subject: Subject
  index: number
  onEdit: (subject: Subject) => void
  onDelete: (subject: Subject) => void
}

export function SubjectCard({ subject, index, onEdit, onDelete }: SubjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleEdit = () => {
    onEdit(subject)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    onDelete(subject)
    setShowDeleteDialog(false)
  }

  const hasDocuments = subject.documents && subject.documents.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{subject.mata_kuliah}</h3>
              <p className="text-sm text-muted-foreground">{subject.kode}</p>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant={hasDocuments ? "success" : "outline"} className="mr-2">
                {hasDocuments ? `${subject.documents.length} Doc` : "No Docs"}
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="text-muted-foreground">Department:</div>
            <div className="font-medium">{subject.departemen}</div>

            <div className="text-muted-foreground">Program:</div>
            <div className="font-medium line-clamp-1">{subject.prodi_penyelenggara}</div>

            <div className="text-muted-foreground">Semester:</div>
            <div className="font-medium">{subject.semester}</div>

            <div className="text-muted-foreground">Credits:</div>
            <div className="font-medium">{subject.sks} SKS</div>

            <div className="text-muted-foreground">Class:</div>
            <div className="font-medium">{subject.kelas}</div>

            <div className="text-muted-foreground">Type:</div>
            <div className="font-medium capitalize">{subject.tipe_mata_kuliah}</div>
          </div>

          {isExpanded && hasDocuments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Separator className="mb-3" />
              <h4 className="text-sm font-medium mb-2">Documents</h4>
              <ScrollArea className="h-[120px]">
                <div className="space-y-2">
                  {subject.documents.map((doc: Document) => (
                    <div key={doc.id} className="bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="w-full flex items-center justify-center">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                {hasDocuments ? "View Documents" : "Show Details"}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the subject <span className="font-semibold">{subject.mata_kuliah}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-500/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
