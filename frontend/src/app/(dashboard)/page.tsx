'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BriefcaseIcon,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  FileCheck,
  Award,
  CheckCircle,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  company_name: string;
  hourly_rate: number;
  description: string;
  skills: string[];
  similarity_score: number;
}

interface TouchPoint {
  icon: React.ReactNode;
  label: string;
  completed: boolean;
}

const fetchMatchingJobs = async (userId: string) => {
  const response = await fetch(`/api/match-jobs/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch matching jobs');
  }
  return response.json();
};

const searchJobs = async (query: string) => {
  const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search jobs');
  }
  return response.json();
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch AI-recommended jobs
  const { data: matchingJobs = [], isLoading: isLoadingMatches } = useQuery({
    queryKey: ['matching-jobs', session?.user?.id],
    queryFn: () => fetchMatchingJobs(session?.user?.id as string),
    enabled: !!session?.user?.id,
  });

  // Search results
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['job-search', debouncedQuery],
    queryFn: () => searchJobs(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  // 8 Touches to Success tracker
  const touchPoints: TouchPoint[] = [
    { icon: <Users className="w-6 h-6" />, label: 'Complete Profile', completed: true },
    { icon: <Star className="w-6 h-6" />, label: 'Set Skills & Rate', completed: true },
    { icon: <MessageSquare className="w-6 h-6" />, label: 'First Message', completed: false },
    { icon: <BriefcaseIcon className="w-6 h-6" />, label: 'Apply to Jobs', completed: false },
    { icon: <FileCheck className="w-6 h-6" />, label: 'Submit Proposal', completed: false },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Get Hired', completed: false },
    { icon: <Award className="w-6 h-6" />, label: 'Complete Project', completed: false },
    { icon: <Star className="w-6 h-6" />, label: 'Receive Review', completed: false },
  ];

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name}</h1>
          <p className="mt-2 text-gray-600">Here are your personalized job matches and progress.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for jobs..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {debouncedQuery.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">Searching...</div>
                ) : (
                  searchResults.map((job: Job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block p-4 hover:bg-gray-50 border-b last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company_name}</p>
                        </div>
                        <span className="text-blue-600">${job.hourly_rate}/hr</span>
                      </div>
                    </Link>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  AI-Recommended Jobs
                </h2>
              </div>

              {isLoadingMatches ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchingJobs.map((job: Job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <Link href={`/jobs/${job.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.company_name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {job.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-blue-600 font-medium">
                              ${job.hourly_rate}/hr
                            </span>
                            <div className="mt-1 text-sm text-green-600">
                              {Math.round(job.similarity_score * 100)}% match
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                          {job.description}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">8 Touches to Success</h2>
              <div className="space-y-4">
                {touchPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg ${
                      point.completed ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        point.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {point.icon}
                    </div>
                    <span className="ml-3 font-medium">{point.label}</span>
                    {point.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Profile Strength</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Job Matches</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 