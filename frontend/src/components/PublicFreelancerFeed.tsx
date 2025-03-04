import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api';

interface PublicFreelancer {
  id: number;
  name: string;
  title: string;
  skills: string[];
  hourly_rate: number;
  completed_jobs: number;
  rating: number;
  avatar_url?: string;
}

export function PublicFreelancerFeed() {
  const [freelancers, setFreelancers] = useState<PublicFreelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await apiClient.get<PublicFreelancer[]>('/freelancers/public');
        setFreelancers(response);
      } catch (err) {
        setError('Failed to load freelancers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
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
      {freelancers.map((freelancer) => (
        <motion.div
          key={freelancer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {freelancer.avatar_url ? (
                <img
                  src={freelancer.avatar_url}
                  alt={freelancer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  {freelancer.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{freelancer.name}</h3>
              <p className="text-gray-600">{freelancer.title}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {freelancer.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-medium">${freelancer.hourly_rate}/hr</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★</span>
              <span>{freelancer.rating.toFixed(1)}</span>
              <span className="text-gray-500">({freelancer.completed_jobs} jobs)</span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Sign in to view profile
          </button>
        </motion.div>
      ))}
    </div>
  );
} 