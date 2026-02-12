/**
 * Sales Section Layout
 * Ensures only sales staff can access this section
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has sales access (admin, sales staff, or affiliates)
  if (session.user.role === 'admin') {
    // Admins have full access
  } else if (session.user.role === 'affiliate') {
    // Affiliates are considered sales - full access
  } else if (session.user.role === 'staff') {
    const { data: profile } = await supabaseAdmin
      .from('staff_profiles')
      .select('department')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.department !== 'sales') {
      redirect('/staff/dashboard');
    }
  } else {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/sales/dashboard" className="text-lg font-bold text-navy-600">
                Sales Portal
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/sales/dashboard"
                  className="text-sm text-gray-700 hover:text-navy-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/sales/my-projects"
                  className="text-sm text-gray-700 hover:text-navy-600 transition-colors"
                >
                  My Projects
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
              <Link
                href={session.user.role === 'admin' ? '/admin' : session.user.role === 'affiliate' ? '/affiliate/dashboard' : '/staff/dashboard'}
                className="text-sm text-navy-600 hover:text-navy-700"
              >
                {session.user.role === 'admin' ? 'Admin' : 'Home'}
              </Link>
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
