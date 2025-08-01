import { NextRequest, NextResponse } from 'next/server';

// Function to get Firebase and Stripe instances
async function getInstances() {
  try {
    const [firebaseAdminModule, stripeModule] = await Promise.all([
      import('../../../lib/firebase-admin'),
      import('../../../lib/stripe')
    ]);
    
    return {
      auth: firebaseAdminModule.auth,
      db: firebaseAdminModule.db,
      findCoachByUserId: firebaseAdminModule.findCoachByUserId,
      createConnectAccount: stripeModule.createConnectAccount,
      createAccountLink: stripeModule.createAccountLink
    };
  } catch (error) {
    console.error('Failed to load modules in stripe connect route:', error);
    return { auth: null, db: null, findCoachByUserId: null, createConnectAccount: null, createAccountLink: null };
  }
}

export async function POST(req: NextRequest) {
  const { auth, db, findCoachByUserId, createConnectAccount, createAccountLink } = await getInstances();
  
  // Early return if modules aren't initialized
  if (!db || !auth || !findCoachByUserId) {
    console.error('Firebase not initialized - cannot create Stripe connection');
    return NextResponse.json({ 
      error: 'Service temporarily unavailable. Please try again later.',
      details: 'Firebase connection not available'
    }, { status: 503 });
  }

  try {
    const { idToken, email, country = 'US' } = await req.json();

    // Verify the user's authentication
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if user is a coach
    const coachProfile = await findCoachByUserId(userId);
    
    if (!coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Check if coach already has a Stripe account
    const existingAccountRef = db.collection('stripe_accounts').doc(userId);
    const existingAccountDoc = await existingAccountRef.get();
    
    if (existingAccountDoc.exists) {
      return NextResponse.json({ error: 'Stripe account already exists' }, { status: 400 });
    }

    // Create Stripe Connect account
    const stripeAccount = await createConnectAccount(email, country);

    // Store the account info in Firestore
    await existingAccountRef.set({
      coachId: userId,
      stripeAccountId: stripeAccount.id,
      accountStatus: 'pending',
      email,
      country,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create account link for onboarding
    const returnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/coach/stripe/return`;
    const refreshUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/coach/stripe/refresh`;
    
    const accountLink = await createAccountLink(stripeAccount.id, returnUrl, refreshUrl);

    return NextResponse.json({
      accountId: stripeAccount.id,
      onboardingUrl: accountLink.url,
    });

  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe Connect account' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { auth, db } = await getInstances();
  
  // Early return if modules aren't initialized
  if (!db || !auth) {
    console.error('Firebase not initialized - cannot fetch Stripe account');
    return NextResponse.json({ 
      error: 'Service temporarily unavailable. Please try again later.',
      details: 'Firebase connection not available'
    }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const idToken = searchParams.get('idToken');

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
    }

    // Verify the user's authentication
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get the coach's Stripe account info
    const accountRef = db.collection('stripe_accounts').doc(userId);
    const accountDoc = await accountRef.get();

    if (!accountDoc.exists) {
      return NextResponse.json({ error: 'Stripe account not found' }, { status: 404 });
    }

    const accountData = accountDoc.data();
    return NextResponse.json({
      accountId: accountData?.stripeAccountId,
      status: accountData?.accountStatus,
      email: accountData?.email,
      country: accountData?.country,
      createdAt: accountData?.createdAt,
      updatedAt: accountData?.updatedAt,
    });

  } catch (error) {
    console.error('Error fetching Stripe Connect account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe Connect account' },
      { status: 500 }
    );
  }
} 