// src/app/auth/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4B919B] to-[#093E47] relative overflow-x-hidden">
        {/* Decorative circles - matching the design */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="fixed top-0 left-1/20 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2"></div>
        <div className="fixed top-1/20 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2"></div>
        <div className="fixed bottom-0 right-1/20 w-96 h-96 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="fixed bottom-1/20 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col items-center space-y-2 max-w-sm w-full mx-auto px-6 top-10">

        {/* Title */}
        <h1 className="text-5xl font-bold text-white text-center mb-12">
          Welcome Back
        </h1>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-[#093E47] text-xs font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:transform-none"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Log In with Google</span>
        </button>

        {/* Or separator */}
        <div className="w-full flex items-center space-x-4">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/70 font-medium">Or</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full mb-15 bg-white backdrop-blur-sm rounded-3xl py-8 px-6 shadow-2xl">
          <div className="space-y-3 flex flex-col text-xs">
            {/* Email Input */}
            <div>
              <label className="block text-gray-600 font-medium mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#E2E2E2] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6E77] focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-600 font-medium mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#E2E2E2] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2F6E77] focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center bg-red-50 p-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-[70%] mx-auto my-3 py-2 bg-[#2F6E77] hover:bg-[#093E47] text-white font-semibold rounded-3xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? 'Signing In...' : 'Log In'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-xs">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/auth/signup')}
                className="text-teal-600 hover:text-teal-700 font-medium underline transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
