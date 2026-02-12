'use client';

import { useEffect, useState } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetrying, setAutoRetrying] = useState(false);
  const MAX_AUTO_RETRIES = 3;

  useEffect(() => {
    // Log error
    console.error('[SASA CRITICAL] [global]:', error.message);
    if (error.stack) console.error('Stack:', error.stack);
    if (error.digest) console.error('Digest:', error.digest);

    // Auto-retry for transient errors (webpack cache, module not found, network)
    const isTransient =
      error.message.includes('Cannot find module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('ChunkLoadError') ||
      error.message.includes('React Client Manifest') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('NEXT_NOT_FOUND');

    if (isTransient && retryCount < MAX_AUTO_RETRIES) {
      setAutoRetrying(true);
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setAutoRetrying(false);
        reset();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [error, reset, retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    reset();
  };

  const handleFullReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (autoRetrying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Auto-recovering...</h2>
          <p className="text-sm text-gray-600">
            Detected a temporary issue. Retrying automatically (attempt {retryCount + 1}/{MAX_AUTO_RETRIES})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 text-sm">
            An unexpected error occurred. Our system has logged this issue.
          </p>
        </div>

        {/* Error Details (collapsible) */}
        <details className="mb-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
            Error Details
          </summary>
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Error:</span>
                <p className="text-sm text-red-600 font-mono break-all">{error.message}</p>
              </div>
              {error.digest && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Error ID:</span>
                  <p className="text-sm text-gray-600 font-mono">{error.digest}</p>
                </div>
              )}
              <div>
                <span className="text-xs font-medium text-gray-500">Time:</span>
                <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
              </div>
              {retryCount > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Auto-retries attempted:</span>
                  <p className="text-sm text-gray-600">{retryCount}</p>
                </div>
              )}
            </div>
          </div>
        </details>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full px-4 py-3 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy/90 transition-colors"
          >
            Try Again
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleFullReload}
              className="px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Full Reload
            </button>
            <button
              onClick={handleGoHome}
              className="px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            If this persists, contact IT at{' '}
            <a href="mailto:it@sasa-worldwide.com" className="text-navy underline">
              it@sasa-worldwide.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
