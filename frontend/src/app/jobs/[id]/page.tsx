'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Briefcase,
  CheckCircle,
  Users,
  Building
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface JobProfileProps {
  params: {
    id: string;
  };
}

const fetchJobProfile = async (id: string) => {
  const response = await fetch(`/api/jobs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job profile');
  }
  return response.json();
};

export default function JobProfile({ params }: JobProfileProps) {
  const [isApplying, setIsApplying] = useState(false);
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', params.id],
    queryFn: () => fetchJobProfile(params.id)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading job profile
      </div>
    );
  }

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`/api/jobs/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to apply');
      }
      // Handle successful application
    } catch (error) {
      console.error('Error applying:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header Section */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
            <h1 className="text-3xl font-bold text-white">{job.title}</h1>
            <div className="flex items-center mt-2 text-white/90">
              <Building className="w-4 h-4 mr-2" />
              <span>{job.company_name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
              <span>${job.hourly_rate}/hr</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-500 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              <span>{job.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <span>{job.availability}</span>
            </div>
          </div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose max-w-none mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">About the Project</h2>
            <p className="text-gray-600">{job.description}</p>
          </motion.div>

          {/* Required Skills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Preferred Qualifications */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Preferred Qualifications</h2>
            <ul className="space-y-2">
              {job.preferred_qualifications.map((qual: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1" />
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Client Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-4 bg-gray-50 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-4">About the Client</h2>
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={job.client_avatar || '/default-avatar.png'}
                  alt="Client"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{job.client_name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{job.client_rating} ({job.total_reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>{job.total_hires} hires</span>
              <Briefcase className="w-4 h-4 ml-4 mr-2" />
              <span>{job.projects_posted} projects posted</span>
            </div>
          </motion.div>

          {/* Apply Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <button
              onClick={handleApply}
              disabled={isApplying}
              className={`
                w-full sm:w-auto px-8 py-3 rounded-lg text-white font-medium
                ${isApplying 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all'
                }
              `}
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 