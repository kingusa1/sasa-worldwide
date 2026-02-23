'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CoursePurchasePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/training/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const courseFeatures = [
    'Foundation 1: The Law of Averages & Success Factors',
    'Foundation 2: The 5 Steps Blueprint & Sales Mastery',
    'Foundation 3: The 6 Impulse Factors & Psychology',
    'Foundation 4: The 8 Sales Habits & Compound Effect',
    '46 Video Modules with Professional Slides',
    'Lifetime Access to All Content',
    'Affiliate Dashboard & Earning Potential',
    'Progress Tracking & Certificates',
  ];

  return (
    <div className="bg-white">
      <section className="relative py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/training" className="text-white/60 hover:text-white text-sm mb-4 inline-block">
            &larr; Back to Training Academy
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            SASA Sales Foundation Program
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            Master the complete SASA sales methodology
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Course Details */}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-6">What&apos;s Included</h2>
              <div className="space-y-4">
                {courseFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-cream rounded-2xl p-8 border border-navy/10">
                <div className="text-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">One-time Payment</p>
                  <div className="text-5xl font-bold text-navy">AED 1,000</div>
                  <p className="text-gray-500 mt-2">Lifetime access, no recurring fees</p>
                </div>
              </div>
            </div>

            {/* Purchase Form */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg sticky top-8">
                <h3 className="text-xl font-bold text-navy mb-2">Complete Your Purchase</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Fill in your details below. After payment, your account will be created automatically.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-navy text-white font-semibold rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? 'Redirecting to Payment...' : 'Proceed to Payment — AED 1,000'}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Secure payment powered by Stripe. Your card details are never stored on our servers.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
