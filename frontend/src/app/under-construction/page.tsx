'use client';

import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <Construction className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Under Construction</h1>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you something amazing. Check back soon!
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 