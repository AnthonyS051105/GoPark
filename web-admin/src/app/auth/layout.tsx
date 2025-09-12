// src/app/auth/layout.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4B919B] to-[#093E47]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!user) {
    return <>{children}</>;
  }

  // Redirect will happen via useEffect
  return null;
}
