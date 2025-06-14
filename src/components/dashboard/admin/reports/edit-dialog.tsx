import { useState, useEffect } from "react";
import { Edit, Save, Loader2, Plus, X } from "lucide-react";

// Use your existing provider and hooks
import { useReportAPI } from "@/lib/api/providers/report-provider";
import { useReport } from "@/lib/api/hooks/use-query-hooks";

// Your existing UI components with proper TypeScript types
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
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

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

const Input = ({ placeholder, value, onChange, className = "", id }: InputProps) => (
  <input
    id={id}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
  />
);

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  id?: string;
  rows?: number;
}

const Textarea = ({ placeholder, value, onChange, className = "", id, rows = 3 }: TextareaProps) => (
  <textarea
    id={id}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${className}`}
  />
);

interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const Select = ({ value, onChange, children, className = "", id }: SelectProps) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
  >
    {children}
  </select>
);

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label = ({ children, htmlFor }: LabelProps) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none gap-2";
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
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Dynamic Array Input Component
interface DynamicArrayInputProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  id: string;
}

const DynamicArrayInput = ({ label, placeholder, values, onChange, id }: DynamicArrayInputProps) => {
  const addItem = () => {
    onChange([...values, ""]);
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1"
            />
            <Button variant="destructive" size="sm" onClick={() => removeItem(index)} disabled={values.length === 1}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="w-full">
          <Plus className="h-4 w-4" />
          Add {label.slice(0, -1)} {/* Remove 's' from label */}
        </Button>
      </div>
    </div>
  );
};

// Edit Report Dialog Component
interface EditReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: any; // Use your actual report type here
}

export default function EditReportDialog({ open, onOpenChange, report }: EditReportDialogProps) {
  const { updateReport, isFormSubmitting } = useReportAPI();

  // Fetch full report details to get endpoints and fields
  const { data: fullReportData, isLoading: isLoadingReport } = useReport(report?.id);
  const fullReport = fullReportData?.data;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoints: [""],
    fields: [""],
    is_scheduled: false,
    schedule_frequency: "" as "daily" | "weekly" | "monthly" | "",
  });

  // Initialize form when dialog opens and data is loaded
  useEffect(() => {
    if (open && fullReport) {
      setFormData({
        name: fullReport.name || "",
        description: fullReport.description || "",
        endpoints: fullReport.endpoints?.length > 0 ? fullReport.endpoints : [""],
        fields: fullReport.fields?.length > 0 ? fullReport.fields : [""],
        is_scheduled: fullReport.is_scheduled || false,
        schedule_frequency: fullReport.schedule_frequency || "daily",
      });
    }
  }, [open, fullReport]);

  const handleSubmit = async () => {
    if (!report) return;

    try {
      // Filter out empty values from arrays
      const cleanedData = {
        ...formData,
        endpoints: formData.endpoints.filter((endpoint) => endpoint.trim() !== ""),
        fields: formData.fields.filter((field) => field.trim() !== ""),
        schedule_frequency: formData.is_scheduled ? formData.schedule_frequency || null : null,
      };

      await updateReport(report.id, cleanedData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form to original values
    if (fullReport) {
      setFormData({
        name: fullReport.name || "",
        description: fullReport.description || "",
        endpoints: fullReport.endpoints?.length > 0 ? fullReport.endpoints : [""],
        fields: fullReport.fields?.length > 0 ? fullReport.fields : [""],
        is_scheduled: fullReport.is_scheduled || false,
        schedule_frequency: fullReport.schedule_frequency || "",
      });
    }
  };

  const isValid =
    formData.name.trim() !== "" &&
    formData.endpoints.some((endpoint) => endpoint.trim() !== "") &&
    formData.fields.some((field) => field.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Report
          </DialogTitle>
          <DialogDescription>Update the report details below. All fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {isLoadingReport ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading report details...
            </div>
          ) : (
            <>
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Report Name *</Label>
                  <Input
                    id="edit-name"
                    placeholder="Enter report name..."
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Enter report description..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Endpoints and Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DynamicArrayInput
                  label="Endpoints *"
                  placeholder="Enter endpoint URL..."
                  values={formData.endpoints}
                  onChange={(endpoints) => setFormData((prev) => ({ ...prev, endpoints }))}
                  id="edit-endpoints"
                />

                <DynamicArrayInput
                  label="Fields *"
                  placeholder="Enter field name..."
                  values={formData.fields}
                  onChange={(fields) => setFormData((prev) => ({ ...prev, fields }))}
                  id="edit-fields"
                />
              </div>

              {/* Scheduling */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-scheduled"
                    checked={formData.is_scheduled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_scheduled: e.target.checked,
                        schedule_frequency: e.target.checked ? prev.schedule_frequency : "",
                      }))
                    }
                    className="rounded"
                  />
                  <Label htmlFor="edit-scheduled">Enable Scheduling</Label>
                </div>

                {formData.is_scheduled && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-frequency">Schedule Frequency</Label>
                    <Select
                      id="edit-frequency"
                      value={formData.schedule_frequency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          schedule_frequency: e.target.value as "daily" | "weekly" | "monthly" | "",
                        }))
                      }
                    >
                      <option value="">Select frequency...</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </div>
                )}
              </div>

              {/* Report Info */}
              {fullReport && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span>{new Date(fullReport.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>{new Date(fullReport.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Results:</span>
                    <span>{fullReport.results?.length || 0}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isFormSubmitting || isLoadingReport}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isFormSubmitting || isLoadingReport || !isValid}>
            {isFormSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
