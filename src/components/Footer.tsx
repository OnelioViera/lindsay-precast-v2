"use client";

import Link from "next/link";

interface FooterProps {
  children?: React.ReactNode;
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 py-4">
      <div className="max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Lindsay Precast. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            {children}
            <Link
              href="/forms"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Forms
            </Link>
            <Link
              href="/symons"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Symons
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
