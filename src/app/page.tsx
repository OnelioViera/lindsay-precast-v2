"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference for dark mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <main className="w-full max-w-5xl mx-auto px-4">
        <div className="relative">
          {/* Main content container */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border border-gray-700/50 transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col items-center space-y-8 sm:space-y-12">
              {/* Logo */}
              <div className="w-full max-w-2xl transform transition-transform duration-300 hover:scale-105">
                <img
                  src="https://static.wixstatic.com/media/9011e5_9bdc6f129fdd469d894bae1b24376e71~mv2.png/v1/fill/w_980,h_492,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/LP%20White%20Logo.png"
                  alt="Lindsay Precast Logo"
                  className="w-full h-auto"
                />
              </div>

              {/* Hero text section */}
              <div className="text-center space-y-4 sm:space-y-6">
                <p className="text-2xl sm:text-3xl text-gray-300 font-light max-w-2xl mx-auto">
                  Forms and Symons Information
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full">
                <Link href="/forms" className="w-full sm:w-auto">
                  <button className="w-full px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 text-lg sm:text-xl font-medium shadow-lg hover:shadow-xl hover:scale-105">
                    Forms
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-300 text-lg sm:text-xl font-medium shadow-lg hover:shadow-xl hover:scale-105">
                  Simons
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
