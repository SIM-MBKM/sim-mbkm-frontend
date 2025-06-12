"use client";

import { useState, useRef } from "react";
import { useStudentRegistrations, useRegisterForProgram } from "@/lib/api/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function ProgramRegistration() {
  const [page, setPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>(undefined);
  const [acceptanceLetter, setAcceptanceLetter] = useState<File | undefined>(undefined);
  const [geoletter, setGeoletter] = useState<File | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Additional form fields required by RegisterInput
  const [academicAdvisorId, setAcademicAdvisorId] = useState("");
  const [advisingConfirmation, setAdvisingConfirmation] = useState(false);
  const [academicAdvisor, setAcademicAdvisor] = useState("");
  const [academicAdvisorEmail, setAcademicAdvisorEmail] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [mentorEmail, setMentorEmail] = useState("");
  const [semester, setSemester] = useState(0);
  const [totalSks, setTotalSks] = useState(0);

  const { data, isLoading, error } = useStudentRegistrations(page, 6);
  const registerMutation = useRegisterForProgram();

  const acceptanceLetterRef = useRef<HTMLInputElement>(null);
  const geoletterRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | undefined) => void) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(undefined);
    }
  };

  const handleOpenDialog = (programId: string) => {
    setSelectedProgram(programId);
    setIsDialogOpen(true);
    // Reset all form fields when opening dialog
    setAcceptanceLetter(undefined);
    setGeoletter(undefined);
    setAcademicAdvisorId("");
    setAdvisingConfirmation(false);
    setAcademicAdvisor("");
    setAcademicAdvisorEmail("");
    setMentorName("");
    setMentorEmail("");
    setSemester(0);
    setTotalSks(0);
    if (acceptanceLetterRef.current) acceptanceLetterRef.current.value = "";
    if (geoletterRef.current) geoletterRef.current.value = "";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProgram) return;

    try {
      // Provide all required properties for RegisterInput
      await registerMutation.mutateAsync({
        activityId: selectedProgram,
        academic_advisor_id: academicAdvisorId,
        advising_confirmation: advisingConfirmation,
        academic_advisor: academicAdvisor,
        academic_advisor_email: academicAdvisorEmail,
        mentor_name: mentorName,
        mentor_email: mentorEmail,
        semester: semester,
        total_sks: totalSks,
        acceptanceLetter: acceptanceLetter,
        geoletter: geoletter,
      });

      alert("Registration successful!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading programs...</div>;
  }

  if (error) {
    return <div>Error loading programs: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Available Programs</h2>

      {data && data.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((registration) => (
              <Card key={registration.id} className="h-full">
                <CardHeader>
                  <CardTitle>{registration.activity_name}</CardTitle>
                  <span className="text-sm text-gray-500">{registration.academic_advisor_email}</span>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">{registration.mentor_name.substring(0, 150)}...</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {registration.lo_validation}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {registration.academic_advisor_validation} credits
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {registration.approval_status} seats
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Total SKS: {registration.total_sks}</span>
                    <span>End: {registration.semester}</span>
                  </div>
                  <Button onClick={() => handleOpenDialog(registration.id)} className="w-full">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.data || data.data.length < 6}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No programs found.</p>
        </div>
      )}

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="academicAdvisor">Academic Advisor Name</Label>
              <Input
                id="academicAdvisor"
                value={academicAdvisor}
                onChange={(e) => setAcademicAdvisor(e.target.value)}
                placeholder="Enter academic advisor name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicAdvisorEmail">Academic Advisor Email</Label>
              <Input
                id="academicAdvisorEmail"
                type="email"
                value={academicAdvisorEmail}
                onChange={(e) => setAcademicAdvisorEmail(e.target.value)}
                placeholder="Enter academic advisor email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorName">Mentor Name</Label>
              <Input
                id="mentorName"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="Enter mentor name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentorEmail">Mentor Email</Label>
              <Input
                id="mentorEmail"
                type="email"
                value={mentorEmail}
                onChange={(e) => setMentorEmail(e.target.value)}
                placeholder="Enter mentor email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={semester.toString()} onValueChange={(value) => setSemester(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                  <SelectItem value="5">Semester 5</SelectItem>
                  <SelectItem value="6">Semester 6</SelectItem>
                  <SelectItem value="7">Semester 7</SelectItem>
                  <SelectItem value="8">Semester 8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSks">Total SKS</Label>
              <Input
                id="totalSks"
                type="number"
                value={totalSks}
                onChange={(e) => setTotalSks(parseInt(e.target.value) || 0)}
                placeholder="Enter total SKS"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="advisingConfirmation"
                  checked={advisingConfirmation}
                  onCheckedChange={(checked) => setAdvisingConfirmation(checked === true)}
                />
                <Label htmlFor="advisingConfirmation">I confirm that I have received proper academic advising</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acceptanceLetter">Acceptance Letter</Label>
              <Input
                id="acceptanceLetter"
                type="file"
                ref={acceptanceLetterRef}
                onChange={(e) => handleFileChange(e, setAcceptanceLetter)}
                accept=".pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500">Upload your acceptance letter (PDF, DOC, DOCX)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geoletter">Geoletter</Label>
              <Input
                id="geoletter"
                type="file"
                ref={geoletterRef}
                onChange={(e) => handleFileChange(e, setGeoletter)}
                accept=".pdf,.doc,.docx"
              />
              <p className="text-xs text-gray-500">Upload your geoletter (PDF, DOC, DOCX)</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={registerMutation.isLoading}>
                {registerMutation.isLoading ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
