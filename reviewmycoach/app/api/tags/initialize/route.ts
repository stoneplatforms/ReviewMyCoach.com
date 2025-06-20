import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase-client';
import { auth } from '../../../lib/firebase-admin';
import { PREDEFINED_TAGS } from '../route';

// POST - Initialize tags collection with predefined values (admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin access (you might want to add proper admin role checking)
    const decodedToken = await auth.verifyIdToken(token);
    
    const tagsRef = collection(db, 'tags');
    let createdCount = 0;
    let skippedCount = 0;

    // Check if tags already exist to avoid duplicates
    const existingTagsSnapshot = await getDocs(tagsRef);
    const existingTagNames = new Set(
      existingTagsSnapshot.docs.map(doc => doc.data().name.toLowerCase())
    );

    // Initialize sports tags
    for (const sport of PREDEFINED_TAGS.sports) {
      if (!existingTagNames.has(sport.toLowerCase())) {
        await addDoc(tagsRef, {
          name: sport,
          category: 'sport',
          count: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    // Initialize specialty tags
    for (const specialty of PREDEFINED_TAGS.specialties) {
      if (!existingTagNames.has(specialty.toLowerCase())) {
        await addDoc(tagsRef, {
          name: specialty,
          category: 'specialty',
          count: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    // Initialize certification tags
    for (const certification of PREDEFINED_TAGS.certifications) {
      if (!existingTagNames.has(certification.toLowerCase())) {
        await addDoc(tagsRef, {
          name: certification,
          category: 'certification',
          count: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Tags initialization completed. Created: ${createdCount}, Skipped: ${skippedCount}`,
      created: createdCount,
      skipped: skippedCount
    });

  } catch (error) {
    console.error('Error initializing tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 