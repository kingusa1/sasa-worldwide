/**
 * Affiliate Section Layout
 * Ensures only affiliate users and admins can access
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Only affiliates and admins can access
  if (session.user.role !== 'affiliate' && session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/affiliate/dashboard" className="text-lg font-bold text-navy-600">
                Affiliate Portal
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/affiliate/dashboard"
                  className="text-sm text-gray-700 hover:text-navy-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/crm/customers"
                  className="text-sm text-gray-700 hover:text-navy-600 transition-colors"
                >
                  Customers
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm text-navy-600 hover:text-navy-700"
                >
                  Admin
                </Link>
              )}
              <LogoutButton className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}
    </div>
  );
}
