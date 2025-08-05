'use client';

import { useState, useEffect, Suspense } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase-client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from 'next/link';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      // Always redirect to dashboard first, let dashboard handle onboarding check
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during Google sign in');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during auth check to prevent hydration mismatch
  if (authLoading || user) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-black/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-500/20 p-8 space-y-8 ring-1 ring-white/10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-2xl ring-4 ring-orange-500/30">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="mt-8 text-center text-4xl font-bold tracking-tight text-white">
              WELCOME BACK
            </h1>
            <p className="mt-4 text-center text-lg text-gray-300 font-medium">
              Ready to dominate your goals?
            </p>
            <p className="mt-3 text-center text-sm text-gray-400">
              New here?{' '}
              <Link href="/signup" className="font-bold text-orange-400 hover:text-orange-300 transition-colors duration-200 underline decoration-orange-400/50">
                JOIN THE TEAM
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleEmailSignIn}>
            {error && (
              <div className="rounded-xl bg-red-900/30 border border-red-800/50 p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">
                      Authentication Error
                    </h3>
                    <div className="mt-2 text-sm text-red-200">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-5 py-4 border-2 border-gray-700 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-gray-900/50 hover:bg-gray-900/70 text-base font-medium backdrop-blur-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-5 py-4 border-2 border-gray-700 placeholder-gray-400 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 bg-gray-900/50 hover:bg-gray-900/70 text-base font-medium backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-orange-500 focus:ring-orange-500/50 border-2 border-gray-600 bg-gray-900 rounded-lg transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300 font-medium">
                  KEEP ME LOGGED IN
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-orange-400 hover:text-orange-300 transition-colors duration-200 underline decoration-orange-400/50">
                  FORGOT PASSWORD?
                </a>
              </div>
            </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Sign in
            </button>
          </div>

            <div>
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gradient-to-r from-transparent via-orange-500/30 to-transparent" style={{
                    background: 'linear-gradient(to right, transparent, rgb(249 115 22 / 0.3), transparent)',
                    height: '2px',
                    border: 'none'
                  }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 py-2 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-orange-400 font-bold text-sm uppercase tracking-widest border border-orange-500/30 rounded-full">
                    OR SIGN IN WITH
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-4 px-6 border-2 border-gray-700 rounded-2xl shadow-lg bg-gray-900/50 text-base font-bold text-white hover:bg-gray-800/70 hover:border-orange-500/50 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 uppercase tracking-wider backdrop-blur-sm"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                GOOGLE SIGN IN
              </button>
            </div>
        </form>

          {/* Footer */}
          <div className="text-center pt-6">
            <Link href="/" className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200 font-medium uppercase tracking-wider">
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <SignInForm />
    </Suspense>
  );
} 