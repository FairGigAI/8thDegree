import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';

interface PublicJob {
  id: number;
  title: string;
  description: string;
  budget: number;
  required_skills: string[];
  created_at: string;
  client: {
    id: number;
    name: string;
  };
}

export function PublicJobFeed() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get<PublicJob[]>('/jobs/public');
        setJobs(response);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.required_skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-primary font-medium">${job.budget}</span>
            <button
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Sign in to view details
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 