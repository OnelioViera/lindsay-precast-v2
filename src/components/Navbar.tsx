"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="https://static.wixstatic.com/media/9011e5_9bdc6f129fdd469d894bae1b24376e71~mv2.png/v1/fill/w_980,h_492,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/LP%20White%20Logo.png"
              alt="Lindsay Precast Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/"
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                pathname === "/"
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              Home
            </Link>
            <Link
              href="/forms"
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                pathname === "/forms"
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              Forms
            </Link>
            <Link
              href="/symons"
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                pathname === "/symons"
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              Symons
            </Link>
            <Link
              href="/engineering"
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                pathname === "/engineering"
                  ? "text-blue-400"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              Engineering
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
