"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, ArrowLeft, Sparkles, Loader2, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const features = [
  "All 13 Premium Hiring Cards",
  "Complete Role Analysis",
  "Skills & Talent Mapping",
  "Market Intelligence & Benchmarking",
  "Compensation Data & Insights",
  "Interview Strategy & Questions",
  "Sourcing & Outreach Templates",
  "Hiring Funnel Analytics",
  "Reality Check Scoring",
  "Competitive Positioning",
  "Timeline & Planning Tools",
  "Export & Share Capabilities",
  "Lifetime Access & Updates",
];

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'other' | null>(null);
  const { user, markAsPaid, hasPaid } = useAuth();
  const router = useRouter();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth?from=payment');
    }
    // If already paid, redirect to results
    if (user && hasPaid) {
      router.push('/results');
    }
  }, [user, hasPaid, router]);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setLoading(true);
    
    // TODO: Integrate with Stripe
    // This is where you'll add Stripe checkout
    // Example:
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId: user.id })
    // });
    // const session = await response.json();
    // await stripe.redirectToCheckout({ sessionId: session.id });
    
    // For now, simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark user as paid in context (localStorage)
    markAsPaid();
    
    // After successful payment, redirect to results
    router.push('/results?payment=success');
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#278f8c' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Back Button */}
      <Link 
        href="/results"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Results</span>
      </Link>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>One-Time Payment • Lifetime Access</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#102a63' }}>
            Unlock All Premium Cards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant access to all 13 premium hiring cards with actionable insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Method Selection - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#102a63' }}>
                Account Information
              </h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#278f8c' }}>
                  <span className="text-white font-bold text-lg">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#102a63' }}>{user.email}</p>
                  <p className="text-sm text-gray-500">Logged in</p>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#102a63' }}>
                Select Payment Method
              </h3>
              
              <div className="space-y-3">
                {/* Credit Card Option */}
                <button
                  onClick={() => setSelectedPaymentMethod('card')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPaymentMethod === 'card'
                      ? 'border-[#278f8c] bg-[#d7f4f2]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6" style={{ color: '#278f8c' }} />
                      <div>
                        <p className="font-semibold" style={{ color: '#102a63' }}>Credit or Debit Card</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'card'
                        ? 'border-[#278f8c] bg-[#278f8c]'
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'card' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Card Details Form - Show when card is selected */}
                {selectedPaymentMethod === 'card' && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4 border-2 border-[#278f8c]">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Stripe Integration Placeholder</p>
                        <p>This is where Stripe Elements will be embedded for secure card payment processing.</p>
                      </div>
                    </div>
                    
                    {/* Placeholder for Stripe Elements */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: '#102a63' }}>
                          Card Number
                        </label>
                        <div className="p-3 border-2 border-gray-200 rounded-lg bg-white text-gray-400">
                          [Stripe Card Element]
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#102a63' }}>
                            Expiry Date
                          </label>
                          <div className="p-3 border-2 border-gray-200 rounded-lg bg-white text-gray-400">
                            [MM/YY]
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#102a63' }}>
                            CVC
                          </label>
                          <div className="p-3 border-2 border-gray-200 rounded-lg bg-white text-gray-400">
                            [CVV]
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Payment Methods Placeholder */}
                <button
                  onClick={() => setSelectedPaymentMethod('other')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPaymentMethod === 'other'
                      ? 'border-[#278f8c] bg-[#d7f4f2]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6" style={{ color: '#278f8c' }} />
                      <div>
                        <p className="font-semibold" style={{ color: '#102a63' }}>Other Payment Methods</p>
                        <p className="text-sm text-gray-500">Google Pay, Apple Pay (Coming Soon)</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'other'
                        ? 'border-[#278f8c] bg-[#278f8c]'
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'other' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading || !selectedPaymentMethod}
                className="w-full mt-6 py-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#278f8c' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay $49 & Unlock All Cards</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 sticky top-6" style={{ borderColor: '#278f8c' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#102a63' }}>
                Order Summary
              </h3>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold" style={{ color: '#102a63' }}>$49</span>
                  <span className="text-gray-500">one-time</span>
                </div>
                <p className="text-sm text-gray-600">No subscription. Pay once, access forever.</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">What&apos;s Included:</p>
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#278f8c' }} />
                    <span className="text-xs" style={{ color: '#102a63' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold mb-2" style={{ color: '#102a63' }}>
                  <span>Total</span>
                  <span>$49.00</span>
                </div>
                <p className="text-xs text-gray-500">One-time payment, no recurring charges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#102a63' }}>
              🎯 Why Premium?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our AI-powered hiring cards are built by experienced recruiters and hiring managers. 
              Each card contains battle-tested strategies, templates, and insights that would take 
              weeks to compile manually.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#102a63' }}>
              💎 What Makes It Valuable?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Save 40+ hours of research time</li>
              <li>• Hire 3x faster with proven strategies</li>
              <li>• Reduce bad hires by 60%</li>
              <li>• Access expert compensation data</li>
              <li>• Get battle-tested interview guides</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold mb-2" style={{ color: '#102a63' }}>
              🔒 100% Money-Back Guarantee
            </h3>
            <p className="text-sm text-gray-700">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
