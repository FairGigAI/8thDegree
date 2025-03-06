'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Briefcase, User } from 'lucide-react';
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

export function SearchSection() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({ jobs: [], freelancers: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced search function
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
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for jobs or freelancers..."
          className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      {showSuggestions && (query || isLoading) && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading suggestions...</div>
          ) : (
            <>
              {suggestions.jobs.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Jobs</h3>
                  <div className="space-y-2">
                    {suggestions.jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="flex items-start p-2 hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <Briefcase className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">
                            {job.skills.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.freelancers.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Freelancers</h3>
                  <div className="space-y-2">
                    {suggestions.freelancers.map((freelancer) => (
                      <Link
                        key={freelancer.id}
                        href={`/freelancers/${freelancer.id}`}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="font-medium text-gray-900">{freelancer.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && suggestions.jobs.length === 0 && suggestions.freelancers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 