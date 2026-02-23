/**
 * Affiliate Dashboard Page
 * Affiliate users view their KPIs and performance metrics
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
  hoverColor: string;
}

function KPICard({ title, value, change, icon, color, hoverColor }: KPICardProps) {
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
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all ${hoverColor}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            {trendIcon}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
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

  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonthTransactions = transactions.filter(
    (t: any) => new Date(t.created_at) >= thisMonthStart
  );
  const monthSales = thisMonthTransactions.length;
  const monthRevenue = thisMonthTransactions.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
  const monthCommission = thisMonthTransactions.reduce((sum: number, t: any) => sum + Number(t.commission_amount || 0), 0);

  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  const lastMonthTransactions = transactions.filter(
    (t: any) => {
      const date = new Date(t.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }
  );
  const lastMonthSales = lastMonthTransactions.length;

  const salesChange = lastMonthSales > 0
    ? ((monthSales - lastMonthSales) / lastMonthSales) * 100
    : monthSales > 0 ? 100 : 0;

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s your sales performance overview.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <KPICard
            title="Total Sales"
            value={totalSales.toString()}
            change={salesChange}
            icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
            color="bg-blue-50"
            hoverColor="hover:border-blue-200"
          />
          <KPICard
            title="Total Revenue"
            value={`AED ${totalRevenue.toFixed(0)}`}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            color="bg-green-50"
            hoverColor="hover:border-green-200"
          />
          <KPICard
            title="Total Commission"
            value={`AED ${totalCommission.toFixed(0)}`}
            icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
            color="bg-purple-50"
            hoverColor="hover:border-purple-200"
          />
          <KPICard
            title="Active Projects"
            value={activeProjectCount.toString()}
            icon={<Package className="h-6 w-6 text-orange-600" />}
            color="bg-orange-50"
            hoverColor="hover:border-orange-200"
          />
        </div>

        {/* This Month Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">This Month&apos;s Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Sales This Month</p>
              <p className="text-2xl font-bold text-gray-900">{monthSales}</p>
              <p className="text-sm text-gray-400 mt-1">{lastMonthSales} last month</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Revenue This Month</p>
              <p className="text-2xl font-bold text-gray-900">AED {monthRevenue.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Commission This Month</p>
              <p className="text-2xl font-bold text-gray-900">AED {monthCommission.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-gradient-to-br from-navy via-navy to-navy/80 rounded-2xl p-6 text-white mb-8">
          <h3 className="text-lg font-semibold mb-2">Your Referral ID</h3>
          <p className="text-white/70 mb-4 text-sm">
            Share your unique affiliate ID with projects you&apos;re assigned to
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-mono break-all text-white/90">{affiliateId}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/crm/customers"
              className="group p-5 border border-gray-100 rounded-xl hover:border-navy/30 hover:bg-navy/5 transition-all text-center"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">My Customers</p>
              <p className="text-sm text-gray-500 mt-1">View customer list</p>
            </Link>
            <Link
              href="/staff/training"
              className="group p-5 border border-gray-100 rounded-xl hover:border-navy/30 hover:bg-navy/5 transition-all text-center"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Training</p>
              <p className="text-sm text-gray-500 mt-1">Access your courses</p>
            </Link>
            <a
              href="mailto:it@sasa-worldwide.com"
              className="group p-5 border border-gray-100 rounded-xl hover:border-navy/30 hover:bg-navy/5 transition-all text-center"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-100 transition-colors">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Contact Support</p>
              <p className="text-sm text-gray-500 mt-1">it@sasa-worldwide.com</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
