import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export const metadata = {
  title: 'Search Coaches | ReviewMyCoach',
  description: 'Find the perfect coach for your sport. Search and filter by location, sport, gender, and organization.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 border-b border-orange-500/20 pb-8">
          <div className="h-8 bg-gray-800 animate-pulse mb-4"></div>
          <div className="h-4 bg-gray-800 animate-pulse w-2/3"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="h-14 bg-gray-900 border border-gray-700 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 bg-gray-900 border border-gray-700 p-6">
          <div className="h-6 bg-gray-800 animate-pulse mb-4 w-32"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Results Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 border border-gray-700">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-900 border-r border-b border-gray-700 p-6 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-800"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-800 mb-2"></div>
                  <div className="h-3 bg-gray-800 w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-800"></div>
                <div className="h-3 bg-gray-800 w-5/6"></div>
                <div className="h-3 bg-gray-800 w-4/6"></div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="h-4 bg-gray-800 w-20"></div>
                <div className="h-8 bg-gray-800 w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 