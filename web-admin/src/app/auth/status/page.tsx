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

        {/* Get Started Button */}
        <button
          onClick={() => router.push('/auth/signup')}
          className="w-full py-3 px-6 bg-white/90 hover:bg-white text-[#093E47] font-bold rounded-3xl cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          GET STARTED
        </button>

        {/* Already have account link */}
        <button
          onClick={() => router.push('/auth/login')}
          className="text-white hover:text-[#2F6E77] font-medium cursor-pointer transition-colors duration-200"
        >
          I ALREADY HAVE AN ACCOUNT
        </button>
      </div>
    </main>
  );
}
