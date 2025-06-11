"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save, User, UserCheck, Clock, Star, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserAlt } from "@/lib/api/services";
import type { Evaluation, EvaluationUpdateInput, EvaluationScoreUpdateInput } from "@/lib/api/services/monev-service";
import { useUpdateEvaluationScore } from "@/lib/api/hooks";
import useToast from "@/lib/api/hooks/use-toast";

interface EvaluationUpdateDialogProps {
  evaluation: Evaluation;
  mahasiswaUsers: UserAlt[];
  dosenPemonevUsers: UserAlt[];
  onUpdate: (updateData: EvaluationUpdateInput) => Promise<void>;
  isLoading?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ScoreFormData {
  id: string;
  score: number | "";
  grade_letter: string;
}

export function EvaluationUpdateDialog({
  evaluation,
  mahasiswaUsers,
  dosenPemonevUsers,
  onUpdate,
  isLoading = false,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EvaluationUpdateDialogProps) {
  const { toast } = useToast();
  const updateScoreMutation = useUpdateEvaluationScore();

  // Handle both controlled and uncontrolled dialog state
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [formData, setFormData] = useState({
    mahasiswa_id: evaluation.mahasiswa_id || "",
    dosen_pemonev_id: evaluation.dosen_pemonev_id || "",
    status: evaluation.status || "pending",
    event_id: evaluation.event_id || "",
  });

  const [scoresData, setScoresData] = useState<ScoreFormData[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [scoreErrors, setScoreErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [hasScoreChanges, setHasScoreChanges] = useState(false);

  // Initialize form data when evaluation changes
  useEffect(() => {
    setFormData({
      mahasiswa_id: evaluation.mahasiswa_id || "",
      dosen_pemonev_id: evaluation.dosen_pemonev_id || "",
      status: evaluation.status || "pending",
      event_id: evaluation.event_id || "",
    });

    // Initialize scores with proper defaults
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

  // Check for evaluation changes
  useEffect(() => {
    const changed =
      formData.mahasiswa_id !== (evaluation.mahasiswa_id || "") ||
      formData.dosen_pemonev_id !== (evaluation.dosen_pemonev_id || "") ||
      formData.status !== (evaluation.status || "pending") ||
      formData.event_id !== (evaluation.event_id || "");

    setHasChanges(changed);
  }, [formData, evaluation]);

  // Check for score changes
  useEffect(() => {
    if (!evaluation.scores || evaluation.scores.length === 0) {
      setHasScoreChanges(false);
      return;
    }

    const scoreChanged = scoresData.some((scoreForm, index) => {
      const originalScore = evaluation.scores?.[index];
      if (!originalScore) return false;

      const formScore = typeof scoreForm.score === "number" ? scoreForm.score : 0;
      const originalScoreValue = originalScore.score ?? 0;

      return formScore !== originalScoreValue || scoreForm.grade_letter !== (originalScore.grade_letter || "");
    });

    setHasScoreChanges(scoreChanged);
  }, [scoresData, evaluation.scores]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        mahasiswa_id: evaluation.mahasiswa_id || "",
        dosen_pemonev_id: evaluation.dosen_pemonev_id || "",
        status: evaluation.status || "pending",
        event_id: evaluation.event_id || "",
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

      setFormErrors({});
      setScoreErrors({});
      setHasChanges(false);
      setHasScoreChanges(false);
    }
  }, [open, evaluation]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.mahasiswa_id.trim()) {
      errors.mahasiswa_id = "Student is required";
    }

    if (!formData.dosen_pemonev_id.trim()) {
      errors.dosen_pemonev_id = "Dosen Pemonev is required";
    }

    if (!formData.status.trim()) {
      errors.status = "Status is required";
    }

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

  const handleSubmit = async () => {
    const isFormValid = validateForm();
    const areScoresValid = validateScores();

    if (!isFormValid || !areScoresValid) {
      return;
    }

    if (!hasChanges && !hasScoreChanges) {
      toast({
        title: "No Changes",
        description: "No changes were made to the evaluation.",
        variant: "default",
      });
      setOpen(false);
      return;
    }

    try {
      const promises: Promise<any>[] = [];

      // Update evaluation if basic data changed
      if (hasChanges) {
        const updateData: EvaluationUpdateInput = {
          id: evaluation.id,
          mahasiswa_id: formData.mahasiswa_id,
          dosen_pemonev_id: formData.dosen_pemonev_id,
          registration_id: evaluation.registration_id || "",
          status: formData.status as "pending" | "in_progress" | "completed",
          event_id: formData.event_id || undefined,
        };
        promises.push(onUpdate(updateData));
      }

      // Update scores if they changed
      if (hasScoreChanges) {
        scoresData.forEach((scoreForm, index) => {
          const originalScore = evaluation.scores?.[index];
          if (!originalScore) return;

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
            promises.push(updateScoreMutation.mutateAsync(scoreUpdateData));
          }
        });
      }

      await Promise.all(promises);

      toast({
        title: "Success",
        description: `Evaluation ${
          hasChanges && hasScoreChanges ? "and scores" : hasChanges ? "" : "scores"
        } updated successfully`,
        variant: "success",
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update evaluation",
        variant: "destructive",
      });
    }
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

  const findUserEmail = (userId: string, users: UserAlt[]) => {
    const user = users.find((u) => u.auth_user_id === userId);
    return user?.email || `User ID: ${userId.slice(-6)}`;
  };

  const isUpdating = isLoading || updateScoreMutation.isPending;

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
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Current Evaluation</h3>
              <Badge className={getStatusColor(evaluation.status)}>
                {evaluation.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Evaluation ID</Label>
                <p className="font-mono text-gray-900 dark:text-gray-100">#{evaluation.id.slice(-8)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Registration ID</Label>
                <p className="font-mono text-gray-900 dark:text-gray-100">
                  {evaluation.registration_id ? `#${evaluation.registration_id.slice(-8)}` : "No Registration ID"}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Student</Label>
                <p className="text-gray-900 dark:text-gray-100">
                  {findUserEmail(evaluation.mahasiswa_id, mahasiswaUsers)}
                </p>
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">Current Dosen Pemonev</Label>
                <p className="text-gray-900 dark:text-gray-100">
                  {findUserEmail(evaluation.dosen_pemonev_id, dosenPemonevUsers)}
                </p>
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
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mahasiswa_id" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Student
                  </Label>
                  <Select
                    value={formData.mahasiswa_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, mahasiswa_id: value }))}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                  {formErrors.mahasiswa_id && (
                    <p className="text-sm text-red-600 dark:text-red-400">{formErrors.mahasiswa_id}</p>
                  )}
                </div>

                {/* Dosen Pemonev Selection */}
                <div className="space-y-2">
                  <Label htmlFor="dosen_pemonev_id" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Dosen Pemonev
                  </Label>
                  <Select
                    value={formData.dosen_pemonev_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, dosen_pemonev_id: value }))}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select Dosen Pemonev" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      {dosenPemonevUsers.map((dosen) => (
                        <SelectItem key={dosen.auth_user_id} value={dosen.auth_user_id}>
                          {dosen.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.dosen_pemonev_id && (
                    <p className="text-sm text-red-600 dark:text-red-400">{formErrors.dosen_pemonev_id}</p>
                  )}
                </div>

                {/* Status Selection */}
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
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                  {formErrors.status && <p className="text-sm text-red-600 dark:text-red-400">{formErrors.status}</p>}
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
                      <div
                        key={scoreForm.id}
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Subject {index + 1}</span>
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
                              disabled={isUpdating}
                              className="bg-white dark:bg-gray-800"
                            />
                            {scoreErrors[`score_${index}`] && (
                              <p className="text-xs text-red-600 dark:text-red-400">{scoreErrors[`score_${index}`]}</p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Grade</Label>
                            <Input
                              value={scoreForm.grade_letter}
                              onChange={(e) => handleScoreChange(index, "grade_letter", e.target.value)}
                              disabled={isUpdating}
                              className="bg-white dark:bg-gray-800"
                              placeholder="A, B+, C, etc."
                            />
                            {scoreErrors[`grade_${index}`] && (
                              <p className="text-xs text-red-600 dark:text-red-400">{scoreErrors[`grade_${index}`]}</p>
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
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                Changes detected. Click "Update Evaluation" to save your changes.
                {hasChanges && hasScoreChanges && " (Both evaluation details and scores will be updated)"}
                {hasChanges && !hasScoreChanges && " (Only evaluation details will be updated)"}
                {!hasChanges && hasScoreChanges && " (Only scores will be updated)"}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUpdating || (!hasChanges && !hasScoreChanges)} className="gap-2">
              {isUpdating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? "Updating..." : "Update Evaluation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
