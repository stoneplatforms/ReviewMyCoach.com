'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, getDoc, limit } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Review {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  reviewText: string;
  createdAt?: { toDate: () => Date };
}

interface Class {
  id: string;
  title: string;
  sport: string;
  participants: number;
  maxParticipants: number;
  schedule: string;
  price: number;
}

interface CoachProfile {
  id: string;
  username?: string;
  displayName: string;
  bio: string;
  sports: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  averageRating: number;
  totalReviews: number;
  profileImage?: string;
  isVerified: boolean;
}

export default function CoachDashboard() {
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchCoachData(user.uid);
      } else {
        router.push('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchCoachData = async (userId: string) => {
    setStatsLoading(true);
    try {
      // Fetch coach profile
      const coachRef = doc(db, 'coaches', userId);
      const coachSnap = await getDoc(coachRef);
      
      if (coachSnap.exists()) {
        setCoachProfile({ id: coachSnap.id, ...coachSnap.data() } as CoachProfile);
      }

      // Fetch recent reviews
      const reviewsRef = collection(db, 'coaches', userId, 'reviews');
      const reviewsQuery = query(
        reviewsRef,
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData: Review[] = [];
      reviewsSnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(reviewsData);

      // Fetch active classes
      const classesRef = collection(db, 'classes');
      const classesQuery = query(
        classesRef,
        where('coachId', '==', userId),
        where('status', '==', 'active')
      );
      const classesSnapshot = await getDocs(classesQuery);
      const classesData: Class[] = [];
      classesSnapshot.forEach((doc) => {
        classesData.push({ id: doc.id, ...doc.data() } as Class);
      });
      setClasses(classesData);

    } catch (error) {
      console.error('Error fetching coach data:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({coachProfile?.totalReviews || 0} reviews)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Generate profile URL using username if available, fallback to UID
  const profileUrl = coachProfile?.username ? `/coach/${coachProfile.username}` : null;
  const fullProfileUrl = profileUrl && typeof window !== 'undefined' ? `${window.location.origin}${profileUrl}` : null;

  const stats = [
    {
      name: 'Average Rating',
      value: coachProfile?.averageRating?.toFixed(1) || '0.0',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      name: 'Total Reviews',
      value: coachProfile?.totalReviews || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Active Classes',
      value: classes.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Hourly Rate',
      value: coachProfile?.hourlyRate ? `$${coachProfile.hourlyRate}` : 'Not set',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Coach Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your coaching profile and track your performance
            </p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Coach
              </span>
              {coachProfile?.isVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Link>
            {profileUrl ? (
              <>
                <Link
                  href={profileUrl}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Public Profile
                </Link>
                <button
                  onClick={() => navigator.clipboard.writeText(fullProfileUrl || '')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Profile Link
                </button>
              </>
            ) : (
              <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-md px-3 py-2">
                Add a username in your profile to get a public profile link
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {coachProfile && !coachProfile.bio && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Complete Your Profile</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your public profile is live but incomplete. Add a bio, sports, and other details to attract more students.</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-3">
                  <Link
                    href="/profile"
                    className="text-sm bg-yellow-100 text-yellow-800 rounded-md px-3 py-2 font-medium hover:bg-yellow-200 transition-colors"
                  >
                    Complete Profile
                  </Link>
                  {profileUrl && (
                    <Link
                      href={profileUrl}
                      className="text-sm text-yellow-700 underline hover:text-yellow-600"
                    >
                      Preview Public Profile →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
            <p className="text-sm text-gray-600 mt-1">
              What students are saying about your coaching
            </p>
          </div>
          <div className="p-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          {renderStarRating(review.rating)}
                        </div>
                        <p className="text-gray-900 mb-2">{review.reviewText}</p>
                        <p className="text-sm text-gray-500">
                          By: {review.studentName}
                        </p>
                        {review.createdAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(review.createdAt.toDate()).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link
                    href="/dashboard/coach/reviews"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View all reviews →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete your profile to start getting reviews from students.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Classes</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your current coaching sessions
            </p>
          </div>
          <div className="p-6">
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : classes.length > 0 ? (
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{classItem.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{classItem.sport}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        {classItem.participants}/{classItem.maxParticipants} participants
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        ${classItem.price}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link
                    href="/dashboard/coach/classes"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Manage all classes →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active classes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first class to start accepting students.
                </p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/coach/classes/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Class
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile URL Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Public Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile URL
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 font-mono break-all">
                  {fullProfileUrl || 'N/A'}
                </code>
                <button
                  onClick={() => {
                    if (fullProfileUrl) {
                      navigator.clipboard.writeText(fullProfileUrl);
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {profileUrl ? (
                <Link
                  href={profileUrl}
                  target="_blank"
                  className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </Link>
              ) : (
                <div className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-500 text-sm rounded-md">
                  Add username to view profile
                </div>
              )}
              <Link
                href="/dashboard/coach/profile/edit"
                className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {coachProfile && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Profile Status:</span>
                  <span className={`font-medium ${
                    coachProfile.bio && coachProfile.sports.length > 0 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }`}>
                    {coachProfile.bio && coachProfile.sports.length > 0 
                      ? 'Complete' 
                      : 'Needs Attention'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services & Payment Setup */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Payments</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/coach/stripe"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900">Payment Setup</h4>
                <p className="text-xs text-gray-500">Connect Stripe to receive payments</p>
              </div>
              <div className="ml-auto">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/dashboard/coach/services"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium text-gray-900">My Services</h4>
                <p className="text-xs text-gray-500">Create and manage services</p>
              </div>
              <div className="ml-auto">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-900 mb-1">Start earning from coaching:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800">
                    <li>Connect Stripe to accept payments</li>
                    <li>Create your coaching services</li>
                    <li>Students book and pay automatically</li>
                    <li>Get paid when you complete sessions</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 