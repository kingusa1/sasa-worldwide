import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // Fetch dashboard statistics
  const [
    { count: totalUsers },
    { count: pendingSignups },
    { count: activeStaff },
    { count: activeAffiliates },
    { count: unusedEmployeeIds },
    { count: recentSignups },
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('signup_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'staff').eq('status', 'active'),
    supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('role', 'affiliate').eq('status', 'active'),
    supabaseAdmin.from('employee_ids').select('*', { count: 'exact', head: true }).eq('status', 'unused'),
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const stats = [
    {
      name: 'Total Users',
      value: totalUsers || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      name: 'Pending Approvals',
      value: pendingSignups || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-orange-500',
      link: '/admin/signups',
      urgent: (pendingSignups || 0) > 0,
    },
    {
      name: 'Active Staff',
      value: activeStaff || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-green-500',
      link: '/admin/users?role=staff',
    },
    {
      name: 'Active Affiliates',
      value: activeAffiliates || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-purple-500',
      link: '/admin/users?role=affiliate',
    },
    {
      name: 'Unused Employee IDs',
      value: unusedEmployeeIds || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
        </svg>
      ),
      color: 'bg-indigo-500',
      link: '/admin/employee-ids',
    },
    {
      name: 'New This Week',
      value: recentSignups || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-teal-500',
      link: '/admin/users',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your SASA Worldwide system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.link}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
              stat.urgent ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                  {stat.urgent && (
                    <span className="ml-2 text-sm text-orange-600 font-normal">Action needed</span>
                  )}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/employee-ids"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-colors"
          >
            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium text-gray-900">Create Employee ID</span>
          </Link>
          <Link
            href="/admin/signups"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-colors"
          >
            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-900">Review Signups</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-colors"
          >
            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium text-gray-900">Manage Users</span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-colors"
          >
            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-gray-900">View Logs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
