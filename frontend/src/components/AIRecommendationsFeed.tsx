import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, Briefcase, Users, TrendingUp, CheckCircle } from 'lucide-react';

interface FreelancerCard {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
}

interface JobCard {
  id: string;
  title: string;
  company: string;
  budget: string;
  category: string;
  postedDate: string;
  status: 'open' | 'trending' | 'urgent';
}

export function AIRecommendationsFeed() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'freelancers'>('jobs');
  const [view, setView] = useState<'foryou' | 'trending'>('foryou');

  // Mock data - replace with API calls
  const freelancers: FreelancerCard[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      title: 'Full Stack Developer',
      rating: 4.9,
      hourlyRate: 85,
      skills: ['React', 'Node.js', 'TypeScript'],
    },
    // Add more freelancers...
  ];

  const jobs: JobCard[] = [
    {
      id: '1',
      title: 'AI-Powered Dashboard Development',
      company: 'TechCorp Inc.',
      budget: '$5,000 - $8,000',
      category: 'Web Development',
      postedDate: '2h ago',
      status: 'trending',
    },
    // Add more jobs...
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Toggle Tabs */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Briefcase className="w-5 h-5 inline-block mr-2" />
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('freelancers')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === 'freelancers'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Freelancers
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setView('foryou')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'foryou'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setView('trending')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              view === 'trending'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline-block mr-1" />
            Trending
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === 'freelancers'
            ? freelancers.map((freelancer) => (
                <div
                  key={freelancer.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                      <p className="text-gray-600">{freelancer.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-gray-400">• ${freelancer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            : jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    {job.status === 'trending' && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{job.company}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium">{job.budget}</span>
                    <span className="text-gray-400">• {job.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Payment Verified</span>
                    <span className="ml-auto">{job.postedDate}</span>
                  </div>
                </div>
              ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 