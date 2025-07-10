import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const { currentEmail, newEmail, idToken } = await request.json();

    if (!currentEmail || !newEmail || !idToken) {
      return NextResponse.json(
        { error: 'Current email, new email, and authentication token are required' },
        { status: 400 }
      );
    }

    // Verify the user's identity token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Verify current email matches
    const user = await auth.getUser(userId);
    if (user.email !== currentEmail) {
      return NextResponse.json(
        { error: 'Current email does not match' },
        { status: 400 }
      );
    }

    // Update email in Firebase Auth
    await auth.updateUser(userId, {
      email: newEmail,
      emailVerified: false // Reset email verification status
    });

    // Send verification email
    const link = await auth.generateEmailVerificationLink(newEmail);
    
    // Update coach profile in Firestore if it exists
    const coachRef = db.collection('coaches').doc(userId);
    const coachDoc = await coachRef.get();
    
    if (coachDoc.exists) {
      await coachRef.update({
        email: newEmail,
        emailVerified: false,
        updatedAt: new Date()
      });
    }

    return NextResponse.json({
      message: 'Email updated successfully. Please check your new email for verification.',
      verificationLink: link
    });

  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
} 