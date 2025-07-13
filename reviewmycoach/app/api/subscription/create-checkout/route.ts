import { NextRequest, NextResponse } from 'next/server';
import { getStripeInstance } from '../../../lib/stripe';
import { auth, db, findCoachByUserId } from '../../../lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, plan, idToken } = await request.json();

    // Verify the user is authenticated
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    if (decodedToken.uid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify the user is a coach - query by userId field since coaches are stored by username
    const coachProfile = await findCoachByUserId(userId);
    
    if (!coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    const coachData = coachProfile.data;
    
    // Check if already subscribed
    if (coachData?.subscriptionStatus === 'active') {
      return NextResponse.json({ error: 'Already subscribed to Coach Pro' }, { status: 400 });
    }

    // Create Stripe customer if doesn't exist
    let customerId = coachData?.stripeCustomerId;
    const stripe = getStripeInstance();
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: decodedToken.email,
        metadata: {
          userId: userId,
          type: 'coach_pro_subscription'
        }
      });
      customerId = customer.id;
      
      // Update coach profile with customer ID
      await coachProfile.ref.update({
        stripeCustomerId: customerId
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      metadata: {
        userId: userId,
        plan: plan,
        type: 'coach_pro_subscription'
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan,
          type: 'coach_pro_subscription'
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 