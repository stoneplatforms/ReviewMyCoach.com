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
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">ReviewMyCoach</span>
              <span className="ml-2 text-lg font-bold text-gray-900 sm:hidden">RMC</span>
            </Link>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <GlobalSearchBar placeholder="Search coaches, sports, or locations..." />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
            <Link href="/coaches" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Find Coaches
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </Link>
            {user && (
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </Link>
            )}

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {user.photoURL ? (
                          <Image
                            src={user.photoURL}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <span className="text-blue-600 font-medium">
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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link href="/my-reviews" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Reviews
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      {isCoach && (
                        <Link href="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Subscription
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Search Bar */}
            <div className="px-3 py-2">
              <GlobalSearchBar placeholder="Search coaches..." showSuggestions={false} />
            </div>
            
            <Link
              href="/"
              onClick={closeMenu}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/coaches"
              onClick={closeMenu}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Find Coaches
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Dashboard
              </Link>
            )}

            {/* Mobile Authentication */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {loading ? (
                <div className="animate-pulse px-3 py-2">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              ) : user ? (
                <div className="space-y-1">
                  <div className="flex items-center px-3 py-2">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="/my-reviews"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    My Reviews
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    Settings
                  </Link>
                  {isCoach && (
                    <Link
                      href="/subscription"
                      onClick={closeMenu}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                    >
                      Subscription
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/signin"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-3"
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