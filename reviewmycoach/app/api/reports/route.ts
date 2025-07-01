import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase-client';
import { auth } from '../../lib/firebase-admin';

// POST - Create a new report
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const { reportedItemType, reportedItemId, reason, description } = await request.json();

    // Validate required fields
    if (!reportedItemType || !reportedItemId || !reason) {
      return NextResponse.json({ 
        error: 'Missing required fields: reportedItemType, reportedItemId, reason' 
      }, { status: 400 });
    }

    // Check if user has already reported this item
    const reportsRef = collection(db, 'reports');
    const existingReportQuery = query(
      reportsRef,
      where('reporterId', '==', decodedToken.uid),
      where('reportedItemId', '==', reportedItemId)
    );
    
    const existingReports = await getDocs(existingReportQuery);
    if (!existingReports.empty) {
      return NextResponse.json({ 
        error: 'You have already reported this item' 
      }, { status: 400 });
    }

    // Create the report
    const reportData = {
      reporterId: decodedToken.uid,
      reportedItemType,
      reportedItemId,
      reason,
      description: description || '',
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await addDoc(reportsRef, reportData);

    return NextResponse.json({ 
      success: true, 
      reportId: docRef.id,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// GET - Fetch reports (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user is admin (you'll need to implement this check)
    // For now, we'll just return the reports
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const reports: any[] = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null
      });
    });

    return NextResponse.json({ reports });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 