'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '../lib/hooks/useDebounce';
import CoachCard from '../components/CoachCard';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';
import GlobalSearchBar from '../components/GlobalSearchBar';

interface Coach {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  sports: string[];
  experience: number;
  certifications: string[];
  hourlyRate: number;
  location: string;
  gender?: string;
  organization?: string;
  availability: string[];
  specialties: string[];
  languages: string[];
  averageRating: number;
  totalReviews: number;
  profileImage?: string;
  isVerified: boolean;
}

interface SearchFilters {
  sport: string;
  location: string;
  gender: string;
  organization: string;
  minRating: string;
  maxRate: string;
  isVerified: string;
  sortBy: string;
  sortOrder: string;
}

interface SearchResponse {
  coaches: Coach[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

const ITEMS_PER_PAGE = 12;

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Search state
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    sport: searchParams?.get('sport') || '',
    location: searchParams?.get('location') || '',
    gender: searchParams?.get('gender') || '',
    organization: searchParams?.get('organization') || '',
    minRating: searchParams?.get('minRating') || '',
    maxRate: searchParams?.get('maxRate') || '',
    isVerified: searchParams?.get('isVerified') || '',
    sortBy: searchParams?.get('sortBy') || 'averageRating',
    sortOrder: searchParams?.get('sortOrder') || 'desc',
  });

  // Results state
  const [results, setResults] = useState<SearchResponse>({
    coaches: [],
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current page
  const currentPage = parseInt(searchParams?.get('page') || '1', 10);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Update URL with current search parameters
  const updateURL = useCallback((newParams: Partial<SearchFilters & { q?: string; page?: number }>) => {
    const params = new URLSearchParams();
    
    // Add search term
    if (newParams.q !== undefined) {
      if (newParams.q.trim()) params.set('q', newParams.q.trim());
    } else if (debouncedSearchTerm.trim()) {
      params.set('q', debouncedSearchTerm.trim());
    }

    // Add filters
    const currentFilters = { ...filters, ...newParams };
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && key !== 'q' && key !== 'page') {
        params.set(key, String(value));
      }
    });

    // Add page
    const page = newParams.page || currentPage;
    if (page > 1) {
      params.set('page', page.toString());
    }

    // Update URL
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newURL);
  }, [filters, debouncedSearchTerm, currentPage, pathname, router]);

  // Fetch search results
  const fetchResults = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      // Add search term
      if (debouncedSearchTerm.trim()) {
        params.set('search', debouncedSearchTerm.trim());
      }

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      // Add pagination
      params.set('page', page.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());

      const response = await fetch(`/api/search/coaches?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data: SearchResponse = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search coaches');
      setResults({ coaches: [], total: 0, page: 1, totalPages: 0, hasMore: false });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL({ ...newFilters, page: 1 });
  };

  // Handle search term change (for future use)
  // const handleSearchChange = (term: string) => {
  //   setSearchTerm(term);
  // };

  // Handle page change
  const handlePageChange = (page: number) => {
    updateURL({ page });
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      sport: '',
      location: '',
      gender: '',
      organization: '',
      minRating: '',
      maxRate: '',
      isVerified: '',
      sortBy: 'averageRating',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    updateURL({ q: '', ...clearedFilters, page: 1 });
  };

  // Effect to fetch results when search parameters change
  useEffect(() => {
    fetchResults(currentPage);
  }, [fetchResults, currentPage]);

  // Effect to update search term from URL
  useEffect(() => {
    const urlSearchTerm = searchParams?.get('q') || '';
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [searchParams, searchTerm]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    Object.values(filters).some(value => 
      value && value !== 'averageRating' && value !== 'desc'
    ) || debouncedSearchTerm.trim()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Coach</h1>
        <p className="text-gray-600">
          Search through our network of verified coaches and find the perfect match for your needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <GlobalSearchBar
          placeholder="Search coaches, sports, or locations..."
          showSuggestions={false}
          className="max-w-2xl"
        />
      </div>

      {/* Filters */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loading ? (
            'Searching...'
          ) : error ? (
            'Error loading results'
          ) : (
            <>
              {results.total > 0 ? (
                <>
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, results.total)} of {results.total} coaches
                  {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
                </>
              ) : hasActiveFilters ? (
                'No coaches found matching your criteria'
              ) : (
                'Search for coaches using the filters above'
              )}
            </>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sortBy"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="averageRating-desc">Highest Rated</option>
            <option value="averageRating-asc">Lowest Rated</option>
            <option value="totalReviews-desc">Most Reviews</option>
            <option value="hourlyRate-asc">Price: Low to High</option>
            <option value="hourlyRate-desc">Price: High to Low</option>
            <option value="experience-desc">Most Experience</option>
            <option value="displayName-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.coaches.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.coaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={results.totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
            totalItems={results.total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && !error && results.coaches.length === 0 && hasActiveFilters && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
          <p className="text-gray-500 mb-4">
            We couldn&apos;t find any coaches matching your search criteria.
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
} 