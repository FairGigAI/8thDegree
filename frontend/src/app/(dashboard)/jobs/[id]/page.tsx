'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  category: string;
  client_id: number;
  status: string;
  created_at: string;
  client: {
    full_name: string;
    company_name: string | null;
  };
}

interface ApplicationFormData {
  cover_letter: string;
  proposed_rate: number;
}

interface Session {
  user?: {
    id?: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string;
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ApplicationFormData>({
    cover_letter: '',
    proposed_rate: 0,
  });

  const fetchJob = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }

      const data = await response.json();
      setJob(data);
    } catch (err) {
      console.error('Job fetch error:', err);
      setError('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, session?.accessToken]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchJob();
    }
  }, [status, router, fetchJob]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsApplying(true);
    setApplicationError(null);

    try {
      const response = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to apply for job');
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Job application error:', err);
      setApplicationError(err instanceof Error ? err.message : 'Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Failed to load job details</div>
      </div>
    );
  }

  const currentSession = session as Session;
  const canApply = currentSession?.user?.id !== job.client_id && job.status === 'open';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <Link
                href="/jobs"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Jobs
              </Link>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Posted by: {job.client.full_name}</p>
                  {job.client.company_name && <p>Company: {job.client.company_name}</p>}
                  <p>Budget: ${job.budget}</p>
                  <p>Category: {job.category}</p>
                  <p>Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <div className="mt-2 prose prose-sm text-gray-500">
                  {job.description}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900">Required Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {canApply && (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Apply for this Job</h2>

                  {applicationError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                      <span className="block sm:inline">{applicationError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="proposed_rate" className="block text-sm font-medium text-gray-700">
                        Your Proposed Rate ($)
                      </label>
                      <input
                        type="number"
                        name="proposed_rate"
                        id="proposed_rate"
                        required
                        min="0"
                        value={formData.proposed_rate}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700">
                        Cover Letter
                      </label>
                      <textarea
                        name="cover_letter"
                        id="cover_letter"
                        rows={6}
                        required
                        value={formData.cover_letter}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Explain why you're the best candidate for this job..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplying ? 'Applying...' : 'Apply Now'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 