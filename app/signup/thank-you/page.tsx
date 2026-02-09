'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SignupThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image
            src="/images/logo/sasa-logo-color.png"
            alt="SASA Worldwide"
            width={180}
            height={60}
            className="h-12 w-auto"
          />
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow-lg sm:rounded-2xl sm:px-10 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-navy mb-4">
            Welcome to SASA Affiliates!
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Your affiliate account has been created successfully. You can now log in
            to your dashboard and start earning commissions.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-navy mb-2">What you can do now:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Log in to your affiliate dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Get your unique referral link</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start promoting and earning 20% commissions</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Check your email for login credentials and important information about your account.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-navy hover:bg-navy/90 transition-all"
            >
              Login to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-navy/30 transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Questions?{' '}
            <Link href="/contact" className="font-medium text-navy hover:text-navy/80">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
