'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Credentials {
  email: string;
  name: string;
  password: string;
  loginUrl: string;
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-navy mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <PurchaseSuccessContent />
    </Suspense>
  );
}

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCredentials = useCallback(async () => {
    if (!sessionId) {
      setError('Invalid session. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/training/purchase/credentials?session_id=${sessionId}`);

      if (res.status === 202) {
        // Webhook hasn't fired yet, retry
        if (retryCount < 15) {
          setTimeout(() => setRetryCount((prev) => prev + 1), 2000);
          return;
        }
        setError('Your account is being set up. Please check your email for login details shortly.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to retrieve your credentials.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCredentials(data);
      setLoading(false);
    } catch {
      setError('Something went wrong. Please contact support at it@sasa-worldwide.com');
      setLoading(false);
    }
  }, [sessionId, retryCount]);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-navy mb-2">Setting Up Your Account...</h2>
          <p className="text-gray-500">This usually takes a few seconds.</p>
        </div>
      </div>
    );
  }

  if (error && !credentials) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-cream px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Account Setup in Progress</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-navy text-white rounded-xl font-medium hover:bg-navy/90 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">Payment Successful!</h1>
          <p className="text-gray-500">Your account has been created and the course is ready.</p>
        </div>

        {/* Credentials Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg mb-6">
          <h2 className="text-lg font-bold text-navy mb-1">Your Login Credentials</h2>
          <p className="text-sm text-gray-400 mb-6">Save these details — you&apos;ll need them to log in.</p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email</label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-800">{credentials?.email}</span>
                <button
                  onClick={() => copyToClipboard(credentials?.email || '', 'email')}
                  className="text-xs text-navy hover:text-navy/70 font-medium"
                >
                  {copied === 'email' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Temporary Password</label>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-800">{credentials?.password}</span>
                <button
                  onClick={() => copyToClipboard(credentials?.password || '', 'password')}
                  className="text-xs text-navy hover:text-navy/70 font-medium"
                >
                  {copied === 'password' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Please save your credentials and change your password after your first login.
            </p>
          </div>
        </div>

        {/* Login Button */}
        <Link
          href="/login"
          className="block w-full py-4 bg-navy text-white text-center font-semibold rounded-xl hover:bg-navy/90 transition-colors text-lg"
        >
          Login & Start Learning
        </Link>

        <p className="text-center text-sm text-gray-400 mt-4">
          A welcome email with your credentials has also been sent to {credentials?.email}
        </p>
      </div>
    </div>
  );
}
