import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function StaffDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'staff' && session.user.role !== 'admin') {
    redirect('/');
  }

  const { data: profile } = await supabaseAdmin
    .from('staff_profiles')
    .select('department, employee_id, phone, hire_date')
    .eq('user_id', session.user.id)
    .single();

  if (profile?.department === 'sales') {
    redirect('/sales/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <div className="bg-navy sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/sasa-logo-color.png"
                alt="SASA Worldwide"
                width={120}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                  {(session.user.name || 'S').charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/80 hidden sm:block">
                  {session.user.name}
                </span>
              </div>
              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <LogoutButton className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-500 mt-1">
            Your SASA Worldwide staff portal
          </p>
        </div>

        {/* Staff Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">My Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name</p>
              <p className="font-semibold text-gray-900">{session.user.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-gray-900 text-sm">{session.user.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Department</p>
              <p className="font-semibold text-gray-900 capitalize">{profile?.department || 'Not assigned'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Employee ID</p>
              <p className="font-semibold text-gray-900 font-mono">{profile?.employee_id || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-navy/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-500">View your profile details</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Documents</h3>
                <p className="text-sm text-gray-500">Access company documents</p>
              </div>
            </div>
          </div>

          <a href="mailto:it@sasa-worldwide.com" className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Support</h3>
                <p className="text-sm text-gray-500">it@sasa-worldwide.com</p>
              </div>
            </div>
          </a>

          {session.user.role === 'admin' && (
            <Link href="/admin" className="bg-white rounded-2xl border-2 border-amber-100 p-6 hover:shadow-lg hover:border-amber-300 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                  <p className="text-sm text-gray-500">Manage the system</p>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-navy/5 border border-navy/10 rounded-2xl p-5">
          <p className="text-sm text-gray-600">
            <strong className="text-navy">Need help getting started?</strong> Contact our IT team at{' '}
            <a href="mailto:it@sasa-worldwide.com" className="text-navy underline font-medium">
              it@sasa-worldwide.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
