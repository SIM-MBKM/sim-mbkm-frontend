"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMonevAPI } from "@/lib/api/providers/monev-provider";
import useToast from "@/lib/api/hooks/use-toast";
import type { UserAlt } from "@/lib/api/services";
import type {
  EvaluationList,
  Evaluation,
  EvaluationScoreUpdateInput,
  EvaluationUpdateInput,
} from "@/lib/api/services/monev-service";
import { DosenPemonevEvaluationCard } from "../../dosen-pemonev/evaluation-card";
import {
  ClipboardList,
  Search,
  Users,
  BookCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserX,
  Filter,
  X,
  TrendingUp,
  GraduationCap,
  FileText,
  Edit,
  Eye,
  Star,
  Save,
  Trash2,
  UserCheck,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useUpdateEvaluationScore } from "@/lib/api/hooks";

// Local types
interface ScoreFormData {
  id: string;
  score: number | "";
  grade_letter: string;
}

// Enhanced View Dialog Component
function EvaluationViewDialog({
  evaluation,
  selectedEvaluation,
  trigger,
}: {
  evaluation: EvaluationList;
  selectedEvaluation?: Evaluation;
  trigger: React.ReactNode;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl bg-white">
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
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="text-sm font-mono">{evaluation.mahasiswa_id.slice(-8)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Dosen Pemonev ID</label>
                  <p className="text-sm font-mono">{evaluation.dosen_pemonev_id.slice(-8)}</p>
                </div>

                {evaluation.registration_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration ID</label>
                    <p className="text-sm font-mono">#{evaluation.registration_id.slice(-8)}</p>
                  </div>
                )}
              </div>

              {/* Show scores if available */}
              {selectedEvaluation && selectedEvaluation.scores && selectedEvaluation.scores.length > 0 && (
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-500 mb-3 block">
                    Evaluation Scores ({selectedEvaluation.scores.length} subjects)
                  </label>
                  <div className="space-y-3">
                    {selectedEvaluation.scores.map((score, index) => (
                      <div key={score.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{score.subject_data?.name || `Subject ${index + 1}`}</p>
                          {score.subject_data?.code && (
                            <p className="text-xs text-gray-500">Code: {score.subject_data.code}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            {score.score !== undefined ? score.score : "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">Grade: {score.grade_letter || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

// Enhanced Update Dialog Component with Combined Form Submission
function EvaluationUpdateDialog({
  evaluation,
  mahasiswaUsers = [],
  dosenPemonevUsers = [],
  onUpdate,
  onUpdateScore,
  isLoading = false,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  evaluation: Evaluation;
  mahasiswaUsers?: UserAlt[];
  dosenPemonevUsers?: UserAlt[];
  onUpdate: (updateData: EvaluationUpdateInput) => Promise<void>;
  onUpdateScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;
  isLoading?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    mahasiswa_id: evaluation.mahasiswa_id || "",
    dosen_pemonev_id: evaluation.dosen_pemonev_id || "",
    status: evaluation.status || "pending",
    registration_id: evaluation.registration_id || "",
  });

  const [scoresData, setScoresData] = useState<ScoreFormData[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [scoreErrors, setScoreErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [hasScoreChanges, setHasScoreChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when evaluation changes
  useEffect(() => {
    setFormData({
      mahasiswa_id: evaluation.mahasiswa_id || "",
      dosen_pemonev_id: evaluation.dosen_pemonev_id || "",
      status: evaluation.status || "pending",
      registration_id: evaluation.registration_id || "",
    });

    if (evaluation.scores && evaluation.scores.length > 0) {
      setScoresData(
        evaluation.scores.map((score) => ({
          id: score.id,
          score: score.score ?? "",
          grade_letter: score.grade_letter || "",
        }))
      );
    } else {
      setScoresData([]);
    }
  }, [evaluation]);

  // Check for changes
  useEffect(() => {
    const evalChanged =
      formData.mahasiswa_id !== (evaluation.mahasiswa_id || "") ||
      formData.dosen_pemonev_id !== (evaluation.dosen_pemonev_id || "") ||
      formData.status !== (evaluation.status || "pending");

    setHasChanges(evalChanged);

    const scoreChanged = scoresData.some((scoreForm, index) => {
      const originalScore = evaluation.scores?.[index];
      if (!originalScore) return false;

      const formScore = typeof scoreForm.score === "number" ? scoreForm.score : 0;
      const originalScoreValue = originalScore.score ?? 0;

      return formScore !== originalScoreValue || scoreForm.grade_letter !== (originalScore.grade_letter || "");
    });

    setHasScoreChanges(scoreChanged);
  }, [formData, scoresData, evaluation]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.mahasiswa_id.trim()) errors.mahasiswa_id = "Student is required";
    if (!formData.dosen_pemonev_id.trim()) errors.dosen_pemonev_id = "Dosen Pemonev is required";
    if (!formData.status.trim()) errors.status = "Status is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateScores = () => {
    const errors: Record<string, string> = {};
    scoresData.forEach((score, index) => {
      const scoreValue = typeof score.score === "number" ? score.score : parseFloat(score.score.toString()) || 0;
      if (scoreValue < 0 || scoreValue > 100) {
        errors[`score_${index}`] = "Score must be between 0 and 100";
      }
      if (!score.grade_letter.trim()) {
        errors[`grade_${index}`] = "Grade letter is required";
      }
    });
    setScoreErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getGradeFromScore = (score: number): string => {
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "C-";
    if (score >= 40) return "D";
    return "E";
  };

  const handleScoreChange = (index: number, field: "score" | "grade_letter", value: string | number) => {
    setScoresData((prev) => {
      const newScores = [...prev];
      if (field === "score") {
        const numValue = typeof value === "number" ? value : parseFloat(value.toString()) || 0;
        newScores[index] = {
          ...newScores[index],
          score: numValue,
          grade_letter: getGradeFromScore(numValue),
        };
      } else if (field === "grade_letter") {
        newScores[index] = {
          ...newScores[index],
          grade_letter: String(value),
        };
      }
      return newScores;
    });
  };

  // Enhanced handleSubmit with combined updates
  const handleSubmit = async () => {
    const isFormValid = validateForm();
    const areScoresValid = validateScores();

    if (!isFormValid || !areScoresValid) return;

    if (!hasChanges && !hasScoreChanges) {
      toast({
        title: "No Changes",
        description: "No changes were made to the evaluation.",
        variant: "default",
      });
      setOpen(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Update evaluation data if changed
      if (hasChanges) {
        const updateData: EvaluationUpdateInput = {
          id: evaluation.id,
          mahasiswa_id: formData.mahasiswa_id,
          dosen_pemonev_id: formData.dosen_pemonev_id,
          registration_id: formData.registration_id,
          status: formData.status as "pending" | "in_progress" | "completed",
        };

        await onUpdate(updateData);

        // Show intermediate success for evaluation update
        toast({
          title: "Evaluation Updated",
          description: "Evaluation details updated successfully",
          variant: "success",
        });
      }

      // Step 2: Update scores if changed
      if (hasScoreChanges) {
        const scoreUpdatePromises = scoresData
          .map((scoreForm, index) => {
            const originalScore = evaluation.scores?.[index];
            if (!originalScore) return null;

            const formScore =
              typeof scoreForm.score === "number" ? scoreForm.score : parseFloat(scoreForm.score.toString()) || 0;
            const originalScoreValue = originalScore.score ?? 0;

            if (formScore !== originalScoreValue || scoreForm.grade_letter !== (originalScore.grade_letter || "")) {
              const scoreUpdateData: EvaluationScoreUpdateInput = {
                evaluation_id: evaluation.id,
                id: scoreForm.id,
                score: formScore,
                grade_letter: scoreForm.grade_letter,
              };
              return onUpdateScore(scoreUpdateData);
            }
            return null;
          })
          .filter(Boolean);

        if (scoreUpdatePromises.length > 0) {
          await Promise.all(scoreUpdatePromises);

          // Show success for score updates
          toast({
            title: "Scores Updated",
            description: `${scoreUpdatePromises.length} score(s) updated successfully`,
            variant: "success",
          });
        }
      }

      // Final success message
      toast({
        title: "Update Complete",
        description: `All changes have been saved successfully`,
        variant: "success",
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const findUserEmail = (userId: string, users: UserAlt[]) => {
    const user = users.find((u) => u.auth_user_id === userId);
    return user?.email || `User ID: ${userId.slice(-6)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Edit className="h-5 w-5" />
            Update Evaluation & Scores
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Evaluation Info */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Current Evaluation</h3>
              <Badge className={getStatusColor(evaluation.status)}>
                {evaluation.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-gray-600">Evaluation ID</Label>
                <p className="font-mono text-gray-900">#{evaluation.id.slice(-8)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Registration ID</Label>
                <p className="font-mono text-gray-900">
                  {evaluation.registration_id ? `#${evaluation.registration_id.slice(-8)}` : "No Registration ID"}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Current Student</Label>
                <p className="text-gray-900">{findUserEmail(evaluation.mahasiswa_id, mahasiswaUsers)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600">Current Dosen Pemonev</Label>
                <p className="text-gray-900">{findUserEmail(evaluation.dosen_pemonev_id, dosenPemonevUsers)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Update Evaluation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Update Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mahasiswa_id" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student
                  </Label>
                  <Select
                    value={formData.mahasiswa_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, mahasiswa_id: value }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {mahasiswaUsers.map((student) => (
                        <SelectItem key={student.auth_user_id} value={student.auth_user_id}>
                          <div className="flex items-center gap-2">
                            <span>{student.email}</span>
                            {student.nrp && <span className="text-xs text-gray-500">({student.nrp})</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.mahasiswa_id && <p className="text-sm text-red-600">{formErrors.mahasiswa_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosen_pemonev_id" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Dosen Pemonev
                  </Label>
                  <Select
                    value={formData.dosen_pemonev_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, dosen_pemonev_id: value }))}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Dosen Pemonev" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      {dosenPemonevUsers.map((dosen) => (
                        <SelectItem key={dosen.auth_user_id} value={dosen.auth_user_id}>
                          {dosen.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.dosen_pemonev_id && <p className="text-sm text-red-600">{formErrors.dosen_pemonev_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as "pending" | "in_progress" | "completed" }))
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="in_progress">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Completed
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.status && <p className="text-sm text-red-600">{formErrors.status}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Update Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5" />
                  Update Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoresData.length > 0 ? (
                  <div className="space-y-4">
                    {scoresData.map((scoreForm, index) => (
                      <div key={scoreForm.id} className="p-3 border border-gray-200 rounded-lg space-y-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">
                            {evaluation.scores?.[index]?.subject_data?.name || `Subject ${index + 1}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Score (0-100)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={scoreForm.score}
                              onChange={(e) => handleScoreChange(index, "score", e.target.value)}
                              disabled={isSubmitting}
                              className="bg-white"
                            />
                            {scoreErrors[`score_${index}`] && (
                              <p className="text-xs text-red-600">{scoreErrors[`score_${index}`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Grade</Label>
                            <Input
                              value={scoreForm.grade_letter}
                              onChange={(e) => handleScoreChange(index, "grade_letter", e.target.value)}
                              disabled={isSubmitting}
                              className="bg-white"
                              placeholder="A, B+, C, etc."
                            />
                            {scoreErrors[`grade_${index}`] && (
                              <p className="text-xs text-red-600">{scoreErrors[`grade_${index}`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No scores available for this evaluation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Changes Indicator */}
          {(hasChanges || hasScoreChanges) && (
            <Alert>
              <AlertDescription className="text-blue-600">
                Changes detected. Click "Update Evaluation" to save your changes.
                {hasChanges && hasScoreChanges && " (Both evaluation details and scores will be updated)"}
                {hasChanges && !hasScoreChanges && " (Only evaluation details will be updated)"}
                {!hasChanges && hasScoreChanges && " (Only scores will be updated)"}
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Indicator during submission */}
          {isSubmitting && (
            <Alert>
              <AlertDescription className="text-green-600 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                />
                Processing updates... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!hasChanges && !hasScoreChanges)}
              className="gap-2"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? "Updating..." : "Update Evaluation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Evaluation Card Component
function EnhancedEvaluationCard({
  evaluation,
  onEdit,
  onFinalize,
  onDelete,
  selectedEvaluation,
  selectedEvaluationId,
  isLoadingSelected,
  onUpdateEvaluation,
  onUpdateScore,
  isFormSubmitting,
  mahasiswaUsers = [],
  dosenPemonevUsers = [],
}: {
  evaluation: EvaluationList;
  onEdit: (id: string) => void;
  onFinalize: (id: string) => void;
  onDelete: (id: string) => void;
  selectedEvaluation?: Evaluation;
  selectedEvaluationId?: string | null;
  isLoadingSelected?: boolean;
  onUpdateEvaluation: (updateData: EvaluationUpdateInput) => Promise<void>;
  onUpdateScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;
  isFormSubmitting?: boolean;
  mahasiswaUsers?: UserAlt[];
  dosenPemonevUsers?: UserAlt[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const canUpdate = selectedEvaluation && selectedEvaluation.id === evaluation.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Evaluation #{evaluation.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">Student: {evaluation.mahasiswa_id.slice(-6)}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(evaluation.status)} flex items-center gap-1 border`}>
              {getStatusIcon(evaluation.status)}
              {evaluation.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Show subject information if available */}
          {selectedEvaluation && selectedEvaluation.id === evaluation.id && selectedEvaluation.scores && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Subjects ({selectedEvaluation.scores.length})</h4>
              <div className="space-y-1">
                {selectedEvaluation.scores.slice(0, 2).map((score, index) => (
                  <div key={score.id} className="text-xs text-gray-600">
                    • {score.subject_data?.name || `Subject ${index + 1}`}
                    {score.subject_data?.code && ` (${score.subject_data.code})`}
                  </div>
                ))}
                {selectedEvaluation.scores.length > 2 && (
                  <div className="text-xs text-gray-500">
                    ... and {selectedEvaluation.scores.length - 2} more subjects
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {evaluation.registration_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration:</span>
                <span className="font-medium text-gray-900">#{evaluation.registration_id.slice(-6)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* View Details */}
            <EvaluationViewDialog
              evaluation={evaluation}
              selectedEvaluation={selectedEvaluation}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              }
            />

            {/* Update Button */}
            {canUpdate ? (
              <EvaluationUpdateDialog
                evaluation={selectedEvaluation}
                mahasiswaUsers={mahasiswaUsers}
                dosenPemonevUsers={dosenPemonevUsers}
                onUpdate={onUpdateEvaluation}
                onUpdateScore={onUpdateScore}
                isLoading={isFormSubmitting || false}
                trigger={
                  <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="h-4 w-4" />
                    Update
                  </Button>
                }
              />
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onEdit(evaluation.id)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoadingSelected && selectedEvaluationId === evaluation.id}
              >
                <Edit className="h-4 w-4" />
                {isLoadingSelected && selectedEvaluationId === evaluation.id ? "Loading..." : "Edit"}
              </Button>
            )}

            {/* Finalize */}
            {evaluation.status !== "completed" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
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

            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-red-300 text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
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

// Student Assignment Card Component
function StudentAssignmentCard({
  student,
  dosenPemonevUsers,
  onAssign,
  isLoading,
}: {
  student: any; // Using any temporarily since StudentWithRegistration is defined in monev-provider
  dosenPemonevUsers: UserAlt[];
  onAssign: (studentId: string, dosenPemonevId: string, registrationId: string) => void;
  isLoading: boolean;
}) {
  const [selectedDosen, setSelectedDosen] = useState<string>("");

  const handleAssign = () => {
    if (selectedDosen && student.registration?.id) {
      onAssign(student.auth_user_id, selectedDosen, student.registration.id);
      setSelectedDosen("");
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">{student.email}</h4>
              <p className="text-sm text-gray-600">NRP: {student.nrp}</p>
              {student.activityName && (
                <p className="text-xs text-gray-500 truncate max-w-md">{student.activityName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedDosen} onValueChange={setSelectedDosen}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select evaluator" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {dosenPemonevUsers.map((dosen) => (
                  <SelectItem key={dosen.auth_user_id} value={dosen.auth_user_id}>
                    {dosen.name || dosen.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAssign} disabled={!selectedDosen || isLoading} size="sm" className="gap-2">
              <UserCheck className="h-4 w-4" />
              {isLoading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Component
export function MonevManagementDashboard() {
  const {
    evaluations,
    isLoading,
    evaluationsPagination,
    changePage,
    changePerPage,
    currentPerPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    clearFilters,
    refreshEvaluations,
    evaluationStats,
    studentsReadyForEvaluation,
    studentsWithRegistrations,
    dosenPemonevUsers,
    createEvaluation,
    updateEvaluation,
    updateEvaluationScore,
    finalizeEvaluation,
    deleteEvaluation,
    isFormSubmitting,
    isLoadingUsers,
    isLoadingRegistrations,
    selectedEvaluationId,
    setSelectedEvaluationId,
    selectedEvaluation,
    isLoadingSelectedEvaluation,
  } = useMonevAPI();

  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("evaluations");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Local filter state for immediate UI feedback
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter);

  // Sync local state with provider state
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalStatusFilter(statusFilter);
  }, [statusFilter]);

  // Enhanced filter handlers
  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearchTerm(value);
      setSearchTerm(value);
    },
    [setSearchTerm]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setLocalStatusFilter(value);
      setStatusFilter(value);
    },
    [setStatusFilter]
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearchTerm("");
    setLocalStatusFilter("all");
    clearFilters();
  }, [clearFilters]);

  // Evaluation action handlers
  const handleAssignEvaluation = useCallback(
    async (studentId: string, dosenPemonevId: string, registrationId: string) => {
      try {
        await createEvaluation({
          mahasiswa_id: studentId,
          dosen_pemonev_id: dosenPemonevId,
          registration_id: registrationId,
          status: "pending",
        });

        toast({
          title: "Success",
          description: "Evaluation assigned successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to assign evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to assign evaluation",
          variant: "destructive",
        });
      }
    },
    [createEvaluation, toast]
  );

  const handleFinalizeEvaluation = useCallback(
    async (id: string) => {
      try {
        await finalizeEvaluation(id);
        toast({
          title: "Success",
          description: "Evaluation finalized successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to finalize evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to finalize evaluation",
          variant: "destructive",
        });
      }
    },
    [finalizeEvaluation, toast]
  );

  const handleUpdateScore = useCallback(
    async (scoreData: EvaluationScoreUpdateInput) => {
      try {
        await updateEvaluationScore(scoreData);
        toast({
          title: "Success",
          description: "Score updated successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to update score:", error);
        toast({
          title: "Error",
          description: "Failed to update score",
          variant: "destructive",
        });
      }
    },
    [updateEvaluationScore, toast]
  );

  const handleDeleteEvaluation = useCallback(
    async (id: string) => {
      try {
        await deleteEvaluation(id);
        toast({
          title: "Success",
          description: "Evaluation deleted successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Failed to delete evaluation:", error);
        toast({
          title: "Error",
          description: "Failed to delete evaluation",
          variant: "destructive",
        });
      }
    },
    [deleteEvaluation, toast]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Clear selected evaluation first
      setSelectedEvaluationId(null);

      // Show loading toast
      toast({
        title: "Refreshing",
        description: "Updating evaluation data...",
        variant: "default",
      });

      // Refresh evaluations
      await refreshEvaluations();

      // Success feedback
      toast({
        title: "Success",
        description: "Data refreshed successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to refresh:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshEvaluations, setSelectedEvaluationId, toast]);

  // Calculate additional stats with fallbacks
  const totalStudents = studentsWithRegistrations?.length || 0;
  const studentsWithApprovedRegistrations =
    studentsWithRegistrations?.filter((s) => s.hasRegistration && s.registrationStatus === "APPROVED").length || 0;

  // Filter status options
  const statusOptions = [
    { value: "all", label: "All Statuses", count: evaluationStats?.total || 0 },
    { value: "pending", label: "Pending", count: evaluationStats?.pending || 0 },
    { value: "in_progress", label: "In Progress", count: evaluationStats?.inProgress || 0 },
    { value: "completed", label: "Completed", count: evaluationStats?.completed || 0 },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Monev Management</h1>
              <p className="text-muted-foreground">Monitor and evaluate student progress across programs</p>
            </div>
          </div>

          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          description="All MAHASISWA users"
          icon={GraduationCap}
          color="bg-purple-500"
        />
        <StatsCard
          title="With Registrations"
          value={studentsWithApprovedRegistrations}
          description="Students with approved registrations"
          icon={FileText}
          color="bg-blue-500"
        />
        <StatsCard
          title="Ready for Evaluation"
          value={studentsReadyForEvaluation?.length || 0}
          description="Approved but not evaluated"
          icon={Users}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Evaluations"
          value={evaluationStats?.total || 0}
          description="All evaluations in system"
          icon={ClipboardList}
          color="bg-blue-600"
        />
        <StatsCard
          title="Completed"
          value={evaluationStats?.completed || 0}
          description="Finished evaluations"
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatsCard
          title="In Progress"
          value={(evaluationStats?.inProgress || 0) + (evaluationStats?.pending || 0)}
          description="Active evaluations"
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Evaluation Completion Rate</span>
                <span className="font-medium">{evaluationStats?.averageCompletionRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${evaluationStats?.averageCompletionRate || 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {evaluationStats?.completed || 0} of {evaluationStats?.total || 0} evaluations completed
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Registration Coverage</span>
                <span className="font-medium">
                  {totalStudents > 0 ? Math.round((studentsWithApprovedRegistrations / totalStudents) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${totalStudents > 0 ? (studentsWithApprovedRegistrations / totalStudents) * 100 : 0}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {studentsWithApprovedRegistrations} of {totalStudents} students registered
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-background/50 backdrop-blur-sm border">
            <TabsTrigger
              value="evaluations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Evaluations ({evaluationStats?.total || 0})
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Ready for Assignment ({studentsReadyForEvaluation?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              All Students ({totalStudents})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Evaluations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search evaluations..."
                          value={localSearchTerm}
                          onChange={(e) => handleSearchChange(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select value={localStatusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {option.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Per Page</Label>
                      <Select
                        value={currentPerPage.toString()}
                        onValueChange={(value) => changePerPage(Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 per page</SelectItem>
                          <SelectItem value="10">10 per page</SelectItem>
                          <SelectItem value="20">20 per page</SelectItem>
                          <SelectItem value="50">50 per page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-2 flex-1">
                          <X className="h-4 w-4" />
                          Clear
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="gap-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(localSearchTerm || localStatusFilter !== "all") && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <span className="text-sm font-medium text-gray-600">Active filters:</span>
                      {localSearchTerm && (
                        <Badge variant="secondary" className="gap-1">
                          Search: "{localSearchTerm}"
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearchChange("")} />
                        </Badge>
                      )}
                      {localStatusFilter !== "all" && (
                        <Badge variant="secondary" className="gap-1">
                          Status: {statusOptions.find((o) => o.value === localStatusFilter)?.label}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleStatusFilterChange("all")} />
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Contents */}
        <TabsContent value="evaluations" className="space-y-4 mt-0">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="w-20 h-8 bg-gray-200 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : evaluations && evaluations.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {evaluations?.length || 0} of {evaluationsPagination.totalItems} evaluations
                  {(localSearchTerm || localStatusFilter !== "all") && (
                    <span className="ml-2 text-primary font-medium">(filtered)</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                {(evaluations || []).map((evaluation) => (
                  <EnhancedEvaluationCard
                    key={evaluation.id}
                    evaluation={evaluation}
                    onEdit={(id: string) => {
                      setSelectedEvaluationId(id);
                    }}
                    onFinalize={handleFinalizeEvaluation}
                    onDelete={handleDeleteEvaluation}
                    selectedEvaluation={selectedEvaluation}
                    selectedEvaluationId={selectedEvaluationId}
                    isLoadingSelected={isLoadingSelectedEvaluation}
                    onUpdateScore={handleUpdateScore}
                    onUpdateEvaluation={updateEvaluation}
                    isFormSubmitting={isFormSubmitting}
                    mahasiswaUsers={
                      studentsWithRegistrations?.map((s) => ({
                        id: s.id,
                        auth_user_id: s.auth_user_id,
                        email: s.email,
                        nrp: s.nrp,
                        role_name: s.role_name,
                        name: s.name,
                      })) || []
                    }
                    dosenPemonevUsers={dosenPemonevUsers || []}
                  />
                ))}
              </div>

              {/* Pagination */}
              {evaluationsPagination.totalPages > 1 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground">
                        Page {evaluationsPagination.currentPage} of {evaluationsPagination.totalPages}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePage(evaluationsPagination.currentPage - 1)}
                          disabled={!evaluationsPagination.hasPrevPage}
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(5, evaluationsPagination.totalPages))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={pageNum === evaluationsPagination.currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => changePage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changePage(evaluationsPagination.currentPage + 1)}
                          disabled={!evaluationsPagination.hasNextPage}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Evaluations Found</h3>
                <p className="text-muted-foreground">
                  {localSearchTerm || localStatusFilter !== "all"
                    ? "No evaluations match your current filters. Try adjusting your search criteria."
                    : "There are no evaluations in the system yet."}
                </p>
                {(localSearchTerm || localStatusFilter !== "all") && (
                  <Button variant="outline" onClick={handleClearFilters} className="mt-4 gap-2">
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-0">
          {studentsReadyForEvaluation && studentsReadyForEvaluation.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Students Ready for Evaluation Assignment</h3>
                  <p className="text-sm text-muted-foreground">
                    {studentsReadyForEvaluation.length} students with approved registrations need evaluation assignment
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {studentsReadyForEvaluation.map((student) => (
                  <StudentAssignmentCard
                    key={student.id}
                    student={student}
                    dosenPemonevUsers={dosenPemonevUsers || []}
                    onAssign={handleAssignEvaluation}
                    isLoading={isFormSubmitting}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All Ready Students Assigned</h3>
                <p className="text-muted-foreground">
                  Great! All students with approved registrations have been assigned evaluations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-0">
          {isLoadingUsers ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : studentsWithRegistrations && studentsWithRegistrations.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">All Students Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete overview of all students and their registration/evaluation status
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {(studentsWithRegistrations || []).map((student) => (
                  <Card key={student.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{student.email}</h4>
                            {student.nrp && <p className="text-sm text-muted-foreground">NRP: {student.nrp}</p>}
                            {student.hasRegistration && student.activityName && (
                              <p className="text-sm text-muted-foreground truncate max-w-md">{student.activityName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {student.hasRegistration ? (
                            <Badge variant={student.registrationStatus === "APPROVED" ? "default" : "secondary"}>
                              {student.registrationStatus}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              No Registration
                            </Badge>
                          )}

                          {student.hasEvaluation ? (
                            <Badge variant="default" className="bg-green-500">
                              Has Evaluation
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600">
                              No Evaluation
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                <p className="text-muted-foreground">No student data available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
