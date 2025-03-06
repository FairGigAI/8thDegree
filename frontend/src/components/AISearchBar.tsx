'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Brain, Sparkles, Briefcase, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  category: string;
}

interface Freelancer {
  id: string;
  name: string;
  image: string;
  role: string;
}

interface SearchSuggestions {
  jobs: Job[];
  freelancers: Freelancer[];
}

const searchPrompts = [
  "I need a full-stack developer who knows React and Node.js",
  "Looking for a UI/UX designer for my mobile app",
  "Need a Python developer with AI experience",
  "Seeking a DevOps engineer familiar with AWS",
];

export function AISearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ jobs: [], freelancers: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Animated placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % searchPrompts.length);
      setIsTyping(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Debounced search function with AI analysis
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setSuggestions({ jobs: [], freelancers: [] });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/search/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={searchPrompts[currentPromptIndex]}
          className="w-full px-6 py-4 text-lg rounded-full border-2 border-primary/20 focus:border-primary focus:outline-none pr-12 shadow-lg text-gray-900 placeholder:text-gray-600"
        />
        <div className="absolute right-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 360 
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  rotate: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                <Brain className="w-6 h-6 text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Search className="w-6 h-6 text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && (query || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-6 text-center">
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Brain className="w-8 h-8 text-primary" />
                  <p className="text-gray-600">AI is analyzing your request...</p>
                </motion.div>
              </div>
            ) : (
              <>
                {suggestions.jobs.length > 0 && (
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Matching Jobs
                    </h3>
                    <div className="space-y-2">
                      {suggestions.jobs.map((job) => (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.id}`}
                          className="flex items-start p-3 hover:bg-blue-50 rounded-lg group transition-colors"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {job.skills.slice(0, 2).join(', ')}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.freelancers.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Recommended Freelancers
                    </h3>
                    <div className="space-y-2">
                      {suggestions.freelancers.map((freelancer) => (
                        <Link
                          key={freelancer.id}
                          href={`/freelancers/${freelancer.id}`}
                          className="flex items-center p-3 hover:bg-blue-50 rounded-lg group transition-colors"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {freelancer.name}
                            </div>
                            <div className="text-sm text-gray-500">{freelancer.role}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading && suggestions.jobs.length === 0 && suggestions.freelancers.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p>No matches found. Try adjusting your search.</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Onboarding Tips */}
      <AnimatePresence>
        {!query && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 text-center"
          >
            <p className="text-sm text-gray-500">
              Try describing your project needs or the type of freelancer you're looking for
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {searchPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(prompt);
                    setShowSuggestions(true);
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-sm text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  {prompt.slice(0, 20)}...
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 