"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDosenPemonevUsers,
  useMahasiswaUsers,
  useRegistrationLOMBKM,
  useSubmitEvaluation,
  useUpdateEvaluation,
} from "@/lib/api/hooks";
import {
  EvaluationCreateInput,
  EvaluationUpdateInput,
} from "@/lib/api/services/monev-service";
import { LoaderIcon } from "lucide-react";

interface EvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationToEdit?: any;
}

export function EvaluationDialog({
  open,
  onOpenChange,
  evaluationToEdit,
}: EvaluationDialogProps) {
  const isEditing = !!evaluationToEdit;

  const [formData, setFormData] = useState<EvaluationCreateInput>({
    mahasiswa_id: "",
    dosen_pemonev_id: "",
    registration_id: "",
    status: "pending",
  });

  // /* Evaluation Data Dropdown */
  // const { data: mahasiswaUsers, isLoading: loadingMahasiswa } =
  //   useMahasiswaUsers();
  // const { data: dosenPemonevUsers, isLoading: loadingDosen } =
  //   useDosenPemonevUsers();
  // const { data: registrations, isLoading: loadingRegistrations } =
  //   useRegistrationLOMBKM({
  //     page: 1,
  //     limit: 100, // Fetch more to get accurate counts
  //     filter: {
  //       activity_name: "",
  //       user_name: "",
  //       user_nrp: "",
  //       academic_advisor: "",
  //       academic_advisor_validation: "",
  //       lo_validation: "", // Always empty to get all registrations
  //     },
  //   });

  const { mutate: submitEvaluation, isPending: isSubmitting } =
    useSubmitEvaluation();
  const { mutate: updateEvaluation, isPending: isUpdating } =
    useUpdateEvaluation();

  useEffect(() => {
    if (open) {
      if (evaluationToEdit) {
        setFormData({
          mahasiswa_id: evaluationToEdit.mahasiswa_id || "",
          dosen_pemonev_id: evaluationToEdit.dosen_pemonev_id || "",
          registration_id: evaluationToEdit.registration_id || "",
          status: evaluationToEdit.status || "pending",
        });
      } else {
        setFormData({
          mahasiswa_id: "",
          dosen_pemonev_id: "",
          registration_id: "",
          status: "pending",
        });
      }
    }
  }, [open, evaluationToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      const updateData: EvaluationUpdateInput = {
        id: evaluationToEdit.id,
        ...formData,
      };

      updateEvaluation(updateData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      submitEvaluation(formData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = loadingMahasiswa || loadingDosen || loadingRegistrations;
  const isPending = isSubmitting || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white border border-gray-200">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Evaluation" : "Create New Evaluation"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the evaluation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Mahasiswa Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="mahasiswa_id"
                className="text-right text-gray-700"
              >
                Mahasiswa
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.mahasiswa_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, mahasiswa_id: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue
                      placeholder={
                        isLoading ? "Loading..." : "Select mahasiswa"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 max-h-60">
                    {mahasiswaUsers?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dosen Pemonev Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="dosen_pemonev_id"
                className="text-right text-gray-700"
              >
                Dosen Pemonev
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.dosen_pemonev_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dosen_pemonev_id: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue
                      placeholder={
                        isLoading ? "Loading..." : "Select dosen pemonev"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 max-h-60">
                    {dosenPemonevUsers?.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Registration Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="registration_id"
                className="text-right text-gray-700"
              >
                Registration
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.registration_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, registration_id: value })
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue
                      placeholder={
                        isLoading ? "Loading..." : "Select registration"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 max-h-60">
                    {registrations?.map((registration: any) => (
                      <SelectItem key={registration.id} value={registration.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {registration.activity_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {registration.student_name} -{" "}
                            {registration.program_type}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-gray-700">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status}
                  onValueChange={(
                    value: "pending" | "in_progress" | "completed"
                  ) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-white border-gray-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
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
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
