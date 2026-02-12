'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AffiliateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);

  useEffect(() => {
    console.error('[SASA HIGH] [affiliate]:', error.message);
    if (error.digest) console.error('Digest:', error.digest);

    const isTransient =
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('NEXT_NOT_FOUND') ||
      error.message.includes('Cannot find module') ||
      error.message.includes('Loading chunk');

    if (isTransient && retryCount < 2) {
      setAutoRetrying(true);
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setAutoRetrying(false);
        reset();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, reset, retryCount]);

  if (autoRetrying) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <svg className="w-10 h-10 text-navy animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-gray-600">Recovering... (attempt {retryCount + 1})</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Affiliate Portal Error</h2>
          <p className="text-sm text-gray-600">Something went wrong in the affiliate section.</p>
        </div>

        <details className="mb-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <summary className="px-3 py-2 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-100">
            Error Details
          </summary>
          <div className="px-3 py-2 border-t border-gray-200">
            <p className="text-xs text-red-600 font-mono break-all">{error.message}</p>
            {error.digest && <p className="text-xs text-gray-500 mt-1">ID: {error.digest}</p>}
            <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleString()}</p>
          </div>
        </details>

        <div className="space-y-2">
          <button
            onClick={() => { setRetryCount(0); reset(); }}
            className="w-full px-4 py-2.5 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy/90 transition-colors"
          >
            Try Again
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/affiliate/dashboard"
              className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
            >
              Dashboard
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Full Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
