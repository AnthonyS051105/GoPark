// src/app/auth/status/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function StatusPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4B919B] to-[#093E47] relative overflow-hidden">
      {/* Decorative circles - matching the design */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 left-1/20 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2"></div>
      <div className="absolute top-1/20 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-1/20 w-96 h-96 bg-white/5 rounded-full translate-y-1/2"></div>
      <div className="absolute bottom-1/20 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
            <img src="/carputih.png" alt="Logo"/>
        </div>

        {/* Apple Logo */}
        {/* <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
        </div> */}

        {/* Title */}
        {/* <h1 className="text-4xl font-bold text-white text-center mb-8">
          EasyParking
        </h1> */}

        {/* Get Started Button */}
        <button
          onClick={() => router.push('/auth/signup')}
          className="w-full py-3 px-6 bg-white/90 hover:bg-white text-gray-800 font-semibold rounded-3xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          GET STARTED
        </button>

        {/* Already have account link */}
        <button
          onClick={() => router.push('/auth/login')}
          className="text-white/90 hover:text-[#093E47] font-medium cursor-pointer transition-colors duration-200"
        >
          I ALREADY HAVE AN ACCOUNT
        </button>
      </div>
    </main>
  );
}
