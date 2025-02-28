"use client";

import { useState } from "react";

interface DarkModeWrapperProps {
  children: React.ReactNode;
}

export default function DarkModeWrapper({ children }: DarkModeWrapperProps) {
  const [isDarkMode, ] = useState(true); // Enable dark mode by default

  return (
    <main className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} transition-colors`}>
      {children}
    </main>
  );
}
