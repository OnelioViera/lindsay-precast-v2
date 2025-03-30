"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-gray-800 border-b border-gray-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/"
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/forms"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/forms"
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Forms
          </Link>
          <Link
            href="/symons"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/symons"
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Symons
          </Link>
          <Link
            href="/engineering"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/engineering"
                ? "bg-gray-900 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Engineering
          </Link>
        </div>
      </div>
    </nav>
  );
}
