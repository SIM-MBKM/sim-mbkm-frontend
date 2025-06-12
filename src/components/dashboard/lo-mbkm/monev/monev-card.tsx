"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  BookCheck,
  CheckCircle,
  AlertTriangle,
  UserX,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  AlertCircleIcon,
  Ban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { UserAlt } from "@/lib/api/services";
import { Registration } from "@/lib/api/services/registration-service";
import type { EvaluationList } from "@/lib/api/services/monev-service";
import { EvaluationUpdateDialog } from "./evaluation-update-dialog";

// Stats Card Component
export function StatsCard({
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
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{value}</h3>
              {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-3 w-3" />
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
  );
}

export function EvaluationViewDialog({
  evaluation,
  mahasiswaUsers,
  dosenPemonevUsers,
  trigger,
}: {
  evaluation: EvaluationList;
  mahasiswaUsers?: UserAlt[];
  dosenPemonevUsers?: UserAlt[];
  trigger: React.ReactNode;
}) {
  const getMahasiswaName = (id: string) => {
    const mahasiswa = mahasiswaUsers?.find((m) => m.auth_user_id === id);
    return mahasiswa?.email || id.slice(-6);
  };

  const getDosenName = (id: string) => {
    const dosen = dosenPemonevUsers?.find((d) => d.auth_user_id === id);
    return dosen?.email || id.slice(-6);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Evaluation Details
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Evaluation ID</label>
                  <p className="text-sm font-mono">#{evaluation.id.slice(-8)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(evaluation.status)}>
                      {evaluation.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student</label>
                  <p className="text-sm">{getMahasiswaName(evaluation.mahasiswa_id)}</p>
                  <p className="text-xs text-gray-400 font-mono">ID: {evaluation.mahasiswa_id.slice(-8)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Dosen Pemonev</label>
                  <p className="text-sm">{getDosenName(evaluation.dosen_pemonev_id)}</p>
                  <p className="text-xs text-gray-400 font-mono">ID: {evaluation.dosen_pemonev_id.slice(-8)}</p>
                </div>

                {evaluation.registration_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration ID</label>
                    <p className="text-sm font-mono">#{evaluation.registration_id.slice(-8)}</p>
                  </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Evaluation Card Component
export function EvaluationCard({
  evaluation,
  onView,
  onEdit,
  onFinalize,
  onDelete,
  mahasiswaUsers,
  dosenPemonevUsers,
  selectedEvaluation,
  selectedEvaluationId,
  isLoadingSelected,
  onUpdate,
}: {
  evaluation: EvaluationList;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onFinalize: (id: string) => void;
  onDelete: (id: string) => void;
  mahasiswaUsers?: UserAlt[];
  dosenPemonevUsers?: UserAlt[];
  selectedEvaluation?: any;
  selectedEvaluationId?: string | null;
  isLoadingSelected?: boolean;
  onUpdate?: (updateData: any) => Promise<void>;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in_progress":
        return <BookCheck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Evaluation #{evaluation.id.slice(-6)}</h3>
                <p className="text-sm text-muted-foreground">Student: {evaluation.mahasiswa_id.slice(-6)}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(evaluation.status)} flex items-center gap-1`}>
              {getStatusIcon(evaluation.status)}
              {evaluation.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dosen Pemonev:</span>
              <span className="font-medium">{evaluation.dosen_pemonev_id.slice(-6)}</span>
            </div>
            {evaluation.registration_id && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration:</span>
                <span className="font-medium">#{evaluation.registration_id.slice(-6)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Updated View button with dialog */}
            <EvaluationViewDialog
              evaluation={evaluation}
              mahasiswaUsers={mahasiswaUsers}
              dosenPemonevUsers={dosenPemonevUsers}
              trigger={
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              }
            />

            {evaluation.status !== "completed" && onUpdate && mahasiswaUsers && dosenPemonevUsers && (
              <>
                {/* Fixed condition: Check if this evaluation is selected OR being loaded */}
                {(selectedEvaluation && selectedEvaluation.id === evaluation.id) ||
                (selectedEvaluationId === evaluation.id && isLoadingSelected) ? (
                  <EvaluationUpdateDialog
                    evaluation={selectedEvaluation || evaluation} // Use selectedEvaluation if available, fallback to evaluation
                    mahasiswaUsers={mahasiswaUsers}
                    dosenPemonevUsers={dosenPemonevUsers}
                    onUpdate={onUpdate}
                    isLoading={isLoadingSelected}
                    trigger={
                      <Button variant="outline" size="sm" className="gap-2" disabled={isLoadingSelected}>
                        <Edit className="h-4 w-4" />
                        {isLoadingSelected ? "Loading..." : "Edit"}
                      </Button>
                    }
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(evaluation.id)}
                    className="gap-2"
                    disabled={isLoadingSelected && selectedEvaluationId === evaluation.id}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </>
            )}

            {evaluation.status === "in_progress" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4" />
                    Finalize
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Finalize Evaluation
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to finalize this evaluation? This action will mark the evaluation as
                      completed and cannot be undone.
                      <br />
                      <br />
                      <strong>Evaluation ID:</strong> #{evaluation.id.slice(-8)}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onFinalize(evaluation.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Finalize Evaluation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2 text-black">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-red-600" />
                    Delete Evaluation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this evaluation? This action cannot be undone and will permanently
                    remove all associated data.
                    <br />
                    <br />
                    <strong>Evaluation ID:</strong> #{evaluation.id.slice(-8)}
                    <br />
                    <strong>Student ID:</strong> {evaluation.mahasiswa_id.slice(-6)}
                    <br />
                    <strong>Status:</strong> {evaluation.status.replace("_", " ").toUpperCase()}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(evaluation.id)} className="bg-red-600 hover:bg-red-700">
                    Delete Evaluation
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

export function StudentAssignmentCard({
  student,
  dosenPemonevUsers, // This now contains both dosen pemonev and dosen pembimbing
  onAssign,
  isLoading,
}: {
  student: {
    id: string;
    email: string;
    nrp?: string;
    hasEvaluation: boolean;
    hasRegistration: boolean;
    registrationStatus: string | null;
    activityName: string | null;
    registration: Registration | null;
  };
  dosenPemonevUsers: UserAlt[]; // Combined evaluators (pemonev + pembimbing)
  onAssign: (studentId: string, dosenPemonevId: string, registrationId: string) => void; // Back to original signature
  isLoading?: boolean;
}) {
  const [selectedDosen, setSelectedDosen] = useState<string>("");

  const handleAssign = () => {
    if (selectedDosen && student.id && student.registration?.id) {
      onAssign(student.id, selectedDosen, student.registration.id);
      setSelectedDosen("");
    }
  };

  return (
    <Card className="border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <UserX className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-medium">{student.email}</h4>
              {student.nrp && <p className="text-sm text-muted-foreground">NRP: {student.nrp}</p>}
              {student.activityName && (
                <p className="text-sm text-muted-foreground truncate max-w-md">{student.activityName}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-500">
              {student.registrationStatus}
            </Badge>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800"
            >
              Ready for Evaluation
            </Badge>
          </div>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            {/* Evaluator Selection (Unified Dosen Pemonev + Pembimbing) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Select Evaluator (Dosen Pemonev/Pembimbing)
              </label>
              <Select value={selectedDosen} onValueChange={setSelectedDosen}>
                <SelectTrigger className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <SelectValue placeholder="Choose Evaluator" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {dosenPemonevUsers.map((dosen) => (
                    <SelectItem
                      key={dosen.auth_user_id}
                      value={dosen.auth_user_id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{dosen.email}</span>
                        <span className="text-xs text-gray-500">({dosen.role_name || "Evaluator"})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            onClick={handleAssign}
            disabled={!selectedDosen || !student.registration?.id || isLoading}
            className="w-full"
          >
            {isLoading ? "Assigning..." : "Assign Evaluation"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
