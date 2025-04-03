"use client";

export default function SymonsPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <main className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 pb-24 mt-16">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          {/* Page title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              Lindsay Precast
            </h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300">
              Symons Information
            </h2>
          </div>

          {/* Content placeholder */}
          <div className="w-full max-w-5xl text-gray-300 space-y-4 sm:space-y-6">
            <p className="text-center">
              Symons information will be displayed here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
