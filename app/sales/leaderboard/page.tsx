/**
 * Sales Leaderboard Page
 * Shows team rankings by sales performance
 */

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Trophy, TrendingUp, DollarSign } from 'lucide-react';
import { ServerError } from '@/components/ui/ErrorBanner';

export default async function SalesLeaderboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Sales staff, affiliates, and admins can access
  if (session.user.role !== 'staff' && session.user.role !== 'admin' && session.user.role !== 'affiliate') {
    redirect('/');
  }

  if (session.user.role === 'staff') {
    const { data: profile } = await supabaseAdmin
      .from('staff_profiles')
      .select('department')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.department !== 'sales') {
      redirect('/staff/dashboard');
    }
  }

  // Fetch all successful transactions grouped by salesperson
  const errors: string[] = [];
  const { data: transactions, error: txError } = await supabaseAdmin
    .from('sales_transactions')
    .select('salesperson_id, amount, commission_amount, created_at')
    .eq('payment_status', 'succeeded');
  if (txError) errors.push(`Transactions: ${txError.message}`);

  // Get all salespeople (sales department staff + affiliates)
  const { data: salesStaff, error: staffError } = await supabaseAdmin
    .from('staff_profiles')
    .select('user_id, users!staff_profiles_user_id_fkey(id, name, email)')
    .eq('department', 'sales');
  if (staffError) errors.push(`Sales staff: ${staffError.message}`);

  const { data: affiliateUsers, error: affiliateError } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .eq('role', 'affiliate')
    .eq('status', 'active');
  if (affiliateError) errors.push(`Affiliates: ${affiliateError.message}`);

  // Build leaderboard data
  const leaderboardMap = new Map<string, {
    name: string;
    email: string;
    userId: string;
    totalSales: number;
    totalRevenue: number;
    totalCommission: number;
    monthSales: number;
    monthRevenue: number;
  }>();

  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Initialize all salespeople (staff + affiliates)
  salesStaff?.forEach((staff: any) => {
    const user = staff.users;
    if (user) {
      leaderboardMap.set(user.id, {
        name: user.name,
        email: user.email,
        userId: user.id,
        totalSales: 0,
        totalRevenue: 0,
        totalCommission: 0,
        monthSales: 0,
        monthRevenue: 0,
      });
    }
  });

  // Also add affiliates to leaderboard
  affiliateUsers?.forEach((user: any) => {
    if (!leaderboardMap.has(user.id)) {
      leaderboardMap.set(user.id, {
        name: user.name,
        email: user.email,
        userId: user.id,
        totalSales: 0,
        totalRevenue: 0,
        totalCommission: 0,
        monthSales: 0,
        monthRevenue: 0,
      });
    }
  });

  // Aggregate transaction data
  transactions?.forEach((t: any) => {
    const entry = leaderboardMap.get(t.salesperson_id);
    if (entry) {
      entry.totalSales += 1;
      entry.totalRevenue += Number(t.amount);
      entry.totalCommission += Number(t.commission_amount);
      if (new Date(t.created_at) >= thisMonthStart) {
        entry.monthSales += 1;
        entry.monthRevenue += Number(t.amount);
      }
    }
  });

  // Sort by total revenue (descending)
  const leaderboard = Array.from(leaderboardMap.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  const currentUserId = session.user.id;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sales/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Sales Leaderboard
          </h1>
          <p className="text-gray-600 mt-1">See how the team is performing</p>
        </div>

        {errors.length > 0 && (
          <div className="mb-6">
            <ServerError title="Data loading error" message={errors.join(' | ')} />
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {leaderboard.slice(0, 3).map((person, index) => {
              const medals = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-orange-100 border-orange-300'];
              const medalEmoji = ['1st', '2nd', '3rd'];
              return (
                <div
                  key={person.userId}
                  className={`rounded-xl border-2 p-6 text-center ${medals[index]} ${
                    person.userId === currentUserId ? 'ring-2 ring-navy' : ''
                  }`}
                >
                  <div className="text-3xl font-bold text-gray-400 mb-2">{medalEmoji[index]}</div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {person.name}
                    {person.userId === currentUserId && (
                      <span className="text-xs ml-2 text-navy font-normal">(You)</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{person.email}</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      AED {person.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {person.totalSales} sales
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Sales Team Members</h2>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No sales data yet</h3>
              <p className="text-gray-500 mt-1">
                Start selling to appear on the leaderboard!
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Sales</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">This Month</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.map((person, index) => (
                  <tr
                    key={person.userId}
                    className={person.userId === currentUserId ? 'bg-navy/5' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {person.name}
                          {person.userId === currentUserId && (
                            <span className="text-xs ml-2 text-navy">(You)</span>
                          )}
                        </span>
                        <p className="text-sm text-gray-500">{person.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {person.totalSales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      AED {person.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                      AED {person.totalCommission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {person.monthSales} sales / AED {person.monthRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
