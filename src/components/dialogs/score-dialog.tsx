"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateEvaluationScore } from "@/lib/api/hooks";
import { EvaluationScoreUpdateInput } from "@/lib/api/services/monev-service";

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scoreToEdit?: any;
}

export function ScoreDialog({
  open,
  onOpenChange,
  scoreToEdit,
}: ScoreDialogProps) {
  const [formData, setFormData] = useState<EvaluationScoreUpdateInput>({
    evaluation_id: scoreToEdit?.evaluation_id || "",
    id: scoreToEdit?.id || "",
    score: scoreToEdit?.score || 0,
    grade_letter: scoreToEdit?.grade_letter || "",
  });

  const { mutate: updateScore, isPending } = useUpdateEvaluationScore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateScore(formData, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white border border-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {scoreToEdit ? "Edit Score" : "Add New Score"}
            </DialogTitle>
            <DialogDescription>
              Enter the score details for the evaluation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="evaluation_id"
                className="text-right text-gray-700"
              >
                Evaluation ID
              </Label>
              <Input
                id="evaluation_id"
                value={formData.evaluation_id}
                onChange={(e) =>
                  setFormData({ ...formData, evaluation_id: e.target.value })
                }
                className="col-span-3 bg-white border-gray-200"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="score" className="text-right text-gray-700">
                Score
              </Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: Number(e.target.value) })
                }
                className="col-span-3 bg-white border-gray-200"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="grade_letter"
                className="text-right text-gray-700"
              >
                Grade Letter
              </Label>
              <Input
                id="grade_letter"
                value={formData.grade_letter}
                onChange={(e) =>
                  setFormData({ ...formData, grade_letter: e.target.value })
                }
                className="col-span-3 bg-white border-gray-200"
                required
                maxLength={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
