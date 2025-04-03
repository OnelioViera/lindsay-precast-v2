"use client";

import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <Toaster position="top-right" />
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 flex-1 flex items-center justify-center">
        <div className="relative w-full">
          {/* Main content container */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-3xl p-6 sm:p-12 shadow-2xl border border-gray-700/50 transition-all duration-300 hover:shadow-3xl">
            <div className="flex flex-col items-center space-y-8 sm:space-y-12">
              {/* Logo */}
              <div className="w-full max-w-2xl">
                <img
                  src="https://static.wixstatic.com/media/9011e5_9bdc6f129fdd469d894bae1b24376e71~mv2.png/v1/fill/w_980,h_492,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/LP%20White%20Logo.png"
                  alt="Lindsay Precast Logo"
                  className="w-full h-auto"
                />
              </div>

              {/* Hero text section */}
              <div className="text-center space-y-4 sm:space-y-6">
                <p className="text-2xl sm:text-3xl text-gray-300 font-light max-w-2xl mx-auto">
                  Forms, Symons, and Engineering Information
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
