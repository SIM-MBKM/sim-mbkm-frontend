import { useState } from "react";
import { Plus, Save, Loader2, X } from "lucide-react";

// Use your existing provider
import { useReportAPI } from "@/lib/api/providers/report-provider";

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

// Create Report Dialog Component
interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateReportDialog({ open, onOpenChange }: CreateReportDialogProps) {
  const { createReport, isFormSubmitting } = useReportAPI();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    endpoints: [""],
    fields: [""],
    is_scheduled: false,
    schedule_frequency: "" as "daily" | "weekly" | "monthly" | "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      endpoints: [""],
      fields: [""],
      is_scheduled: false,
      schedule_frequency: "",
    });
  };

  const handleSubmit = async () => {
    try {
      // Filter out empty values from arrays
      const cleanedData = {
        ...formData,
        endpoints: formData.endpoints.filter((endpoint) => endpoint.trim() !== ""),
        fields: formData.fields.filter((field) => field.trim() !== ""),
        schedule_frequency: formData.is_scheduled ? formData.schedule_frequency || undefined : undefined,
      };

      await createReport(cleanedData);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const isValid =
    formData.name.trim() !== "" &&
    formData.endpoints.some((endpoint) => endpoint.trim() !== "") &&
    formData.fields.some((field) => field.trim() !== "") &&
    (!formData.is_scheduled || formData.schedule_frequency !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Plus className="h-5 w-5 text-blue-600" />
            Create New Report
          </DialogTitle>
          <DialogDescription>
            Create a new report by configuring the settings below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Report Name *</Label>
              <Input
                id="create-name"
                placeholder="Enter report name..."
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
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
              id="create-endpoints"
            />

            <DynamicArrayInput
              label="Fields *"
              placeholder="Enter field name..."
              values={formData.fields}
              onChange={(fields) => setFormData((prev) => ({ ...prev, fields }))}
              id="create-fields"
            />
          </div>

          {/* Scheduling */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="create-scheduled"
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
              <Label htmlFor="create-scheduled">Enable Scheduling</Label>
            </div>

            {formData.is_scheduled && (
              <div className="space-y-2">
                <Label htmlFor="create-frequency">Schedule Frequency *</Label>
                <Select
                  id="create-frequency"
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

          {/* Form Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tips for creating reports:</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Endpoints should be valid API URLs that your system can access</li>
                    <li>Fields define what data points you want to extract from the endpoints</li>
                    <li>Scheduled reports will run automatically at the specified frequency</li>
                    <li>You can always edit these settings later</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isFormSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isFormSubmitting || !isValid}>
            {isFormSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
