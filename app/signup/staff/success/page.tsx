'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function StaffSignupSuccessPage() {
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
          {/* Pending Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
            <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-navy mb-4">
            Registration Submitted!
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Your staff account registration has been submitted successfully.
            An administrator will review your application and notify you once approved.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-navy mb-2">What happens next:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Admin reviews your application (typically within 24-48 hours)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Access granted to your staff dashboard and tools</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You can then log in and start working</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-700 text-left">
                <strong>Need immediate access?</strong> Contact your hiring manager or IT administrator
                to expedite the approval process.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-navy hover:bg-navy/90 transition-all"
            >
              Return to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-navy/30 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Registration issue?{' '}
            <Link href="/contact" className="font-medium text-navy hover:text-navy/80">
              Get help from our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
