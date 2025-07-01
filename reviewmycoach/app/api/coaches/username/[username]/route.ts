import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../../lib/firebase-client';

// GET - Fetch coach profile by username
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Query coaches collection by username
    const coachesQuery = query(
      collection(db, 'coaches'),
      where('username', '==', username.toLowerCase()),
      limit(1)
    );
    
    const querySnapshot = await getDocs(coachesQuery);
    
    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 });
    }

    const coachDoc = querySnapshot.docs[0];
    const data = coachDoc.data();
    
    // Serialize timestamps
    const serializedData = {
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
    };

    return NextResponse.json({
      id: coachDoc.id,
      ...serializedData
    });

  } catch (error) {
    console.error('Error fetching coach by username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 