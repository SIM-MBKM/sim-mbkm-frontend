"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { Clock, FileUp, Type, Upload, MessageCircle, AlertCircle, CheckCircle, Eye, ExternalLink, Download, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { useSubmitReport, useGetTemporaryLink } from "@/lib/api/hooks"
import { toast } from "react-toastify"

interface Report {
  id: string
  report_type: string
  week: number
  start_date: string
  end_date: string
  report: string | null
  status: string
  feedback: string | null
  report_schedule_id: string // Required field for API calls
  file_storage_id: string | null // Add this field for file access
}

interface ReportCardProps {
  report: Report
  refetch?: () => void
}

export function ReportCard({ report, refetch }: ReportCardProps) {
  const [submissionType, setSubmissionType] = useState<"text" | "file">("text")
  const [textReport, setTextReport] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [reportTitle, setReportTitle] = useState(
    report.report_type === "WEEKLY_REPORT" 
      ? `Laporan Minggu ${report.week}` 
      : "Laporan Akhir Program"
  )
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isReportDetailOpen, setIsReportDetailOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Use the submitReport mutation
  const { 
    mutate: submitReport, 
    isPending: isSubmitting
  } = useSubmitReport()
  
  // Use the temporary link hook if there's a file_storage_id
  const fileId = report.file_storage_id;
  const { 
    data: fileData, 
    isLoading: isFileLoading, 
    error: fileError,
    refetch: refetchFileLink
  } = useGetTemporaryLink(fileId || '')

  // Enable the query only when we have a valid fileId and the dialog is open
  const shouldFetchFile = Boolean(fileId) && isReportDetailOpen;

  // Fetch file link when detail dialog opens
  useEffect(() => {
    if (shouldFetchFile) {
      console.log("Fetching file link for ID:", fileId);
      refetchFileLink();
    }
  }, [shouldFetchFile, fileId, refetchFileLink]);

  // Debug logs to trace issue
  useEffect(() => {
    if (isReportDetailOpen && fileId) {
      console.log("File detail dialog opened with ID:", fileId);
    }
    if (fileData) {
      console.log("File data received:", fileData);
    }
    if (fileError) {
      console.error("File fetch error:", fileError);
    }
  }, [isReportDetailOpen, fileId, fileData, fileError]);

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: id })
    } catch {
      return dateStr
    }
  }

  const handleTextSubmit = () => {
    if (!textReport) {
      toast.error("Silakan isi konten laporan terlebih dahulu");
      return;
    }
    
    if (!report.report_schedule_id) {
      console.error("Missing report_schedule_id:", report);
      toast.error("ID jadwal laporan tidak ditemukan. Silakan coba muat ulang halaman.");
      return;
    }
    
    const reportData = {
      report_schedule_id: report.report_schedule_id,
      title: reportTitle,
      content: textReport,
      report_type: report.report_type
    }

    console.log("REPORT TYPE", report.report_type)
    
    console.log("Submitting text report:", reportData);
    
    submitReport(reportData, {
      onSuccess: (data) => {
        console.log("Report submission success:", data);
        toast.success("Laporan berhasil dikirim!");
        setTextReport("");
        // Refresh data after successful submission
        if (refetch) {
          setTimeout(() => refetch(), 500);
        }
      },
      onError: (error) => {
        console.error("Report submission error:", error);
        toast.error(`Gagal mengirim laporan: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`);
      }
    });
  }

  const handleFileSubmit = () => {
    if (!file) {
      toast.error("Silakan pilih file terlebih dahulu");
      return;
    }
    
    if (!report.report_schedule_id) {
      console.error("Missing report_schedule_id:", report);
      toast.error("ID jadwal laporan tidak ditemukan. Silakan coba muat ulang halaman.");
      return;
    }
    
    const reportData = {
      report_schedule_id: report.report_schedule_id,
      title: reportTitle,
      report_type: report.report_type,
      file: file
    }
    console.log("REPORT TYPE", report.report_type);
    
    console.log("Submitting file report:", {
      ...reportData,
      file: file.name // Just log the file name, not the entire file object
    });
    
    submitReport(reportData, {
      onSuccess: (data) => {
        console.log("File submission success:", data);
        toast.success("Laporan berhasil diunggah!");
        setFile(null);
        // Refresh data after successful submission
        if (refetch) {
          setTimeout(() => refetch(), 500);
        }
      },
      onError: (error) => {
        console.error("File submission error:", error);
        toast.error(`Gagal mengunggah laporan: ${error instanceof Error ? error.message : "Terjadi kesalahan"}`);
      }
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }
  
  const handleDownloadFile = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!report.file_storage_id) {
      toast.error("File ID tidak ditemukan");
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // If we don't have the link yet, fetch it
      if (!fileData?.url) {
        await refetchFileLink();
      }
      
      // Now check if we have the URL
      if (fileData?.url) {
        // Create a temporary anchor element to trigger the download
        const link = window.document.createElement('a');
        link.href = fileData.url;
        link.target = '_blank';
        link.download = `report-${report.id}.pdf`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        toast.success("Unduhan dimulai");
      } else {
        toast.error("Gagal mendapatkan link unduhan. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Gagal mengunduh file. Silakan coba lagi nanti.");
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleOpenFileInNewTab = () => {
    if (!report.file_storage_id) {
      toast.error("File ID tidak ditemukan");
      return;
    }
    
    if (fileData?.url) {
      window.open(fileData.url, '_blank');
    } else {
      toast.error("Gagal mendapatkan link file. Silakan coba lagi.");
      refetchFileLink();
    }
  };

  // Get background gradient color based on status
  const getStatusColor = () => {
    switch (report.status) {
      case "APPROVED":
        return "from-green-600 to-green-700"
      case "REJECTED":
        return "from-red-600 to-red-700"
      case "PENDING":
        return "from-yellow-600 to-yellow-700"
      default:
        return "from-[#003478] to-[#003478]/90"
    }
  }

  // Get status badge style
  const getStatusBadge = () => {
    switch (report.status) {
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Disetujui
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Ditolak
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Sedang Diproses
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-white text-[#003478] border-white">
            {report.report ? "Submitted" : "Not Submitted"}
          </Badge>
        )
    }
  }

  // Check if submission is allowed
  const isSubmissionAllowed = () => {
    return report.status !== "APPROVED" && report.status !== "PENDING"
  }

  return (
    <>
      <Card className="border overflow-hidden">
        <div className={`bg-gradient-to-r ${getStatusColor()} text-white p-4`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">
                {report.report_type === "WEEKLY_REPORT" ? `Laporan Minggu ${report.week}` : "Laporan Akhir"}
              </h3>
              <div className="flex items-center text-white/80 text-sm space-x-2 mt-1">
                <Clock className="h-4 w-4" />
                <span>
                  Periode: {formatDate(report.start_date)} - {formatDate(report.end_date)}
                </span>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <CardContent className="p-6">
          {report.status === "REJECTED" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Laporan ditolak oleh pembimbing akademik</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                    onClick={() => setIsReportDetailOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                    Lihat Laporan
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-700 border-red-200 hover:bg-red-50 flex items-center gap-1"
                    onClick={() => setIsFeedbackOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Lihat Feedback
                  </Button>
                </div>
              </div>
            </div>
          )}

          {report.status === "APPROVED" && (
            <div className="p-6 flex flex-col items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium text-gray-800">Laporan Telah Disetujui</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Laporan ini telah disetujui oleh pembimbing akademik
              </p>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                  onClick={() => setIsReportDetailOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  Lihat Laporan
                </Button>
                {report.file_storage_id && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-1"
                    onClick={handleDownloadFile}
                    disabled={isDownloading || isFileLoading}
                  >
                    {isDownloading || isFileLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Unduh Laporan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {report.status === "PENDING" && (
            <div className="p-6 flex flex-col items-center justify-center">
              <Clock className="h-12 w-12 text-orange-500 mb-2" />
              <h3 className="text-lg font-medium text-gray-800">Laporan Dalam Proses Pengecekan</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                Laporan masih dalam pengecekan oleh pembimbing akademik
              </p>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                  onClick={() => setIsReportDetailOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  Lihat Laporan
                </Button>
                {report.file_storage_id && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-1"
                    onClick={handleDownloadFile}
                    disabled={isDownloading || isFileLoading}
                  >
                    {isDownloading || isFileLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Mengunduh...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Unduh Laporan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {report.status !== "APPROVED" && report.status !== "PENDING" && (
            <Tabs
              defaultValue="text"
              value={submissionType}
              onValueChange={(value) => setSubmissionType(value as "text" | "file")}
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2" disabled={!isSubmissionAllowed()}>
                  <Type className="h-4 w-4" />
                  <span>Ketik Laporan</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2" disabled={!isSubmissionAllowed()}>
                  <FileUp className="h-4 w-4" />
                  <span>Upload Dokumen</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Judul Laporan"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="mb-2"
                      disabled={!isSubmissionAllowed()}
                    />
                  </div>
                  <Textarea
                    placeholder={
                      report.report_type === "WEEKLY_REPORT"
                        ? `Ketik laporan minggu ke-${report.week} Anda di sini...`
                        : "Ketik laporan akhir Anda di sini..."
                    }
                    rows={8}
                    value={textReport}
                    onChange={(e) => setTextReport(e.target.value)}
                    className="resize-none"
                    disabled={!isSubmissionAllowed()}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleTextSubmit}
                    className="bg-[#003478] hover:bg-[#00275a] text-white"
                    disabled={!textReport || isSubmitting || !isSubmissionAllowed()}
                  >
                    {isSubmitting ? "Menyimpan..." : "Submit Laporan"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="mb-3">
                  <Input
                    placeholder="Judul Laporan"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    disabled={!isSubmissionAllowed()}
                  />
                </div>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${!isSubmissionAllowed() ? 'opacity-60' : ''}`}>
                  <div className="mb-4 flex justify-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="mb-2 text-sm">Drag & drop dokumen laporan Anda di sini, atau klik untuk memilih file</p>
                  <p className="text-xs text-gray-500">Dukung format PDF, DOCX, atau TXT (Max. 10MB)</p>

                  <div className="mt-4">
                    <Input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id={`file-upload-${report.id}`}
                      disabled={!isSubmissionAllowed()}
                    />
                    <label htmlFor={`file-upload-${report.id}`}>
                      <Button variant="outline" className="cursor-pointer" asChild disabled={!isSubmissionAllowed()}>
                        <span>Pilih File</span>
                      </Button>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 text-left bg-gray-50 p-3 rounded-md text-sm flex justify-between items-center">
                      <div className="flex items-center">
                        <FileUp className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <button 
                        className="text-red-500 hover:text-red-700" 
                        onClick={() => setFile(null)}
                        disabled={!isSubmissionAllowed()}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleFileSubmit}
                    className="bg-[#003478] hover:bg-[#00275a] text-white"
                    disabled={!file || isSubmitting || !isSubmissionAllowed() || !reportTitle}
                  >
                    {isSubmitting ? "Mengunggah..." : "Upload Laporan"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-md bg-white z-[100]">
          <DialogHeader>
            <DialogTitle>Feedback Pembimbing</DialogTitle>
            <DialogDescription>
              Feedback untuk laporan {report.report_type === "WEEKLY_REPORT" ? `minggu ke-${report.week}` : "akhir"}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md border">
            <p className="text-gray-700">
              {report.feedback || "Tidak ada feedback yang diberikan."}
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => setIsFeedbackOpen(false)}
              className="bg-[#003478] hover:bg-[#00275a] text-white"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Detail Dialog */}
      <Dialog open={isReportDetailOpen} onOpenChange={setIsReportDetailOpen}>
        <DialogContent className="max-w-2xl bg-white z-[200]">
          <DialogHeader>
            <DialogTitle>Detail Laporan</DialogTitle>
            <DialogDescription>
              {report.report_type === "WEEKLY_REPORT" ? `Laporan Minggu ke-${report.week}` : "Laporan Akhir"} - 
              Periode: {formatDate(report.start_date)} - {formatDate(report.end_date)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">
                {report.status === "APPROVED" ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Disetujui
                  </Badge>
                ) : report.status === "PENDING" ? (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Sedang Diproses
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                    Ditolak
                  </Badge>
                )}
              </div>
            </div>
            
            {report.report && !report.file_storage_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Isi Laporan</h3>
                <div className="mt-1 p-4 bg-gray-50 rounded-md border max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-line">
                    {report.report}
                  </p>
                </div>
              </div>
            )}
            
            {report.file_storage_id && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-md border text-center">
                  {isFileLoading ? (
                    <div className="py-8 flex flex-col items-center">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-gray-500">Memuat dokumen...</p>
                    </div>
                  ) : fileError ? (
                    <div className="py-8 flex flex-col items-center">
                      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                      <p className="text-gray-700 mb-2">Gagal memuat dokumen</p>
                      <p className="text-gray-500 text-sm mb-4">Terjadi kesalahan saat mengambil file.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => refetchFileLink()}
                        className="bg-white hover:bg-gray-50"
                      >
                        Coba Lagi
                      </Button>
                    </div>
                  ) : fileData?.url ? (
                    <>
                      {fileData.url.toLowerCase().endsWith('.pdf') ? (
                        <div className="flex flex-col items-center">
                          <div className="w-full h-96 border rounded mb-4">
                            <iframe 
                              src={fileData.url} 
                              className="w-full h-full" 
                              title="PDF Preview"
                            />
                          </div>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={handleOpenFileInNewTab}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Buka di Tab Baru</span>
                            </Button>
                            
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                              onClick={handleDownloadFile}
                            >
                              <Download className="h-4 w-4" />
                              <span>Unduh Dokumen</span>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 flex flex-col items-center">
                          <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-700 mb-2">Dokumen tidak dapat ditampilkan</p>
                          <p className="text-gray-500 text-sm mb-4">Tipe file ini tidak dapat ditampilkan secara langsung.</p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={handleOpenFileInNewTab}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Buka di Tab Baru</span>
                            </Button>
                            
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                              onClick={handleDownloadFile}
                            >
                              <Download className="h-4 w-4" />
                              <span>Unduh Dokumen</span>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {fileData.expired_at && (
                        <p className="text-xs text-gray-500 mt-4">
                          Link kedaluwarsa: {new Date(fileData.expired_at).toLocaleString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">Dokumen tidak tersedia</p>
                      <p className="text-gray-500 text-sm mb-4">Tidak dapat mengambil link dokumen.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => refetchFileLink()}
                        className="bg-white hover:bg-gray-50"
                      >
                        Coba Lagi
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {report.status === "REJECTED" && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Feedback Pembimbing</h3>
                <div className="mt-1 p-4 bg-red-50 rounded-md border">
                  <p className="text-gray-700">
                    {report.feedback || "Tidak ada feedback yang diberikan."}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsReportDetailOpen(false)}
              className="bg-[#003478] hover:bg-[#00275a] text-white"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
