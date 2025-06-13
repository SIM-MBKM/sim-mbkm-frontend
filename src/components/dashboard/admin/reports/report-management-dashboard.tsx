"use client";

import { useState, useCallback, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileX,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";

// Import the REAL provider instead of mock
import { useReportAPI } from "@/lib/api/providers/report-provider";

// UI Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${
        sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default
      } ${className} gap-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  placeholder,
  value,
  onChange,
  className = "",
  id,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}) => (
  <input
    id={id}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      variant === "outline" ? "border border-gray-300 text-gray-700 bg-white" : "bg-blue-100 text-blue-800"
    } ${className}`}
  >
    {children}
  </span>
);

// Modal/Dialog Component
const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);
const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-semibold flex items-center gap-2">{children}</h2>
);
const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 mt-2">{children}</p>
);
const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">{children}</div>
);

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
  isLoading = false,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
  isLoading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">Loading...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold">{value}</h3>
                  {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                      <BarChart3 className="h-3 w-3" />
                      {Math.abs(trend)}%
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Report Results Dialog - Now uses REAL provider functions
function ReportResultsDialog({
  open,
  onOpenChange,
  report,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any;
}) {
  // Use the provider data
  const {
    selectedReportResults,
    isLoadingSelectedResults,
    exportReportResult,
    downloadReportResult,
    setSelectedReportId,
  } = useReportAPI();

  const [loadingExport, setLoadingExport] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);

  // Set the selected report when dialog opens
  useEffect(() => {
    if (open && report) {
      setSelectedReportId(report.id);
    } else if (!open) {
      setSelectedReportId(undefined);
    }
  }, [open, report, setSelectedReportId]);

  // REAL export function using the provider
  const handleExport = async (resultId: string) => {
    setLoadingExport(resultId);
    try {
      await exportReportResult(resultId);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoadingExport(null);
    }
  };

  // REAL download function using the provider
  const handleDownload = async (resultId: string) => {
    setLoadingDownload(resultId);
    try {
      await downloadReportResult(resultId);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoadingDownload(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Report Results: {report?.name}
          </DialogTitle>
          <DialogDescription>View and manage results generated from this report.</DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {isLoadingSelectedResults ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading results...
            </div>
          ) : !selectedReportResults || selectedReportResults.length === 0 ? (
            <div className="text-center py-8">
              <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No results found for this report.</p>
              <p className="text-sm text-gray-400">Generate the report to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedReportResults.map((result) => (
                <Card key={result.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Result #{result.id.slice(-8)}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(result.created_at).toLocaleDateString()}
                        </p>
                        <Badge variant="outline">{result.export_count} exports</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(result.id)}
                          disabled={loadingDownload === result.id}
                        >
                          {loadingDownload === result.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(result.id)}
                          disabled={loadingExport === result.id}
                        >
                          {loadingExport === result.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Confirm Delete Dialog - Now uses REAL delete function
function ConfirmDeleteDialog({
  reportName,
  onConfirm,
  trigger,
}: {
  reportName: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteResults, setDeleteResults] = useState(true);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Delete Report
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this report? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium">Report: {reportName}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="deleteResults"
                  checked={deleteResults}
                  onChange={(e) => setDeleteResults(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="deleteResults" className="text-sm">
                  Also delete all report results and exports
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onConfirm();
                  setIsOpen(false);
                }}
              >
                Delete Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Report Card Component - Now uses REAL provider functions
function ReportCard({ report }: { report: any }) {
  // Use the provider functions
  const {
    generateReport,
    deleteReport,
    isFormSubmitting,
    setSelectedReportForEdit,
    setEditDialogOpen,
    setSelectedReportForResults,
    setResultsDialogOpen,
  } = useReportAPI();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // REAL generate function
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateReport(report.id);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // REAL edit function using provider
  const handleEdit = () => {
    console.log("Opening edit dialog for:", report.name);
    setSelectedReportForEdit(report);
    setEditDialogOpen(true);
  };

  // REAL view results function using provider
  const handleViewResults = () => {
    console.log("Opening results dialog for:", report.name);
    setSelectedReportForResults(report);
    setResultsDialogOpen(true);
  };

  // REAL delete function with cascade option
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReport(report.id, true); // Delete with results
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{report.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{report.description || "No description"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Created:</span>
            <span className="font-medium">{new Date(report.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Results:</span>
            <span className="font-medium">{report.resultsCount || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Exports:</span>
            <span className="font-medium">{report.totalExports || 0}</span>
          </div>
          {report.lastGenerated && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Generated:</span>
              <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="default" size="sm" onClick={handleGenerate} disabled={isGenerating || isFormSubmitting}>
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleViewResults}>
            <Eye className="h-4 w-4" />
            Results ({report.resultsCount || 0})
          </Button>

          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <ConfirmDeleteDialog
            reportName={report.name}
            onConfirm={handleDelete}
            trigger={
              <Button variant="destructive" size="sm" disabled={isDeleting || isFormSubmitting}>
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component - Now uses REAL provider
export default function RealReportDashboard() {
  // Use the provider that simulates real API functions
  const {
    reports,
    reportsWithResults,
    isLoading,
    reportStats,
    isLoadingStats,
    searchTerm,
    setSearchTerm,
    refreshReports,
    refreshStats,
    clearFilters,
    reportsPagination,
    createDialogOpen,
    setCreateDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    resultsDialogOpen,
    setResultsDialogOpen,
    selectedReportForEdit,
    selectedReportForResults,
  } = useReportAPI();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Dashboard</h1>
          <p className="text-gray-500">Create, manage, and generate your reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={refreshStats}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Stats Cards - Now using REAL statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value={reportStats.total}
          description="All reports created"
          icon={FileText}
          color="bg-blue-500"
          isLoading={isLoadingStats}
        />
        <StatsCard
          title="Generated Today"
          value={reportStats.generatedToday}
          description="Reports generated today"
          icon={Play}
          color="bg-green-500"
          isLoading={isLoadingStats}
        />
        <StatsCard
          title="Total Results"
          value={reportStats.totalResults}
          description="Report results stored"
          icon={BarChart3}
          color="bg-orange-500"
          isLoading={isLoadingStats}
        />
        <StatsCard
          title="Total Exports"
          value={reportStats.totalExports}
          description="Files exported"
          icon={Download}
          color="bg-purple-500"
          isLoading={isLoadingStats}
        />
      </div>

      {/* Search - Now working with REAL provider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search Reports</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by report name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // FIXED: Now actually sets search term
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid - Now with REAL loading states */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reports</h2>
          <div className="text-sm text-gray-500">
            {reportsPagination.totalItems} total reports
            {searchTerm && ` (filtered by "${searchTerm}")`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reportsWithResults.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No reports found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "No reports match your current search. Try adjusting your search terms."
                  : "Get started by creating your first report."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Your First Report
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportsWithResults.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* REAL dialogs using provider state */}
      <ReportResultsDialog
        open={resultsDialogOpen}
        onOpenChange={setResultsDialogOpen}
        report={selectedReportForResults}
      />
    </div>
  );
}
