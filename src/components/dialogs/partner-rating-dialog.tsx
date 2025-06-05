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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSubmitPartnerRating } from "@/lib/api/hooks";
import { PartnerRatingCreateInput } from "@/lib/api/services/monev-service";

interface PartnerRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ratingToEdit?: any;
}

export function PartnerRatingDialog({
  open,
  onOpenChange,
  ratingToEdit,
}: PartnerRatingDialogProps) {
  const [formData, setFormData] = useState<PartnerRatingCreateInput>({
    activity_id: ratingToEdit?.activity_id || "",
    rating: ratingToEdit?.rating || 5,
    comment: ratingToEdit?.comment || "",
    is_anonymous: ratingToEdit?.is_anonymous || false,
  });

  const { mutate: submitRating, isPending } = useSubmitPartnerRating();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(formData, {
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
              {ratingToEdit ? "Edit Partner Rating" : "Add New Partner Rating"}
            </DialogTitle>
            <DialogDescription>
              Provide rating and feedback for the partner activity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activity_id" className="text-right text-gray-700">
                Activity ID
              </Label>
              <Input
                id="activity_id"
                value={formData.activity_id}
                onChange={(e) =>
                  setFormData({ ...formData, activity_id: e.target.value })
                }
                className="col-span-3 bg-white border-gray-200"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right text-gray-700">
                Rating (1-5)
              </Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                className="col-span-3 bg-white border-gray-200"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right text-gray-700">
                Comment
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="col-span-3 bg-white border-gray-200"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="is_anonymous"
                className="text-right text-gray-700"
              >
                Anonymous
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="is_anonymous"
                  checked={formData.is_anonymous}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_anonymous: checked })
                  }
                />
                <Label htmlFor="is_anonymous" className="text-gray-700">
                  {formData.is_anonymous ? "Yes" : "No"}
                </Label>
              </div>
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
