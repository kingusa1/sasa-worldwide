/**
 * Affiliate Dashboard Page
 * Affiliate users view their KPIs and performance metrics
 * Same KPI structure as sales dashboard but for affiliate role
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { TrendingUp, DollarSign, ShoppingCart, Package, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

function KPICard({ title, value, change, icon, color }: KPICardProps) {
  const trendIcon = change && change > 0
    ? <TrendingUp className="h-4 w-4" />
    : change && change < 0
    ? <TrendingDown className="h-4 w-4" />
    : <Minus className="h-4 w-4" />;

  const trendColor = change && change > 0
    ? 'text-green-600'
    : change && change < 0
    ? 'text-red-600'
    : 'text-gray-400';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default async function AffiliateDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'affiliate' && session.user.role !== 'admin') {
    redirect('/');
  }

  const affiliateId = session.user.id;

  // Fetch dashboard data with graceful fallback
  let transactions: any[] = [];
  let activeProjectCount = 0;

  try {
    const [allTransactions, activeProjects] = await Promise.all([
      supabaseAdmin
        .from('sales_transactions')
        .select('*')
        .eq('salesperson_id', affiliateId)
        .eq('payment_status', 'succeeded'),
      supabaseAdmin
        .from('project_assignments')
        .select('id')
        .eq('salesperson_id', affiliateId)
        .eq('status', 'active'),
    ]);

    transactions = allTransactions.data || [];
    activeProjectCount = activeProjects.data?.length || 0;
  } catch (err) {
    console.warn('[SASA] Affiliate dashboard: DB query failed, using empty data:', err);
  }

  const totalSales = transactions.length;
  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
  const totalCommission = transactions.reduce((sum: number, t: any) => sum + Number(t.commission_amount || 0), 0);

  // This month's data
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonthTransactions = transactions.filter(
    (t: any) => new Date(t.created_at) >= thisMonthStart
  );
  const monthSales = thisMonthTransactions.length;
  const monthRevenue = thisMonthTransactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
  const monthCommission = thisMonthTransactions.reduce((sum: number, t: any) => sum + Number(t.commission_amount || 0), 0);

  // Previous month for comparison
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  const lastMonthTransactions = transactions.filter(
    (t: any) => {
      const date = new Date(t.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }
  );
  const lastMonthSales = lastMonthTransactions.length;

  // Calculate changes
  const salesChange = lastMonthSales > 0
    ? ((monthSales - lastMonthSales) / lastMonthSales) * 100
    : monthSales > 0 ? 100 : 0;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Sales"
            value={totalSales.toString()}
            change={salesChange}
            icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
            color="bg-blue-100"
          />
          <KPICard
            title="Total Revenue"
            value={`AED ${totalRevenue.toFixed(0)}`}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            color="bg-green-100"
          />
          <KPICard
            title="Total Commission"
            value={`AED ${totalCommission.toFixed(0)}`}
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            color="bg-purple-100"
          />
          <KPICard
            title="Active Projects"
            value={activeProjectCount.toString()}
            icon={<Package className="h-6 w-6 text-orange-600" />}
            color="bg-orange-100"
          />
        </div>

        {/* This Month Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">This Month&apos;s Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sales This Month</p>
              <p className="text-2xl font-bold text-gray-900">{monthSales}</p>
              <p className="text-sm text-gray-500">
                {lastMonthSales} last month
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {monthRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Commission This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                AED {monthCommission.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-br from-navy to-navy/80 rounded-2xl shadow-lg p-6 text-white mb-8">
          <h3 className="text-xl font-semibold mb-2">Your Referral ID</h3>
          <p className="text-white/80 mb-4">
            Share your unique affiliate ID with projects you&apos;re assigned to
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-mono break-all">
              {affiliateId}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/crm/customers"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <svg
                className="h-8 w-8 text-navy-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="font-semibold text-gray-900">My Customers</p>
              <p className="text-sm text-gray-600">View customer list</p>
            </Link>
            <a
              href="mailto:it@sasa-worldwide.com"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <svg
                className="h-8 w-8 text-navy-600 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="font-semibold text-gray-900">Contact Support</p>
              <p className="text-sm text-gray-600">it@sasa-worldwide.com</p>
            </a>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
              <svg
                className="h-8 w-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="font-semibold text-gray-900">Leaderboard</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
