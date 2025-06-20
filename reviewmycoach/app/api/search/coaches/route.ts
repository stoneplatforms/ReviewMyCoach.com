import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase-client';

interface SearchParams {
  search?: string;
  sport?: string;
  location?: string;
  gender?: string;
  organization?: string;
  minRating?: string;
  maxRate?: string;
  isVerified?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  limit?: string;
}

interface CoachData {
  id: string;
  displayName?: string;
  bio?: string;
  specialties?: string[];
  sports?: string[];
  certifications?: string[];
  location?: string;
  hourlyRate?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse all search parameters
    const params: SearchParams = {
      search: searchParams.get('search') || undefined,
      sport: searchParams.get('sport') || undefined,
      location: searchParams.get('location') || undefined,
      gender: searchParams.get('gender') || undefined,
      organization: searchParams.get('organization') || undefined,
      minRating: searchParams.get('minRating') || undefined,
      maxRate: searchParams.get('maxRate') || undefined,
      isVerified: searchParams.get('isVerified') || undefined,
      sortBy: searchParams.get('sortBy') || 'averageRating',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
    };

    const pageNum = parseInt(params.page || '1', 10);
    const limitNum = parseInt(params.limit || '12', 10);
    
    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Build base query
    const baseQuery = collection(db, 'coaches');
    const queryConstraints: any[] = [];

    // Add filters
    if (params.sport) {
      queryConstraints.push(where('sports', 'array-contains', params.sport));
    }

    if (params.location) {
      queryConstraints.push(where('location', '==', params.location));
    }

    if (params.gender) {
      queryConstraints.push(where('gender', '==', params.gender));
    }

    if (params.organization) {
      queryConstraints.push(where('organization', '==', params.organization));
    }

    if (params.minRating) {
      const minRating = parseFloat(params.minRating);
      if (!isNaN(minRating) && minRating >= 0 && minRating <= 5) {
        queryConstraints.push(where('averageRating', '>=', minRating));
      }
    }

    if (params.isVerified === 'true') {
      queryConstraints.push(where('isVerified', '==', true));
    } else if (params.isVerified === 'false') {
      queryConstraints.push(where('isVerified', '==', false));
    }

    // Add sorting
    const sortField = params.sortBy || 'averageRating';
    const sortDirection = params.sortOrder === 'asc' ? 'asc' : 'desc';
    
    // Validate sort field
    const allowedSortFields = [
      'averageRating', 'totalReviews', 'hourlyRate', 
      'experience', 'displayName', 'createdAt'
    ];
    
    if (allowedSortFields.includes(sortField)) {
      queryConstraints.push(orderBy(sortField, sortDirection));
    } else {
      queryConstraints.push(orderBy('averageRating', 'desc'));
    }

    // Add pagination limit
    queryConstraints.push(limit(limitNum + 1)); // +1 to check if there are more results

    // Execute query
    const finalQuery = query(baseQuery, ...queryConstraints);
    const querySnapshot = await getDocs(finalQuery);

    let coaches: CoachData[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      } as CoachData;
    });

    // Check if there are more results
    const hasMore = coaches.length > limitNum;
    if (hasMore) {
      coaches = coaches.slice(0, limitNum);
    }

    // Apply client-side filters for complex searches
    let filteredCoaches: CoachData[] = coaches;

    // Text search across multiple fields
    if (params.search && params.search.trim()) {
      const searchTerm = params.search.toLowerCase().trim();
      filteredCoaches = coaches.filter(coach => 
        coach.displayName?.toLowerCase().includes(searchTerm) ||
        coach.bio?.toLowerCase().includes(searchTerm) ||
        coach.specialties?.some((s: string) => s.toLowerCase().includes(searchTerm)) ||
        coach.sports?.some((s: string) => s.toLowerCase().includes(searchTerm)) ||
        coach.certifications?.some((c: string) => c.toLowerCase().includes(searchTerm)) ||
        coach.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Max rate filter (client-side since Firestore has query limitations)
    if (params.maxRate) {
      const maxRate = parseFloat(params.maxRate);
      if (!isNaN(maxRate) && maxRate > 0) {
        filteredCoaches = filteredCoaches.filter(coach => 
          coach.hourlyRate && coach.hourlyRate <= maxRate
        );
      }
    }

    // For pagination, we need to simulate offset since Firestore doesn't support it directly
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedCoaches = filteredCoaches.slice(startIndex, endIndex);

    // Calculate total count and pages
    const total = filteredCoaches.length;
    const totalPages = Math.ceil(total / limitNum);

    // Response
    return NextResponse.json({
      coaches: paginatedCoaches,
      total,
      page: pageNum,
      totalPages,
      hasMore: pageNum < totalPages,
      limit: limitNum,
      filters: params,
    });

  } catch (error) {
    console.error('Error searching coaches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 