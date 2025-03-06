import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-primary opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.15"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Brain className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join 8thDegree & Let AI Find the Right Match
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of freelancing with our AI-powered platform. 
              Get matched with the perfect opportunities tailored to your skills and preferences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary-dark transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center px-8 py-4 border-2 border-primary text-primary rounded-full text-lg font-semibold hover:bg-primary hover:text-white transform hover:scale-105 transition-all"
              >
                See How It Works
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">98%</span>
                Hire rate within 3 days
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">4.9/5</span>
                Average rating
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">50K+</span>
                Active freelancers
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 