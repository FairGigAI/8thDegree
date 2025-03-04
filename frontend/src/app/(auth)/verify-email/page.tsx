'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Verification failed');
        }

        setStatus('success');
      } catch (err) {
        console.error('Email verification error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        {status === 'verifying' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Email verified successfully!</span>
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Proceed to login
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <div className="mt-4 text-center">
              <Link
                href="/resend-verification"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Resend verification email
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 