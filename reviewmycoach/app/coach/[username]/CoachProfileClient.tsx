'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../../lib/firebase-client';
import Image from 'next/image';
import { useRealtimeReviews, useRealtimeCoach } from '../../lib/hooks/useRealtimeReviews';
import RealtimeReviewModal from '../../components/RealtimeReviewModal';
import BookingModal from '../../components/BookingModal';
import MessagingModal from '../../components/MessagingModal';

// =====================================
// TYPE DEFINITIONS
// =====================================

interface CoachProfile {
  id: string;
  userId: string;
  displayName: string;
  email?: string;
  bio: string;
  sports: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  location: string;
  availability: string[];
  specialties: string[];
  languages: string[];
  averageRating: number;
  totalReviews: number;
  profileImage?: string;
  phoneNumber?: string;
  website?: string;
  isVerified: boolean;
  organization?: string;
  role?: string;
  gender?: string;
  ageGroup?: string[];
  sourceUrl?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface Review {
  id: string;
  studentId: string;
  studentName: string;
  rating: number;
  reviewText: string;
  createdAt: string | null;
  sport?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  deliverables: string[];
  isActive: boolean;
}

interface Props {
  coach: CoachProfile;
  reviews: Review[];
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function CoachProfileClient({ coach: initialCoach, reviews: initialReviews }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  // Use real-time hooks
  const { 
    reviews: realtimeReviews, 
    ratingStats, 
    loading: reviewsLoading
  } = useRealtimeReviews(initialCoach.id);
  
  const { 
    coach: realtimeCoach
  } = useRealtimeCoach(initialCoach.id);

  // Use real-time data if available, fallback to initial props
  const coach = realtimeCoach || initialCoach;
  const reviews = realtimeReviews.length > 0 ? realtimeReviews : initialReviews;

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch(`/api/services?coachId=${coach.id}&isActive=true`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      // Loading complete
    }
  }, [coach.id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const renderStarRating = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-neutral-300' : 'text-neutral-700'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
        <span className={`ml-2 text-neutral-400 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const handleBookSession = () => {
    // Allow anyone to attempt booking (modal will handle contact info)
    setShowBookingModal(true);
  };

  const handleWriteReview = () => {
    // Allow anyone to write reviews, even if not logged in
    setShowReviewModal(true);
  };

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return 'Unknown date';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-neutral-950 text-neutral-200 min-h-screen">
      {/* Hero Section */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 mb-10 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-neutral-700">
              {coach.profileImage ? (
                <Image
                  src={coach.profileImage}
                  alt={coach.displayName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-16 h-16 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {coach.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Big Rating Score next to profile image */}
          <div className="flex items-end gap-4">
            <div>
              <div className="text-6xl md:text-8xl font-extrabold leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-400">
                {(ratingStats.averageRating || coach.averageRating).toFixed(1)}
              </div>
              <div className="mt-2 text-sm text-neutral-400">Average rating</div>
            </div>
            <button
              onClick={handleWriteReview}
              className="self-center md:self-end rounded-full px-5 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-white transition-colors"
            >
              Write a review
            </button>
          </div>

          {/* Coach Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-neutral-100 tracking-tight">{coach.displayName}</h1>
              {coach.isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                  Verified Coach
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              {renderStarRating(ratingStats.averageRating || coach.averageRating, 'lg')}
              <button
                onClick={handleWriteReview}
                className="px-4 py-1.5 bg-neutral-800 text-neutral-100 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700 text-sm"
              >
                Write a review
              </button>
              <span className="text-neutral-500">({ratingStats.totalReviews || coach.totalReviews})</span>
              {reviewsLoading && (
                <div className="flex items-center text-neutral-400">
                  <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs">Updating...</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-neutral-400 mb-4">
              {coach.role && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {coach.role}
                </div>
              )}
              {coach.organization && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 7h10M7 11h4m6.938 0A2.5 2.5 0 0119 13.5v6.5" />
                  </svg>
                  {coach.organization}
                </div>
              )}
              {coach.email && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${coach.email}`} className="text-neutral-300 hover:text-neutral-100 transition-colors">
                    {coach.email}
                  </a>
                </div>
              )}
              {coach.location && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {coach.location}
                </div>
              )}
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {coach.experience} years experience
              </div>
              {coach.hourlyRate > 0 && (
                <div className="flex items-center font-semibold text-emerald-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  ${coach.hourlyRate}/hour
                </div>
              )}
            </div>

            {/* Sports Tags */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {coach.sports.map((sport: string) => (
                <span
                  key={sport}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-800/80 text-neutral-200 border border-neutral-700 shadow-inner"
                >
                  {sport}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {services.length > 0 && (
                <button
                  onClick={handleBookSession}
                  className="px-6 py-2 bg-neutral-100 text-neutral-900 rounded-full hover:bg-white transition-colors font-semibold"
                >
                  Hire Coach
                </button>
              )}
              {/* Only show Message Coach button if viewing someone else's profile */}
              {user?.uid !== coach.userId && (
                <button
                  onClick={() => setShowMessagingModal(true)}
                  className="px-6 py-2 bg-neutral-800 text-neutral-100 rounded-full hover:bg-neutral-700 transition-colors font-semibold border border-neutral-700"
                >
                  Message Coach
                </button>
              )}
              <button
                onClick={handleWriteReview}
                className="px-6 py-2 bg-neutral-800 text-neutral-100 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700"
              >
                Write Review
              </button>
              {coach.phoneNumber && (
                <a
                  href={`tel:${coach.phoneNumber}`}
                  className="px-6 py-2 bg-neutral-800 text-neutral-100 rounded-full hover:bg-neutral-700 transition-colors border border-neutral-700"
                >
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <h2 className="text-xl font-semibold text-neutral-100 mb-4">About</h2>
            <p className="text-neutral-300 leading-relaxed">
              {coach.bio || "This coach hasn't added a bio yet."}
            </p>
          </div>

          {/* Specialties */}
          {coach.specialties.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty: string) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-800 text-neutral-200 border border-neutral-700"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4 flex items-center">
                <svg className="w-5 h-5 text-neutral-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Available Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="border border-neutral-800 rounded-xl p-4 hover:border-neutral-600 transition-colors bg-neutral-950/40">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-neutral-100">{service.title}</h3>
                      <span className="text-lg font-bold text-neutral-100">${service.price}</span>
                    </div>
                    <p className="text-neutral-400 text-sm mb-3">{service.description}</p>
                    <div className="flex items-center justify-between text-sm text-neutral-400 mb-3">
                      <span>{service.duration} minutes</span>
                      <span className="capitalize">{service.category.replace('-', ' ')}</span>
                    </div>
                    {service.deliverables.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-neutral-300 mb-1">What you get:</h4>
                        <ul className="text-xs text-neutral-400 space-y-0.5">
                          {service.deliverables.slice(0, 3).map((deliverable, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-3 h-3 text-neutral-300 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {deliverable}
                            </li>
                          ))}
                          {service.deliverables.length > 3 && (
                            <li className="text-neutral-500">+{service.deliverables.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={handleBookSession}
                      className="w-full px-4 py-2 bg-neutral-100 text-neutral-900 text-sm rounded-md hover:bg-white transition-colors"
                    >
                      Book This Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {coach.certifications.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
              <h2 className="text-xl font-semibold text-neutral-100 mb-4 flex items-center">
                <svg className="w-5 h-5 text-neutral-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Certifications & Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coach.certifications.map((cert: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                    <svg className="w-5 h-5 text-neutral-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                     </svg>
                    <span className="text-neutral-200 font-medium">{cert}</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Enhanced Reviews Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-neutral-100">
                   Reviews & Ratings
                 </h2>
                 <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-neutral-100">
                     {(ratingStats.averageRating || coach.averageRating).toFixed(1)}
                   </div>
                  <div className="text-sm text-neutral-400">
                     <div>{renderStarRating(ratingStats.averageRating || coach.averageRating, 'sm')}</div>
                     <div>({ratingStats.totalReviews || coach.totalReviews} reviews)</div>
                   </div>
                 </div>
               </div>
              <button
                onClick={handleWriteReview}
                className="text-neutral-200 hover:text-white text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write a review
              </button>
            </div>

                         {/* Rating Distribution */}
             {ratingStats.totalReviews > 0 && (
              <div className="mb-6 p-4 bg-neutral-950/40 rounded-xl border border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-300 mb-3">Rating Distribution</h3>
                 {[5, 4, 3, 2, 1].map(rating => {
                   const count = ratingStats.ratingDistribution[rating] || 0;
                   const percentage = ratingStats.totalReviews > 0 ? (count / ratingStats.totalReviews) * 100 : 0;
                   return (
                     <div key={rating} className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-neutral-400 w-3">{rating}</span>
                      <svg className="w-3 h-3 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                       </svg>
                      <div className="flex-1 bg-neutral-800 rounded-full h-2">
                        <div 
                          className="bg-neutral-300 h-2 rounded-full transition-all duration-300"
                           style={{ width: `${percentage}%` }}
                         ></div>
                       </div>
                      <span className="text-xs text-neutral-500 w-8">{count}</span>
                     </div>
                   );
                 })}
               </div>
             )}

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-neutral-800 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                          <span className="text-neutral-300 font-medium text-sm">
                            {review.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-neutral-100">{review.studentName}</span>
                            {review.sport && (
                              <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-full border border-neutral-700">
                                {review.sport}
                              </span>
                            )}
                          </div>
                          {renderStarRating(review.rating, 'sm')}
                        </div>
                      </div>
                      <span className="text-sm text-neutral-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed pl-13">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-neutral-100 mb-2">No reviews yet</h3>
                <p className="text-neutral-400 mb-4">Be the first to review this coach and help others make informed decisions!</p>
                <button
                  onClick={handleWriteReview}
                  className="inline-flex items-center px-4 py-2 bg-neutral-100 text-neutral-900 rounded-md hover:bg-white transition-colors"
                >
                  Write the first review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <h3 className="text-lg font-semibold text-neutral-100 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Experience:</span>
                <span className="font-medium text-neutral-200">{coach.experience} years</span>
              </div>
              {coach.hourlyRate > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Rate:</span>
                  <span className="font-medium text-neutral-200">${coach.hourlyRate}/hour</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-400">Languages:</span>
                <span className="font-medium text-neutral-200">{coach.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          {coach.availability.length > 0 && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
              <h3 className="text-lg font-semibold text-neutral-100 mb-4">Availability</h3>
              <div className="space-y-2">
                {coach.availability.map((slot: string) => (
                  <div key={slot} className="flex items-center">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mr-2"></div>
                    <span className="text-sm text-neutral-300">{slot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connect section removed per request */}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        coach={{
          id: coach.id,
          displayName: coach.displayName,
          profileImage: coach.profileImage,
        }}
        services={services}
        user={user}
      />

             {/* Real-time Review Modal */}
       <RealtimeReviewModal
         isOpen={showReviewModal}
         onClose={() => setShowReviewModal(false)}
         coachId={coach.id}
         coachName={coach.displayName}
         user={user}
         onReviewSubmitted={() => {
           // The real-time hook will automatically update the reviews
           console.log('Review submitted - real-time updates will handle the rest!');
         }}
       />

       {/* Messaging Modal */}
       <MessagingModal
         isOpen={showMessagingModal}
         onClose={() => setShowMessagingModal(false)}
         recipientId={coach.userId}
         recipientName={coach.displayName}
         user={user}
       />
     </div>
   );
 } 