import { Suspense } from 'react';
// import { ActivitiesList } from '@/components/examples/activities-list';
import { ProgramRegistration } from '@/components/examples/activity-registration';
import { StudentRegistrations } from '@/components/examples/student-registrations';
import { ReactQueryProvider } from '@/lib/api/providers/query-provider';

export default function ApiExamplePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">API Integration Examples</h1>
      
      <ReactQueryProvider>
        <div className="space-y-12">
          {/* <section>
            <h2 className="text-xl font-semibold mb-4">Activities Service</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Suspense fallback={<div>Loading activities...</div>}>
                <ActivitiesList />
              </Suspense>
            </div>
          </section> */}
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Registration Service</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Suspense fallback={<div>Loading programs...</div>}>
                <ProgramRegistration />
              </Suspense>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Student Registrations</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Suspense fallback={<div>Loading student registrations...</div>}>
                <StudentRegistrations />
              </Suspense>
            </div>
          </section>
        </div>
      </ReactQueryProvider>
    </div>
  );
} 