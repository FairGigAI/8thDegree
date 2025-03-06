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
  Mail,
  Globe,
  Award,
  ThumbsUp,
  Users,
  CheckCircle,
  Github,
  Linkedin
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FreelancerProfileProps {
  params: {
    id: string;
  };
}

const fetchFreelancerProfile = async (id: string) => {
  const response = await fetch(`/api/freelancers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch freelancer profile');
  }
  return response.json();
};

export default function FreelancerProfile({ params }: FreelancerProfileProps) {
  const [isContacting, setIsContacting] = useState(false);
  
  const { data: freelancer, isLoading, error } = useQuery({
    queryKey: ['freelancer', params.id],
    queryFn: () => fetchFreelancerProfile(params.id)
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
        Error loading freelancer profile
      </div>
    );
  }

  const handleContact = async () => {
    setIsContacting(true);
    try {
      const response = await fetch(`/api/freelancers/${params.id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      // Handle successful contact
    } catch (error) {
      console.error('Error contacting:', error);
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute -bottom-16 left-6">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={freelancer.avatar_url || '/default-avatar.png'}
                  alt={freelancer.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{freelancer.name}</h1>
                <p className="text-lg text-gray-600">{freelancer.title}</p>
              </div>
              <div className="flex items-center space-x-4">
                {freelancer.github_url && (
                  <a href={freelancer.github_url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {freelancer.linkedin_url && (
                  <a href={freelancer.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">{freelancer.description}</p>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Work History */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Work History</h2>
              <div className="space-y-4">
                {freelancer.work_history.map((work: any, index: number) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium text-lg">{work.title}</h3>
                    <p className="text-gray-600">{work.company}</p>
                    <p className="text-sm text-gray-500">{work.duration}</p>
                    <p className="mt-2">{work.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                  <span>${freelancer.hourly_rate}/hr</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                  <span>{freelancer.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-500 mr-2" />
                  <span>{freelancer.availability}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-blue-500 mr-2" />
                  <span>{freelancer.languages.join(', ')}</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span>Rating</span>
                  </div>
                  <span className="font-medium">{freelancer.rating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                    <span>Jobs Completed</span>
                  </div>
                  <span className="font-medium">{freelancer.completed_jobs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThumbsUp className="w-5 h-5 text-green-500 mr-2" />
                    <span>Success Rate</span>
                  </div>
                  <span className="font-medium">{freelancer.success_rate}%</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <button
                onClick={handleContact}
                disabled={isContacting}
                className={`
                  w-full px-6 py-3 rounded-lg text-white font-medium
                  ${isContacting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all'
                  }
                `}
              >
                {isContacting ? 'Sending Message...' : 'Contact Freelancer'}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {freelancer.reviews.map((review: any, index: number) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={review.client_avatar || '/default-avatar.png'}
                      alt={review.client_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{review.client_name}</h3>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 