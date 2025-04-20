'use client';

import { useState } from 'react';
import { usePrograms, useRegisterForProgram } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProgramRegistration() {
  const [page, setPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const { data, isLoading, error } = usePrograms(page, 6);
  const registerMutation = useRegisterForProgram();

  const handleRegister = async (programId: string) => {
    try {
      setSelectedProgram(programId);
      await registerMutation.mutateAsync({
        programId,
        documents: [
          {
            type: 'CV',
            url: 'https://example.com/cv.pdf',
          },
          {
            type: 'TRANSCRIPT',
            url: 'https://example.com/transcript.pdf',
          },
        ],
      });
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setSelectedProgram(null);
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

      {data && data.programs && data.programs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.programs.map((program) => (
              <Card key={program.id} className="h-full">
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <span className="text-sm text-gray-500">{program.partner}</span>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm">{program.description.substring(0, 150)}...</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {program.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {program.credits} credits
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {program.seats} seats
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Start: {new Date(program.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(program.endDate).toLocaleDateString()}</span>
                  </div>
                  <Button
                    onClick={() => handleRegister(program.id)}
                    disabled={registerMutation.isLoading && selectedProgram === program.id}
                    className="w-full"
                  >
                    {registerMutation.isLoading && selectedProgram === program.id
                      ? 'Registering...'
                      : 'Register Now'}
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
                disabled={!data.programs || data.programs.length < 6}
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
    </div>
  );
} 