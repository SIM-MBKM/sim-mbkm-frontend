'use client';

import { useState, useRef } from 'react';
import { useStudentRegistrations, useRegisterForProgram } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ProgramRegistration() {
  const [page, setPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [acceptanceLetter, setAcceptanceLetter] = useState<File | null>(null);
  const [geoletter, setGeoletter] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const { data, isLoading, error } = usePrograms(page, 6);
  const { data, isLoading, error } = useStudentRegistrations(page, 6);
  const registerMutation = useRegisterForProgram();
  
  const acceptanceLetterRef = useRef<HTMLInputElement>(null);
  const geoletterRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleOpenDialog = (programId: string) => {
    setSelectedProgram(programId);
    setIsDialogOpen(true);
    // Reset files when opening dialog
    setAcceptanceLetter(null);
    setGeoletter(null);
    if (acceptanceLetterRef.current) acceptanceLetterRef.current.value = '';
    if (geoletterRef.current) geoletterRef.current.value = '';
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedProgram) return;
    
    try {
      await registerMutation.mutateAsync({
        activityId: selectedProgram,
        acceptanceLetter: acceptanceLetter || undefined,
        geoletter: geoletter || undefined,
      });
      
      alert('Registration successful!');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
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
                    {/* <span>Start: {new Date(registration.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(registration.endDate).toLocaleDateString()}</span> */}
                    <span>Total SKS: {registration.total_sks}</span>
                    <span>End: {registration.semester}</span>
                  </div>
                  <Button
                    onClick={() => handleOpenDialog(registration.id)}
                    className="w-full"
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register for Program</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={registerMutation.isLoading}
              >
                {registerMutation.isLoading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 