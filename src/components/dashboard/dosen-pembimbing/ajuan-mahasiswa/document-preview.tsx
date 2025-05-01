"use client"

import React, { useState, useEffect } from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document } from "@/lib/api/services";

// Create a simple skeleton component if it doesn't exist
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
);

interface DocumentPreviewProps {
  documentId: string | null;
  onClose: () => void;
}


export function DocumentPreview({ documentId, onClose }: DocumentPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);

  // Simulate fetching document details
  useEffect(() => {
    if (documentId) {
      // In a real application, you would fetch the document data from your API
      const fetchTimeout = setTimeout(() => {
        setDocument({
          id: "",
          subject_id: "",
          file_storage_id: "",
          name: "",
          document_type: ""
        });
        setLoading(false);
      }, 1200);

      return () => {
        clearTimeout(fetchTimeout);
        setLoading(true);
        setDocument(null);
      };
    }
  }, [documentId]);

  // Determine document icon based on mime type
  const getDocumentIcon = () => {
    if (!document) return <FileText className="h-16 w-16 text-blue-500" />;
    
    if (document.document_type.includes("pdf")) {
      return <FileText className="h-16 w-16 text-red-500" />;
    } else if (document.document_type.includes("image")) {
      return <FileText className="h-16 w-16 text-purple-500" />;
    } else if (document.document_type.includes("word") || document.document_type.includes("document")) {
      return <FileText className="h-16 w-16 text-blue-500" />;
    } else if (document.document_type.includes("excel") || document.document_type.includes("sheet")) {
      return <FileText className="h-16 w-16 text-green-500" />;
    }
    
    return <FileText className="h-16 w-16 text-gray-500" />;
  };

  return (
    <Dialog open={!!documentId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-full bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <span>{document?.name}</span>
            )}
          </DialogTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-60 mt-2" />
            ) : (
              <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                <span>Type: {document?.document_type?.split("/")[1]?.toUpperCase() || "DOCUMENT"}</span>
                <span>•</span>
                <span>Name: {document?.name}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="relative border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              {getDocumentIcon()}
              <h3 className="text-lg font-medium mb-2 mt-4">Document Preview</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                For security reasons, document preview is simulated in this demo. 
                In a production environment, the actual document would be displayed here.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open in New Tab
                </Button>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {!loading && "Document ID: " + documentId?.substring(0, 8) + "..."}
          </div>
          <Button variant="ghost" onClick={() => onClose()}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
