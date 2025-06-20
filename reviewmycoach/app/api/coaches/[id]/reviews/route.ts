import { NextRequest, NextResponse } from 'next/server';
import { doc, collection, addDoc, getDocs, query, orderBy, limit, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase-client';
import { auth } from '../../../../lib/firebase-admin';

interface ReviewData {
  studentId: string;
  studentName: string;
  rating: number;
  reviewText: string;
  sport?: string;
}

// POST - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: coachId } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { rating, reviewText, sport } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!reviewText || reviewText.length < 10 || reviewText.length > 1000) {
      return NextResponse.json({ error: 'Review text must be between 10 and 1000 characters' }, { status: 400 });
    }

    // Check if user has already reviewed this coach
    const existingReviewsQuery = query(
      collection(db, 'coaches', coachId, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    const existingReviewsSnapshot = await getDocs(existingReviewsQuery);
    const hasReviewed = existingReviewsSnapshot.docs.some(
      doc => doc.data().studentId === userId
    );

    if (hasReviewed) {
      return NextResponse.json({ error: 'You have already reviewed this coach' }, { status: 400 });
    }

    // Get user's display name
    const userDoc = await getDoc(doc(db, 'users', userId));
    const studentName = userDoc.exists() ? userDoc.data().displayName || 'Anonymous' : 'Anonymous';

    // Create the review
    const reviewData: ReviewData & { createdAt: Date } = {
      studentId: userId,
      studentName,
      rating,
      reviewText,
      sport: sport || null,
      createdAt: new Date()
    };

    const reviewRef = await addDoc(
      collection(db, 'coaches', coachId, 'reviews'),
      reviewData
    );

    // Update coach's average rating and review count
    await updateCoachRating(coachId);

    return NextResponse.json({ 
      success: true, 
      reviewId: reviewRef.id,
      message: 'Review created successfully'
    });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Fetch coach reviews
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: coachId } = await params;
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '20';
    const limitNum = parseInt(limitParam, 10);

    const reviewsQuery = query(
      collection(db, 'coaches', coachId, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(limitNum)
    );

    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviews = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || null
    }));

    return NextResponse.json({ reviews });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update coach's average rating
async function updateCoachRating(coachId: string) {
  try {
    const reviewsQuery = query(collection(db, 'coaches', coachId, 'reviews'));
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    if (reviewsSnapshot.empty) return;

    let totalRating = 0;
    let reviewCount = 0;

    reviewsSnapshot.forEach(doc => {
      const data = doc.data();
      totalRating += data.rating;
      reviewCount++;
    });

    const averageRating = totalRating / reviewCount;

    // Update coach document
    await updateDoc(doc(db, 'coaches', coachId), {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviewCount,
      updatedAt: new Date()
    });

  } catch (error) {
    console.error('Error updating coach rating:', error);
  }
} 