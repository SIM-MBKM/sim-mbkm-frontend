"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Import your hooks
import {
  useReports,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
  useGenerateReport,
  useReportResults,
  useExportReportResult,
  useDownloadReportResult,
} from "@/lib/api/hooks/use-query-hooks";

// Import toast
import useToast from "@/lib/api/hooks/use-toast";

// Types
import type {
  ReportListItem,
  Report,
  ReportResult,
  CreateReportRequest,
  UpdateReportRequest,
  ReportResultListItem,
} from "@/lib/api/services/report-service";

// Simplified mock data structure - one endpoint per report
const AVAILABLE_SERVICES = {
  user_management: {
    name: "User Management",
    description: "User data and management information",
    endpoints: [
      {
        path: "/api/v1/user/service/users",
        name: "All Users",
        description: "Retrieve all user data",
        fields: ["id", "name", "email"],
      },
    ],
  },
  activity_management: {
    name: "Activity Management",
    description: "Activity and program information",
    endpoints: [
      {
        path: "/api/v1/activities",
        name: "All Activities",
        description: "Retrieve all activity data",
        fields: ["id", "title", "description", "start_date", "end_date", "status", "auth_user_id", "location"],
      },
      {
        path: "/api/v1/activities/programs",
        name: "Program Activities",
        description: "Retrieve program-specific activities",
        fields: ["id", "program_type", "level", "group", "capacity", "auth_user_id"],
      },
    ],
  },
  registration_management: {
    name: "Registration Management",
    description: "Student registration information",
    endpoints: [
      {
        path: "/api/v1/registrations",
        name: "All Registrations",
        description: "Retrieve all registration data",
        fields: ["id", "student_id", "activity_id", "status", "created_at", "approved_at", "notes"],
      },
    ],
  },
  evaluation_management: {
    name: "Evaluation Management",
    description: "Evaluation and assessment data",
    endpoints: [
      {
        path: "/api/v1/evaluations",
        name: "All Evaluations",
        description: "Retrieve all evaluation data",
        fields: ["id", "student_id", "evaluator_id", "score", "grade", "feedback", "status"],
      },
    ],
  },
};

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="relative overflow-hidden bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{value}</h3>
                {trend !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                    <BarChart3 className="h-3 w-3" />
                    {Math.abs(trend)}%
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Simplified CreateReportDialog component
function CreateReportDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<CreateReportRequest>>({
    name: "",
    description: "",
    endpoints: [],
    fields: [],
  });

  const createReport = useCreateReport();
  const { toast } = useToast();

  // Reset selections when service changes
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setSelectedEndpoint("");
    setSelectedFields([]);
  };

  // Reset field selections when endpoint changes
  const handleEndpointChange = (endpointPath: string) => {
    setSelectedEndpoint(endpointPath);
    setSelectedFields([]);
  };

  // Handle field selection
  const handleFieldChange = (fieldName: string, checked: boolean) => {
    setSelectedFields((prev) => {
      if (checked) {
        return prev.includes(fieldName) ? prev : [...prev, fieldName];
      } else {
        return prev.filter((field) => field !== fieldName);
      }
    });
  };

  // Get selected service object
  const getSelectedService = () => {
    if (!selectedService) return null;
    return AVAILABLE_SERVICES[selectedService as keyof typeof AVAILABLE_SERVICES];
  };

  // Get selected endpoint object
  const getSelectedEndpoint = () => {
    const service = getSelectedService();
    if (!service || !selectedEndpoint) return null;
    return service.endpoints.find((ep) => ep.path === selectedEndpoint);
  };

  // Check if field is selected
  const isFieldSelected = (fieldName: string) => {
    return selectedFields.includes(fieldName);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      endpoints: [],
      fields: [],
    });
    setSelectedService("");
    setSelectedEndpoint("");
    setSelectedFields([]);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !selectedService || !selectedEndpoint || selectedFields.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one field.",
        variant: "warning",
      });
      return;
    }

    // Build API request
    const endpointString = `${selectedService}:${selectedEndpoint}`;
    const fieldsWithPrefix = selectedFields.map((field) => `${selectedService}.${field}`);

    try {
      const reportRequest: CreateReportRequest = {
        name: formData.name,
        description: formData.description || "",
        endpoints: [endpointString],
        fields: fieldsWithPrefix,
        is_scheduled: false,
      };

      console.log("Creating report with data:", reportRequest); // Debug log

      await createReport.mutateAsync(reportRequest);

      toast({
        title: "Success",
        description: `Report "${formData.name}" has been created successfully.`,
        variant: "success",
      });

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating report:", error);
      toast({
        title: "Error",
        description: "Failed to create report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Report
          </DialogTitle>
          <DialogDescription>
            Create a focused report from a single data source. Select a service, endpoint, and the fields you want to
            include.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name *</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Describe what this report contains..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* Horizontal Service & Endpoint Selection */}
          <div className="space-y-3">
            <Label>Select Data Service & Endpoint *</Label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Selection Column */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Data Services</h4>
                <div className="space-y-3">
                  {Object.entries(AVAILABLE_SERVICES).map(([serviceId, service]) => (
                    <Card
                      key={serviceId}
                      className={`border cursor-pointer transition-all ${
                        selectedService === serviceId
                          ? "border-primary border-2 bg-primary/10 shadow-lg ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => handleServiceChange(serviceId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedService === serviceId ? "bg-primary border-primary" : "border-gray-300"
                            }`}
                          >
                            {selectedService === serviceId && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${selectedService === serviceId ? "text-primary" : ""}`}>
                              {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <p className="text-xs text-primary mt-1">
                              {service.endpoints.length} endpoint(s) available
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Endpoint Selection Column */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {selectedService ? "Available Endpoints" : "Select a service first"}
                </h4>
                {selectedService ? (
                  <div className="space-y-3">
                    {getSelectedService()?.endpoints.map((endpoint) => (
                      <Card
                        key={endpoint.path}
                        className={`border cursor-pointer transition-all ${
                          selectedEndpoint === endpoint.path
                            ? "border-primary border-2 bg-primary/10 shadow-lg ring-2 ring-primary/20"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                        onClick={() => handleEndpointChange(endpoint.path)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                                selectedEndpoint === endpoint.path ? "bg-primary border-primary" : "border-gray-300"
                              }`}
                            >
                              {selectedEndpoint === endpoint.path && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h4
                                  className={`font-medium ${selectedEndpoint === endpoint.path ? "text-primary" : ""}`}
                                >
                                  {endpoint.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                                <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded mt-2 inline-block">
                                  {selectedService}:{endpoint.path}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {endpoint.fields.map((field) => (
                                  <Badge
                                    key={field}
                                    variant={selectedEndpoint === endpoint.path ? "default" : "outline"}
                                    className="text-xs"
                                  >
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-muted-foreground text-sm">Choose a data service to see available endpoints</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Field Selection */}
          {selectedEndpoint && (
            <div className="space-y-3">
              <Label>Select Fields to Include *</Label>
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{getSelectedEndpoint()?.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {selectedFields.length} of {getSelectedEndpoint()?.fields.length} fields selected
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {getSelectedEndpoint()?.fields.map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={`field-${field}`}
                            checked={isFieldSelected(field)}
                            onCheckedChange={(checked) => handleFieldChange(field, checked as boolean)}
                          />
                          <Label htmlFor={`field-${field}`} className="text-sm cursor-pointer flex-1">
                            <span className="font-mono text-primary">{selectedService}.</span>
                            <span>{field}</span>
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFields(getSelectedEndpoint()?.fields || [])}
                      >
                        Select All
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedFields([])}>
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Selected Summary */}
          {selectedFields.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Report Summary</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Service:</span> {getSelectedService()?.name}
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Endpoint:</span> {getSelectedEndpoint()?.name}
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Fields ({selectedFields.length}):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedFields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {selectedService}.{field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !formData.name ||
              !selectedService ||
              !selectedEndpoint ||
              selectedFields.length === 0 ||
              createReport.isLoading
            }
          >
            {createReport.isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Report Card Component
function ReportCard({
  report,
  onEdit,
  onDelete,
  onGenerate,
  onViewResults,
}: {
  report: ReportListItem;
  onEdit: (report: ReportListItem) => void;
  onDelete: (id: string) => void;
  onGenerate: (id: string) => void;
  onViewResults: (report: ReportListItem) => void;
}) {
  const generateReport = useGenerateReport();
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      await generateReport.mutateAsync(report.id);
      toast({
        title: "Success",
        description: `Report "${report.name}" has been generated successfully.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: `Failed to generate report "${report.name}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{report.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{report.description || "No description"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{new Date(report.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={handleGenerate}
              disabled={generateReport.isLoading}
            >
              {generateReport.isLoading ? (
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

            <Button variant="outline" size="sm" className="gap-2" onClick={() => onViewResults(report)}>
              <Eye className="h-4 w-4" />
              Results
            </Button>

            <Button variant="outline" size="sm" className="gap-2" onClick={() => onEdit(report)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Delete Report
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this report? This action cannot be undone and will permanently
                    remove all associated data and results.
                    <br />
                    <br />
                    <strong>Report:</strong> {report.name}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(report.id)} className="bg-red-600 hover:bg-red-700">
                    Delete Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Report Results Dialog
function ReportResultsDialog({
  report,
  open,
  onOpenChange,
}: {
  report: ReportListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedResult, setSelectedResult] = useState<ReportResultListItem | null>(null);

  const { data: resultsData, isLoading: resultsLoading } = useReportResults(report?.id, { page: 1, per_page: 50 });

  const exportResult = useExportReportResult();
  const downloadResult = useDownloadReportResult();
  const { toast } = useToast();

  const handleExport = async (resultId: string) => {
    try {
      await exportResult.mutateAsync({
        resultId,
        data: {
          report_result_id: resultId,
          format: "pdf",
        },
      });
      toast({
        title: "Success",
        description: "Report result has been exported successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error exporting result:", error);
      toast({
        title: "Error",
        description: "Failed to export report result. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (resultId: string) => {
    try {
      const response = await downloadResult.mutateAsync(resultId);
      // Open the download URL in a new tab for viewing
      window.open(response.data.download_url, "_blank");
      toast({
        title: "Success",
        description: "Report is now opening in a new tab for viewing.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error getting download URL:", error);
      toast({
        title: "Error",
        description: "Failed to get download URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Report Results: {report.name}
          </DialogTitle>
          <DialogDescription>View and manage results generated from this report.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {resultsLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading results...
            </div>
          ) : resultsData?.data.length === 0 ? (
            <div className="text-center py-8">
              <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found for this report.</p>
              <p className="text-sm text-muted-foreground">Generate the report to see results here.</p>
            </div>
          ) : (
            <ScrollArea className="h-96 w-full">
              <div className="space-y-3">
                {resultsData?.data.map((result) => (
                  <Card key={result.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">Result #{result.id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(result.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{result.export_count} exports</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(result.id)}
                            disabled={downloadResult.isLoading}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(result.id)}
                            disabled={exportResult.isLoading}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
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

// Main Dashboard Component
export function ReportDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReportForResults, setSelectedReportForResults] = useState<ReportListItem | null>(null);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);

  // Build filters for the query
  const filters = {
    name: searchQuery || undefined,
  };

  const { data: reportsData, isLoading: reportsLoading } = useReports({
    page: 1,
    per_page: 20,
    ...filters,
  });

  const deleteReport = useDeleteReport();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const reportToDelete = reportsData?.data.find((r) => r.id === id);
      await deleteReport.mutateAsync(id);
      toast({
        title: "Success",
        description: `Report "${reportToDelete?.name || "Unknown"}" has been deleted successfully.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (report: ReportListItem) => {
    // Implement edit functionality
    console.log("Edit report:", report);
  };

  const handleViewResults = (report: ReportListItem) => {
    setSelectedReportForResults(report);
    setResultsDialogOpen(true);
  };

  const totalReports = reportsData?.total || 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report Dashboard</h1>
          <p className="text-muted-foreground">Create, manage, and generate your reports</p>
        </div>
        <CreateReportDialog
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value={totalReports}
          description="All reports created"
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Recent Generations"
          value="0"
          description="Reports generated today"
          icon={Play}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Results"
          value="0"
          description="Report results stored"
          icon={BarChart3}
          color="bg-orange-500"
        />
        <StatsCard
          title="Exports Created"
          value="0"
          description="Files exported"
          icon={Download}
          color="bg-purple-500"
        />
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by report name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reports</h2>
          <div className="text-sm text-muted-foreground">{reportsData?.total || 0} total reports</div>
        </div>

        {reportsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
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
        ) : reportsData?.data.length === 0 ? (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-12 text-center">
              <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No reports match your current search. Try adjusting your search terms."
                  : "Get started by creating your first report."}
              </p>
              {!searchQuery && (
                <CreateReportDialog
                  trigger={
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Report
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportsData?.data.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGenerate={(id) => console.log("Generate:", id)}
                onViewResults={handleViewResults}
              />
            ))}
          </div>
        )}
      </div>

      {/* Report Results Dialog */}
      <ReportResultsDialog
        report={selectedReportForResults}
        open={resultsDialogOpen}
        onOpenChange={setResultsDialogOpen}
      />
    </div>
  );
}
