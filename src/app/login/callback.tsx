// pages/auth/callback.tsx or app/auth/callback/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          setError(errorParam);
          setStatus('error');
          return;
        }

        if (token && userData) {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Store token in localStorage
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
          
          setStatus('success');
          
          // Redirect to dashboard or intended page
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          setError('Missing authentication data');
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        setError('Failed to process authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#013880] mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing authentication...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Authentication Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-[#013880] hover:bg-[#012660] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Authentication completed. Redirecting...</span>
        </div>
      </div>
    </div>
  );
}