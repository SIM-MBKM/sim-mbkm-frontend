"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  BookCheck,
  CheckCircle,
  AlertTriangle,
  Edit,
  Eye,
  Star,
  GraduationCap,
  Save,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { EvaluationList, Evaluation, EvaluationScoreUpdateInput } from "@/lib/api/services/monev-service";

interface ScoreFormData {
  id: string;
  score: number | "";
  grade_letter: string;
}

interface DosenPemonevEvaluationCardProps {
  evaluation: EvaluationList;
  onUpdateScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;
  selectedEvaluation?: Evaluation;
  selectedEvaluationId?: string | null;
  isLoadingSelected?: boolean;
  isUpdatingScore?: boolean;
  onEditClick: (id: string) => void;
}

// Score Update Dialog Component
function ScoreUpdateDialog({
  evaluation,
  onUpdateScore,
  isUpdating,
  trigger,
}: {
  evaluation: Evaluation;
  onUpdateScore: (scoreData: EvaluationScoreUpdateInput) => Promise<void>;
  isUpdating: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [scoresData, setScoresData] = useState<ScoreFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize scores when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && evaluation.scores) {
      setScoresData(
        evaluation.scores.map((score) => ({
          id: score.id,
          score: score.score ?? "",
          grade_letter: score.grade_letter || "",
        }))
      );
      setErrors({});
    }
    setOpen(newOpen);
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

  const validateScores = (): boolean => {
    const newErrors: Record<string, string> = {};

    scoresData.forEach((score, index) => {
      const scoreValue = typeof score.score === "number" ? score.score : parseFloat(score.score.toString()) || 0;

      if (scoreValue < 0 || scoreValue > 100) {
        newErrors[`score_${index}`] = "Score must be between 0 and 100";
      }

      if (!score.grade_letter.trim()) {
        newErrors[`grade_${index}`] = "Grade letter is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateScores()) {
      return;
    }

    try {
      // Update each score
      const promises = scoresData.map((scoreForm) => {
        const scoreValue =
          typeof scoreForm.score === "number" ? scoreForm.score : parseFloat(scoreForm.score.toString()) || 0;

        return onUpdateScore({
          evaluation_id: evaluation.id,
          id: scoreForm.id,
          score: scoreValue,
          grade_letter: scoreForm.grade_letter,
        });
      });

      await Promise.all(promises);
      setOpen(false);
    } catch (error) {
      console.error("Failed to update scores:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Star className="h-5 w-5 text-blue-600" />
            Update Evaluation Scores
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Evaluation Info */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-blue-700 mb-1 block">Evaluation ID</Label>
                <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">#{evaluation.id.slice(-8)}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-blue-700 mb-1 block">Student ID</Label>
                <p className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                  {evaluation.mahasiswa_id.slice(-6)}
                </p>
              </div>
            </div>
          </div>

          {/* Scores */}
          {scoresData.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Update Scores</h3>
              {scoresData.map((scoreForm, index) => (
                <div key={scoreForm.id} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span className="text-base font-medium text-gray-900">Subject {index + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Score (0-100)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreForm.score}
                        onChange={(e) => handleScoreChange(index, "score", e.target.value)}
                        disabled={isUpdating}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono text-lg"
                        placeholder="Enter score..."
                      />
                      {errors[`score_${index}`] && (
                        <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                          {errors[`score_${index}`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Grade Letter</Label>
                      <Input
                        value={scoreForm.grade_letter}
                        onChange={(e) => handleScoreChange(index, "grade_letter", e.target.value)}
                        disabled={isUpdating}
                        className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono text-lg uppercase"
                        placeholder="A, B+, C, etc."
                        maxLength={2}
                      />
                      {errors[`grade_${index}`] && (
                        <p className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                          {errors[`grade_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">No scores available for this evaluation.</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isUpdating}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUpdating || scoresData.length === 0}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating ? "Updating..." : "Update Scores"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Evaluation View Dialog
function EvaluationViewDialog({ evaluation, trigger }: { evaluation: EvaluationList; trigger: React.ReactNode }) {
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
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            Evaluation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Evaluation ID</label>
              <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-900">
                #{evaluation.id.slice(-8)}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge className={`${getStatusColor(evaluation.status)} border`}>
                  {evaluation.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Student ID</label>
              <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-900">
                {evaluation.mahasiswa_id}
              </p>
            </div>

            {evaluation.registration_id && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Registration ID</label>
                <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 text-gray-900">
                  #{evaluation.registration_id.slice(-8)}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DosenPemonevEvaluationCard({
  evaluation,
  onUpdateScore,
  selectedEvaluation,
  selectedEvaluationId,
  isLoadingSelected,
  isUpdatingScore,
  onEditClick,
}: DosenPemonevEvaluationCardProps) {
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

  const canUpdateScores = selectedEvaluation && selectedEvaluation.id === evaluation.id && selectedEvaluation.scores;

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

          <div className="space-y-2 mb-4">
            {evaluation.registration_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration:</span>
                <span className="font-medium text-gray-900">#{evaluation.registration_id.slice(-6)}</span>
              </div>
            )}

            {selectedEvaluation && selectedEvaluation.id === evaluation.id && selectedEvaluation.scores && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scores:</span>
                <span className="font-medium text-gray-900">{selectedEvaluation.scores.length} subject(s)</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* View Details */}
            <EvaluationViewDialog
              evaluation={evaluation}
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

            {/* Update Scores */}
            {canUpdateScores ? (
              <ScoreUpdateDialog
                evaluation={selectedEvaluation}
                onUpdateScore={onUpdateScore}
                isUpdating={isUpdatingScore || false}
                trigger={
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isUpdatingScore}
                  >
                    <Star className="h-4 w-4" />
                    {isUpdatingScore ? "Updating..." : "Update Scores"}
                  </Button>
                }
              />
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onEditClick(evaluation.id)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoadingSelected && selectedEvaluationId === evaluation.id}
              >
                <Edit className="h-4 w-4" />
                {isLoadingSelected && selectedEvaluationId === evaluation.id ? "Loading..." : "Edit Scores"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
