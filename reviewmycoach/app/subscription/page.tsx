'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase-client';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from 'next/link';

interface CoachProfile {
  userId: string;
  displayName: string;
  isCoach?: boolean;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  subscriptionPlan?: 'monthly' | 'yearly';
  subscriptionId?: string;
}

const SUBSCRIPTION_PLANS = {
  monthly: {
    name: 'Coach Pro Monthly',
    price: 29.99,
    priceId: process.env.NEXT_PUBLIC_COACH_PRO_MONTHLY_PRICE_ID || 'price_monthly_default',
    interval: 'month',
    features: [
      'Apply to unlimited job listings',
      'Priority placement in search results',
      'Advanced analytics dashboard',
      'Direct messaging with potential clients',
      'Custom profile themes',
      'Email marketing tools',
      'Calendar integration',
      'Priority customer support'
    ]
  },
  yearly: {
    name: 'Coach Pro Yearly',
    price: 299.99,
    priceId: process.env.NEXT_PUBLIC_COACH_PRO_YEARLY_PRICE_ID || 'price_yearly_default',
    interval: 'year',
    savings: 59.89,
    features: [
      'Apply to unlimited job listings',
      'Priority placement in search results',
      'Advanced analytics dashboard',
      'Direct messaging with potential clients',
      'Custom profile themes',
      'Email marketing tools',
      'Calendar integration',
      'Priority customer support',
      '2 months free (save $59.89)'
    ]
  }
};

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [coachProfile, setCoachProfile] = useState<CoachProfile | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/signin');
      return;
    }

    loadCoachProfile();
  }, [user, authLoading, router]);

  const loadCoachProfile = async () => {
    if (!user) return;

    try {
      const coachRef = doc(db, 'coaches', user.uid);
      const coachDoc = await getDoc(coachRef);
      
      if (coachDoc.exists()) {
        const data = coachDoc.data() as CoachProfile;
        setCoachProfile(data);
      } else {
        // Not a coach, redirect to onboarding
        router.push('/onboarding');
        return;
      }
    } catch (error) {
      console.error('Error loading coach profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user || !coachProfile) return;

    setSubscribing(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: SUBSCRIPTION_PLANS[selectedPlan].priceId,
          userId: user.uid,
          plan: selectedPlan,
          idToken: idToken
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error starting subscription. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!coachProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Coach Profile Required</h1>
          <p className="text-gray-600 mb-6">You need to be a registered coach to access Coach Pro subscriptions.</p>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Coach Onboarding
          </Link>
        </div>
      </div>
    );
  }

  // Check if already subscribed
  const isSubscribed = coachProfile.subscriptionStatus === 'active';

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  ReviewMyCoach
                </Link>
                <span className="text-gray-400">|</span>
                <h1 className="text-xl font-semibold text-gray-900">Coach Pro</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <button
                  onClick={() => router.push('/profile')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              ✓ Coach Pro Active
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're all set with Coach Pro!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Current Plan: {coachProfile.subscriptionPlan === 'yearly' ? 'Yearly' : 'Monthly'}
            </p>
            
            <div className="bg-white rounded-lg shadow p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Pro Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUBSCRIPTION_PLANS.monthly.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => router.push('/profile')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ReviewMyCoach
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">Coach Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <button
                onClick={() => router.push('/profile')}
                className="text-gray-600 hover:text-gray-900"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unlock Your Coaching Potential
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get access to premium features and grow your coaching business with Coach Pro
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Welcome, {coachProfile.displayName}!
          </div>
        </div>

        {/* Plan Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors relative ${
                selectedPlan === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">
                {SUBSCRIPTION_PLANS[selectedPlan].name}
              </h3>
              <div className="text-4xl font-bold mb-2">
                ${SUBSCRIPTION_PLANS[selectedPlan].price}
                <span className="text-lg font-normal">
                  /{selectedPlan === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
              {selectedPlan === 'yearly' && (
                <div className="text-blue-100">
                  Save ${SUBSCRIPTION_PLANS.yearly.savings} annually
                </div>
              )}
            </div>
            
            <div className="px-6 py-8">
              <ul className="space-y-4 mb-8">
                {SUBSCRIPTION_PLANS[selectedPlan].features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Subscribe to Coach Pro ${selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'}`
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Cancel anytime. No long-term commitments.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What's the difference between Coach Pro and regular coaching?
              </h3>
              <p className="text-gray-600">
                Coach Pro gives you access to premium features like unlimited job applications, priority search placement, and advanced analytics to help grow your coaching business.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your Coach Pro subscription at any time. You'll continue to have access to Pro features until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                How is this different from Stripe Connect earnings?
              </h3>
              <p className="text-gray-600">
                Coach Pro is a subscription for enhanced platform features, while Stripe Connect handles your coaching session payments. They're separate systems that work together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 