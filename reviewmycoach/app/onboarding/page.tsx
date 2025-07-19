'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase-client';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'coach' | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document exists
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userRef, {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          role: selectedRole,
          onboardingCompleted: true,
          isVerified: false
        });
      } else {
        // Update existing document
        await setDoc(userRef, {
          role: selectedRole,
          onboardingCompleted: true,
          updatedAt: new Date()
        }, { merge: true });
      }

      // If user selected coach, create a public coach profile
      if (selectedRole === 'coach') {
        // Get user data to access username
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const username = userData?.username;
        
        if (!username) {
          throw new Error('Username not found for coach profile creation');
        }

        const coachRef = doc(db, 'coaches', user.uid);
        await setDoc(coachRef, {
          userId: user.uid,
          username: username,
          displayName: user.displayName || 'Coach',
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
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to ReviewMyCoach!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let&apos;s get you set up with the right experience
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                I am a...
              </h3>
              
              <div className="space-y-4">
                {/* Student Option */}
                <div
                  onClick={() => setSelectedRole('student')}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedRole === 'student'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'student'
                          ? 'border-blue-500 bg-blue-500'
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
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === 'coach'
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === 'coach' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <div>
              <button
                onClick={handleRoleSelection}
                disabled={!selectedRole || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
} 