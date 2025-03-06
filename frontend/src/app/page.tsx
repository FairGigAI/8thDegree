"use client";

import { HeroSection } from '@/components/HeroSection';
import { LocalePriceBar } from '@/components/LocalePriceBar';
import { AIRecommendationsFeed } from '@/components/AIRecommendationsFeed';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PricingBar } from '@/components/PricingBar';
import { TrustSection } from '@/components/TrustSection';
import { CTASection } from '@/components/CTASection';
import { AISearchBar } from '@/components/AISearchBar';

const popularTopics = [
  'Full-Stack Development',
  'Machine Learning',
  'Mobile Apps',
  'Web3',
  'Cloud Architecture',
  'UI/UX Design',
  'DevOps',
  'Data Science',
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <LocalePriceBar />
      <HeroSection />

      {/* AI Search Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AISearchBar />
            {/* Popular Topics */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100 transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Feed */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Discover Opportunities
            <span className="block text-lg text-gray-600 mt-2 font-normal">
              Powered by AI to match your needs perfectly
            </span>
          </h2>
          <AIRecommendationsFeed />
        </div>
      </section>

      <FeaturesSection />
      <TrustSection />
      <PricingBar />
      <CTASection />
    </main>
  );
}