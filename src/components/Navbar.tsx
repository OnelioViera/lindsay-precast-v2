"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="https://static.wixstatic.com/media/9011e5_9bdc6f129fdd469d894bae1b24376e71~mv2.png/v1/fill/w_980,h_492,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/LP%20White%20Logo.png"
                alt="Lindsay Precast Logo"
                width={50}
                height={50}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/forms"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/forms"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Forms
              </Link>
              <Link
                href="/symons"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/symons"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Symons
              </Link>
              <Link
                href="/engineering"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/engineering"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Engineering
              </Link>
              <Link
                href="/types-form-holes"
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === "/types-form-holes"
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Holes
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/"
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/forms"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/forms"
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Forms
            </Link>
            <Link
              href="/symons"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/symons"
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Symons
            </Link>
            <Link
              href="/engineering"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/engineering"
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Engineering
            </Link>
            <Link
              href="/types-form-holes"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/types-form-holes"
                  ? "text-white bg-gray-900"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              Holes
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
