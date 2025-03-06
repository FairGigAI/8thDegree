import { motion } from 'framer-motion';
import { HeroBackground } from './HeroBackground';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <HeroBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <motion.h1 
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="block xl:inline">Find the Perfect</span>{' '}
                <span className="block text-blue-600 xl:inline">AI-Powered Match</span>
              </motion.h1>
              <motion.p 
                className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-2xl sm:mx-auto md:mt-5 md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                AI-powered job matching makes global hiring effortless. Need a house built in across the country? A remote e-commerce assistant? A bilingual virtual receptionist? Let 8thDegree find the perfect match—fast.
              </motion.p>
              <div className="mt-5 sm:mt-8 flex justify-center gap-x-4">
                <div className="rounded-md shadow">
                  <motion.a
                    href="/jobs"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Get Started
                  </motion.a>
                </div>
                <div>
                  <motion.a
                    href="/about"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    Learn More
                  </motion.a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
} 