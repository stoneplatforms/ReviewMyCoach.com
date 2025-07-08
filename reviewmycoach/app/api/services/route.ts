import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../lib/firebase-admin';
import { db } from '../../lib/firebase-admin';
import { createProduct, createPrice } from '../../lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { 
      idToken, 
      title, 
      description, 
      price, 
      duration, 
      category, 
      deliverables,
      maxBookings,
      isRecurring,
      recurringInterval
    } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Authentication token is required' }, { status: 401 });
    }

    // Verify the user's authentication
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (authError) {
      console.error('Auth verification failed:', authError);
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }
    
    const userId = decodedToken.uid;

    // Check if user is a coach
    const coachRef = db.collection('coaches').doc(userId);
    const coachDoc = await coachRef.get();
    
    if (!coachDoc.exists) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Check if coach has a Stripe account
    const stripeAccountRef = db.collection('stripe_accounts').doc(userId);
    const stripeAccountDoc = await stripeAccountRef.get();
    
    if (!stripeAccountDoc.exists) {
      return NextResponse.json({ error: 'Stripe account not found. Please connect your Stripe account first.' }, { status: 400 });
    }

    const stripeAccountData = stripeAccountDoc.data();
    const stripeAccountId = stripeAccountData?.stripeAccountId;

    if (stripeAccountData?.accountStatus !== 'active') {
      return NextResponse.json({ error: 'Stripe account is not active. Please complete your account setup.' }, { status: 400 });
    }

    // Create Stripe product
    const stripeProduct = await createProduct(
      title,
      description,
      stripeAccountId,
      {
        coachId: userId,
        category,
        duration: duration.toString(),
      }
    );

    // Create Stripe price
    const stripePrice = await createPrice(
      stripeProduct.id,
      price * 100, // Convert to cents
      'usd',
      stripeAccountId,
      isRecurring ? { interval: recurringInterval } : undefined
    );

    // Create service document in Firestore
    const serviceRef = db.collection('services').doc();
    await serviceRef.set({
      id: serviceRef.id,
      coachId: userId,
      title,
      description,
      price,
      duration,
      category,
      deliverables: deliverables || [],
      maxBookings: maxBookings || null,
      isRecurring: isRecurring || false,
      recurringInterval: recurringInterval || null,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      isActive: true,
      totalBookings: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update coach profile to indicate they have active services
    await coachRef.update({
      hasActiveServices: true,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      id: serviceRef.id,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
      message: 'Service created successfully',
    });

  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get('coachId');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 items

    let query = db.collection('services').orderBy('createdAt', 'desc');

    if (coachId) {
      query = query.where('coachId', '==', coachId);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    if (isActive !== null) {
      query = query.where('isActive', '==', isActive === 'true');
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    const services = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ services });

  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 