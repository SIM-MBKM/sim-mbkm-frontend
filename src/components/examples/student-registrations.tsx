'use client';

import { useState } from 'react';
import { useStudentRegistrations } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StudentRegistrations() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useStudentRegistrations(page, 5);

  if (isLoading) {
    return <div>Loading registrations...</div>;
  }

  if (error) {
    return <div>Error loading registrations: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your Registered Programs</h2>

      {data && data.data && data.data.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.data.map((registration) => (
              <Card key={registration.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{registration.activity_name}</span>
                    <Badge 
                      className={
                        registration.lo_validation === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : registration.lo_validation === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {registration.lo_validation}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Program Details</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">Semester: {registration.semester}</p>
                        <p className="text-sm">Total Credits: {registration.total_sks}</p>
                        <p className="text-sm">
                          Advisor: {registration.academic_advisor} ({registration.academic_advisor_email})
                        </p>
                        <p className="text-sm">
                          Mentor: {registration.mentor_name} ({registration.mentor_email})
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Documents</h3>
                      <div className="mt-2 space-y-2">
                        {registration.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center">
                            <span className="text-sm mr-2">{doc.document_type}:</span>
                            <a
                              href={`/api/file/${doc.file_storage_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {doc.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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
              <span className="flex items-center px-4">
                Page {page} of {data.total_pages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.next_page_url}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No registrations found.</p>
        </div>
      )}
    </div>
  );
} 