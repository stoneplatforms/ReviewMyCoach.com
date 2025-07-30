'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase-client';
import { useRouter } from 'next/navigation';

type OnboardingStep = 'username' | 'role' | 'loading';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('username');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'coach' | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validateUsername = (value: string): boolean => {
    if (!value.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (value.length > 20) {
      setUsernameError('Username must be less than 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('Username can only contain letters, numbers, hyphens, and underscores');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameSubmit = async () => {
    if (!validateUsername(username) || !user) return;
    
    setLoading(true);
    try {
      // Check if username is already taken
      const usersRef = doc(db, 'users', user.uid);
      
      // Save username to user profile
      await setDoc(usersRef, {
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
        username: username.toLowerCase().trim(),
        createdAt: new Date(),
        onboardingCompleted: false,
        isVerified: false
      });

      // Fade out current step
      setFadeClass('opacity-0');
      
      // Wait for fade out, then switch to role selection
      setTimeout(() => {
        setCurrentStep('role');
        setFadeClass('opacity-100');
      }, 300);
      
    } catch (error) {
      console.error('Error saving username:', error);
      setUsernameError('Error saving username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async () => {
    if (!selectedRole || !user || !username) return;
    
    setLoading(true);
    setCurrentStep('loading');
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Update user document with role
      await setDoc(userRef, {
        role: selectedRole,
        onboardingCompleted: true,
        updatedAt: new Date()
      }, { merge: true });

      // If user selected coach, create a public coach profile
      if (selectedRole === 'coach') {
        const coachRef = doc(db, 'coaches', username.toLowerCase());
        await setDoc(coachRef, {
          userId: user.uid,
          username: username.toLowerCase(),
          displayName: user.displayName || username,
          email: user.email,
          bio: '',
          sports: [],
          experience: 0,
          certifications: [],
          hourlyRate: 0,
          location: '',
          availability: [],
          specialties: [],
          languages: ['English'],
          organization: '',
          role: '',
          gender: '',
          ageGroup: [],
          sourceUrl: '',
          averageRating: 0,
          totalReviews: 0,
          isVerified: false,
          profileImage: '',
          phoneNumber: '',
          website: '',
          socialMedia: {
            instagram: '',
            twitter: '',
            linkedin: ''
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          profileCompleted: false
        });
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating user role:', error);
      // Show error to user
      alert(`Error updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setCurrentStep('role'); // Go back to role selection on error
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  const renderUsernameStep = () => (
    <div className={`transition-opacity duration-300 ${fadeClass}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Choose your username
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This will be your unique identifier on ReviewMyCoach
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) {
                      validateUsername(e.target.value);
                    }
                  }}
                  onBlur={() => validateUsername(username)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                    usernameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400 text-sm">@{username.toLowerCase()}</span>
                </div>
              </div>
              {usernameError && (
                <p className="mt-2 text-sm text-red-600">{usernameError}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                3-20 characters, letters, numbers, hyphens, and underscores only
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleUsernameSubmit}
            disabled={!username.trim() || loading || !!usernameError}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoleStep = () => (
    <div className={`transition-opacity duration-300 ${fadeClass}`}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Welcome, @{username}!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            I am a...
          </p>
          
          <div className="space-y-4">
            {/* Student Option */}
            <div
              onClick={() => setSelectedRole('student')}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                selectedRole === 'student'
                  ? 'border-gray-500 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'student'
                      ? 'border-gray-500 bg-gray-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'student' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Student/Athlete</h4>
                      <p className="text-sm text-gray-500">
                        I want to find and review coaches
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Option */}
            <div
              onClick={() => setSelectedRole('coach')}
              className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                selectedRole === 'coach'
                  ? 'border-gray-500 bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedRole === 'coach'
                      ? 'border-gray-500 bg-gray-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === 'coach' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Coach/Instructor</h4>
                      <p className="text-sm text-gray-500">
                        I want to manage my coaching profile and view reviews
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => {
              setFadeClass('opacity-0');
              setTimeout(() => {
                setCurrentStep('username');
                setFadeClass('opacity-100');
              }, 300);
            }}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoadingStep = () => (
    <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Setting up your account...</h3>
      <p className="text-sm text-gray-600">This will only take a moment</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to ReviewMyCoach!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {currentStep === 'username' && "Let's start by setting up your username"}
          {currentStep === 'role' && "Now, tell us what brings you here"}
          {currentStep === 'loading' && "Setting up your profile..."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === 'username' && renderUsernameStep()}
          {currentStep === 'role' && renderRoleStep()}
          {currentStep === 'loading' && renderLoadingStep()}
        </div>
      </div>
    </div>
  );
} 