'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function LogoutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut({
        callbackUrl: '/login',
        redirect: true,
      });
    } catch (error) {
      console.error('[SASA Auth] Logout error:', error);
      // Force redirect as fallback
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={className || 'px-4 py-2 text-sm font-medium text-white bg-navy hover:bg-navy/90 rounded-xl disabled:opacity-50'}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
