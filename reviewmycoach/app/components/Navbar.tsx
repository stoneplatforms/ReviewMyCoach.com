'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase-client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import GlobalSearchBar from './GlobalSearchBar';
import { useAuth } from '../lib/hooks/useAuth';

export default function Navbar() {
  const { user, loading, isCoach } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-700 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform" onClick={closeMenu}>
              <Image
                src="/reviewmycoachlogo.png"
                alt="ReviewMyCoach Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <GlobalSearchBar placeholder="Search coaches, sports, or locations..." />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800">
              Home
            </Link>
            <Link href="/coaches" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800">
              Find Coaches
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800">
              About
            </Link>
            {user && (
              <Link href="/dashboard" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800">
                Dashboard
              </Link>
            )}

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-20 bg-slate-700 rounded"></div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800">
                      <div className="h-8 w-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full flex items-center justify-center ring-2 ring-slate-600">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <span className="text-white font-medium">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <span className="hidden lg:block">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-700">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-sky-400">
                        Your Profile
                      </Link>
                      <Link href="/my-reviews" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-sky-400">
                        My Reviews
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-sky-400">
                        Settings
                      </Link>
                      {isCoach && (
                        <Link href="/subscription" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-sky-400">
                          Subscription
                        </Link>
                      )}
                      <hr className="my-1 border-slate-700" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/signin"
                    className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-accent px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-sky-400 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 transition-all"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-t border-slate-700">
            {/* Mobile Search Bar */}
            <div className="px-3 py-2">
              <GlobalSearchBar placeholder="Search coaches..." showSuggestions={false} />
            </div>
            
            <Link
              href="/"
              onClick={closeMenu}
              className="text-slate-300 hover:text-sky-400 block px-3 py-2 rounded-md text-base font-medium transition-all hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              href="/coaches"
              onClick={closeMenu}
              className="text-slate-300 hover:text-sky-400 block px-3 py-2 rounded-md text-base font-medium transition-all hover:bg-slate-800"
            >
              Find Coaches
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="text-slate-300 hover:text-sky-400 block px-3 py-2 rounded-md text-base font-medium transition-all hover:bg-slate-800"
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="text-slate-300 hover:text-sky-400 block px-3 py-2 rounded-md text-base font-medium transition-all hover:bg-slate-800"
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Authentication */}
            <div className="pt-4 pb-3 border-t border-slate-700">
              {loading ? (
                <div className="animate-pulse px-3 py-2">
                  <div className="h-8 w-24 bg-slate-700 rounded"></div>
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-10 w-10 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full flex items-center justify-center ring-2 ring-slate-600">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-slate-300">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-400 transition-all hover:bg-slate-800"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/my-reviews"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-400 transition-all hover:bg-slate-800"
                  >
                    My Reviews
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-400 transition-all hover:bg-slate-800"
                  >
                    Settings
                  </Link>
                  {isCoach && (
                    <Link
                      href="/subscription"
                      onClick={closeMenu}
                      className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-400 transition-all hover:bg-slate-800"
                    >
                      Subscription
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:text-red-300 transition-all hover:bg-slate-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/signin"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-sky-400 transition-all hover:bg-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium btn-accent rounded-md mx-3"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 