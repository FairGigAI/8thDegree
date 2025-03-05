'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WaitlistModal } from './WaitlistModal';

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleContributeClick = () => {
    router.push('/contribute');
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">8thDegree</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className={`text-sm ${
                    isActive('/')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/under-construction"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Features
                </Link>
                <Link
                  href="/under-construction"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Documents
                </Link>
                <Link
                  href="/contribute"
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Contribute</span>
                </Link>
              </div>
            </div>

            {/* Right side navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/under-construction"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Find Jobs
              </Link>
              <Link
                href="/under-construction"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Find Talent
              </Link>
              <button
                onClick={() => setShowWaitlist(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className={`block px-3 py-2 text-base font-medium ${
                    isActive('/')
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/under-construction"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Features
                </Link>
                <Link
                  href="/under-construction"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Documents
                </Link>
                <Link
                  href="/contribute"
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="ml-2">Contribute</span>
                  </span>
                </Link>
                <Link
                  href="/under-construction"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Find Jobs
                </Link>
                <Link
                  href="/under-construction"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Find Talent
                </Link>
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Waitlist Modal */}
        <WaitlistModal
          isOpen={showWaitlist}
          onClose={() => setShowWaitlist(false)}
        />
      </nav>
    </>
  );
}
