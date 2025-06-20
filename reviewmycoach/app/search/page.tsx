import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export const metadata = {
  title: 'Search Coaches | ReviewMyCoach',
  description: 'Find the perfect coach for your sport. Search and filter by location, sport, gender, and organization.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Results Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 