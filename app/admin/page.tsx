import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { ServerError } from '@/components/ui/ErrorBanner';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  const errors: string[] = [];

  // Fetch all dashboard statistics in parallel - with error resilience
  let totalUsers = 0, pendingSignups = 0, activeStaff = 0, activeAffiliates = 0;
  let unusedEmployeeIds = 0, recentSignups = 0, totalProjects = 0, activeProjects = 0;
  let totalRevenue = 0, totalSales = 0, vouchersAvailable = 0, vouchersSold = 0, totalCustomers = 0;

  try {
    const [
      usersResult,
      pendingSignupsResult,
      activeStaffResult,
      activeAffiliatesResult,
      unusedEmployeeIdsResult,
      recentSignupsResult,
      projectsResult,
      activeProjectsResult,
      transactionsResult,
      vouchersAvailableResult,
      vouchersSoldResult,
      customersResult,
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
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('sales_transactions').select('amount').eq('payment_status', 'succeeded'),
      supabaseAdmin.from('voucher_codes').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabaseAdmin.from('voucher_codes').select('*', { count: 'exact', head: true }).eq('status', 'sold'),
      supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
    ]);

    if (usersResult.error) errors.push(`Users: ${usersResult.error.message}`);
    if (pendingSignupsResult.error) errors.push(`Signups: ${pendingSignupsResult.error.message}`);
    if (projectsResult.error) errors.push(`Projects: ${projectsResult.error.message}`);
    if (transactionsResult.error) errors.push(`Transactions: ${transactionsResult.error.message}`);
    if (vouchersAvailableResult.error) errors.push(`Vouchers: ${vouchersAvailableResult.error.message}`);
    if (customersResult.error) errors.push(`Customers: ${customersResult.error.message}`);

    totalUsers = usersResult.count || 0;
    pendingSignups = pendingSignupsResult.count || 0;
    activeStaff = activeStaffResult.count || 0;
    activeAffiliates = activeAffiliatesResult.count || 0;
    unusedEmployeeIds = unusedEmployeeIdsResult.count || 0;
    recentSignups = recentSignupsResult.count || 0;
    totalProjects = projectsResult.count || 0;
    activeProjects = activeProjectsResult.count || 0;
    totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    totalSales = transactionsResult.data?.length || 0;
    vouchersAvailable = vouchersAvailableResult.count || 0;
    vouchersSold = vouchersSoldResult.count || 0;
    totalCustomers = customersResult.count || 0;
  } catch (error: any) {
    errors.push(`Dashboard data failed: ${error.message}`);
    console.error('[SASA Admin] Dashboard error:', error);
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0] || 'Admin'}
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with SASA Worldwide today.</p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6">
          <ServerError title={`${errors.length} data loading error(s)`} message={errors.join(' | ')} />
        </div>
      )}

      {/* Sales & Revenue Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Sales & Revenue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link href="/admin/projects" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">AED {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </Link>

          <Link href="/admin/projects" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalSales}</p>
          </Link>

          <Link href="/admin/projects" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Active Projects</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeProjects}<span className="text-sm font-normal text-gray-400 ml-1">/ {totalProjects}</span></p>
          </Link>

          <Link href="/crm/customers" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Customers</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCustomers}</p>
          </Link>
        </div>
      </div>

      {/* Voucher Inventory */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Voucher Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{vouchersAvailable}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Sold</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{vouchersSold}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Vouchers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{vouchersAvailable + vouchersSold}</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users & Team Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Users & Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/admin/users" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/signups" className={`group bg-white rounded-2xl border p-6 hover:shadow-lg transition-all ${pendingSignups > 0 ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100 hover:border-orange-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {pendingSignups}
                  {pendingSignups > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Action needed</span>}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/users?role=staff" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-green-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeStaff}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/users?role=affiliate" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-purple-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Affiliates</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeAffiliates}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/employee-ids" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Unused Employee IDs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{unusedEmployeeIds}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/admin/users" className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{recentSignups}</p>
              </div>
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: '/admin/projects/new', label: 'New Project', icon: 'M12 4v16m8-8H4' },
            { href: '/admin/projects', label: 'Manage Projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
            { href: '/admin/signups', label: 'Review Signups', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { href: '/crm/customers', label: 'View Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { href: '/admin/employee-ids', label: 'Employee IDs', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0' },
            { href: '/admin/users', label: 'Manage Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
            { href: '/sales/dashboard', label: 'Sales Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { href: '/admin/audit-logs', label: 'View Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-navy/30 hover:bg-navy/5 transition-all group">
              <svg className="w-5 h-5 text-navy/60 group-hover:text-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
              </svg>
              <span className="font-medium text-sm text-gray-700 group-hover:text-navy transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
