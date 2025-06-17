import { Suspense } from 'react';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase-client';
import { notFound } from 'next/navigation';
import CoachProfileClient from './CoachProfileClient';

interface CoachProfile {
  id: string;
  userId: string;
  displayName: string;
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

async function getCoachProfile(id: string): Promise<CoachProfile | null> {
  try {
    const coachRef = doc(db, 'coaches', id);
    const coachSnap = await getDoc(coachRef);
    
    if (coachSnap.exists()) {
      const data = coachSnap.data();
      // Convert Firestore timestamps to plain objects
      const serializedData = {
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      };
      return { id: coachSnap.id, ...serializedData } as unknown as CoachProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    return null;
  }
}

async function getCoachReviews(coachId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'coaches', coachId, 'reviews');
    const reviewsQuery = query(
      reviewsRef,
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    const reviews: Review[] = [];
    reviewsSnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
      } as unknown as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching coach reviews:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const coach = await getCoachProfile(params.id);
  
  if (!coach) {
    return {
      title: 'Coach Not Found | ReviewMyCoach',
    };
  }

  return {
    title: `${coach.displayName} - Coach Profile | ReviewMyCoach`,
    description: coach.bio || `${coach.displayName} - Professional coach specializing in ${coach.sports.join(', ')}`,
    openGraph: {
      title: `${coach.displayName} - Coach Profile`,
      description: coach.bio || `Professional coach specializing in ${coach.sports.join(', ')}`,
      type: 'profile',
    },
  };
}

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CoachProfilePage({ params }: { params: { id: string } }) {
  const [coach, reviews] = await Promise.all([
    getCoachProfile(params.id),
    getCoachReviews(params.id)
  ]);

  if (!coach) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CoachProfileClient coach={coach} reviews={reviews} />
    </Suspense>
  );
} 