'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);

  useEffect(() => {
    console.error('[SASA HIGH] [auth]:', error.message);

    // Auto-retry once for auth-related transient errors
    const isTransient =
      error.message.includes('React Client Manifest') ||
      error.message.includes('Cannot find module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('CSRF');

    if (isTransient && retryCount < 2) {
      setAutoRetrying(true);
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setAutoRetrying(false);
        reset();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, reset, retryCount]);

  if (autoRetrying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 text-navy animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-gray-600">Loading login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 mb-4">
          <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Login Error</h2>
        <p className="text-sm text-gray-600 mb-6">
          There was a problem loading the login page. This is usually temporary.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy/90 transition-colors"
          >
            Reload Login Page
          </button>
          <Link
            href="/"
            className="block w-full px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        <details className="mt-4 text-left bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <summary className="px-3 py-2 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-100">
            Error Details
          </summary>
          <div className="px-3 py-2 border-t border-gray-200">
            <p className="text-xs text-red-600 font-mono break-all">{error.message}</p>
          </div>
        </details>
      </div>
    </div>
  );
}
